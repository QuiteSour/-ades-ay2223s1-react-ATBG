import axios from "axios";
import React, { useState, Fragment } from "react";
import LoadingScreen from "../components/LoadingSplashScreen";
import { NavBar } from "../components/NavBar";
import "../css/Login_Reg.css";
import { useNavigate } from "react-router-dom";

function Register() {
  // Connect to backend
  const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === `127.0.0.1`;
  const STORAGE_API_HOST = isLocalhost
    ? "http://localhost:3000"
    : "https://tranquil-chamber-55751.herokuapp.com";

  // State Variables
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regContact, setRegContact] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegSubmit = (event) => {
    // Prevent page refresh
    event.preventDefault();

    // Retrieve input data
    const reg_data = {
      username: regUsername,
      password: regPassword,
      email: regEmail,
      contact: regContact,
    };

    // Check
    console.log(`Data: ${JSON.stringify(reg_data)}`);

    // Set Loading screen
    setIsLoading(true);

    // Axios post request
    submitDetails(reg_data);
  };

  const submitDetails = async (reqBody) => {
    axios
      .post(`${STORAGE_API_HOST}/register`, reqBody)
      .then((response) => {
        if (response.status == "201") {
          setIsLoading(false);
          alert("Registration successful!");
          window.location.href = "/login";
        }

        return;
      })
      .catch((error) => {
        alert("Registration failed");
        window.location.href = "/register";
        throw error;
      });
  };

  return isLoading ? (
    <LoadingScreen />
  ) : (
    <Fragment>
      <NavBar />
      <main className="login-reg">
        {/* Registration Container */}
        <div className="reg-container">
          {/* Heading Container */}
          <div className="reg-header-row">
            <h1>To begin your journey...</h1>
            <i
              className="x-mark fa-solid fa-xmark"
              onClick={() => navigate(-1)}
            ></i>
          </div>
          {/* Registration Form */}
          <form onSubmit={handleRegSubmit}>
            <input
              type={"text"}
              id="reg-username"
              placeholder="Username"
              value={regUsername}
              onChange={(e) => {
                setRegUsername(e.target.value);
              }}
              required
            />
            <input
              type={"password"}
              id="reg-password"
              placeholder="Password"
              value={regPassword}
              onChange={(e) => {
                setRegPassword(e.target.value);
              }}
              required
            />
            <input
              type={"text"}
              id="reg-email"
              placeholder="Email"
              value={regEmail}
              onChange={(e) => {
                setRegEmail(e.target.value);
              }}
              required
            />
            <input
              type={"text"}
              id="reg-mobile-no"
              placeholder="Contact"
              value={regContact}
              onChange={(e) => {
                setRegContact(e.target.value);
              }}
              required
            />

            <button type="submit" id="submit-btn" className="login-reg-btn">
              Submit
            </button>
          </form>
        </div>
      </main>
    </Fragment>
  );
}

export default Register;
