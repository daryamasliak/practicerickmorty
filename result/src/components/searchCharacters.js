import {renderCards} from "../components/characterCard.js";
import { loadCharacters } from "../pages/main.js";
import { setupPagination } from "./pagination.js";

let requestsCount = 0;

export function debounce(callback,delay){
    let timer;
    return function(...args){
        clearTimeout(timer);
        timer = setTimeout(()=>{
            callback(...args);
        }, delay);
    };
}

export async function searchCharacters(searchQuery){
    const cardsContainer = document.getElementById("cards-container");
    if (!searchQuery.trim()){
        loadCharacters(1, "");
        return;
    }

    try{
        requestsCount++;
        console.log(`Server request №${requestsCount}`);
        
        const response = await fetch(`https://rickandmortyapi.com/api/character/?name=${searchQuery}`);
        const data = await response.json();

        if (data.results){
            renderCards(cardsContainer, data.results);
            setupPagination(data.info.pages, 1, (targetPage) =>{
                fetchSearchPage(searchQuery, targetPage);
            });
        } else {
            cardsContainer.innerHTML = `<p>We can't find someone with this name: "${searchQuery}"</p>`;
            if (paginationContainer) paginationContainer.innerHTML ="";
        }
    } catch (error){
        console.error("Error with search:", error);
    }
}

export function initSearch(){
    const searchInput = document.getElementById("searchInput");   
    if (!searchInput) return;
    
    const debouncedFetch = debounce(searchCharacters, 500);
    
    searchInput.addEventListener("input", (e)=>{
        debouncedFetch(e.target.value);
    });
}

async function fetchSearchPage(searchQuery, page){
    const cardsContainer = document.getElementById("cards-container");
    const response = await fetch (`https://rickandmortyapi.com/api/character/?name=${encodeURIComponent(searchQuery)}&page=${page}`);
    const data = await response.json();

    renderCards(cardsContainer, data.results);

    setupPagination(data.info.pages, page, (targetPage) =>{
        fetchSearchPage(searchQuery, targetPage);
    });
}




