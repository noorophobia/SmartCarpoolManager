import React, { useState } from 'react';
import "../styles/navbar.css";
import { useNavigate, Link } from "react-router-dom";
 
const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login"); // Redirect to login page
  };

  const handleProfile = () => {
    navigate("/settings"
      ); // Redirect to the Profile page
  };
  const goToHome = () => {
    navigate("/"
      ); // Redirect to the Profile page
  };

  return (
    <div className="navbar">
      {/* Logo */}
      
       <img className="logo" src="/public/logo.png" alt="logo" 
      onClick={goToHome}/>
 
      {/* Dropdown Trigger */}
      <div className="settings-dropdown" onClick={() => setDropdownOpen(!dropdownOpen)}>
        <img
          src="/public/profile_settings.png" // Replace with actual settings icon
          alt="Settings"
          className="settings-icon"
        />
      </div>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div className="dropdown-menu">
          <button className="dropdown-item" onClick={handleProfile}>
            Profile
          </button>
          <button className="dropdown-item" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
