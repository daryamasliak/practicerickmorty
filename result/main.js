const API_URL = "https://rickandmortyapi.com/api";
const url_characters = "https://rickandmortyapi.com/api/character";
const url_locations = "https://rickandmortyapi.com/api/location";
const url_episodes = "https://rickandmortyapi.com/api/episode";

fetch(url_characters)
  .then((response) => response.json())
  .then((data) => console.log(data.results[0].name));

const characters_count = document.querySelector("#characters-count");
fetch(url_characters)
  .then((response) => response.json())
  .then((data) => {
    characters_count.innerText = `${data.info.count}`;
  });

const locations_count = document.querySelector("#locations-count");
fetch(url_locations)
  .then((response) => response.json())
  .then((data) => {
    locations_count.innerText = `${data.info.count}`;
  });

const episodes_count = document.querySelector("#episodes-count");
fetch(url_episodes)
  .then((response) => response.json())
  .then((data) => {
    episodes_count.innerText = `${data.info.count}`;
  });




  
const loaderElement = document.getElementById("loader");

function loadCharacters() {
  loaderElement.classList.remove("hidden");

  fetch(url_characters)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Ошибка. Статус: " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      renderCards(data.results);
    })
    .catch((error) => {
      const errorInContainer = document.getElementById("site-container");
      errorInContainer.innerHTML = `<div id="error" style="background:red;">${error.message}</div>`;

      setTimeout(()=>{
        const alert = document.getElementById("error");
        alert.remove();
      }, 1000);
    })
    .finally(() => {
      loaderElement.classList.add("hidden");
    });
}

loadCharacters();

const phrases = ['1', '2'];
function randomPhrase() {
  setInterval(() => {
    const randomIndex = Math.floor(Math.random() * phrases.length);
    console.log(`${phrases[randomIndex]}`);
    }, 1000);
}

randomPhrase();

function printNumbers(from,to){
  let currentNumber = from;
  let timerId = setInterval(() =>{
    console.log(currentNumber);
    if (currentNumber === to){
      clearInterval(timerId);
    }
    currentNumber++;
  }, 1000);
}

printNumbers(3,5);

function printNumbers1(from,to){
  let currentNumber = from;

  let restart = () => {
    console.log(currentNumber);
    if (currentNumber < to){
      setTimeout(restart, 1000);
    }
    currentNumber++;
  };
  
  setTimeout(restart, 1000);
}

printNumbers1(5,7);

const cardsContainer = document.getElementById("cards-container");

function renderCards(charactersArray){
  cardsContainer.innerHTML = "";
  charactersArray.forEach((character) => {
    const cardHTML = `
      <div class="character-card">
        <img src="${character.image}" alt="${character.name}">
        <h3>${character.name}</h3>
        <p>Status: ${character.status}</p>
        <p>Species: ${character.species}</p>
      </div>
    `;
    cardsContainer.innerHTML += cardHTML;
  });
}