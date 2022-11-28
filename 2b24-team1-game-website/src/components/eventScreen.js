import React from "react";
import "../css/commonClass.css";

// // Event Button Init
// var eventButton = (
//   <button id="makemove" onClick={genEvent} type="button">
//     <a className="bold-txt-medium">Move On</a>
//   </button>
// );

export function EventButton({ gen }) {
  return (
    <button id="makemove" onClick={gen} type="button">
      <a className="bold-txt-medium">Move On</a>
    </button>
  );
}

export function BattleButton({ swap }) {
  return (
    <button
      className="bold-txt-medium fade-fast"
      type="button"
      onClick={swap}
      id="commence_battle"
    >
      Engage In Combat (Commence Fight)
    </button>
  );
}

export function EventPage({
  battleButton,
  itemTxt,
  itemImg,
  genEvent,
  setArea,
  closeNav,
  eventText,
  openNav,
}) {
  return (
    <div id="volatileGame" className="w-full h-full">
      {/* <!-- Blurred Background --> */}
      <div className="background-box p-absolute"></div>
      {/* <!-- Hidden Sidenav --> */}
      <div id="mySidenav" className="sidenav p-absolute">
        <a className="closebtn" onClick={() => closeNav()}>
          &times;
        </a>

        <a
          className="thin-txt-large areaOption activearea"
          id="area1"
          onClick={() => {
            setArea("forest", "area1", "greenerforest.jpg");
          }}
        >
          Forest
          <img src="../images/greenerforest.jpg" className="w-full" />
        </a>

        <a
          className="thin-txt-large areaOption"
          id="area2"
          onClick={() => {
            setArea("plains", "area2", "plains.jpeg");
          }}
        >
          Plains
          <img src="../images/plains.jpeg" className="w-full" />
        </a>

        <a
          className="thin-txt-large areaOption"
          id="area3"
          onClick={() => setArea("volcano", "area3", "volcano.jpeg")}
        >
          Volcano
          <img src="../images/volcano.jpeg" className="w-full" />
        </a>

        <a
          className="thin-txt-large areaOption"
          id="area4"
          onClick={() => setArea("river", "area4", "river.jpeg")}
        >
          River
          <img src="../images/river.jpeg" className="w-full" />
        </a>
      </div>
      <button
        className="sideSelect p-absolute z2"
        onClick={() => openNav()}
        type="button"
      >
        ..
      </button>
      {/* <!-- Event Text Description --> */}
      <div
        className="w-full p-relative display-flex-c align-items-center justify-content-center z2"
        id="event-description"
      >
        <a className="txt-color-w thin-txt-large fade-fast text-align-center">
          {eventText}
        </a>
        {battleButton}
        {itemTxt}
        {itemImg}
        <br />
      </div>
      {/* <!-- Button Box --> */}
      <div
        className="w-full p-absolute bg-dark display-flex-c align-items-center justify-content-center z2"
        id="event-button"
      >
        <EventButton gen={genEvent} />
        <a className="txt-color-b bold-txt-small" id="event-button-desc">
          Click this button to take a step
        </a>
      </div>
    </div>
  );
}

export function CombatPage({
  enemyName,
  enemyAtk,
  enemyDef,
  enemyDodge,
  playerAtk,
  playerDef,
  playerDodge,
  eCurrent,
  eMax,
  enemyImg,
  pCurrent,
  pMax,
  battleText,
  rewardsCard,
}) {
  return (
    <div id="volatileGame" className="w-full h-full">
      <div className="background-box p-absolute"></div>
      <div className="w-full z3 p-absolute" id="gameBox1">
        <div className="sideBoxes"></div>
        <div
          className="flex-d3 h-full display-flex-c align-items-center"
          id="combatBox"
        >
          <br />
          <div
            className="display-flex-c justify-content-center align-content-center h-75"
            id="enemy_stat"
          >
            <div className="bold-txt-large" id="EstatBoxWords">
              {enemyName} Stats
            </div>
            <div className="bold-txt-large">Attack: {enemyAtk}</div>
            <div className="bold-txt-large">Block: {enemyDef}</div>
            <div className="bold-txt-large">Ignore: {enemyDodge}%</div>
          </div>
          <br />
          <div className="health_bar display-flex justify-content-center align-items-center thinGreyBorder">
            <div id="enemy_health_show"></div>
            <a
              className="bold-txt-large p-absolute text-align-center display-flex"
              id="enemy_health"
            >
              {eCurrent} / {eMax}
            </a>
          </div>
          <div className="progress w-50">
            <div className="progressingBar" id="enemyProgress"></div>
          </div>
          <br />
          <div id="enemy_name">
            <div id="eDiv" className="p-absolute">
              {enemyImg}
            </div>
          </div>

          <div className="progress w-50">
            <div className="progressingBar" id="playerProgress"></div>
          </div>
          <div className="bold-txt-large">
            Click on the enemy's potrait to speed up your attack
          </div>

          <div className="bold-txt-large" id="battle-text">
            {battleText}
          </div>

          <div className="display-flex z3 w-full" id="playerFlexBox">
            <div className="flex-d1 display-flex-c justify-content-center align-items-center">
              <div className="bold-txt-medium">Player Health:</div>
              <div className="display-flex justify-content-center align-items-center h-50 w-75 bg-cancer thinGreyBorder">
                <div id="player_health_show"></div>
                <a
                  className="bold-txt-large p-absolute text-align-center display-flex"
                  id="player_health"
                >
                  {pCurrent} / {pMax}
                </a>
              </div>
            </div>
            <div className="flex-d1 display-flex justify-content-center align-content-center">
              <div
                className="display-flex-c justify-content-center align-content-center"
                id="player_stat"
              >
                <div className="bold-txt-medium">Player Stats</div>
                <div className="bold-txt-medium">Attack: {playerAtk}</div>
                <div className="bold-txt-medium">Block: {playerDef}</div>
                <div className="bold-txt-medium">Ignore: {playerDodge}%</div>
              </div>
            </div>
          </div>
        </div>
        <div className="sideBoxes"></div>
      </div>
      {rewardsCard}
    </div>
  );
}

export function YourRewardsCard({
  swap,
  eGoldGiven,
  eExpGiven,
  eItemsGiven,
  eItemImg,
}) {
  return (
    <div id="rewardsCard" className="w-full h-full p-absolute z3">
      <div className="faded-background p-absolute w-full h-full"></div>
      <div
        className="justify-content-center display-flex align-items-center w-full p-absolute"
        id="rewardsBox"
      >
        <div className="p-absolute h-75 w-50 align-self-center justify-content-center align-items-center bg-dark2 display-flex">
          <div className="h-75 w-75 justify-content-center align-items-center display-flex-c">
            <div className="h-75 w-75 text-align-center .display-inline">
              <a className="bold-txt-large" id="gold_display">
                Gold Earned: {eGoldGiven}g
              </a>
              <br />
              <a className="bold-txt-large" id="xp_display">
                Experience Points Earned: {eExpGiven}
              </a>
              <br />
              <a className="bold-txt-large" id="item_display">
                Item Drops: {eItemsGiven}
              </a>
              <br />
              <a className="bold-txt-large" id="item_ImageBox">
                {eItemImg}
              </a>
              <br />
              <br />
              <br />
              <button
                type="button"
                onClick={swap}
                className="btn btn-primary"
                id="rewardsButton"
              >
                Exit Combat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function YourDeathCard({ swap, goldLost }) {
  return (
    <div id="rewardsCard" className="w-full h-full p-absolute z3">
      <div className="faded-background p-absolute w-full h-full"></div>
      <div
        className="justify-content-center display-flex align-items-center w-full h-50 p-absolute"
        id="rewardsBox"
      >
        <div className="p-absolute h-75 w-50 align-self-center justify-content-center align-items-center bg-dark2 display-flex">
          <div className="h-75 w-75 justify-content-center align-items-center display-flex-c">
            <div className="h-75 w-75 text-align-center .display-inline">
              <a className="bold-txt-large">
                You have fainted. You wake up to find yourself in an inn.
              </a>
              <br />
              <a className="bold-txt-large">
                A kind stranger has taken his fee for his effort
              </a>
              <br />
              <a className="bold-txt-large">
                You have lost {goldLost} gold from staying in an inn and for
                compensating the stranger.
              </a>
              <br />
              <button
                type="button"
                onClick={swap}
                className="btn btn-primary"
                id="rewardsButton"
              >
                Exit Combat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
