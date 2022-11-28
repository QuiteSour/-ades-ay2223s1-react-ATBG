import React, { Fragment, useState, useEffect, useRef } from "react";
import "../css/market.css";
import axios from "axios";
import { NavBar } from "../components/NavBar";

function Market() {
  //Hosting
  const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === `127.0.0.1`;
  const STORAGE_API_HOST = isLocalhost
    ? "http://localhost:3000"
    : "https://tranquil-chamber-55751.herokuapp.com";
  //Get PlayerID
  const uid = parseInt(localStorage.getItem("User ID"));
  //const uid = "1";
  //Declare Variables
  var playerInventory = { items: [] };
  var tof = false;
  var modal = document.getElementById("myModal");
  var storeddata = "";
  const [selecteditemname, setitemname] = useState("");
  const [quantity, setquantity] = useState("");
  const [price, setprice] = useState("");
  const [seller, setseller] = useState("");
  const [sellitem, setsellitem] = useState("");

  const tabledata = useRef(null)

  // Loads once
useEffect(() => {
    getInventory();
    getItemListing();
    getPlayerInfo();
},[]);

  function getInventory() {
    // Get data from server
    var number = 0;
    let html = ``;
    let dropdown = ``;
    let itemnamearray = [];
    let itemnamebool = false;
    dropdown +=
      "<option value={'defaultin'} >" + "Choose an Itemname" + "</option>";
    fetch(`${STORAGE_API_HOST}/getInventory/${uid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        playerInventory.items = data.userbag;
        //console.log("Player Inventory");
        // console.log(playerInventory.items)
        //console.log(playerInventory.items.length);
        // console.log(quantity)
        playerInventory.items.forEach((element) => {
          console.log(element.id);
          console.log(element.Quant);
          let userinven = element.id;
          let quantity = element.Quant;

          fetch(`${STORAGE_API_HOST}/item_name/${userinven}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => response.json())
            .then((data) => {
              console.log(data.itemname);
              console.log(element.id);
              console.log(element.Quant);
              let itemname = data.itemname;
              number += 1;
              console.log("working");
              console.log(tabledata)
              const row = `
              <tr>
                <th scope="row">${number}</th>
              <td>${itemname}</td>
              <td>${quantity}</td>
              </tr>
              `;
              html += row;
              const tableBody = document.getElementById("inventorybody");
              tableBody.innerHTML = html;
              console.log(row)
              itemnamearray.forEach((element) => {
                if (itemnamebool == false) {
                  if (element == itemname) {
                    return (itemnamebool = true);
                  } else {
                    itemnamearray += itemname;
                  }
                }
              });
              if (itemnamebool == true) {
                return (itemnamebool = false);
              } else {
                dropdown += "<option>" + itemname + "</option>";
              }
              document.getElementById("itemid").innerHTML = dropdown;
            });
        });
        
        
      })
      .catch((error) => alert(error.message));
  }

  function sellItem() {
    console.log(selecteditemname);
    axios
      .get(`${STORAGE_API_HOST}/getItemID/${selecteditemname}`)

      .then((response) => {
        return response.data;
      })
      .then((data) => {
        const itemid = data.item_id;

        axios
          .get(`${STORAGE_API_HOST}/getInventory/${uid}`)
          .then((response) => {
            return response;
          })
          .then((data) => {
            playerInventory.items = data.data.userbag;
            console.log(playerInventory.items);
            console.log(playerInventory);
            console.log(data);
            console.log(data.userbag);
            //console.log("Player Inventory");
            // console.log(playerInventory.items)
            //console.log(playerInventory.items.length);

            // console.log(quantity)
            playerInventory.items.forEach((element) => {
              console.log(element.id);
              console.log(itemid);
              console.log(element.Quant);
              console.log(quantity);
              if (element.id == itemid) {
                console.log("matched id");
                if (element.Quant >= quantity) {
                  console.log("running");
                  //Getting UserName
                  fetch(`${STORAGE_API_HOST}/username/${uid}`, {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                    },
                  })
                    .then((response) => response.json())
                    .then((data) => {
                      console.log(data);
                      const username = data["username"];
                      console.log(username);
                      //Getting Item name and description
                      fetch(`${STORAGE_API_HOST}/item_info/${itemid}`, {
                        method: "GET",
                        headers: {
                          "Content-Type": "application/json",
                        },
                      })
                        .then((response) => response.json())
                        .then((data) => {
                          const gameinven = data[0];
                          const itemname = gameinven["itemname"];
                          const itemdesc = gameinven["itemdesc"];
                          console.log(itemname, itemdesc);

                          //Insert to market
                          const sellitem = {
                            itemname,
                            username,
                            itemdesc,
                            price,
                            quantity,
                          };
                          console.log(sellitem);
                          fetch(
                            `${STORAGE_API_HOST}/market_listing/${itemname}/${username}/${itemdesc}/${price}/${quantity}`,
                            {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                              },
                            }
                          ).then((response) => {
                            response.json();
                            deleteItem();
                            console.log("Successfully inserted");
                          });
                        });
                    });
                } else {
                  throw new Error("Invalid Quantity!");
                }
              } else {
                console.log("Invalid id");
              }
            });
          });
      });
  }
  function deleteItem() {
    axios
      .get(`${STORAGE_API_HOST}/getItemID/${selecteditemname}`)
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        const itemid = data.item_id;

        axios
          .get(`${STORAGE_API_HOST}/getInventory/${uid}`)
          .then((response) => {
            return response.data;
          })
          .then((data) => {
            try {
              playerInventory.items = data.userbag;
              //console.log("Player Inventory");
              // console.log(playerInventory.items)
              //console.log(playerInventory.items.length);

              // console.log(quantity)
              playerInventory.items.forEach((element) => {
                if (element.id == itemid) {
                  console.log("id found");
                  console.log(element.Quant);
                  element.Quant = element.Quant - quantity;
                  console.log(element.Quant);
                  throw "Quant Correct";
                }
              });
            } catch (error) {
              if (error !== "Quant Correct") {
                throw error;
              }
            }
            axios
              .put(
                `${STORAGE_API_HOST}/grabItemListing/${uid}`,
                playerInventory
              )
              .then((response) => {
                window.location.reload();
                return response.data;
              })
              .catch((error) => {
                throw error;
              })
              .finally();
            return console.log("Success");
          });
      });
  }

  function getItemListing() {
    // Get data from server

    let html = ``;
    let itemdd = ``;
    let sellerdd = ``;
    let pricedd = ``;
    let itemname = [];
    let itemnamebool = false;
    let sseller = [];
    let sellerbool = false;
    let sprice = [];
    let pricebool = false;
    itemdd +=
      "<option value={'defaulti'} >" + "Choose an Itemname" + "</option>";
    sellerdd +=
      "<option value={'defaults'} >" + "Choose a Seller" + "</option>";
    pricedd +=
      "<option value={'defaultp'} >" + "Choose a Price" + "</option>";
    axios
      .get(`${STORAGE_API_HOST}/show_market`)

      .then((response) => response.data)
      .then((data) => {
        for (let i = 0; i < data.length; i++) {
          console.log(data.length);
          const itemInfo = data[i];
          const number = i + 1;

          const row = `
              <tr id="${number}">
                <th scope="row">${number}</th>
                 <td class="row-data">${itemInfo["item_name"]}</td>
                 <td class="row-data">${itemInfo["seller"]}</td>
                 <td class="row-data">${itemInfo["description"]}</td>
                 <td class="row-data">${itemInfo["price"]}</td>
                 <td class="row-data">${itemInfo["quantity"]}</td>      
             </tr>
           `;
          html += row;
          itemname.forEach((element) => {
            if (itemnamebool == false) {
              if (element == itemInfo.item_name) {
                return (itemnamebool = true);
              } else {
                itemname += itemInfo.item_name;
              }
            }
          });
          if (itemnamebool == true) {
            return (itemnamebool = false);
          } else {
            itemdd += "<option>" + itemInfo.item_name + "</option>";
          }

          sseller.forEach((element) => {
            if (sellerbool == false) {
              if (element == itemInfo.seller) {
                return (sellerbool = true);
              } else {
                sseller += itemInfo.seller;
              }
            }
          });
          if (sellerbool == true) {
            return (sellerbool = false);
          } else {
            sellerdd += "<option>" + itemInfo.seller + "</option>";
          }
          sprice.forEach((element) => {
            if (pricebool == false) {
              if (element == itemInfo.price) {
                return (pricebool = true);
              } else {
                sprice += itemInfo.price;
              }
            }
          });
          if (pricebool == true) {
            return (pricebool = false);
          } else {
            pricedd += "<option>" + itemInfo.price + "</option>";
          }
        }
        const tableBody = document.getElementById("marketbody");
        tableBody.innerHTML = html;

        document.getElementById("itemnamedd").innerHTML = itemdd;
        document.getElementById("sellerdd").innerHTML = sellerdd;
        document.getElementById("pricedd").innerHTML = pricedd;
      })
      .catch((error) => alert(error.message));
  }

  
    function deleteMarketListing() {
    axios.get(`${STORAGE_API_HOST}/getListID/${sellitem}/${seller}/${price}`)

      .then((response) => {
        return response.data;
      })
      .then((data) => {
        const storedlistid = data.list_id;

        axios
          .delete(`${STORAGE_API_HOST}/delete_MarketListing/${storedlistid}`)
          .then((response) => {
            return response.data
          })
          .catch((error) => alert(error.message));

      })
  }
  

  function buyItem() {
    axios
      .get(`${STORAGE_API_HOST}/getListID/${sellitem}/${seller}/${price}`)

      .then((response) => {
        return response.data;
      })
      .then((data) => {
        const storedlistid = data.list_id;

        axios
          .get(`${STORAGE_API_HOST}/getGold/${uid}`)
          .then((response) => {
            return response.data;
          })
          .then((data) => {
            let usergold = data.usergold;
            // console.log(usergold)
            axios
              .get(`${STORAGE_API_HOST}/checkGold/${storedlistid}`)
              .then((response) => {
                return response.data;
              })
              .then((data) => {
                const listgold = data.price;
                //console.log(listgold)
                if (usergold >= listgold) {
                  usergold = usergold - listgold;
                  axios
                    .get(`${STORAGE_API_HOST}/checkQuantity/${storedlistid}`)

                    .then((response) => {
                      return response.data;
                    })
                    .then((data) => {
                      const fquantity = data.quantity;
                      console.log(data.quantity);
                      console.log(fquantity);
                      axios
                        .get(`${STORAGE_API_HOST}/getItemName/${storedlistid}`)
                        .then((response) => {
                          return response.data;
                        })
                        .then((data) => {
                          const itemname = data.item_name;
                          //console.log(itemname)
                          axios
                            .get(`${STORAGE_API_HOST}/getItemID/${itemname}`)
                            .then((response) => {
                              return response.data;
                            })
                            .then((data) => {
                              const fitemid = data.item_id;
                              //console.log(fitemid)
                              axios
                                .get(`${STORAGE_API_HOST}/getInventory/${uid}`)
                                .then((response) => {
                                  return response.data;
                                })
                                .then((data) => {
                                  playerInventory.items = data.userbag;
                                  //console.log("Player Inventory");
                                  // console.log(playerInventory.items)
                                  //console.log(playerInventory.items.length);
                                  // console.log(itemid)
                                  // console.log(quantity)
                                  try {
                                    playerInventory.items.forEach((element) => {
                                      if (element.id == fitemid) {
                                        console.log(element.Quant);
                                        element.Quant += parseInt(fquantity);
                                        console.log(element.Quant);
                                        tof = true;
                                        throw "Quant Correct";
                                      }
                                    });
                                    if (tof == false) {
                                      const newItems = {
                                        id: fitemid,
                                        Quant: fquantity,
                                      };
                                      console.log(newItems);
                                      playerInventory.items.push(newItems);
                                    }
                                  } catch (error) {
                                    if (error !== "Quant Correct") {
                                      throw error;
                                    }
                                  }
                                  axios
                                    .get(
                                      `${STORAGE_API_HOST}/getsellername/${storedlistid}`
                                    )
                                    .then((response) => {
                                      return response.data;
                                    })
                                    .then((data) => {
                                      const sellername = data.seller;
                                      axios
                                        .get(
                                          `${STORAGE_API_HOST}/getsellerid/${sellername}`
                                        )
                                        .then((response) => {
                                          return response.data;
                                        })
                                        .then((data) => {
                                          console.log(data);
                                          const sellerid = data.id;
                                          axios
                                            .get(
                                              `${STORAGE_API_HOST}/getGold/${sellerid}`
                                            )
                                            .then((response) => {
                                              return response.data;
                                            })
                                            .then((data) => {
                                              let sellergold = data.usergold;
                                              // console.log(usergold)
                                              sellergold =
                                                sellergold + listgold;
                                              console.log(sellergold);
                                              console.log(sellerid);
                                              axios
                                                .put(
                                                  `${STORAGE_API_HOST}/insertGold/${sellerid}/${sellergold}`
                                                )
                                                .then((response) => {
                                                  return response.data;
                                                })
                                                .then((data) => {
                                                  const newsellergold = data;
                                                  axios
                                                    .put(
                                                      `${STORAGE_API_HOST}/insertGold/${uid}/${usergold}`
                                                    )
                                                    .then((response) => {
                                                      return response.data;
                                                    })
                                                    .then((data) => {
                                                      const newusergold = data;

                                                      axios
                                                        .put(
                                                          `${STORAGE_API_HOST}/grabItemListing/${uid}`,
                                                          playerInventory
                                                        )
                                                        .then((response) => {
                                                          
                                                          return response.data;
                                                        })

                                                            .catch((error) => {
                                                              throw error;
                                                            })
                                                            .finally();
                                                            deleteMarketListing()
                                                            window.location.reload();
                                                          return console.log(
                                                            "Success"
                                                          );
                                                          
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    }else {
                  throw new Error("Not Enough Gold");
                }}) 
                })
              });
          };
      
  

  function getPlayerInfo() {
    axios
      .get(`${STORAGE_API_HOST}/username/${uid}`)
      .then((response) => response.data)
      .then((data) => {
        console.log(data);
        const username = data.username;
        axios
          .get(`${STORAGE_API_HOST}/getGold/${uid}`)
          .then((response) => response.data)
          .then((data) => {
            console.log(data);
            const usergold = data.usergold;
            console.log(username, usergold);
            document.getElementById("playerName").innerHTML =
              "Player Name: " + username;
            document.getElementById("playerGold").innerHTML =
              "Gold: " + usergold;
          });
      })
      .catch((error) => alert(error.message));
  }

  function openModal(event) {
    modal.style.display = "block";
    var rowId = event.target.parentNode.parentNode.id;
    //this gives id of tr whose button was clicked
    var rowdata = document.getElementById(rowId).querySelectorAll(".row-data");
    /*returns array of all elements with 
    "row-data" class within the row with given id*/
    console.log(rowdata[0].innerHTML);
    const sitemname = rowdata[0].innerHTML;
    const sseller = rowdata[1].innerHTML;
    return (storeddata = [sitemname, sseller]);
  }

  function closeModal() {
    modal.style.display = "none";
  }

  return (
    <Fragment>
      <NavBar />
      <div className="container-fluid justify-content-center" id="pagebody">
        <div id="conBody">
          <aside>
            <a className="bold-txt-small">Player Information</a>
            <hr
              style={{
                height: 2,
                borderWidth: 0,
                color: "gray",
                backgroundColor: "gray",
              }}
            />
            <p id="playerName">Player Name:</p>
            <p id="playerGold">Gold:</p>
          </aside>
          <div className="justify-content-center" id="inventory">
            <a className="bold-txt-medium">Player Inventory</a>
            <div id="inven" className="row">
              <div id="scrollit2">
                <table id="userinven" className="table table-striped">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">ItemName</th>
                      <th scope="col">Quantity</th>
                    </tr>
                  </thead>
                  <tbody ref={tabledata} id="inventorybody"></tbody>
                </table>
              </div>
            </div>
            <div id="sell">
              <div className="form-group">
                Please select the item that u are selling with the price and
                quantity.
                <br />
                <select
                  className="form-control"
                  defaultValue={"defaultin"}
                  id="itemid"
                  onChange={(event) => setitemname(event.target.value)}
                >
                  <option value={"defaultin"} disabled>
                    Choose an itemname
                  </option>
                </select>
                <input
                  type="text"
                  className="form-control"
                  id="price"
                  placeholder="Price"
                  onChange={(event) => setprice(event.target.value)}
                />
                <input
                  type="text"
                  className="form-control"
                  id="quant"
                  placeholder="Quantity"
                  onChange={(event) => setquantity(event.target.value)}
                />
                <br></br>
                <button
                  id="insert-btn"
                  type="submit"
                  onClick={() => sellItem(selecteditemname, price, quantity)}
                  className="btn btn-success"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
          <div className="justify-content-center" id="market">
            <a className="bold-txt-medium">Market</a>
            <div id="mark">
              <div id="scrollit">
                <table id="table3" className="table table-striped">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Item Name</th>
                      <th scope="col">Seller</th>
                      <th scope="col">Description</th>
                      <th scope="col">Price</th>
                      <th scope="col">Quantity</th>
                    </tr>
                  </thead>
                  <tbody id="marketbody"></tbody>
                </table>
              </div>
            </div>
            <div id="sell">
              Please select the item and the seller name that you want to buy
              from.
              <br />
              <select
                className="form-control"
                defaultValue={"defaulti"}
                id="itemnamedd"
                onChange={(event) => setsellitem(event.target.value)}
              >
                <option value={"defaulti"} disabled>
                  Choose an itemname
                </option>
              </select>
              <select
                className="form-control"
                defaultValue={"defaults"}
                id="sellerdd"
                onChange={(event) => setseller(event.target.value)}
              >
                <option value={"defaults"} disabled>
                  Choose a seller
                </option>
              </select>
              <select
                className="form-control"
                defaultValue={"defaultp"}
                id="pricedd"
                onChange={(event) => setprice(event.target.value)}
              >
                <option value={"defaultp"} disabled>
                  Choose a price
                </option>
              </select>
              <button
                id="insert-btn"
                type="submit"
                onClick={() => buyItem(sellitem, seller, price)}
                className="btn btn-success"
              >
                Submit
              </button>
            </div>
            {/*<div id="myModal" className="modal">
             Modal content 
            <div className="modal-content">
              <span className="close">×</span>
              <p>Do you want to buy this item?</p>
              <button
                id="Yes-btn"
                type="submit"

                onClick={() => buyItem(storeddata)}

                className="btn btn-success"
              >
                Yes
              </button>
              <button
                id="No-btn"
                type="submit"

                onClick={() => closeModal()}
   className="btn btn-success"
              >
                No
              </button>


            </div>
          </div> */}
          </div>
        </div>
      </div>
    </Fragment>
  );
}
export default Market;
