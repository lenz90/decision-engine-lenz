"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "../lib/supabase/client";

export default function LoginCard({ authError, supabaseConfig }) {
  const [error, setError] = useState(authError);
  const [isLoading, setIsLoading] = useState(false);

  async function signInWithGoogle() {
    setError("");

    if (!supabaseConfig?.url || !supabaseConfig?.anonKey) {
      setError("Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.");
      return;
    }

    setIsLoading(true);

    const supabase = createSupabaseBrowserClient(
      supabaseConfig.url,
      supabaseConfig.anonKey,
    );
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          prompt: "select_account",
        },
      },
    });

    if (signInError) {
      setError(signInError.message);
      setIsLoading(false);
    }
  }

  return (
    <aside className="auth-login" aria-label="Acceso a Decision Engine">
      <div>
        <p className="eyebrow">Acceso seguro</p>
        <h2>Inicia sesion</h2>
        <p className="auth-login__subtitle">
          Usa Google OAuth con Supabase para entrar a Decision Engine.
        </p>
      </div>

      {error ? <p className="form-error">{error}</p> : null}

      <button
        className="gmail-button"
        type="button"
        onClick={signInWithGoogle}
        disabled={isLoading}
      >
        <span className="google-mark" aria-hidden="true">
          G
        </span>
        {isLoading ? "Conectando..." : "Continuar con Google"}
      </button>

      <p className="login-note">
        Requiere una cuenta Gmail. Supabase gestiona la sesion y el proveedor
        OAuth.
      </p>
    </aside>
  );
}
