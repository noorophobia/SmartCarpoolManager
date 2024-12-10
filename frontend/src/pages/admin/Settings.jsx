import React, { useState, useEffect } from "react";
import '../../styles/setting.css'
const Settings = () => {
  // State variables for settings
  const [theme, setTheme] = useState("light"); // Default theme
  const [language, setLanguage] = useState("en"); // Default language
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone); // Default timezone
  const [password, setPassword] = useState(""); // New password
  const [email, setEmail] = useState("");  
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirm password
  const [passwordError, setPasswordError] = useState(""); // Error message for password mismatch

  // Save settings to localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const savedLanguage = localStorage.getItem("language");
    const savedTimezone = localStorage.getItem("timezone");

    if (savedTheme) setTheme(savedTheme);
    if (savedLanguage) setLanguage(savedLanguage);
    if (savedTimezone) setTimezone(savedTimezone);
  }, []);

  const handleThemeChange = (event) => {
    const selectedTheme = event.target.value;
    setTheme(selectedTheme);
    document.body.setAttribute("data-theme", selectedTheme); // Update the app theme dynamically
    localStorage.setItem("theme", selectedTheme);
  };

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);
    localStorage.setItem("language", selectedLanguage);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
    } else {
      setPasswordError("");
      alert("Password changed successfully!");
      setPassword(""); // Reset fields
      setConfirmPassword("");
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

      {/* Language Settings */}
      <div className="setting">
        <label htmlFor="language">Language:</label>
        <select id="language" value={language} onChange={handleLanguageChange}>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
        </select>
      </div>

      {/* Password Change Form */}

      <div className="password-change">
        <h3>Change Password</h3>
        <form onSubmit={handlePasswordSubmit}>
        <div className="form-group">
            <label htmlFor="email">Email :</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">New Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
          </div>
          {passwordError && <p className="error">{passwordError}</p>}
          <button type="submit">Update Password</button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
