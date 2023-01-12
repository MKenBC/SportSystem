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

//#region - Element References
//-------------------ELEMENT REFERENCES-----------------------------------------------------------------

//show add modal
const addWrapper = document.querySelector("#addWrapper");
const btnShowAdd = document.querySelector(".btnShowAdd");
const sortHistory = document.querySelector("#sortHistory");
const btnExport = document.querySelector("#btnExport");

//add modal
const syStart01 = document.querySelector("#syStart01");
const syEnd01 = document.querySelector("#syEnd01");
const eventName01 = document.querySelector("#eventName01");
const gameName01 = document.querySelector("#gameName01");
const eventDate01 = document.querySelector("#eventDate01");
const tournamentType01 = document.querySelector("#tournamentType01");
const champ01 = document.querySelector("#champ01");
const first01 = document.querySelector("#first01");
const second01 = document.querySelector("#second01");
const btnAdd = document.querySelector("#btnAdd");
const info01 = document.querySelector("#info01");

//table
const tableHistory = document.querySelector("#tableHistory");
const trs = tableHistory.getElementsByClassName("tr");
const searchHistory = document.querySelector("#searchHistory");

//archive modal
const archiveWrapper = document.querySelector("#archiveWrapper");
const txtSY = document.querySelector("#txtSY");
const txtEN = document.querySelector("#txtEN");
const txtGN = document.querySelector("#txtGN");
const txtTT = document.querySelector("#txtTT");
const txtCP = document.querySelector("#txtCP");
const txt1R = document.querySelector("#txt1R");
const txt2R = document.querySelector("#txt2R");
const checkArch = document.querySelector("#checkArch");
const info03 = document.querySelector("#info03");
const btnArchive = document.querySelector("#btnArchivePermission");

//edit Modal
const editWrapper = document.querySelector("#editWrapper");
const syStart02 = document.querySelector("#syStart02");
const syEnd02 = document.querySelector("#syEnd02");
const eventName02 = document.querySelector("#eventName02");
const gameName02 = document.querySelector("#gameName02");
const eventDate02 = document.querySelector("#eventDate02");
const tournamentType02 = document.querySelector("#tournamentType02");
const btnUpdate = document.querySelector("#btnUpdate");
const info02 = document.querySelector("#info02");

// Show Team details
const showTeamDetailsWrapper = document.querySelector(
  "#showTeamDetailsWrapper"
);
const txtTeamRank = document.querySelector("#txtTeamRank");
const txtTeamName = document.querySelector("#txtTeamName");
const txtClass = document.querySelector("#txtClass");
const memberContainer = document.querySelector("#memberContainer");
const btnShowEditTeamDetails = document.querySelector(
  "#btnShowEditTeamDetails"
);

// Edit Team Details
const editTeamDetailsWrapper = document.querySelector(
  "#editTeamDetailsWrapper"
);
const info04 = document.querySelector("#info04");
const txtTeamRank01 = document.querySelector("#txtTeamRank01");
const teamName01 = document.querySelector("#teamName01");
const class01 = document.querySelector("#class01");
const teamMembers01 = document.querySelector("#teamMembers01");
const btnUpdateTeamDetails = document.querySelector("#btnUpdateTeamDetails");
//#endregion
//-------------------METHODS----------------------------------------------------------------------------

//display methods
//#region - Show Modal
btnShowAdd.addEventListener("click", () => {
  addWrapper.style.display = "block";
});
//#endregion

//#region - Hide Modal
window.addEventListener("click", (e) => {
  if (e.target === addWrapper) {
    addWrapper.style.display = "none";
    info01.textContent = "Please fill all the information needed.";
    info01.style.color = "";
    syStart01.value = "";
    syEnd01.value = "";
    eventName01.value = "";
    gameName01.value = "";
    eventDate01.value = "";
    champ01.value = "";
    first01.value = "";
    second01.value = "";
  }

  if (e.target === archiveWrapper) {
    archiveWrapper.style.display = "none";
    checkDel.checked = false;
    info03.textContent = "This informations will be deleted.";
    info03.style.color = "";
  }

  if (e.target === editWrapper) {
    editWrapper.style.display = "none";
    info02.textContent = "Please fill all the information needed.";
    info02.style.color = "";
  }

  if (e.target === showTeamDetailsWrapper) {
    showTeamDetailsWrapper.style.display = "none";
    memberContainer.innerHTML = "";
  }

  if (e.target === editTeamDetailsWrapper) {
    editTeamDetailsWrapper.style.display = "none";
    info04.textContent = "Please fill all the information needed.";
    info04.style.color = "";
    teamMembers01.value = "";
  }
});
//#endregion

//#region - Add History Document
async function AddDocument_AutoID() {
  const eventDate01A = new Date(eventDate01.value);
  tournamentType01.selectedIndex = 1;
  let txtInfo = "*Please fill";

  if (syStart01.value == "") {
    txtInfo += " From";
  }

  if (syEnd01.value == "") {
    txtInfo += ", To";
  }

  if (eventName01.value == "") {
    txtInfo += ", Event Name";
  }

  if (gameName01.value == "") {
    txtInfo += ", Game Name";
  }

  if (eventDate01.value == "") {
    txtInfo += ", Date";
  }

  if (tournamentType01.selectedIndex == 0) {
    txtInfo += ", Tournament Type,";
  }

  if (champ01.value == "") {
    txtInfo += ", Champion Team";
  }

  if (first01.value == "") {
    txtInfo += ", 1st Runner Up Team";
  }

  if (second01.value == "") {
    txtInfo += ", 2nd Runner Up Team";
  }

  if (
    syStart01.value == "" ||
    syEnd01.value == "" ||
    eventName01.value == "" ||
    gameName01.value == "" ||
    eventDate01.value == "" ||
    tournamentType01.selectedIndex == 0 ||
    champ01.value == "" ||
    first01.value == "" ||
    second01.value == ""
  ) {
    swal("Oww!", txtInfo, "error");

    // info01.textContent = txtInfo;
    // info01.style.color = "red";
  }

  if (
    syStart01.value != "" &&
    syEnd01.value != "" &&
    eventName01.value != "" &&
    gameName01.value != "" &&
    eventDate01.value != "" &&
    tournamentType01.selectedIndex != 0 &&
    champ01.value != "" &&
    first01.value != "" &&
    second01.value != ""
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
            if (
              champ01.value != first01.value &&
              champ01.value != second01.value &&
              first01.value != second01.value
            ) {
              const batch = writeBatch(db);

              await addDoc(collection(db, "GameHistory"), {
                From: syStart01.value,
                To: syEnd01.value,
                EventName: eventName01.value,
                GameName: gameName01.value,
                Date: eventDate01.value,
                TournamentType: tournamentType01.value,
                Status: "normal",
                DeleteDate: "",
                Champ: champ01.value,
                First: first01.value,
                Second: second01.value,
              })
                .then((docRef) => {
                  // alert("Data Added Successfully");
                  addWrapper.style.display = "none";
                  info01.textContent =
                    "Please fill all the information needed.";
                  info01.style.color = "";
                  syStart01.value = "";
                  syEnd01.value = "";
                  eventName01.value = "";
                  gameName01.value = "";
                  eventDate01.value = "";
                  tournamentType01.selectedIndex = 0;

                  let blank = new Array();
                  let c = champ01.value,
                    f = first01.value,
                    s = second01.value;
                  const champRef = doc(
                    db,
                    "GameHistory",
                    docRef.id,
                    "Teams",
                    "Champ"
                  );
                  batch.set(champRef, {
                    Rank: "Champion",
                    TeamName: c,
                    Class: "",
                    TeamMembers: blank,
                  });

                  const firstRef = doc(
                    db,
                    "GameHistory",
                    docRef.id,
                    "Teams",
                    "First"
                  );
                  batch.set(firstRef, {
                    Rank: "1st Runner Up",
                    TeamName: f,
                    Class: "",
                    TeamMembers: blank,
                  });

                  const secondRef = doc(
                    db,
                    "GameHistory",
                    docRef.id,
                    "Teams",
                    "Second"
                  );
                  batch.set(secondRef, {
                    Rank: "2nd Runner Up",
                    TeamName: s,
                    Class: "",
                    TeamMembers: blank,
                  });

                  champ01.value = "";
                  first01.value = "";
                  second01.value = "";
                })
                .catch((error) => {
                  swal(
                    "Oww!",
                    "Unsuccessuful operation, error:" + error,
                    "error"
                  );
                  // alert("Unsuccessuful operation, error:" + error);
                });

              await batch.commit();
              swal(
                "Wow!",
                "Game History Created Successfully!",
                "success"
              ).then(() => {
                window.location.reload();
              });
            } else {
              swal("Oww!", "*Team Name Should be unique", "error");
              // info01.textContent = "*Team Name Should be unique";
              // info01.style.color = "red";
            }
          } else {
            swal("Oww!", "*Date Year must match either From or To", "error");
            // info01.textContent = "*Date Year must match either From or To";
            // info01.style.color = "red";
          }
        } else {
          swal("Oww!", "*School year Difference must be 1", "error");
          // info01.textContent = "*School year Difference must be 1";
          // info01.style.color = "red";
        }
      } else {
        swal("Oww!", "*School year From must be less than To", "error");
        // info01.textContent = "*School year From must be less than To";
        // info01.style.color = "red";
      }
    } else {
      swal(
        "Oww!",
        "*School year must be less than 3000 and grater than 1999",
        "error"
      );

      // info01.textContent =
      //   "*School year must be less than 3000 and grater than 1999";
      // info01.style.color = "red";
    }
  }
}
//#endregion

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
let idHolder, teamIDHolder;

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
                <td>
                  <button class="btn btn-edit">Edit</button>
                  <button class="btn btn-delete">Archive</button>
                </td>
              </tr>`;

  if (content.Status == "normal") {
    tableHistory.insertAdjacentHTML("beforeend", tr);

    //Click Show Delete Modal
    const btnDelShow = document.querySelector(`[data-id='${ids}'] .btn-delete`);
    btnDelShow.addEventListener("click", () => {
      archiveWrapper.style.display = "block";
      txtSY.textContent = "S.Y. " + content.From + "-" + content.To;
      txtEN.textContent = content.EventName;
      txtGN.textContent = content.GameName;
      txtTT.textContent = content.TournamentType;
      txtCP.textContent = content.Champ;
      txt1R.textContent = content.First;
      txt2R.textContent = content.Second;

      idHolder = ids;
    });

    //Click Show Update Modal
    const btnUpdateShow = document.querySelector(
      `[data-id='${ids}'] .btn-edit`
    );
    btnUpdateShow.addEventListener("click", () => {
      editWrapper.style.display = "block";
      syStart02.value = content.From;
      syEnd02.value = content.To;
      eventName02.value = content.EventName;
      gameName02.value = content.GameName;
      eventDate02.value = content.Date;
      tournamentType02.value = content.TournamentType;

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

      idHolder = ids;
      teamIDHolder = "Champ";

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

      idHolder = ids;
      teamIDHolder = "First";

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

      idHolder = ids;
      teamIDHolder = "Second";

      showTeamDetailsWrapper.style.display = "block";
    });
  }
}
//#endregion

//#region - Delete History
async function DeleteInfo() {
  // if (checkDel.checked == false) {
  //   swal(
  //     "Oww!",
  //     "*Unable to Delete Information, Checkbox not Checked",
  //     "error"
  //   );
  //   // info03.textContent = "*Unable to Delete Information, Checkbox not Checked";
  //   // info03.style.color = "red";
  // } else {
  //   const batch = writeBatch(db);

  //   const getAllTeams = query(collection(db, "GameHistory", idHolder, "Teams"));
  //   const querySnap = await getDocs(getAllTeams);
  //   querySnap.forEach((doc01) => {
  //     let teamRef = doc(db, "GameHistory", idHolder, "Teams", doc01.id);

  //     batch.delete(teamRef);
  //   });

  //   await batch.commit();

  //   deleteDoc(doc(db, "GameHistory", idHolder))
  //     .then(() => {
  //       // alert("Data Deleted Successfuly");
  //       swal("Yay!", "History Data Deleted!", "info").then(() => {
  //         deleteWrapper.style.display = "none";
  //         checkDel.checked = false;
  //         info03.textContent = "This informations will be deleted.";
  //         info03.style.color = "";
  //         window.location.reload();
  //       });
  //     })
  //     .catch((error) => {
  //       swal("Oww!", "*Unsuccessuful operation, error:" + error, "error");
  //       // alert("Unsuccessuful operation, error:" + error);
  //     });
  // }

  if (checkArch.checked == false) {
    swal(
      "Oww!",
      "*Unable to Archive Information, Checkbox not Checked",
      "error"
    );
  } else {
    let today = new Date();
    let holdDay = String(today.getDate()).padStart(2, "0");
    let holdMonth = String(1 + today.getMonth()).padStart(2, "0");
    let date = 1 + today.getFullYear() + "-" + holdMonth + "-" + holdDay;

    updateDoc(doc(db, "GameHistory", idHolder), {
      Status: "Archived",
      DeleteDate: date,
    })
      .then(() => {
        // alert("Data Updated Successfully");
        swal("Wow!", "Data Archived Successfully!", "success").then(() => {
          editWrapper.style.display = "none";
          info02.textContent = "Please fill all the information needed.";
          info02.style.color = "";
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

//#region - Update History
function UpdateInfo() {
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

  if (gameName02.value == "") {
    txtInfo += " Game Name,";
  }

  if (eventDate02.value == "") {
    txtInfo += " Date,";
  }

  if (tournamentType02.selectedIndex == 0) {
    txtInfo += " Tournament Type,";
  }

  if (
    syStart02.value == "" ||
    syEnd02.value == "" ||
    eventName02.value == "" ||
    gameName02.value == "" ||
    eventDate02.value == "" ||
    tournamentType02.selectedIndex == 0
  ) {
    swal("Oww!", txtInfo, "error");
    // info02.textContent = txtInfo;
    // info02.style.color = "red";
  }

  if (
    syStart02.value != "" &&
    syEnd02.value != "" &&
    eventName02.value != "" &&
    gameName02.value != "" &&
    eventDate02.value != "" &&
    tournamentType02.selectedIndex != 0
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
            updateDoc(doc(db, "GameHistory", idHolder), {
              From: syStart02.value,
              To: syEnd02.value,
              EventName: eventName02.value,
              GameName: gameName02.value,
              Date: eventDate02.value,
              DeleteDate: "",
              TournamentType: tournamentType02.value,
            })
              .then(() => {
                // alert("Data Updated Successfully");
                swal("Wow!", "Data Updated Successfully!", "success").then(
                  () => {
                    editWrapper.style.display = "none";
                    info02.textContent =
                      "Please fill all the information needed.";
                    info02.style.color = "";
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
            // info02.textContent = "*Date Year must match either From or To";
            // info02.style.color = "red";
          }
        } else {
          swal("Oww!", "*School year Difference must be 1", "error");
          // info02.textContent = "*School year Difference must be 1";
          // info02.style.color = "red";
        }
      } else {
        swal("Oww!", "*School year From must be less than To", "error");
        // info02.textContent = "*School year From must be less than To";
        // info02.style.color = "red";
      }
    } else {
      swal(
        "Oww!",
        "*School year must be less than 3000 and grater than 1999",
        "error"
      );
      // info02.textContent =
      //   "*School year must be less than 3000 and grater than 1999";
      // info02.style.color = "red";
    }
  }
}
//#endregion

//#region - Show Update Team Details
async function ShowUpdateTeamDetails() {
  showTeamDetailsWrapper.style.display = "none";
  memberContainer.innerHTML = "";
  const ref = doc(db, "GameHistory", idHolder, "Teams", teamIDHolder);
  const querySnap = await getDoc(ref);
  txtTeamRank01.textContent = querySnap.data().Rank;
  teamName01.value = querySnap.data().TeamName;
  class01.value = querySnap.data().Class;

  let teamArr = querySnap.data().TeamMembers;
  for (let x = 0; x < teamArr.length; x++) {
    teamMembers01.value += teamArr[x];

    if (x + 1 < teamArr.length) {
      teamMembers01.value += "\n";
    }
  }

  editTeamDetailsWrapper.style.display = "block";
}
//#endregion

//#region - Update Team Details
function UpdateTeamDetails() {
  let txtInfo = "*Please fill";

  if (teamName01.value == "") {
    txtInfo += " Team Name";
  }

  if (class01.value == "") {
    txtInfo += ", Course, Year, & Section";
  }

  if (teamMembers01.value == "") {
    txtInfo += ", Team Members.";
  }

  if (
    class01.value == "" ||
    teamMembers01.value == "" ||
    teamName01.value == ""
  ) {
    swal("Oww!", txtInfo, "error");
    // info04.textContent = txtInfo;
    // info04.style.color = "red";
  }

  if (
    class01.value != "" &&
    teamMembers01.value != "" &&
    teamName01.value != ""
  ) {
    let teamArr,
      teaArrValid = new Array();
    teamMembers01.value = teamMembers01.value.replace(/^\s*[\r\n]/gm, ""); //remove blank lines
    teamArr = teamMembers01.value.split("\n"); //get lines and save as array
    teamMembers01.value = "";

    for (let x = 0; x < teamArr.length; x++) {
      if (teamArr[x].trim() != "") {
        teaArrValid.push(teamArr[x].trim()); //remove spaces from start and end of string
      }
    }

    for (let y = 0; y < teaArrValid.length; y++) {
      teamMembers01.value += teaArrValid[y];

      if (y + 1 < teaArrValid.length) {
        teamMembers01.value += "\n";
      }
    }

    if (teamIDHolder == "Champ") {
      updateDoc(doc(db, "GameHistory", idHolder), {
        Champ: teamName01.value,
      });
    }

    if (teamIDHolder == "First") {
      updateDoc(doc(db, "GameHistory", idHolder), {
        First: teamName01.value,
      });
    }

    if (teamIDHolder == "Second") {
      updateDoc(doc(db, "GameHistory", idHolder), {
        Second: teamName01.value,
      });
    }

    updateDoc(doc(db, "GameHistory", idHolder, "Teams", teamIDHolder), {
      Class: class01.value,
      TeamMembers: teaArrValid,
      TeamName: teamName01.value,
    })
      .then(() => {
        // alert("Data Updated");
        swal("Wow!", "Team Information Updated Successfully!", "success").then(
          () => {
            editTeamDetailsWrapper.style.display = "none";
            info04.textContent = "Please fill all the information needed.";
            info04.style.color = "";
            window.location.reload();
          }
        );
      })
      .catch((error) => {
        swal("Oww!", "*Unsuccessuful operation, error:" + error, "error");
        // alert("Unsuccessuful operation, error:" + error);
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

//----------------------------------------BUTTON EVENTS-------------------------------------------------
btnAdd.addEventListener("click", AddDocument_AutoID);
btnArchive.addEventListener("click", DeleteInfo);
btnUpdate.addEventListener("click", UpdateInfo);
btnShowEditTeamDetails.addEventListener("click", ShowUpdateTeamDetails);
btnUpdateTeamDetails.addEventListener("click", UpdateTeamDetails);
sortHistory.addEventListener("change", SortHistory);
searchHistory.addEventListener("keyup", SearchFromTable);
btnExport.addEventListener("click", ExcelReport);
