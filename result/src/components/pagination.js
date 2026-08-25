const paginationContainer = document.getElementById("pagination-container");
let currentPage = 1;

export function setupPagination(totalPages, currentPage, onPageChange) {
  if (!paginationContainer) return;
  paginationContainer.innerHTML = "";

  const maxVisibleButtons = 2;
  if (currentPage > 1) {
    createPaginationButton("←", currentPage - 1, false, onPageChange);
  }

  createPaginationButton(1, 1, currentPage === 1, onPageChange);

  if (currentPage > maxVisibleButtons + 2) {
    createPaginationDots();
  }

  let startPage = Math.max(2, currentPage - maxVisibleButtons);
  let endPage = Math.min(totalPages - 1, currentPage + maxVisibleButtons);

  for (let i = startPage; i <= endPage; i++) {
    createPaginationButton(i, i, currentPage === i, onPageChange);
  }

  if (currentPage < totalPages - maxVisibleButtons - 1) {
    createPaginationDots();
  }

  if (totalPages > 1) {
    createPaginationButton(totalPages, totalPages, currentPage === totalPages, onPageChange);
  }

  if (currentPage < totalPages) {
    createPaginationButton("→", currentPage + 1, false, onPageChange);
  }
}

function createPaginationButton(text, targetPage, isActive = false, onPageChange) {
  const btn = document.createElement("button");
  btn.classList.add("pagination-btn");
  if (isActive) btn.classList.add("active");
  btn.textContent = text;

  if (!isActive) {
    btn.addEventListener("click", () => {
      if (typeof onPageChange === "function"){
        onPageChange(targetPage);
      }
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
