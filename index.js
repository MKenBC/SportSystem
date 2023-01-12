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
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const db = getFirestore();
//#endregion

//-------------------REFERENCES-----------------------------------------------------------------

let btnLogin = document.querySelector("#btnLogin");

//-------------------ACCOUNT VALIDATION--------------------------------------------------------
//#region - Test Account if Exists
async function TestAccount() {
  var ref = doc(db, "AdminAccount", "001");
  const docSnap = await getDoc(ref);

  if (docSnap.exists()) {
    btnLogin.href = "./adminLogin.html";
    btnLogin.click();
  } else {
    btnLogin.href = "./adminCreateAccount.html";
    btnLogin.click();
  }
}
//#endregion

//------------------ASSIGN CLICK EVENT---------------------------------------------------------
btnLogin.addEventListener("click", TestAccount);
