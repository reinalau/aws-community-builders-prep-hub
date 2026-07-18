# Deploy con AWS SAM

Estructura esperada (`template.yaml` vive dentro de `aws-lambda/`, separado del frontend):
```
aws-lambda/
├── template.yaml
├── review/
│   ├── index.mjs
│   └── package.json
```

## 1. Instalar dependencias del código de la función

```bash
cd aws-lambda/review
npm install
cd ..
```

Todos los comandos siguientes (`sam build`, `sam deploy`) se ejecutan parado en `aws-lambda/` (donde está el `template.yaml`), no en la raíz del repo del frontend.

## 2. Build

```bash
sam build
```

## 3. Deploy (primera vez, guiado)

```bash
sam deploy --guided
```

Te va a pedir:
- **Stack Name**: por ej. `aws-community-builders-review`
- **AWS Region**: la que uses
- **Parameter GeminiApiKey**: tu API key de Gemini (no se hardcodea en el yaml)
- **Parameter AllowedOrigin**: tu dominio de Netlify (default ya viene precargado)
- Confirmar creación de recursos IAM (`y`)

Esto guarda un `samconfig.toml` para que los próximos deploys sean solo `sam deploy`.

## 4. Obtener la URL de la función

Al terminar el deploy, SAM imprime los `Outputs`, incluyendo `ReviewFunctionUrl`. También podés verlo después con:

```bash
aws cloudformation describe-stacks \
  --stack-name aws-community-builders-review \
  --query "Stacks[0].Outputs"
```

Esa URL es la que va como `LAMBDA_REVIEW_URL` en las variables de entorno de Netlify.

## Qué crea este template

- **`ReviewFunctionRole`**: rol de ejecución dedicado, con permisos *solo* para crear/escribir en su propio log group de CloudWatch (nada de S3, DynamoDB, etc. — mínimo privilegio).
- **`ReviewFunctionLogGroup`**: log group creado de antemano con `RetentionInDays: 1`, para que desde el primer log ya tenga la retención correcta (si dejás que Lambda lo cree solo, por defecto queda "Never expire").
- **`ReviewFunction`**: la Lambda en sí, con Function URL público y CORS restringido a `AllowedOrigin`.
