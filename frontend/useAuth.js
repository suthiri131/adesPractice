// auth.js (custom hook for authentication)
import React from 'react';
import { useEffect, useState } from 'react';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the authToken is present in localStorage
    const authToken = localStorage.getItem('authToken');
    setIsAuthenticated(!!authToken); // !! converts to a boolean

    // You can also perform additional checks here if needed

  }, []);

  return isAuthenticated;
};

export default useAuth;
