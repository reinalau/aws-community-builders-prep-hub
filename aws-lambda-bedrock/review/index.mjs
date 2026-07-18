import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: process.env.AWS_REGION || "us-east-1" });
const BEDROCK_MODEL_ID = process.env.BEDROCK_MODEL_ID || "global.amazon.nova-2-lite-v1:0";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN || "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

/**
 * Intenta leer información clave de una URL provista (metadatos, títulos o README de GitHub).
 */
async function fetchUrlMetadata(url) {
  try {
    const parsedUrl = new URL(url);

    // Si es un repositorio de GitHub, intentamos buscar el README de forma directa
    const githubRegex = /github\.com\/([^/]+)\/([^/]+)/;
    const githubMatch = url.match(githubRegex);
    if (githubMatch) {
      const owner = githubMatch[1];
      const repo = githubMatch[2].replace(/\.git$/, "");

      // Intentamos con la rama 'main' y luego 'master'
      for (const branch of ["main", "master"]) {
        try {
          const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`;
          const res = await fetch(rawUrl, { signal: AbortSignal.timeout(3000) });
          if (res.ok) {
            const text = await res.text();
            return `README de GitHub (${owner}/${repo}):\n${text.substring(0, 1500)}`;
          }
        } catch (e) {
          // Ignorar error de red y continuar al siguiente intento
        }
      }
    }

    // Petición HTTP estándar para cualquier otra URL
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      signal: AbortSignal.timeout(4000)
    });

    if (!response.ok) {
      return `Error al acceder a la URL: Estado HTTP ${response.status}`;
    }

    const html = await response.text();

    // Extracción básica del tag <title>
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : "";

    // Extracción del tag meta description
    const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
    const description = descMatch ? descMatch[1].trim() : "";

    // Extracción y limpieza del texto visible del body
    let bodyText = "";
    const bodyMatch = html.match(/<body[^>]*>([\s\S]+)<\/body>/i);
    if (bodyMatch) {
      const bodyHtml = bodyMatch[1];
      const cleanBody = bodyHtml
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "") // quitar scripts
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")   // quitar estilos
        .replace(/<[^>]+>/g, " ")                         // quitar tags HTML
        .replace(/\s+/g, " ")                             // colapsar espacios en blanco
        .trim();
      bodyText = cleanBody.substring(0, 1200);
    } else {
      bodyText = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().substring(0, 1200);
    }

    return `Título: ${title}\nDescripción: ${description}\nContenido parcial del sitio:\n${bodyText}`;
  } catch (err) {
    return `No se pudo leer el contenido de la URL de forma remota. (Detalle: ${err.message || err})`;
  }
}

/**
 * Limpia y parsea de forma robusta la respuesta de texto JSON del modelo.
 */
function parseJSONResponse(text) {
  let cleanText = text.trim();

  // Remover bloques de código markdown como ```json o ``` si el modelo los incluyó
  if (cleanText.startsWith("```json")) {
    cleanText = cleanText.substring(7);
  } else if (cleanText.startsWith("```")) {
    cleanText = cleanText.substring(3);
  }

  if (cleanText.endsWith("```")) {
    cleanText = cleanText.substring(0, cleanText.length - 3);
  }

  return JSON.parse(cleanText.trim());
}

export const handler = async (event) => {
  const method = event.requestContext?.http?.method || event.httpMethod;

  if (method === "OPTIONS") {
    return { statusCode: 204, headers: CORS_HEADERS, body: "" };
  }

  if (method !== "POST") {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Método no permitido" }),
    };
  }

  try {
    const body = event.body
      ? JSON.parse(event.isBase64Encoded ? Buffer.from(event.body, "base64").toString("utf-8") : event.body)
      : {};

    const { track, contributionsDescription, motivationDescription, links } = body;

    console.log("--- Request Received ---", JSON.stringify(body, null, 2));

    if (!contributionsDescription && !motivationDescription) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          error: "Por favor, escribe al menos una de las respuestas para iniciar la revisión.",
        }),
      };
    }

    const formattedLinks = Array.isArray(links)
      ? links.map((l) => `- URL: ${l.url || "No provista"} (Tipo: ${l.type || "No especificado"})`).join("\n")
      : "Ninguno provisto";

    // --- PASO 1: Analizar el contenido real de los links en paralelo ---
    let linksAnalysis = "No se proveyeron links para analizar o no pudieron ser leídos.";

    if (Array.isArray(links) && links.length > 0) {
      try {
        console.log(`Iniciando análisis de ${links.length} links...`);
        const analysisPromises = links.map(async (l) => {
          if (!l.url) return `- Link sin URL provista`;
          const details = await fetchUrlMetadata(l.url);
          return `- URL: ${l.url}\n  [Tipo: ${l.type || "No especificado"}]\n  ${details}`;
        });

        const results = await Promise.allSettled(analysisPromises);
        const compiledDetails = results
          .map((r, idx) => r.status === "fulfilled" ? r.value : `- URL: ${links[idx].url} (Fallo al analizar: ${r.reason})`)
          .join("\n\n---\n\n");

        linksAnalysis = `Resultados del scraping de URLs:\n\n${compiledDetails}`;
      } catch (err) {
        console.warn("Fallo general durante el scraping de links:", err);
        linksAnalysis = `Error durante el scraping: ${err.message || err}`;
      }
    }

    // --- PASO 2: Invocar a Amazon Bedrock con Nova Lite ---
    const systemPrompt = `Eres una experta mentora y evaluadora del programa AWS Community Builders, con un enfoque especial en apoyar a mujeres y minorías subrepresentadas en el ecosistema cloud de AWS. 
Tu misión es revisar las respuestas al borrador de postulación de una candidata y brindarle una retroalimentación extremadamente motivadora, detallada y útil en ESPAÑOL.

Analiza:
1. El track seleccionado de AWS (${track || "No especificado"}) y de qué manera sus respuestas y enlaces se alinean con ese track.
2. Los enlaces de contenido provistos (analiza el contenido leído de cada enlace y valida si es un aporte de calidad y no un repo vacío).
3. Su descripción sobre contribuciones: "${contributionsDescription || "No provista"}"
   - ¿Muestra impacto real (métricas, personas alcanzadas, regularidad)?
   - ¿Es claro que explica cómo ayudó a otros a aprender?
4. Su motivación: "${motivationDescription || "No provista"}"
   - ¿Es genuina? ¿Muestra entender los beneficios del programa y cómo planea colaborar de forma recíproca?

Reglas de oro para tu respuesta:
- Sé sumamente empática y positiva. Queremos que se sienta inspirada y empoderada.
- No uses tecnicismos exagerados, sé clara y habla en un formato directo y constructivo en español.
- En las propuestas de redacción pulidas ('polishedContributions' y 'polishedMotivation'), vuelve a escribir sus borradores con una estructura impactante, destacando palabras clave de AWS, manteniendo la honestidad y usándolo en primera persona ("Yo..."). No inventes logros que ella no haya mencionado, solo destaca y profesionaliza lo que ya tiene.

DEBES responder ÚNICAMENTE con un objeto JSON válido con la siguiente estructura exacta (no agregues texto fuera del JSON, ni bloques de código markdown como \`\`\`json):
{
  "score": 8,
  "nailed": ["aspecto fuerte 1", "aspecto fuerte 2"],
  "improvements": ["mejora 1", "mejora 2"],
  "polishedContributions": "...",
  "polishedMotivation": "...",
  "encouragement": "..."
}`;

    const promptConAnalisis = `Por favor, revisa mi postulación para el programa AWS Community Builders.

Track seleccionado: ${track || "No especificado"}
Enlaces de contenido incluidos: 
${formattedLinks}

Borrador de Contribuciones:
"${contributionsDescription || ""}"

Borrador de Motivación:
"${motivationDescription || ""}"

-------------------------
ANÁLISIS DE CONTENIDO REAL DE LOS LINKS PROVISTOS:
${linksAnalysis}
-------------------------

Usa toda la información anterior para evaluar el impacto real y responder en el formato JSON estructurado solicitado.`;

    console.log("Invocando a Amazon Bedrock con modelo:", BEDROCK_MODEL_ID);

    const command = new ConverseCommand({
      modelId: BEDROCK_MODEL_ID,
      messages: [
        {
          role: "user",
          content: [{ text: promptConAnalisis }],
        },
      ],
      system: [
        { text: systemPrompt },
      ],
      inferenceConfig: {
        maxTokens: 3000,
        temperature: 0.7,
      },
    });

    const response = await client.send(command);
    const resultText = response.output?.message?.content?.[0]?.text;

    if (!resultText) {
      throw new Error("No se obtuvo respuesta del modelo de Amazon Bedrock.");
    }

    console.log("Respuesta del modelo Bedrock recibida.");
    const parsedResult = parseJSONResponse(resultText);

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(parsedResult),
    };

  } catch (error) {
    console.error("Error en el backend de Bedrock Lambda:", error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: "Ocurrió un error al procesar la revisión de tu postulación con Bedrock. Por favor intenta de nuevo.",
        details: error.message,
      }),
    };
  }
};
