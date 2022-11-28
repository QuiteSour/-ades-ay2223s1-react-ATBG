import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "../css/Inventory.css";
import "../css/commonClass.css";
import axios from "axios";
import { NavBar } from "../components/NavBar";

/**
 * Main component for the Inventory Screen
 * Returns the Entire JS Inventory HTML
 * @returns {JSX.Element}
 */
function InventoryScreen() {
  // ----- Connect to backend -----
  const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === `127.0.0.1`;
  const STORAGE_API_HOST = isLocalhost
    ? "http://localhost:3000"
    : "https://tranquil-chamber-55751.herokuapp.com";

  // ----- Get User ID from URL -----
  const { userId } = useParams();

  const token = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  };

  // ----- Displayed Variables -----
  // Equipped items
  const [playerEquipment, setPlayerEquipment] = useState([
    <div>
      {" "}
      <b> Loading... </b>
    </div>,
  ]);

  const [playerEquippedArmor, setPlayerEquippedArmor] = useState([]);
  const [playerEquippedWeapon, setPlayerEquippedWeapon] = useState([]);
  var playerEquipped = {
    equippedName: [],
    equippedType: [],
    equippedid: [],
    equippedStats: [],
    equipped_armor: {},
    equipped_helmet: {},
    equipped_imageLink: [],
  };
  var playerEquipped_armor = {};
  var playerEquipped_weapon = {};

  // ----- Stats -----
  // Upgrade Stats Stuff
  const [playerStatsPage, setPlayerStatsPage] = useState([
    <div className="align-center">
      <h1>Select Stat to Upgrade!</h1>
    </div>,
  ]);

  // player Stats Stuff
  const [playerName, setPlayerName] = useState("loading...");
  const [playerLevel, setPlayerLevel] = useState("loading...");
  const [playerGold, setPlayerGold] = useState("loading...");
  const [playerCurrExp, setPlayerCurrExp] = useState("loading...");
  const [playerMaxExp, setPlayerMaxExp] = useState("loading...");
  const [playerStatPoints, setPlayerStatPoints] = useState("loading...");
  const [StatStrength, setStatStrength] = useState("???");
  const [EquipStrength, setEquipStrength] = useState("(+???)");
  const [StatDefense, setStatDefense] = useState("???");
  const [EquipDefense, setEquipDefense] = useState("(+???)");
  const [StatVitality, setStatVitality] = useState("???");
  const [EquipVitality, setEquipVitality] = useState("(+???)");
  const [StatAgility, setStatAgility] = useState("???");
  const [EquipAgility, setEquipAgility] = useState("(+???)");
  const [StatLuck, setStatLuck] = useState("???");
  const [EquipLuck, setEquipLuck] = useState("(+???)");
  const [upgradeAmmount, setUpgradeAmmount] = useState(0);
  const statInputRef = useRef(null);

  // ----- Inventory -----
  const [InventoryMaxPageNo, setInventoryMaxPageNo] = useState(0);
  const [InventoryCurrPageNo, setInventoryCurrPageNo] = useState(1);
  const [saveInventory, setSaveInventory] = useState([]);
  var wholeInventory = [];
  var undefinedWholeInventory = [];

  // Filters
  const filteringTest = useRef(false);
  const [filtering, setFiltering] = useState(false);

  const [isHelmetChecked, setIsHelmetChecked] = useState(false);
  const [isBodyChecked, setIsBodyChecked] = useState(false);
  const [isLeggingsChecked, setIsLeggingsChecked] = useState(false);
  const [isBootsChecked, setIsBootsChecked] = useState(false);

  const [isWeaponChecked, setIsWeaponChecked] = useState(false);
  const [isShieldChecked, setIsShieldChecked] = useState(false);
  const [isAccessoryChecked, setIsAccessoryChecked] = useState(false);

  const [isMaterialChecked, setIsMaterialChecked] = useState(false);

  const [inventoryDisplay, setinventoryDisplay] = useState([
    <div className="align-center">
      <h1>loading...</h1>
    </div>,
  ]);

  useEffect(() => {
    ReadyPlayerStatsData();
    setTimeout(() => {
      ReadyPlayerEquippedData();
    }, 2000);
    setTimeout(() => {
      ReadyPlayerInventoryData();
    }, 5000);
  }, []);
  // -------------------------
  // Functions
  // -------------------------
  // PLAYER EQUIPPED FUNCTIONS
  const handleClick = (event) => {
    const value = event.currentTarget.value;
    unequip(value);
  };

  function getItemInformation(EquipedEquipment) {
    axios
      .post(
        `${STORAGE_API_HOST}/getEquipmentInfo`,
        { equippedIds: EquipedEquipment },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((response) => {
        let databaseOutput = response.data;
        // console.log(databaseOutput);
        // console.log(EquipedEquipment)
        let tempItemid = [];
        let tempImageLink = [];
        // SHOULD SKIP THIS IF EVERYTHING IS NULL.
        for (var i = 0; i < EquipedEquipment.length; i++) {
          for (var x = 0; x < databaseOutput.length; x++) {
            if (
              EquipedEquipment[i] == databaseOutput[x].item_id &&
              databaseOutput[x].item_id !== undefined
            ) {
              EquipedEquipment[i] = databaseOutput[x].itemname;
              tempItemid[i] = databaseOutput[x].item_id;
              tempImageLink[i] = databaseOutput[x].image_link;
            }
          }
        }
        // console.log(EquipedEquipment)
        playerEquipped.equippedName = EquipedEquipment;
        playerEquipped.equipped_imageLink = tempImageLink;
        // console.log(playerEquipped.equipped_imageLink)
        // console.log(`After: ${EquipedEquipment}`)
        // console.log(playerEquipped.equippedName)
        playerEquipped.equippedid = tempItemid;
        let checkingStat = {
          STR: 0,
          AGI: 0,
          LUK: 0,
          DEF: 0,
          VIT: 0,
        };
        // this for loop is responsible for adding the stats of the item to the stats tab e.g: +(5).
        // SHOULD SKIP THIS IF EVERYTHING IS NULL.
        for (var z = 0; z < databaseOutput.length; z++) {
          if (databaseOutput[z] !== "null") {
            checkingStat.STR += parseInt(
              databaseOutput[z].item_stats.item_stats.strength
            );
            checkingStat.AGI += parseInt(
              databaseOutput[z].item_stats.item_stats.agility
            );
            checkingStat.VIT += parseInt(
              databaseOutput[z].item_stats.item_stats.vitality
            );
            checkingStat.DEF += parseInt(
              databaseOutput[z].item_stats.item_stats.defense
            );
          }
        }
        // console.log(checkingStat)

        playerEquipped.equippedStats = [
          checkingStat.STR,
          checkingStat.AGI,
          checkingStat.VIT,
          checkingStat.DEF,
          checkingStat.LUK,
        ];
        // console.log(playerEquipped.equippedStats);
        setEquipStrength(`(+${checkingStat.STR})`);
        setEquipAgility(`(+${checkingStat.AGI})`);
        setEquipVitality(`(+${checkingStat.VIT})`);
        setEquipDefense(`(+${checkingStat.DEF})`);
        setEquipLuck(`(+${checkingStat.LUK})`);

        // console.log(playerEquipped)
      })

      // BUILDING OF UNEQUIP MENU..
      .then(() => {
        let EquippedItems = playerEquipped.equippedName;
        // console.log(playerEquipped);

        let equipmentid = playerEquipped.equippedid;
        let dlist = [];
        let Nameformatting = [
          "helmet",
          "body",
          "leggings",
          "boots",
          "weapon",
          "shield",
          "accessory",
        ];
        let missingImage = "../images/question-mark.png";
        for (var i = 0; i < EquippedItems.length; i++) {
          if (EquippedItems[i] !== null) {
            dlist.push(
              <div className="Equipped-Item-Container">
                <div className="Equipped-Item-Image">
                  <img
                    src={`${STORAGE_API_HOST}/itemImage/${equipmentid[i]}`}
                    alt="???"
                    width={64}
                    height={64}
                  />
                </div>
                <div className="Equipped-Item-Information">
                  <p>{EquippedItems[i]}</p>
                  <button
                    className="Unequip-Button"
                    value={Nameformatting[i]}
                    onClick={handleClick}
                  >
                    Unequip
                  </button>
                </div>
              </div>
            );
          } else {
            dlist.push(
              <div className="Equipped-Item-Container">
                <div className="Equipped-Item-Image">
                  <img src={missingImage} alt="???" width={64} height={64} />
                </div>
                <div className="Equipped-Item-Information">
                  <p>No {Nameformatting[i]} Equipped</p>
                  <button className="Unequip-Button" disabled>
                    Unequip
                  </button>
                </div>
              </div>
            );
          }
        }
        // console.log(dlist);
        setPlayerEquipment(dlist);
      })
      .catch((error) => {
        throw error;
      });
  }

  function ReadyPlayerEquippedData() {
    setFiltering(false);
    filteringTest.current = true;
    axios
      .get(`${STORAGE_API_HOST}/getInventory/${userId}`, config)
      .then((response) => {
        let EquippedInformation = response.data;
        // console.log(EquippedInformation);

        playerEquipped_weapon = EquippedInformation.equipped_weapon;
        playerEquipped_armor = EquippedInformation.equipped_armor;

        let EquipedEquipment = [
          EquippedInformation.equipped_armor.head,
          EquippedInformation.equipped_armor.body,
          EquippedInformation.equipped_armor.leggings,
          EquippedInformation.equipped_armor.boots,
          EquippedInformation.equipped_weapon.weapon,
          EquippedInformation.equipped_weapon.shield,
          EquippedInformation.equipped_weapon.accessory,
        ];

        wholeInventory = EquippedInformation.userbag;
        undefinedWholeInventory = EquippedInformation.userbag;
        // console.log(wholeInventory);
        // console.log(EquipedEquipment);

        getItemInformation(EquipedEquipment);
      })
      .catch((error) => {
        throw error;
      });
  }
  // STAT RELATED FUNCTIONS
  function ReadyPlayerStatsData() {
    axios
      .get(`${STORAGE_API_HOST}/playerStats2/${userId}`)
      .then((response) => {
        let databaseOutput = response.data;

        setPlayerName(databaseOutput.username);
        setPlayerLevel(databaseOutput.user_level);
        setPlayerGold(databaseOutput.usergold);
        setPlayerMaxExp(databaseOutput.max_exp);
        setPlayerCurrExp(databaseOutput.exp_gain);
        setPlayerStatPoints(databaseOutput.stats_points);
        setStatStrength(databaseOutput.strength);
        setStatAgility(databaseOutput.agility);
        setStatVitality(databaseOutput.vitality);
        setStatDefense(databaseOutput.defense);
        setStatLuck(databaseOutput.luck);
      })
      .catch((error) => {
        throw error;
      });
  }

  function loadMenu(statToUpgrade) {
    let statPointToUpgrade = 0;
    switch (statToUpgrade) {
      case "Strength":
        statPointToUpgrade = StatStrength;
        break;
      case "Agility":
        statPointToUpgrade = StatAgility;
        break;
      case "Vitality":
        statPointToUpgrade = StatVitality;
        break;
      case "Defense":
        statPointToUpgrade = StatDefense;
        break;
      case "Luck":
        statPointToUpgrade = StatLuck;
        break;
      default:
        break;
    }
    let slist = [];
    // console.log(statPointToUpgrade)

    function handleChange(event) {
      setUpgradeAmmount(
        parseInt(statInputRef.current.value) + parseInt(statPointToUpgrade)
      );
    }

    slist.push(
      <div>
        <div className="point-upgrade-title">
          <h1>Adding Point to {statToUpgrade}</h1>
          <h2> Owned Points: {playerStatPoints}</h2>
        </div>
        <div className="stat-column-flex">
          <div className="stat-split-titles">
            <div>
              <h1>Before</h1>
            </div>
            <div>
              <h1>{statPointToUpgrade}</h1>
            </div>
          </div>
          <div className="stat-split-titles">
            <div>
              <input ref={statInputRef} type="number" name="statUpgradeInput" />
            </div>
          </div>
          <div className="stat-split-titles">
            <div>
              <h1>After</h1>
            </div>
            <div>
              <h1>{upgradeAmmount}</h1>
            </div>
          </div>

        </div>
        <div className="stat-Buttons">
          <button
            type="button"
            id="cfm-add-btn"
            className="stat-Buttons2"
            onClick={() => updateStat(statToUpgrade)}
          >
            Confirm
          </button>
          <div>
            <button type="button" id="cfm-add-btn" className="stat-Buttons2" onClick={() => cancelMenu()}>
              Cancel
            </button>
          </div>
        </div>
        <div>

        </div>

      </div>
    );
    setPlayerStatsPage(slist);
  }

  function cancelMenu() {
    let htmlinsert = [];
    htmlinsert.push(
      <div className="align-center">
        <h1>Select Stat to Upgrade!</h1>
      </div>
    );
    setPlayerStatsPage(htmlinsert);
  }

  function updateStat(statToUpgrade) {
    let statUpgradeAmmount = statInputRef.current.value;

    if (statUpgradeAmmount <= playerStatPoints && statUpgradeAmmount > 0) {
      axios
        .put(
          `${STORAGE_API_HOST}/pUpdate/${userId}`,
          { statName: statToUpgrade, statAmmount: statUpgradeAmmount },
          config
        )
        .then(() => {
          cancelMenu();
          ReadyPlayerStatsData();
        })
        .catch((error) => {
          throw error;
        });
    }
  }

  // INVENTORY RELATED FUNCTIONS
  function outputPlayerInventoryData(inventoryItems) {
    // console.log(`Loading how many Objects? ${inventoryItems.length}`);
    // console.log(inventoryItems);
    let ilist = [];
    for (let i = 0; i < inventoryItems.length; i++) {
      setTimeout(() => {
        if (inventoryItems[i].item_stats.item_type !== "Material") {
          ilist.push(
            <div className="inventoryCard_Equippable">
              <div className="inventoryCard-img">
                <img
                  src={`${STORAGE_API_HOST}/itemImage/${inventoryItems[i].item_id}`}
                  alt="???"
                  width={64}
                  height={64}
                />
              </div>
              <div className="inventoryCard-header">
                <h2>
                  {inventoryItems[i].itemname} x{inventoryItems[i].Quant}
                </h2>
              </div>
              <div className="inventoryCard-body">
                <h3>{inventoryItems[i].item_stats.item_type} </h3>
                <div className="inventoryCard-body-seperation">
                  <div className="dropdown">
                    <span>
                      <h4>Mouse over for Stats</h4>
                    </span>
                    <div className="dropdown-content">
                      <p>
                        STR: {inventoryItems[i].item_stats.item_stats.strength}
                      </p>
                      <p>
                        AGI: {inventoryItems[i].item_stats.item_stats.agility}
                      </p>
                      <p>
                        VIT: {inventoryItems[i].item_stats.item_stats.vitality}
                      </p>
                      <p>
                        DEF: {inventoryItems[i].item_stats.item_stats.defense}
                      </p>
                    </div>
                  </div>
                  <div>
                    <button
                      className="equip-Button"
                      onClick={() => equip(inventoryItems[i].item_id)}
                    >
                      equip
                    </button>
                  </div>
                </div>
                <button
                  className="sell-Button"
                  onClick={() => (window.location.href = "/marketplace")}
                >
                  sell
                </button>
              </div>
            </div>
          );
          setinventoryDisplay(ilist);
        } else {
          ilist.push(
            <div className="inventoryCard">
              <div className="inventoryCard-img">
                <img
                  src={`${STORAGE_API_HOST}/itemImage/${inventoryItems[i].item_id}`}
                  alt="???"
                  width={64}
                  height={64}
                />
              </div>
              <div className="inventoryCard-header">
                <h2>
                  {inventoryItems[i].itemname} x{inventoryItems[i].Quant}
                </h2>
              </div>
              <div className="inventoryCard-body">
                <h3>{inventoryItems[i].item_stats.item_type}</h3>
                <button
                  className="sell-Button"
                  onClick={() => (window.location.href = "/marketplace")}
                >
                  sell
                </button>
              </div>
            </div>
          );
        }
        setinventoryDisplay(ilist);
      }, 1500);
    }
  }

  function ReadyPlayerInventoryData() {
    setFiltering(false);
    filteringTest.current = false;
    axios
      .get(`${STORAGE_API_HOST}/userInventoryPage/${userId}`, config)
      .then((response) => {
        // console.log(response.data)
        setInventoryMaxPageNo(parseInt(response.data));
        setInventoryCurrPageNo(1);
        axios
          .get(`${STORAGE_API_HOST}/AllInventoryItems/${userId}/1`, config)
          .then((response) => {
            let inventoryItems = response.data;
            outputPlayerInventoryData(inventoryItems);
          })
          .catch((error) => {
            throw error;
          });
      })
      .catch((error) => {
        throw error;
      });
  }
  // -- Inventory page controls --
  function nextPage() {
    submitSearchCriteria(true, 1);
    if (filtering == true && InventoryCurrPageNo < InventoryMaxPageNo) {
      submitSearchCriteria(true, 1);
    } else if (filtering == false && InventoryCurrPageNo < InventoryMaxPageNo) {
      AllSearch(1, InventoryCurrPageNo);
    }
  }
  function prevPage() {
    console.log(`PREV PAGE, FILTERED? ${filtering}`);
    console.log(`CURR PAGE > 0? ${InventoryCurrPageNo > 0}`);
    if (filtering == true && InventoryCurrPageNo > 0) {
      submitSearchCriteria(true, -1);
    } else if (filtering == false && InventoryCurrPageNo > 0) {
      // console.log("all search called");
      AllSearch(-1, InventoryCurrPageNo);
    }
  }

  // -- Search Controls --
  function AllSearch(changeType, funcCurrPageNo) {
    funcCurrPageNo += changeType;
    setFiltering(false);
    filteringTest.current = false;
    console.log(funcCurrPageNo);
    console.log(InventoryMaxPageNo);
    if (funcCurrPageNo > InventoryMaxPageNo || funcCurrPageNo <= 0) {
      return;
    } else {
      axios
        .get(
          `${STORAGE_API_HOST}/AllInventoryItems/${userId}/${funcCurrPageNo}`,
          config
        )
        .then((response) => {
          let inventoryItems = response.data;
          wholeInventory = inventoryItems;
          // console.log(inventoryItems);
          setInventoryCurrPageNo(funcCurrPageNo);
          outputPlayerInventoryData(inventoryItems);
        })
        .catch((error) => {
          throw error;
        });
    }
  }

  function submitSearchCriteria(changePage = false, pageAdjusment = "a") {
    console.log(changePage);
    console.log(pageAdjusment);
    let filterCriteria = [];
    if (isHelmetChecked) {
      filterCriteria.push("Helmet");
    }
    if (isBodyChecked) {
      filterCriteria.push("Body");
    }
    if (isLeggingsChecked) {
      filterCriteria.push("Leggings");
    }
    if (isBootsChecked) {
      filterCriteria.push("Boots");
    }
    if (isWeaponChecked) {
      filterCriteria.push("Weapon");
    }
    if (isShieldChecked) {
      filterCriteria.push("Shield");
    }
    if (isAccessoryChecked) {
      filterCriteria.push("Accessory");
    }
    if (isMaterialChecked) {
      filterCriteria.push("Material");
    }
    if (changePage == true && pageAdjusment !== NaN) {
      filteredPageSearch(pageAdjusment, filterCriteria);
    } else if (changePage == false) {
      FilteredSearch(filterCriteria);
    }
  }

  function FilteredSearch(filterCriteria) {
    setFiltering(true);
    filteringTest.current = true;
    console.log(`FilteredSearch: ${filterCriteria}`);
    axios
      .post(
        `${STORAGE_API_HOST}/userInventoryPageFilteredSize/${userId} `,
        {
          filterCriteria: filterCriteria,
        },
        config
      )
      .then((response) => {
        console.log(
          `Getting Invetory Filtered Page Size Successful: ${response.data}`
        );
        setInventoryCurrPageNo(1);
        setInventoryMaxPageNo(parseInt(response.data));
      })
      .then(() => {
        axios
          .post(
            `${STORAGE_API_HOST}/userInventoryPageFiltered/${userId}/1`,
            { filterCriteria: filterCriteria },
            config
          )
          .then((response) => {
            let inventoryItems = response.data;
            outputPlayerInventoryData(inventoryItems);
            console.log(filtering);
          })
          .catch((error) => {
            throw error;
          });
      })

      .catch((error) => {
        throw error;
      });
  }

  function filteredPageSearch(pageAdjusment, filterCriteria) {
    setFiltering(true);
    filteringTest.current = true;
    console.log(`filteredPageSearch: ${filterCriteria}`);
    let tempCurrentPageNo = InventoryCurrPageNo + pageAdjusment;

    if (tempCurrentPageNo > InventoryMaxPageNo || tempCurrentPageNo <= 0) {
      return;
    } else {
      setInventoryCurrPageNo(tempCurrentPageNo);
      // AXIOS TO POST
      axios
        .post(
          `${STORAGE_API_HOST}/userInventoryPageFiltered/${userId}/${tempCurrentPageNo}`,
          { filterCriteria: filterCriteria },
          { headers: { "Content-Type": "application/json" } }
        )
        .then((response) => {
          let databaseOutput = response.data;
          outputPlayerInventoryData(databaseOutput);
        });
    } // AXIOS TO POST
  }

  const Checkbox = ({ label, value, onChange }) => {
    return (
      <label>
        <input type="checkbox" checked={value} onChange={onChange} />
        {label}
      </label>
    );
  };

  // EQUIP / UNEQUIP FUNCTIONS
  // ------------------------------------------- EQUIP / UNEQUIP -------------------------------------------
  function equip(equipmentType) {
    axios
      .get(`${STORAGE_API_HOST}/getInventory/${userId}`, config)
      .then((response) => {
        let EquippedInformation = response.data;
        console.log("Equip Start");
        console.log(EquippedInformation);

        playerEquipped_weapon = EquippedInformation.equipped_weapon;
        playerEquipped_armor = EquippedInformation.equipped_armor;

        wholeInventory = EquippedInformation.userbag;
        let bookmarkInventory = EquippedInformation.userbag;
        let gettingInfAorray = [];
        for (let i = 0; i < wholeInventory.length; i++) {
          gettingInfAorray.push(wholeInventory[i].id);
        }
        // NEED TO CONVERT THIS TO THE SPECIFIC ITEMS IT IS EQUIPPING SO PUT ANOTHER AXIOS

        axios
          .post(
            `${STORAGE_API_HOST}/getEquipmentInfo`,
            { equippedIds: gettingInfAorray },
            { headers: { "Content-Type": "application/json" } }
          )
          .then((response) => {
            let databaseOutput = response.data;
            let wholeInventory = databaseOutput;
            let itemToEquip = equipmentType;

            // UNEQUIP STARTS HERE
            // PRE-REQ: Get the information of the Item I am trying to equip
            // console.log(wholeInventory.length);
            for (let x = 0; x < wholeInventory.length; x++) {
              if (wholeInventory[x].item_id == itemToEquip) {
                console.log(wholeInventory[x]);
                itemToEquip = wholeInventory[x];
              }
            }
            // START EQUIPMENT EQUIP
            // SENARIO 1: There is no Equipment of that type Equipped.
            // >> Add the equipment to the user's equipment list
            switch (itemToEquip.item_stats.item_type) {
              case "Helmet":
                if (playerEquipped_armor.head == itemToEquip.item_id) {
                  console.log("Same Item equipped, Do nothing");
                  return;
                } else {
                  let itemToUnequip = playerEquipped_armor.head;
                  let updatedEquippedFormat = playerEquipped_armor;
                  updatedEquippedFormat.head = itemToEquip.item_id;
                  formatEquip(
                    "equipped_armor",
                    itemToEquip.item_id,
                    itemToUnequip,
                    updatedEquippedFormat,
                    bookmarkInventory
                  );
                }
                break;
              case "Body":
                if (playerEquipped_armor.body == itemToEquip.item_id) {
                  console.log("Same Item equipped, Do nothing");
                  return;
                } else {
                  let itemToUnequip = playerEquipped_armor.body;
                  let updatedEquippedFormat = playerEquipped_armor;
                  updatedEquippedFormat.body = itemToEquip.item_id;
                  formatEquip(
                    "equipped_armor",
                    itemToEquip.item_id,
                    itemToUnequip,
                    updatedEquippedFormat,
                    bookmarkInventory
                  );
                }
                break;
              case "Leggings":
                if (playerEquipped_armor.leggings == itemToEquip.item_id) {
                  console.log("Same Item equipped, Do nothing");
                  return;
                } else {
                  let itemToUnequip = playerEquipped_armor.leggings;
                  let updatedEquippedFormat = playerEquipped_armor;
                  updatedEquippedFormat.leggings = itemToEquip.item_id;
                  formatEquip(
                    "equipped_armor",
                    itemToEquip.item_id,
                    itemToUnequip,
                    updatedEquippedFormat,
                    bookmarkInventory
                  );
                }
                break;
              case "Boots":
                if (playerEquipped_armor.boots == itemToEquip.item_id) {
                  console.log("Same Item equipped, Do nothing");
                  return;
                } else {
                  let itemToUnequip = playerEquipped_armor.boots;
                  let updatedEquippedFormat = playerEquipped_armor;
                  updatedEquippedFormat.boots = itemToEquip.item_id;
                  formatEquip(
                    "equipped_armor",
                    itemToEquip.item_id,
                    itemToUnequip,
                    updatedEquippedFormat,
                    bookmarkInventory
                  );
                }
                break;
              case "Weapon":
                if (playerEquipped_weapon.weapon == itemToEquip.item_id) {
                  console.log("Same Item equipped, Do nothing");
                  return;
                } else {
                  let itemToUnequip = playerEquipped_weapon.weapon;
                  let updatedEquippedFormat = playerEquipped_weapon;
                  updatedEquippedFormat.weapon = itemToEquip.item_id;
                  formatEquip(
                    "equipped_weapon",
                    itemToEquip.item_id,
                    itemToUnequip,
                    updatedEquippedFormat,
                    bookmarkInventory
                  );
                }
                break;
              case "Shield":
                if (playerEquipped_weapon.shield == itemToEquip.item_id) {
                  console.log("Same Item equipped, Do nothing");
                  return;
                } else {
                  let itemToUnequip = playerEquipped_weapon.shield;
                  let updatedEquippedFormat = playerEquipped_weapon;
                  updatedEquippedFormat.shield = itemToEquip.item_id;
                  formatEquip(
                    "equipped_weapon",
                    itemToEquip.item_id,
                    itemToUnequip,
                    updatedEquippedFormat,
                    bookmarkInventory
                  );
                }
                break;
              case "Accessory":
                if (playerEquipped_weapon.accessory == itemToEquip.item_id) {
                  console.log("Same Item equipped, Do nothing");
                  return;
                } else {
                  let itemToUnequip = playerEquipped_weapon.accessory;
                  let updatedEquippedFormat = playerEquipped_weapon;
                  updatedEquippedFormat.accessory = itemToEquip.item_id;
                  formatEquip(
                    "equipped_weapon",
                    itemToEquip.item_id,
                    itemToUnequip,
                    updatedEquippedFormat,
                    bookmarkInventory
                  );
                }
                break;
              default:
                break;
            }
          })
          .catch((error) => {
            throw error;
          });
      })
      .catch((error) => {
        throw error;
      });
  }
  function formatEquip(
    equipTyping,
    equippedItem,
    itemToUnequip,
    updatedEquippedFormat,
    wholeInventory
  ) {
    let usersInventory = wholeInventory;
    if (itemToUnequip == null) {
      console.log("No item to unequip");
      // console.log("Data Exists, Editing...")
      for (let x = 0; x < usersInventory.length; x++) {
        if (usersInventory[x].id == equippedItem) {
          usersInventory[x].Quant -= 1;
          if (usersInventory[x].Quant == 0) {
            // console.log("Quant is 0, removing from inventory")
            // console.log(usersInventory[x])
            usersInventory.splice(x, 1);
          }
        }
      }
      sendUpdatedEquipmentInventory(
        equipTyping,
        updatedEquippedFormat,
        usersInventory
      );
    } else {
      console.log("Item to unequip exists > unequipping..");
      const Searching = usersInventory.filter(
        (usersInventory) => usersInventory.id === itemToUnequip
      );
      // if searching.length == 1 then the item exists
      console.log(Searching);
      // Senario 1: Item exists in inventory
      // >> item to unequip + 1
      // >> item to equip - 1 (Later On)
      if (Searching.length == 1) {
        console.log("Data Exists, Editing...");
        for (let x = 0; x < usersInventory.length; x++) {
          if (usersInventory[x].id == itemToUnequip) {
            usersInventory[x].Quant += 1;
          }
        }
      }
      // Senario 2: Item does not exist in inventory
      // >> append New Item to inventory
      // >> item to equip - 1 (Later On)
      else {
        usersInventory.push({ id: itemToUnequip, Quant: 1 });
        console.log("Edited Data");
        console.log(usersInventory);
      }

      // >> item to equip - 1 (Later On)
      for (let x = 0; x < usersInventory.length; x++) {
        if (usersInventory[x].id == equippedItem) {
          usersInventory[x].Quant -= 1;
          if (usersInventory[x].Quant == 0) {
            // console.log("Quant is 0, removing from inventory")
            // console.log(usersInventory[x])
            usersInventory.splice(x, 1);
          }
        }
      }
      sendUpdatedEquipmentInventory(
        equipTyping,
        updatedEquippedFormat,
        usersInventory
      );
    }
  }

  function unequip(equipmentType) {
    // console.log(equipment);
    // console.log(playerEquipped_weapon);
    // console.log(playerEquipped_armor);
    let unequippedItem = "";
    switch (equipmentType) {
      case "helmet":
        // console.log("unequipping Helmet")
        unequippedItem = playerEquipped_armor.head;
        playerEquipped_armor.head = null;
        formatUnequip("equipped_armor", unequippedItem, playerEquipped_armor);

        break;
      case "body":
        unequippedItem = playerEquipped_armor.body;
        playerEquipped_armor.body = null;
        formatUnequip("equipped_armor", unequippedItem, playerEquipped_armor);
        break;
      case "leggings":
        unequippedItem = playerEquipped_armor.leggings;
        playerEquipped_armor.leggings = null;
        formatUnequip("equipped_armor", unequippedItem, playerEquipped_armor);

        break;
      case "boots":
        unequippedItem = playerEquipped_armor.boots;
        playerEquipped_armor.boots = null;
        formatUnequip("equipped_armor", unequippedItem, playerEquipped_armor);

        break;
      case "weapon":
        // console.log("unequipping Weapon")
        unequippedItem = playerEquipped_weapon.weapon;
        playerEquipped_weapon.weapon = null;
        formatUnequip("equipped_weapon", unequippedItem, playerEquipped_weapon);
        break;
      case "shield":
        unequippedItem = playerEquipped_weapon.shield;
        playerEquipped_weapon.shield = null;
        formatUnequip("equipped_weapon", unequippedItem, playerEquipped_weapon);

        break;
      case "accessory":
        unequippedItem = playerEquipped_weapon.accessory;
        playerEquipped_weapon.accessory = null;
        formatUnequip("equipped_weapon", unequippedItem, playerEquipped_weapon);
        break;
      default:
        return;
    }
  }

  function formatUnequip(equipTyping, unequippedItem, updatedEquippedFormat) {
    axios
      .get(`${STORAGE_API_HOST}/getInventory/${userId}`, config)
      .then((response) => {
        let EquippedInformation = response.data;
        console.log("Equip Start");
        console.log(EquippedInformation);

        playerEquipped_weapon = EquippedInformation.equipped_weapon;
        playerEquipped_armor = EquippedInformation.equipped_armor;

        wholeInventory = EquippedInformation.userbag;

        // NEED TO CONVERT THIS TO THE SPECIFIC ITEMS IT IS EQUIPPING SO PUT ANOTHER AXIOS
        const Searching = wholeInventory.filter(
          (wholeInventory) => wholeInventory.id === unequippedItem
        );
        // console.log(Searching);
        if (Searching.length === 1) {
          console.log("Data Exists, Editing...");
          wholeInventory.forEach(function (item) {
            if (item.id === unequippedItem) {
              item.Quant += 1;
            }
          });
        } else {
          console.log("Data Does Not Exist, Adding...");
          console.log(unequippedItem);
          wholeInventory.push({ id: unequippedItem, Quant: 1 });
          console.log("Edited Data");
          console.log(wholeInventory);
        }
        sendUpdatedEquipmentInventory(
          equipTyping,
          updatedEquippedFormat,
          wholeInventory
        );
      })
      .catch((error) => {
        throw error;
      });
  }
  // AXIOS FUCNTION                       |--- equipped.armor/ equipped.weapon
  //                                      |                 |--- formating. for equipped.armor / equipped.weapon
  //                                      |                 |             |--- formatting for inventory
  function sendUpdatedEquipmentInventory(
    equipTyping,
    equipmentFormat,
    usersInventory
  ) {
    let data = {
      equipmentFormat: equipmentFormat,
      equipTyping: equipTyping,
      usersInventory: usersInventory,
    };
    console.log(data);
    axios
      .put(
        `${STORAGE_API_HOST}/updateInventoryAndequipment/${userId} `,
        { data: data },
        config
      )
      .then((response) => {
        console.log(filteringTest.current);
        let areYouFiltering = filteringTest.current;
        ReadyPlayerEquippedData();
        if (areYouFiltering) {
          submitSearchCriteria();
          console.log("Yes Filtering");
        } else {
          ReadyPlayerInventoryData();
          console.log("No Filtering ");
        }
      })
      .catch((error) => {
        throw error;
      });
  }

  // ----- RENDER -----
  return (
    <main className="Background">
      <NavBar />
      <div className="Inventory-Container">
        <div className="Top">
          <div className="Equipped-Section">
            <div className="Equipped-Header">
              <div className="Equipped-Title">
                <h1>Your Equipped Equipment</h1>
              </div>
              <div className="Equipped-Body">{playerEquipment}</div>
            </div>
          </div>
          {/* STAT SELETIONS NEEDS 2 PARTS, add stats and stats display */}
          <div className="Stats-Section">
            <div className="Stats-Information-Container">
              <div className="player-info">
                <h1>{playerName}</h1>
                <h2>Level: {playerLevel}</h2>
                <h2 id="PlayerExp">
                  Exp: {playerCurrExp} / {playerMaxExp}
                </h2>
                <h2 id="PlayerGold">Gold: {playerGold} </h2>
              </div>
              <div className="player-stats">
                <div className="player-stats-window">
                  <h2>Assign Stat points</h2>
                  <h2 id="PlayerPoints">Owned Points: {playerStatPoints}</h2>
                  <div className="PlayerStats">
                    <div className="statPt">
                      <h2 id="player-strength">
                        STR: {StatStrength} {EquipStrength}{" "}
                        <button
                          className="AddStatButton"
                          onClick={() => loadMenu("Strength")}
                        >
                          Add
                        </button>
                      </h2>
                    </div>
                    <div className="statPt">
                      <h2 id="player-agility">
                        AGI: {StatAgility} {EquipAgility}{" "}
                        <button
                          className="AddStatButton"
                          onClick={() => loadMenu("Agility")}
                        >
                          Add
                        </button>
                      </h2>
                    </div>
                    <div className="statPt">
                      <h2 id="player-vitality">
                        VIT: {StatVitality} {EquipVitality}{" "}
                        <button
                          className="AddStatButton"
                          onClick={() => loadMenu("Vitality")}
                        >
                          Add
                        </button>
                      </h2>
                    </div>
                    <div className="statPt">
                      <h2 id="player-defense">
                        DEF: {StatDefense} {EquipDefense}{" "}
                        <button
                          className="AddStatButton"
                          onClick={() => loadMenu("Defence")}
                        >
                          Add
                        </button>
                      </h2>
                    </div>
                    <div className="statPt">
                      <h2 id="player-luck">
                        LUK: {StatLuck} {EquipLuck}{" "}
                        <button
                          className="AddStatButton"
                          onClick={() => loadMenu("Luck")}
                        >
                          Add
                        </button>
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="Stats-Add-Container">{playerStatsPage}</div>
          </div>
        </div>
        <div className="bottom">
          <div className="Inventory-Section">
            <div className="Inventory-Section-columns">
              <div className="GroupedSearchBarFilter">
                <div className="Inventory-Section-Search">
                  <div className="Inventory-Section-Search-Filter">
                    <label for="gsearch">
                      {" "}
                      <h1>Search for all</h1>{" "}
                    </label>
                    <button
                      className="AddStatButton"
                      onClick={() => ReadyPlayerInventoryData()}
                    >
                      Search
                    </button>
                  </div>
                  <div className="Inventory-Section-Search-Filter">
                    <h1>Armor</h1>
                    <Checkbox
                      label="Helmet"
                      value={isHelmetChecked}
                      onChange={() => setIsHelmetChecked(!isHelmetChecked)}
                    />
                    <Checkbox
                      label="Body"
                      value={isBodyChecked}
                      onChange={() => setIsBodyChecked(!isBodyChecked)}
                    />
                    <Checkbox
                      label="Leggings"
                      value={isLeggingsChecked}
                      onChange={() => setIsLeggingsChecked(!isLeggingsChecked)}
                    />
                    <Checkbox
                      label="Boots"
                      value={isBootsChecked}
                      onChange={() => setIsBootsChecked(!isBootsChecked)}
                    />
                  </div>
                  <div className="Inventory-Section-Search-Filter">
                    <h1>Equipment</h1>
                    <Checkbox
                      label="Weapon"
                      value={isWeaponChecked}
                      onChange={() => setIsWeaponChecked(!isWeaponChecked)}
                    />
                    <Checkbox
                      label="Shield"
                      value={isShieldChecked}
                      onChange={() => setIsShieldChecked(!isShieldChecked)}
                    />
                    <Checkbox
                      label="Accessory"
                      value={isAccessoryChecked}
                      onChange={() =>
                        setIsAccessoryChecked(!isAccessoryChecked)
                      }
                    />
                  </div>
                  <div className="Inventory-Section-Search-Filter">
                    <h1>Material</h1>
                    <Checkbox
                      label="Material"
                      value={isMaterialChecked}
                      onChange={() => setIsMaterialChecked(!isMaterialChecked)}
                    />
                    <input
                      type="submit"
                      value="Submit search Criteria"
                      id="FilterSearch"
                      onClick={() => submitSearchCriteria()}
                    />
                  </div>
                </div>
              </div>
              <div>
                <div className="Inventory-Display">{inventoryDisplay}</div>
                <div className="Inventory-PageControls">
                  <h1>
                    <input
                      type="submit"
                      value="back"
                      id="AllSearch"
                      onClick={() => prevPage()}
                    />{" "}
                    {InventoryCurrPageNo} / {InventoryMaxPageNo}{" "}
                    <input
                      type="submit"
                      value="Next"
                      id="AllSearch"
                      onClick={() => nextPage()}
                    />
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default InventoryScreen;
