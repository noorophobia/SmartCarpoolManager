import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/login.css";  

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  
  const handleSubmit = async (event) => {
    event.preventDefault();
 
    try {
      // Make the fetch request with POST method
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",  
        headers: {
          "Content-Type": "application/json", // Specify content type
        },
        body: JSON.stringify({ email, password }), // Send email and password as JSON
      });

       if (!res.ok) {
        throw new Error("Failed to login");
      }

      // Parse JSON response
      const data = await res.json();
      alert(data.message); // Show success message
      localStorage.setItem("token", data.token); // Save token in localStorage
      navigate("/"); // Navigate to home page after successful login
    } catch (err) {
      alert(err.message || "An error occurred");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
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
          <button type="submit" className="btn-primary">Login</button>
        </form>
        <Link to="/" className="register-link">Don't have an account? Register</Link>
      </div>
    </div>
  );
};

export default Login;
