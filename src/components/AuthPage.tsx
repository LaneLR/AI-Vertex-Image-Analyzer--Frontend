"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, Chrome } from "lucide-react";
import InfoModal from "./InfoModal";
import Loading from "./Loading";
import Image from "next/image";
import logo from "../../public/images/flipsavvy-icon.png";
import { getApiUrl } from "@/lib/api-config";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useGoogleLogin } from "@react-oauth/google";

export default function UnifiedAuthPage() {
  // Replace useSession with your custom context logic
  const { user, isLoading, setUser } = useApp();

  const [view, setView] = useState<"login" | "register" | "verify" | "forgot">(
    "login",
  );
  const [sourceView, setSourceView] = useState<"register" | "forgot" | null>(
    null,
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
  });
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, isLoading, router]);

  const openModal = (title: string, message: string) => {
    setModalConfig({ isOpen: true, title, message });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(getApiUrl("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        setUser(data.user);
        router.push("/dashboard");
      } else {
        setError(data.error || "Invalid credentials");
        // if (data.error?.includes("verify")) setView("verify");
      }
    } catch (err) {
      setError("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (googleResponse: any) => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl("/api/auth/google"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: googleResponse.credential }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        if (setUser) setUser(data.user);
        router.push("/dashboard");
      } else {
        setError(data.error || "Google login failed");
      }
    } catch (err) {
      setError("Error connecting to Google auth");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError("");
      try {
        // We send the access_token (or id_token) to our Express backend
        const res = await fetch(getApiUrl("/api/auth/google"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_token: tokenResponse.access_token,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          localStorage.setItem("token", data.token);
          if (setUser) setUser(data.user);
          router.push("/dashboard");
        } else {
          setError(data.error || "Google authentication failed");
        }
      } catch (err) {
        setError("Failed to connect to authentication server");
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError("Google Login Failed"),
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) return setError("You must agree to the Terms.");
    setLoading(true);
    try {
      const res = await fetch(getApiUrl("/api/auth/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        setSourceView("register");
        setView("verify");
      } else {
        const data = await res.json();
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(getApiUrl("/api/reset-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, action: "request" }),
      });
      if (res.ok) {
        setSourceView("forgot"); // SET SOURCE
        setView("verify");
      } else {
        const data = await res.json();
        setError(data.error || "Email not found.");
      }
    } catch (err) {
      setError("Failed to send reset code.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const isResetPath = sourceView === "forgot";

    try {
      const res = await fetch(getApiUrl("/api/verify-otp"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
          type: isResetPath ? "reset" : "verify",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        if (isResetPath) {
          setShowResetModal(true);
        } else {
          // Auto-login after verification
          localStorage.setItem("token", data.token);
          if (setUser) setUser(data.user);
          router.push("/dashboard");
        }
      } else {
        setError(data.error || "Invalid code.");
      }
    } catch (err) {
      setError("Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword){
      setShowResetModal(false);
      return setError("Passwords do not match");
    }

    setLoading(true);

    try {
      const res = await fetch(getApiUrl("/api/reset-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword, action: "reset" }),
      });
      if (res.ok) {
        setShowResetModal(false);
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
        setSourceView(null);
        openModal(
          "Password updated",
          "You password has been updated. You can now log in.",
        );
        setView("login");
      } else {
        const data = await res.json();
        setError(data.error || "Update failed.");
      }
    } catch (err) {
      setError("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const getSubmitHandler = () => {
    if (view === "login") return handleLogin;
    if (view === "register") return handleRegister;
    if (view === "forgot") return handleForgotPasswordRequest;
    return handleVerify;
  };

  if (isLoading) {
    return (
      <div className="loading-state">
        <Loading />
      </div>
    );
  }

  return (
    <main className="auth-page">
      <div className="auth-container">
        <header className="auth-header">
          <Image width={125} height={125} alt="Logo" src={logo} priority />
          <h1 className="auth-title">
            {view === "login" && "Welcome Back"}
            {view === "register" && "Join & Start Thrifting"}
            {view === "verify" && "Enter Code"}
            {view === "forgot" && "Find Account"}
          </h1>
        </header>

        {error && <div className="auth-error-pill">{error}</div>}

        <form
          className="auth-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (view === "login") handleLogin(e);
            else if (view === "register") handleRegister(e);
            else if (view === "forgot") handleForgotPasswordRequest(e);
            else handleVerify(e);
          }}
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
            <div className="underlined-btn-container">
              <button
                type="button"
                className="forgot-btn"
                onClick={() => {
                  setView("forgot");
                  setError("");
                }}
              >
                <div className="underline-container">
                  Forgot password?
                  <div className="underline" />
                </div>
              </button>
            </div>
          )}

          {view === "verify" && (
            <div className="otp-container">
              <p
                style={{
                  fontSize: "14px",
                  marginBottom: "10px",
                  color: "#666",
                }}
              >
                Enter the 6-digit code sent to your email.
              </p>
              <input
                className="otp-input"
                type="text"
                placeholder="000000"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                autoFocus
              />
            </div>
          )}

          {view === "register" && (
            <div className="terms-checkbox-wrapper">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="custom-checkbox"
              />
              <label htmlFor="terms" className="terms-label">
                I agree to the{" "}
                <Link
                  href="/terms"
                  target="_blank"
                  className="terms-link letter-spacing-textlink"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  target="_blank"
                  className="terms-link letter-spacing-textlink"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>
          )}

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading || (view === "register" && !agreedToTerms)}
          >
            {loading ? "Processing..." : "Continue"}
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
                onClick={() => handleGoogleAuth()}
                disabled={loading}
              >
                <Chrome size={18} />
                Continue with Google
              </button>
            </>
          )}
        </form>

        <footer className="auth-footer">
          <button
            className="letter-spacing-textlink"
            onClick={() => {
              setView(view === "login" ? "register" : "login");
              setError("");
              setSourceView(null);
            }}
          >
            <div className="underline-container">
              {view === "login" ? "Create an account" : "Back to login"}
              <div className="underline" />
            </div>
          </button>
        </footer>
      </div>

      <InfoModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset Password"
      >
        <form onSubmit={handleFinalReset} className="auth-form">
          <div className="input-wrapper">
            <Lock className="input-icon" size={18} />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-wrapper">
            <Lock className="input-icon" size={18} />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading
              ? "Processing..."
              : view === "register"
                ? "Create account"
                : "Continue"}
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
                onClick={() => handleGoogleAuth()}
                disabled={loading}
              >
                <Chrome size={18} />
                Continue with Google
              </button>
            </>
          )}
          <br />
        </form>
      </InfoModal>

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
