import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/login.css";
import { useLocation } from "react-router-dom";

// Loader component for displaying during loading states
const Loader = () => (
  <div className="loader-container">
    <div className="spinner"></div>
  </div>
);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Added state for confirm password
  const [showForgotPassword, setShowForgotPassword] = useState(false); // State to toggle forgot password form
  const [errorMessage, setErrorMessage] = useState(""); // Error message for login/forgot password
  const [successMessage, setSuccessMessage] = useState(""); // Success message for forgot password
  const [loading, setLoading] = useState(false); // Loading state for form submissions
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
    setErrorMessage(""); // Clear any previous error messages

    try {
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
         setErrorMessage(errorData.error || "Failed to log in. Please try again.");
        setLoading(false);
        return;
      }

      const data = await res.json();
       localStorage.setItem("token", data.token);

      document.body.style.backgroundColor = "white";

      navigate("/");
    } catch (err) {
      

      setErrorMessage(err.error || "An error occurred while logging in.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(""); // Clear any previous error messages

    if (!email.trim()) {
      setErrorMessage("Please enter your email.");
      setSuccessMessage("");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setSuccessMessage("");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/admin/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Password reset successful! You can now log in with your new password.");
        // Reset fields
        setEmail("");  
        setPassword("");  
        setConfirmPassword("");  
      } else {
        setErrorMessage(data.error || "An error occurred. Please try again.");
        setSuccessMessage("");
      }
    } catch (err) {
      setErrorMessage("An error occurred. Please try again.");
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {loading && <Loader />} {/* Display loader when loading is true */}

        {!showForgotPassword ? (
          // Login Form
          <form onSubmit={handleSubmit}>
            <h2>Login</h2>

            {errorMessage && <p className="error">{errorMessage}</p>} {/* Display error message */}

            <input
              type="email"
              placeholder="Enter Email"
              className="form-control"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <input
              type="password"
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
          // Forgot Password Form
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
            <input
              type="password"
              placeholder="New Password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
