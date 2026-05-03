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
http://localhost:3000/auth/callback
http://127.0.0.1:3000/auth/callback
```

El login usa `supabase.auth.signInWithOAuth({ provider: "google" })`, vuelve por `/auth/callback`, crea el perfil si no existe y redirige a `/dashboard`.

Para que el callback reciba `?code=...` en lugar de tokens en el hash de la URL, el cliente Supabase usa OAuth PKCE (`flowType: "pkce"`). Si ves una URL con `#access_token=...`, revisa que el redirect exacto esté en Supabase:

```text
https://decision-engine-opal.vercel.app/auth/callback
```
