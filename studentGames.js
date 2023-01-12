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
  getDocs,
  collection,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const db = getFirestore();
//#endregion

//#region - Element Reference
//-------------------GET/SET COLLECTION ID-------------------------------------------------------------
const gameID = document.querySelector("#gameID");
document.querySelector("#tHeader").textContent =
  localStorage.getItem("studentEventName");

gameID.textContent = localStorage.getItem("studentPassEventID");

const holdEventID = localStorage.getItem("studentPassEventID");

//DOM 3 - Details
const gameDetailsWrapper = document.querySelector("#gameDetailsWrapper");
const txtGameFacility = document.querySelector("#txtGameFacility");
const txtFacilityStatus = document.querySelector("#txtFacilityStatus");
const txtStartDate = document.querySelector("#txtStartDate");
const txtEndDate = document.querySelector("#txtEndDate");
const txtStartTime = document.querySelector("#txtStartTime");
const txtEndTime = document.querySelector("#txtEndTime");
//#endregion

window.addEventListener("click", (e) => {
  if (e.target === gameDetailsWrapper) {
    gameDetailsWrapper.style.display = "none";
  }
});

//#region  - Get All Data
async function GetAllData() {
  const ref = query(collection(db, "Events", holdEventID, "EventGames"));
  const querySnap = await getDocs(ref);
  querySnap.forEach((doc) => {
    renderGames(doc.data(), doc.id);
  });
}
//#endregion

GetAllData();

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
                  <button class="btn btn-view">View</button>
                </td>
              </tr>`;

  tableGames.insertAdjacentHTML("beforeend", tr);

  // Click Show Game Bracket
  const btnViewGame = document.querySelector(`[data-id='${ids}'] .btn-view`);
  btnViewGame.addEventListener("click", () => {
    localStorage.setItem("studentPassGameID", ids);
    localStorage.setItem("studentGameName", content.GameName);

    window.location.href = "./studentLeagueRR.html";

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
