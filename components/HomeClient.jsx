"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

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

export default function HomeClient({ supabaseConfig }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = useMemo(() => {
    if (!supabaseConfig?.url || !supabaseConfig?.anonKey) {
      return null;
    }

    return createClient(supabaseConfig.url, supabaseConfig.anonKey);
  }, [supabaseConfig]);

  useEffect(() => {
    if (!supabase) {
      router.replace("/?auth=missing_config");
      return;
    }

    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) {
        return;
      }

      if (!data.session) {
        router.replace("/");
        return;
      }

      setUser(data.session.user);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace("/");
        return;
      }

      setUser(session.user);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  async function handleLogout() {
    if (supabase) {
      await supabase.auth.signOut();
    }

    router.replace("/");
  }

  if (isLoading || !user) {
    return (
      <main className="app-loading">
        <span>Preparando Decision Engine...</span>
      </main>
    );
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
          <button type="button" onClick={handleLogout}>
            Salir
          </button>
        </div>
      </header>

      <section className="workspace">
        <div className="workspace__intro">
          <p className="eyebrow">Pagina inicial</p>
          <h1>Hola, {user.user_metadata?.name || user.email}. Empecemos una decision.</h1>
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
