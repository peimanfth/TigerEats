import React from "react";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove JWT from localStorage
    navigate("/signin"); // Redirect to sign-in page
  };

  return <button onClick={handleLogout}>Log Out</button>;
};

export default LogoutButton;
