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
  setDoc,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const db = getFirestore();
//#endregion

//#region - Element References
//-------------------ELEMENT REFERENCES-------------------------------------------------------------------
const info = document.querySelector("#info");
const fName = document.querySelector("#fName");
const lName = document.querySelector("#lName");
const userName = document.querySelector("#userName");
const userEmail = document.querySelector("#email");
const pass = document.querySelector("#pass");
const pass1 = document.querySelector("#pass1");
const btnSubmitCreateAccount = document.querySelector(
  "#btnSubmitCreateAccount"
);

const submitCodeWrapper = document.querySelector("#submitCodeWrapper");
const info01 = document.querySelector("#info01");
const verificationCode = document.querySelector("#verificationCode");
const btnSubmitCode = document.querySelector("#btnSubmitCode");

//#endregion

let fiveDigitCode;

//-------------------------METHOD/FUNCTIONS--------------------------------------------------------------------

//#region - Hide Modal Function
window.addEventListener("click", (e) => {
  if (e.target === submitCodeWrapper) {
    submitCodeWrapper.style.display = "none";
    info01.textContent = "Please fill the information needed.";
    info01.style.color = "";
    verificationCode.value = "";
  }
});
//#endregion

//#region - Create Event Admin Account
async function CreateSubAdminAccount() {
  let txtInfo = "*Please fill";

  if (fName.value == "") {
    txtInfo += " First Name";
  }

  if (lName.value == "") {
    txtInfo += ", Last Name";
  }

  if (userName.value == "") {
    txtInfo += ", Username";
  }

  if (userEmail.value == "") {
    txtInfo += ", Email";
  }

  if (pass.value == "") {
    txtInfo += ", Password";
  }

  if (pass1.value == "") {
    txtInfo += ", Confirm Password";
  }

  if (
    fName.value == "" ||
    lName.value == "" ||
    userName.value == "" ||
    userEmail.value == "" ||
    pass.value == "" ||
    pass1.value == ""
  ) {
    swal("Oww!", txtInfo, "error");
    // info.textContent = txtInfo;
    // info.style.color = "red";
  }

  if (
    fName.value != "" &&
    lName.value != "" &&
    userName.value != "" &&
    userEmail.value != "" &&
    pass.value != "" &&
    pass1.value != ""
  ) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail.value)) {
      let ref = doc(db, "SubAdminAccounts", userEmail.value);
      const docSnap = await getDoc(ref);
      if (docSnap.exists()) {
        swal("Oww!", "*Email already exists", "error");
        // info.textContent = "*Email Already Exists";
        // info.style.color = "red";
      } else {
        if (pass.value == pass1.value) {
          fiveDigitCode = Math.floor(Math.random() * 90000) + 10000;
          let adminName = fName.value + " " + lName.value;

          Email.send({
            Host: "smtp.mailtrap.io",
            Username: "a4caad8a6a4e09",
            Password: "2814d80e5e610a",
            To: userEmail.value,
            From: "PUPSportsSystem@gmail.com",
            Subject: "SportSystem Account Validation",
            Body:
              "Hello! " +
              adminName +
              "<br><br>" +
              "Planning to Create Account?" +
              "<br>" +
              "Security Code: " +
              fiveDigitCode,
          });

          swal("Hello!", "Security Code Sent!", "info");
          // alert("Security Code Sent");
          submitCodeWrapper.style.display = "block";
        } else {
          swal("Oww!", "*Passwords doesn't match", "error");
          // info.textContent = "*Passwords Doesn't Match";
          // info.style.color = "red";
        }
      }
    } else {
      swal("Oww!", "*Invalid email format", "error");
      // info.textContent = "Invalid Email Format";
      // info.style.color = "red";
    }
  }
}
//#endregion

//#region - Verify and Create Account
async function VerifyAndCreate() {
  if (verificationCode.value == "") {
    swal("Oww!", "*Please fill verification code", "error");
    // info01.textContent = "*Please fill verification code";
    // info01.style.color = "red";
  }

  if (verificationCode.value != "") {
    if (verificationCode.value == fiveDigitCode) {
      let ref = doc(db, "SubAdminAccounts", email.value);
      await setDoc(ref, {
        FirstName: fName.value,
        LastName: lName.value,
        Username: userName.value,
        Email: userEmail.value,
        Password: pass1.value,
      }).then(() => {
        // alert("Account Created");
        swal("Wow!", "Account Created Successfully!", "success").then(() => {
          fName.value = "";
          lName.value = "";
          userName.value = "";
          userEmail.value = "";
          pass.value = "";
          pass1.value = "";
          window.open("./index.html", "_self");
        });
      });
    } else {
      swal("Oww!", "*Invalid verification code", "error");
      // info01.textContent = "*Invalid verification code";
      // info01.style.color = "red";
    }
  }
}
//#endregion

btnSubmitCreateAccount.addEventListener("click", CreateSubAdminAccount);
btnSubmitCode.addEventListener("click", VerifyAndCreate);
