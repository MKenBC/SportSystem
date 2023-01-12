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
  orderBy,
  getDocs,
  query,
  collection,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const db = getFirestore();
//#endregion

//#region - Element References
//-------------------ELEMENT REFERENCES-----------------------------------------------------------------
const tableAccounts = document.querySelector("#tableAccounts");
const sortAccount = document.querySelector("#sortAccount");
const btnExport = document.querySelector("#btnExport");
const trs = tableAccounts.getElementsByClassName("tr");
const searchAccount = document.querySelector("#searchAccount");
//#endregion

//#region - Sort Table
async function SortAcc() {
  tableAccounts.innerHTML = ``;
  tableAccounts.insertAdjacentHTML(
    "beforeend",
    `         <tr>
                <th>Email</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Username</th>
              </tr>`
  );
  let ref;

  if (sortAccount.value == "FirstName") {
    ref = query(collection(db, "SubAdminAccounts"), orderBy("FirstName"));
  } else if (sortAccount.value == "LastName") {
    ref = query(collection(db, "SubAdminAccounts"), orderBy("LastName"));
  } else if (sortAccount.value == "Username") {
    ref = query(collection(db, "SubAdminAccounts"), orderBy("Username"));
  } else {
    ref = query(collection(db, "SubAdminAccounts"));
  }

  const querySnap = await getDocs(ref);
  querySnap.forEach((doc) => {
    renderAccounts(doc.data(), doc.id);
  });
}
//#endregion

//#region - Get All Data
async function GetAllData() {
  const ref = query(collection(db, "SubAdminAccounts"));
  const querySnap = await getDocs(ref);
  querySnap.forEach((doc) => {
    renderAccounts(doc.data(), doc.id);
  });
}
//#endregion

GetAllData();
let idHolder;

//#region - Render History
function renderAccounts(content, ids) {
  const tr = `
              <tr data-id="${ids}" class="tr">
                <td>${ids}</td>
                <td>${content.FirstName}</td>
                <td>${content.LastName}</td>
                <td>${content.Username}</td>
              </tr>`;

  tableAccounts.insertAdjacentHTML("beforeend", tr);
}
//#endregion

//#region - Export Table
function ExcelReport() {
  let tab_text = "<table border='2px'><tr bgcolor='#87AFC6'>";
  let sa;
  let j = 0;
  let tab = tableAccounts;

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

//#region - Search from table
function SearchFromTable() {
  // Declare search string
  var filter = searchAccount.value.toUpperCase();

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

//-----------------------BUTTON EVENTS------------------------------------------------------------------------------
// btnDeletePermission.addEventListener("click", DeleteAdmin);
sortAccount.addEventListener("change", SortAcc);
searchAccount.addEventListener("keyup", SearchFromTable);
btnExport.addEventListener("click", ExcelReport);
