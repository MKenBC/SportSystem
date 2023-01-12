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
  orderBy,
  getDocs,
  collection,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const db = getFirestore();
//#endregion

//#region - Element References
//-------------------GET/SET COLLECTION ID----------------------------------------------------------------------------
const holdEventID = localStorage.getItem("subPassEventID");
const holdGameID = localStorage.getItem("subPassGameID");
document.querySelector("#eventName").textContent =
  localStorage.getItem("subEventCode");
document.querySelector("#tHeader").textContent =
  localStorage.getItem("subGameName");

const tableScoreBoard = document.querySelector("#tableScoreBoard");
const trs = tableScoreBoard.getElementsByClassName("tr");
const searchScoreBoard = document.querySelector("#searchScoreBoard");
const sortScoreBoard = document.querySelector("#sortScoreBoard");
const btnExport = document.querySelector("#btnExport");

const getTeamScoresWrapper = document.querySelector("#getTeamScoresWrapper");
const info01 = document.querySelector("#info01");
const btnUpdateScore = document.querySelector("#btnUpdateScore");
const txtWinTeamName = document.querySelector("#txtWinTeamName");
const winTeamScore = document.querySelector("#winTeamScore");
const txtLossTeamName = document.querySelector("#txtLossTeamName");
const lossTeamScore = document.querySelector("#lossTeamScore");
//#endregion

//-------------------METHODS------------------------------------------------------------------------------------------

let scoreBox, scoreRound;

//#region - Hide Modal Function
window.addEventListener("click", (e) => {
  if (e.target === getTeamScoresWrapper) {
    getTeamScoresWrapper.style.display = "none";
    info01.textContent = "Please fill all the information needed.";
    info01.style.color = "";
  }
});
//#endregion

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

//#region - Get All Data
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
    RenderScore(doc.data(), doc.id);
  });
}
//#endregion

GetAllScoreHistory();

//#region - Render Score Board
function RenderScore(content, ids) {
  const tr = `<tr data-id="${ids}" class="tr">
               <td>${content.Round}</td>
                <td>${content.Box}</td>
                <td class="winTeam">${content.WinTeam}</td>
                <td class="winTeam">${content.WinScore}</td>
                <td class="lossTeam">${content.LossTeam}</td>
                <td class="lossTeam">${content.LossScore}</td>
                <td>
                  <button class="btn btn-edit">Edit</button>
                </td>
              </tr>`;

  tableScoreBoard.insertAdjacentHTML("beforeend", tr);

  // Click SHOW get Team Score
  const btnShowUpdate = document.querySelector(`[data-id='${ids}'] .btn-edit`);
  btnShowUpdate.addEventListener("click", () => {
    txtWinTeamName.textContent = content.WinTeam;
    winTeamScore.value = content.WinScore;
    txtLossTeamName.textContent = content.LossTeam;
    lossTeamScore.value = content.LossScore;
    getTeamScoresWrapper.style.display = "block";

    scoreBox = content.Box;
    scoreRound = content.Round;
  });
}
//#endregion

//#region - Save Team Score
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
    // info01.textContent = txtHold;
    // info01.style.color = "red";
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

      await updateDoc(ref, {
        WinScore: winTeamScore.value,
        LossScore: lossTeamScore.value,
      })
        .then(() => {
          // alert("Data Updated");
          swal("Wow!", "ScoreBoard Updated Successfully!", "success").then(
            () => {
              getTeamScoresWrapper.style.display = "none";
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
    } else {
      swal("Oww!", "*Winning Team Score should be Bigger than Non-winning Team Score", "error");
      // info01.textContent = "Winner Score should be Bigger than Losser Score";
      // info01.style.color = "red";
    }
  }
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

//#region - Export Table
function ExcelReport() {
  let tab_text = "<table border='2px'><tr bgcolor='#87AFC6'>";
  let sa;
  let j = 0;
  let tab = tableScoreBoard;

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

//-------------------------------BUTTON EVENTS--------------------------------------------------------------------------
btnUpdateScore.addEventListener("click", SaveTeamScore);
sortScoreBoard.addEventListener("change", SortAllScoreBoard);
searchScoreBoard.addEventListener("keyup", SearchFromTable);
btnExport.addEventListener("click", ExcelReport);
