import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDKUjMCldF3UZHM_Cih4vMOx2oPvxMavU4",
  authDomain: "characters-8f33b.firebaseapp.com",
  projectId: "characters-8f33b",
  storageBucket: "characters-8f33b.firebasestorage.app",
  messagingSenderId: "140954101436",
  appId: "1:140954101436:web:ccf33c13acbef3d73c52b9",
  measurementId: "G-69FRCT1BKC",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
