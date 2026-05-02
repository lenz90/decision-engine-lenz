export default function LoginCard({ authError }) {
  return (
    <aside className="auth-login" aria-label="Acceso a Decision Engine">
      <div>
        <p className="eyebrow">Acceso seguro</p>
        <h2>Inicia sesion</h2>
        <p className="auth-login__subtitle">
          Usa Google OAuth para entrar a Decision Engine.
        </p>
      </div>

      {authError ? <p className="form-error">{authError}</p> : null}

      <a className="gmail-button" href="/api/auth/google">
        <span className="google-mark" aria-hidden="true">
          G
        </span>
        Continuar con Google
      </a>

      <p className="login-note">
        Requiere una cuenta Gmail. La sesion se guarda en una cookie httpOnly.
      </p>
    </aside>
  );
}
