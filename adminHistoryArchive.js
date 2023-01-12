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
  writeBatch,
  orderBy,
  getDoc,
  getDocs,
  query,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const db = getFirestore();
//#endregion

//-------------------ELEMENT REFERENCES-------------------------------------------------------------------

const showTeamDetailsWrapper = document.querySelector(
  "#showTeamDetailsWrapper"
);
const txtTeamRank = document.querySelector("#txtTeamRank");
const txtTeamName = document.querySelector("#txtTeamName");
const txtClass = document.querySelector("#txtClass");
const memberContainer = document.querySelector("#memberContainer");

//restore modal
const restoreWrapper = document.querySelector("#restoreWrapper");
const txtSY = document.querySelector("#txtSY");
const txtEN = document.querySelector("#txtEN");
const txtGN = document.querySelector("#txtGN");
const txtTT = document.querySelector("#txtTT");
const txtCP = document.querySelector("#txtCP");
const txt1R = document.querySelector("#txt1R");
const txt2R = document.querySelector("#txt2R");
const checkRestore = document.querySelector("#checkRestore");
const btnRestorePermission = document.querySelector("#btnRestorePermission");

//table
const tableHistory = document.querySelector("#tableHistory");
const trs = tableHistory.getElementsByClassName("tr");
const searchHistory = document.querySelector("#searchHistory");
const sortHistory = document.querySelector("#sortHistory");
const btnExport = document.querySelector("#btnExport");
//-------------------METHODS-------------------------------------------------------------------------------

window.addEventListener("click", (e) => {
  if (e.target === showTeamDetailsWrapper) {
    showTeamDetailsWrapper.style.display = "none";
    memberContainer.innerHTML = "";
  }

  if (e.target === restoreWrapper) {
    restoreWrapper.style.display = "none";
  }
});

//#region - Sort Table
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
                <th>Actions</th>
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
let idHolder;

//#region - Render History
function renderHistory(content, ids) {
  const tr = `
              <tr data-id="${ids}" class="tr">
                <td>S.Y. ${content.From}-${content.To}</td>
                <td>${content.EventName}</td>
                <td>${content.GameName}</td>
                <td>${content.Date}</td>
                <td>${content.DeleteDate}</td>
                <td><button class="rowBtn btnChamp">${content.Champ}</button></td>
                <td><button class="rowBtn btnOne">${content.First}</button></td>
                <td><button class="rowBtn btnTwo">${content.Second}</button></td>
                <td>
                  <button class="btn btn-restore">Restore</button>
                </td>
              </tr>`;

  let today = new Date();
  let holdDay = String(today.getDate()).padStart(2, "0");
  let holdMonth = String(1 + today.getMonth()).padStart(2, "0");
  let dateToday = today.getFullYear() + "-" + holdMonth + "-" + holdDay;

  let deletionDate = new Date(content.DeleteDate);
  let deleteYYYY = deletionDate.getFullYear();
  let deleteMM = String(1 + deletionDate.getMonth()).padStart(2, "0");
  let deleteDD = String(deletionDate.getDate()).padStart(2, "0");
  let deleteDate = deleteYYYY + "-" + deleteMM + "-" + deleteDD;

  if (dateToday == deleteDate) {
    idHolder = ids;
    DeleteInfo();
  } else {
    if (content.Status == "Archived") {
      tableHistory.insertAdjacentHTML("beforeend", tr);

      //Click Show Restore Modal
      const btnRestore = document.querySelector(
        `[data-id='${ids}'] .btn-restore`
      );
      btnRestore.addEventListener("click", () => {
        restoreWrapper.style.display = "block";
        txtSY.textContent = "S.Y. " + content.From + "-" + content.To;
        txtEN.textContent = content.EventName;
        txtGN.textContent = content.GameName;
        txtTT.textContent = content.TournamentType;
        txtCP.textContent = content.Champ;
        txt1R.textContent = content.First;
        txt2R.textContent = content.Second;

        idHolder = ids;
      });

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

        // idHolder = ids;
        // teamIDHolder = "Champ";

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

        // idHolder = ids;
        // teamIDHolder = "First";

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

        // idHolder = ids;
        // teamIDHolder = "Second";

        showTeamDetailsWrapper.style.display = "block";
      });
    }
  }
}
//#endregion

//#region - Restore History
async function RestoreInfo() {
  if (checkRestore.checked == false) {
    swal(
      "Oww!",
      "*Unable to Restore Information, Checkbox not Checked",
      "error"
    );
  } else {
    updateDoc(doc(db, "GameHistory", idHolder), {
      Status: "normal",
      DeleteDate: "",
    })
      .then(() => {
        // alert("Data Updated Successfully");
        swal("Wow!", "Data Restored Successfully!", "success").then(() => {
          restoreWrapper.style.display = "none";
          window.location.reload();
        });
      })
      .catch((error) => {
        swal("Oww!", "*Unsuccessuful operation, error:" + error, "error");
        // alert("Unsuccessuful operation, error:" + error);
      });
  }
}
//#endregion

//#region - Delete History
async function DeleteInfo() {
  const batch = writeBatch(db);
  const getAllTeams = query(collection(db, "GameHistory", idHolder, "Teams"));
  const querySnap = await getDocs(getAllTeams);
  querySnap.forEach((doc01) => {
    let teamRef = doc(db, "GameHistory", idHolder, "Teams", doc01.id);
    batch.delete(teamRef);
  });
  await batch.commit();
  deleteDoc(doc(db, "GameHistory", idHolder))
    .then(() => {
      swal("Yay!", "History Data Deleted!", "info").then(() => {
        window.location.reload();
      });
    })
    .catch((error) => {
      swal("Oww!", "*Unsuccessuful operation, error:" + error, "error");
    });
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

//#region - Export Table
function ExcelReport() {
  let tab_text = "<table border='2px'><tr bgcolor='#87AFC6'>";
  let sa;
  let j = 0;
  let tab = tableHistory;

  for (j = 0; j < tab.rows.length; j++) {
    tab_text = tab_text + tab.rows[j].innerHTML + "</tr>";
    // tab_text = tab_text + "</tr>";
  }

  tab_text = tab_text + "</table>";
  tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, ""); //remove if u want links in your table
  tab_text = tab_text.replace(/<img[^>]*>/gi, ""); // remove if u want images in your table
  tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // removes input params
  tab_text = tab_text.replace(/<button[^>]*>|<\/button>/gi, ""); // removes button params

  var ua = window.navigator.userAgent;
  var msie = ua.indexOf("MSIE ");

  if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
    // If Internet Explorer
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

searchHistory.addEventListener("keyup", SearchFromTable);
btnRestorePermission.addEventListener("click", RestoreInfo);
sortHistory.addEventListener("change", SortHistory);
btnExport.addEventListener("click", ExcelReport);
