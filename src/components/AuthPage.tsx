"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function UnifiedAuthPage() {
  const [view, setView] = useState<"login" | "register" | "verify" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle standard credentials login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/");
    }
  };

  // Handle Google OAuth
  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ email, password, firstName }),
    });

    if (res.ok) {
      setView("verify");
    } else {
      const data = await res.json();
      setError(data.error || "Registration failed");
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/verify", {
      method: "POST",
      body: JSON.stringify({ email, code: otp }),
    });

    if (res.ok) {
      await signIn("credentials", {
        email,
        password,
        callbackUrl: "/",
      });
    } else {
      setError("Invalid verification code");
    }
  };

  return (
    <main className="auth">
      <div className="auth__card">
        <h1 className="auth__title">
          {view === "login" && "Welcome Back"}
          {view === "register" && "Create Account"}
          {view === "verify" && "Check Your Email"}
          {view === "forgot" && "Reset Password"}
        </h1>

        {error && <p className="auth__error">{error}</p>}

        <form 
          className="auth__form" 
          onSubmit={
            view === "login" ? handleLogin : 
            view === "register" ? handleRegister : handleVerify
          }
        >
          {view !== "verify" && (
             <input 
               type="email" 
               placeholder="Email Address" 
               value={email} 
               onChange={(e) => setEmail(e.target.value)} 
               required 
             />
          )}

          {view === "register" && (
            <input 
              type="text" 
              placeholder="First Name" 
              value={firstName} 
              onChange={(e) => setFirstName(e.target.value)} 
            />
          )}

          {(view === "login" || view === "register") && (
            <div className="auth__password-container">
              <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              {view === "login" && (
                <button 
                  type="button" 
                  className="auth__forgot-link"
                  onClick={() => setView("forgot")}
                >
                  Forgot password?
                </button>
              )}
            </div>
          )}

          {view === "verify" && (
            <div className="auth__otp-group">
              <p>Enter the 6-digit code sent to {email}</p>
              <input 
                type="text" 
                placeholder="000000" 
                maxLength={6} 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
              />
            </div>
          )}

          {view === "forgot" ? (
            <button type="button" className="auth__submit-btn" onClick={() => alert("Check your email for reset instructions")}>
              Send Reset Link
            </button>
          ) : (
            <button type="submit" className="auth__submit-btn" disabled={loading}>
              {loading ? "Loading..." : view === "login" ? "Login" : view === "register" ? "Sign Up" : "Verify Code"}
            </button>
          )}

          {/* Google Sign In - Only show on Login/Register views */}
          {(view === "login" || view === "register") && (
            <>
              <div className="auth__divider">
                <span>OR</span>
              </div>
              <button 
                type="button" 
                className="auth__google-btn" 
                onClick={handleGoogleSignIn}
              >
                <img src="images/GoogleLogo.png" alt="" width="20" height="20" />
                Sign in with Google
              </button>
            </>
          )}
        </form>

        <div className="auth__switch-container">
          {view === "forgot" ? (
            <button className="auth__switch-btn" onClick={() => setView("login")}>
              Back to Login
            </button>
          ) : view !== "verify" && (
            <p className="auth__switch">
              {view === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button 
                className="auth__switch-btn" 
                onClick={() => setView(view === "login" ? "register" : "login")}
              >
                {view === "login" ? "Register" : "Login"}
              </button>
            </p>
          )}
        </div>
      </div>
    </main>
  );
}