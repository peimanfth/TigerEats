import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin, studentLogin } from "../../api/api";

const SignInForm = () => {
  const [role, setRole] = useState("student"); // Role selection (admin or student)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      if (role === "admin") {
        // API call for admin login
        const { data } = await adminLogin({
          username: formData.username,
          password: formData.password,
        });
        localStorage.setItem("token", data.token);
        navigate("/admin");
      } else {
        // API call for student login
        const { data } = await studentLogin({
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem("token", data.token);
        navigate("/student");
      }
    } catch (error) {
      alert("Login failed: " + error.response.data.error);
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="student">Student</option>
        <option value="admin">Admin</option>
      </select>

      {role === "admin" && (
        <input
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />
      )}

      {role === "student" && (
        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
      )}

      <input
        name="password"
        placeholder="Password"
        type="password"
        value={formData.password}
        onChange={handleChange}
      />
      <button onClick={handleLogin}>Sign In</button>
    </div>
  );
};

export default SignInForm;
