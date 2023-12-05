import React, { useEffect } from "react";
import "./css/register.css";
import logo from "../../assets/images/logo.png";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [emailValid, setEmailValid] = React.useState(true);
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showVerificationPopup, setShowVerificationPopup] =
    React.useState(false);
  const [generatedToken, setGeneratedToken] = React.useState("");

  const [userToken, setUserToken] = React.useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(email);
   

   
    

    setEmailValid(isValidEmail);
    if (
      username === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      alert("Please fill all the fields!");
      setShowVerificationPopup(false);
    } else if (!isValidEmail) {
      alert("Email should be in this format e.g.xxx@xxx.com");
      setShowVerificationPopup(false);
    } else if (password !== confirmPassword) {
      alert("Password and confirm password must be the same.");
      setShowVerificationPopup(false);
    } else {
      let token = generateRandomToken();
      setGeneratedToken(token);

      try {
        const response = await fetch(`/api/send-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: email,
            subject: "Welcome to VacaVerse",
            text: `Your token is ${token}`,
          }),
        });

        const data = await response.json();

        if (data.success) {
          alert("email sent");
          await handleRegister();
        } else {
          console.error(
            "Email verification failed:",
            data.message || "Unknown error"
          );
          setShowVerificationPopup(true);
        }
      } catch (error) {
        // Handle unexpected errors during email verification
        console.error("Error during email verification:", error);
   
      }
    }
  };

  useEffect(() => {
    console.log("Generated Token:", generatedToken);
  }, [generatedToken]);

  const handleVerify = (event) => {
    if (event) {
      event.preventDefault();
    }

    if (userToken.trim() === generatedToken.toString()) {
      alert("yay its success");
      handleRegister({ preventDefault: () => {} });
    } else {
      alert("invalidToken" + userToken + generatedToken);
    }
  };
  function generateRandomToken() {
    let token = Math.floor(100000 + Math.random() * 900000);
    return token;
  }

  const handleRegister = async (event) => {
    event.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(email);
    let roleId = 1;
    setShowVerificationPopup(false);
    setEmailValid(isValidEmail);
    if (
      username === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      alert("Please fill all the fields!");
      return;
    }
    if (!isValidEmail) {
      alert("Email should be in this format e.g.xxx@xxx.com");
      return;
    }
    if (password !== confirmPassword) {
      alert("Password and confirm password must be the same.");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, roleId }),
      });

      const data = await res.json();

      if (
        data.message === "Email already has an account. Please login." ||
        data.message === "Username already exists. Please choose another."
      ) {
        alert(data.message);
       
      }
      
      if (data.message==="Register successful")
   {
    alert("Register Success");
    window.location.href="/login";
   }   else {
        console.error("Register failed:", data.message || "Unknown error");
        // Handle login failure, show error message, etc.
      }
    } catch (error) {
      console.error("Error during register:", error);
      // Handle unexpected errors during login
    }
  };
  return (
    <div className="frame">
      <div className="div">
        <div className="overlap">
          <div className="overlap-group">
            <img className="vacaverse-logo" alt="Vacaverse logo" src={logo} />
            <div className="text-wrapper">REGISTER</div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="group">
              <input
                type="text"
                id="username"
                name="username"
                className="username-field"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
              />
              <br />
              <br />
            </div>
            <div className="overlap-wrapper">
              <input
                type="text"
                id="email"
                name="email"
                className="email-field"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <br />
              <br />
            </div>
            <div className="overlap-group-wrapper">
              <input
                type="password"
                id="password"
                name="password"
                className="password-field"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <br />
              <br />
            </div>
            <div className="group-2">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="confirmPassword-field"
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <br />
              <br />
            </div>
            <button className="overlap-2" name="Register" type="submit">
              Register
            </button>
          </form>
        </div>
        <a href="login" className="p">
          Already have an account? Login here.
        </a>
      </div>
      {showVerificationPopup && (
        <div className="verifyTokenPopUp">
          {}
          <input
            type="text"
            placeholder="Enter Verification Token"
            value={userToken}
            onChange={(e) => setUserToken(e.target.value)}
          />
          <button onClick={(e) => handleVerify(e)}>Verify</button>

          <button
            onClick={() => {
              setShowVerificationPopup(false);
              setGeneratedToken("");
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default RegisterForm;
