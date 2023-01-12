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
  orderBy,
  collection,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const db = getFirestore();
//#endregion

//#region - Element References
//-------------------GET/SET COLLECTION ID-------------------------------------------------------------
const holdEventID = localStorage.getItem("studentPassEventID");
const holdGameID = localStorage.getItem("studentPassGameID");
const mCount = document.querySelector("#mCount");
document.querySelector("#gameName").textContent =
  localStorage.getItem("studentGameName");

const tableRoundDetails = document.querySelector("#tableRoundDetails");
const tableTeamDetails = document.querySelector("#tableTeamDetails");
const sortTeam = document.querySelector("#sortTeam");

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
//#endregion

let teamRR1D, teamRR4D, round, boxes, gamePlay, teamArr;

//-------------------FUNCTIONS-------------------------------------------------------------------------

//#region - Hide Modal Function
window.addEventListener("click", (e) => {
  if (e.target === showTeamDetails) {
    showTeamDetails.style.display = "none";
    memberContainer.innerHTML = "";
  }
});
//#endregion

//#region - GET Team Matches
async function GetTeamMatches() {
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

  mCount.textContent = gamePlay + "/" + teamRR1D.length / 3 / 2;
  teamRR4D = convertArray(round, boxes, teamRR1D);

  for (let x = 0; x < round; x++) {
    RenderTeamBrackets(x, boxes);
  }
}
//#endregion

GetTeamMatches();

//#region - Render Team Brackets
function RenderTeamBrackets(x, y) {
  let field = ``;
  for (let z = 0; z < y; z++) {
    let a1 = ``,
      b1 = ``;

    if (teamRR4D[x][z][0][2] == true) {
      a1 = `win`;
    }

    if (teamRR4D[x][z][1][2] == true) {
      b1 = `win`;
    }

    let ids = `field${x}${z}`,
      boxNum = z + 1;

    field += `
<div class="matchContain">
  <p class="boxnum">${boxNum}</p>
  <fieldset id="${ids}" class="matchContainer">
    <div class="row">
      <label class="lbl01 ${a1}" for=""
        >${teamRR4D[x][z][0][0]}</label
      ><label class="lbl02" for="">${teamRR4D[x][z][0][1]}</label>
    </div>
    <div class="row">
      <label class="lbl01 ${b1}" for=""
        >${teamRR4D[x][z][1][0]}</label
      ><label class="lbl02" for="">${teamRR4D[x][z][1][1]}</label>
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
              </tr>`;

  tableRoundDetails.insertAdjacentHTML("beforeend", tr);
}
//#endregion

//#region - Sort Table
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
                  <button class="btn btn-view">View</button>
                </td>
              </tr>`;

  tableTeamDetails.insertAdjacentHTML("beforeend", tr);

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

sortTeam.addEventListener("change", SortTeams);
