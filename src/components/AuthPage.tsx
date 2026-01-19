"use client";

import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, Chrome } from "lucide-react";
import InfoModal from "./InfoModal";
import Loading from "./Loading";
import Image from "next/image";
import logo from "../../public/images/flipsavvy-icon.png";
import { getApiUrl } from "@/lib/api-config";
import Link from "next/link";

export default function UnifiedAuthPage() {
  const { status } = useSession();
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
    if (status === "authenticated" && window.location.pathname === "/login") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  const openModal = (title: string, message: string) => {
    setModalConfig({ isOpen: true, title, message });
  };

  if (status === "loading") return <Loading />;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      setError("You must agree to the Terms and Privacy Policy.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(getApiUrl("/api/auth/register"), {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setSourceView("register");
        setView("verify");
      } else {
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
      const res = await fetch(getApiUrl("/api/auth/reset-password"), {
        method: "POST",
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

    // FIX: Use sourceView instead of checking !password
    const isResetPath = sourceView === "forgot";

    try {
      const res = await fetch(getApiUrl("/api/verify"), {
        method: "POST",
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
          // Attempt login for new registrations
          const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
          });
          if (result?.error) {
            setError("Account verified! Please log in.");
            setView("login");
          } else {
            router.push("/dashboard");
          }
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
    if (newPassword !== confirmPassword)
      return setError("Passwords do not match");

    setLoading(true);
    try {
      const res = await fetch(getApiUrl("/api/auth/reset-password"), {
        method: "POST",
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
    if (view === "login")
      return (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        signIn("credentials", { email, password, redirect: false }).then(
          (res) => {
            if (res?.error) {
              setError(res.error);
              setLoading(false);
              if (res.error.includes("verify")) setView("verify");
            } else {
              router.push("/dashboard");
              router.refresh();
            }
          },
        );
      };
    if (view === "register") return handleRegister;
    if (view === "forgot") return handleForgotPasswordRequest;
    return handleVerify;
  };

  return (
    <main className="auth-page">
      <div className="auth-container">
        <header className="auth-header">
          <Image width={125} height={125} alt="Logo" src={logo} priority />
          <h1 className="auth-title">
            {view === "login" && "Welcome Back"}
            {view === "register" && "Join & Start Flipping"}
            {view === "verify" && "Enter Code"}
            {view === "forgot" && "Find Account"}
          </h1>
        </header>

        {error && <div className="auth-error-pill">{error}</div>}

        <form className="auth-form" onSubmit={getSubmitHandler()}>
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
              onClick={() => {
                setView("forgot");
                setError("");
              }}
            >
              Forgot password?
            </button>
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
                <Link href="/terms" target="_blank" className="terms-link">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" target="_blank" className="terms-link">
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
            {loading
              ? "Processing..."
              : view === "forgot"
                ? "Send reset code"
                : view === "verify"
                  ? "Verify code"
                  : view === "register"
                    ? "Create account"
                    : "Log in"}
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
          <button
            onClick={() => {
              setView(view === "login" ? "register" : "login");
              setError("");
              setSourceView(null);
            }}
          >
            {view === "login" ? "Create an account" : "Back to login"}
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
            {loading ? "Updating..." : "Update Password"}
          </button>
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
