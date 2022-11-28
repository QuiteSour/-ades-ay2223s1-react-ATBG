import axios from "axios";
import React, { useState, Fragment } from "react";
// Component
import { NavBar } from "../components/NavBar";
// CSS
import "../css/Login_Reg.css";
// Screens
import ServerErrScreen from "./errorPage/ServerErrScreen";
import LoadingScreen from "../components/LoadingSplashScreen";

function Login() {
  // Connect to backend
  const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === `127.0.0.1`;
  const STORAGE_API_HOST = isLocalhost
    ? "http://localhost:3000"
    : "https://tranquil-chamber-55751.herokuapp.com";

  // State Variables
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [displayServerErr, setDisplayServerErr] = useState(false);

  // Handles form submission
  const handleLoginSubmit = (event) => {
    // Prevent page reload
    event.preventDefault();

    // Retrieve input data
    const login_cred = {
      username: username,
      password: password,
    };

    // Check
    console.log(`Data: ${JSON.stringify(login_cred)}`);

    setIsLoading(true);

    // Axios request
    submitForm(login_cred);
  };

  // Handles axios post req
  const submitForm = async (reqBody) => {
    axios
      .post(`${STORAGE_API_HOST}/login`, reqBody)
      // Status = 200
      .then((response) => {
        // Check
        console.log("Login successfull!");

        return response.data;
      })
      .then((data) => {
        // Remove loading screen
        setIsLoading(false);

        // Redirect to gamepage
        window.location.href = "/explore";

        // Set localstorage
        window.localStorage.setItem("User ID", data.user_id);
        window.localStorage.setItem("role", data.role);
        window.localStorage.setItem("token", data.token);
      })
      // Other status
      .catch((error) => {
        if (error.response.status === 401) {
          // Check
          console.log("Invalid login credentials");

          // Return to login page
          setIsLoading(false);

          // Give alert
          alert("Invalid Login Credentials");

          // Redirect back to login
          window.location.href = "/login";

          return;
        }

        // Check
        console.log(`An error occured: ${error.message}`);

        // show error page
        setIsLoading(false);
        setDisplayServerErr(true);
      })
      .finally(() => {
        setUsername("");
        setPassword("");
      });
  };

  return isLoading ? (
    <LoadingScreen />
  ) : displayServerErr ? (
    <ServerErrScreen />
  ) : (
    <Fragment>
      <NavBar />
      <main className="login-reg">
        {/* Login container */}
        <div className="login-container">
          <h1>Login</h1>
          {/* Login Form */}
          <form onSubmit={handleLoginSubmit}>
            <input
              type={"text"}
              id="username"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              required
            />
            <input
              type={"password"}
              id="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
            />
            <button type="submit" className="login-reg-btn">
              Login
            </button>
          </form>
          <div className="reg-link">
            <p>Don't have an account?</p>
            <a href="/register">Sign up here!</a>
          </div>
        </div>
      </main>
    </Fragment>
  );
}

export default Login;
