import { useState } from "react";
import { loginWithGoogle } from "../../services/authService";

export default function Login() {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = () => {
    setLoading(true);
    loginWithGoogle(); // redirects to the backend, which redirects to Google
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 bg-base-bg">
      <div className="w-full max-w-sm">
        {/* brand mark */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="h-8 w-8 rounded-md bg-black flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="font-display font-semibold text-lg tracking-tight">SupportAI</span>
        </div>

        <div className="panel p-8">
          <h1 className="font-display text-xl font-semibold tracking-tight text-center">
            Sign in
          </h1>
          <p className="text-text-muted text-sm mt-1.5 text-center">
            Continue with Google to access your workspace.
          </p>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="mt-7 w-full flex items-center justify-center gap-3 rounded-md border border-base-border bg-black text-white py-2.5 text-sm font-medium hover:opacity-85 transition-opacity disabled:opacity-50"
          >
            <GoogleIcon />
            {loading ? "Redirecting…" : "Continue with Google"}
          </button>
        </div>

        <p className="text-center text-xs text-text-faint mt-6">
          By continuing you agree to SupportAI's Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.85.87-3.04.87-2.34 0-4.32-1.58-5.03-3.71H.96v2.33A9 9 0 0 0 9 18z"/>
      <path fill="#FBBC05" d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.01-2.33z"/>
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"/>
    </svg>
  );
}
