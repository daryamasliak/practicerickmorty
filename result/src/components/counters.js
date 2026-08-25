import {
  fetchCharacters,
  fetchLocations,
  fetchEpisodes,
} from "../services/api.js";
const cardsContainer = document.getElementById("cards-container");
export async function initCounters() {
  const characters_count = document.getElementById("characters-count");
  const locations_count = document.getElementById("locations-count");
  const episodes_count = document.getElementById("episodes-count");

  try {
    const [charData, locData, epData] = await Promise.all([
      fetchCharacters(),
      fetchLocations(),
      fetchEpisodes(),
    ]);
    if (characters_count && charData.info) characters_count.innerText = charData.info.count;
    if (locations_count && locData.info) locations_count.innerText = locData.info.count;
    if (episodes_count && epData.info) episodes_count.innerText = epData.info.count;
  } catch (error) {
    console.error("smth wrong with counters:", error);
  }
}
