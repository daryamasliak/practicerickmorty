import {
  fetchCharacters,
  fetchSingleCharacter,
  fetchEpisodes
} from "../services/api.js";

import { renderCards } from "../components/characterCard.js";
import { initCounters } from "../components/counters.js";
import { CharacterForm } from "../components/form.js";
import { setupPagination } from "../components/pagination.js";
import {
  setupSidebarEvents,
  FillSidebarNames,
  fillSidebarLocations,
  closeSidebar,
} from "../components/sidebar.js";

const cardsContainer = document.getElementById("cards-container");
const loaderElement = document.getElementById("loader");
const paginationContainer = document.getElementById("pagination-container");
const logoElement = document.getElementById("logo");
const backdropOverlay = document.getElementById("backdrop-overlay");

let currentPage = 1;
let currentStatus = "";

export async function loadCharacters(page = 1, status = "") {
  if (loaderElement) loaderElement.classList.remove("hidden");
  currentPage = page;
  currentStatus = status;

  try {
    const data = await fetchCharacters(page, status);
    renderCards(cardsContainer, data.results);
    setupPagination(data.info.pages, currentPage, (targetPage)=>{
      let newUrl = `?page=${targetPage}`;
      if (currentStatus){
        newUrl += `&status=${currentStatus}`;
      }
      history.pushState(null, "", newUrl);
      loadCharacters(targetPage, status);
    });
  } catch (error) {
    if (cardsContainer) {
      cardsContainer.innerHTML = `<div style="color:red;">${error.message}</div>`;
    }
  } finally {
    if (loaderElement) loaderElement.classList.add("hidden");
  }
}

export async function loadSingleCharacter(id) {
  if (loaderElement) loaderElement.classList.remove("hidden");
  if (paginationContainer) paginationContainer.innerHTML = "";

  try {
    const character = await fetchSingleCharacter(id);
    if (!cardsContainer) return;

    cardsContainer.innerHTML = `
      <div class="single-character-container">
        <img src="${character.image}" alt="${character.name}">
        <h2>${character.name}</h2>
        <h3>status: ${character.status}</h3>
        <h3>species: ${character.species}</h3>
        <h3>gender: ${character.gender}</h3>
        <button class="back-button" id="go-back-btn">← Назад</button>
      </div>
    `;

    document.getElementById("go-back-btn").addEventListener("click", () => {
      loadCharacters(currentPage, currentStatus);
    });
  } catch (error) {
    console.error(error);
  } finally {
    if (loaderElement) loaderElement.classList.add("hidden");
  }
}

export async function loadEpisodes(seasonCode) {
  if (loaderElement) loaderElement.classList.remove("hidden");
  try {
    const data = await fetchEpisodes(seasonCode);
    if (cardsContainer) {
      cardsContainer.innerHTML = `<h2>Эпизоды сезонов (${seasonCode}):</h2>`;
    }
  } catch (error) {
    console.error(error);
  } finally {
    if (loaderElement) loaderElement.classList.add("hidden");
  }
}

async function initApp() {
  new CharacterForm("character-form");
  initCounters();

  await FillSidebarNames();
  await fillSidebarLocations();

  setupSidebarEvents(loadCharacters, loadSingleCharacter, loadEpisodes);

  if (logoElement) {
    logoElement.addEventListener("click", () => {
      const filterButtons = document.querySelectorAll(
        ".dropdown-content .filter-btn",
      );
      const dropdownBtn = document.querySelector(".dropdown-btn");

      filterButtons.forEach((b) => b.classList.remove("active"));
      if (dropdownBtn)
        dropdownBtn.innerHTML = `Персонажи <span class="arrow">▼</span>`;
      if (backdropOverlay) backdropOverlay.classList.remove("open");

      history.pushState(null, "", "/");
      loadCharacters(1, "");
    });
  }
  const filterButtons = document.querySelectorAll(
    ".dropdown-content .filter-btn",
  );
  const dropdownBtn = document.querySelector(".dropdown-btn");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      if (dropdownBtn)
        dropdownBtn.innerHTML = `${btn.textContent} <span class="arrow">▼</span>`;

      const status = btn.getAttribute("data-status") || "";

      let newUrl = `?page=1`;
      if (status) {
        newUrl += `&status=${status}`;
      }
      history.pushState(null, "", newUrl);
      loadCharacters(1, status);
    });
  });
  const dropdownElement = document.querySelector(".dropdown");

  if (dropdownElement && backdropOverlay) {
    dropdownElement.addEventListener("mouseenter", () => {
      backdropOverlay.classList.add("open");
    });

    dropdownElement.addEventListener("mouseleave", () => {
      backdropOverlay.classList.remove("open");
    });
  }

  window.addEventListener("popstate", () => {
    const path = window.location.pathname;
    if (path.includes("/character/")) {
      loadSingleCharacter(path.split("/").pop());
    } else {
      loadCharacters(currentPage, currentStatus);
    }
  });

  const urlParams = new URLSearchParams(window.location.search);
  const startId = urlParams.get("id");
  const startPage = parseInt(urlParams.get("page")) || 1;
  const startStatus = urlParams.get("status") || "";

  if (startId) {
    loadSingleCharacter(startId);
  } else {
    loadCharacters(startPage, startStatus);
  }
}

const createCharBtn = document.getElementById('create-char-btn');
const formContainer = document.getElementById('form-container');
const form = document.getElementById("character-form");
const submitBtn = document.getElementById("submit-btn");

let myCharacters = JSON.parse(localStorage.getItem('myCharacters')) || [];
createCharBtn.addEventListener('click', () => {
  formContainer.classList.toggle('hidden');
});

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const nameInput = document.getElementById("char-name");
    const ageInput = document.getElementById("char-age");
    const genderSelect = document.getElementById("char-gender");
    const statusCheckbox = document.getElementById("char-status");

    const newCharacter = {
      name: nameInput.value.trim(),
      age: parseInt(ageInput.value.trim(), 10),
      gender: genderSelect.value,
      isAlive: statusCheckbox.checked
    };

    myCharacters.push(newCharacter);
    localStorage.setItem('myCharacters', JSON.stringify(myCharacters));

    form.reset();
    submitBtn.disabled = true;
    formContainer.classList.add('hidden');
  });
}

initApp();