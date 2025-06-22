import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/login.css";
import AuthService from "../../services/AuthService"; // ✅ Import the service

const Loader = () => (
  <div className="loader-container">
    <div className="spinner"></div>
  </div>
);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuthentication = () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          navigate("/");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };

    if (location.pathname === "/login") {
      document.body.style.background = "linear-gradient(to right, #3D52A0, #1F4D75, #8697C4)";
    } else {
      document.body.className = "";
      document.body.style.backgroundColor = "";
    }

    checkAuthentication();
  }, [navigate, location.pathname]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const data = await AuthService.login(email, password); // ✅ Use AuthService
      localStorage.setItem("token", data.token);
      document.body.style.backgroundColor = "white";
      navigate("/");
    } catch (err) {
      setErrorMessage(err);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (!email.trim()) {
      setErrorMessage("Please enter your email.");
      setLoading(false);
      return;
    }

    try {
      await AuthService.resetPassword(email); // ✅ Use AuthService
      setSuccessMessage("Password reset successful! You can now log in with your new password.");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setErrorMessage(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {loading && <Loader />}

        {!showForgotPassword ? (
          <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            {errorMessage && <p className="error">{errorMessage}</p>}
            <input
              type="email"
              placeholder="Enter Email"
              className="form-control"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              className="form-control"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleForgotPasswordSubmit}>
            <h2>Forgot Password</h2>
            {errorMessage && <p className="error">{errorMessage}</p>}
            {successMessage && <p className="success">{successMessage}</p>}
            <input
              type="email"
              placeholder="Enter your email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Sending..." : "Reset Password"}
            </button>
            <p className="register-link" onClick={() => setShowForgotPassword(false)}>
              Back to Login
            </p>
          </form>
        )}

        {!showForgotPassword && (
          <div className="forgot-password-link">
            <p onClick={() => setShowForgotPassword(true)} className="register-link">
              Forgot Password?
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
