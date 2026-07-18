import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// CORS: restringí esto a tu dominio de Netlify en producción
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN || "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

export const handler = async (event) => {
  // Lambda Function URL manda el método en event.requestContext.http.method
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

    console.log("--- Request ---", JSON.stringify(body, null, 2));

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

    const systemPrompt = `Eres una experta mentora y evaluadora del programa AWS Community Builders, con un enfoque especial en apoyar a mujeres y minorías subrepresentadas en el ecosistema cloud de AWS. 
Tu misión es revisar las respuestas al borrador de postulación de una candidata y brindarle una retroalimentación extremadamente motivadora, detallada y útil en ESPAÑOL.

Analiza:
1. El track seleccionado de AWS (${track || "No especificado"}) y de qué manera sus respuestas y enlaces se alinean con ese track.
2. Los enlaces de contenido provistos:
${formattedLinks}
3. Su descripción sobre contribuciones: "${contributionsDescription || "No provista"}"
   - ¿Muestra impacto real (métricas, personas alcanzadas, regularidad)?
   - ¿Es claro que explica cómo ayudó a otros a aprender?
4. Su motivación: "${motivationDescription || "No provista"}"
   - ¿Es genuina? ¿Muestra entender los beneficios del programa y cómo planea colaborar de forma recíproca?

Reglas de oro para tu respuesta:
- Sé sumamente empática y positiva. Queremos que se sienta inspirada y empoderada.
- No uses tecnicismos exagerados, sé clara y habla en un formato directo y constructivo en español.
- En las propuestas de redacción pulidas ('polishedContributions' y 'polishedMotivation'), vuelve a escribir sus borradores con una estructura impactante, destacando palabras clave de AWS, manteniendo la honestidad y usándolo en primera persona ("Yo..."). No inventes logros que ella no haya mencionado, solo destaca y profesionaliza lo que ya tiene.

DEBES responder ÚNICAMENTE con un objeto JSON válido con la siguiente estructura exacta (no agregues formato markdown como \`\`\`json):
{
  "score": 8, // (un número entero del 1 al 10 indicando qué tan robusto y listo está el borrador para postular)
  "nailed": ["aspecto fuerte 1", "aspecto fuerte 2"], // (lista de aspectos fuertes que la candidata ya abordó excelente)
  "improvements": ["mejora 1", "mejora 2"], // (lista de oportunidades prácticas y detalladas para fortalecer o agregar información)
  "polishedContributions": "...", // (versión mejorada, fluida y profesional de su borrador de Contribuciones en primera persona)
  "polishedMotivation": "...", // (versión mejorada, fluida y profesional de su borrador de Motivación en primera persona)
  "encouragement": "..." // (mensaje lleno de aliento y motivación empoderadora dedicado a la candidata)
}`;

    const prompt = `Por favor, revisa mi postulación para el programa AWS Community Builders.

Track seleccionado: ${track || "No especificado"}
Enlaces de contenido incluidos: 
${formattedLinks}

Borrador de Contribuciones:
"${contributionsDescription || ""}"

Borrador de Motivación:
"${motivationDescription || ""}"

Proporciona la revisión detallada en el esquema JSON solicitado.`;

    let response;
    let lastError;
    const maxRetries = 4;
    const delayMs = 1500;

    // --- PASO 1: Análisis real del contenido de los links con urlContext ---
    let linksAnalysis = "No se pudo analizar el contenido de los links.";
    if (Array.isArray(links) && links.length > 0) {
      try {
        const urlAnalysisPrompt = `Analiza el contenido real de los siguientes links (artículos, repos de GitHub, videos, etc.) relacionados a una postulación de AWS Community Builders:
${formattedLinks}

Para cada link, resumí: de qué trata, qué nivel técnico demuestra, y si evidencia contribución real a la comunidad (no solo un README vacío o un post genérico).`;

        const urlAnalysisResponse = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: urlAnalysisPrompt,
          config: {
            tools: [{ urlContext: {} }], // Gemini va y lee el contenido real de cada URL
          },
        });

        if (urlAnalysisResponse.text) {
          linksAnalysis = urlAnalysisResponse.text;
        }
      } catch (error) {
        console.warn("No se pudo analizar los links con urlContext:", error.message || error);
      }
    }

    // --- PASO 2: Generación del JSON estructurado, ahora con el análisis real como contexto ---
    const promptConAnalisis = `${prompt}

Análisis real del contenido de los links (obtenido leyendo cada URL):
${linksAnalysis}

Usá este análisis para evaluar con más precisión el impacto real de sus contribuciones, en vez de basarte solo en el texto de la URL.`;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: promptConAnalisis,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: "application/json",
            // Sin "tools" acá: JSON mode y tools no son compatibles en la misma llamada
          },
        });
        break;
      } catch (error) {
        lastError = error;
        console.warn(`Intento ${attempt} de Gemini falló con: ${error.message || error}. Reintentando en ${delayMs}ms...`);
        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }
    }

    if (!response) {
      throw new Error(`Gemini falló después de ${maxRetries} intentos. Último error: ${lastError?.message || lastError}`);
    }

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No se pudo obtener una respuesta válida del modelo de IA.");
    }

    const parsedResult = JSON.parse(resultText);

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(parsedResult),
    };
  } catch (error) {
    console.error("Error en la revisión de Gemini:", error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: "Ocurrió un error al procesar la revisión de tu postulación. Por favor intenta de nuevo.",
        details: error.message,
      }),
    };
  }
};
