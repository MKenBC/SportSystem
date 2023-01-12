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
  getDoc,
  getDocs,
  writeBatch,
  where,
  setDoc,
  orderBy,
  collection,
  addDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const db = getFirestore();
//#endregion

//#region - COLLECTION/REFERENCES
//-------------------GET/SET COLLECTION ID-------------------------------------------------------------
const holdEventID = localStorage.getItem("passEventID");
const holdGameID = localStorage.getItem("passGameID");
const mCount = document.querySelector("#mCount");
document.querySelector("#gameName").textContent =
  localStorage.getItem("gameName");

const syFrom = localStorage.getItem("eventSYFrom");
const syTo = localStorage.getItem("eventSYTo");
const eName = localStorage.getItem("eventName");
const gName = localStorage.getItem("gameName");
const gDate = localStorage.getItem("passDate");

let holdTeamClass = new Array();
let holdTeamMembers = new Array();
let holdTeamName = new Array();
let holdTeamNumber = new Array();
let holdTeamWins = new Array();
let holdTeamLoss = new Array();

//-------------------ELEMENT REFERENCES-----------------------------------------------------------------
const tableTeamDetails = document.querySelector("#tableTeamDetails");
const tableRoundDetails = document.querySelector("#tableRoundDetails");
const sortTeam = document.querySelector("#sortTeam");
const btnShowCreateHistory = document.querySelector("#btnShowCreateHistory");

// Modal Edit Team Details
const editTeamDetailsWrapper = document.querySelector(
  "#editTeamDetailsWrapper"
);
const info01 = document.querySelector("#info01");
const btnUpdateTeamDesc = document.querySelector("#btnUpdateTeamDesc");
const txtTeamNumber01 = document.querySelector("#txtTeamNumber01");
const txtTeamName01 = document.querySelector("#txtTeamName01");
const txtWins01 = document.querySelector("#txtWins01");
const txtLoss01 = document.querySelector("#txtLoss01");
const courseYearSection = document.querySelector("#courseYearSection");
const teamMembers = document.querySelector("#teamMembers");

// Modal Show Team Details
const showTeamDetails = document.querySelector("#showTeamDetails");
const txtTeamNumber02 = document.querySelector("#txtTeamNumber02");
const txtTeamName02 = document.querySelector("#txtTeamName02");
const txtWins02 = document.querySelector("#txtWins02");
const txtLoss02 = document.querySelector("#txtLoss02");
const txtCourseYearSection2 = document.querySelector("#txtCourseYearSection2");
const memberContainer = document.querySelector("#memberContainer");

// Tournament Bracket Container
const tournametBracketContainer = document.querySelector(
  "#tournametBracketContainer"
);

// Modal edit Round Details
const editRoundDetailsWrapper = document.querySelector(
  "#editRoundDetailsWrapper"
);
const info02 = document.querySelector("#info02");
const btnUpdateRoundDesc = document.querySelector("#btnUpdateRoundDesc");
const txtRoundNumber01 = document.querySelector("#txtRoundNumber01");
const txtGame01 = document.querySelector("#txtGame01");
const txtStatus01 = document.querySelector("#txtStatus01");
const roundDate01 = document.querySelector("#roundDate01");

// Modal Get Team Score
const getTeamScoresWrapper = document.querySelector("#getTeamScoresWrapper");
const info03 = document.querySelector("#info03");
const btnGetScores = document.querySelector("#btnGetScores");
const txtWinTeamName = document.querySelector("#txtWinTeamName");
const winTeamScore = document.querySelector("#winTeamScore");
const txtLossTeamName = document.querySelector("#txtLossTeamName");
const lossTeamScore = document.querySelector("#lossTeamScore");

// Modal Create History
const info04 = document.querySelector("#info04");
const createHistoryWrapper = document.querySelector("#createHistoryWrapper");
const txtSY = document.querySelector("#txtSY");
const txtEN = document.querySelector("#txtEN");
const txtGN = document.querySelector("#txtGN");
const txtTT = document.querySelector("#txtTT");
const txtCP = document.querySelector("#txtCP");
const txt1R = document.querySelector("#txt1R");
const txt2R = document.querySelector("#txt2R");
const checkAddHistory = document.querySelector("#checkAddHistory");
const btnAddHist = document.querySelector("#btnAddHist");

//#endregion
//-------------------METHODS-----------------------------------------------------------------------------

let idHolder,
  teamArr,
  teamRR1D,
  teamRR4D,
  round,
  boxes,
  gamePlay,
  roundIDHolder,
  scoreExisting,
  scoreRound,
  scoreBox;

//#region - Hide Modals
window.addEventListener("click", (e) => {
  if (e.target === editTeamDetailsWrapper) {
    editTeamDetailsWrapper.style.display = "none";
    info01.textContent = "Please fill all the information needed.";
    info01.style.color = "";
    teamMembers.value = "";
  }

  if (e.target === showTeamDetails) {
    showTeamDetails.style.display = "none";
    memberContainer.innerHTML = "";
  }

  if (e.target === editRoundDetailsWrapper) {
    editRoundDetailsWrapper.style.display = "none";
    info02.textContent = "Please fill all the information needed.";
    info02.style.color = "";
  }

  if (e.target === createHistoryWrapper) {
    createHistoryWrapper.style.display = "none";
    checkAddHistory.checked = false;
    info04.textContent = "This informations will be added to history.";
    info04.style.color = "";
  }
});
//#endregion

//#region - GET All Round Details
async function GetAllRoundDetails() {
  const ref = query(
    collection(db, "Events", holdEventID, "EventGames", holdGameID, "Rounds")
  );
  const querySnap = await getDocs(ref);
  querySnap.forEach((doc) => {
    RenderRoundDetails(doc.data(), doc.id);
  });
}
//#endregion

GetAllRoundDetails();

//#region - RENDER Round Details
function RenderRoundDetails(content, ids) {
  let cHold = ``;
  if (content.Status == "On-going") {
    cHold = `class="onGoing"`;
  } else if (content.Status == "Finished") {
    cHold = `class="done"`;
  } else {
    cHold = `class="upcoming"`;
  }

  const tr = `<tr data-id="${ids}" class="tr">
               <td>${content.RoundNumber}</td>
                <td>${content.Date}</td>
                <td>${content.BoxRemain}/${content.BoxSize}</td>
                <td ${cHold}>${content.Status}</td>
                <td>
                  <button class="btn btn-edit">Edit</button>
                </td>
              </tr>`;

  tableRoundDetails.insertAdjacentHTML("beforeend", tr);

  // Click Show edit Team Details
  const btnShowUpdate = document.querySelector(`[data-id='${ids}'] .btn-edit`);
  btnShowUpdate.addEventListener("click", () => {
    txtRoundNumber01.textContent = content.RoundNumber;
    txtGame01.textContent = content.BoxRemain + "/" + content.BoxSize;
    txtStatus01.textContent = content.Status;
    roundDate01.value = content.Date;
    editRoundDetailsWrapper.style.display = "block";

    roundIDHolder = ids;
  });
}
//#endregion

//#region - Sort Teams
async function SortTeams() {
  tableTeamDetails.innerHTML = ``;
  tableTeamDetails.insertAdjacentHTML(
    "beforeend",
    `           <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Wins</th>
                  <th>Loss</th>
                  <th>Actions</th>
                </tr>`
  );
  let ref;

  if (sortTeam.value == "TeamNumber") {
    ref = query(
      collection(
        db,
        "Events",
        holdEventID,
        "EventGames",
        holdGameID,
        "TeamDetails"
      ),
      orderBy("TeamNumber")
    );
  } else if (sortTeam.value == "TeamName") {
    ref = query(
      collection(
        db,
        "Events",
        holdEventID,
        "EventGames",
        holdGameID,
        "TeamDetails"
      ),
      orderBy("TeamName")
    );
  } else if (sortTeam.value == "Wins") {
    ref = query(
      collection(
        db,
        "Events",
        holdEventID,
        "EventGames",
        holdGameID,
        "TeamDetails"
      ),
      orderBy("Wins", "desc")
    );
  } else {
    ref = query(
      collection(
        db,
        "Events",
        holdEventID,
        "EventGames",
        holdGameID,
        "TeamDetails"
      ),
      orderBy("Losses", "desc")
    );
  }

  const querySnap = await getDocs(ref);
  querySnap.forEach((doc) => {
    RenderTeams(doc.data(), doc.id);
  });
}
//#endregion

//#region - GET All Team Details
async function GetAllTeamDetails() {
  const ref = query(
    collection(
      db,
      "Events",
      holdEventID,
      "EventGames",
      holdGameID,
      "TeamDetails"
    ),
    orderBy("TeamNumber")
  );
  const querySnap = await getDocs(ref);
  querySnap.forEach((doc) => {
    RenderTeams(doc.data(), doc.id);
  });
}
//#endregion

GetAllTeamDetails();

//#region - RENDER Team Details
function RenderTeams(content, ids) {
  const tr = `<tr data-id="${ids}" class="tr">
               <td>${content.TeamNumber}</td>
                <td>${content.TeamName}</td>
                <td class="numWins">${content.Wins}</td>
                <td class="numLoss">${content.Losses}</td>
                <td>
                  <button class="btn btn-edit">Edit</button>
                  <button class="btn btn-view">View</button>
                </td>
              </tr>`;

  tableTeamDetails.insertAdjacentHTML("beforeend", tr);

  // Click Show edit Team Details
  const btnShowUpdate = document.querySelector(`[data-id='${ids}'] .btn-edit`);
  btnShowUpdate.addEventListener("click", () => {
    txtTeamNumber01.textContent = content.TeamNumber;
    txtTeamName01.textContent = content.TeamName;
    txtWins01.textContent = content.Wins;
    txtLoss01.textContent = content.Losses;
    courseYearSection.value = content.CourseYearSection;

    teamArr = content.TeamMembers;
    for (let x = 0; x < teamArr.length; x++) {
      teamMembers.value += teamArr[x];

      if (x + 1 < teamArr.length) {
        teamMembers.value += "\n";
      }
    }
    editTeamDetailsWrapper.style.display = "block";

    idHolder = ids;
  });

  // Click Show View Team Details
  const btnShowView = document.querySelector(`[data-id='${ids}'] .btn-view`);
  btnShowView.addEventListener("click", () => {
    txtTeamNumber02.textContent = content.TeamNumber;
    txtTeamName02.textContent = content.TeamName;
    txtWins02.textContent = content.Wins;
    txtLoss02.textContent = content.Losses;
    txtCourseYearSection2.textContent = content.CourseYearSection;

    teamArr = content.TeamMembers;
    for (let x = 0; x < teamArr.length; x++) {
      let p = `<p class="member">${teamArr[x]}</p>`;
      memberContainer.insertAdjacentHTML("beforeend", p);
    }
    showTeamDetails.style.display = "block";
  });
}
//#endregion

//#region - UPDATE Team Details
function UpdateTeamDetails() {
  let txtInfo = "*Please fill";
  let teamArr01 = new Array();

  if (courseYearSection.value == "") {
    txtInfo += " Course, Year, & Section,";
  }

  if (teamMembers.value == "") {
    txtInfo += " Team Members";
  }

  if (courseYearSection.value == "" || teamMembers.value == "") {
    swal("Oww!", txtInfo, "error");
    // info01.textContent = txtInfo;
    // info01.style.color = "red";
  }

  if (courseYearSection.value != "" && teamMembers.value != "") {
    teamMembers.value = teamMembers.value.replace(/^\s*[\r\n]/gm, ""); //remove blank lines
    teamArr = teamMembers.value.split("\n"); //get lines and save as array
    teamMembers.value = "";

    for (let y = 0; y < teamArr.length; y++) {
      if (teamArr[y].trim() != "") {
        teamArr01.push(teamArr[y].trim());
      }
    }

    for (let x = 0; x < teamArr01.length; x++) {
      teamMembers.value += teamArr01[x];

      if (x + 1 < teamArr01.length) {
        teamMembers.value += "\n";
      }
    }

    updateDoc(
      doc(
        db,
        "Events",
        holdEventID,
        "EventGames",
        holdGameID,
        "TeamDetails",
        idHolder
      ),
      {
        CourseYearSection: courseYearSection.value,
        TeamMembers: teamArr01,
      }
    )
      .then(() => {
        // alert("Data Updated");
        swal("Wow!", "Team Details Updated Successfully!", "success").then(
          () => {
            editTeamDetailsWrapper.style.display = "none";
            info01.textContent = "Please fill all the information needed.";
            info01.style.color = "";
            window.location.reload();
          }
        );
      })
      .catch((error) => {
        swal("Oww!", "*Unsuccessuful operation, error:" + error, "error");
        // alert("Unsuccessuful operation, error:" + error);
      });
  }
}
//#endregion

//#region - GET Team Matches
async function GetTeamMatches() {
  let holdOver = 0;
  const ref = doc(
    db,
    "Events",
    holdEventID,
    "EventGames",
    holdGameID,
    "OnGame",
    "Matches"
  );
  const querySnap = await getDoc(ref);

  if (querySnap.exists()) {
    teamRR1D = querySnap.data().RoundRobin;
    round = querySnap.data().Round;
    boxes = querySnap.data().Boxes;
    gamePlay = querySnap.data().GamePlay;
  } else {
    console.log("No Such Document");
  }
  holdOver = teamRR1D.length / 3 / 2;

  mCount.textContent = gamePlay + "/" + holdOver;
  teamRR4D = convertArray(round, boxes, teamRR1D);

  for (let x = 0; x < round; x++) {
    RenderTeamBrackets(x, boxes);
  }
  const docGameRef = doc(db, "Events", holdEventID, "EventGames", holdGameID);
  const docGameSnap = await getDoc(docGameRef);

  if (gamePlay == holdOver && docGameSnap.data().GameStatus != "Finished") {
    await updateDoc(doc(db, "Events", holdEventID, "EventGames", holdGameID), {
      GameStatus: "Finished",
    });
  }

  if (gamePlay == holdOver) {
    btnShowCreateHistory.style.display = "block";
  }
}
//#endregion

GetTeamMatches();

//#region - Convert 1D Array to 4D Array
function convertArray(round, box, arr) {
  let d2 = [],
    d3 = new Array(),
    d4 = new Array(),
    arhold = new Array();
  for (let a = 0; a < arr.length; a += 3) {
    d2.push([arr[a], arr[a + 1], arr[a + 2]]);
  }

  for (let b = 0; b < d2.length; b += 2) {
    d3.push([d2[b], d2[b + 1]]);
  }

  let a = 0;
  for (let c = 0; c < round; c++) {
    arhold = [];
    for (let d = 0; d < box; d++) {
      arhold.push(d3[a]);
      a++;
    }
    d4.push(arhold);
  }

  return d4;
}
//#endregion

//#region - Render Team Brackets
function RenderTeamBrackets(x, y) {
  let field = ``;
  for (let z = 0; z < y; z++) {
    let a = ``,
      b = ``,
      a1 = ``,
      b1 = ``;

    if (teamRR4D[x][z][0][2] == true) {
      a = `checked`;
      a1 = `win`;
    }

    if (teamRR4D[x][z][1][2] == true) {
      b = `checked`;
      b1 = `win`;
    }

    let ids = `field${x}${z}`,
      boxNum = z + 1;

    field += `
<div class="matchContain">
  <p class="boxnum">${boxNum}</p>
  <fieldset id="${ids}" class="matchContainer">
    <div class="row">
      <label class="lbl01 ${a1}" for="team01${x}${z}"
        >${teamRR4D[x][z][0][0]}</label
      ><label class="lbl02" for="team01${x}${z}">${teamRR4D[x][z][0][1]}</label>
      <div class="inputCont">
        <input
          id="team01${x}${z}"
          type="radio"
          onchange="changeHandler(this);"
          data-winteam-value="${teamRR4D[x][z][0][1]}"
          data-lossteam-value="${teamRR4D[x][z][1][1]}"
          data-x-value="${x}"
          data-z-value="${z}"
          data-row-value="${0}"
          data-round-value="${x + 1}"
          data-box-value="${boxNum}"
          name="${ids}"
          ${a}
        />
      </div>
    </div>
    <div class="row">
      <label class="lbl01 ${b1}" for="team02${x}${z}"
        >${teamRR4D[x][z][1][0]}</label
      ><label class="lbl02" for="team02${x}${z}">${teamRR4D[x][z][1][1]}</label>
      <div class="inputCont">
        <input
          id="team02${x}${z}"
          type="radio"
          onchange="changeHandler(this);"
          data-winteam-value="${teamRR4D[x][z][1][1]}"
          data-lossteam-value="${teamRR4D[x][z][0][1]}"
          data-x-value="${x}"
          data-z-value="${z}"
          data-row-value="${1}"
          data-round-value="${x + 1}"
          data-box-value="${boxNum}"
          name="${ids}"
          ${b}
        />
      </div>
    </div>
  </fieldset>
</div>
    `;
  }

  let roundCont = `
    <div class="roundContainer">
      <h3>Round ${x + 1}</h3>
      ${field}
    </div>
  `;

  tournametBracketContainer.insertAdjacentHTML("beforeend", roundCont);
}
//#endregion

//#region - GET/UPDATE Existing Match Winning Team
async function UpdateTeamWinLossExist01(winTeam) {
  let win, los;

  // Get Win Team Data
  let docRef = doc(
    db,
    "Events",
    holdEventID,
    "EventGames",
    holdGameID,
    "TeamDetails",
    winTeam
  );
  let docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    win = docSnap.data().Wins;
    los = docSnap.data().Losses;
  } else {
    swal("Oww!", "*Data doesn't exists", "error");
    // alert("Data doesn't exist");
  }

  if (los == 0) {
    los = 1;
  }

  // Update Win Team Data
  await updateDoc(docRef, {
    Wins: win + 1,
    Losses: los - 1,
  });
}
//#endregion

//#region - GET/UPDATE Existing Match Loss Team
async function UpdateTeamWinLossExist02(lossTeam) {
  let win, los;

  // Get Loss Team Data
  let docRef = doc(
    db,
    "Events",
    holdEventID,
    "EventGames",
    holdGameID,
    "TeamDetails",
    lossTeam
  );
  let docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    win = docSnap.data().Wins;
    los = docSnap.data().Losses;
  } else {
    swal("Oww!", "*Data doesn't exists", "error");
    // alert("Data doesn't exist");
  }

  if (win == 0) {
    win = 1;
  }

  // Update Win Team Data
  await updateDoc(docRef, {
    Wins: win - 1,
    Losses: los + 1,
  });
}
//#endregion

//#region - GET/UPDATE Match Winning Team
async function UpdateTeamWinLoss01(winTeam) {
  let win;

  // Get Win Team Data
  let docRef = doc(
    db,
    "Events",
    holdEventID,
    "EventGames",
    holdGameID,
    "TeamDetails",
    winTeam
  );
  let docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    win = docSnap.data().Wins;
  } else {
    swal("Oww!", "*Data doesn't exists", "error");
    // alert("Data doesn't exist");
  }

  // Update Win Team Data
  await updateDoc(docRef, {
    Wins: win + 1,
  });
}
//#endregion

//#region - GET/UPDATE Match Loss Team
async function UpdateTeamWinLoss02(lossTeam) {
  let los;

  // Get Win Team Data
  let docRef = doc(
    db,
    "Events",
    holdEventID,
    "EventGames",
    holdGameID,
    "TeamDetails",
    lossTeam
  );
  let docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    los = docSnap.data().Losses;
  } else {
    swal("Oww!", "*Data doesn't exists", "error");
    // alert("Data doesn't exist");
  }

  // Update Win Team Data
  await updateDoc(docRef, {
    Losses: los + 1,
  });
}
//#endregion

//#region  - UPDATE Round Game Status
async function UpdateRoundGame(boxNum) {
  let roundID;
  if (boxNum + 1 < 10) {
    roundID = "0" + (boxNum + 1);
  } else {
    roundID = boxNum + 1;
  }
  let hold = "Round " + roundID,
    game,
    total;

  let docRef = doc(
    db,
    "Events",
    holdEventID,
    "EventGames",
    holdGameID,
    "Rounds",
    hold
  );
  let docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    game = docSnap.data().BoxRemain;
    total = docSnap.data().BoxSize;
  } else {
    swal("Oww!", "*Data doesn't exists", "error");
    // alert("Data doesn't exist");
  }

  if (total == game + 1) {
    await updateDoc(docRef, {
      BoxRemain: game + 1,
      Status: "Finished",
    });
  } else if (game + 1 > 0 && game + 1 < total) {
    await updateDoc(docRef, {
      BoxRemain: game + 1,
      Status: "On-going",
    });
  }
}
//#endregion

//#region - Radio Button Event
// window.changeHandler to define the function globaly
window.changeHandler = function (src) {
  let x = src.dataset.xValue,
    z = src.dataset.zValue,
    row = src.dataset.rowValue,
    gPlay = false;

  if (src.dataset.roundValue < 10) {
    scoreRound = "0" + src.dataset.roundValue;
  } else {
    scoreRound = src.dataset.roundValue;
  }

  if (src.dataset.boxValue < 10) {
    scoreBox = "0" + src.dataset.boxValue;
  } else {
    scoreBox = src.dataset.boxValue;
  }

  // Row 1
  if (row == 0) {
    // Existing
    if (teamRR4D[x][z][1][2] == true) {
      teamRR4D[x][z][row][2] = true;
      teamRR4D[x][z][1][2] = false;

      UpdateTeamWinLossExist01(src.dataset.winteamValue);
      UpdateTeamWinLossExist02(src.dataset.lossteamValue);
      scoreExisting = true;
    } else {
      // New Data
      teamRR4D[x][z][row][2] = true;
      gPlay = true;

      UpdateTeamWinLoss01(src.dataset.winteamValue);
      UpdateTeamWinLoss02(src.dataset.lossteamValue);
      UpdateRoundGame(parseInt(x));
      scoreExisting = false;
    }
  } else {
    // Row 2

    // Existing
    if (teamRR4D[x][z][0][2] == true) {
      teamRR4D[x][z][row][2] = true;
      teamRR4D[x][z][0][2] = false;

      UpdateTeamWinLossExist01(src.dataset.winteamValue);
      UpdateTeamWinLossExist02(src.dataset.lossteamValue);
      scoreExisting = true;
    } else {
      // New Data
      teamRR4D[x][z][row][2] = true;
      gPlay = true;

      UpdateTeamWinLoss01(src.dataset.winteamValue);
      UpdateTeamWinLoss02(src.dataset.lossteamValue);
      UpdateRoundGame(parseInt(x));
      scoreExisting = false;
    }
  }

  //Convert 4D Array to 1D Array
  teamRR1D = [];
  let xz = 0;
  for (let a = 0; a < round; a++) {
    for (let b = 0; b < boxes; b++) {
      for (let c = 0; c < 2; c++) {
        for (let d = 0; d < 3; d++) {
          teamRR1D[xz] = teamRR4D[a][b][c][d];
          xz++;
        }
      }
    }
  }

  let gHold = 0;
  if (gPlay) {
    gHold = 1;
  }

  updateDoc(
    doc(
      db,
      "Events",
      holdEventID,
      "EventGames",
      holdGameID,
      "OnGame",
      "Matches"
    ),
    {
      RoundRobin: teamRR1D,
      GamePlay: gamePlay + gHold,
    }
  )
    .then(() => {
      GetSetTeamNameInScores(
        src.dataset.winteamValue,
        src.dataset.lossteamValue
      );
    })
    .catch((error) => {
      swal("Oww!", "*Unsuccessuful operation, error:" + error, "error");
      // alert("Unsuccessuful operation, error:" + error);
    });
};
//#endregion

//#region - UPDATE Round Date
async function UpdateRoundDate() {
  let docRef = doc(
    db,
    "Events",
    holdEventID,
    "EventGames",
    holdGameID,
    "Rounds",
    roundIDHolder
  );
  updateDoc(docRef, {
    Date: roundDate01.value,
  })
    .then(() => {
      // alert("Data Updated");
      swal("Wow!", "Round Date Updated Successfully!", "success").then(() => {
        editRoundDetailsWrapper.style.display = "none";
        info02.textContent = "Please fill all the information needed.";
        info02.style.color = "";
        window.location.reload();
      });
    })
    .catch((error) => {
      swal("Oww!", "*Unsuccessuful operation, error:" + error, "error");
      // alert("Unsuccessuful operation, error:" + error);
    });
}
//#endregion

//#region - GET Team Name and Score
function GetSetTeamNameInScores(winTeam, lossTeam) {
  txtWinTeamName.textContent = winTeam;
  txtLossTeamName.textContent = lossTeam;
  getTeamScoresWrapper.style.display = "block";
}
//#endregion

//#region - SAVE Team Score
async function SaveTeamScore() {
  let holdID = scoreRound + "" + scoreBox;
  let txtHold = "*Please enter ";

  if (winTeamScore.value == "") {
    txtHold += "Winner Score, ";
  }

  if (lossTeamScore.value == "") {
    txtHold += "Losser Score.";
  }

  if (winTeamScore.value == "" || lossTeamScore.value == "") {
    swal("Oww!", txtHold, "error");
    // info03.textContent = txtHold;
    // info03.style.color = "red";
  }

  if (winTeamScore.value != "" && lossTeamScore.value != "") {
    if (parseInt(winTeamScore.value) > parseInt(lossTeamScore.value)) {
      let ref = doc(
        db,
        "Events",
        holdEventID,
        "EventGames",
        holdGameID,
        "ScoreHistory",
        holdID
      );

      if (scoreExisting) {
        await updateDoc(ref, {
          WinTeam: txtWinTeamName.textContent,
          WinScore: winTeamScore.value,
          LossTeam: txtLossTeamName.textContent,
          LossScore: lossTeamScore.value,
        })
          .then(() => {
            getTeamScoresWrapper.style.display = "none";
            info03.textContent = "Please fill all the information needed.";
            info03.style.color = "";
            // alert("Data Updated");
            swal("Wow!", "Match Updated Successfully!", "success").then(() => {
              window.location.reload();
            });
          })
          .catch((error) => {
            swal("Oww!", "*Unsuccessuful operation, error:" + error, "error");
            // alert("Unsuccessuful operation, error:" + error);
          });
      } else {
        await setDoc(ref, {
          Round: scoreRound,
          Box: scoreBox,
          WinTeam: txtWinTeamName.textContent,
          WinScore: winTeamScore.value,
          LossTeam: txtLossTeamName.textContent,
          LossScore: lossTeamScore.value,
        })
          .then(() => {
            getTeamScoresWrapper.style.display = "none";
            info03.textContent = "Please fill all the information needed.";
            info03.style.color = "";
            // alert("Data Added");
            swal(
              "Wow!",
              "Match Information Created Successfully!",
              "success"
            ).then(() => {
              window.location.reload();
            });
          })
          .catch((error) => {
            swal("Oww!", "*Unsuccessuful operation, error:" + error, "error");
            // alert("Unsuccessuful operation, error:" + error);
          });
      }
    } else {
      swal("Oww!", "*Winning Team Score should be Bigger than Non-winning Team Score", "error");
      // info03.textContent = "Winner Score should be Bigger than Losser Score";
      // info03.style.color = "red";
    }
  }
}
//#endregion

//#region - Show Create History
async function ShowCreateHistory() {
  txtSY.textContent = "S.Y. " + syFrom + "-" + syTo;
  txtEN.textContent = eName;
  txtGN.textContent = gName;
  txtTT.textContent = "Round Robin";

  let hold = 1;
  const ref = query(
    collection(
      db,
      "Events",
      holdEventID,
      "EventGames",
      holdGameID,
      "TeamDetails"
    ),
    orderBy("Wins", "desc"),
    orderBy("TotalScore", "desc")
  );
  const querySnap = await getDocs(ref);
  querySnap.forEach((doc) => {
    if (hold == 1) {
      holdTeamClass[0] = doc.data().CourseYearSection;
      holdTeamMembers[0] = doc.data().TeamMembers;
      holdTeamName[0] = doc.data().TeamName;
      holdTeamNumber[0] = doc.data().TeamNumber;
      holdTeamWins[0] = doc.data().Wins;
      holdTeamLoss[0] = doc.data().Losses;
    } else if (hold == 2) {
      holdTeamClass[1] = doc.data().CourseYearSection;
      holdTeamMembers[1] = doc.data().TeamMembers;
      holdTeamName[1] = doc.data().TeamName;
      holdTeamNumber[1] = doc.data().TeamNumber;
      holdTeamWins[1] = doc.data().Wins;
      holdTeamLoss[1] = doc.data().Losses;
    } else if (hold == 3) {
      holdTeamClass[2] = doc.data().CourseYearSection;
      holdTeamMembers[2] = doc.data().TeamMembers;
      holdTeamName[2] = doc.data().TeamName;
      holdTeamNumber[2] = doc.data().TeamNumber;
      holdTeamWins[2] = doc.data().Wins;
      holdTeamLoss[2] = doc.data().Losses;
    }
    hold++;
  });

  txtCP.textContent = holdTeamName[0];
  txt1R.textContent = holdTeamName[1];
  txt2R.textContent = holdTeamName[2];

  createHistoryWrapper.style.display = "block";
}
//#endregion

//#region - View Champion Team Details
txtCP.addEventListener("click", () => {
  txtTeamNumber02.textContent = holdTeamNumber[0];
  txtTeamName02.textContent = holdTeamName[0];
  txtWins02.textContent = holdTeamWins[0];
  txtLoss02.textContent = holdTeamLoss[0];
  txtCourseYearSection2.textContent = holdTeamClass[0];

  for (let x = 0; x < holdTeamMembers[0].length; x++) {
    let p = `<p class="member">${holdTeamMembers[0][x]}</p>`;
    memberContainer.insertAdjacentHTML("beforeend", p);
  }
  showTeamDetails.style.display = "block";
});
//#endregion

//#region - View 1st Runner Up Team Details
txt1R.addEventListener("click", () => {
  txtTeamNumber02.textContent = holdTeamNumber[1];
  txtTeamName02.textContent = holdTeamName[1];
  txtWins02.textContent = holdTeamWins[1];
  txtLoss02.textContent = holdTeamLoss[1];
  txtCourseYearSection2.textContent = holdTeamClass[1];

  for (let x = 0; x < holdTeamMembers[1].length; x++) {
    let p = `<p class="member">${holdTeamMembers[1][x]}</p>`;
    memberContainer.insertAdjacentHTML("beforeend", p);
  }
  showTeamDetails.style.display = "block";
});
//#endregion

//#region - View 2nd Runner Up Team Details
txt2R.addEventListener("click", () => {
  txtTeamNumber02.textContent = holdTeamNumber[2];
  txtTeamName02.textContent = holdTeamName[2];
  txtWins02.textContent = holdTeamWins[2];
  txtLoss02.textContent = holdTeamLoss[2];
  txtCourseYearSection2.textContent = holdTeamClass[2];

  for (let x = 0; x < holdTeamMembers[2].length; x++) {
    let p = `<p class="member">${holdTeamMembers[2][x]}</p>`;
    memberContainer.insertAdjacentHTML("beforeend", p);
  }
  showTeamDetails.style.display = "block";
});
//#endregion

//#region - Create Game History
async function CreateGameHistory() {
  if (checkAddHistory.checked == false) {
    swal("Oww!", "*Unable to Create History, Checkbox not Checked", "error");
    // info04.textContent = "*Unable to Create History, Checkbox not Checked";
    // info04.style.color = "red";
  } else {
    const batch = writeBatch(db);

    await addDoc(collection(db, "GameHistory"), {
      From: syFrom,
      To: syTo,
      EventName: eName,
      GameName: gName,
      Date: gDate,
      TournamentType: "Round Robin",
      Status: "normal",
      DeleteDate: "",
      Champ: holdTeamName[0],
      First: holdTeamName[1],
      Second: holdTeamName[2],
    }).then((docRef) => {
      createHistoryWrapper.style.display = "none";
      checkAddHistory.checked = false;
      info04.textContent = "This informations will be added to history.";
      info04.style.color = "";

      const champRef = doc(db, "GameHistory", docRef.id, "Teams", "Champ");
      batch.set(champRef, {
        Rank: "Champion",
        TeamName: holdTeamName[0],
        Class: holdTeamClass[0],
        TeamMembers: holdTeamMembers[0],
      });

      const firstRef = doc(db, "GameHistory", docRef.id, "Teams", "First");
      batch.set(firstRef, {
        Rank: "1st Runner Up",
        TeamName: holdTeamName[1],
        Class: holdTeamClass[1],
        TeamMembers: holdTeamMembers[1],
      });

      const secondRef = doc(db, "GameHistory", docRef.id, "Teams", "Second");
      batch.set(secondRef, {
        Rank: "2nd Runner Up",
        TeamName: holdTeamName[2],
        Class: holdTeamClass[2],
        TeamMembers: holdTeamMembers[2],
      });
    });

    await batch.commit();
    // alert("History Created");
    swal("Wow!", "Game History Created Successfully!", "success");
  }
}
//#endregion

GetTeam();

//#region - Get Team Details
async function GetTeam() {
  const ref = query(
    collection(
      db,
      "Events",
      holdEventID,
      "EventGames",
      holdGameID,
      "TeamDetails"
    )
  );
  const querySnap = await getDocs(ref);
  querySnap.forEach((doc) => {
    FetchTeam(doc.id);
  });
}
//#endregion

//#region - Fetch Teams
async function FetchTeam(ids) {
  let holdTotalScore = 0;
  const ref = query(
    collection(
      db,
      "Events",
      holdEventID,
      "EventGames",
      holdGameID,
      "ScoreHistory"
    ),
    where("WinTeam", "==", ids)
  );
  const querySnap = await getDocs(ref);
  querySnap.forEach((doc) => {
    holdTotalScore += parseInt(doc.data().WinScore);
  });

  let teamRef = doc(
    db,
    "Events",
    holdEventID,
    "EventGames",
    holdGameID,
    "TeamDetails",
    ids
  );

  await updateDoc(teamRef, {
    TotalScore: holdTotalScore,
  });
}
//#endregion

btnUpdateTeamDesc.addEventListener("click", UpdateTeamDetails);
btnUpdateRoundDesc.addEventListener("click", UpdateRoundDate);
btnGetScores.addEventListener("click", SaveTeamScore);
sortTeam.addEventListener("change", SortTeams);
btnShowCreateHistory.addEventListener("click", ShowCreateHistory);
btnAddHist.addEventListener("click", CreateGameHistory);
