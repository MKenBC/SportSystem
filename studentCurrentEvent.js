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
  orderBy,
  query,
  getDocs,
  collection,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const db = getFirestore();
//#endregion

//#region - Element Reference
const tableEvents = document.querySelector("#tableEvents");
const trs = tableEvents.getElementsByClassName("tr");
const searchEvent = document.querySelector("#searchEvent");
const sortEvent = document.querySelector("#sortEvent");
//#endregion

//#region - Sort Event
async function SortEvent() {
  tableEvents.innerHTML = ``;
  tableEvents.insertAdjacentHTML(
    "beforeend",
    `         <tr>
                <th>School Year</th>
                <th>Event Name</th>
                <th>Date</th>
                <th>Status</th>
                <th>Visibility</th>
                <th>Actions</th>
              </tr>`
  );
  let ref;
  if (sortEvent.value == "From") {
    ref = query(collection(db, "Events"), orderBy("From", "desc"));
  } else if (sortEvent.value == "EventName") {
    ref = query(collection(db, "Events"), orderBy("EventName"));
  } else {
    ref = query(collection(db, "Events"), orderBy("Date", "desc"));
  }

  const querySnap = await getDocs(ref);
  querySnap.forEach((doc) => {
    renderEvents(doc.data(), doc.id);
  });
}
//#endregion

//#region - Get all Event Data
async function GetAllData() {
  const ref = query(collection(db, "Events"), orderBy("Date", "desc"));
  const querySnap = await getDocs(ref);
  querySnap.forEach((doc) => {
    renderEvents(doc.data(), doc.id);
  });
}
//#endregion

GetAllData();

//#region - Table Row Table Functions
function renderEvents(content, ids) {
  let cHold = ``;
  if (content.Status == "On-going") {
    cHold = `class="onGoing"`;
  } else if (content.Status == "Finished") {
    cHold = `class="done"`;
  } else {
    cHold = `class="upcoming"`;
  }

  const tr = `<tr data-id="${ids}" class="tr">
               <td>S.Y. ${content.From}-${content.To}</td>
                <td>${content.EventName}</td>
                <td>${content.Date}</td>
                <td ${cHold}>${content.Status}</td>
                <td>
                  <button class="btn btn-view">View</button>
                </td>
              </tr>`;

  if (content.Visibility == "Show") {
    tableEvents.insertAdjacentHTML("beforeend", tr);

    //Click View Event Games
    const btnViewEventGames = document.querySelector(
      `[data-id='${ids}'] .btn-view`
    );
    btnViewEventGames.addEventListener("click", () => {
      localStorage.setItem("studentPassEventID", ids);
      localStorage.setItem(
        "studentEventName",
        content.EventName +
          " - (" +
          "S.Y. " +
          content.From +
          "-" +
          content.To +
          ")"
      );
      window.location.href = "./studentGames.html";
      return false;
    });
  }
}
//#endregion

//#region - Search from table
function SearchFromTable() {
  // Declare search string
  var filter = searchEvent.value.toUpperCase();

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

sortEvent.addEventListener("change", SortEvent);
searchEvent.addEventListener("keyup", SearchFromTable);
