import {menu} from "./menuData.js";

export function createMenuElement(menuArray, level = 0){
    const ul = document.createElement("ul");
    ul.classList.add("accordion-submenu");

    if (level>0){
        ul.style.paddingLeft = `${level *12}px`;
    }

    menuArray.forEach((item) => {
        const li = document.createElement("li");
        li.classList.add("accordion-item");

        if(item.children){
            const titleBtn = document.createElement("button");
            titleBtn.classList.add("accordion-title");

            if(level === 0){
                titleBtn.classList.add("main-title");
            } else {
                titleBtn.classList.add("sub-title");
            }

            titleBtn.innerHTML = `<span>${item.title}</span><span class="sub-arrow">▶</span>`;

            const subMenuUl = createMenuElement(item.children, level + 1);

            titleBtn.addEventListener("click", (e) => {
                e.stopPropagation();

                const isOpen = subMenuUl.classList.contains("open");

                const parentUl = li.parentElement;
                parentUl.querySelectorAll(":scope > .accordion-item > .accordion-submenu").forEach((sub)=>{
                    sub.classList.remove("open");
                });
                parentUl.querySelectorAll(":scope > .accordion-item > .accordion-title").forEach((btn) => {
                    btn.classList.remove("active");
                });

                if (!isOpen){
                    titleBtn.classList.add("active");
                    subMenuUl.classList.add("open");
                }
            });

            li.appendChild(titleBtn);
            li.appendChild(subMenuUl);
        }
        else {
            const btn = document.createElement("button");
            btn.classList.add("submenu-item");

            if (item.action && item.action.startsWith("load-character")) {
                btn.classList.add("item-character");
            } else if (item.action && item.action.startsWith("load-location")) {
                btn.classList.add("item-location");
            } else if (item.action && item.action.startsWith("load-episode")) {
                btn.classList.add("item-episode");
            }

   
            if (item.action) {
            btn.classList.add("item-action");
            }

            btn.textContent = item.title;
            btn.dataset.action = item.action;
            btn.dataset.id = item.payload;

            li.appendChild(btn);
        }

        ul.appendChild(li);
    });

    return ul;
}

export function renderSidebar(menuData){
    const navContainer = document.getElementById("sidebar-navigation");
    if (!navContainer) return;
    navContainer.innerHTML = "";
    
    const menuHTML = createMenuElement(menuData, 0);
    menuHTML.classList.add("open");
    navContainer.appendChild(menuHTML);
}

function zamykanie(){
    
}