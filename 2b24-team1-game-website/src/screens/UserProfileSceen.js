import React, { useState, useEffect, Fragment } from "react";
import { useParams } from "react-router-dom";

// Components
import { NavBar } from "../components/NavBar";
import ProgressBar from "@ramonak/react-progress-bar";
import Radar from "../components/RadarChart";
import { CircleLoader } from "react-spinners";

// CSS
import "../css/UserProfile.css";

// Others
import axios from "axios";

function UserProfile() {
  // Connect to backend
  const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === `127.0.0.1`;
  const STORAGE_API_HOST = isLocalhost
    ? "http://localhost:3000"
    : "https://tranquil-chamber-55751.herokuapp.com";

  // Account Related Variables
  const [isDisabled, setIsDisabled] = useState(true);
  const [updateBtnText, setUpdateBtnText] = useState("Edit Account Info");
  const [updateBtn, setUpdateBtn] = useState(true);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");

  const [greeting, setGreeting] = useState("Hello ???");
  const [playerLevel, setPlayerLevel] = useState(0);
  const [playerGold, setPlayerGold] = useState(0);
  const [playerExpGain, setPlayerExpGain] = useState(0);
  const [playerMaxExp, setPlayerMaxExp] = useState(0);

  // Player Stat Variables
  const [strength, setStrength] = useState(0);
  const [defense, setDefense] = useState(0);
  const [vitality, setVitality] = useState(0);
  const [agility, setAgility] = useState(0);
  const [luck, setLuck] = useState(0);

  // Get User ID from URL
  const { userId } = useParams();
  const token = localStorage.getItem("token");

  const [isLoaded, setIsLoaded] = useState(true);
  const [isSucess, setIsSuccess] = useState(true);

  // Set header for axios
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  };

  useEffect(() => {
    getUserInfo();
    getPlayerStats();
  }, []);

  const radarData = [
    {
      className: `${username} Stats`, // optional, can be used for styling
      axes: [
        { axis: "strength", value: strength, yOffset: 10 },
        { axis: "agility", value: agility },
        { axis: "vitality", value: vitality },
        { axis: "defense", value: defense },
        { axis: "luck", value: luck, xOffset: -20 },
      ],
    },
  ];

  const domainMax = (strength + agility + vitality + defense + luck) / 5 + 5;

  // Retrieves user info
  const getUserInfo = () => {
    axios
      .get(`${STORAGE_API_HOST}/user/${userId}`, config)
      .then((response) => {
        const userInfo = response.data;

        setUsername(userInfo.username);
        setPassword(userInfo.password);
        setEmail(userInfo.email);
        setContact(userInfo.contact);

        return userInfo;
      })
      .then((data) => {
        setGreeting(`Hello ${data.username}`);
        setIsLoaded(false);
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  };

  // Retreives player stats
  const getPlayerStats = () => {
    axios
      .get(`${STORAGE_API_HOST}/playerStats/${userId}`, config)
      .then((response) => {
        const stats = response.data;

        // For Level & Gold
        setPlayerLevel(stats.user_level);
        setPlayerGold(stats.usergold);
        setPlayerExpGain(stats.exp_gain);
        setPlayerMaxExp(stats.max_exp);

        // For Player Stats
        setStrength(stats.strength);
        setAgility(stats.agility);
        setDefense(stats.defense);
        setVitality(stats.vitality);
        setLuck(stats.luck_multiplier);

        setIsSuccess(false);
      })
      .catch((err) => {
        throw err;
      });
  };

  // Update Info
  const updateUserInfo = (reqBody) => {
    axios
      .put(`${STORAGE_API_HOST}/profile/${userId}`, reqBody, config)
      .then(() => {
        alert("Update successful");
      })
      .catch((error) => {
        alert(error);
        return error;
      })
      .finally(() => {
        setIsDisabled(true);
        setUpdateBtnText("Edit Account Info");
        getUserInfo();
      });
  };

  // Button Click Handler
  const handleClick = () => {
    setUpdateBtn(!updateBtn);

    if (updateBtn) {
      setIsDisabled(false);
      setUpdateBtnText("Update");
    } else {
      const requestBody = {
        username: username,
        password: password,
        contact: contact,
        email: email,
      };

      updateUserInfo(requestBody);
    }
  };

  return (
    <Fragment>
      <NavBar />
      <main className="profile-container">
        {isLoaded && isSucess ? (
          <div id="loader">
            <CircleLoader color="#000" />
          </div>
        ) : (
          <div className="inner-profile-container">
            {/* Stats Section */}
            <div className="stats-section">
              <div className="greeting-header">
                <h1>{greeting}</h1> {/* Max Text Length of 13 */}
              </div>
              <div className="level-gold-xp-info">
                <h3>Level: {playerLevel} </h3>
                <h3>
                  Exp: {playerExpGain} / {playerMaxExp}
                </h3>
                <ProgressBar
                  completed={(playerExpGain / playerMaxExp) * 100}
                  height="15px"
                  width="30vw"
                  labelAlignment={"center"}
                  labelSize="12px"
                  labelColor="#2a484c"
                  bgColor="#92DCE5"
                  margin="1vh 3vw"
                />
                <h3>Gold: {playerGold} </h3>
              </div>

              <div className="userprof-player-stats">
                <h1>Player Stats: </h1>
                <div className="stats">
                  <h6 id="player-strength">Strength: {strength}</h6>
                  <h6 id="player-agility">Agility: {agility}</h6>
                  <h6 id="player-vitality">Vitality: {vitality}</h6>
                  <h6 id="player-defense">Defense: {defense}</h6>
                  <h6 id="player-luck">Luck: {luck}</h6>
                </div>
              </div>
              <div className="stats-chart">
                <Radar
                  chartData={radarData}
                  maxVal={domainMax}
                  width={500}
                  height={250}
                />
              </div>
            </div>
            {/* Account Section */}
            <div className="account-section">
              <div className="acc-container">
                <h3>Account Info:</h3>
                <form className="account-form">
                  <label htmlFor="update-username">Username: </label>
                  <input
                    type="text"
                    id="update-username"
                    disabled={isDisabled}
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                  />
                  <br />

                  <label htmlFor="update-password">Password: </label>
                  <input
                    type="text"
                    id="update-password"
                    disabled={isDisabled}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                  <br />

                  <label htmlFor="update-email">Email: </label>
                  <input
                    type="text"
                    id="update-email"
                    disabled={isDisabled}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                  <br />

                  <label htmlFor="update-contact">Contact: </label>
                  <input
                    type="text"
                    id="update-contact"
                    disabled={isDisabled}
                    value={contact}
                    onChange={(e) => {
                      setContact(e.target.value);
                    }}
                  />
                  <button
                    type="button"
                    className="profile-btn"
                    id="edit-acc-btn"
                    onClick={handleClick}
                  >
                    {updateBtnText}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </Fragment>
  );
}

export default UserProfile;
