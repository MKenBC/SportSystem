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

//#region - Element References
//-------------------ELEMENT REFERENCES-----------------------------------------------------------------

//Show modal
const btnShowUpdateDetails = document.querySelector("#btnShowUpdateDetails");
const updateWrapper = document.querySelector("#updateWrapper");

const btnShowUpPass = document.querySelector("#btnShowUpdatePassword");
const passWrapper = document.querySelector("#passWrapper");

const btnShowUpdateCode = document.querySelector("#btnShowUpdateCode");
const codeWrapper = document.querySelector("#codeWrapper");

const btnShowDeleteAccount = document.querySelector("#btnShowDeleteAccount");
const deleteWrapper = document.querySelector("#deleteWrapper");

const btnShowCreateEvent = document.querySelector("#btnShowCreateEvent");
const createEventWrapper = document.querySelector("#createEventWrapper");

const editEventWrapper = document.querySelector("#editEventWrapper");

const deleteEventWrapper = document.querySelector("#deleteEventWrapper");

const btnLogout = document.querySelector("#btnLogout");

btnLogout.addEventListener("click", () => {
  window.open("./index.html", "_self");
});

//Get DOM input elements
//DOM 1 - Update Admin Informations
const info01 = document.querySelector("#info01");
const btnUpdate = document.querySelector("#btnUpdateDesc");
const fName = document.querySelector("#fName");
const lName = document.querySelector("#lName");
const username = document.querySelector("#userName");
const code = document.querySelector("#code");
//DOM 2 - Update Admin Password
const info02 = document.querySelector("#info02");
const btnUpdatePass = document.querySelector("#btnUpdatePass");
const oldPass = document.querySelector("#oldPass");
const sCode = document.querySelector("#SCode");
const nPass01 = document.querySelector("#newPass01");
const nPass02 = document.querySelector("#newPass02");
//DOM 3 - Update Admin Code
const info03 = document.querySelector("#info03");
const btnUpdateCode = document.querySelector("#btnUpdateCode");
const pass = document.querySelector("#pass");
const oldCode = document.querySelector("#oldCode");
const nCode01 = document.querySelector("#newCode01");
const nCode02 = document.querySelector("#newCode02");
//DOM 4 - Delete Admin Account
const info04 = document.querySelector("#info04");
const btnDeleteAccount = document.querySelector("#btnDeleteAccount");
const passDel = document.querySelector("#passDel");
const codeDel = document.querySelector("#codeDel");
const checkDel = document.querySelector("#checkDel");
//DOM 5 - Create Event
const info05 = document.querySelector("#info05");
const btnCreateEvent = document.querySelector("#btnCreateEvent");
const syStart01 = document.querySelector("#syStart01");
const syEnd01 = document.querySelector("#syEnd01");
const eventName01 = document.querySelector("#eventName01");
const eventDate01 = document.querySelector("#eventDate01");

//DOM 6 - Update Event
const info06 = document.querySelector("#info06");
const btnEditEvent = document.querySelector("#btnEditEvent");
const syStart02 = document.querySelector("#syStart02");
const syEnd02 = document.querySelector("#syEnd02");
const eventName02 = document.querySelector("#eventName02");
const eventDate02 = document.querySelector("#eventDate02");
const visibility02 = document.querySelector("#visibility02");
//DOM 7 - Delete Event
const info07 = document.querySelector("#info07");
const btnDeleteEvent = document.querySelector("#btnDeleteEvent");
const checkDeleteEvent = document.querySelector("#checkDeleteEvent");
const txtSY = document.querySelector("#txtSY");
const txtEN = document.querySelector("#txtEN");
const txtD = document.querySelector("#txtD");
const txtS = document.querySelector("#txtS");
const txtV = document.querySelector("#txtV");

//Table Events
const tableEvents = document.querySelector("#tableEvents");
const trs = tableEvents.getElementsByClassName("tr");
const sortEvent = document.querySelector("#sortEvent");
const searchEvent = document.querySelector("#searchEvent");
const btnExport = document.querySelector("#btnExport");
const txtArea1 = document.querySelector("#txtArea1");
//#endregion

let codeS;
let passS;

//-------------------METHODS----------------------------------------------------------------------------

//Display Methods
//#region - Show Modals
btnShowUpdateDetails.addEventListener("click", () => {
  updateWrapper.style.display = "block";

  GetDocumentDetails();
});

btnShowUpPass.addEventListener("click", () => {
  passWrapper.style.display = "block";

  GetDocumentCodeNPass();
});

btnShowUpdateCode.addEventListener("click", () => {
  codeWrapper.style.display = "block";

  GetDocumentCodeNPass();
});

btnShowDeleteAccount.addEventListener("click", () => {
  deleteWrapper.style.display = "block";

  GetDocumentCodeNPass();
});

btnShowCreateEvent.addEventListener("click", () => {
  createEventWrapper.style.display = "block";
});
//#endregion

//#region - Hide Modals
window.addEventListener("click", (e) => {
  if (e.target === updateWrapper) {
    updateWrapper.style.display = "none";
    info01.style.color = "";
    info01.textContent =
      "To update the informations you, need to input Security Code";
    code.value = "";
  }

  if (e.target === passWrapper) {
    passWrapper.style.display = "none";
    info02.style.color = "";
    info02.textContent =
      "To update the password you, need to input Security Code and Current Password";
    oldPass.value = "";
    sCode.value = "";
    nPass01.value = "";
    nPass02.value = "";
  }

  if (e.target === codeWrapper) {
    codeWrapper.style.display = "none";
    info03.style.color = "";
    info03.textContent =
      "To update the Security Code you, need to input Current Security Code and Password";
    pass.value = "";
    oldCode.value = "";
    nCode01.value = "";
    nCode02.value = "";
  }

  if (e.target === deleteWrapper) {
    deleteWrapper.style.display = "none";
    info04.style.color = "";
    info04.textContent = "This will erase all information about the admin.";
    passDel.value = "";
    codeDel.value = "";
    checkDel.checked = false;
  }

  if (e.target === createEventWrapper) {
    createEventWrapper.style.display = "none";
    info05.textContent = "Please fill all the information needed";
    info05.style.color = "";
    syStart01.value = "";
    syEnd01.value = "";
    eventName01.value = "";
    eventDate01.value = "";

    if (eventDate01.type === "date") {
      eventDate01.type = "text";
      eventDate01.type = "date";
    }
  }

  if (e.target === editEventWrapper) {
    editEventWrapper.style.display = "none";
  }

  if (e.target === deleteEventWrapper) {
    deleteEventWrapper.style.display = "none";
    info07.textContent = "This informations will be deleted.";
    info07.style.color = "";
    checkDeleteEvent.checked = false;
  }
});
//#endregion

//#region - Get Admin Details Methods
async function GetDocumentDetails() {
  var ref = doc(db, "AdminAccount", "001");
  const docSnap = await getDoc(ref);

  if (docSnap.exists()) {
    fName.value = docSnap.data().FirstName;
    lName.value = docSnap.data().LastName;
    username.value = docSnap.data().Username;
    codeS = docSnap.data().Code;
  } else {
    swal("Oww!", "*Document doesn't exists", "error");
    // alert("No Such Document");
  }
}
//#endregion

//#region - Update Admin Details
async function UpdateDocumentDetails() {
  let ref = doc(db, "AdminAccount", "001");
  let txtInfo = "*Please Fill";

  if (fName.value == "") {
    txtInfo += " First Name,";
  }

  if (lName.value == "") {
    txtInfo += " Last Name,";
  }

  if (username.value == "") {
    txtInfo += " Username,";
  }

  if (code.value == "") {
    txtInfo += " Secutiry Code";
  }

  if (
    fName.value == "" ||
    lName.value == "" ||
    username.value == "" ||
    code.value == ""
  ) {
    swal("Oww!", txtInfo, "error");
    // info01.textContent = txtInfo;
    // info01.style.color = "red";
  }

  if (
    fName.value != "" &&
    lName.value != "" &&
    username.value != "" &&
    code.value != ""
  ) {
    if (code.value == codeS) {
      await updateDoc(ref, {
        FirstName: fName.value,
        LastName: lName.value,
        Username: username.value,
      })
        .then(() => {
          code.value = "";
          info01.textContent =
            "To update the informations you, need to input Security Code";
          info01.style.color = "";
          updateWrapper.style.display = "none";
          // alert("Data Updated successfully");
          swal("Wow!", "Admin Details Updated Successfully!", "success");
        })
        .catch((error) => {
          swal("Oww!", "*Unsuccessuful operation, error:" + error, "error");
          // alert("Unsuccessuful operation, error:" + error);
        });
    } else {
      swal("Oww!", "*Invalid Security Code", "error");
      // info01.textContent = "*Invalid Security Code";
      // info01.style.color = "red";
      code.value = "";
    }
  }
}
//#endregion

//#region - Get code and password
async function GetDocumentCodeNPass() {
  var ref = doc(db, "AdminAccount", "001");
  const docSnap = await getDoc(ref);

  if (docSnap.exists()) {
    codeS = docSnap.data().Code;
    passS = docSnap.data().Password;
  } else {
    swal("Oww!", "*Document doesn't exists", "error");
    // alert("No Such Document");
  }
}
//#endregion

//#region - Update Password Method
async function UpdatePass() {
  let ref = doc(db, "AdminAccount", "001");
  let txtInfo = "*Please Fill";

  if (oldPass.value == "") {
    txtInfo += " Current Password,";
  }

  if (sCode.value == "") {
    txtInfo += " Security Code,";
  }

  if (nPass01.value == "") {
    txtInfo += " Input New Password,";
  }

  if (nPass02.value == "") {
    txtInfo += " Re-input New Password,";
  }

  if (
    oldPass.value == "" ||
    sCode.value == "" ||
    nPass01.value == "" ||
    nPass02.value == ""
  ) {
    swal("Oww!", txtInfo, "error");
    // info02.textContent = txtInfo;
    // info02.style.color = "red";
  }

  if (
    oldPass.value != "" &&
    sCode.value != "" &&
    nPass01.value != "" &&
    nPass02.value != ""
  ) {
    if (codeS != sCode.value && passS != oldPass.value) {
      swal("Oww!", "*Invalid Password and Security Code", "error");
      // info02.textContent = "Invalid Password and Security Code";
      // info02.style.color = "red";
    } else if (codeS != sCode.value && passS == oldPass.value) {
      swal("Oww!", "*Invalid Security Code", "error");
      // info02.textContent = "Invalid Security Code";
      // info02.style.color = "red";
    } else if (codeS == sCode.value && passS != oldPass.value) {
      swal("Oww!", "*Invalid Password", "error");
      // info02.textContent = "Invalid Password";
      // info02.style.color = "red";
    } else {
      if (nPass01.value != nPass02.value) {
        swal("Oww!", "*New password doesn't match", "error");
        // info02.textContent = "New Password Does'nt Match";
      } else {
        await updateDoc(ref, {
          Password: nPass01.value,
        })
          .then(() => {
            // alert("Data Updated successfully");
            oldPass.value = "";
            sCode.value = "";
            nPass01.value = "";
            nPass02.value = "";
            info01.textContent =
              "To update the password you, need to input Security Code and Current Password";
            passWrapper.style.display = "none";
            info02.style.color = "";
            swal("Wow!", "Password Updated Successfully!", "success");
          })
          .catch((error) => {
            swal("Oww!", "*Unsuccessuful operation, error:" + error, "error");
            // alert("Unsuccessuful operation, error:" + error);
          });
      }
    }
  }
}
//#endregion

//#region - Update Security Code Method
async function UpdateSecurityCode() {
  var ref = doc(db, "AdminAccount", "001");
  let txtInfo = "*Please Fill";

  if (pass.value == "") {
    txtInfo += " Password,";
  }

  if (oldCode.value == "") {
    txtInfo += " Current Security Code,";
  }

  if (nCode01.value == "") {
    txtInfo += " Input New Security Code,";
  }

  if (nCode02.value == "") {
    txtInfo += " Re-input New Security Code,";
  }

  if (
    pass.value == "" ||
    oldCode.value == "" ||
    nCode01.value == "" ||
    nCode02.value == ""
  ) {
    swal("Oww!", txtInfo, "error");
    // info03.textContent = txtInfo;
    // info03.style.color = "red";
  }

  if (
    pass.value != "" &&
    oldCode.value != "" &&
    nCode01.value != "" &&
    nCode02.value != ""
  ) {
    if (pass.value != passS && oldCode.value != codeS) {
      swal("Oww!", "*Invalid Security Code and Password", "error");
      // info03.textContent = "*Invalid Security Code and Password";
      // info03.style.color = "red";
    } else if (pass.value == passS && oldCode.value != codeS) {
      swal("Oww!", "*Invalid Security Code", "error");
      // info03.textContent = "*Invalid Security Code";
      // info03.style.color = "red";
    } else if (pass.value != passS && oldCode.value == codeS) {
      swal("Oww!", "*Invalid Password", "error");
      // info03.textContent = "*Invalid Password";
      // info03.style.color = "red";
    } else {
      if (nCode01.value != nCode02.value) {
        swal("Oww!", "*New security code doesn't match", "error");
        // info03.textContent = "*New Security Code Does'nt Match";
        // info03.style.color = "red";
      } else {
        await updateDoc(ref, {
          Code: nCode01.value,
        })
          .then(() => {
            // alert("Data Updated successfully");
            pass.value = "";
            oldCode.value = "";
            nCode01.value = "";
            nCode02.value = "";
            info03.textContent =
              " To update the Security Code you, need to input Current Security Code and Password";
            codeWrapper.style.display = "none";
            info03.style.color = "";
            swal("Wow!", "Security Code Updated Successfully!", "success");
          })
          .catch((error) => {
            swal("Oww!", "*Unsuccessuful operation, error:" + error, "error");
            // alert("Unsuccessuful operation, error:" + error);
          });
      }
    }
  }
}
//#endregion

//#region - Delete Account Method
async function DeleteAccount() {
  let ref = doc(db, "AdminAccount", "001");
  const docSnap = await getDoc(ref);
  let txtinfo = "*Please Enter";

  if (passDel.value == "") {
    txtinfo += " Password,";
  }

  if (codeDel.value == "") {
    txtinfo += " Security Code";
  }

  if (codeDel.value == "" || passDel.value == "") {
    swal("Oww!", txtinfo, "error");
    // info04.textContent = txtinfo;
    // info04.style.color = "Red";
  }

  if (codeDel.value != "" && passDel.value != "") {
    if (codeDel.value != codeS && passDel.value != passS) {
      swal("Oww!", "*Invalid Security Code and Password", "error");
      // info04.textContent = "Invalid Security Code and Password";
      // info04.style.color = "red";
    } else if (codeDel.value == codeS && passDel.value != passS) {
      swal("Oww!", "*Invalid Password", "error");
      // info04.textContent = "Invalid Password";
      // info04.style.color = "red";
    } else if (codeDel.value != codeS && passDel.value == passS) {
      swal("Oww!", "*Invalid Security Code", "error");
      // info04.textContent = "Invalid Security Code";
      // info04.style.color = "red";
    } else {
      if (checkDel.checked == false) {
        swal(
          "Oww!",
          "*Unable to Delete Account, Checkbox not Checked",
          "error"
        );
        // info04.textContent = "Unable to Delete Account, Checkbox not Checked";
        // info04.style.color = "red";
      } else {
        if (docSnap.exists()) {
          await deleteDoc(ref)
            .then(() => {
              // alert("Data Deleted successfully");
              deleteWrapper.style.display = "none";
              info04.style.color = "";
              info04.textContent =
                "This will erase all information about the admin.";
              passDel.value = "";
              codeDel.value = "";
              checkDel.checked = false;
              swal("Yay!", "Main Admin Account has been Deleted!", "info").then(
                () => {
                  window.open("./index.html", "_self");
                }
              );
            })
            .catch((error) => {
              swal("Oww!", "*Unsuccessuful operation, error:" + error, "error");
              // alert("Unsuccessuful operation, error:" + error);
            });
        } else {
          swal("Oww!", "*Document doesn't exists", "error");
          // alert("Document Does'nt Exist");
        }
      }
    }
  }
}
//#endregion

//#region - Create Event Method
async function CreateEvent() {
  const eventDate01A = new Date(eventDate01.value);
  let txtInfo = "*Please fill";

  if (syStart01.value == "") {
    txtInfo += " From,";
  }

  if (syEnd01.value == "") {
    txtInfo += " To,";
  }

  if (eventName01.value == "") {
    txtInfo += " Event Name,";
  }

  if (eventDate01.value == "") {
    txtInfo += " Date,";
  }

  if (
    syStart01.value == "" ||
    syEnd01.value == "" ||
    eventName01.value == "" ||
    eventDate01.value == ""
  ) {
    swal("Oww!", txtInfo, "error");
    // info05.textContent = txtInfo;
    // info05.style.color = "red";
  }

  if (
    syStart01.value != "" &&
    syEnd01.value != "" &&
    eventName01.value != "" &&
    eventDate01.value != ""
  ) {
    if (
      syStart01.value >= 2000 &&
      syStart01.value <= 2999 &&
      syEnd01.value >= 2000 &&
      syEnd01.value <= 2999
    ) {
      if (syStart01.value < syEnd01.value) {
        if (syEnd01.value - syStart01.value == 1) {
          if (
            syStart01.value == eventDate01A.getFullYear() ||
            syEnd01.value == eventDate01A.getFullYear()
          ) {
            await addDoc(collection(db, "Events"), {
              From: syStart01.value,
              To: syEnd01.value,
              EventName: eventName01.value,
              Date: eventDate01.value,
              Status: "Upcoming",
              Visibility: "Hidden",
              Creator: "Main Admin",
              Email: "Main Admin",
            })
              .then(() => {
                // alert("Data Added");
                swal("Wow!", "Event Created Successfully!", "success").then(
                  () => {
                    createEventWrapper.style.display = "none";
                    info05.textContent =
                      "Please fill all the information needed";
                    info05.style.color = "";
                    syStart01.value = "";
                    syEnd01.value = "";
                    eventName01.value = "";
                    eventDate01.value = "";
                    window.location.reload();
                  }
                );
              })
              .catch((error) => {
                swal(
                  "Oww!",
                  "*Unsuccessuful operation, error:" + error,
                  "error"
                );
                // alert("Unsuccessuful operation, error:" + error);
              });
          } else {
            swal("Oww!", "*Date Year must match either From or To", "error");
            // info05.textContent = "*Date Year must match either From or To";
            // info05.style.color = "red";
          }
        } else {
          swal("Oww!", "*School year Difference must be 1", "error");
          // info05.textContent = "*School year Difference must be 1";
          // info05.style.color = "red";
        }
      } else {
        swal("Oww!", "*School year From must be less than To", "error");
        // info05.textContent = "*School year From must be less than To";
        // info05.style.color = "red";
      }
    } else {
      swal(
        "Oww!",
        "*School year must be less than 3000 and grater than 1999",
        "error"
      );
      // info05.textContent =
      //   "*School year must be less than 3000 and grater than 1999";
      // info05.style.color = "red";
    }
  }
}
//#endregion

//#region - Sort Event
async function SortEvent() {
  tableEvents.innerHTML = ``;
  tableEvents.insertAdjacentHTML(
    "beforeend",
    `         <tr>
                <th>School Year</th>
                <th>Event Name</th>
                <th>Creator</th>
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
  } else if (sortEvent.value == "Creator") {
    ref = query(collection(db, "Events"), orderBy("Creator"));
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
let idHolder;

//#region - Render Events
function renderEvents(content, ids) {
  let cHold = ``,
    bHold = ``;
  if (content.Status == "On-going") {
    cHold = `class="onGoing"`;
  } else if (content.Status == "Finished") {
    cHold = `class="done"`;
  } else {
    cHold = `class="upcoming"`;
  }

  if (content.Visibility == "Hidden") {
    bHold = `class="done"`;
  } else {
    bHold = `class="show"`;
  }

  const tr = `<tr data-id="${ids}" class="tr">
               <td>S.Y. ${content.From}-${content.To}</td>
                <td>${content.EventName}</td>
                <td>${content.Creator}</td>
                <td>${content.Date}</td>
                <td ${cHold}>${content.Status}</td>
                <td ${bHold}>${content.Visibility}</td>
                <td>
                  <button class="btn btn-edit">Edit</button>
                  <button class="btn btn-delete">Delete</button>
                  <button class="btn btn-view">View</button>
                </td>
              </tr>`;

  tableEvents.insertAdjacentHTML("beforeend", tr);

  // Click Show Update Modal
  const btnShowUpdate = document.querySelector(`[data-id='${ids}'] .btn-edit`);
  btnShowUpdate.addEventListener("click", () => {
    editEventWrapper.style.display = "block";
    syStart02.value = content.From;
    syEnd02.value = content.To;
    eventName02.value = content.EventName;
    eventDate02.value = content.Date;
    visibility02.value = content.Visibility;

    idHolder = ids;
  });

  //Click Show Delete Modal
  const btnShowDel = document.querySelector(`[data-id='${ids}'] .btn-delete`);
  btnShowDel.addEventListener("click", () => {
    deleteEventWrapper.style.display = "block";
    txtSY.textContent = "S.Y. " + content.From + "-" + content.To;
    txtEN.textContent = content.EventName;
    txtD.textContent = content.Date;
    txtS.textContent = content.Status;
    txtV.textContent = content.Visibility;

    idHolder = ids;
  });

  //Click View Event Games
  const btnViewEventGames = document.querySelector(
    `[data-id='${ids}'] .btn-view`
  );
  btnViewEventGames.addEventListener("click", () => {
    localStorage.setItem("passEventID", ids);
    localStorage.setItem(
      "eventCode",
      content.EventName +
        " - (" +
        "S.Y. " +
        content.From +
        "-" +
        content.To +
        ")"
    );
    localStorage.setItem("eventName", content.EventName);
    localStorage.setItem("eventSYFrom", content.From);
    localStorage.setItem("eventSYTo", content.To);
    window.location.href = "./adminGames.html";
    return false;
  });
}
//#endregion

//#region - Update Event Method
function UpdateEvent() {
  const eventDate02A = new Date(eventDate02.value);
  let txtInfo = "*Please fill";

  if (syStart02.value == "") {
    txtInfo += " From,";
  }

  if (syEnd02.value == "") {
    txtInfo += " To,";
  }

  if (eventName02.value == "") {
    txtInfo += " Event Name,";
  }

  if (eventDate02.value == "") {
    txtInfo += " Date,";
  }

  if (visibility02.selectedIndex == 0) {
    txtInfo += " Visibility";
  }

  if (
    syStart02.value == "" ||
    syEnd02.value == "" ||
    eventName02.value == "" ||
    eventDate02.value == "" ||
    visibility02.selectedIndex == 0
  ) {
    swal("Oww!", txtInfo, "error");
    // info06.textContent = txtInfo;
    // info06.style.color = "red";
  }

  if (
    syStart02.value != "" &&
    syEnd02.value != "" &&
    eventName02.value != "" &&
    eventDate02.value != "" &&
    visibility02 != 0
  ) {
    if (
      syStart02.value >= 2000 &&
      syStart02.value <= 2999 &&
      syEnd02.value >= 2000 &&
      syEnd02.value <= 2999
    ) {
      if (syStart02.value < syEnd02.value) {
        if (syEnd02.value - syStart02.value == 1) {
          if (
            syStart02.value == eventDate02A.getFullYear() ||
            syEnd02.value == eventDate02A.getFullYear()
          ) {
            updateDoc(doc(db, "Events", idHolder), {
              From: syStart02.value,
              To: syEnd02.value,
              EventName: eventName02.value,
              Date: eventDate02.value,
              Visibility: visibility02.value,
            })
              .then(() => {
                // alert("Data Updated");
                swal("Wow!", "Event Updated Successfully!", "success").then(
                  () => {
                    editEventWrapper.style.display = "none";
                    info06.textContent =
                      "Please fill all the information needed";
                    info06.style.color = "";
                    window.location.reload();
                  }
                );
              })
              .catch((error) => {
                swal(
                  "Oww!",
                  "*Unsuccessuful operation, error:" + error,
                  "error"
                );
                // alert("Unsuccessuful operation, error:" + error);
              });
          } else {
            swal("Oww!", "*Date Year must match either From or To", "error");
            // info06.textContent = "*Date Year must match either From or To";
            // info06.style.color = "red";
          }
        } else {
          swal("Oww!", "*School year Difference must be 1", "error");
          // info06.textContent = "*School year Difference must be 1";
          // info06.style.color = "red";
        }
      } else {
        swal("Oww!", "*School year From must be less than To", "error");
        // info06.textContent = "*School year From must be less than To";
        // info06.style.color = "red";
      }
    } else {
      swal(
        "Oww!",
        "*School year must be less than 3000 and grater than 1999",
        "error"
      );
      // info06.textContent =
      //   "*School year must be less than 3000 and grater than 1999";
      // info06.style.color = "red";
    }
  }
}
//#endregion

//#region - Delete Event Method
async function DeleteEvent() {
  if (checkDeleteEvent.checked == false) {
    swal("Oww!", "*Unable to Delete Event, Checkbox not Checked", "error");
    // info07.textContent = "*Unable to Delete Event, Checkbox not Checked";
    // info07.style.color = "red";
  } else {
    const gamesRef = query(collection(db, "Events", idHolder, "EventGames"));
    const gamesQuery = await getDocs(gamesRef);

    gamesQuery.forEach((gamesDoc) => {
      DeleteNestedValuesInGames(gamesDoc);
    });
    DeleteEventAndGames();
  }
}
//#endregion

//#region - Delete Nested Values inside Games
async function DeleteNestedValuesInGames(gamesDoc) {
  const batch = writeBatch(db);

  // DELETE - On-Game Doc
  const onGameRef = doc(
    db,
    "Events",
    idHolder,
    "EventGames",
    gamesDoc.id,
    "OnGame",
    "Matches"
  );
  batch.delete(onGameRef);

  // DELETE - Team Collection
  const getAllTeamsRef = query(
    collection(db, "Events", idHolder, "EventGames", gamesDoc.id, "TeamDetails")
  );
  const querySnap01 = await getDocs(getAllTeamsRef);
  querySnap01.forEach((doc01) => {
    let teamRef = doc(
      db,
      "Events",
      idHolder,
      "EventGames",
      gamesDoc.id,
      "TeamDetails",
      doc01.id
    );

    batch.delete(teamRef);
  });

  // DELETE - Round Collection
  const getAllRoundRef = query(
    collection(db, "Events", idHolder, "EventGames", gamesDoc.id, "Rounds")
  );
  const querySnap02 = await getDocs(getAllRoundRef);
  querySnap02.forEach((doc02) => {
    let roundRef = doc(
      db,
      "Events",
      idHolder,
      "EventGames",
      gamesDoc.id,
      "Rounds",
      doc02.id
    );

    batch.delete(roundRef);
  });

  // DELETE - Score History Collection
  const getAllHistory = query(
    collection(
      db,
      "Events",
      idHolder,
      "EventGames",
      gamesDoc.id,
      "ScoreHistory"
    )
  );
  const querySnap03 = await getDocs(getAllHistory);
  querySnap03.forEach((doc03) => {
    let historyRef = doc(
      db,
      "Events",
      idHolder,
      "EventGames",
      gamesDoc.id,
      "ScoreHistory",
      doc03.id
    );

    batch.delete(historyRef);
  });

  await batch.commit();
}
//#endregion

//#region - Delete Event and Games
async function DeleteEventAndGames() {
  const gamesRef = query(collection(db, "Events", idHolder, "EventGames"));
  const gamesQuery = await getDocs(gamesRef);
  const batch01 = writeBatch(db);

  // DELETE - Event Games
  gamesQuery.forEach((gamesDoc) => {
    const listingRequestRef = doc(
      db,
      "GameFacility",
      gamesDoc.data().FacilityID,
      "Listing",
      gamesDoc.id
    );
    batch01.delete(listingRequestRef);

    const eGames = doc(db, "Events", idHolder, "EventGames", gamesDoc.id);
    batch01.delete(eGames);
  });

  // DELETE - Event
  const eventRef = doc(db, "Events", idHolder);
  batch01.delete(eventRef);

  await batch01
    .commit()
    .then(() => {
      // alert("Data Deleted Successfuly");
      swal("Yay!", "Event has been Deleted!", "info").then(() => {
        deleteEventWrapper.style.display = "none";
        checkDeleteEvent.checked = false;
        info07.textContent = "This informations will be deleted.";
        info07.style.color = "";
        window.location.reload();
      });
    })
    .catch((error) => {
      swal("Oww!", "*Unsuccessuful operation, error:" + error, "error");

      // alert("Unsuccessuful operation, error:" + error);
    });
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

//#region - Excel Report
function ExcelReport() {
  let tab_text = "<table border='2px'><tr bgcolor='#87AFC6'>";
  let sa;
  let j = 0;
  let tab = tableEvents;

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

//Button Events
btnUpdate.addEventListener("click", UpdateDocumentDetails);
btnUpdatePass.addEventListener("click", UpdatePass);
btnUpdateCode.addEventListener("click", UpdateSecurityCode);
btnDeleteAccount.addEventListener("click", DeleteAccount);
btnCreateEvent.addEventListener("click", CreateEvent);
btnEditEvent.addEventListener("click", UpdateEvent);
btnDeleteEvent.addEventListener("click", DeleteEvent);
sortEvent.addEventListener("change", SortEvent);
searchEvent.addEventListener("keyup", SearchFromTable);
btnExport.addEventListener("click", ExcelReport);
