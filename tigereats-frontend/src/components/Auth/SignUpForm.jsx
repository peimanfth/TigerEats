import React, { useState } from "react";
import { adminSignUp, studentSignUp } from "../../api/api";

const SignUpForm = () => {
  const [role, setRole] = useState("student"); // Role selection (admin or student)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async () => {
    try {
      if (role === "admin") {
        // API call for admin signup
        await adminSignUp({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
      } else {
        // API call for student signup
        await studentSignUp({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          password: formData.password,
        });
      }
      alert("Sign up successful!");
    } catch (error) {
      alert("Sign up failed: " + error.response.data.error);
    }
  };

  return (
      <div className="container mt-5">
        <h2 className="text-center mb-4">Sign Up</h2>
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
            <>
              <div className="mb-3">
                <label htmlFor="firstName" className="form-label">
                  First Name
                </label>
                <input
                    id="firstName"
                    name="firstName"
                    className="form-control"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="lastName" className="form-label">
                  Last Name
                </label>
                <input
                    id="lastName"
                    name="lastName"
                    className="form-control"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                />
              </div>
            </>
        )}

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
              id="password"
              name="password"
              type="password"
              className="form-control"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
          />
        </div>
        <button className="btn btn-primary w-100" onClick={handleSignUp}>
          Sign Up
        </button>
      </div>
  );
};

export default SignUpForm;
