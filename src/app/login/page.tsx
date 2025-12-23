"use client";

import React, { useState } from "react";
import { Mail, Lock, ArrowRight, Camera, Github, LogInIcon } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <main className="auth">
      <div className="auth__container">
        <header className="auth__header">
          {/* <div className="auth__logo">
            <Camera className="auth__logo-icon" />
          </div> */}
          <h1 className="auth__title">
            {isLogin ? "Welcome Back" : "Start Flipping"}
          </h1>
          <p className="auth__subtitle">
            {isLogin
              ? "Log in to access your appraisal history."
              : "Create an account to track your thrift finds."}
          </p>
        </header>

        <form className="auth__form" onSubmit={(e) => e.preventDefault()}>
          <div className="auth__field">
            <label className="auth__label">Email Address</label>
            <div className="auth__input-wrapper">
              <Mail className="auth__input-icon" />
              <input
                type="email"
                placeholder="hunter@thrift.com"
                className="auth__input"
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
              />
            </div>
          </div>

          <button type="submit" className="auth__submit">
            {isLogin ? "LOG IN" : "CREATE ACCOUNT"}
            {/* {isLogin ? <LogInIcon className="auth__social-icon" /> : <ArrowRight className="auth__submit-icon" />} */}
            {isLogin ? <ArrowRight className="auth__submit-icon" /> : <ArrowRight className="auth__submit-icon" />}
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
                onClick={() => setIsLogin(!isLogin)}
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
