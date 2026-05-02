# Decision Engine

Landing y app inicial en Next.js para una herramienta de toma de decisiones en hasta cuatro fases usando un enfoque tipo LangChain pattern.

## Ejecutar en local

```bash
npm install
npm run dev
```

La landing vive en `/` y la pagina inicial protegida en `/home`.

## Login con Google OAuth

Duplica `.env.example` como `.env.local` y completa:

```bash
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_APP_URL=http://127.0.0.1:3000
AUTH_SECRET=replace-with-a-long-random-secret
```

En Google Cloud Console configura este redirect URI:

```text
http://127.0.0.1:3000/api/auth/google/callback
```

El login usa OAuth de Google, exige un correo `@gmail.com` y guarda la sesion en una cookie httpOnly firmada.
