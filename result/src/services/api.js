const url_characters = "https://rickandmortyapi.com/api/character";
const url_locations = "https://rickandmortyapi.com/api/location";
const url_episodes = "https://rickandmortyapi.com/api/episode";

export async function fetchCharacters(page = 1, status = "") {
  let url = `${url_characters}?page=${page}`;
  if (status) url += `&status=${status}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("characters are not found");
  return await res.json();
}

export async function fetchSingleCharacter(id) {
  const res = await fetch(`${url_characters}/${id}`);
  if (!res.ok) throw new Error("character is not found");
  return await res.json();
}

export async function fetchEpisodes(seasonCode) {
  let url = "https://rickandmortyapi.com/api/episode";
  if (seasonCode){
    url += `?episode=${seasonCode}`;
  }

  const response = await fetch(url);
  if (!response.ok){
    throw new Error("episodes are not found");
  }
  
  const data = await response.json();
  return data;
}

export async function fetchLocations() {
  const response = await fetch(url_locations);
  if (!response.ok) throw new Error("locations are not found");
  return await response.json();
}
