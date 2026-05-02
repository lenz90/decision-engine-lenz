# Decision Engine

Landing y app inicial en Next.js para una herramienta de toma de decisiones en hasta cuatro fases usando un enfoque tipo LangChain pattern.

## Ejecutar en local

```bash
npm install
npm run dev
```

La landing vive en `/` y la pagina inicial protegida en `/home`.

## Login con Supabase y Google OAuth

Duplica `.env.example` como `.env.local` y completa:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

En Supabase habilita Google como proveedor de autenticacion. En la allow list de redirect URLs agrega:

```text
http://localhost:3000/home
http://127.0.0.1:3000/home
```

El login usa `supabase.auth.signInWithOAuth({ provider: "google" })` y Supabase gestiona la sesion del usuario.
