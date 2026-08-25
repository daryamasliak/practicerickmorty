const containerElement = document.getElementById("site-container");
import { loadSingleCharacter } from "../pages/main.js";

export function renderCards(containerElement, charactersArray) {
  if (!containerElement) return;
  if (!Array.isArray(charactersArray)){
    console.error("characters array schould be array", charactersArray);
    return;
  }

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
  const cardsContainer = document.getElementById("cards-container");
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
