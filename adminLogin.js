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

//-------------------IMPORT-----------------------------------------------------------------

import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const db = getFirestore();
//#endregion

//#region - Element References
//-------------------ELEMENT REFERENCES-----------------------------------------------------------------
const emailBox01 = document.querySelector("#email01");
const passwordBox01 = document.querySelector("#pass01");
const adminType01 = document.querySelector("#adminType01");
const btnLogin = document.querySelector(".btn-login");
const notif = document.querySelector("#notif");

const btnShowForgotPass = document.querySelector("#btnShowForgotPass");
const submitEmailWrapper = document.querySelector("#submitEmailWrapper");
const email02 = document.querySelector("#email02");
const adminType02 = document.querySelector("#adminType02");
const btnSubmitEmail = document.querySelector("#btnSubmitEmail");
const info01 = document.querySelector("#info01");

const resetPasswordWrapper = document.querySelector("#resetPasswordWrapper");
const info02 = document.querySelector("#info02");
const verifyCode01 = document.querySelector("#verifyCode01");
const resetPass01 = document.querySelector("#resetPass01");
const resetPass02 = document.querySelector("#resetPass02");
const btnUpdatePassword = document.querySelector("#btnUpdatePassword");
//#endregion
//-------------------LOGIN VALIDATION-----------------------------------------------------------
let holdAdminType, holdAdminID, fiveDigitCode;

//#region - Hide Modal Function
window.addEventListener("click", (e) => {
  if (e.target === submitEmailWrapper) {
    submitEmailWrapper.style.display = "none";
    email02.value = "";
    adminType02.value = "";
    info01.textContent = "Please fill all the information needed.";
    info01.style.color = "";
  }

  if (e.target === resetPasswordWrapper) {
    resetPasswordWrapper.style.display = "none";
    info02.textContent = "Please fill all the information needed.";
    info02.style.color = "";
    verifyCode01.value = "";
    resetPass01.value = "";
    resetPass02.value = "";
  }
});
//#endregion

//#region - Test Login
async function TestLogin() {
  let txtHold = "*Please fill";

  emailBox01.value = emailBox01.value.trim();
  passwordBox01.value = passwordBox01.value.trim();

  if (emailBox01.value == "") {
    txtHold += " Email,";
  }

  if (passwordBox01.value == "") {
    txtHold += " Password,";
  }

  if (adminType01.value == "") {
    txtHold += " Admin Type";
  }

  if (
    emailBox01.value == "" ||
    passwordBox01.value == "" ||
    adminType01.value == ""
  ) {
    swal("Oww!", txtHold, "error");
    // notif.textContent = txtHold;
    // notif.style.color = "red";
  }

  if (
    emailBox01.value != "" &&
    passwordBox01.value != "" &&
    adminType01.value != ""
  ) {
    if (
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailBox01.value)
    ) {
      if (adminType01.value == "MainAdmin") {
        var ref = doc(db, "AdminAccount", "001");
        const docSnap = await getDoc(ref);
        let testEmail = docSnap.data().Email;
        let testPass = docSnap.data().Password;

        if (docSnap.exists()) {
          if (
            testEmail != emailBox01.value &&
            testPass != passwordBox01.value
          ) {
            swal("Oww!", "*Invalid Email and Password", "error");
            // notif.textContent = "*Invalid Email and Password";
            // notif.style.color = "red";
          } else if (
            testEmail == emailBox01.value &&
            testPass != passwordBox01.value
          ) {
            swal("Oww!", "*Invalid Password", "error");
            // notif.textContent = "*Invalid Password";
            // notif.style.color = "red";
          } else if (
            testEmail != emailBox01.value &&
            testPass == passwordBox01.value
          ) {
            swal("Oww!", "*Invalid Email", "error");
            // notif.textContent = "*Invalid Email";
            // notif.style.color = "red";
          } else {
            window.open("./adminMain.html", "_self");
          }
        } else {
          swal("Oww!", "*Account does not exists", "error");
          // notif.textContent = "*Account does not exists";
          // notif.style.color = "red";
        }
      } else if (adminType01.value == "EventAdmin") {
        let ref = doc(db, "SubAdminAccounts", emailBox01.value);
        const docSnap = await getDoc(ref);

        if (docSnap.exists()) {
          let testPass = docSnap.data().Password;
          if (testPass == passwordBox01.value) {
            localStorage.setItem("subAdminEmial", docSnap.id);
            localStorage.setItem("subAdminUsername", docSnap.data().Username);
            window.open("./subAdminMain.html", "_self");
          } else {
            swal("Oww!", "*Invalid Password", "error");
            // notif.textContent = "*Invalid Password";
            // notif.style.color = "red";
          }
        } else {
          swal("Oww!", "*Account does not exists", "error");
          // notif.textContent = "*Account does not exists";
          // notif.style.color = "red";
        }
      }
    } else {
      swal("Oww!", "*Invalid Email Format", "error");

      // notif.textContent = "*Invalid Email Format";
      // notif.style.color = "red";
    }
  }
}
//#endregion

//#region - Send Security Code
async function SendEmailCode() {
  let holdtxt = "*Please fill";

  if (email02.value == "") {
    holdtxt += " Email";
  }

  if (adminType02.value == "") {
    holdtxt += ", Admin Type";
  }

  if (email02.value == "" || adminType02.value == "") {
    swal("Oww!", holdtxt, "error");
    // info01.textContent = holdtxt;
    // info01.style.color = "red";
  }

  if (email02.value != "" && adminType02.value != "") {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email02.value)) {
      if (adminType02.value == "MainAdmin") {
        var ref = doc(db, "AdminAccount", "001");
        const docSnap = await getDoc(ref);

        let testEmail = docSnap.data().Email;
        let adminName =
          docSnap.data().FirstName + " " + docSnap.data().LastName;

        holdAdminType = "MainAdmin";

        if (email02.value == testEmail) {
          fiveDigitCode = Math.floor(Math.random() * 90000) + 10000;

          Email.send({
            Host: "smtp.mailtrap.io",
            Username: "a4caad8a6a4e09",
            Password: "2814d80e5e610a",
            To: email02.value,
            From: "PUPSportsSystem@gmail.com",
            Subject: "Reset Password",
            Body:
              "Hello! " +
              adminName +
              "<br><br>" +
              "Planning to reset Password?" +
              "<br>" +
              "Security Code: " +
              fiveDigitCode,
          }).then(() => {
            submitEmailWrapper.style.display = "none";
            email02.value = "";
            adminType02.value = "";
            info01.textContent = "Please fill all the information needed.";
            info01.style.color = "";
            // alert("Mail Sent");
            swal("Hello!", "Security Code Sent!", "info");
            resetPasswordWrapper.style.display = "block";
          });
        } else {
          swal("Oww!", "*Account doesn't exists", "error");
          // info01.textContent = "*Account does not exist.";
          // info01.style.color = "red";
        }
      } else {
        holdAdminType = "EventAdmin";

        let ref = doc(db, "SubAdminAccounts", email02.value);
        const docSnap = await getDoc(ref);

        if (docSnap.exists()) {
          fiveDigitCode = Math.floor(Math.random() * 90000) + 10000;
          let adminName =
            docSnap.data().FirstName + " " + docSnap.data().LastName;
          holdAdminID = docSnap.id;

          Email.send({
            Host: "smtp.mailtrap.io",
            Username: "a4caad8a6a4e09",
            Password: "2814d80e5e610a",
            To: email02.value,
            From: "PUPSportsSystem@gmail.com",
            Subject: "Reset Password",
            Body:
              "Hello! " +
              adminName +
              "<br><br>" +
              "Planning to reset Password?" +
              "<br>" +
              "Security Code: " +
              fiveDigitCode,
          }).then(() => {
            submitEmailWrapper.style.display = "none";
            email02.value = "";
            adminType02.value = "";
            info01.textContent = "Please fill all the information needed.";
            info01.style.color = "";
            // alert("Security Code Sent");
            swal("Hello!", "Security Code Sent!", "info");
            resetPasswordWrapper.style.display = "block";
          });
        } else {
          swal("Oww!", "*Account doesn't exists", "error");
          // info01.textContent = "*Account does not exist.";
          // info01.style.color = "red";
        }
      }
    } else {
      swal("Oww!", "*Invalid email format", "error");
      // info01.textContent = "*Invalid Email Format.";
      // info01.style.color = "red";
    }
  }
}
//#endregion

//#region - Resey Password
async function ResetPassword() {
  let holdtxt = "*Please fill";

  if (verifyCode01.value == "") {
    holdtxt += " Code";
  }

  if (resetPass01.value == "") {
    holdtxt += ", New Password";
  }

  if (resetPass02.value == "") {
    holdtxt += ", Confirm Password";
  }

  if (
    verifyCode01.value == "" ||
    resetPass01.value == "" ||
    resetPass02.value == ""
  ) {
    swal("Oww!", holdtxt, "error");
    // info02.textContent = holdtxt;
    // info02.style.color = "red";
  }

  if (
    verifyCode01.value != "" &&
    resetPass01.value != "" &&
    resetPass02.value != ""
  ) {
    if (holdAdminType == "MainAdmin") {
      if (fiveDigitCode == verifyCode01.value) {
        if (resetPass01.value == resetPass02.value) {
          let ref = doc(db, "AdminAccount", "001");
          await updateDoc(ref, {
            Password: resetPass01.value,
          }).then(() => {
            resetPasswordWrapper.style.display = "none";
            info02.textContent = "Please fill all the information needed.";
            info02.style.color = "";
            verifyCode01.value = "";
            resetPass01.value = "";
            resetPass02.value = "";
            // alert("Password Updated");
            swal("Wow!", "Password Updated Successfully!", "success");
          });
        } else {
          swal("Oww!", "*Passwords doesn't match", "error");
          // info02.textContent = "*Passwords Don't Match";
          // info02.style.color = "red";
        }
      } else {
        // info02.textContent = "*Invalid Verification code";
        // info02.style.color = "red";
        swal("Oww!", "*Invalid Verification Code", "error");
        verifyCode01.value = "";
      }
    } else {
      if (fiveDigitCode == verifyCode01.value) {
        if (resetPass01.value == resetPass02.value) {
          let ref = doc(db, "SubAdminAccounts", holdAdminID);
          await updateDoc(ref, {
            Password: resetPass01.value,
          }).then(() => {
            resetPasswordWrapper.style.display = "none";
            info02.textContent = "Please fill all the information needed.";
            info02.style.color = "";
            verifyCode01.value = "";
            resetPass01.value = "";
            resetPass02.value = "";
            swal("Wow!", "Password Updated Successfully!", "success");
            // alert("Password Updated");
          });
        } else {
          swal("Oww!", "*Passwords doesn't match", "error");
          // info02.textContent = "*Passwords Don't Match";
          // info02.style.color = "red";
        }
      } else {
        // info02.textContent = "*Invalid Verification code";
        // info02.style.color = "red";
        swal("Oww!", "*Invalid Verification Code", "error");
        verifyCode01.value = "";
      }
    }
  }
}
//#endregion

//------------------ASSIGN CLICK EVENT---------------------------------------------------------
btnShowForgotPass.addEventListener("click", () => {
  submitEmailWrapper.style.display = "block";
});
btnLogin.addEventListener("click", TestLogin);
btnSubmitEmail.addEventListener("click", SendEmailCode);
btnUpdatePassword.addEventListener("click", ResetPassword);
