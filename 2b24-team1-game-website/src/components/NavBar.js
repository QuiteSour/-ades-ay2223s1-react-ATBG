import React, { useState, useEffect } from "react";
import "../css/commonClass.css";
import "../css/singleFunctionClasses.css";

export function NavBar() {
  // ---------------------------------------------------------
  // Navbar Functions ( Copy Over to Own File)
  // _________________________________________________________
  const [navbarState, setNavbarState] = useState();
  var navState = true;

  const [editorOption, setEditorOption] = useState("");

  const userID = window.localStorage.getItem("User ID");
  const logout = () => {
    window.localStorage.clear();
    const currentURL = window.location.href;
    if (currentURL != "/") {
      window.location.href = "/";
    }
  };

  function dropDownMenu() {
    navState = !navState;
    if (navState) {
      setNavbarState(
        <button
          className="btn-primary"
          id="dropdown-button"
          type="button"
          onClick={dropDownMenu}
        >
          <img src="../images/bird.png" className="icon" />
        </button>
      );
      return;
    }
    if (userID == null) {
      setNavbarState(
        <div id="topnav">
          <ul>
            <li>
              <a onClick={dropDownMenu} className="notlogin-stuff">
                ^ Close Menu ^
              </a>
            </li>
            <li>
              <a href="/" className="notlogin-stuff">
                Home
              </a>
            </li>

            <li>
              <a href="/login" className="login-stuff">
                Login
              </a>
            </li>
            <li>
              <a href="/register" className="login-stuff">
                Register
              </a>
            </li>
          </ul>
        </div>
      );
    } else {
      setNavbarState(
        <ul>
          <li>
            <a onClick={dropDownMenu} className="notlogin-stuff">
              ^ Close Menu ^
            </a>
          </li>
          <li>
            <a href="/" className="notlogin-stuff">
              Home
            </a>
          </li>
          <li>
            <a href="/explore" className="notlogin-stuff">
              Explore
            </a>
          </li>
          <li>
            <a href="/marketplace" className="notlogin-stuff">
              Marketplace
            </a>
          </li>
          <li>
            <a href={`/inventory/${userID}`} className="notlogin-stuff">
              Inventory
            </a>
          </li>
          {editorOption}

          <li>
            <a className="login-stuff" onClick={logout}>
              Logout
            </a>
          </li>
          <li>
            <a href={`/profile/${userID}`} className="login-stuff">
              Profile
            </a>
          </li>
        </ul>
      );
    }
  }

  function navChange() {
    // console.log(
    //   "navChange(value) in navChange(variable): " + window.innerWidth
    // );
    if (window.innerWidth < 768) {
      setNavbarState(
        <button
          className="btn-primary"
          id="dropdown-button"
          type="button"
          onClick={dropDownMenu}
        >
          <img src="../images/bird.png" className="icon" />
        </button>
      );
      return;
    }
    if (userID == null) {
      setNavbarState(
        <div id="topnav">
          <ul>
            <li>
              <a href="/" className="notlogin-stuff">
                Home
              </a>
            </li>

            <li>
              <a href="/login" className="login-stuff">
                Login
              </a>
            </li>
            <li>
              <a href="/register" className="login-stuff">
                Register
              </a>
            </li>
          </ul>
        </div>
      );
    } else {
      setNavbarState(
        <ul>
          <li>
            <a href="/" className="notlogin-stuff">
              Home
            </a>
          </li>
          <li>
            <a href="/explore" className="notlogin-stuff">
              Explore
            </a>
          </li>
          <li>
            <a href="/marketplace" className="notlogin-stuff">
              Marketplace
            </a>
          </li>
          <li>
            <a href={`/inventory/${userID}`} className="notlogin-stuff">
              Inventory
            </a>
          </li>
          <li>
            <a href={`/itemViewer`} className="notlogin-stuff">
              Archive
            </a>
          </li>
          <li>
            <a className="login-stuff" onClick={logout}>
              Logout
            </a>
          </li>
          <li>
            <a href={`/profile/${userID}`} className="login-stuff">
              Profile
            </a>
          </li>
        </ul>
      );
    }
  }

  useEffect(() => {
    // ===========================================
    // Initialise Navbar
    // ===========================================
    navChange();

    window.addEventListener("resize", () => {
      navChange();
    });
  }, []);

  return <div id="topnav">{navbarState}</div>;
}
