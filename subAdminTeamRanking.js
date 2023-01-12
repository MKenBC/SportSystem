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
  where,
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
document.querySelector("#gameName").textContent =
  localStorage.getItem("subGameName");

const tableTeamRanking = document.querySelector("#tableTeamRanking");
const btnExport = document.querySelector("#btnExport");
//#endregion

GetTeam();

//#region - Get Team Ranking
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

//#region  - Fetch Team
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

//#region - Delay Time
function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

delay(1500).then(() => {
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

  GetAllTeamRankings();

  function RenderTeamDetails(content, ids, hold) {
    const tr = `<tr data-id="${ids}" class="tr">
               <td>${hold}</td>
                <td>${content.TeamName}</td>
                <td>${content.Wins}</td>
                <td>${content.TotalScore}</td>
              </tr>`;

    tableTeamRanking.insertAdjacentHTML("beforeend", tr);
  }
});
function ExcelReport() {
  let tab_text = "<table border='2px'><tr bgcolor='#87AFC6'>";
  let sa;
  let j = 0;
  let tab = tableTeamRanking;

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

btnExport.addEventListener("click", ExcelReport);
