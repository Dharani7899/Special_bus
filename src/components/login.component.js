import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Alert } from "react-bootstrap";
import "./login.component.css";

const Login = () => {
  const navigate = useNavigate(); // Use navigate for programmatic navigation
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [variant, setVariant] = useState("success");

  // Admin credentials for checking
  const adminEmail = "admin123@gmail.com";
  const adminPassword = "123";

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(email, password);

    // Check if it's an admin login
    if (email === adminEmail && password === adminPassword) {
      // Admin login - redirect to admin dashboard
      setVariant("success");
      setMessage("Admin login successful");
      navigate("/admin-dashboard");
      return;
    }

    // Student login
    try {
      const res = await axios.post("http://localhost:5000/login-user", {
        email,
        password,
      });
      if (res.data.status === "ok") {
        setVariant("success");
        setMessage("Login successful!");
        // Store token and redirect to the ticket booking page
        window.localStorage.setItem("token", res.data.data);
        navigate("/ticket-booking");
      } else {
        setVariant("danger");
        setMessage(res.data.error);
      }
    } catch (error) {
      setVariant("danger");
      setMessage("An error occurred during login.");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h3>Login</h3>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {/* Message box below inputs */}
        {message && (
          <Alert variant={variant} className="mt-3">
            {message}
          </Alert>
        )}
        <button type="submit" className="btn btn-primary mt-3">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
