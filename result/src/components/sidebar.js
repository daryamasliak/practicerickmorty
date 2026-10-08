import { fetchCharacters } from "../services/api.js";
import { menu } from "./menuData.js";
import {renderSidebar} from "../components/renderSidebar.js";



export function closeSidebar() {
  const sidebarRight = document.getElementById("sidebar-right");
  const backdropOverlay = document.getElementById("backdrop-overlay");

  if (sidebarRight) sidebarRight.classList.remove("open");
  if (backdropOverlay) backdropOverlay.classList.remove("open");
}

export function setupSidebarEvents(
  loadCharacters,
  loadSingleCharacter,
  loadEpisodes,
) {

  const burgerBtn = document.getElementById("burger-menu-btn");
  const sidebarRight = document.getElementById("sidebar-right");
  const closeRightBtn = document.getElementById("close-right-btn");
  const backdropOverlay = document.getElementById("backdrop-overlay");
  const cardsContainer = document.getElementById("cards-container");
  const paginationContainer = document.getElementById("pagination-container");

  if (burgerBtn && sidebarRight && backdropOverlay) {
    burgerBtn.addEventListener("click", () => {
      sidebarRight.classList.add("open");
      backdropOverlay.classList.add("open");
    });
  }

  if (closeRightBtn) {
    closeRightBtn.addEventListener("click", closeSidebar);
  }

  if (backdropOverlay) {
    backdropOverlay.addEventListener("click", () => {
      closeSidebar();

      const dropdownContent = document.querySelector(".dropdown-content");
      if (dropdownContent) dropdownContent.classList.remove("open");
    });
  }

  document.querySelectorAll(".submenu-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.getAttribute("data-action");
      const payload = btn.getAttribute("data-id");

      const newUrl = `?action=${action}&value=${encodeURIComponent(payload)}`;
      history.pushState({action, payload}, "", newUrl);

      if (paginationContainer) paginationContainer.innerHTML = "";

      switch (action){
        case "load-character":
          history.pushState(null,"",`?id=${payload}`);
          loadSingleCharacter(payload);
          break;
        
          case "filter-status":
          case "filter-species":
          case "filter-gender":
            loadCharacters(1, payload);
            break;

          case "load-location":
          case "filter-dimension":
            if (cardsContainer){
              const locationName = btn.getAttribute("data-name") || payload;
              cardsContainer.innerHTML = `
                <h1>You are in:</h1>
                <h2>${locationName}</h2>
              `;
            }
            break;

          case "load-season":
            loadEpisodes(payload);
            break;

          case "load-episode":
            loadEpisodes(`Episode ID: ${payload}`);
            break;

          case "load-all-seasons":
            loadEpisodes("");
            break;

          default:
            console.warn("idk this action:", action);
      }


      closeSidebar();
    });
  });
}

export async function FillSidebarNames() {
  const url_characters = "https://rickandmortyapi.com/api/character";

  const charactersButtons = document.querySelectorAll(".item-character");
  const charactersIds = Array.from(charactersButtons).map((btn) =>
    btn.getAttribute("data-id"),
  );

  if (charactersIds.length > 0) {
    try {
      const res = await fetch(`${url_characters}/${charactersIds.join(",")}`);
      const data = await res.json();
        charactersButtons.forEach((btn) => {
          const id = btn.getAttribute("data-id");
          const characterData = Array.isArray(data)
            ? data.find((l) => l.id == id)
            : data;

          if (characterData) {
            btn.textContent = characterData.name;
            btn.setAttribute("data-name", characterData.name);
          }
        });
      } catch(err) {
        console.error("smth with filling sidebar names:", err);
      }
  }
  }

export async function fillSidebarLocations() {
  const url_locations = "https://rickandmortyapi.com/api/location";

  const locationsButtons = document.querySelectorAll(".item-location");
  const locationsIds = Array.from(locationsButtons).map((btn) =>
    btn.getAttribute("data-id"),
  );

  if (locationsIds.length > 0) {
    try {
      const res = await fetch(`${url_locations}/${locationsIds.join(",")}`);
      const data = await res.json();
        locationsButtons.forEach((btn) => {
          const id = btn.getAttribute("data-id");
          const locationData = Array.isArray(data)
            ? data.find((l) => l.id == id)
            : data;

          if (locationData) {
            btn.textContent = locationData.name;
            btn.setAttribute("data-name", locationData.name);
          }
        });
      } catch(err) {
        console.error("smth with filling sidebar locations:", err);
      }
  }
}

export function openMenuFromUrl (loadCharacters,loadSingleCharacter,loadEpisodes){
  const urlParams = new URLSearchParams(window.location.search);

  let action = urlParams.get("action");
  let value = urlParams.get("value");

  const charId = urlParams.get("id");
  if (!action && charId){
    action = "load-character";
    value = charId;
  }

  if (!action || !value) return;

  const targetBtn = document.querySelector(
    `.submenu-item[data-action="${action}"][data-id="${value}"]`
  );

  if (targetBtn){
    let currentElement = targetBtn.parentElement;
    while (currentElement && currentElement.id !== "sidebar-right") {
      if (currentElement.classList.contains("accordion-submenu")) {
        currentElement.classList.add("open");
      }
      if (currentElement.classList.contains("accordion-item")) {
        const titleBtn = currentElement.querySelector(":scope > .accordion-title");
        if (titleBtn) titleBtn.classList.add("active");
      }
      currentElement = currentElement.parentElement;
  }
  const sidebarRight = document.getElementById("sidebar-right");
    const backdropOverlay = document.getElementById("backdrop-overlay");
    if (sidebarRight) sidebarRight.classList.add("open");
    if (backdropOverlay) backdropOverlay.classList.add("open");

    targetBtn.scrollIntoView({ behavior: "smooth", block: "center" });
  }}

export async function initSidebar(loadCharacters, loadSingleCharacter,loadEpisodes){
  renderSidebar(menu);

  await FillSidebarNames();
  await fillSidebarLocations();

  setupSidebarEvents(loadCharacters, loadSingleCharacter, loadEpisodes);

 openMenuFromUrl(loadCharacters, loadSingleCharacter, loadEpisodes); 
}