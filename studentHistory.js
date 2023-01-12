//#region - FireStore
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
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  collection,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const db = getFirestore();
//#endregion

//#region - Element References
//-----------------ELEMENT REFERENCE-----------------------------------------------------------------------------
const showTeamDetailsWrapper = document.querySelector(
  "#showTeamDetailsWrapper"
);
const txtTeamRank = document.querySelector("#txtTeamRank");
const txtTeamName = document.querySelector("#txtTeamName");
const txtClass = document.querySelector("#txtClass");
const memberContainer = document.querySelector("#memberContainer");

const sortHistory = document.querySelector("#sortHistory");
const tableHistory = document.querySelector("#tableHistory");
const trs = tableHistory.getElementsByClassName("tr");
const searchHistory = document.querySelector("#searchHistory");
//#endregion

//-----------------FUNCTIONS-----------------------------------------------------------------------------
//#region - Hide Modal Function
window.addEventListener("click", (e) => {
  if (e.target === showTeamDetailsWrapper) {
    showTeamDetailsWrapper.style.display = "none";
    memberContainer.innerHTML = "";
  }
});
//#endregion

//#region - Sort History
async function SortHistory() {
  tableHistory.innerHTML = ``;
  tableHistory.insertAdjacentHTML(
    "beforeend",
    `         <tr>
                <th>School Year</th>
                <th>Event Name</th>
                <th>Game Name</th>
                <th>Date</th>
                <th>Champion</th>
                <th>1st Runner Up</th>
                <th>2nd Runner Up</th>
              </tr>`
  );
  let ref;

  if (sortHistory.value == "From") {
    ref = query(collection(db, "GameHistory"), orderBy("From", "desc"));
  } else if (sortHistory.value == "EventName") {
    ref = query(collection(db, "GameHistory"), orderBy("EventName"));
  } else if (sortHistory.value == "GameName") {
    ref = query(collection(db, "GameHistory"), orderBy("GameName"));
  } else {
    ref = query(collection(db, "GameHistory"), orderBy("Date", "desc"));
  }

  const querySnap = await getDocs(ref);
  querySnap.forEach((doc) => {
    renderHistory(doc.data(), doc.id);
  });
}
//#endregion

//#region - Get All Data
async function GetAllData() {
  const ref = query(collection(db, "GameHistory"), orderBy("Date", "desc"));
  const querySnap = await getDocs(ref);
  querySnap.forEach((doc) => {
    renderHistory(doc.data(), doc.id);
  });
}
//#endregion

GetAllData();

//#region - Render History
function renderHistory(content, ids) {
  const tr = `
              <tr data-id="${ids}" class="tr">
                <td>S.Y. ${content.From}-${content.To}</td>
                <td>${content.EventName}</td>
                <td>${content.GameName}</td>
                <td>${content.Date}</td>
                <td><button class="rowBtn btnChamp">${content.Champ}</button></td>
                <td><button class="rowBtn btnOne">${content.First}</button></td>
                <td><button class="rowBtn btnTwo">${content.Second}</button></td>
              </tr>`;

  if (content.Status == "normal") {
    tableHistory.insertAdjacentHTML("beforeend", tr);

    // Click Show Champ Details
    const btnChamp = document.querySelector(`[data-id='${ids}'] .btnChamp`);
    btnChamp.addEventListener("click", async () => {
      const ref = doc(db, "GameHistory", ids, "Teams", "Champ");
      const querySnap = await getDoc(ref);

      txtTeamRank.textContent = querySnap.data().Rank;
      txtTeamName.textContent = querySnap.data().TeamName;
      txtClass.textContent = querySnap.data().Class;

      let teamArr = querySnap.data().TeamMembers;
      for (let x = 0; x < teamArr.length; x++) {
        let p = `<p class="member">${teamArr[x]}</p>`;
        memberContainer.insertAdjacentHTML("beforeend", p);
      }

      showTeamDetailsWrapper.style.display = "block";
    });

    // Click Show 1st Runner Up Details
    const btnFirst = document.querySelector(`[data-id='${ids}'] .btnOne`);
    btnFirst.addEventListener("click", async () => {
      const ref = doc(db, "GameHistory", ids, "Teams", "First");
      const querySnap = await getDoc(ref);

      txtTeamRank.textContent = querySnap.data().Rank;
      txtTeamName.textContent = querySnap.data().TeamName;
      txtClass.textContent = querySnap.data().Class;

      let teamArr = querySnap.data().TeamMembers;
      for (let x = 0; x < teamArr.length; x++) {
        let p = `<p class="member">${teamArr[x]}</p>`;
        memberContainer.insertAdjacentHTML("beforeend", p);
      }

      showTeamDetailsWrapper.style.display = "block";
    });

    // Click Show 2nd Runner Up Details
    const btnSecond = document.querySelector(`[data-id='${ids}'] .btnTwo`);
    btnSecond.addEventListener("click", async () => {
      const ref = doc(db, "GameHistory", ids, "Teams", "Second");
      const querySnap = await getDoc(ref);

      txtTeamRank.textContent = querySnap.data().Rank;
      txtTeamName.textContent = querySnap.data().TeamName;
      txtClass.textContent = querySnap.data().Class;

      let teamArr = querySnap.data().TeamMembers;
      for (let x = 0; x < teamArr.length; x++) {
        let p = `<p class="member">${teamArr[x]}</p>`;
        memberContainer.insertAdjacentHTML("beforeend", p);
      }

      showTeamDetailsWrapper.style.display = "block";
    });
  }
}
//#endregion

//#region - Search from table
function SearchFromTable() {
  // Declare search string
  var filter = searchHistory.value.toUpperCase();

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

sortHistory.addEventListener("change", SortHistory);
searchHistory.addEventListener("keyup", SearchFromTable);
