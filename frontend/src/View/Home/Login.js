import React, { useState, useEffect } from "react";
import "./css/stylelogin.css";
import logo from "../../assets/images/logo.png";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("rememberedEmail");
    const storedRememberMe = localStorage.getItem("rememberMe");

    if (storedEmail && storedRememberMe === "true") {
      setEmail(storedEmail);
      setRememberMe(true);
    }
  }, []);



  const handleLogin = async (event) => {
    event.preventDefault();
  
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, rememberMe }),
      });
  
      const data = await res.json();
  
      if (data.success) {
     
        alert("Login Success!");
        //setLoggedIn(true);
      
      
        // Store user ID in localStorage
        localStorage.setItem("userId", data.user.userid);
    localStorage.setItem("authToken", data.user.token);
    localStorage.setItem('roleid',data.user.roleid);
  
       
        if (data.user.roleid==1){
          window.location.href = '/';
        }
        else if (data.user.roleid==2){
          window.location.href = '/admin';
        }
      
      } else {
        alert("Wrong email/password! Please enter again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };
  
  return (
    <div className="frame">
      <div className="div">
        <div className="overlap">
          <div className="overlap-group">
            <img className="vacaverse-logo" src={logo} alt="Vacaverse Logo" />
            <div className="text-wrapper">LOGIN</div>
          </div>

          <form onSubmit={handleLogin}>
            <div className="group">
              <input
                type="text"
                id="email"
                name="email"
                className="email-field"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <br />
              <br />
            </div>
            <div className="overlap-wrapper">
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                className="password-field"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <br />
              <br />
            </div>

            <button className="overlap-2" name="login" type="submit">
              Login
            </button>

            <label className="overlap-3">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              Remember Me
            </label>
          </form>
        </div>

        <a href="register" className="p">
          Don’t have an account? Sign up here.
        </a>
      </div>
    </div>
  );
};

export default LoginForm;