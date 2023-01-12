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
  setDoc,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const db = getFirestore();
//#endregion

//#region - Elements
//-------------------ELEMENT REFERENCES-------------------------------------------------------------------
const fName = document.querySelector("#fName");
const lName = document.querySelector("#lName");
const userName = document.querySelector("#userName");
const userEmail = document.querySelector("#email");
const pass = document.querySelector("#pass");
const pass1 = document.querySelector("#pass1");
const code01 = document.querySelector("#code01");
const code02 = document.querySelector("#code02");
const info = document.querySelector("#info");
const btnSubmit = document.querySelector(".btn-submit");

const submitCodeWrapper = document.querySelector("#submitCodeWrapper");
const info01 = document.querySelector("#info01");
const verificationCode = document.querySelector("#verificationCode");
const btnSubmitCode = document.querySelector("#btnSubmitCode");

let fiveDigitCode;
//#endregion
//------------------------------------ACCOUNT METHODS---------------------------------------------------------------

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

//#region - Create Main Admin Account
async function CreateAccount() {
  let txtInfo = "*Please enter";

  if (fName.value == "") {
    txtInfo += ", First name";
  }
  if (lName.value == "") {
    txtInfo += ", Last name";
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
  if (code01.value == "") {
    txtInfo += ", Security Code";
  }
  if (code02.value == "") {
    txtInfo += ", Confirm Security Code";
  }

  if (
    fName.value == "" ||
    lName.value == "" ||
    userName.value == "" ||
    userEmail.value == "" ||
    pass.value == "" ||
    pass1.value == "" ||
    code01.value == "" ||
    code02.value == ""
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
    pass1.value != "" &&
    code01.value != "" &&
    code02.value != ""
  ) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail.value)) {
      if (pass.value != pass1.value && code01.value != code02.value) {
        swal("Oww!", "*Passwords Doesn't Match. Codes Doesn't Match!", "error");
        // info.textContent = "Passwords Does'nt Match. Codes Does'nt Match";
        // info.style.color = "red";
      } else if (pass.value == pass1.value && code01.value != code02.value) {
        swal("Oww!", "*Codes Doesn't Match!", "error");
        // info.textContent = "Codes Does'nt Match";
        // info.style.color = "red";
      } else if (pass.value != pass1.value && code01.value == code02.value) {
        swal("Oww!", "*Passwords Doesn't Match!", "error");
        // info.textContent = "Passwords Does'nt Match";
        // info.style.color = "red";
      } else {
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
      }
    } else {
      swal("Oww!", "*Invalid Email Format!", "error");
      // info.textContent = "Invalid Email Format!";
      // info.style.color = "red";
    }
  }
}
//#endregion

//#region - Verify Code and Create Account
async function VerifyAndCreate() {
  if (verificationCode.value == "") {
    swal("Oww!", "*Please fill Verification Code!", "error");
    // info01.textContent = "*Please fill verification code";
    // info01.style.color = "red";
  } else {
    if (verificationCode.value == fiveDigitCode) {
      var ref = doc(db, "AdminAccount", "001");
      await setDoc(ref, {
        Code: code01.value,
        Email: userEmail.value,
        FirstName: fName.value,
        LastName: lName.value,
        Password: pass1.value,
        Username: userName.value,
      })
        .then(() => {
          swal("Good Job!", "Account Created Successfully!", "success").then(
            () => {
              window.open("./index.html", "_self");
            }
          );
        })
        .catch((error) => {
          swal("Oww!", "*Unsuccessuful operation, error:" + error, "error");
        });
    } else {
      swal("Oww!", "*Invalid Verification Code!", "error");
      // info01.textContent = "*Invalid verification code";
      // info01.style.color = "red";
    }
  }
}
//#endregion


//----------------------------------BUTTON EVENTS-------------------------------------------------------------------
btnSubmit.addEventListener("click", CreateAccount);
btnSubmitCode.addEventListener("click", VerifyAndCreate);
