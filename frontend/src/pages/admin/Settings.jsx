import React, { useState, useEffect } from "react";
import "../../styles/setting.css";
import SettingsService from "../../services/SettingsService"; // ✅ Import service

const Settings = () => {
  const [theme, setTheme] = useState("light");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.body.setAttribute("data-theme", savedTheme);
  }, []);

  const handleThemeChange = (event) => {
    const selectedTheme = event.target.value;
    setTheme(selectedTheme);
    document.body.setAttribute("data-theme", selectedTheme);
    localStorage.setItem("theme", selectedTheme);
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setPasswordError("All fields are required.");
      setSuccessMessage("");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      setSuccessMessage("");
      return;
    }

    setPasswordError("");
    setLoading(true);

    try {
      await SettingsService.updatePassword(email, password); // ✅ Use service
      setSuccessMessage("Password updated successfully!");
      setPassword("");
      setConfirmPassword("");
      setEmail("");
    } catch (err) {
      setPasswordError(err);
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-settings">
      <h2>Admin Settings</h2>

      {/* Theme Settings */}
      <div className="setting">
        <label htmlFor="theme">Theme:</label>
        <select id="theme" value={theme} onChange={handleThemeChange}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      {/* Password Change Form */}
      <div className="password-change">
        <h3
          style={{
            display: "block",
            marginBottom: "15px",
            marginTop: "10px",
            fontSize: "20px",
          }}
        >
          Change Password
        </h3>
        <form onSubmit={handlePasswordSubmit}>
          <div className="form-group">
            <label htmlFor="email" style={{ marginBottom: "10px", display: "block" }}>
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label
              htmlFor="password"
              style={{ marginBottom: "10px", display: "block", marginTop: "10px" }}
            >
              New Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label
              htmlFor="confirmPassword"
              style={{ marginBottom: "10px", display: "block", marginTop: "10px" }}
            >
              Confirm Password:
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {passwordError && <p className="error">{passwordError}</p>}
          {successMessage && (
            <p className="success" style={{ color: "green", marginTop: "10px", marginBottom: "10px" }}>
              {successMessage}
            </p>
          )}
          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
