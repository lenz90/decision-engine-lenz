import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/");
  }

  return (
    <main className="home-shell">
      <header className="home-header">
        <a className="brand brand--dark" href="/dashboard">
          <span className="brand__mark">DE</span>
          <span>Decision Engine</span>
        </a>
      </header>

      <section className="workspace">
        <div className="workspace__intro">
          <p className="eyebrow">Dashboard</p>
          <h1>Estoy dentro.</h1>
          <p>
            Sesion activa para {data.user.email}. Desde aqui puedes continuar
            con el flujo principal de Decision Engine.
          </p>
        </div>
      </section>
    </main>
  );
}
