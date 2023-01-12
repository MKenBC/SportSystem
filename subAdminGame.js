//#region - Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyDoqG0ODWDSbC38vN77LJ40WUUFfKF6csk",
  authDomain: "sportsystem-5899c.firebaseapp.com",
  projectId: "sportsystem-5899c",
  storageBucket: "sportsystem-5899c.appspot.com",
  messagingSenderId: "73095528533",
  appId: "1:73095528533:web:ba1c3018920492a42494dc",
};

const app = initializeApp(firebaseConfig);

//-------------------IMPORT-----------------------------------------------------------------------------

import {
  getFirestore,
  query,
  doc,
  writeBatch,
  getDocs,
  setDoc,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const db = getFirestore();
//#endregion

//#region - COLLECTION/REFERENCES
//-------------------GET/SET COLLECTION ID-------------------------------------------------------------
const gameID = document.querySelector("#gameID");
document.querySelector("#tHeader").textContent =
  localStorage.getItem("subEventCode");

gameID.textContent = localStorage.getItem("subPassEventID");

const holdEventID = localStorage.getItem("subPassEventID");
const holdSchoolYear = localStorage.getItem("subEventCode");

//-------------------ELEMENT REFERENCES-----------------------------------------------------------------

//Show modal
const btnShowAdd = document.querySelector(".btnShowAdd");
const createGameWrapper = document.querySelector("#createGameWrapper");
const btnExport = document.querySelector("#btnExport");

const deleteGameWrapper = document.querySelector("#deleteGameWrapper");

//Get DOM input elements
//DOM 1 - Create Game
const info01 = document.querySelector("#info01");
const btnCreateGame = document.querySelector("#btnCreateGame");
const gameName01 = document.querySelector("#gameName01");
const teamNames01 = document.querySelector("#teamNames01");
const startDate = document.querySelector("#startDate");
const endDate = document.querySelector("#endDate");
const startTime = document.querySelector("#startTime");
const endTime = document.querySelector("#endTime");
const tournamentType01 = document.querySelector("#tournamentType01");
const selectFacility = document.querySelector("#selectFacility");
const checkRandomizeGame = document.querySelector("#checkRandomizeGame");
const tableGames = document.querySelector("#tableGames");
//DOM 2 - Delete Game
const info02 = document.querySelector("#info02");
const btnDeleteGame = document.querySelector("#btnDeleteGame");
const checkDeleteGame = document.querySelector("#checkDeleteGame");
const txtGN = document.querySelector("#txtGN");
const txtTS = document.querySelector("#txtTS");
const txtDate = document.querySelector("#txtDate");
const txtTT = document.querySelector("#txtTT");
const txtR = document.querySelector("#txtR");
const txtGS = document.querySelector("#txtGS");
//#endregion

//-------------------METHODS----------------------------------------------------------------------------

//Display Methods
//#region - Show Modals
btnShowAdd.addEventListener("click", async () => {
  createGameWrapper.style.display = "block";

  selectFacility.innerHTML = ``;
  selectFacility.insertAdjacentHTML(
    "beforeend",
    `
      <option value="Date" selected hidden>Select Facility</option>
      <option value="None">N/A (Not Applicable)</option>
  `
  );

  const ref = query(collection(db, "GameFacility"), orderBy("Name"));
  const querySnap = await getDocs(ref);
  querySnap.forEach((doc) => {
    renderFacility(doc.data(), doc.id);
  });
});
//#endregion

function renderFacility(content, ids) {
  const tr = `<option value="${ids}">${content.Name}</option>`;

  selectFacility.insertAdjacentHTML("beforeend", tr);
}

//#region - Hide Modals
window.addEventListener("click", (e) => {
  if (e.target === createGameWrapper) {
    createGameWrapper.style.display = "none";
    info01.textContent = "Please fill all the information needed.";
    info01.style.color = "";
    gameName01.value = "";
    teamNames01.value = "";
    startDate.value = "";
    endDate.value = "";
    startTime.value = "";
    endTime.value = "";
    selectFacility.selectedIndex = 0;
    // tournamentType01.selectedIndex = 0;
    checkRandomizeGame.checked = false;
  }

  if (e.target === deleteGameWrapper) {
    deleteGameWrapper.style.display = "none";
    info02.textContent =
      "This will delete all the information about this game.";
    info02.style.color = "";
    checkDeleteGame.checked = false;
  }

  if (e.target === gameDetailsWrapper) {
    gameDetailsWrapper.style.display = "none";
  }
});
//#endregion

let roundRobinMatch;
let roundRobinMatch1D = new Array();

//#region - Create Game, OnGame, TeamDetails Round Schedule
async function CreateGameOnGameWinLoss() {
  tournamentType01.selectedIndex = 1;
  let txtInfo = "*Please fill",
    holdRandom,
    holdTeamCount,
    teamArr = new Array();

  if (gameName01.value == "") {
    txtInfo += " Game Name";
  }

  if (teamNames01.value == "") {
    txtInfo += ", Team Names";
  }

  if (startDate.value == "") {
    txtInfo += ", Start Date";
  }

  if (endDate.value == "") {
    txtInfo += ", End Date";
  }

  if (startTime.value == "") {
    txtInfo += ", Start Time";
  }

  if (endTime.value == "") {
    txtInfo += ", End Time";
  }

  if (tournamentType01.selectedIndex == 0) {
    txtInfo += ", Tournament Type";
  }

  if (selectFacility.selectedIndex == 0) {
    txtInfo += ", Facility";
  }

  if (
    gameName01.value == "" ||
    teamNames01.value == "" ||
    startDate.value == "" ||
    endDate.value == "" ||
    startTime.value == "" ||
    endTime.value == "" ||
    tournamentType01.selectedIndex == 0 ||
    selectFacility.selectedIndex == 0
  ) {
    // info01.textContent = txtInfo;
    // info01.style.color = "red";
    swal("Oww!", txtInfo, "error");
  }

  //Check-box if Randomize
  if (checkRandomizeGame.checked == true) {
    holdRandom = true;
  } else {
    holdRandom = false;
  }

  if (
    gameName01.value != "" &&
    teamNames01.value != "" &&
    startDate.value != "" &&
    endDate.value != "" &&
    startTime.value != "" &&
    endTime.value != "" &&
    tournamentType01.selectedIndex != 0 &&
    selectFacility.selectedIndex != 0
  ) {
    //#region - Format TextArea teamNames01
    teamNames01.value = teamNames01.value.replace(/^\s*[\r\n]/gm, ""); //remove blank lines
    let tAreaArray = teamNames01.value.split("\n"); //get lines and save as array
    teamNames01.value = ""; //remove text area value
    //#endregion

    //#region - Shuffle Method
    function shuffle(array) {
      let currentIndex = array.length,
        randomIndex;

      while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex],
          array[currentIndex],
        ];
      }

      return array;
    }
    //#endregion

    for (let x = 0; x < tAreaArray.length; x++) {
      if (tAreaArray[x].trim() != "") {
        teamArr.push(tAreaArray[x].trim());
      }
    }

    if (holdRandom) {
      shuffle(teamArr);
    }

    //#region - Fill textarea TeamNames01
    for (let x = 0; x < teamArr.length; x++) {
      teamNames01.value += teamArr[x];

      if (x + 1 < teamArr.length) {
        teamNames01.value += "\n";
      }
    }
    //#endregion

    //Get Team Count
    holdTeamCount = teamNames01.value.split(/\r?\n|\r/).length;

    //#region - Test if Team Names are Unique
    function hasDuplicates(array) {
      var valuesSoFar = Object.create(null);
      for (var i = 0; i < array.length; ++i) {
        var value = array[i];
        if (value in valuesSoFar) {
          return true;
        }
        valuesSoFar[value] = true;
      }
      return false;
    }
    //#endregion

    if (
      startTime.value < 25 &&
      startTime.value > 0 &&
      endTime.value < 25 &&
      endTime.value > 0
    ) {
      if (parseInt(startTime.value) < parseInt(endTime.value)) {
        if (startDate.value < endDate.value) {
          if (hasDuplicates(teamArr) == false) {
            if (
              tournamentType01.value == "Single Elimination" ||
              tournamentType01.value == "Double Elimination"
            ) {
              //#region - Single/Double Elimination
              if (holdTeamCount <= 10 && holdTeamCount >= 4) {
                await addDoc(
                  collection(db, "Events", holdEventID, "EventGames"),
                  {
                    GameName: gameName01.value,
                    TournamentSize: holdTeamCount,
                    TournamentType: tournamentType01.value,
                    Randomize: holdRandom,
                    GameStatus: "Active",
                  }
                ).then((docRef) => {
                  alert("Data Added");
                  createGameWrapper.style.display = "none";
                  info01.textContent =
                    "Please fill all the information needed.";
                  info01.style.color = "";
                  gameName01.value = "";
                  teamNames01.value = "";
                  tournamentType01.selectedIndex = 0;
                  checkRandomizeGame.checked = false;

                  for (let x = 0; x < teamArr.length; x++) {
                    setDoc(
                      doc(
                        db,
                        "Events",
                        holdEventID,
                        "EventGames",
                        docRef.id,
                        "TeamDetails",
                        teamArr[x]
                      ),
                      {
                        TeamName: teamArr[x],
                        Wins: 0,
                        Losses: 0,
                        CourseYearSection: "",
                        TeamMembers: "",
                      }
                    );
                  }

                  window.location.reload();
                });
              } else {
                info01.textContent =
                  "Single and Double Elimination Team Count Max:10 and Min:4.";
                info01.style.color = "red";
              }
              //#endregion

              // ROUND ROBIN
            } else if (tournamentType01.value == "Round Robin") {
              if (holdTeamCount <= 25 && holdTeamCount >= 3) {
                let roundTeamContainer = [];
                let round, boxes;

                //Save Teams to Array <Team Number><Team Name><Radio>
                for (let x = 0; x < teamArr.length; x++) {
                  roundTeamContainer.push([x + 1, teamArr[x], false]);
                }

                roundRobinMatch = makeRoundRobinPairings(roundTeamContainer);

                // Calculate Round and Boxes
                if (holdTeamCount % 2 == 0) {
                  round = holdTeamCount - 1;
                  boxes = holdTeamCount / 2;
                } else {
                  round = holdTeamCount;
                  boxes = holdTeamCount / 2 - 0.5;
                }

                //Convert 4D Array to 1D Array
                let xz = 0;
                for (let a = 0; a < round; a++) {
                  for (let b = 0; b < boxes; b++) {
                    for (let c = 0; c < 2; c++) {
                      for (let d = 0; d < 3; d++) {
                        roundRobinMatch1D[xz] = roundRobinMatch[a][b][c][d];
                        xz++;
                      }
                    }
                  }
                }

                //Batch Declaration
                const batch = writeBatch(db);

                let holdSTime, HoldETime;

                if (parseInt(startTime.value) < 10) {
                  holdSTime = "0" + startTime.value + ":00";
                } else {
                  holdSTime = startTime.value + ":00";
                }

                if (parseInt(endTime.value) < 10) {
                  HoldETime = "0" + endTime.value + ":00";
                } else {
                  HoldETime = endTime.value + ":00";
                }

                //#region - Create EventGames
                await addDoc(
                  collection(db, "Events", holdEventID, "EventGames"),
                  {
                    GameName: gameName01.value,
                    TournamentSize: holdTeamCount,
                    StartDate: startDate.value,
                    EndDate: endDate.value,
                    StartTime: holdSTime,
                    EndTime: HoldETime,
                    TournamentType: tournamentType01.value,
                    Facility:
                      selectFacility.options[selectFacility.selectedIndex]
                        .textContent,
                    FacilityID: selectFacility.value,
                    Randomize: holdRandom,
                    GameStatus: "Active",
                    FacilityStatus: "Pending",
                  }
                ).then((docRef) => {
                  createGameWrapper.style.display = "none";
                  info01.textContent =
                    "Please fill all the information needed.";
                  info01.style.color = "";
                  let today = new Date();
                  let holdDay = String(today.getDate()).padStart(2, "0");
                  let holdMonth = String(1 + today.getMonth()).padStart(2, "0");
                  let dateToday =
                    today.getFullYear() + "-" + holdMonth + "-" + holdDay;

                  // tournamentType01.selectedIndex = 0;
                  checkRandomizeGame.checked = false;

                  if (selectFacility.value != "None") {
                    // Listing
                    let listingRequestRef = doc(
                      db,
                      "GameFacility",
                      selectFacility.value,
                      "Listing",
                      docRef.id
                    );
                    batch.set(listingRequestRef, {
                      EventCode: holdSchoolYear,
                      Creator: localStorage.getItem("subAdminUsername"),
                      EventID: holdEventID,
                      GameName: gameName01.value,
                      RequestDate: dateToday,
                      StartDate: startDate.value,
                      EndDate: endDate.value,
                      StartTime: holdSTime,
                      EndTime: HoldETime,
                      FacilityStatus: "Pending",
                    });
                  } else {
                    console.log(selectFacility.value);
                  }

                  // Update Evenet Status
                  let updateEventRef = doc(db, "Events", holdEventID);
                  batch.update(updateEventRef, {
                    Status: "On-going",
                  });

                  //#region - Save On-game
                  let matchRef = doc(
                    db,
                    "Events",
                    holdEventID,
                    "EventGames",
                    docRef.id,
                    "OnGame",
                    "Matches"
                  );
                  batch.set(matchRef, {
                    TeamCount: holdTeamCount,
                    Round: round,
                    Boxes: boxes,
                    RoundRobin: roundRobinMatch1D,
                    GamePlay: 0,
                  });
                  //#endregion

                  //#region - Save Round Details
                  for (let x = 0; x < round; x++) {
                    let roundNum;
                    if (x + 1 < 10) {
                      roundNum = "0" + (x + 1);
                    } else {
                      roundNum = x + 1;
                    }
                    let rName = "Round " + roundNum;

                    const teamRef = doc(
                      db,
                      "Events",
                      holdEventID,
                      "EventGames",
                      docRef.id,
                      "Rounds",
                      rName
                    );
                    batch.set(teamRef, {
                      RoundNumber: rName,
                      BoxSize: boxes,
                      Date: startDate.value,
                      BoxRemain: 0,
                      Status: "Upcoming",
                    });
                  }
                  //#endregion

                  //#region - Save Team Details
                  let blank = new Array();
                  for (let x = 0; x < teamArr.length; x++) {
                    const teamRef = doc(
                      db,
                      "Events",
                      holdEventID,
                      "EventGames",
                      docRef.id,
                      "TeamDetails",
                      teamArr[x]
                    );

                    batch.set(teamRef, {
                      TeamName: teamArr[x],
                      TeamNumber: x + 1,
                      Wins: 0,
                      Losses: 0,
                      CourseYearSection: "",
                      TeamMembers: blank,
                      TotalScore: 0,
                    });
                  }
                  //#endregion

                  startDate.value = "";
                  selectFacility.selectedIndex = 0;
                  gameName01.value = "";
                  teamNames01.value = "";
                  endDate.value = "";
                  startTime.value = "";
                  endTime.value = "";
                });
                //#endregion

                // Commit batch datas
                await batch.commit();

                // alert("Data Added");
                swal("Wow!", "Game Created Successfully!", "success").then(
                  () => {
                    window.location.reload();
                  }
                );
              } else {
                swal(
                  "Oww!",
                  "*Round Robin Team Count Max:25 and Min:3.",
                  "error"
                );
                // info01.textContent = "Round Robin Team Count Max:25 and Min:3.";
                // info01.style.color = "red";
              }
            }
          } else {
            swal("Oww!", "*Team Name has Duplicate", "error");
            // info01.textContent = "Team Name has Duplicate";
            // info01.style.color = "red";
          }
        } else {
          swal("Oww!", "*End Date Should be Larger than End Date", "error");
        }
      } else {
        swal("Oww!", "*End Time Should be Larger than Start Time", "error");
      }
    } else {
      swal("Oww!", "*Time is 24 Hour Clock", "error");
    }
  }
}
//#endregion

//#region - Round Robin Parings Function
function makeRoundRobinPairings(players) {
  if (players.length % 2 == 1) {
    players.push(null);
  }

  const playerCount = players.length;
  const rounds = playerCount - 1;
  const half = playerCount / 2;

  const tournamentPairings = [];

  const playerIndexes = players.map((_, i) => i).slice(1);

  for (let round = 0; round < rounds; round++) {
    const roundPairings = [];

    const newPlayerIndexes = [0].concat(playerIndexes);

    const firstHalf = newPlayerIndexes.slice(0, half);
    const secondHalf = newPlayerIndexes.slice(half, playerCount).reverse();

    for (let i = 0; i < firstHalf.length; i++) {
      if (players[secondHalf[i]] != null && players[firstHalf[i]] != null) {
        roundPairings.push([players[firstHalf[i]], players[secondHalf[i]]]);
      }
    }

    // rotating the array
    playerIndexes.push(playerIndexes.shift());
    tournamentPairings.push(roundPairings);
  }

  return tournamentPairings;
}
//#endregion

//#region - Get All Game Data
async function GetAllData() {
  let testUpcoming = 0,
    testFinish = 0;
  const ref = query(collection(db, "Events", holdEventID, "EventGames"));
  const querySnap = await getDocs(ref);
  querySnap.forEach((doc) => {
    renderGames(doc.data(), doc.id);

    if (doc.data().GameStatus == "Finished") {
      testFinish++;
    }
    testUpcoming++;
  });

  if (testUpcoming == 0) {
    await updateDoc(doc(db, "Events", holdEventID), {
      Status: "Upcoming",
    });
  } else {
    if (testFinish == testUpcoming) {
      await updateDoc(doc(db, "Events", holdEventID), {
        Status: "Finished",
      });
    }
  }
}
//#endregion

GetAllData();
let idHolder, facilityIDHolder;

//#region - Render Games
function renderGames(content, ids) {
  let testRandom = ``,
    testStat = ``;
  if (content.Randomize == true) {
    testRandom = `class="randTrue"`;
  } else {
    testRandom = `class="randFalse"`;
  }

  if (content.GameStatus == "Active") {
    testStat = `class="statActive"`;
  } else {
    testStat = `class="statFinished"`;
  }

  const tr = `<tr data-id="${ids}" class="tr">
               <td>${content.GameName}</td>
                <td>${content.TournamentSize}</td>
                <td>${content.StartDate}</td>
                <td ${testRandom}>${content.Randomize}</td>
                <td ${testStat}>${content.GameStatus}</td>
                <td>
                  <button class="btn btn-details">Details</button>
                  <button class="btn btn-delete">Delete</button>
                  <button class="btn btn-view">View</button>
                </td>
              </tr>`;

  tableGames.insertAdjacentHTML("beforeend", tr);

  // Click SHOW Delete Modal
  const btnShowDel = document.querySelector(`[data-id='${ids}'] .btn-delete`);
  btnShowDel.addEventListener("click", () => {
    deleteGameWrapper.style.display = "block";
    txtGN.textContent = content.GameName;
    txtTS.textContent = content.TournamentSize;
    txtDate.textContent = content.Date;
    txtTT.textContent = content.TournamentType;
    txtR.textContent = content.Randomize;
    txtGS.textContent = content.GameStatus;

    facilityIDHolder = content.FacilityID;
    idHolder = ids;
  });

  // Click Show Game Bracket
  const btnViewGame = document.querySelector(`[data-id='${ids}'] .btn-view`);
  btnViewGame.addEventListener("click", () => {
    localStorage.setItem("subPassGameID", ids);
    localStorage.setItem("subGameName", content.GameName);
    localStorage.setItem("subPassDate", content.StartDate);
    if (content.TournamentType == "Round Robin") {
      window.location.href = "./subAdminLeagueRR.html";
    } else if (content.TournamentType == "Single Elimination") {
      window.location.href = "./adminLeagueSE.html";
    } else if (content.TournamentType == "Double Elimination") {
      window.location.href = "./adminLeagueDE.html";
    }

    return false;
  });

  // Click Show Game Details
  const btnDetails = document.querySelector(`[data-id='${ids}'] .btn-details`);
  btnDetails.addEventListener("click", () => {
    txtGameFacility.textContent = content.Facility;
    if (content.FacilityStatus == "Pending") {
      txtFacilityStatus.style.color = "#666666";
    } else if (content.FacilityStatus == "Approved") {
      txtFacilityStatus.style.color = "green";
    } else if (content.FacilityStatus == "Declined") {
      txtFacilityStatus.style.color = "#dc3545";
    }
    txtFacilityStatus.textContent = content.FacilityStatus;
    txtStartDate.textContent = content.StartDate;
    txtEndDate.textContent = content.EndDate;
    txtStartTime.textContent = content.StartTime;
    txtEndTime.textContent = content.EndTime;
    gameDetailsWrapper.style.display = "block";
  });
}
//#endregion

//#region - DELETE Game Method
async function DeleteGame() {
  if (checkDeleteGame.checked == false) {
    swal("Oww!", "*Unable to Delete Event, Checkbox not Checked", "error");
    // info02.textContent = "*Unable to Delete Event, Checkbox not Checked";
    // info02.style.color = "red";
  } else {
    //#region - DELETE Doc/Collections Using Batch
    const batch = writeBatch(db);

    // DELETE - facility reservation
    const listingRequestRef = doc(
      db,
      "GameFacility",
      facilityIDHolder,
      "Listing",
      idHolder
    );
    batch.delete(listingRequestRef);

    // DELETE - On-Game Doc
    const onGameRef = doc(
      db,
      "Events",
      holdEventID,
      "EventGames",
      idHolder,
      "OnGame",
      "Matches"
    );
    batch.delete(onGameRef);

    // DELETE - Team Collection
    const getAllTeamsRef = query(
      collection(
        db,
        "Events",
        holdEventID,
        "EventGames",
        idHolder,
        "TeamDetails"
      )
    );
    const querySnap01 = await getDocs(getAllTeamsRef);
    querySnap01.forEach((doc01) => {
      let teamRef = doc(
        db,
        "Events",
        holdEventID,
        "EventGames",
        idHolder,
        "TeamDetails",
        doc01.id
      );

      batch.delete(teamRef);
    });

    // DELETE - Round Collection
    const getAllRoundRef = query(
      collection(db, "Events", holdEventID, "EventGames", idHolder, "Rounds")
    );
    const querySnap02 = await getDocs(getAllRoundRef);
    querySnap02.forEach((doc02) => {
      let roundRef = doc(
        db,
        "Events",
        holdEventID,
        "EventGames",
        idHolder,
        "Rounds",
        doc02.id
      );

      batch.delete(roundRef);
    });

    // DELETE - Score History Collection
    const getAllHistory = query(
      collection(
        db,
        "Events",
        holdEventID,
        "EventGames",
        idHolder,
        "ScoreHistory"
      )
    );
    const querySnap03 = await getDocs(getAllHistory);
    querySnap03.forEach((doc03) => {
      let historyRef = doc(
        db,
        "Events",
        holdEventID,
        "EventGames",
        idHolder,
        "ScoreHistory",
        doc03.id
      );

      batch.delete(historyRef);
    });

    await batch.commit();
    //#endregion

    deleteDoc(doc(db, "Events", holdEventID, "EventGames", idHolder))
      .then(() => {
        // alert("Data Deleted Successfuly");
        swal("Yay!", "Game has been Deleted!", "info").then(() => {
          deleteGameWrapper.style.display = "none";
          checkDeleteGame.checked = false;
          info02.textContent =
            " This will delete all the information about this game.";
          info02.style.color = "";
          window.location.reload();
        });
      })
      .catch((error) => {
        swal("Oww!", "*Unsuccessful operation, error:" + error, "error");
        // alert("Unsuccessuful operation, error:" + error);
      });
  }
}
//#endregion

//#region - Export Table
function ExcelReport() {
  let tab_text = "<table border='2px'><tr bgcolor='#87AFC6'>";
  let sa;
  let j = 0;
  let tab = tableGames;

  for (j = 0; j < tab.rows.length; j++) {
    tab_text = tab_text + tab.rows[j].innerHTML + "</tr>";
  }

  tab_text = tab_text + "</table>";
  tab_text = tab_text.replace(/<a[^>]*>|<\/a>/g, "");
  tab_text = tab_text.replace(/<img[^>]*>/gi, "");
  tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, "");
  tab_text = tab_text.replace(/<button[^>]*>|<\/button>/gi, "");

  var ua = window.navigator.userAgent;
  var msie = ua.indexOf("MSIE ");

  if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
    txtArea1.document.open("txt/html", "replace");
    txtArea1.document.write(tab_text);
    txtArea1.document.close();
    txtArea1.focus();
    sa = txtArea1.document.execCommand("SaveAs", true);
  } else
    sa = window.open(
      "data:application/vnd.ms-excel," + encodeURIComponent(tab_text)
    );

  return sa;
}
//#endregion

//Button Events
btnCreateGame.addEventListener("click", CreateGameOnGameWinLoss);
btnDeleteGame.addEventListener("click", DeleteGame);
btnExport.addEventListener("click", ExcelReport);
teamNames01.addEventListener("keypress", (event) => {
  var regex = new RegExp("^[a-zA-Z0-9 /\r?\n|\r/g]+$");
  var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
  if (!regex.test(key)) {
    event.preventDefault();
    return false;
  }
});
