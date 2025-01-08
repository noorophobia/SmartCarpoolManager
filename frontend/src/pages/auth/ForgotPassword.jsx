import React, { useState } from "react";
import "../../styles/setting.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState(""); // Email input for password reset
  const [errorMessage, setErrorMessage] = useState(""); // Error message for invalid email
  const [successMessage, setSuccessMessage] = useState(""); // Success message after request
  const [loading, setLoading] = useState(false); // Loading state

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Empty fields validation
    if (!email.trim()) {
      setErrorMessage("Please enter your email.");
      setSuccessMessage("");
      return;
    }

    setErrorMessage("");
    setLoading(true);

    try {
      // Send forgot password request to backend (this could trigger an email to the user)
      const response = await fetch("http://localhost:5000/api/admin/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Password reset link sent! Check your email.");
        setEmail(""); // Reset the email field
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
    <div className="forgot-password">
      <h2>Forgot Password</h2>
      <p>Enter your email address and we'll send you a link to reset your password.</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        
        {errorMessage && <p className="error">{errorMessage}</p>}
        {successMessage && <p className="success" style={{ color: "green" }}>{successMessage}</p>}
        
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
