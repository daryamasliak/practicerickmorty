import { fetchCharacters } from "../services/api.js";

const burgerBtn = document.getElementById("burger-menu-btn");
const sidebarRight = document.getElementById("sidebar-right");
const closeRightBtn = document.getElementById("close-right-btn");
const backdropOverlay = document.getElementById("backdrop-overlay");
const accordionTitles = document.querySelectorAll(".accordion-title");
const cardsContainer = document.getElementById("cards-container");
const paginationContainer = document.getElementById("pagination-container");

export function setupSidebarEvents(
  loadCharacters,
  loadSingleCharacter,
  loadEpisodes,
) {
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

  accordionTitles.forEach((title) => {
    title.addEventListener("click", () => {
      const currentSubmenu = title
        .closest(".accordion-item")
        .querySelector(".accordion-submenu");
      const isActive = title.classList.contains("active");

      accordionTitles.forEach((otherTitles) => {
        otherTitles.classList.remove("active");
        const parentBox = otherTitles.closest(".accordion-item");
        if (parentBox) {
          const submenu = parentBox.querySelector(".accordion-submenu");
          if (submenu) submenu.classList.remove("open");
        }
      });

      if (!isActive) {
        title.classList.add("active");
        if (currentSubmenu) currentSubmenu.classList.add("open");
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

  document.querySelectorAll(".item-episode").forEach((btn) => {
    btn.addEventListener("click", () => {
      const seasonNumber = btn.getAttribute("data-season");
      const seasonCode = `S0${seasonNumber}`;
      loadEpisodes(seasonCode);
      closeSidebar();
    });
  });

  document.querySelectorAll(".submenu-item.item-action").forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.getAttribute("data-action");
      if (paginationContainer) paginationContainer.innerHTML = "";
      if (action === "all-characters") {
        history.pushState(null, "", "/");
        loadCharacters(1, "");
      } else if (action === "all-locations") {
        if (cardsContainer) {
          cardsContainer.innerHTML = `
        <h1>The full database contains hundreds of planets and stations. Maybe you'll see it next time.</h1>`;
        }
      } else if (action === "all-episodes") {
        if (cardsContainer) {
          cardsContainer.innerHTML = `
        <h1>There are too many series. They’re still being released, please check the official website.</h1>`;
        }
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
    fetch(`${url_characters}/${charactersIds.join(",")}`)
      .then((res) => res.json())
      .then((data) => {
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
      })
      .catch((err) =>
        console.error("smth with filling sidebar names:", err),
      );
  }
  }

export async function fillSidebarLocations() {
  const url_locations = "https://rickandmortyapi.com/api/location";

  const locationsButtons = document.querySelectorAll(".item-location");
  const locationsIds = Array.from(locationsButtons).map((btn) =>
    btn.getAttribute("data-id"),
  );

  if (locationsIds.length > 0) {
    fetch(`${url_locations}/${locationsIds.join(",")}`)
      .then((res) => res.json())
      .then((data) => {
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
      })
      .catch((err) =>
        console.error("smth with filling sidebar locations:", err),
      );
  }
}

export function closeSidebar() {
  if (sidebarRight) sidebarRight.classList.remove("open");
  if (backdropOverlay) backdropOverlay.classList.remove("open");
}
