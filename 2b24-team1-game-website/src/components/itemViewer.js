import React, { useEffect, useState, useRef } from "react";
import "../css/singleFunctionClasses.css";
import "../css/itemViewerEditor.css";
import axios from "axios";

export function ArchivePageSwap({}) {
  var count = 0;
  var allItemData = {};

  const [currentState, setCurrentState] = useState("itemEditor");
  // ------------------------------------------------------
  // All useState()'s
  // ------------------------------------------------------
  const buttonSet = (
    <div className="w-full display-flex-c justify-content-center align-items-center text-align-center">
      <a className="bold-txt-large">
        Click To Swap The Category Of Stuff You Wish To Look At
      </a>
      <br />
      <div className="w-full display-flex justify-content-center align-items-center">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setCurrentState("itemEditor")}
        >
          Items
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setCurrentState("enemyEditor")}
        >
          Enemies
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setCurrentState("eventEditor")}
        >
          Events
        </button>
      </div>
    </div>
  );

  // ----------------------------------------
  // For Items
  // ----------------------------------------
  var item__ID = useRef(0);
  var enemy__ID = useRef(0);
  var event__ID = useRef(0);
  const [itemAdminButton, setItemAdminButton] = useState();
  const [itemName, setItemName] = useState("No Item Selected");
  const [itemAtk, setItemAtk] = useState("");
  const [itemDef, setItemDef] = useState("");
  const [itemAgil, setItemAgil] = useState("");
  const [itemVit, setItemVit] = useState("");
  const [itemMarketPrice, setItemMarketPrice] = useState("");
  const [itemType, setItemType] = useState("");
  const [itemImg, setItemImg] = useState("");
  const [itemImgURL, setItemImgURL] = useState("");
  const [itemDesc, setItemDesc] = useState("");
  // const itemlist = useRef(emp);
  // ----------------------------------------
  // For enemies
  // ----------------------------------------
  const [enemyAdminButton, setEnemyAdminButton] = useState();
  const [enemyName, setEnemyName] = useState("No Enemy Selected");
  const [enemyAtk, setEnemyAtk] = useState("");
  const [enemyDef, setEnemyDef] = useState("");
  const [enemyDodge, setEnemyDodge] = useState("");
  const [enemyMaxHealth, setEnemyMaxHealth] = useState("");
  const [enemyGold, setEnemyGold] = useState(0);
  const [enemyExp, setEnemyExp] = useState(0);
  const [enemyItemID, setEnemyItemID] = useState(0);
  const [enemyQuant, setEnemyQuant] = useState(0);
  const [enemyDialogue, setEnemyDialogue] = useState("");
  const [enemyOccurance, setEnemyOccurance] = useState("");
  const [enemyArea, setEnemyArea] = useState("");
  const [enemyImg, setEnemyImg] = useState("");
  const [enemyImgURL, setEnemyImgURL] = useState("");
  // ----------------------------------------
  // For events
  // ----------------------------------------  const [enemyName, setEnemyName] = useState("");
  const [eventAdminButton, setEventAdminButton] = useState();
  const [eventName, setEventName] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [eventEffect, setEventEffect] = useState("No");
  const [eventItemID, setEventItemID] = useState(0);
  const [eventQuant, setEventQuant] = useState(0);
  const [eventOccurance, setEventOccurance] = useState("");
  const [eventArea, setEventArea] = useState("");
  const [eventGnrItem, setEventGnrItem] = useState("");

  // ------------------------------------------------------

  var tempStoredItemData = useRef({});
  var tempStoredEnemyData = useRef({});
  var tempStoredEventData = useRef({});

  var itemData = {};
  var enemyData = {};
  var eventData = {};

  const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === `127.0.0.1`;
  const STORAGE_API_HOST = isLocalhost
    ? "http://localhost:3000"
    : "https://tranquil-chamber-55751.herokuapp.com";

  function updateItemStates() {
    if (currentState == "itemEditor") {
      item__ID.current = document.querySelector("#itemList").value;
    }

    axios
      .get(`${STORAGE_API_HOST}/getItemInfo/${item__ID.current}`)
      .then((response) => {
        return response.data;
      })
      .then((itemData) => {
        tempStoredItemData = itemData;
        setItemStates();
      })
      .catch((error) => {
        throw error;
      })
      .finally();
  }

  function setItemStates() {
    if (item__ID.current == 0) {
      setItemImg("");
      setItemImgURL("");
      setItemName("");
      setItemType("Material");
      setItemDesc("");
      setItemMarketPrice(0);
      setItemAtk("No stats, this item is a material");
      setItemDef("No stats, this item is a material");
      setItemAgil("No stats, this item is a material");
      setItemVit("No stats, this item is a material");
    } else {
      setItemImg(
        <img
          src={`${STORAGE_API_HOST}/itemImage/${tempStoredItemData.item_id}`}
          id="imageShown"
        />
      );
      setItemImgURL(tempStoredItemData.image_link);
      setItemName(tempStoredItemData.itemname);
      setItemType(tempStoredItemData.item_stats.item_type);
      setItemDesc(tempStoredItemData.itemdesc);
      setItemMarketPrice(tempStoredItemData.item_stats.item_price);
      if (tempStoredItemData.item_stats.item_type != "Material") {
        setItemAtk(tempStoredItemData.item_stats.item_stats.strength);
        setItemDef(tempStoredItemData.item_stats.item_stats.defense);
        setItemAgil(tempStoredItemData.item_stats.item_stats.agility);
        setItemVit(tempStoredItemData.item_stats.item_stats.vitality);
      } else {
        setItemAtk("No stats, this item is a material");
        setItemDef("No stats, this item is a material");
        setItemAgil("No stats, this item is a material");
        setItemVit("No stats, this item is a material");
      }
    }
  }

  function updateEnemyStates() {
    if (currentState == "enemyEditor") {
      enemy__ID.current = document.querySelector("#enemyList").value;
    }

    axios
      .get(`${STORAGE_API_HOST}/enemy_listing/${enemy__ID.current}`)
      .then((response) => {
        return response.data;
      })
      .then((enemyData) => {
        tempStoredEnemyData = enemyData;
        setEnemyStates(tempStoredEnemyData);
      })
      .catch((error) => {
        throw error;
      })
      .finally();
  }

  function setEnemyStates(tempStoredData) {
    console.log(tempStoredData);
    if (enemy__ID.current != 0) {
      setEnemyImg(
        <img
          src={`${STORAGE_API_HOST}/enemyImage/${tempStoredData.enemy_id}`}
          id="imageShown"
        />
      );
      setEnemyImgURL(tempStoredData.image_link);
      setEnemyName(tempStoredData.enemy_name);
      setEnemyArea(tempStoredData.enemy_area);
      setEnemyDialogue(tempStoredData.enemy_dialogue);
      setEnemyGold(tempStoredData.enemy_loottable.gold);
      setEnemyExp(tempStoredData.enemy_loottable.xp);
      setEnemyItemID(tempStoredData.enemy_loot.id);
      setEnemyQuant(tempStoredData.enemy_loot.Quant);
      setEnemyAtk(tempStoredData.enemy_attack);
      setEnemyDef(tempStoredData.enemy_defense);
      setEnemyDodge(tempStoredData.enemy_dodge);
      setEnemyMaxHealth(tempStoredData.enemy_maxhealth);
      setEnemyOccurance(tempStoredData.occurance);
    } else {
      setEnemyImg("");
      setEnemyImgURL("");
      setEnemyName("");
      setEnemyArea("");
      setEnemyDialogue("");
      setEnemyGold("");
      setEnemyExp("");
      setEnemyItemID("");
      setEnemyQuant("");
      setEnemyAtk("");
      setEnemyDef("");
      setEnemyDodge("");
      setEnemyMaxHealth("");
      setEnemyOccurance("");
    }
  }

  function updateEventStates() {
    if (currentState == "eventEditor") {
      event__ID.current = document.querySelector("#eventList").value;
    }
    console.log(event__ID.current);
    axios
      .get(`${STORAGE_API_HOST}/event_listing/${event__ID.current}`)
      .then((response) => {
        return response.data;
      })
      .then((eventData) => {
        tempStoredEventData.current = eventData;
        setEventStates(tempStoredEventData.current);
      })
      .catch((error) => {
        throw error;
      })
      .finally();
  }

  function setEventStates(tempStoredData) {
    if (event__ID.current != 0) {
      setEventName(tempStoredData.event_name);
      setEventDesc(tempStoredData.event_description);
      if (tempStoredData.event_effect == "Generate random enemy") {
        setEventEffect("Yes");
        setEventItemID("N.A.");
        setEventQuant("N.A.");
      } else {
        setEventEffect("No");
        setEventItemID(tempStoredData.event_effect.id);
        setEventQuant(tempStoredData.event_effect.Quant);
      }
      setEventOccurance(tempStoredData.occurance);
      setEventArea(tempStoredData.event_area);
    } else {
      setEventName("Gen");
      setEventDesc("");
      setEventEffect("Yes");
      setEventItemID("N.A.");
      setEventQuant("N.A.");
      setEventOccurance(0);
      setEventArea("forest");
    }
  }

  useEffect(() => {
    if (currentState == "itemEditor") {
      axios
        .get(`${STORAGE_API_HOST}/getItemInfo_all`)
        .then((response) => {
          return response.data;
        })
        .then((data) => {
          itemData = data;
          document.querySelector("#itemList").innerHTML = "";
          itemData.forEach((element) => {
            document.querySelector(
              "#itemList"
            ).innerHTML += `<option value="${element.item_id}"> ${element.itemname} </option>`;
          });
          count += 1;
        })
        .catch((error) => {
          throw error;
        })
        .finally();
      if (localStorage.getItem("role") == "Admin") {
        setItemAdminButton(
          <div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setCurrentState("itemEditorActive")}
            >
              Edit
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                item__ID.current = 0;
                setItemStates();
                setCurrentState("itemEditorActive");
              }}
            >
              Create New Item
            </button>
          </div>
        );
      }
      return;
    }
    if (currentState == "itemEditorActive") {
      document
        .querySelector("#itemEditForm")
        .addEventListener("submit", (event) => {
          event.preventDefault();

          if (document.querySelector("#iType").value != "Material") {
            var item_data_new = {
              itemname: document.querySelector("#iname").value,
              itemdesc: document.querySelector("#idesc").value,
              item_stats: {
                item_type: document.querySelector("#iType").value,
                item_price: document.querySelector("#iprice").value,
                item_stats: {
                  strength: document.querySelector("#iattk").value,
                  defense: document.querySelector("#idef").value,
                  agility: document.querySelector("#idodge").value,
                  vitality: document.querySelector("#imax").value,
                },
              },
            };
          } else {
            var item_data_new = {
              itemname: document.querySelector("#iname").value,
              itemdesc: document.querySelector("#idesc").value,
              item_stats: {
                item_type: document.querySelector("#iType").value,
                item_price: document.querySelector("#iprice").value,
              },
            };
          }

          var bodyFormData = new FormData();
          if (document.querySelector("#iimg").files.length != 0) {
            bodyFormData.append(
              "image",
              document.querySelector("#iimg").files[0]
            );
          }

          if (item__ID.current == 0) {
            axios
              .post(`${STORAGE_API_HOST}/create_item`, item_data_new)
              .then((response) => {
                axios
                  .put(
                    `${STORAGE_API_HOST}/create_item/upload/${parseInt(
                      response.data
                    )}`,
                    bodyFormData,
                    {
                      "Content-Type": "multipart/form-data",
                    }
                  )
                  .then((response) => {
                    return alert("Item Image Successfully Uploaded");
                  })
                  .catch((error) => {
                    alert("No new image detected");
                    throw error;
                  })
                  .finally();
                return alert("Item Successfully Created");
              })
              .catch((error) => {
                throw error;
              })
              .finally();
          } else {
            axios
              .put(
                `${STORAGE_API_HOST}/updateItem/${item__ID.current}`,
                item_data_new
              )
              .then((response) => {
                axios
                  .put(
                    `${STORAGE_API_HOST}/create_item/upload/${item__ID.current}`,
                    bodyFormData,
                    {
                      "Content-Type": "multipart/form-data",
                    }
                  )
                  .then((response) => {
                    return alert("Item Image Successfully Uploaded");
                  })
                  .catch((error) => {
                    alert("No new image detected");
                    throw error;
                  })
                  .finally();
                return alert("Item Successfully Updated");
              })
              .catch((error) => {
                throw error;
              })
              .finally();
          }
        });
      document
        .querySelector("#itemEditForm")
        .addEventListener("reset", (event) => {
          event.preventDefault();
          updateItemStates();
        });
      return;
    }

    if (currentState == "enemyEditor") {
      axios
        .get(`${STORAGE_API_HOST}/enemy_listing_all`)
        .then((response) => {
          return response.data;
        })
        .then((data) => {
          enemyData = data;
          document.querySelector("#enemyList").innerHTML = "";
          enemyData.forEach((element) => {
            document.querySelector(
              "#enemyList"
            ).innerHTML += `<option value="${element.enemy_id}"> ${element.enemy_name} </option>`;
          });
          count += 1;
        })
        .catch((error) => {
          throw error;
        })
        .finally();
      if (localStorage.getItem("role") == "Admin") {
        setEnemyAdminButton(
          <div className="display-flex flex-d1 justify-content-center align-items-center">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setCurrentState("enemyEditorActive");
              }}
            >
              Edit
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                enemy__ID.current = 0;
                setEnemyStates();
                setCurrentState("enemyEditorActive");
              }}
            >
              Create New Item
            </button>
          </div>
        );
      }
      return;
    }
    if (currentState == "enemyEditorActive") {
      axios
        .get(`${STORAGE_API_HOST}/getItemInfo_all`)
        .then((response) => {
          return response.data;
        })
        .then((data) => {
          itemData = data;
          document.querySelector("#enemyItemDropList").innerHTML = "";
          itemData.forEach((element) => {
            document.querySelector(
              "#enemyItemDropList"
            ).innerHTML += `<option value="${element.item_id}"> ${element.itemname} </option>`;
          });

          count += 1;
        })
        .catch((error) => {
          throw error;
        })
        .finally();
      document
        .querySelector("#enemyEditForm")
        .addEventListener("submit", (event) => {
          event.preventDefault();

          var enemy_data_new = {
            enemy_name: document.querySelector("#ename").value,
            enemy_attack: document.querySelector("#eattk").value,
            enemy_dodge: document.querySelector("#edodge").value,
            enemy_defense: document.querySelector("#edef").value,
            enemy_maxhealth: document.querySelector("#emax").value,
            enemy_dialogue: document.querySelector("#edialogue").value,
            occurance: document.querySelector("#enoccur").value,
            enemy_area: document.querySelector("#areaoptions").value,
            enemy_loot: {
              id: document.querySelector("#enemyItemDropList").value,
              Quant: document.querySelector("#enQuant").value,
            },
            enemy_loottable: {
              gold: document.querySelector("#engold").value,
              xp: document.querySelector("#enxp").value,
            },
          };

          var bodyFormData = new FormData();
          if (document.querySelector("#eimg").files.length != 0) {
            bodyFormData.append(
              "image",
              document.querySelector("#eimg").files[0]
            );
          }
          if (enemy__ID.current == 0) {
            axios
              .post(`${STORAGE_API_HOST}/enemy_editor`, enemy_data_new)
              .then((response) => {
                axios
                  .put(
                    `${STORAGE_API_HOST}/enemy_listing/upload/${parseInt(
                      response.data
                    )}`,
                    bodyFormData,
                    {
                      "Content-Type": "multipart/form-data",
                    }
                  )
                  .then((response) => {
                    return alert("Enemy Image Successfully Uploaded");
                  })
                  .catch((error) => {
                    alert("No new image detected");
                    throw error;
                  })
                  .finally();
                setCurrentState("enemyEditor");
                return alert("Enemy Successfully Created");
              })
              .catch((error) => {
                throw error;
              })
              .finally();
          } else {
            axios
              .put(
                `${STORAGE_API_HOST}/enemyUpdate/${enemy__ID.current}`,
                enemy_data_new
              )
              .then((response) => {
                axios
                  .put(
                    `${STORAGE_API_HOST}/enemy_listing/upload/${enemy__ID.current}`,
                    bodyFormData,
                    {
                      "Content-Type": "multipart/form-data",
                    }
                  )
                  .then((response) => {
                    return alert("Enemy Image Successfully Uploaded");
                  })
                  .catch((error) => {
                    alert("No new image detected");
                    throw error;
                  })
                  .finally();
                setCurrentState("enemyEditor");
                return alert("Enemy Successfully Updated");
              })
              .catch((error) => {
                throw error;
              })
              .finally();
          }
        });
      document
        .querySelector("#enemyEditForm")
        .addEventListener("reset", (event) => {
          event.preventDefault();
          updateEnemyStates();
        });
      return;
    }

    if (currentState == "eventEditor") {
      axios
        .get(`${STORAGE_API_HOST}/event_listing_all`)
        .then((response) => {
          return response.data;
        })
        .then((data) => {
          eventData = data;
          document.querySelector("#eventList").innerHTML = "";
          eventData.forEach((element) => {
            document.querySelector(
              "#eventList"
            ).innerHTML += `<option value="${element.event_id}"> ${element.event_name} </option>`;
          });
          count += 1;
        })
        .catch((error) => {
          throw error;
        })
        .finally();
      if (localStorage.getItem("role") == "Admin") {
        setEventAdminButton(
          <div className="display-flex flex-d1 bold-txt-large justify-content-center align-items-center">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setCurrentState("eventEditorActive")}
            >
              Edit
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                event__ID.current = 0;
                setEventStates();
                setCurrentState("eventEditorActive");
              }}
            >
              Create New Item
            </button>
          </div>
        );
      }

      return;
    }
    if (currentState == "eventEditorActive") {
      axios
        .get(`${STORAGE_API_HOST}/getItemInfo_all`)
        .then((response) => {
          return response.data;
        })
        .then((data) => {
          itemData = data;
          document.querySelector("#eventItemDropList").innerHTML = "";
          itemData.forEach((element) => {
            document.querySelector(
              "#eventItemDropList"
            ).innerHTML += `<option value="${element.item_id}"> ${element.itemname} </option>`;
          });
          document.querySelector(
            "#eventItemDropList"
          ).innerHTML += `<option value="Generate random enemy"> Generate random enemy </option>`;
          count += 1;
        })
        .catch((error) => {
          throw error;
        })
        .finally();
      document
        .querySelector("#eventEditForm")
        .addEventListener("submit", (event) => {
          event.preventDefault();

          if (
            document.querySelector("#eventItemDropList").value !=
            "Generate random enemy"
          ) {
            var event_data_new = {
              event_name: document.querySelector("#evname").value,
              event_description: document.querySelector("#evdesc").value,
              event_effect: {
                id: parseInt(
                  document.querySelector("#eventItemDropList").value
                ),
                Quant: parseInt(document.querySelector("#evquant").value),
              },
              event_area: document.querySelector("#areaoptions").value,
              occurance: document.querySelector("#evoccur").value,
            };
          } else {
            var event_data_new = {
              event_name: document.querySelector("#evname").value,
              event_description: document.querySelector("#evdesc").value,
              event_effect: document.querySelector("#eventItemDropList").value,
              event_area: document.querySelector("#areaoptions").value,
              occurance: document.querySelector("#evoccur").value,
            };
          }
          if (event__ID.current == 0) {
            axios
              .post(`${STORAGE_API_HOST}/create_event`, event_data_new)
              .then((response) => {
                setCurrentState("eventEditor");
                return alert("Event Successfully Created");
              })
              .catch((error) => {
                throw error;
              })
              .finally();
          } else {
            axios
              .put(
                `${STORAGE_API_HOST}/eventUpdate/${event__ID.current}`,
                event_data_new
              )
              .then((response) => {
                setCurrentState("eventEditor");
                return alert("Event Successfully Updated");
              })
              .catch((error) => {
                throw error;
              })
              .finally();
          }
        });
      document
        .querySelector("#eventEditForm")
        .addEventListener("reset", (event) => {
          event.preventDefault();
          updateEventStates();
        });
      return;
    }
  }, [currentState]);

  switch (currentState) {
    case "itemEditor":
      return (
        <div id="volatile">
          <select id="itemList" onChange={updateItemStates}></select>
          <div
            className="display-flex-c h-full w-full justify-content-center align-items-center"
            id="viewerBox"
          >
            <div className="flex-d1" id="formatBox">
              <div className="display-flex-c flex-d1 justify-content-center align-items-center bold-txt-large">
                {itemName}:
                <br />
                {itemImg}
                <div className="bold-txt-small">{itemImgURL}</div>
              </div>
              <div
                className="display-flex-c flex-d1 bold-txt-large w-full h-full"
                id="statDisplayBox"
              >
                <br />
                <div className="display-flex flex-d1 justify-content-center align-items-center">
                  Item Attack: {itemAtk}
                </div>
                <div className="display-flex flex-d1 justify-content-center align-items-center">
                  Item Defense: {itemDef}
                </div>
                <div className="display-flex flex-d1 justify-content-center align-items-center">
                  Item Agility: {itemAgil}
                </div>
                <div className="display-flex flex-d1 justify-content-center align-items-center">
                  Item Vitality: {itemVit}
                </div>
                <br />
              </div>
            </div>
            <div className="display-flex-c flex-d1 bold-txt-large justify-content-center align-items-center">
              Item Type: {itemType}
              <br />
              Base Price: {itemMarketPrice}
              <br />
              Item Description: {itemDesc}
              <br />
              {itemAdminButton}
            </div>
            {buttonSet}
            <div className="flex-d1" />
          </div>
        </div>
      );
    case "itemEditorActive":
      var itemStatsDiv = (
        <div className="display-flex-c flex-d1 justify-content-center align-items-center">
          <label className="bold-txt-large">Item Stats:</label>
          <div className="display-flex flex-d1 bold-txt-large statContainment align-items-center justify-content-between">
            <label>Attack: </label>
            <input
              className="inputBox"
              type="number"
              id="iattk"
              value={`${itemAtk}`}
              onChange={(e) => {
                checkItemMat();
                setItemAtk(e.target.value);
              }}
            />
          </div>
          <div className="display-flex flex-d1 bold-txt-large statContainment align-items-center justify-content-between">
            <label>Defense: </label>
            <input
              className="inputBox"
              type="number"
              id="idef"
              value={`${itemDef}`}
              onChange={(e) => {
                checkItemMat();
                setItemDef(e.target.value);
              }}
            />
          </div>
          <div className="display-flex flex-d1 bold-txt-large statContainment align-items-center justify-content-between">
            <label>Agility: </label>
            <input
              className="inputBox"
              type="number"
              id="idodge"
              value={`${itemAgil}`}
              onChange={(e) => {
                checkItemMat();
                setItemAgil(e.target.value);
              }}
            />
          </div>
          <div className="display-flex flex-d1 bold-txt-large statContainment align-items-center justify-content-between">
            <label>Vitality: </label>
            <input
              className="inputBox"
              type="number"
              id="imax"
              value={`${itemVit}`}
              onChange={(e) => {
                checkItemMat();
                setItemVit(e.target.value);
              }}
            />
          </div>
        </div>
      );
      var itemTypeInput = (
        <div className="display-flex-c flex-d1 justify-content-center align-items-center">
          <label className="bold-txt-large">Item Typing</label>
          <select
            id="iType"
            name="itemType"
            defaultValue={itemType}
            onChange={(e) => {
              checkItemMat();
              setItemType(e.target.value);
            }}
          >
            <option value="Material">Material</option>
            <option value="Helmet">Helmet</option>
            <option value="Body">Body</option>
            <option value="Leggings">Leggings</option>
            <option value="Boots">Boots</option>
            <option value="Weapon">Weapon</option>
            <option value="Leggings">Shield</option>
            <option value="Boots">Accessory</option>
          </select>
        </div>
      );
      function checkItemMat() {
        if (document.querySelector("#iType").value == "Material") {
          document.querySelector("#iattk").disabled = true;
          document.querySelector("#idef").disabled = true;
          document.querySelector("#idodge").disabled = true;
          document.querySelector("#imax").disabled = true;
        } else {
          document.querySelector("#iattk").disabled = false;
          document.querySelector("#idef").disabled = false;
          document.querySelector("#idodge").disabled = false;
          document.querySelector("#imax").disabled = false;
        }
      }

      return (
        <div id="volatile">
          <form className="display-flex w-full h-full" id="itemEditForm">
            <label className="bold-txt-large">!!^^!! Editing Item !!^^!!</label>

            <div className="display-flex flex-d1 justify-content-center align-items-center bold-txt-large">
              <label>Name: </label>
              <input
                type="text"
                id="iname"
                value={`${itemName}`}
                onChange={(e) => {
                  checkItemMat();
                  setItemName(e.target.value);
                }}
              />
            </div>

            <div className="display-flex-c flex-d1 justify-content-between align-items-center bold-txt-large">
              <label>Item's Description: </label>
              <textarea
                type="text"
                id="idesc"
                value={itemDesc}
                onChange={(e) => {
                  checkItemMat();
                  setItemDesc(e.target.value);
                }}
              />
            </div>

            {itemStatsDiv}
            {itemTypeInput}
            <div className="display-flex flex-d1 justify-content-between align-items-center bold-txt-large">
              <label>Item Base Price: </label>
              <input
                className="inputBox"
                type="number"
                id="iprice"
                value={itemMarketPrice}
                onChange={(e) => {
                  checkItemMat();
                  setItemMarketPrice(e.target.value);
                }}
              />
            </div>
            <div className="display-flex-c flex-d1 justify-content-between align-items-center bold-txt-large">
              {itemImg}
            </div>
            <div className="display-flex-c flex-d1 justify-content-between align-items-center bold-txt-large">
              <label>Image URL: {itemImgURL}</label>
              <input
                className="inputBox"
                type="file"
                id="iimg"
                onChange={(e) => {
                  checkItemMat();
                  setItemImgURL(e.target.value);
                }}
              />
            </div>
            <div
              className="display-flex flex-d1 justify-content-between align-items-center bold-txt-large"
              id="formButtons"
            >
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
              <button type="reset" className="btn btn-primary">
                Reset
              </button>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setCurrentState("itemEditor")}
            >
              Back to original page
            </button>
            <div className="flex-d1" />
          </form>
        </div>
      );

    case "enemyEditor":
      return (
        <div id="volatile">
          <select id="enemyList" onChange={updateEnemyStates}></select>
          <div
            className="display-flex-c h-full w-full justify-content-center align-items-center"
            id="viewerBox"
          >
            <div className="flex-d1" id="formatBox">
              <div className="display-flex-c flex-d1 justify-content-center align-items-center bold-txt-large">
                {enemyName}:
                <br />
                {enemyImg}
                <div className="bold-txt-small">{enemyImgURL}</div>
              </div>
              <div
                className="display-flex-c flex-d1 bold-txt-large w-full h-full"
                id="statDisplayBox"
              >
                <br />
                <div className="display-flex flex-d1 justify-content-center align-items-center">
                  Enemy Attack: {enemyAtk}
                </div>
                <div className="display-flex flex-d1 justify-content-center align-items-center">
                  Enemy Defense: {enemyDef}
                </div>
                <div className="display-flex flex-d1 justify-content-center align-items-center">
                  Enemy Dodge: {enemyDodge}
                </div>
                <div className="display-flex flex-d1 justify-content-center align-items-center">
                  Enemy Health: {enemyMaxHealth}
                </div>
                <br />
              </div>
            </div>
            <div className="display-flex-c flex-d1 bold-txt-large justify-content-center align-items-center">
              Enemy Description:
              <br />
              {enemyDialogue}
            </div>
            <div className="display-flex-c flex-d1 bold-txt-large justify-content-center align-items-center">
              Enemy Area: {enemyArea}
              <br />
              Enemy Occurance: {enemyOccurance}
              <br />
              Enemy Gold Dropped: {enemyGold}
              <br />
              Enemy EXP Given: {enemyExp}
              <br />
            </div>
            {enemyAdminButton}
            <div className="display-flex-c flex-d1 justify-content-center align-items-center">
              {buttonSet}
            </div>
            <div className="display-flex-c flex-d1 bold-txt-large justify-content-center align-items-center" />
          </div>
        </div>
      );
    case "enemyEditorActive":
      var enemyAreaSelect = (
        <div className="display-flex-c flex-d1 justify-content-center align-items-center bold-txt-large ">
          <label>Enemy Area:</label>
          <select id="areaoptions" defaultValue={enemyArea}>
            <option value="forest">Forest</option>
            <option value="plains">Plains</option>
            <option value="volcano">Volcano</option>
            <option value="river">River</option>
          </select>
        </div>
      );
      var enemyStatsDiv = (
        <div className="display-flex-c flex-d1 justify-content-center align-items-center">
          <label className="bold-txt-large">Enemy Stats:</label>
          <div className="display-flex flex-d1 bold-txt-large statContainment align-items-center justify-content-between">
            <label>Attack: </label>
            <input
              className="inputBox"
              type="number"
              id="eattk"
              value={`${enemyAtk}`}
              onChange={(e) => {
                setEnemyAtk(e.target.value);
              }}
            />
          </div>
          <div className="display-flex flex-d1 bold-txt-large statContainment align-items-center justify-content-between">
            <label>Block: </label>
            <input
              className="inputBox"
              type="number"
              id="edef"
              value={`${enemyDef}`}
              onChange={(e) => {
                setEnemyDef(e.target.value);
              }}
            />
          </div>
          <div className="display-flex flex-d1 bold-txt-large statContainment align-items-center justify-content-between">
            <label>Defense: </label>
            <input
              className="inputBox"
              type="number"
              id="edodge"
              value={`${enemyDodge}`}
              onChange={(e) => {
                setEnemyDodge(e.target.value);
              }}
            />
          </div>
          <div className="display-flex flex-d1 bold-txt-large statContainment align-items-center justify-content-between">
            <label>Max Health: </label>
            <input
              className="inputBox"
              type="number"
              id="emax"
              value={`${enemyMaxHealth}`}
              onChange={(e) => {
                setEnemyMaxHealth(e.target.value);
              }}
            />
          </div>
        </div>
      );
      return (
        <div id="volatile">
          <form className="display-flex w-full h-full" id="enemyEditForm">
            <label className="bold-txt-large">
              !!^^!! Editing Enemy !!^^!!
            </label>
            {/* Enemy Name */}
            <div className="display-flex flex-d1 justify-content-center align-items-center bold-txt-large text-align-center">
              <label>Enemy Name: </label>
              <input
                type="text"
                id="ename"
                value={`${enemyName}`}
                onChange={(e) => {
                  setEnemyName(e.target.value);
                }}
              />
            </div>
            {/* Dodge Text Editing */}
            <div className="display-flex-c flex-d1 justify-content-between align-items-center bold-txt-large">
              <label>Enemy's Dodge Dialogue: </label>
              <textarea
                type="text"
                id="edialogue"
                value={enemyDialogue}
                onChange={(e) => {
                  setEnemyDialogue(e.target.value);
                }}
              />
            </div>
            {/* Stats Edit & Enemy Gold + XP Dropped */}
            <div
              className="justify-content-center align-items-center"
              id="enemyStatBox"
            >
              {enemyStatsDiv}
              <div className="flex-d1">
                <div className="display-flex flex-d1 justify-content-between align-items-center bold-txt-large statContainment">
                  <label>Gold Dropped: </label>
                  <input
                    className="inputBox"
                    type="number"
                    id="engold"
                    value={enemyGold}
                    onChange={(e) => {
                      setEnemyGold(e.target.value);
                    }}
                  />
                </div>
                <div className="display-flex flex-d1 justify-content-between align-items-center bold-txt-large statContainment">
                  <label>XP Dropped: </label>
                  <input
                    className="inputBox"
                    type="number"
                    id="enxp"
                    value={enemyExp}
                    onChange={(e) => {
                      setEnemyExp(e.target.value);
                    }}
                  />
                </div>
                <div className="display-flex flex-d1 justify-content-between align-items-center bold-txt-large statContainment">
                  <label>Item Dropped: </label>
                  <select
                    id="enemyItemDropList"
                    defaultValue={enemyItemID}
                    onChange={(e) => {
                      setEnemyItemID(e.target.value);
                    }}
                  ></select>
                </div>
                <div className="display-flex flex-d1 bold-txt-large align-items-center justify-content-between statContainment">
                  <label>Quantity Of Item: </label>
                  <input
                    className="inputBox"
                    type="number"
                    id="enQuant"
                    value={`${enemyQuant}`}
                    onChange={(e) => {
                      setEnemyQuant(e.target.value);
                    }}
                  />
                </div>
                <div className="display-flex flex-d1 bold-txt-large align-items-center justify-content-between statContainment">
                  <label>Occurance: </label>
                  <input
                    className="inputBox"
                    type="number"
                    id="enoccur"
                    value={`${enemyOccurance}`}
                    onChange={(e) => {
                      setEnemyOccurance(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
            {/* Enemy Area Select */}
            {enemyAreaSelect}
            {/* Image & Image URL */}
            <div className="display-flex-c flex-d1 justify-content-between align-items-center bold-txt-large">
              {enemyImg}
            </div>
            <div className="display-flex-c flex-d1 justify-content-between align-items-center bold-txt-large">
              <label>Image URL: {enemyImgURL}</label>
              <input
                className="inputBox"
                type="file"
                id="eimg"
                onChange={(e) => {
                  setItemImgURL(e.target.value);
                }}
              />
            </div>
            <div
              className="display-flex flex-d1 justify-content-between align-items-center bold-txt-large"
              id="formButtons"
            >
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
              <button type="reset" className="btn btn-primary">
                Reset
              </button>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setCurrentState("enemyEditor")}
            >
              Back to original page
            </button>
            <div className="flex-d1" />
          </form>
        </div>
      );

    case "eventEditor":
      return (
        <div id="volatile">
          <select id="eventList" onChange={updateEventStates}></select>
          <div
            className="display-flex-c h-full w-full text-align-center"
            id="viewerBox"
          >
            <div className="display-flex flex-d1 bold-txt-large justify-content-center align-items-center">
              Event Name: {eventName}
            </div>
            <div className="display-flex-c flex-d1 bold-txt-large justify-content-center align-items-center">
              Event Description: {eventDesc}
            </div>
            <div className="display-flex-c flex-d1 bold-txt-large justify-content-center align-items-center">
              Event Area: {eventArea}
              <br />
              Event Occurance: {eventOccurance}
            </div>
            <div className="display-flex-c flex-d1 bold-txt-large justify-content-center align-items-center">
              <br />
              Item ID to be dropped: {eventItemID}
              <br />
              Number Of Items Dropped: {eventQuant}
              <br />
              Event Generate Enemy: {eventEffect}
              <br />
            </div>
            {eventAdminButton}
            {buttonSet}
            <div className="display-flex flex-d1 bold-txt-large justify-content-center align-items-center" />
          </div>
        </div>
      );
    case "eventEditorActive":
      var eventAreaSelect = (
        <div className="display-flex-c flex-d1 justify-content-center align-items-center bold-txt-large ">
          <label>Event Area:</label>
          <select id="areaoptions" defaultValue={eventArea}>
            <option value="forest">Forest</option>
            <option value="plains">Plains</option>
            <option value="volcano">Volcano</option>
            <option value="river">River</option>
          </select>
        </div>
      );

      function checkGenEnemy() {
        if (
          document.querySelector("#eventItemDropList").value ==
          "Generate random enemy"
        ) {
          document.querySelector("#evquant").disabled = true;
        } else {
          document.querySelector("#evquant").disabled = false;
        }
      }

      return (
        <div id="volatile">
          <form className="display-flex w-full h-full" id="eventEditForm">
            <label className="bold-txt-large">
              !!^^!! Editing Event !!^^!!
            </label>
            {/* Enemy Name */}
            <div className="display-flex flex-d1 justify-content-center align-items-center bold-txt-large text-align-center">
              <label>Event Name: </label>
              <input
                type="text"
                id="evname"
                value={`${eventName}`}
                onChange={(e) => {
                  setEventName(e.target.value);
                }}
              />
            </div>
            {/* Dodge Text Editing */}
            <div className="display-flex-c flex-d1 justify-content-between align-items-center bold-txt-large">
              <label>Event Description: </label>
              <textarea
                type="text"
                id="evdesc"
                value={eventDesc}
                onChange={(e) => {
                  setEventDesc(e.target.value);
                }}
              />
            </div>
            {/* Event Items Dropped */}
            <div className="display-flex-c flex-d1 justify-content-center align-items-center">
              <div className="display-flex-c flex-d1 justify-content-between align-items-center bold-txt-large">
                <label>Event Item Dropped: </label>
                <select
                  id="eventItemDropList"
                  defaultValue={eventItemID}
                  onChange={checkGenEnemy}
                ></select>
              </div>
              <div className="display-flex flex-d1 bold-txt-large statContainment align-items-center justify-content-between">
                <label>Quantity Of Item: </label>
                <input
                  className="inputBox"
                  type="number"
                  id="evquant"
                  value={`${eventQuant}`}
                  onChange={(e) => {
                    setEventQuant(e.target.value);
                  }}
                />
              </div>
              <div className="display-flex flex-d1 bold-txt-large statContainment align-items-center justify-content-between">
                <label>Occurance: </label>
                <input
                  className="inputBox"
                  type="number"
                  id="evoccur"
                  value={`${eventOccurance}`}
                  onChange={(e) => {
                    setEventOccurance(e.target.value);
                  }}
                />
              </div>
            </div>
            {/* Event Area Select */}
            {eventAreaSelect}

            {/* Event Gnr / Item Only */}
            {eventGnrItem}

            {/* Submit & Reset Buttons */}
            <div
              className="display-flex flex-d1 justify-content-between align-items-center bold-txt-large"
              id="formButtons"
            >
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
              <button type="reset" className="btn btn-primary">
                Reset
              </button>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setCurrentState("eventEditor")}
            >
              Back to original page
            </button>
            <div className="flex-d1" />
          </form>
        </div>
      );
  }
}
