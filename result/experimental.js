const nameInput = document.getElementById('char-name');
const ageInput = document.getElementById('char-age');
const genderSelect = document.getElementById('char-gender');
const nameError = document.getElementById('name-error');
const ageError = document.getElementById('age-error');

const btnSession = document.getElementById('submit-session');
const btnFirebase = document.getElementById('submit-firebase');
const btnNotion = document.getElementById('submit-notion');

const ageRegex = /^\d+$/;
function validateForm() {
  let isNameValid = false;
  let isAgeValid = false;
  let isGenderValid = false;

  const nameValue = nameInput.value.trim();

  if (nameValue === '') {
    nameError.textContent = 'Name is required';
  } else if (nameValue.length > 10) {
    nameError.textContent = 'Name cannot be longer than 10 characters.';
  } else {
    nameError.textContent = '';
    isNameValid = true;
  }

  const ageValue = ageInput.value.trim();
  if (ageValue === '') {
    ageError.textContent = 'Age is required.';
  } else if (!ageRegex.test(ageValue)) {
    ageError.textContent = 'Age must be a whole number.';
  } else {
    ageError.textContent = '';
    isAgeValid = true; 
  }


  if (genderSelect.value !== ""){
    isGenderValid = true;
  }

  if (isNameValid && isAgeValid && isGenderValid) {
    btnSession.disabled = false;
    btnFirebase.disabled = false;
    btnNotion.disabled = false;
  } else {
    btnSession.disabled = true;
    btnFirebase.disabled = true;
    btnNotion.disabled = true;
  }
}

nameInput.addEventListener('input', validateForm);
ageInput.addEventListener('input', validateForm);
genderSelect.addEventListener('change', validateForm);

 function CastCharacter() {
  return {
    name: nameInput.value.trim(),
    age: parseInt(ageInput.value.trim(), 10),
    gender: genderSelect.value,
  };
}

btnSession.addEventListener('click', () => {
  const character = CastCharacter();
  let sessionData = JSON.parse(sessionStorage.getItem('mySessionCharacters')) || [];
  sessionData.push(character);
  
  sessionStorage.setItem('mySessionCharacters', JSON.stringify(sessionData));
  alert("Данные отправлены в Session Storage");
});

btnFirebase.addEventListener('click', () => {
  const character = CastCharacter();
  alert("Тут будет отправка в Firebase");
});

btnNotion.addEventListener('click', () => {
  const character = CastCharacter();
  alert("Тут будет отправка в Notion");
});