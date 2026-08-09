import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDKUjMCldF3UZHM_Cih4vMOx2oPvxMavU4",
  authDomain: "characters-8f33b.firebaseapp.com",
  projectId: "characters-8f33b",
  storageBucket: "characters-8f33b.firebasestorage.app",
  messagingSenderId: "140954101436",
  appId: "1:140954101436:web:ccf33c13acbef3d73c52b9",
  measurementId: "G-69FRCT1BKC"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

class Form{
  constructor(formId){
    this.formElement = document.getElementById(formId);
  }

  validate(){
    return true;
  }
}

class CharacterForm extends Form {
  constructor(formId){
    super(formId);

    this.formElement = document.getElementById('character-form');

    this.nameInput = document.getElementById('char-name');
    this.ageInput = document.getElementById('char-age');
    this.genderSelect = document.getElementById('char-gender');

    this.nameError = document.getElementById('name-error');
    this.ageError = document.getElementById('age-error');

    this.submitSessionBtn = document.getElementById('submit-session');
    this.submitFirebaseBtn = document.getElementById('submit-firebase');
    this.submitNotionBtn = document.getElementById('submit-notion');

    this.startEvents();
  }

  startEvents(){
    this.nameInput.addEventListener('input', () => this.validate());
    this.ageInput.addEventListener('input', () => this.validate());
    this.genderSelect.addEventListener('change', () => this.validate());

    this.submitSessionBtn.addEventListener('click', () => this.saveToSession());
    this.submitFirebaseBtn.addEventListener('click', () => this.saveToFirebase());
    this.submitNotionBtn.addEventListener('click', ()=> this.saveToNotion());
  }

  validate(){
    let isNameValid = false;
    let isAgeValid = false;
    let isGenderValid = false;

    const nameValue = this.nameInput.value.trim();
    if (nameValue === '') {
      this.nameError.textContent = 'Name is required';
    } else if (nameValue.length > 10) {
      this.nameError.textContent = 'Name cannot be longer than 10 characters';
    } else {
      this.nameError.textContent = '';
      isNameValid = true;
    }

    const ageRegex = /^\d+$/;
    const ageValue = this.ageInput.value.trim();
    if (ageValue === '') {
      this.ageError.textContent = 'Age is required';
    } else if (!ageRegex.test(ageValue)) {
      this.ageError.textContent = 'Age must be a whole number';
    } else {
      this.ageError.textContent = '';
      isAgeValid = true;
    }

    if (this.genderSelect.value !== '') {
      isGenderValid = true;
    }

    const isValid = isNameValid && isAgeValid && isGenderValid;
    this.submitSessionBtn.disabled = !isValid;
    this.submitFirebaseBtn.disabled = !isValid;
    this.submitNotionBtn.disabled = !isValid;

    return isValid;
  }

  getCharacterData(){
    return {
      name: this.nameInput.value.trim(),
      age: parseInt(this.ageInput.value.trim(), 10),
      gender: this.genderSelect.value,
    };
  }

  saveToSession(){
    const character = this.getCharacterData();
    let sessionData = JSON.parse(sessionStorage.getItem('mySessionCharacters')) || [];
    sessionData.push(character);
    sessionStorage.setItem('mySessionCharacters', JSON.stringify(sessionData));
    this.formElement.reset();
    alert('Data was sent to Session Storage');
    
  }

  async saveToFirebase(){
    const character = this.getCharacterData();
    try{
      await addDoc(collection(db,"characters"), character);
      this.formElement.reset();
      alert("Data was sent to Firebase");
    } catch (error){
      console.log(error);
      alert("smth wrong with:", error);
    }
  }

  async saveToNotion(){
    const character = this.getCharacterData();
    const response = await fetch('https://hook.eu1.make.com/vsfot8hqo7b8ie53i36nem6bi6h7i42k',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify(character)
    });

    if (response.ok){
      this.formElement.reset();
      alert("Data was sent to Notion");
    } else {
      alert("smth wrong");
    }
  }
}

const form = new CharacterForm('character-form');