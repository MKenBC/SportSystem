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

//#region - Element References
//-------------------GET/SET COLLECTION ID----------------------------------------------------------------------------
const holdEventID = localStorage.getItem("studentPassEventID");
const holdGameID = localStorage.getItem("studentPassGameID");
document.querySelector("#eventName").textContent =
  localStorage.getItem("studentEventName");
document.querySelector("#gameName").textContent =
  localStorage.getItem("studentGameName");
const tableTeamRanking = document.querySelector("#tableTeamRanking");
//#endregion

//-------------------METHODS/FUNCTIONS----------------------------------------------------------------------------

//#region - Get Team Rank
async function GetAllTeamRankings() {
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
    RenderTeamDetails(doc.data(), doc.id, hold);
    hold++;
  });
}
//#endregion

GetAllTeamRankings();

//#region - Render Team
function RenderTeamDetails(content, ids, hold) {
  const tr = `<tr data-id="${ids}" class="tr">
               <td>${hold}</td>
                <td>${content.TeamName}</td>
                <td>${content.Wins}</td>
                <td>${content.TotalScore}</td>
              </tr>`;

  tableTeamRanking.insertAdjacentHTML("beforeend", tr);
}
//#endregion
