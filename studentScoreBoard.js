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
  orderBy,
  getDocs,
  collection,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const db = getFirestore();
//#endregion

//#region - Elemet Refenrences
//-------------------GET/SET COLLECTION ID----------------------------------------------------------------------------
const holdEventID = localStorage.getItem("studentPassEventID");
const holdGameID = localStorage.getItem("studentPassGameID");
document.querySelector("#eventName").textContent =
  localStorage.getItem("studentEventName");
document.querySelector("#tHeader").textContent =
  localStorage.getItem("studentGameName");

const tableScoreBoard = document.querySelector("#tableScoreBoard");
const trs = tableScoreBoard.getElementsByClassName("tr");
const searchScoreBoard = document.querySelector("#searchScoreBoard");
const sortScoreBoard = document.querySelector("#sortScoreBoard");
//#endregion

//-------------------METHODS/FUNCTIONS----------------------------------------------------------------------------

//#region - Sort Table
async function SortAllScoreBoard() {
  tableScoreBoard.innerHTML = ``;
  tableScoreBoard.insertAdjacentHTML(
    "beforeend",
    `
              <tr>
                <th>Round #</th>
                <th>Box #</th>
                <th>Winning Team</th>
                <th>Score</th>
                <th>Non-Winning Team</th>
                <th>Score</th>
                <th>Actions</th>
              </tr>
  `
  );

  let ref;

  if (sortScoreBoard.value == "WinTeam") {
    ref = query(
      collection(
        db,
        "Events",
        holdEventID,
        "EventGames",
        holdGameID,
        "ScoreHistory"
      ),
      orderBy("WinTeam")
    );
  } else if (sortScoreBoard.value == "WinScore") {
    ref = query(
      collection(
        db,
        "Events",
        holdEventID,
        "EventGames",
        holdGameID,
        "ScoreHistory"
      ),
      orderBy("WinScore", "desc")
    );
  } else if (sortScoreBoard.value == "LossTeam") {
    ref = query(
      collection(
        db,
        "Events",
        holdEventID,
        "EventGames",
        holdGameID,
        "ScoreHistory"
      ),
      orderBy("LossTeam")
    );
  } else if (sortScoreBoard.value == "LossScore") {
    ref = query(
      collection(
        db,
        "Events",
        holdEventID,
        "EventGames",
        holdGameID,
        "ScoreHistory"
      ),
      orderBy("LossScore", "desc")
    );
  } else {
    ref = query(
      collection(
        db,
        "Events",
        holdEventID,
        "EventGames",
        holdGameID,
        "ScoreHistory"
      )
    );
  }
  const querySnap = await getDocs(ref);
  querySnap.forEach((doc) => {
    RenderHistory(doc.data(), doc.id);
  });
}
//#endregion

//#region - Get Score History
async function GetAllScoreHistory() {
  const ref = query(
    collection(
      db,
      "Events",
      holdEventID,
      "EventGames",
      holdGameID,
      "ScoreHistory"
    )
  );
  const querySnap = await getDocs(ref);
  querySnap.forEach((doc) => {
    RenderHistory(doc.data(), doc.id);
  });
}
//#endregion

GetAllScoreHistory();

//#region - Render History
function RenderHistory(content, ids) {
  const tr = `<tr data-id="${ids}" class="tr">
               <td>${content.Round}</td>
                <td>${content.Box}</td>
                <td class="winTeam">${content.WinTeam}</td>
                <td class="winTeam">${content.WinScore}</td>
                <td class="lossTeam">${content.LossTeam}</td>
                <td class="lossTeam">${content.LossScore}</td>
              </tr>`;

  tableScoreBoard.insertAdjacentHTML("beforeend", tr);
}
//#endregion

//#region - Search from table
function SearchFromTable() {
  // Declare search string
  var filter = searchScoreBoard.value.toUpperCase();

  // Loop through first tbody's rows
  for (var rowI = 0; rowI < trs.length; rowI++) {
    // define the row's cells
    var tds = trs[rowI].getElementsByTagName("td");

    // hide the row
    trs[rowI].style.display = "none";

    // loop through row cells
    for (var cellI = 0; cellI < tds.length; cellI++) {
      // if there's a match
      if (tds[cellI].innerHTML.toUpperCase().indexOf(filter) > -1) {
        // show the row
        trs[rowI].style.display = "";

        // skip to the next row
        continue;
      }
    }
  }
}
//#endregion

sortScoreBoard.addEventListener("change", SortAllScoreBoard);
searchScoreBoard.addEventListener("keyup", SearchFromTable);
