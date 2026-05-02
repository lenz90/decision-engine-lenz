import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { readSessionCookie, SESSION_COOKIE } from "../../lib/session";

const decisionPhases = [
  {
    title: "Contexto",
    detail: "Define el problema, las restricciones y el objetivo real.",
  },
  {
    title: "Opciones",
    detail: "Genera alternativas comparables sin perder trazabilidad.",
  },
  {
    title: "Evaluacion",
    detail: "Contrasta criterios, riesgos, impactos y trade-offs.",
  },
  {
    title: "Decision",
    detail: "Resume la recomendacion y convierte la salida en accion.",
  },
];

export default async function HomePage() {
  const cookieStore = await cookies();
  const user = readSessionCookie(cookieStore.get(SESSION_COOKIE)?.value);

  if (!user) {
    redirect("/");
  }

  return (
    <main className="home-shell">
      <header className="home-header">
        <a className="brand brand--dark" href="/home">
          <span className="brand__mark">DE</span>
          <span>Decision Engine</span>
        </a>

        <div className="user-menu">
          <span>{user.email}</span>
          <form action="/api/auth/logout" method="post">
            <button type="submit">Salir</button>
          </form>
        </div>
      </header>

      <section className="workspace">
        <div className="workspace__intro">
          <p className="eyebrow">Pagina inicial</p>
          <h1>Hola, {user.name}. Empecemos una decision.</h1>
          <p>
            Este es el punto de entrada de la app despues de validar Gmail. La
            siguiente capa natural es conectar aqui el flujo real con LangChain.
          </p>
        </div>

        <div className="decision-board">
          {decisionPhases.map((phase, index) => (
            <article className="phase-card" key={phase.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h2>{phase.title}</h2>
              <p>{phase.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
