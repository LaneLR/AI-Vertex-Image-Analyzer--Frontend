"use client";

import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, Chrome } from "lucide-react";
import InfoModal from "./InfoModal";
import Loading from "./Loading";
import Image from "next/image";
import logo from "../../public/images/FlipFinderLogo.png";

export default function UnifiedAuthPage() {
  const { data: session, status } = useSession();
  const [view, setView] = useState<"login" | "register" | "verify" | "forgot">(
    "login"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  useEffect(() => {
    if (status === "authenticated" && window.location.pathname === "/login") {
      router.replace("/");
    }
  }, [status, router]);

  const openModal = (title: string, message: string) => {
    setModalConfig({ isOpen: true, title, message });
  };

  if (status === "loading") return <Loading />;
  if (status === "authenticated") return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res?.error) {
      setError(res.error);
      setLoading(false);
      if (res.error.includes("verify")) setView("verify");
    } else {
      window.location.href = "/";
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) setView("verify");
      else setError(data.error || "Registration failed");
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-container">
        <header className="auth-header">
          <div >
            <Image
              width={125}
              height={125}
              alt="FlipFinder Logo"
              src={logo}
              priority
            />
          </div>
          <h1 className="auth-title">
            {view === "login" && "Welcome Back"}
            {view === "register" && "Join the Hunt"}
            {view === "verify" && "Verify Email"}
            {view === "forgot" && "Reset Password"}
          </h1>
          <p className="auth-subtitle">
            {view === "login" &&
              "Enter your details to log in to your account."}
            {view === "register" &&
              "Start valuing your finds with artificial intelligence."}
          </p>
        </header>

        {error && <div className="auth-error-pill">{error}</div>}

        <form
          className="auth-form"
          onSubmit={
            view === "login"
              ? handleLogin
              : view === "register"
              ? handleRegister
              : handleRegister
          }
        >
          {view !== "verify" && (
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}

          {(view === "login" || view === "register") && (
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          )}

          {view === "login" && (
            <button
              type="button"
              className="forgot-btn"
              onClick={() => setView("forgot")}
            >
              Forgot password?
            </button>
          )}

          {view === "verify" && (
            <div className="otp-container">
              <p>
                Sent to <strong>{email}</strong>
              </p>
              <input
                className="otp-input"
                type="text"
                placeholder="000000"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
          )}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading
              ? "Processing..."
              : view === "login"
              ? "Login"
              : view === "register"
              ? "Create Account"
              : "Verify"}
            {!loading && <ArrowRight size={18} />}
          </button>

          {(view === "login" || view === "register") && (
            <>
              <div className="auth-divider">
                <span>OR</span>
              </div>
              <button
                type="button"
                className="google-auth-btn"
                onClick={() => signIn("google", { callbackUrl: "/" })}
              >
                <Chrome size={18} />
                Continue with Google
              </button>
            </>
          )}
        </form>

        <footer className="auth-footer">
          {view === "forgot" ? (
            <button onClick={() => setView("login")}>Back to Login</button>
          ) : (
            view !== "verify" && (
              <p>
                {view === "login" ? "New here?" : "Already have an account?"}
                <button
                  onClick={() =>
                    setView(view === "login" ? "register" : "login")
                  }
                >
                  {view === "login" ? "Create an account" : "Log in"}
                </button>
              </p>
            )
          )}
        </footer>
      </div>

      <InfoModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        title={modalConfig.title}
      >
        <p className="modal-text">{modalConfig.message}</p>
      </InfoModal>
    </main>
  );
}
