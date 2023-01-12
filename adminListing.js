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
  doc,
  writeBatch,
  getDoc,
  getDocs,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const db = getFirestore();
//#endregion
//-------------------GET/SET COLLECTION ID-------------------------------------------------------------
document.querySelector("#tableHeaderText").textContent =
  "Facility Listing: '" + localStorage.getItem("facilityName") + "'";
const facilityID = localStorage.getItem("facilityID");

//-------------------ELEMENT REFERENCES-----------------------------------------------------------------

const tableListing = document.querySelector("#tableListing");
const trs = tableListing.getElementsByClassName("tr");
const btnExport = document.querySelector("#btnExport");
const searchListing = document.querySelector("#searchListing");
const sortListing = document.querySelector("#sortListing");

const updateListingWrapper = document.querySelector("#updateListingWrapper");
const txtRequestDate = document.querySelector("#txtRequestDate");
const txtEvent = document.querySelector("#txtEvent");
const txtGameName = document.querySelector("#txtGameName");
const txtCreator = document.querySelector("#txtCreator");
const txtStartDate = document.querySelector("#txtStartDate");
const txtEndDate = document.querySelector("#txtEndDate");
const txtStartTime = document.querySelector("#txtStartTime");
const txtEndTime = document.querySelector("#txtEndTime");
const selectPermitionStatus = document.querySelector("#selectPermitionStatus");
const checkUpdateStatus = document.querySelector("#checkUpdateStatus");
const btnUpdateStatus = document.querySelector("#btnUpdateStatus");

window.addEventListener("click", (e) => {
  if (e.target === updateListingWrapper) {
    checkUpdateStatus.checked = false;
    updateListingWrapper.style.display = "none";
  }
});

async function SortListing() {
  tableListing.innerHTML = ``;
  tableListing.insertAdjacentHTML(
    "beforeend",
    `
                <tr>
                <th>Request Date</th>
                <th>Event</th>
                <th>Game Name</th>
                <th>Creator</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
  `
  );
  let ref;

  if (selectPermitionStatus.value == "RequestDate") {
    ref = query(
      collection(db, "GameFacility", facilityID, "Listing"),
      orderBy("RequestDate", "desc")
    );
  } else if (selectPermitionStatus.value == "EventCode") {
    ref = query(
      collection(db, "GameFacility", facilityID, "Listing"),
      orderBy("EventCode")
    );
  } else if (selectPermitionStatus.value == "GameName") {
    ref = query(
      collection(db, "GameFacility", facilityID, "Listing"),
      orderBy("GameName")
    );
  } else if (selectPermitionStatus.value == "Creator") {
    ref = query(
      collection(db, "GameFacility", facilityID, "Listing"),
      orderBy("Creator")
    );
  } else if (selectPermitionStatus.value == "StartDate") {
    ref = query(
      collection(db, "GameFacility", facilityID, "Listing"),
      orderBy("StartDate", "desc")
    );
  }

  const querySnap = await getDocs(ref);
  querySnap.forEach((doc) => {
    renderListing(doc.data(), doc.id);
  });
}

async function GetAllData() {
  const ref = query(
    collection(db, "GameFacility", facilityID, "Listing"),
    orderBy("RequestDate", "desc")
  );
  const querySnap = await getDocs(ref);
  querySnap.forEach((doc) => {
    renderListing(doc.data(), doc.id);
  });
}

GetAllData();
let idHolder, eventIDHolder;

//#region - Render Facility
function renderListing(content, ids) {
  let cHold = ``;
  if (content.FacilityStatus == "Pending") {
    cHold = `class="pending"`;
  } else if (content.FacilityStatus == "Approved") {
    cHold = `class="approved"`;
  } else if (content.FacilityStatus == "Declined") {
    cHold = `class="declined"`;
  }

  const tr = `
              <tr data-id="${ids}" class="tr">
                <td>${content.RequestDate}</td>
                <td>${content.EventCode}</td>
                <td>${content.GameName}</td>
                <td>${content.Creator}</td>
                <td>${content.StartDate}</td>
                <td>${content.EndDate}</td>
                <td>${content.StartTime}</td>
                <td>${content.EndTime}</td>
                <td ${cHold}>${content.FacilityStatus}</td>
                <td>
                  <button class="btn btn-edit">Edit</button>
                </td>
              </tr>`;

  tableListing.insertAdjacentHTML("beforeend", tr);

  const btnEdit = document.querySelector(`[data-id='${ids}'] .btn-edit`);
  btnEdit.addEventListener("click", () => {
    txtRequestDate.textContent = content.RequestDate;
    txtEvent.textContent = content.EventCode;
    txtGameName.textContent = content.GameName;
    txtCreator.textContent = content.Creator;
    txtStartDate.textContent = content.StartDate;
    txtEndDate.textContent = content.EndDate;
    txtStartTime.textContent = content.StartTime;
    txtEndTime.textContent = content.EndTime;

    if (content.FacilityStatus == "Pending") {
      selectPermitionStatus.selectedIndex = 1;
    } else if (content.FacilityStatus == "Declined") {
      selectPermitionStatus.selectedIndex = 2;
    } else if (content.FacilityStatus == "Approved") {
      selectPermitionStatus.selectedIndex = 3;
    }

    updateListingWrapper.style.display = "block";

    idHolder = ids;
    eventIDHolder = content.EventID;
  });
}
//#endregion

async function UpdateListing() {
  if (selectPermitionStatus.selectedIndex == 0) {
    swal("Oww!", "*Please Choose Status", "error");
  } else {
    if (checkUpdateStatus.checked == true) {
      const batch = writeBatch(db);

      const listingRef = doc(
        db,
        "GameFacility",
        facilityID,
        "Listing",
        idHolder
      );
      batch.update(listingRef, {
        FacilityStatus: selectPermitionStatus.value,
      });

      const gameRef = doc(db, "Events", eventIDHolder, "EventGames", idHolder);
      batch.update(gameRef, {
        FacilityStatus: selectPermitionStatus.value,
      });

      await batch.commit();
      swal("Wow!", "Game History Created Successfully!", "success").then(() => {
        updateListingWrapper.style.display = "none";
        checkUpdateStatus.checked = false;
        window.location.reload();
      });
    } else {
      swal("Oww!", "*Please Check Permission to Update Status", "error");
    }
  }
}

//#region - Search from table
function SearchFromTable() {
  // Declare search string
  var filter = searchListing.value.toUpperCase();

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
  let tab = tableListing;

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

btnUpdateStatus.addEventListener("click", UpdateListing);
btnExport.addEventListener("click", ExcelReport);
searchListing.addEventListener("keyup", SearchFromTable);
