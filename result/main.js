const url_characters = "https://rickandmortyapi.com/api/character";
const url_locations = "https://rickandmortyapi.com/api/location";
const url_episodes = "https://rickandmortyapi.com/api/episode";

const cardsContainer = document.getElementById("cards-container");
const loaderElement = document.getElementById("loader");
const paginationContainer = document.getElementById("pagination-container");
const backdropOverlay = document.getElementById("backdrop-overlay");

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

let myCharacters = JSON.parse(localStorage.getItem('myCharacters')) || [];
const createCharBtn = document.getElementById('create-char-btn');
const formContainer = document.getElementById('form-container');

createCharBtn.addEventListener('click', () => {
  formContainer.classList.toggle('hidden');
});


const form = document.getElementById('character-form');
const submitBtn = document.getElementById('submit-btn');
submitBtn.disabled = true;

const statusCheckbox = document.getElementById('char-status');
const statusText = document.getElementById('status-text');
statusCheckbox.addEventListener('change', () => {
  if (statusCheckbox.checked) {
    statusText.textContent = 'Alive';
  } else {
    statusText.textContent = 'Died';
  }
});

const nameInput = document.getElementById('char-name');
const ageInput = document.getElementById('char-age');
const nameError = document.getElementById('name-error');
const ageError = document.getElementById('age-error');
const genderSelect = document.getElementById('char-gender');

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
    submitBtn.disabled = false;
  } else {
    submitBtn.disabled = true;
  }
}

nameInput.addEventListener('input', validateForm);
ageInput.addEventListener('input', validateForm);
genderSelect.addEventListener('change', validateForm);
statusCheckbox.addEventListener('change', validateForm);

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const newCharacter = {
    name: nameInput.value.trim(),
    age: parseInt(ageInput.value.trim(), 10),
    gender: genderSelect.value,
    isAlive: statusCheckbox.checked
  };

  myCharacters.push(newCharacter);
  localStorage.setItem('myCharacters', JSON.stringify(myCharacters));
  console.log(myCharacters);

  form.reset();
  statusText.textContent = 'Alive';
  submitBtn.disabled = true;
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
      setupPagination(data.info.pages);

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
      history.pushState(null, "", `?id=${characterId}`);
      loadSingleCharacter(characterId);
    });
  });
}

function setupPagination(totalPages) {
  if (!paginationContainer) return;
  paginationContainer.innerHTML = "";

  const maxVisibleButtons = 2;
  if (currentPage > 1) {
    createPaginationButton("←", currentPage - 1);
  }

  createPaginationButton(1, 1, currentPage === 1);

  if (currentPage > maxVisibleButtons + 2) {
    createPaginationDots();
  }

  let startPage = Math.max(2, currentPage - maxVisibleButtons);
  let endPage = Math.min(totalPages - 1, currentPage + maxVisibleButtons);

  for (let i = startPage; i <= endPage; i++) {
    createPaginationButton(i, i, currentPage === i);
  }

  if (currentPage < totalPages - maxVisibleButtons - 1) {
    createPaginationDots();
  }

  if (totalPages > 1) {
    createPaginationButton(totalPages, totalPages, currentPage === totalPages);
  }

  if (currentPage < totalPages) {
    createPaginationButton("→", currentPage + 1);
  }
}

function createPaginationButton(text, targetPage, isActive = false) {
  const btn = document.createElement("button");
  btn.classList.add("pagination-btn");
  if (isActive) btn.classList.add("active");
  btn.textContent = text;

  if (!isActive) {
    btn.addEventListener("click", () => {
      let newUrl = `?page=${targetPage}`;
      if (currentStatus) {
        newUrl += `&status=${currentStatus}`;
      }
      history.pushState(null, '', newUrl);
      
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

      window.scrollTo(0,0);

      const portalContainer = document.querySelector(".portal");
      if (portalContainer) portalContainer.scrollTop = 0;

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
    if (dropdownBtn) dropdownBtn.innerHTML = `Персонажи <span class="arrow">▼</span>`;

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
    history.pushState(null,"", newUrl);
    loadCharacters(1, status);
  });
});

const dropdownElement = document.querySelector(".dropdown");

if(dropdownElement && backdropOverlay) {
  dropdownElement.addEventListener("mouseenter", ()=>{
    backdropOverlay.classList.add("open");
  });

  dropdownElement.addEventListener("mouseleave", ()=>{
    backdropOverlay.classList.remove("open");
  });
}

const burgerBtn = document.getElementById("burger-menu-btn");
const sidebarRight = document.getElementById("sidebar-right");
const closeRightBtn = document.getElementById("close-right-btn");

if (burgerBtn && sidebarRight && backdropOverlay) {
  burgerBtn.addEventListener("click", () => {
    sidebarRight.classList.add("open");
    backdropOverlay.classList.add("open");
  });
}

function closeSidebar(){
  if (sidebarRight) sidebarRight.classList.remove("open");
  if (backdropOverlay) backdropOverlay.classList.remove("open");
}

if (closeRightBtn) {
  closeRightBtn.addEventListener("click", closeSidebar);
}

if (backdropOverlay){
  backdropOverlay.addEventListener("click",()=>{
    closeSidebar();

    const dropdownContent = document.querySelector(".dropdown-content");
    if (dropdownContent) dropdownContent.classList.remove("open");
  })
}
const urlParams = new URLSearchParams(window.location.search);
const startId = urlParams.get('id');
const startPage = parseInt(urlParams.get('page')) || 1;
const startStatus = urlParams.get('status') || "";

if (startId){
  loadSingleCharacter(startId);
} else {
  loadCharacters(startPage, startStatus);
}

function FillSidebarNames(){
  const charactersButtons = document.querySelectorAll(".item-character");
  const charactersIds = Array.from(charactersButtons).map(btn => btn.getAttribute("data-id"));

  if (charactersIds.length > 0){
    fetch(`${url_characters}/${charactersIds.join(",")}`)
      .then(res => res.json())
      .then(data =>{
        charactersButtons.forEach(btn =>{
          const id = btn.getAttribute("data-id");
          const characterData = Array.isArray(data)
          ? data.find(character => character.id == id) 
          : data;

          if (characterData){
            btn.textContent = characterData.name;
          }
        });
      })
      .catch(err => console.error("smth with filling sidebar names:", err));
  }


  const locationsButtons = document.querySelectorAll(".item-location");
  const locationsIds = Array.from(locationsButtons).map(btn => btn.getAttribute("data-id"));

  if (locationsIds.length > 0) {
    fetch(`${url_locations}/${locationsIds.join(",")}`)
      .then(res => res.json())
      .then(data => {
        locationsButtons.forEach(btn => {
          const id = btn.getAttribute("data-id");
          const locationData = Array.isArray(data) ? data.find(l => l.id == id) : data;
          
          if (locationData) {
            btn.textContent = locationData.name;
            btn.setAttribute("data-name", locationData.name);
          }
        });
      })
      .catch(err => console.error("smth with filling sidebar locations:", err));
  }
}

FillSidebarNames();

function loadEpisodes(seasonCode){
  if(loaderElement) loaderElement.classList.remove("hidden");
  if (paginationContainer) paginationContainer.innerHTML = "";

  fetch(`${url_episodes}?episode=${seasonCode}`)
    .then((res) => {
      if (!res.ok) throw new Error("No episodes found");
      return res.json();
    })
    .then((data) => {
      if (!cardsContainer) return;

      let allEpisodesHTML = "";
      data.results.forEach((episode) => {
        allEpisodesHTML += `
          <div class="episode-card">
            <div class="episode-code">${episode.episode}</div>
            <h3 class="episode-name">${episode.name}</h3>
            <p class="episode-date">Release date: ${episode.air_date}</p>
          </div>
        `;
      });

      cardsContainer.innerHTML = allEpisodesHTML;
      window.scrollTo(0, 0);
    })
    .catch((error) => {
      console.error(error);
      if (cardsContainer) {
        cardsContainer.innerHTML = `<div style="color:red; padding:20px; text-align:center;">${error.message}</div>`;
      }
    })
    .finally(() => {
      if (loaderElement) loaderElement.classList.add("hidden");
    });
}

const accordionTitles = document.querySelectorAll(".accordion-title");

accordionTitles.forEach((title)=>{
  title.addEventListener("click", ()=>{
    const currentSubmenu = title.closest(".accordion-item").querySelector(".accordion-submenu");
    const isActive = title.classList.contains("active");

    accordionTitles.forEach((otherTitles) => {
      otherTitles.classList.remove("active");
      const parentBox = otherTitles.closest(".accordion-item");
      if (parentBox){
        const submenu = parentBox.querySelector(".accordion-submenu");
        if (submenu) submenu.classList.remove("open");
      }

      
    });

    if (!isActive){
      title.classList.add("active");
      if(currentSubmenu) currentSubmenu.classList.add("open");
    }
  });
});

document.querySelectorAll(".item-character").forEach((btn) => {
  btn.addEventListener("click", () => {
    const characterId = btn.getAttribute("data-id");
    history.pushState(null, "", `?id=${characterId}`);
    loadSingleCharacter(characterId);
    closeSidebar();
  });
});

document.querySelectorAll(".item-location").forEach((btn) => {
  btn.addEventListener("click", () => {
    const locationName = btn.getAttribute("data-name");
    if (paginationContainer) paginationContainer.innerHTML = "";

    if (cardsContainer) {
      cardsContainer.innerHTML = `
          <h1>You are in:</h1>
          <h2>${locationName}</h2>
      `;
    }
    closeSidebar();
  });
});

document.querySelectorAll(".item-episode").forEach((btn)=>{
  btn.addEventListener("click", ()=>{
    const seasonNumber = btn.getAttribute("data-season");
    const seasonCode = `S0${seasonNumber}`;
    loadEpisodes(seasonCode);
    closeSidebar();
  })
})

document.querySelectorAll(".submenu-item.item-action").forEach((btn) => {
  btn.addEventListener("click", () => {
    const action = btn.getAttribute("data-action");
    if (paginationContainer) paginationContainer.innerHTML = "";
    if (action === "all-characters") {
      history.pushState(null, "", "/");
      loadCharacters(1, ""); 
    }
    else if(action === "all-locations"){
      if (cardsContainer){
        cardsContainer.innerHTML = `
        <h1>The full database contains hundreds of planets and stations. Maybe you'll see it next time.</h1>`;
      }
    }
    else if (action === "all-episodes"){
      if (cardsContainer){
        cardsContainer.innerHTML = `
        <h1>There are too many series. They’re still being released, please check the official website.</h1>`;
      }
    }
    closeSidebar();
  });
});