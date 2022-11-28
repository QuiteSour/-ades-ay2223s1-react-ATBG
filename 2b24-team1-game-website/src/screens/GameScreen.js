import React, { useEffect, useState, useRef } from "react";
import "../css/commonClass.css";
import "../css/singleFunctionClasses.css";
import axios from "axios";
import {
  EventButton,
  BattleButton,
  EventPage,
  CombatPage,
  YourDeathCard,
  YourRewardsCard,
} from "../components/eventScreen";

import { NavBar } from "../components/NavBar";

function TmpScreen() {
  // Hosting Detection
  const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === `127.0.0.1`;
  const STORAGE_API_HOST = isLocalhost
    ? "http://localhost:3000"
    : "https://tranquil-chamber-55751.herokuapp.com";

  const token = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  };
  // Player Retrieval
  const playerID = useRef(parseInt(localStorage.getItem("User ID"))); // genEvent and genEnemy

  // Event JSX initialisation
  const [eventText, setEventText] = useState("Go on, take the first step");
  const [battleButton, setBattleButton] = useState("");
  const [itemTxt, setItemTxt] = useState("");
  const [itemImg, setItemImg] = useState("");

  // Game JSX initialisation
  const [rewardsCard, setRewardsCard] = useState("");

  //   Event Function Value Initialisation
  const area = useRef("forest");
  var localTerm = false; // genEvent() and seqnceLootDrop()

  // Event Object Initalisation
  var playerStuff = {
    user_id: null,
    user_level: null,
    username: null,
    stats_points: null,
    exp_gain: null,
    max_exp: null,
    player_attack: null,
    player_dodge: null,
    player_defense: null,
    player_maxhealth: null,
    player_dodgeText: null,
  };
  var equippedStuff = {
    STR: 0,
    AGI: 0,
    LUK: 0,
    VIT: 0,
    DEF: 0,
  };
  const [playerInfo, setPlayerInfo] = useState(playerStuff);

  // ------------------------------------------------
  // Combat JSX Initialisation
  // ------------------------------------------------
  // Changing Part variables
  var battleSwap = false;
  const [battleState, setBattleState] = useState(false);
  const [battleText, setBattleText] = useState("You encounter an enemy");

  // Enemy Combat Values
  const [enemyAtk, setEnemyAtk] = useState("???");
  const [enemyDef, setEnemyDef] = useState("???");
  const [enemyDodge, setEnemyDodge] = useState("???");

  const [eCurrent, setECurrent] = useState("Health");
  const [eMax, setEMax] = useState("Health");
  var enemyDied = false;
  const [enemyName, setEnemyName] = useState("Enemy");
  const [enemyImg, setEnemyImg] = useState("");

  var enemyCurrent;

  // Player Combat Values
  const [playerAtk, setPlayerAtk] = useState("???");
  const [playerDef, setPlayerDef] = useState("???");
  const [playerDodge, setPlayerDodge] = useState("???");

  const [pCurrent, setPCurrent] = useState("Health");
  const [pMax, setPMax] = useState("Health");
  var playerDied = false;

  var playerCurrent;

  var enemyStuff = {};

  // Player Related Initalisation
  var eventStuff = {};
  var playerInventory = { items: [], gold: 0 }; // genEvent()

  var generateEventButton = document.querySelector("#makemove");

  var k = 0;
  var i = 0;
  var tempInt = 0;

  var widthP = 0.1;
  var widthE = 0.1;

  var screenLg = false;

  useEffect(() => {
    // ===========================================
    // Load Player Information & Stats
    // ===========================================
    const loadPlayerInfo = () => {
      axios
        .get(`${STORAGE_API_HOST}/playerStats/${playerID.current}`, config)
        .then((response) => {
          // console.log("Response.json(): " + response);
          // console.log("areaname.value: " + areaname.value);
          return response.data;
        })
        .then((data) => {
          playerStuff = data;
          axios
            .get(`${STORAGE_API_HOST}/getInventory/${playerID.current}`, config)
            .then((response) => {
              return response.data;
            })
            .then((data) => {
              let EquipedEquipment = [
                data.equipped_armor.head,
                data.equipped_armor.body,
                data.equipped_armor.leggings,
                data.equipped_armor.boots,
                data.equipped_weapon.weapon,
                data.equipped_weapon.shield,
                data.equipped_weapon.accessory,
              ];

              axios
                .post(
                  `${STORAGE_API_HOST}/getEquipmentInfo`,
                  { equippedIds: EquipedEquipment },
                  { headers: { "Content-Type": "application/json" } }
                )
                .then((response) => {
                  return response.data;
                })
                .then((data) => {
                  console.log(data);
                  // console.log(EquipedEquipment)
                  let tempItemid = [];
                  // SHOULD SKIP THIS IF EVERYTHING IS NULL.
                  for (var i = 0; i < EquipedEquipment.length; i++) {
                    for (var x = 0; x < data.length; x++) {
                      if (
                        EquipedEquipment[i] == data[x].item_id &&
                        data[x].item_id !== undefined
                      ) {
                        EquipedEquipment[i] = data[x].itemname;
                        tempItemid[i] = data[x].item_id;
                      }
                    }
                  }

                  equippedStuff = {
                    STR: 0,
                    AGI: 0,
                    LUK: 0,
                    VIT: 0,
                    DEF: 0,
                  };
                  // this for loop is responsible for adding the stats of the item to the stats tab e.g: +(5).
                  // SHOULD SKIP THIS IF EVERYTHING IS NULL.
                  for (var z = 0; z < data.length; z++) {
                    if (data[z] !== "null") {
                      equippedStuff.STR += parseInt(
                        data[z].item_stats.item_stats.strength
                      );
                      equippedStuff.AGI += parseInt(
                        data[z].item_stats.item_stats.agility
                      );
                      equippedStuff.VIT += parseInt(
                        data[z].item_stats.item_stats.vitality
                      );
                      equippedStuff.DEF += parseInt(
                        data[z].item_stats.item_stats.defense
                      );
                    }
                  }
                  setPlayerInfo({
                    user_id: playerID.current,
                    user_level: playerStuff.user_level,
                    username: playerStuff.username,
                    stats_points: playerStuff.stats_points,
                    exp_gain: playerStuff.exp_gain,
                    max_exp: playerStuff.max_exp,
                    player_attack: playerStuff.strength + equippedStuff.STR,
                    player_dodge:
                      (playerStuff.agility + equippedStuff.AGI) * 0.1,
                    player_defense:
                      (playerStuff.defense + equippedStuff.DEF) * 0.05,
                    player_maxhealth:
                      (playerStuff.vitality + equippedStuff.VIT) * 2,
                    player_dodgeText: "Player Dodged",
                  });
                })
                .catch((error) => {
                  throw error;
                });
            })
            .catch((error) => {
              throw error;
            });
        })
        .catch((error) => {
          throw error;
        })
        .finally();
    };

    loadPlayerInfo();
  }, []);

  // ------------------------------------------------------------------------------------------------
  // Generation Events
  // ------------------------------------------------------------------------------------------------
  function setArea(areaname, currentItem, imgName) {
    // console.log(currentItem);
    document
      .getElementsByClassName("activearea")[0]
      .classList.remove("activearea");

    // var params = new URLSearchParams(window.location.search);
    // if (params.get("area") == null) {
    //   window.history.pushState(
    //     "string",
    //     "Title",
    //     "http://127.0.0.1:5501/html/eventGrab.html?area="
    //   );
    // }

    area.current = areaname;
    document.querySelector(`#${currentItem}`).classList.add("activearea");

    document.querySelector(
      ".background-box"
    ).style.backgroundImage = `url('../images/${imgName}')`;
  }
  function openNav() {
    document.getElementById("mySidenav").style.width = "25%";
  }
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }
  //   Game: __Event__ Functions
  function genEvent() {
    // ==============================
    // Initialise
    // ==============================
    generateEventButton = document.querySelector("#makemove");

    // ==============================
    // Disables button temporarily
    // ==============================
    generateEventButton.disabled = true;

    if (playerID.current == null) {
      console.log("No User ID");
      window.location.reload();
    }

    console.log("User ID Found");

    // ==============================
    // Times out button for 5 seconds
    // ==============================
    setTimeout(function () {
      generateEventButton.disabled = false;
    }, 5000);

    axios
      .get(
        `${STORAGE_API_HOST}/generateEvent?area=${area.current}`,
        area.current
      )

      .then((response) => {
        // console.log("Response.json(): " + response);
        // console.log("area.value: " + area);
        return response.data;
      })
      .then((data) => {
        console.log("data: " + data.event_description);
        setEventText(data.event_description);

        if (eventStuff == data) {
          console.log("dejavu");
          setEventText(eventText + "You experience a sense of deja vu.");
        }
        // Settings in game text
        setBattleButton("");
        setItemTxt("");
        setItemImg("");

        eventStuff = data;

        if (eventStuff.event_effect == "Generate random enemy") {
          console.log("Event Make Enemy");
          setBattleButton(<BattleButton swap={swapScene} />);
          return;
        }
        axios
          .get(`${STORAGE_API_HOST}/getInventory/${playerID.current}`)
          .then((response) => {
            // console.log("Response.json(): " + response);
            // console.log("areaname.value: " + areaname.value);
            return response.data;
          })
          .then((data) => {
            playerInventory.items = data.userbag;
            // ============================================================================
            // Pushing Item into temporary inventory
            // ============================================================================
            // console.log(eventStuff.event_effect);
            // console.log("Player Inventory");
            // console.log(playerInventory.items.length);
            try {
              playerInventory.items.forEach((element) => {
                //   console.log(element);
                if (element.id == eventStuff.event_effect.id) {
                  element.Quant += 1;
                  localTerm = false;
                  throw "Quant Correct";
                }
                localTerm = true;
              });
            } catch (e) {
              if (e !== "Quant Correct") {
                throw e;
              }
            }

            // ============================================================================
            // Get Item Name
            // ============================================================================
            axios
              .get(
                `${STORAGE_API_HOST}/getIteminfo/${eventStuff.event_effect.id}`
              )
              .then((response) => {
                return response.data;
              })
              .then((data) => {
                // Not making it an export util as there are no properties needed to be passed down
                setItemTxt(
                  <a className="txt-color-w thin-txt-large fade-fast text-align-center">
                    You have found an item: {data.itemname}
                  </a>
                );
                setItemImg(
                  <img
                    src={`${STORAGE_API_HOST}/itemImage/${eventStuff.event_effect.id}`}
                    alt="EnemySprite"
                    id="enemyImg"
                  />
                );

                // ==================================================
                // Pushing Item into temporary inventory
                // ===item===============================================
                if (localTerm || playerInventory.items.length == 0) {
                  localTerm = false;
                  playerInventory.items.push(eventStuff.event_effect);
                }

                // ============================================================================
                // Pushing Item into database with put request
                //   --  update after adding items into the list
                // ============================================================================
                console.log("PLAYER INVENTORY: " + playerInventory);
                axios
                  .put(
                    `${STORAGE_API_HOST}/updateInventory/${playerID.current}`,
                    playerInventory
                  )
                  .then((response) => {
                    return response.data;
                  })
                  .then((data) => {
                    return console.log("Success");
                  })
                  .catch((error) => {
                    throw error;
                  })
                  .finally();
              })
              .catch((error) => {
                throw error;
              })
              .finally();
          })
          .catch((error) => {
            throw error;
          })
          .finally();
      })
      .catch((error) => {
        console.log("Error");
        throw error;
      })
      .finally();
  }

  // ===========================================
  // Swaps to battle HTML
  function swapScene() {
    console.log("Called");
    battleSwap = !battleSwap;
    setBattleButton("");
    setBattleState(battleSwap);
    if (battleSwap) {
      genEnemy();
      attackMove();
      enemyAttack();
      return;
    }
    setRewardsCard("");
  }

  // ===========================================
  // Functions For Battle Sequence
  // ===========================================
  // Random Enemy Initialisation By Area
  function genEnemy() {
    enemyStuff = {};
    enemyDied = false;
    playerDied = false;
    axios
      .get(
        `${STORAGE_API_HOST}/enemy_generate?area=${area.current}`,
        area.current
      )
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        setEnemyName(data.enemy_name);
        setEnemyAtk(data.enemy_attack);
        setEnemyDef(data.enemy_defense);
        setEnemyDodge(data.enemy_dodge);

        setECurrent(data.enemy_maxhealth);
        setEMax(data.enemy_maxhealth);

        enemyStuff = data;
        enemyCurrent = enemyStuff.enemy_maxhealth;

        setPlayerAtk(playerInfo.player_attack);
        setPlayerDef(playerInfo.player_defense);
        setPlayerDodge(playerInfo.player_dodge);

        setPCurrent(playerInfo.player_maxhealth);
        setPMax(playerInfo.player_maxhealth);

        playerCurrent = playerInfo.player_maxhealth;

        document.querySelector(
          "#battle-text"
        ).innerHTML = `You encounter a ${enemyStuff.enemy_name}`;

        setBattleText(`You encounter a ${data.enemy_name}`);

        setEnemyImg(
          <img
            src={`${STORAGE_API_HOST}/enemyImage/${data.enemy_id}`}
            alt="EnemySprite"
            id="enemyImg"
          />
        );
      })
      .catch((error) => {
        throw error;
      })
      .finally(console.log("enemyDef: " + enemyDef));
  }
  function attackMove() {
    if (i == 0) {
      i = 1;
      var pid = setInterval(allyFrame, 100);

      function allyFrame() {
        document
          .querySelector("#enemy_name")
          .addEventListener("click", actionSpeedUpAttack);
        if (widthP >= 100) {
          clearInterval(pid);
          i = 0;
          widthP = 0.1;

          if (!enemyDied && !playerDied) {
            perfAttack();
            pid = setInterval(allyFrame, 100);
            return;
          }
        } else {
          widthP++;
          document.getElementById("playerProgress").style.width = widthP + "%";
        }
      }
    }
    function actionSpeedUpAttack() {
      widthP += 5;

      document.getElementById("playerProgress").style.width = widthP + "%";
      addHitImage();
    }
  }

  function addHitImage() {
    var elements = document.getElementsByClassName("hit_img");
    while (elements.length > 1) {
      elements[0].parentNode.removeChild(elements[0]);
    }

    document.querySelector(
      "#enemy_name"
    ).innerHTML += `<div class="hit_img w-full h-full p-absolute"></div>`;
  }

  function enemyAttack() {
    if (k == 0) {
      k = 1;
      widthE = 0.1;
      var eid = setInterval(enemyFrame, 100);
      function enemyFrame() {
        if (widthE >= 100) {
          clearInterval(eid);
          k = 0;
          if (!enemyDied && !playerDied) {
            getAttacked();
            eid = setInterval(enemyFrame, 100);
          }
          widthE = 0.1;
        } else {
          widthE++;
          document.getElementById("enemyProgress").style.width = widthE + "%";
        }
      }
    }
  }

  //Player Attacks Sequence
  function perfAttack() {
    tempInt = Math.round(Math.random() * 100); // May need to change to 1dp round

    if (tempInt > enemyStuff.enemy_dodge) {
      var playerDmgToTake =
        parseInt(playerInfo.player_attack) - parseInt(enemyStuff.enemy_defense);
      if (playerDmgToTake < 0) {
        setBattleText(`The enemy has taken no damage`);
        return;
      }

      enemyCurrent -= playerDmgToTake;

      setECurrent(enemyCurrent);
      reduceHealthBarSize(
        "enemy_health_show",
        enemyCurrent,
        enemyStuff.enemy_maxhealth
      );
      setBattleText(
        `${enemyStuff.enemy_name} took ${playerDmgToTake} damage. `
      );
      // Checking If Enemy Died from damage
      if (enemyCurrent <= 0) {
        // console.log("Enemy has died!");
        enemyDied = true;
        setBattleText(`The ${enemyStuff.enemy_name} has died`);
        setECurrent(0);
        sqnceLootDrop();
        document.querySelector("#enemy_name").classList.add("pStylesNone");
        return;
      }

      return;
    }
    // Enemy dodge text
    setBattleText(`${enemyStuff.enemy_dialogue}`);
  }

  // Player Gets Attacked Sqnce
  function getAttacked() {
    tempInt = Math.round(Math.random() * 100); // May need to change to 1dp round

    // Check If Dodged
    if (tempInt > playerInfo.player_dodge) {
      // If player was healed by enemy
      if (enemyStuff.enemy_attack <= 0) {
        setBattleText(`The enemy politely healed you.`);
        if (playerCurrent >= playerInfo.player_maxhealth) {
          playerCurrent = playerInfo.player_maxhealth;
          setBattleText(battleText + `Player was healed to full`);
        }
      }

      // Checking Enemy Damage to put healed battle-text
      if (enemyStuff.enemy_attack > 0) {
        var enemyDmgToTake =
          enemyStuff.enemy_attack - playerInfo.player_defense;
        playerCurrent -= enemyDmgToTake;
        setPCurrent(playerCurrent);

        setBattleText(`You took ${enemyDmgToTake} damage.`);
        reduceHealthBarSize(
          "player_health_show",
          playerCurrent,
          playerInfo.player_maxhealth
        );
      }

      // Checking If Player Died from damage
      if (playerCurrent <= 0) {
        console.log("You are dead!");
        playerDied = true;
        setBattleText(
          `Your character ${playerInfo.username} has taken fatal damage died`
        );
        setPCurrent(0);
        showEarnedRewards();
        return;
      }
      return;
    }
    // Changes battle-text to indicate player dodge successful
    setBattleText(`${playerInfo.player_dodgeText}`);
  }

  function reduceHealthBarSize(healthDiv, numerator, denominator) {
    document.querySelector(`#${healthDiv}`).style.width =
      (numerator / denominator) * 100 + "%";
  }

  function showEarnedRewards() {
    const interval_id = window.setInterval(function () {},
    Number.MAX_SAFE_INTEGER);

    // Clear any timeout/interval up to that id
    for (let i = 1; i < interval_id; i++) {
      window.clearInterval(i);
    }
    if (playerDied) {
      console.log("Player Died");

      axios
        .get(`${STORAGE_API_HOST}/getGold/${playerID.current}`, config)
        .then((response) => {
          return response.data;
        })
        .then((data) => {
          if (data.usergold >= 100) {
            var goldToBeLost = {
              gold: Math.round(Math.random() * -(data.usergold / 10)),
            };
          } else {
            var goldToBeLost = {
              gold: -10,
            };
          }
          console.log(-goldToBeLost.gold);

          setRewardsCard(
            <YourDeathCard swap={swapScene} goldLost={-goldToBeLost.gold} />
          );
          axios
            .put(
              `${STORAGE_API_HOST}/updateGold/${playerID.current}`,
              goldToBeLost,
              config
            )
            .then((response) => {
              return response.data;
            })
            .then(() => {
              return console.log("Gold Loss Success");
            })
            .catch((error) => {
              throw error;
            })
            .finally();
          return;
        })
        .catch((error) => {
          throw error;
        })
        .finally();
      return;
    }

    axios
      .get(`${STORAGE_API_HOST}/getItemInfo/${enemyStuff.enemy_loot.id}`)
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        console.log("Data Given");
        setRewardsCard(
          <YourRewardsCard
            swap={swapScene}
            eGoldGiven={enemyStuff.enemy_loottable.gold}
            eExpGiven={enemyStuff.enemy_loottable.xp}
            eItemsGiven={data.itemname}
            eItemImg={
              <img
                src={`${STORAGE_API_HOST}/itemImage/${data.item_id}`}
                alt="EnemySprite"
                id="enemyImg"
              />
            }
          />
        );
      })
      .catch((error) => {
        throw error;
      })
      .finally();
  }

  // Get Loots Sqnce
  function sqnceLootDrop() {
    localTerm = false;
    playerInventory = { items: [] };

    if (!enemyDied) {
      console.log("enemyDied has not occurred: " + enemyDied);
      return;
    }

    // ============================================================================
    // GET Existing Inventory
    // ============================================================================
    axios
      .get(`${STORAGE_API_HOST}/getInventory/${playerID.current}`, config)
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        playerInventory.items = data.userbag;
        // ============================================================================
        // Pushing Item into temporary inventory
        // ============================================================================
        console.log("Player Inventory");
        console.log(playerInventory.items.length);
        try {
          playerInventory.items.forEach((element) => {
            console.log(element);
            if (element.id == enemyStuff.enemy_loot.id) {
              element.Quant += 1;
              localTerm = false;
              throw "Quant Correct";
            }
            localTerm = true;
          });
        } catch (e) {
          if (e !== "Quant Correct") {
            throw e;
          }
        }

        // ==================================================
        // Pushing Item into temporary inventory
        // ==================================================
        if (localTerm || playerInventory.items.length == 0) {
          localTerm = false;
          playerInventory.items.push(enemyStuff.enemy_loot);
        }

        var playerEarnedGold = {
          gold: enemyStuff.enemy_loottable.gold,
        };
        // console.log(playerEarnedGold);
        // ============================================================================
        // Pushing Item into database with put request
        //   --  update after adding items into the list
        // ============================================================================
        console.log("PLAYER INV:" + JSON.stringify(playerInventory));
        console.log(playerInventory);
        axios
          .put(
            `${STORAGE_API_HOST}/updateInventory/${playerID.current}`,
            playerInventory,
            config
          )
          .then((response) => {
            return response.data;
          })
          .then(() => {
            console.log("PLAYER GOLD: " + playerEarnedGold);
            axios
              .put(
                `${STORAGE_API_HOST}/updateGold/${playerID.current}`,
                playerEarnedGold,
                config
              )
              .then((response) => {
                showEarnedRewards();
                return response.data;
              })
              .then(() => {
                return console.log("Gold Success");
              })
              .catch((error) => {
                throw error;
              })
              .finally();
            return console.log("Success");
          })
          .then(() => {
            givePlayerExpLevel();
          })
          .catch((error) => {
            throw error;
          })
          .finally();
      })
      .catch((error) => {
        throw error;
      })
      .finally();
  }

  function givePlayerExpLevel() {
    console.log("Dropped Xp: " + enemyStuff.enemy_loottable.xp);
    console.log("Curr Exp Bar: " + playerInfo.exp_gain);
    // Add Xp
    playerInfo.exp_gain += enemyStuff.enemy_loottable.xp;

    console.log("Player Xp Bar: " + playerInfo.exp_gain);

    // Check to see if xp exceed or equal maxExp
    if (playerInfo.exp_gain >= playerInfo.max_exp) {
      // increase player level ans SP
      console.log(playerInfo.stats_points);
      const requestBody = {
        user_level: playerInfo.user_level + 1,
        stat_points: playerInfo.stats_points + 5,
      };

      console.log(requestBody);
      // Update columns
      updatePlayerLevel(requestBody);

      // reset gainedXp and increase maxExp
      playerInfo.exp_gain = 0;
      playerInfo.max_exp = playerInfo.max_exp * 1.1;
    }

    // format reqBody
    const reqBody = {
      exp_gain: playerInfo.exp_gain,
      max_exp: playerInfo.max_exp,
    };

    console.log(reqBody);
    // Update columns
    updateExp(reqBody);

    return console.log("Exp/Level Updated");
  }

  function updateExp(expBody) {
    axios
      .put(
        `${STORAGE_API_HOST}/playerExpGain/${playerID.current}`,
        expBody,
        config
      )
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error;
      });
  }
  function updatePlayerLevel(reqBody) {
    axios
      .put(
        `${STORAGE_API_HOST}/playerLevel/${playerID.current}`,
        reqBody,
        config
      )
      .then((response) => {
        console.log(response);
        return response;
      })
      .catch((error) => {
        return error;
      });
  }

  if (!battleState) {
    return (
      <div className="w-full h-full">
        <NavBar />
        <EventPage
          battleButton={battleButton}
          itemTxt={itemTxt}
          itemImg={itemImg}
          genEvent={genEvent}
          setArea={setArea}
          closeNav={closeNav}
          eventText={eventText}
          openNav={openNav}
        />
      </div>
    );
  }
  return (
    <div className="w-full h-full">
      <NavBar />
      <CombatPage
        enemyName={enemyName}
        enemyAtk={enemyAtk}
        enemyDef={enemyDef}
        enemyDodge={enemyDodge}
        eCurrent={eCurrent}
        eMax={eMax}
        enemyImg={enemyImg}
        playerAtk={playerAtk}
        playerDef={playerDef}
        playerDodge={playerDodge}
        pCurrent={pCurrent}
        pMax={pMax}
        battleText={battleText}
        rewardsCard={rewardsCard}
      />
    </div>
  );
}

export default TmpScreen;
