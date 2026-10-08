import { menu } from "../components/menuData.js";

const menuStack = [
  {
    title: "Main menu",
    items: menu,
  },
];

const container = document.getElementById("stack-menu");

function renderStackMenu() {
  if (!container) return;

  const currentScreen = menuStack[menuStack.length - 1];

  let html = `
    <div class="stack-header">
    ${menuStack.length > 1 ? `<button id="back-btn" class="back-btn">← Назад</button>` : ""}
    <h3>${currentScreen.title}</h3>
    </div>
    <ul class="menu-list">
    `;

  currentScreen.items.forEach((item, index) => {
    const hasChildren = Boolean(item.children);
    html += `
      <li>
        <button class="menu-btn" data-index="${index}">
          <span>${item.title}</span>
          ${hasChildren ? `<span>▶</span>` : ""}
        </button>
      </li>
    `;
  });

  html += `</ul>`;
  container.innerHTML = html;

  const backBtn = document.getElementById("back-btn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      menuStack.pop();
      renderStackMenu();
    });
  }

  const buttons = container.querySelectorAll(".menu-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = btn.getAttribute("data-index");
      const selectedItem = currentScreen.items[index];

      if (selectedItem.children) {
        menuStack.push({
          title: selectedItem.title,
          items: selectedItem.children,
        });
        renderStackMenu();
      } else if (selectedItem.action) {
        alert(
          `you click: ${selectedItem.action} (id: ${selectedItem.payload})`,
        );
      }
    });
  });
}

renderStackMenu();
