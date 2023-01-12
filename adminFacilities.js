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
  addDoc,
  writeBatch,
  orderBy,
  getDoc,
  getDocs,
  query,
  collection,
  updateDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const db = getFirestore();
//#endregion

//#region - Element References
//-------------------ELEMENT REFERENCES-----------------------------------------------------------------

// Add Facility Modal

const btnShowAddFacility = document.querySelector("#btnShowAddFacility");
const tableFacilities = document.querySelector("#tableFacilities");
const trs = tableFacilities.getElementsByClassName("tr");
const btnExport = document.querySelector("#btnExport");
const searchFacility = document.querySelector("#searchFacility");
const sortFacility = document.querySelector("#sortFacility");

const createFacilityWrapper = document.querySelector("#createFacilityWrapper");
const facilityName01 = document.querySelector("#facilityName01");
const facilityLocation01 = document.querySelector("#facilityLocation01");
const facilityDescription01 = document.querySelector("#facilityDescription01");
const btnAddFacility = document.querySelector("#btnAddFacility");

const editFacilityWrapper = document.querySelector("#editFacilityWrapper");
const facilityName02 = document.querySelector("#facilityName02");
const facilityLocation02 = document.querySelector("#facilityLocation02");
const facilityDescription02 = document.querySelector("#facilityDescription02");
const btnUpdateFacility = document.querySelector("#btnUpdateFacility");

const deleteFacilityWrapper = document.querySelector("#deleteFacilityWrapper");
const txtFN = document.querySelector("#txtFN");
const txtFL = document.querySelector("#txtFL");
const txtD = document.querySelector("#txtD");
const checkDeleteFacility = document.querySelector("#checkDeleteFacility");
const btnDeleteFacility = document.querySelector("#btnDeleteFacility");

//#endregion

// ----------------------------METHODS--------------------------------------------------------------------------------

btnShowAddFacility.addEventListener("click", () => {
  createFacilityWrapper.style.display = "block";
});

//#region - Hide Modal
window.addEventListener("click", (e) => {
  if (e.target === createFacilityWrapper) {
    createFacilityWrapper.style.display = "none";
  }

  if (e.target === editFacilityWrapper) {
    editFacilityWrapper.style.display = "none";
  }

  if (e.target === deleteFacilityWrapper) {
    deleteFacilityWrapper.style.display = "none";
    checkDeleteFacility.checked = false;
  }
});
//#endregion

//#region - Add Facility Document
async function AddFacilty_AutoID() {
  let txtInfo = "*Please fill";

  if (facilityName01.value == "") {
    txtInfo += " Facility Name";
  }

  if (facilityLocation01.value == "") {
    txtInfo += ", Location";
  }

  if (facilityDescription01.value == "") {
    txtInfo += ", Description";
  }

  if (
    facilityName01.value == "" ||
    facilityLocation01.value == "" ||
    facilityDescription01.value == ""
  ) {
    swal("Oww!", txtInfo, "error");
  } else {
    await addDoc(collection(db, "GameFacility"), {
      Name: facilityName01.value,
      Location: facilityLocation01.value,
      Description: facilityDescription01.value,
    })
      .then(() => {
        createFacilityWrapper.style.display = "none";
        facilityName01.value = "";
        facilityLocation01.value = "";
        facilityDescription01.value = "";
      })
      .catch((error) => {
        swal("Oww!", "Unsuccessuful operation, error:" + error, "error");
      });

    swal("Wow!", "Game Facilty Added Successfully!", "success").then(() => {
      window.location.reload();
    });
  }
}

async function SortFacility() {
  tableFacilities.innerHTML = ``;
  tableFacilities.insertAdjacentHTML(
    "beforeend",
    `         <tr>
                <th>Facility Name</th>
                <th>Location</th>
                <th>Description</th>
                <th>Action</th>
              </tr>`
  );
  let ref = query(collection(db, "GameFacility"), orderBy(sortFacility.value));

  const querySnap = await getDocs(ref);
  querySnap.forEach((doc) => {
    renderFacility(doc.data(), doc.id);
  });
}

//#region - Get All Data
async function GetAllData() {
  const ref = query(collection(db, "GameFacility"), orderBy("Name"));
  const querySnap = await getDocs(ref);
  querySnap.forEach((doc) => {
    renderFacility(doc.data(), doc.id);
  });
}

GetAllData();
let idHolder;

//#region - Render Facility
function renderFacility(content, ids) {
  const tr = `
              <tr data-id="${ids}" class="tr">
                <td>${content.Name}</td>
                <td>${content.Location}</td>
                <td>${content.Description}</td>
                <td>
                  <button class="btn btn-edit">Edit</button>
                  <button class="btn btn-delete">Delete</button>
                  <button class="btn btn-listing">Listing</button>
                </td>
              </tr>`;

  tableFacilities.insertAdjacentHTML("beforeend", tr);

  // Click Show Update Modal
  const btnShowUpdate = document.querySelector(`[data-id='${ids}'] .btn-edit`);
  btnShowUpdate.addEventListener("click", () => {
    editFacilityWrapper.style.display = "block";
    facilityName02.value = content.Name;
    facilityLocation02.value = content.Location;
    facilityDescription02.value = content.Description;

    idHolder = ids;
  });

  // Click Show Delete facility
  const btnShowDelete = document.querySelector(
    `[data-id='${ids}'] .btn-delete`
  );
  btnShowDelete.addEventListener("click", () => {
    deleteFacilityWrapper.style.display = "block";
    txtFN.textContent = content.Name;
    txtFL.textContent = content.Location;
    txtD.textContent = content.Description;

    idHolder = ids;
  });

  // Open Listing
  const btnListing = document.querySelector(`[data-id='${ids}'] .btn-listing`);
  btnListing.addEventListener("click", () => {
    localStorage.setItem("facilityID", ids);
    localStorage.setItem("facilityName", content.Name);
    window.location.href = "./adminListing.html";
    return false;
  });
}
//#endregion

//#region - Update Facilty
function UpdateFacility() {
  let txtInfo = "*Please fill";

  if (facilityName02.value == "") {
    txtInfo += " Facility Name";
  }

  if (facilityLocation02.value == "") {
    txtInfo += ", Location";
  }

  if (facilityDescription02.value == "") {
    txtInfo += ", Description";
  }

  if (
    facilityName02.value == "" ||
    facilityLocation02.value == "" ||
    facilityDescription02.value == ""
  ) {
    swal("Oww!", txtInfo, "error");
  } else {
    updateDoc(doc(db, "GameFacility", idHolder), {
      Name: facilityName02.value,
      Location: facilityLocation02.value,
      Description: facilityDescription02.value,
    })
      .then(() => {
        editFacilityWrapper.style.display = "none";
        facilityName02.value = "";
        facilityLocation02.value = "";
        facilityDescription02.value = "";

        swal("Wow!", "Game Facilty Updated Successfully!", "success").then(
          () => {
            window.location.reload();
          }
        );
      })
      .catch((error) => {
        swal("Oww!", "Unsuccessuful operation, error:" + error, "error");
      });
  }
}

async function DeleteFacilities() {
  if (checkDeleteFacility.checked == false) {
    swal("Oww!", "*Unable to Delete Event, Checkbox not Checked", "error");
  } else {
    const batch = writeBatch(db);
    const getAllLisiting = query(
      collection(db, "GameFacility", idHolder, "Listing")
    );
    const querySnap = await getDocs(getAllLisiting);
    querySnap.forEach((doc01) => {
      let listRef = doc(db, "GameFacility", idHolder, "Listing", doc01.id);
      batch.delete(listRef);
    });
    await batch.commit();

    deleteDoc(doc(db, "GameFacility", idHolder))
      .then(() => {
        deleteFacilityWrapper.style.display = "none";

        swal("Yay!", "Facility Data Deleted!", "info").then(() => {
          window.location.reload();
        });
      })
      .catch((error) => {
        swal("Oww!", "*Unsuccessuful operation, error:" + error, "error");
      });
  }
}

//#region - Search from table
function SearchFromTable() {
  // Declare search string
  var filter = searchFacility.value.toUpperCase();

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
  let tab = tableFacilities;

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

btnAddFacility.addEventListener("click", AddFacilty_AutoID);
btnUpdateFacility.addEventListener("click", UpdateFacility);
btnDeleteFacility.addEventListener("click", DeleteFacilities);
btnExport.addEventListener("click", ExcelReport);
searchFacility.addEventListener("keyup", SearchFromTable);
sortFacility.addEventListener("change", SortFacility);
