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
      <div className="container mt-5">
        <h2 className="text-center mb-4">Sign In</h2>
        <div className="mb-3">
          <label htmlFor="role" className="form-label">
            Select Role
          </label>
          <select
              id="role"
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {role === "admin" && (
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                  id="username"
                  name="username"
                  className="form-control"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
              />
            </div>
        )}

        {role === "student" && (
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                  id="email"
                  name="email"
                  className="form-control"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
              />
            </div>
        )}

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
              id="password"
              name="password"
              className="form-control"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
          />
        </div>
        <button className="btn btn-primary w-100" onClick={handleLogin}>
          Sign In
        </button>
      </div>
  );
};

export default SignInForm;
