import React from 'react';
 import "../styles/navbar.css"
 import { useNavigate, Link } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");  // Redirect to login page
  };
  
  return (
    <div className="navbar">
         
       <img className="logo" src="/public/logo.png" alt="logo">
       </img>
       <button onClick={handleLogout}>Logout</button>
     </div>
  );
}

export default Navbar;
