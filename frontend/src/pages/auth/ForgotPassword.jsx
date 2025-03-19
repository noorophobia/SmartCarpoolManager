import { useState } from "react";
import "../../styles/setting.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      setErrorMessage("Please enter your email.");
      setSuccessMessage("");
      return;
    }

    setErrorMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Password reset link sent! Check your email.");
        setEmail("");
      } else {
        setErrorMessage(data.error || "An error occurred. Please try again.");
        setSuccessMessage("");
      }
    } catch (err) {
      setErrorMessage("An error occurred. Please try again."+err);
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password">
      <h2>Reset Password</h2>
      <p>Enter your email address and we will send you a link to reset your password.</p>
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
        {successMessage && <p className="success">{successMessage}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;