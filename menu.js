let allProducts = [];
let productsData = {};
let currentCategory = "coffee";
let displayedProducts = 0;
let currentProduct = null;
let basePrice = 0;
let selectedSize = "S";
let selectedAdditives = [];

const productImages = {
  "Irish coffee": "./assets/coffee-1.jpg",
  "Kahlua coffee": "./assets/coffee-2.jpg",
  "Honey raf": "./assets/coffee-3.jpg",
  "Ice cappuccino": "./assets/coffee-4.jpg",
  Espresso: "./assets/coffee-5.jpg",
  Latte: "./assets/coffee-6.jpg",
  "Latte macchiato": "./assets/coffee-7.jpg",
  "Coffee with cognac": "./assets/coffee-8.jpg",
  Moroccan: "./assets/tea-1.png",
  Ginger: "./assets/tea-2.png",
  Cranberry: "./assets/tea-3.png",
  "Sea buckthorn": "./assets/tea-4.png",
  "Marble cheesecake": "./assets/dessert-1.png",
  "Red velvet": "./assets/dessert-2.png",
  Cheesecakes: "./assets/dessert-3.png",
  "Creme brulee": "./assets/dessert-4.png",
  Pancakes: "./assets/dessert-5.png",
  "Honey cake": "./assets/dessert-6.png",
  "Chocolate cake": "./assets/dessert-7.png",
  "Black forest": "./assets/dessert-8.png",
};

async function loadProducts() {
  try {
    const response = await fetch("products.json");
    allProducts = await response.json();

    productsData = {
      coffee: [],
      tea: [],
      dessert: [],
    };

    allProducts.forEach((product) => {
      product.image = productImages[product.name] || "./assets/default.jpg";
      productsData[product.category].push(product);
    });

    renderProducts();
    setupCategoryTabs();
    setupLoadMore();
  } catch (error) {
    console.error("Error loading products:", error);
  }
}

function isMobile() {
  return window.innerWidth <= 768;
}

function getProductsToShow() {
  return isMobile() ? 4 : 8;
}

function renderProducts(append = false) {
  const grid = document.getElementById("productsGrid");
  const categoryProducts = productsData[currentCategory];
  const productsToShow = getProductsToShow();

  if (!append) {
    grid.innerHTML = "";
    displayedProducts = 0;
  }

  const start = displayedProducts;
  const end = Math.min(
    displayedProducts + productsToShow,
    categoryProducts.length
  );

  for (let i = start; i < end; i++) {
    const product = categoryProducts[i];
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img class="product-image" src="${product.image}" alt="${product.name}">
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-price">$${parseFloat(product.price).toFixed(
          2
        )}</div>
      </div>
    `;
    card.addEventListener("click", () => openModal(product));
    grid.appendChild(card);
  }

  displayedProducts = end;
  updateLoadMoreButton();
}

function setupCategoryTabs() {
  const tabs = document.querySelectorAll(".category-tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const category = tab.dataset.category;
      if (category !== currentCategory) {
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        currentCategory = category;
        renderProducts(false);
      }
    });
  });
}

function setupLoadMore() {
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      renderProducts(true);
    });
  }
}

function updateLoadMoreButton() {
  const loadMoreContainer = document.getElementById("loadMoreContainer");
  const categoryProducts = productsData[currentCategory];

  if (isMobile() && displayedProducts < categoryProducts.length) {
    loadMoreContainer.style.display = "flex";
  } else {
    loadMoreContainer.style.display = "none";
  }
}

function openModal(product) {
  currentProduct = product;
  basePrice = parseFloat(product.price);
  selectedSize = "s";
  selectedAdditives = [];

  const modal = document.getElementById("modalOverlay");
  const modalImage = document.getElementById("modalImage");
  const modalName = document.getElementById("modalName");
  const modalDescription = document.getElementById("modalDescription");

  modalImage.src = product.image;
  modalImage.alt = product.name;
  modalName.textContent = product.name;
  modalDescription.textContent = product.description;

  renderSizeOptions(product.sizes);
  renderAdditiveOptions(product.additives);
  updateTotalPrice();

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function renderSizeOptions(sizes) {
  const sizeOptions = document.getElementById("sizeOptions");
  sizeOptions.innerHTML = "";

  Object.keys(sizes).forEach((sizeKey, index) => {
    const size = sizes[sizeKey];
    const btn = document.createElement("button");
    btn.className = `option-button${index === 0 ? " selected" : ""}`;
    btn.dataset.size = sizeKey;
    btn.dataset.price = size["add-price"];
    btn.innerHTML = `
      <div class="option-icon">
        ${sizeKey.toUpperCase()}
      </div>
      <div class="option-details">
        <span class="option-price">${size.size}</span>
      </div>
    `;

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      document
        .querySelectorAll("#sizeOptions .option-button")
        .forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedSize = sizeKey;
      updateTotalPrice();
    });

    sizeOptions.appendChild(btn);
  });
}

function renderAdditiveOptions(additives) {
  const additiveOptions = document.getElementById("additiveOptions");
  additiveOptions.innerHTML = "";

  additives.forEach((additive, index) => {
    const btn = document.createElement("button");
    btn.className = "option-button";
    btn.dataset.additive = additive.name;
    btn.dataset.price = additive["add-price"];
    btn.innerHTML = `
      <div class="option-icon">
        ${index + 1}
      </div>
      <div class="option-details">
        <span class="option-name">${additive.name}</span>
      </div>
    `;

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      btn.classList.toggle("selected");

      const additiveName = additive.name;
      const index = selectedAdditives.findIndex((a) => a.name === additiveName);

      if (index > -1) {
        selectedAdditives.splice(index, 1);
      } else {
        selectedAdditives.push(additive);
      }

      updateTotalPrice();
    });

    additiveOptions.appendChild(btn);
  });
}

function updateTotalPrice() {
  if (!currentProduct) return;

  let total = basePrice;

  // Add size price
  const sizePrice = parseFloat(
    currentProduct.sizes[selectedSize]["add-price"] || 0
  );
  total += sizePrice;

  // Add additive prices
  selectedAdditives.forEach((additive) => {
    total += parseFloat(additive["add-price"] || 0);
  });

  const totalPriceElement = document.getElementById("totalPrice");
  if (totalPriceElement) {
    totalPriceElement.textContent = `$${total.toFixed(2)}`;
  }
}

function closeModal() {
  const modal = document.getElementById("modalOverlay");
  modal.classList.remove("active");
  document.body.style.overflow = "";
  currentProduct = null;
  selectedSize = "s";
  selectedAdditives = [];
}

function setupModal() {
  const modal = document.getElementById("modalOverlay");
  const closeButton = document.getElementById("closeButton");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const modalContent = document.getElementById("modalContent");

  if (closeButton) {
    closeButton.addEventListener("click", closeModal);
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closeModal);
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  if (modalContent) {
    modalContent.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });
}

let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    const currentDisplayedCount = displayedProducts;
    const productsToShow = getProductsToShow();

    if (!isMobile()) {
      if (currentDisplayedCount < productsToShow) {
        renderProducts(false);
      }
    } else {
      if (currentDisplayedCount > 4) {
        renderProducts(false);
      }
    }

    updateLoadMoreButton();
  }, 250);
});

if (window.location.pathname.includes("menu.html")) {
  const menuLink = document.getElementById("menuLink");
  if (menuLink) {
    menuLink.style.pointerEvents = "none";
    // menuLink.style.opacity = "0.5";
    menuLink.style.cursor = "default";

    menuLink.addEventListener("click", function (e) {
      e.preventDefault();
    });
  }
}

window.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  setupModal();
});
