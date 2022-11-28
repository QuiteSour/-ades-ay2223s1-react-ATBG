import React, { Fragment, useEffect, useState } from "react";
import { NavBar } from "../components/NavBar";
import "../css/Home.css";

function HomeScreen() {
  const [showBtn, setShowBtn] = useState(true);

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (token != null) {
      setShowBtn(false);
    }
  }, [showBtn]);

  return (
    <Fragment>
      <NavBar />
      <section className="top-half">
        <div className="intro-container fade-in">
          {/* Text & Image */}
          <div className="home-header">
            <img
              src={"../images/bird.png"}
              alt="Phoenix Logo"
              id="home-bird-logo"
            />
            <h1>Embark on a journey with a click of a button</h1>
            {showBtn ? (
              <button
                type={"button"}
                className="login-redirect"
                onClick={() => (window.location.href = "/login")}
              >
                Login
              </button>
            ) : null}
          </div>
        </div>
      </section>
    </Fragment>
  );
}

export default HomeScreen;
