const containerElement = document.getElementById("site-container");
import { loadSingleCharacter } from "../pages/main.js";

export function renderCards(containerElement, charactersArray) {
  if (!containerElement) return;
  if (!Array.isArray(charactersArray)){
    console.error("characters array schould be array", charactersArray);
    return;
  }

  const savedLikes = JSON.parse(localStorage.getItem("characterLikes")) || {};

  let allCardsHTML = "";
  charactersArray.forEach((character) => {
    const currentLikes = savedLikes[character.id] || 0;
    allCardsHTML += `
      <div class="character-card" data-id="${character.id}">
        <img src="${character.image}" alt="${character.name}">
        <h3>${character.name}</h3>
        <p>Status: ${character.status}</p>
        <p>Species: ${character.species}</p>
        <button class="like-btn">
          <span class="heart-icon">&hearts;</span>
          <span class="like-count"> ${currentLikes}</span>
        </button>
      </div>
    `;
  });
  const cardsContainer = document.getElementById("cards-container");
  cardsContainer.innerHTML = allCardsHTML;

  const cards = document.querySelectorAll(".character-card");
  cards.forEach((card) => {
    const characterId = card.getAttribute("data-id");
    card.addEventListener("click", () => {
      history.pushState(null, "", `?id=${characterId}`);
      loadSingleCharacter(characterId);
    });

    const likeBtn = card.querySelector(".like-btn");
    const likeCount = card.querySelector(".like-count");

    likeBtn.addEventListener("click", (event) =>{
      event.stopPropagation();
      const likesData = JSON.parse(localStorage.getItem("characterLikes")) || {};

      likesData[characterId] = (likesData[characterId] || 0) + 1;
      likeCount.textContent = likesData[characterId];

      localStorage.setItem("characterLikes", JSON.stringify(likesData));
    });
  });
}

