const url_characters = "https://rickandmortyapi.com/api/character";
const url_locations = "https://rickandmortyapi.com/api/location";
const url_episodes = "https://rickandmortyapi.com/api/episode";

const cardsContainer = document.getElementById("cards-container");
const loaderElement = document.getElementById("loader");
const paginationContainer = document.getElementById("pagination-container");

let currentPage = 1;
let currentStatus = "";

const characters_count = document.getElementById("characters-count");
const locations_count = document.getElementById("locations-count");
const episodes_count = document.getElementById("episodes-count");
const logoElement = document.getElementById("logo");

fetch(url_characters)
  .then((res) => res.json())
  .then((data) => {
    if (characters_count) characters_count.innerText = data.info.count;
  });
fetch(url_locations)
  .then((res) => res.json())
  .then((data) => {
    if (locations_count) locations_count.innerText = data.info.count;
  });
fetch(url_episodes)
  .then((res) => res.json())
  .then((data) => {
    if (episodes_count) episodes_count.innerText = data.info.count;
  });

function loadCharacters(page = 1, status = "") {
  if (loaderElement) loaderElement.classList.remove("hidden");

  currentPage = page;
  currentStatus = status;

  let queryUrl = `${url_characters}?page=${page}`;
  if (status) queryUrl += `&status=${status}`;

  fetch(queryUrl)
    .then((response) => {
      if (!response.ok) throw new Error("Персонажи не найдены");
      return response.json();
    })
    .then((data) => {
      renderCards(data.results);
      setupPagination(data.info.pages, page);

      window.scrollTo(0, 0);
      const portalContainer = document.querySelector(".portal");
      if (portalContainer) portalContainer.scrollTop = 0;
    })
    .catch((error) => {
      console.error(error);
      if (cardsContainer)
        cardsContainer.innerHTML = `<div style="color:red; padding:20px; text-align:center;">${error.message}</div>`;
      if (paginationContainer) paginationContainer.innerHTML = "";
    })
    .finally(() => {
      if (loaderElement) loaderElement.classList.add("hidden");
    });
}

function renderCards(charactersArray) {
  if (!cardsContainer) return;

  let allCardsHTML = "";
  charactersArray.forEach((character) => {
    allCardsHTML += `
      <div class="character-card" data-id="${character.id}">
        <img src="${character.image}" alt="${character.name}">
        <h3>${character.name}</h3>
        <p>Status: ${character.status}</p>
        <p>Species: ${character.species}</p>
      </div>
    `;
  });

  cardsContainer.innerHTML = allCardsHTML;

  const cards = document.querySelectorAll(".character-card");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const characterId = card.getAttribute("data-id");
      history.pushState(null, "", `/character/${characterId}`);
      loadSingleCharacter(characterId);
    });
  });
}

function setupPagination(totalPages, activePage) {
  if (!paginationContainer) return;
  paginationContainer.innerHTML = "";

  const maxVisibleButtons = 2;
  if (activePage > 1) {
    createPaginationButton("←", activePage - 1);
  }

  createPaginationButton(1, 1, activePage === 1);

  if (activePage > maxVisibleButtons + 2) {
    createPaginationDots();
  }

  let startPage = Math.max(2, activePage - maxVisibleButtons);
  let endPage = Math.min(totalPages - 1, activePage + maxVisibleButtons);

  for (let i = startPage; i <= endPage; i++) {
    createPaginationButton(i, i, activePage === i);
  }

  if (activePage < totalPages - maxVisibleButtons - 1) {
    createPaginationDots();
  }

  if (totalPages > 1) {
    createPaginationButton(totalPages, totalPages, activePage === totalPages);
  }

  if (activePage < totalPages) {
    createPaginationButton("→", activePage + 1);
  }
}

function createPaginationButton(text, targetPage, isActive = false) {
  const btn = document.createElement("button");
  btn.classList.add("pagination-btn");
  if (isActive) btn.classList.add("active");
  btn.textContent = text;

  if (!isActive) {
    btn.addEventListener("click", () => {
      loadCharacters(targetPage, currentStatus);
    });
  }

  paginationContainer.appendChild(btn);
}

function createPaginationDots() {
  const dots = document.createElement("span");
  dots.classList.add("pagination-dots");
  dots.textContent = "...";
  paginationContainer.appendChild(dots);
}

function loadSingleCharacter(id) {
  if (loaderElement) loaderElement.classList.remove("hidden");
  if (paginationContainer) paginationContainer.innerHTML = "";

  fetch(`${url_characters}/${id}`)
    .then((res) => res.json())
    .then((character) => {
      if (!cardsContainer) return;

      cardsContainer.innerHTML = `
        <div class="single-character-container">
          <img src="${character.image}" alt="${character.name}">
          <h2 class="single-character-title">${character.name}</h2>
          <div class="character-specialities">
            <p><strong>Статус:</strong> ${character.status}</p>
            <p><strong>Раса:</strong> ${character.species}</p>
            <p><strong>Пол:</strong> ${character.gender}</p>
            <p><strong>Родной мир:</strong> ${character.origin.name}</p>
          </div>
          <button class="back-button" id="go-back-btn">← Назад на главную</button>
        </div>
      `;

      document.getElementById("go-back-btn").addEventListener("click", () => {
        history.pushState(null, "", "/");
        loadCharacters(currentPage, currentStatus);
      });
    })
    .finally(() => {
      if (loaderElement) loaderElement.classList.add("hidden");
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

if (logoElement) {
  logoElement.addEventListener("click", () => {
    const filterButtons = document.querySelectorAll(
      ".dropdown-content .filter-btn",
    );
    const dropdownBtn = document.querySelector(".dropdown-btn");

    filterButtons.forEach((b) => b.classList.remove("active"));
    if (dropdownBtn)
      dropdownBtn.innerHTML = `Персонажи <span class="arrow">▼</span>`;

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
    loadCharacters(1, status);
  });
});

const burgerBtn = document.getElementById("burger-menu-btn");
const sidebarRight = document.getElementById("sidebar-right");
const closeRightBtn = document.getElementById("close-right-btn");

if (burgerBtn && sidebarRight) {
  burgerBtn.addEventListener("click", () => sidebarRight.classList.add("open"));
}
if (closeRightBtn && sidebarRight) {
  closeRightBtn.addEventListener("click", () =>
    sidebarRight.classList.remove("open"),
  );
}

loadCharacters(1, "");
