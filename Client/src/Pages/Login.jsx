import { Link, useNavigate } from "react-router-dom";
import CLogo from "../assets/images/CLogo.png";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    axios
      .post(`${import.meta.env.VITE_API_BASE_URL}/api/login`, { username, password })
      .then((response) => {
        if (response.data && response.data.token) {
          localStorage.setItem("token", response.data.token);
          toast.success("Login successful! Welcome back 🎉");
          window.location.href = "/dashboard";
        } else {
          toast.error("Login successful, but no token received.");
        }
      })
      .catch((error) => {
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Login failed. Please try again.");
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="dg-login-page">
      {/* Animated background */}
      <div className="dg-login-bg">
        <div className="dg-login-orb" />
      </div>

      {/* Floating particles */}
      <div aria-hidden="true" style={{
        position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0,
      }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            borderRadius: "50%",
            background: i % 2 === 0 ? "rgba(99,102,241,0.5)" : "rgba(14,165,233,0.5)",
            top: `${10 + i * 15}%`,
            left: `${5 + i * 15}%`,
            animation: `float ${4 + i}s ease-in-out infinite`,
            animationDelay: `${i * 0.7}s`,
          }} />
        ))}
      </div>

      <div className="dg-login-card">
        {/* Logo */}
        <div className="dg-login-logo">
          <img src={CLogo} alt="DOAGuru" />
          <h1 className="dg-login-title">
            Welcome back
          </h1>
          <p className="dg-login-subtitle">Sign in to DOAGuru Letters Portal</p>
        </div>

        {/* Divider with gradient */}
        <div style={{
          height: "1px",
          background: "linear-gradient(90deg, transparent, var(--border-medium), transparent)",
          marginBottom: "1.75rem",
        }} />

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="dg-form-group">
            <label htmlFor="username" className="dg-label">Username</label>
            <div className="dg-input-wrapper">
              <span className="dg-input-icon">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="dg-input"
              />
            </div>
          </div>

          {/* Password */}
          <div className="dg-form-group">
            <div className="dg-form-row">
              <label htmlFor="password" className="dg-label" style={{ marginBottom: 0 }}>Password</label>
              <Link to="#" className="dg-form-link">Forgot password?</Link>
            </div>
            <div className="dg-input-wrapper" style={{ marginTop: "0.5rem" }}>
              <span className="dg-input-icon">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                id="password"
                name="password"
                type={showPass ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="dg-input"
                style={{ paddingRight: "3rem" }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: "absolute",
                  right: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                  padding: 0,
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary-light)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? (
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            id="login-submit-btn"
            type="submit"
            disabled={loading}
            className="dg-btn-primary"
            style={{ marginTop: "0.5rem" }}
          >
            {loading && <span className="dg-btn-spinner" />}
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        {/* Footer */}
        <p className="dg-login-footer-text">
          Not a member?{" "}
          <a href="https://doaguru.com/" target="_blank" rel="noreferrer">
            Join DOAGuru Team
          </a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
