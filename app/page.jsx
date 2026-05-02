import Image from "next/image";
import LoginCard from "../components/LoginCard";

const phases = [
  "Contexto",
  "Opciones",
  "Criterios",
  "Accion",
];

const authErrors = {
  missing_config: "Faltan las credenciales OAuth de Google en el entorno.",
  invalid_state: "No se pudo validar la solicitud de Google. Intentalo de nuevo.",
  oauth_denied: "Google no autorizo el acceso.",
  token_error: "No se pudo completar el intercambio OAuth con Google.",
  profile_error: "No se pudo leer el perfil de Google.",
  gmail_required: "Ingresa con una cuenta que termine en @gmail.com.",
};

export default async function LandingPage({ searchParams }) {
  const params = await searchParams;
  const authError = authErrors[params?.auth] ?? "";

  return (
    <main className="auth-page">
      <section className="auth-card" aria-label="Decision Engine login">
        <div className="auth-visual">
          <a className="brand" href="/">
            <span className="brand__mark">DE</span>
            <span>Decision Engine</span>
          </a>

          <div className="auth-visual__copy">
            <p className="eyebrow">Decision making app</p>
            <h1>Decide con estructura.</h1>
            <p>
              Un espacio privado para convertir decisiones complejas en una
              siguiente accion clara.
            </p>
          </div>

          <div className="auth-visual__image" aria-hidden="true">
            <Image
              src="/decision-engine-hero.png"
              alt=""
              fill
              priority
              sizes="(max-width: 900px) 100vw, 520px"
            />
          </div>

          <div className="decision-steps" aria-label="Flujo de decision">
            {phases.map((phase, index) => (
              <span key={phase}>
                <strong>{String(index + 1).padStart(2, "0")}</strong>
                {phase}
              </span>
            ))}
          </div>
        </div>

        <LoginCard authError={authError} />
      </section>
    </main>
  );
}
