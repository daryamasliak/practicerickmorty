import { db } from "../config/firebase.js";
import {
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export function initCharacterForm() {
  const createCharBtn = document.getElementById("create-char-btn");
  const formContainer = document.getElementById("form-container");
  const form = document.getElementById("character-form");
  const submitBtn = document.getElementById("submit-btn");
  submitBtn.disabled = true;

  const statusCheckbox = document.getElementById("char-status");
  const statusText = document.getElementById("status-text");
  statusCheckbox.addEventListener("change", () => {
    if (statusCheckbox.checked) {
      statusText.textContent = "Alive";
    } else {
      statusText.textContent = "Died";
    }
  });

  const nameInput = document.getElementById("char-name");
  const ageInput = document.getElementById("char-age");
  const nameError = document.getElementById("name-error");
  const ageError = document.getElementById("age-error");
  const genderSelect = document.getElementById("char-gender");

  let myCharacters = JSON.parse(localStorage.getItem("myCharacters")) || [];

  createCharBtn.addEventListener("click", () => {
    formContainer.classList.toggle("hidden");
  });

  const ageRegex = /^\d+$/;
  function validateForm() {
    let isNameValid = false;
    let isAgeValid = false;
    let isGenderValid = false;

    const nameValue = nameInput.value.trim();

    if (nameValue === "") {
      nameError.textContent = "Name is required";
    } else if (nameValue.length > 10) {
      nameError.textContent = "Name cannot be longer than 10 characters.";
    } else {
      nameError.textContent = "";
      isNameValid = true;
    }

    const ageValue = ageInput.value.trim();
    if (ageValue === "") {
      ageError.textContent = "Age is required.";
    } else if (!ageRegex.test(ageValue)) {
      ageError.textContent = "Age must be a whole number.";
    } else {
      ageError.textContent = "";
      isAgeValid = true;
    }

    if (genderSelect.value !== "") {
      isGenderValid = true;
    }

    if (isNameValid && isAgeValid && isGenderValid) {
      submitBtn.disabled = false;
    } else {
      submitBtn.disabled = true;
    }
  }

  nameInput.addEventListener("input", validateForm);
  ageInput.addEventListener("input", validateForm);
  genderSelect.addEventListener("change", validateForm);
  statusCheckbox.addEventListener("change", validateForm);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const newCharacter = {
      name: nameInput.value.trim(),
      age: parseInt(ageInput.value.trim(), 10),
      gender: genderSelect.value,
      isAlive: statusCheckbox.checked,
    };

    myCharacters.push(newCharacter);
    localStorage.setItem("myCharacters", JSON.stringify(myCharacters));
    console.log(myCharacters);

    form.reset();
    statusText.textContent = "Alive";
    submitBtn.disabled = true;
  });
}

export class Form {
  constructor(formId) {
    this.formElement = document.getElementById(formId);
    if (!this.formElement) return;
  }

  validate() {
    return true;
  }
}

export class CharacterForm extends Form {
  constructor(formId) {
    super(formId);

    this.formElement = document.getElementById("character-form");

    this.nameInput = document.getElementById("char-name");
    this.ageInput = document.getElementById("char-age");
    this.genderSelect = document.getElementById("char-gender");

    this.nameError = document.getElementById("name-error");
    this.ageError = document.getElementById("age-error");

    this.submitSessionBtn = document.getElementById("submit-session");
    this.submitFirebaseBtn = document.getElementById("submit-firebase");
    this.submitNotionBtn = document.getElementById("submit-notion");

    this.startEvents();
  }

  startEvents() {
    this.nameInput.addEventListener("input", () => this.validate());
    this.ageInput.addEventListener("input", () => this.validate());
    this.genderSelect.addEventListener("change", () => this.validate());

    if (this.submitSessionBtn) {
      this.submitSessionBtn.addEventListener("click", () =>
        this.saveToSession(),
      );
    }

    if (this.submitFirebaseBtn) {
      this.submitFirebaseBtn.addEventListener("click", () =>
        this.saveToFirebase(),
      );
    }

    if (this.submitNotionBtn) {
      this.submitNotionBtn.addEventListener("click", () => this.saveToNotion());
    }
  }

  validate() {
    let isNameValid = false;
    let isAgeValid = false;
    let isGenderValid = false;

    const nameValue = this.nameInput.value.trim();
    if (nameValue === "") {
      this.nameError.textContent = "Name is required";
    } else if (nameValue.length > 10) {
      this.nameError.textContent = "Name cannot be longer than 10 characters";
    } else {
      this.nameError.textContent = "";
      isNameValid = true;
    }

    const ageRegex = /^\d+$/;
    const ageValue = this.ageInput.value.trim();
    if (ageValue === "") {
      this.ageError.textContent = "Age is required";
    } else if (!ageRegex.test(ageValue)) {
      this.ageError.textContent = "Age must be a whole number";
    } else {
      this.ageError.textContent = "";
      isAgeValid = true;
    }

    if (this.genderSelect.value !== "") {
      isGenderValid = true;
    }

    const isValid = isNameValid && isAgeValid && isGenderValid;
    if (this.submitSessionBtn) {
      this.submitSessionBtn.disabled = !isValid;
    }
    if (this.submitFirebaseBtn) {
      this.submitFirebaseBtn.disabled = !isValid;
    }
    if (this.submitNotionBtn) {
      this.submitNotionBtn.disabled = !isValid;
    }
    const submitBtn = document.getElementById("submit-btn");
    if (submitBtn) {
      submitBtn.disabled = !isValid;
    }
    return isValid;
  }

  getCharacterData() {
    return {
      name: this.nameInput.value.trim(),
      age: parseInt(this.ageInput.value.trim(), 10),
      gender: this.genderSelect.value,
    };
  }

  saveToSession() {
    const character = this.getCharacterData();
    let sessionData =
      JSON.parse(sessionStorage.getItem("mySessionCharacters")) || [];
    sessionData.push(character);
    sessionStorage.setItem("mySessionCharacters", JSON.stringify(sessionData));
    this.formElement.reset();
    alert("Data was sent to Session Storage");
  }

  async saveToFirebase() {
    const character = this.getCharacterData();
    try {
      await addDoc(collection(db, "characters"), character);
      this.formElement.reset();
      alert("Data was sent to Firebase");
    } catch (error) {
      console.log(error);
      alert("smth wrong with:", error);
    }
  }

  async saveToNotion() {
    const character = this.getCharacterData();
    const response = await fetch(
      "https://hook.eu1.make.com/vsfot8hqo7b8ie53i36nem6bi6h7i42k",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(character),
      },
    );

    if (response.ok) {
      this.formElement.reset();
      alert("Data was sent to Notion");
    } else {
      alert("smth wrong");
    }
  }
}
