import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  // Remove all items from localStorage
  localStorage.clear();

  // Navigate to the "/login" route
  window.location.href = '/login';

  return null;
};

export default Logout;
