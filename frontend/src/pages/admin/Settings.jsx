import React, { useState, useEffect } from "react";
import "../../styles/setting.css";

const Settings = () => {
  // State variables for settings
  const [theme, setTheme] = useState("light"); // Default theme
   const [password, setPassword] = useState(""); // New password
  const [email, setEmail] = useState(""); // Email for password update
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirm password
  const [passwordError, setPasswordError] = useState(""); // Error message for password mismatch
  const [successMessage, setSuccessMessage] = useState(""); // Success message for password update
  const [loading, setLoading] = useState(false); // Loading state

  // Save settings to localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.body.setAttribute("data-theme", savedTheme); // Apply saved theme on load
  }, []);

  const handleThemeChange = (event) => {
    const selectedTheme = event.target.value;
    setTheme(selectedTheme);
    document.body.setAttribute("data-theme", selectedTheme); // Update theme dynamically
    localStorage.setItem("theme", selectedTheme); // Save theme in localStorage
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

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

        // Empty fields validation
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
      // Send password update request to backend
      const response = await fetch("http://localhost:5000/api/admin/update-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword: password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Password updated successfully!");
        setPassword(""); // Reset fields
        setConfirmPassword("");
        setEmail("");
      } else {
        setPasswordError(data.error || "An error occurred while updating the password.");
        setSuccessMessage("");
      }
    } catch (err) {
      setPasswordError("An error occurred. Please try again.");
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
        <h3  style={{ display: 'block', marginBottom: '15px !important' ,marginTop:'10px', fontSize:'20px'

        }}


        
        >Change Password</h3>
        <form onSubmit={handlePasswordSubmit}>
          <div className="form-group">
 
          <label htmlFor="email" style={{ display: 'block', marginBottom: '15px !important' ,marginTop:'10px'

          }}>
  Email:
</label>


            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password"
            style={{ marginBottom: '10px', display:' inline-block',  marginTop:'10px'



             }}
            >New Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword
            " 
            style={{ marginBottom: '10px', display:' inline-block',  marginTop:'10px'}}

            >Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
          </div>
          {passwordError && <p className="error">{passwordError}</p>}
          {successMessage && <p className="success" style={{color:"green", marginTop:"10px", marginBottom:"10px"

          }}
          
          >{successMessage}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
