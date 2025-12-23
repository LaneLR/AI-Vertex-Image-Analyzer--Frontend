"use client";

import React, { useState } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginClient() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      // Success! Redirect to home/dashboard
      router.push("/");
      router.refresh(); // Refresh server components to detect new cookie
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth">
      <div className="auth__container">
        <header className="auth__header">
          <h1 className="auth__title">
            {isLogin ? "Welcome Back" : "Start Flipping"}
          </h1>
          <p className="auth__subtitle">
            {isLogin
              ? "Log in to access your appraisal history."
              : "Create an account to track your thrift finds."}
          </p>
        </header>

        {error && <p className="auth__error-message" style={{color: '#ff4d4d', fontSize: '14px', marginBottom: '1rem', textAlign: 'center'}}>{error}</p>}

        <form className="auth__form" onSubmit={handleSubmit}>
          <div className="auth__field">
            <label className="auth__label">Email Address</label>
            <div className="auth__input-wrapper">
              <Mail className="auth__input-icon" />
              <input
                type="email"
                placeholder="hunter@thrift.com"
                className="auth__input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth__field">
            <label className="auth__label">Password</label>
            <div className="auth__input-wrapper">
              <Lock className="auth__input-icon" />
              <input
                type="password"
                placeholder="••••••••"
                className="auth__input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="auth__submit" disabled={loading}>
            {loading ? "PROCESSING..." : isLogin ? "LOG IN" : "CREATE ACCOUNT"}
            <ArrowRight className="auth__submit-icon" />
          </button>
        </form>

        <div className="auth__divider">
          <span className="auth__divider-text">
            {isLogin ? "DON'T HAVE AN ACCOUNT?" : "ALREADY HAVE AN ACCOUNT?"}
          </span>
        </div>

        <footer className="auth__footer">
          <div className="auth__form">
            <p className="auth__toggle-text">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
                className="auth__social-btn"
              >
                {isLogin ? "SIGN UP FREE" : "LOG IN"}
              </button>
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}