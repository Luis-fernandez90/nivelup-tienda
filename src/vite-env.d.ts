/// <reference types="vite/client" />

// Clase 7 (variables de entorno): esto le dice a TypeScript qué variables
// existen adentro de `import.meta.env`. Sin esto, `import.meta.env.VITE_API_URL`
// sería de tipo `any` y TS no avisaría si nos equivocamos de nombre.
interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
