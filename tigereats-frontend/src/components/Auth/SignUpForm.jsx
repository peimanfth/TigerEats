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
    <div>
      <h2>Sign Up</h2>
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="student">Student</option>
        <option value="admin">Admin</option>
      </select>

      {role === "admin" && (
        <>
          <input
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
        </>
      )}

      {role === "student" && (
        <>
          <input
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
          />
          <input
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
          />
        </>
      )}

      <input
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        name="password"
        placeholder="Password"
        type="password"
        value={formData.password}
        onChange={handleChange}
      />
      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  );
};

export default SignUpForm;
