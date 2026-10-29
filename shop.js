

/* =========================================================
   STACKLY AUTO CARE — SHOP PAGE
   Products, Search, Filters, Sorting, Cart and Checkout
   Demo orders are saved in localStorage.
========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const CART_STORAGE_KEY = "autocare_shop_cart";
  const ORDERS_STORAGE_KEY = "autocare_shop_orders";
  const SESSION_KEY = "autocare_demo_session";

  /* =====================================================
     1. PRODUCT DATA
  ===================================================== */

  const products = [
    {
      id: 1,
      name: "Premium Engine Oil",
      category: "Engine Parts",
      filterCategory: "engine",
      price: 1899,
      rating: 4.8,
      reviews: 124,
      badge: "BEST SELLER",
      badgeType: "popular",
      image: "assets/images/products/engine-oil.jpg",
      fallbackImage: "assets/shop/engine oil.webp",
      description: "High-performance engine oil designed to support smooth engine operation."
    },
    {
      id: 2,
      name: "Ceramic Brake Pads",
      category: "Brake System",
      filterCategory: "brakes",
      price: 2499,
      rating: 4.7,
      reviews: 86,
      badge: "POPULAR",
      badgeType: "popular",
      image: "assets/images/products/brake-pads.jpg",
      fallbackImage: "assets/shop/brake pads.webp",
      description: "Reliable braking components designed for dependable everyday driving."
    },
    {
      id: 3,
      name: "Car Air Filter",
      category: "Filters",
      filterCategory: "maintenance",
      price: 799,
      rating: 4.6,
      reviews: 73,
      badge: "GREAT VALUE",
      badgeType: "success",
      image: "assets/images/products/air-filter.jpg",
      fallbackImage: "assets/shop/air filter.webp",
      description: "A quality replacement filter to help maintain clean airflow."
    },
    {
      id: 4,
      name: "Car Battery 12V",
      category: "Electrical",
      filterCategory: "electrical",
      price: 5499,
      rating: 4.9,
      reviews: 95,
      badge: "TOP RATED",
      badgeType: "success",
      image: "assets/images/products/car-battery.jpg",
      fallbackImage: "assets/shop/car battery.webp",
      description: "A dependable battery option for consistent vehicle starting power."
    },
    {
      id: 5,
      name: "Performance Spark Plugs",
      category: "Engine Parts",
      filterCategory: "engine",
      price: 1199,
      rating: 4.5,
      reviews: 61,
      badge: "QUALITY PICK",
      badgeType: "info",
      image: "assets/images/products/spark-plugs.jpg",
      fallbackImage: "assets/shop/spark plug.webp",
      description: "Engine ignition components designed for reliable performance."
    },
    {
      id: 6,
      name: "Synthetic Engine Oil",
      category: "Engine Parts",
      filterCategory: "engine",
      price: 2299,
      rating: 4.8,
      reviews: 112,
      badge: "PREMIUM",
      badgeType: "popular",
      image: "assets/images/products/synthetic-oil.jpg",
      fallbackImage: "assets/shop/synthetic oil.webp",
      description: "Synthetic lubricant developed to support engine protection."
    },
    {
      id: 7,
      name: "Brake Disc Rotor",
      category: "Brake System",
      filterCategory: "brakes",
      price: 3199,
      rating: 4.6,
      reviews: 58,
      badge: "RELIABLE",
      badgeType: "info",
      image: "assets/images/products/brake-rotor.jpg",
      fallbackImage: "assets/shop/brake rotor.webp",
      description: "Precision-designed brake rotor for dependable braking performance."
    },
    {
      id: 8,
      name: "LED Headlight Kit",
      category: "Electrical",
      filterCategory: "electrical",
      price: 2799,
      rating: 4.7,
      reviews: 79,
      badge: "POPULAR",
      badgeType: "popular",
      image: "assets/images/products/led-headlight.jpg",
      fallbackImage: "assets/shop/led headlight.webp",
      description: "LED lighting components designed to improve road visibility."
    },
    {
      id: 9,
      name: "Oil Filter",
      category: "Filters",
      filterCategory: "maintenance",
      price: 499,
      rating: 4.4,
      reviews: 48,
      badge: "ESSENTIAL",
      badgeType: "info",
      image: "assets/images/products/oil-filter.jpg",
      fallbackImage: "assets/shop/oil filter.webp",
      description: "Replacement oil filter designed to help capture engine contaminants."
    },
    {
      id: 10,
      name: "Radiator Coolant",
      category: "Cooling System",
      filterCategory: "maintenance",
      price: 699,
      rating: 4.5,
      reviews: 52,
      badge: "ESSENTIAL",
      badgeType: "info",
      image: "assets/images/products/radiator-coolant.jpg",
      fallbackImage: "assets/shop/radiator coolent.webp",
      description: "Coolant formulated to support temperature control in compatible vehicles."
    },
    {
      id: 11,
      name: "Shock Absorber",
      category: "Suspension",
      filterCategory: "maintenance",
      price: 3899,
      rating: 4.6,
      reviews: 43,
      badge: "DURABLE",
      badgeType: "success",
      image: "assets/images/products/shock-absorber.jpg",
      fallbackImage: "assets/shop/shock absorber.webp",
      description: "Suspension replacement component for a more controlled ride."
    },
    {
      id: 12,
      name: "Car Phone Holder",
      category: "Accessories",
      filterCategory: "accessories",
      price: 599,
      rating: 4.3,
      reviews: 67,
      badge: "BUDGET PICK",
      badgeType: "success",
      image: "assets/images/products/phone-holder.jpg",
      fallbackImage: "assets/shop/phone holder.webp",
      description: "Convenient phone mounting accessory for compatible vehicles."
    },
    {
      id: 13,
      name: "Microfiber Cleaning Kit",
      category: "Accessories",
      filterCategory: "accessories",
      price: 899,
      rating: 4.7,
      reviews: 91,
      badge: "CUSTOMER PICK",
      badgeType: "popular",
      image: "assets/images/products/cleaning-kit.jpg",
      fallbackImage: "assets/shop/cleaning kit.webp",
      description: "A practical cleaning kit for routine vehicle care and detailing."
    },
    {
      id: 14,
      name: "Performance Air Intake",
      category: "Engine Parts",
      filterCategory: "engine",
      price: 4299,
      rating: 4.6,
      reviews: 39,
      badge: "PERFORMANCE",
      badgeType: "info",
      image: "assets/images/products/air-intake.jpg",
      fallbackImage: "assets/shop/air intake.webp",
      description: "Air intake component designed for compatible vehicle applications."
    },
    {
      id: 15,
      name: "Premium Wiper Blades",
      category: "Accessories",
      filterCategory: "accessories",
      price: 749,
      rating: 4.5,
      reviews: 64,
      badge: "EVERYDAY ESSENTIAL",
      badgeType: "success",
      image: "assets/images/products/wiper-blades.jpg",
      fallbackImage: "assets/shop/wiper blades.webp",
      description: "Replacement wiper blades designed for clear visibility in wet weather."
    },
    {
      id: 16,
      name: "Brake Fluid",
      category: "Brake System",
      filterCategory: "brakes",
      price: 549,
      rating: 4.6,
      reviews: 46,
      badge: "ESSENTIAL",
      badgeType: "info",
      image: "assets/images/products/brake-fluid.jpg",
      fallbackImage: "assets/shop/brake fluid.webp",
      description: "Brake fluid for vehicles requiring the specified compatible fluid type."
    }
  ];

  /* =====================================================
     2. DOM REFERENCES
  ===================================================== */

  const productsGrid = document.getElementById("shopProductsGrid");
  const searchForm = document.getElementById("shopSearchForm");
  const searchInput = document.getElementById("shopSearchInput");
  const sortSelect = document.getElementById("shopSort");
  const categoriesContainer = document.getElementById("shopCategories");
  const activeFilter = document.getElementById("shopActiveFilter");
  const clearCategoryButton = document.getElementById("clearCategoryButton");
  const resultsSummary = document.getElementById("shopResultsSummary");
  const emptyState = document.getElementById("shopEmptyState");
  const resetFiltersButton = document.getElementById("resetShopFilters");

  const cartItemsContainer = document.getElementById("shopCartItems");
  const cartSummaryText = document.getElementById("cartSummaryText");
  const cartTotalElement = document.getElementById("cartTotal");
  const clearCartButton = document.getElementById("clearCartButton");

  /* =====================================================
     3. STATE AND HELPERS
  ===================================================== */

  let selectedCategory = "all";
  let searchTerm = "";
  let selectedSort = "featured";
  let cart = readCart();
  let toastTimer;

  function formatPrice(price) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(price);
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (character) => {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      };

      return entities[character];
    });
  }

  function getProductById(productId) {
    return products.find((product) => product.id === Number(productId));
  }

  function getCategoryLabel(category) {
    const labels = {
      all: "All Products",
      engine: "Engine Parts",
      brakes: "Brake System",
      electrical: "Electrical",
      maintenance: "Maintenance",
      accessories: "Accessories"
    };

    return labels[category] || "All Products";
  }

  function getBadgeClass(badgeType) {
    const supportedTypes = [
      "success",
      "popular",
      "new",
      "warning",
      "danger",
      "info"
    ];

    return supportedTypes.includes(badgeType) ? badgeType : "info";
  }

  /* =====================================================
     4. SAFE STORAGE HELPERS
  ===================================================== */

  function readJSON(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "null");
      return value === null ? fallback : value;
    } catch (error) {
      console.warn(`Unable to read ${key}.`, error);
      return fallback;
    }
  }

  function readCart() {
    const savedCart = readJSON(CART_STORAGE_KEY, []);

    if (!Array.isArray(savedCart)) return [];

    return savedCart
      .map((item) => {
        const product = getProductById(item.id);
        const quantity = Number(item.quantity);

        if (
          !product ||
          !Number.isInteger(quantity) ||
          quantity < 1
        ) {
          return null;
        }

        return {
          id: product.id,
          quantity: Math.min(quantity, 99)
        };
      })
      .filter(Boolean);
  }

  function saveCart() {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      return true;
    } catch (error) {
      console.error("Unable to save the cart.", error);
      showToast("Unable to save your cart in this browser.");
      return false;
    }
  }

  /* =====================================================
     5. FILTER AND SORT PRODUCTS
  ===================================================== */

  function getFilteredProducts() {
    let filtered = [...products];

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.filterCategory === selectedCategory
      );
    }

    if (searchTerm.trim()) {
      const query = searchTerm.trim().toLowerCase();

      filtered = filtered.filter((product) => (
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      ));
    }

    switch (selectedSort) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;

      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;

      case "rating":
        filtered.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
        break;

      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;

      default:
        filtered.sort((a, b) => a.id - b.id);
    }

    return filtered;
  }

  function updateActiveFilter() {
    if (activeFilter) {
      activeFilter.textContent =
        selectedCategory === "all" && !searchTerm
          ? "Showing all products"
          : `Filter: ${getCategoryLabel(selectedCategory)}${
              searchTerm ? ` · Search: "${searchTerm}"` : ""
            }`;
    }

    if (clearCategoryButton) {
      clearCategoryButton.hidden =
        selectedCategory === "all" && !searchTerm;
    }

    if (resultsSummary) {
      const count = getFilteredProducts().length;

      resultsSummary.textContent =
        `${count} ${count === 1 ? "product" : "products"} found`;
    }
  }

  function updateCategoryButtons() {
    if (!categoriesContainer) return;

    categoriesContainer.querySelectorAll("[data-category]").forEach((button) => {
      const active = button.dataset.category === selectedCategory;

      button.classList.toggle("active", active);
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  /* =====================================================
     6. PRODUCT IMAGE FALLBACK
  ===================================================== */

  function handleProductImageError(image) {
    if (image.dataset.fallbackAttempted !== "true") {
      image.dataset.fallbackAttempted = "true";

      const fallback = image.dataset.fallbackImage;

      if (fallback) {
        image.src = fallback;
        return;
      }
    }

    image.hidden = true;

    const wrapper = image.closest(".shop-product-image-wrap");

    if (wrapper && !wrapper.querySelector(".shop-image-fallback")) {
      const fallbackElement = document.createElement("div");

      fallbackElement.className = "shop-image-fallback";
      fallbackElement.setAttribute("role", "img");
      fallbackElement.setAttribute("aria-label", "Product image unavailable");

      wrapper.appendChild(fallbackElement);
    }
  }

  /* =====================================================
     7. RENDER PRODUCT CARDS
  ===================================================== */

  function renderProducts() {
    if (!productsGrid) return;

    const filteredProducts = getFilteredProducts();

    if (resultsSummary) {
      resultsSummary.textContent =
        `${filteredProducts.length} ${
          filteredProducts.length === 1 ? "product" : "products"
        } found`;
    }

    if (emptyState) {
      emptyState.hidden = filteredProducts.length !== 0;
    }

    if (filteredProducts.length === 0) {
      productsGrid.innerHTML = "";
      productsGrid.hidden = true;
      updateActiveFilter();
      updateCategoryButtons();
      return;
    }

    productsGrid.hidden = false;

    productsGrid.innerHTML = filteredProducts.map((product) => {
      const name = escapeHTML(product.name);
      const category = escapeHTML(product.category);
      const description = escapeHTML(product.description);
      const badge = escapeHTML(product.badge);
      const image = escapeHTML(product.image);
      const fallbackImage = escapeHTML(product.fallbackImage);
      const badgeClass = getBadgeClass(product.badgeType);

      return `
        <article class="shop-product-card">
          <div class="shop-product-visual">
            <div class="shop-product-image-wrap">
              <img
                class="shop-product-image"
                src="${image}"
                data-fallback-image="${fallbackImage}"
                alt="${name}"
                loading="lazy"
                decoding="async"
              >
            </div>

            <span class="shop-product-badge badge-${badgeClass}">
              ${badge}
            </span>
          </div>

          <div class="shop-product-info">
            <span class="shop-product-category">${category}</span>
            <h3>${name}</h3>

            <p class="shop-product-description">${description}</p>

            <div class="shop-product-rating" aria-label="Rated ${product.rating} out of 5">
              <span class="rating-stars" aria-hidden="true">★★★★★</span>
              <span class="rating-value">${product.rating.toFixed(1)}</span>
              <span class="rating-count">(${product.reviews})</span>
            </div>

            <div class="shop-product-footer">
              <div class="shop-product-price">
                <small>Price</small>
                <strong>${formatPrice(product.price)}</strong>
              </div>

              <button
                class="shop-add-button"
                type="button"
                data-add-to-cart="${product.id}"
                aria-label="Add ${name} to cart"
              >
                <span aria-hidden="true">+</span>
                Add to Cart
              </button>
            </div>
          </div>
        </article>
      `;
    }).join("");

    updateActiveFilter();
    updateCategoryButtons();
  }

  /* =====================================================
     8. CART CALCULATIONS
  ===================================================== */

  function getCartQuantity() {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  function getCartTotal() {
    return cart.reduce((total, item) => {
      const product = getProductById(item.id);

      return product
        ? total + product.price * item.quantity
        : total;
    }, 0);
  }

  function updateCartCount() {
    const count = getCartQuantity();

    document.querySelectorAll(
      "#cartCount, #shopCartCount, [data-cart-count]"
    ).forEach((element) => {
      element.textContent = String(count);
      element.hidden = count === 0;
      element.setAttribute("aria-label", `${count} items in cart`);
    });
  }

  /* =====================================================
     9. CHECKOUT BUTTON
     Create it inside the existing cart summary.
  ===================================================== */

  function ensureCheckoutButton() {
    if (document.getElementById("checkoutButton")) return;

    const summary = document.querySelector(".shop-cart-summary");

    if (!summary) return;

    const button = document.createElement("button");

    button.id = "checkoutButton";
    button.type = "button";
    button.className = "btn btn-primary shop-checkout-button";
    button.textContent = "Proceed to Checkout";

    Object.assign(button.style, {
      width: "100%",
      marginTop: "16px"
    });

    if (cartTotalElement) {
      cartTotalElement.insertAdjacentElement("afterend", button);
    } else {
      summary.appendChild(button);
    }

    button.addEventListener("click", checkout);
  }

  /* =====================================================
     10. RENDER CART
  ===================================================== */

  function renderCart() {
    updateCartCount();
    ensureCheckoutButton();

    if (!cartItemsContainer) return;

    const quantity = getCartQuantity();
    const total = getCartTotal();

    if (cartSummaryText) {
      cartSummaryText.textContent =
        `${quantity} ${quantity === 1 ? "item" : "items"}`;
    }

    if (cartTotalElement) {
      cartTotalElement.textContent = formatPrice(total);
    }

    if (clearCartButton) {
      clearCartButton.disabled = cart.length === 0;
    }

    const checkoutButton = document.getElementById("checkoutButton");

    if (checkoutButton) {
      checkoutButton.disabled = cart.length === 0;
      checkoutButton.style.opacity = cart.length === 0 ? "0.55" : "1";
      checkoutButton.style.cursor = cart.length === 0 ? "not-allowed" : "pointer";
    }

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="shop-cart-empty">
          <img
            src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=400&q=75"
            alt="Automotive parts"
            loading="lazy"
          >
          <h3>Your cart is empty</h3>
          <p>You haven't added any products yet. Explore our collection and find the parts you need.</p>
          <a href="#shopProducts">Explore Products</a>
        </div>
      `;

      return;
    }

    cartItemsContainer.innerHTML = cart.map((item) => {
      const product = getProductById(item.id);

      if (!product) return "";

      const name = escapeHTML(product.name);
      const category = escapeHTML(product.category);
      const image = escapeHTML(product.image);
      const fallbackImage = escapeHTML(product.fallbackImage);
      const subtotal = product.price * item.quantity;

      return `
        <article class="shop-cart-item">
          <div class="shop-cart-image-wrap">
            <img
              class="shop-cart-product-image"
              src="${image}"
              data-fallback-image="${fallbackImage}"
              alt="${name}"
              loading="lazy"
            >
          </div>

          <div class="shop-cart-item-info">
            <h3>${name}</h3>
            <p>${category}</p>
            <p class="shop-cart-unit-price">${formatPrice(product.price)} each</p>
            <p>Quantity: ${item.quantity}</p>
          </div>

          <div class="shop-cart-item-actions">
            <strong class="shop-cart-item-total">${formatPrice(subtotal)}</strong>

            <button
              class="shop-remove-button"
              type="button"
              data-remove-from-cart="${product.id}"
              aria-label="Remove ${name} from cart"
            >
              Remove
            </button>
          </div>
        </article>
      `;
    }).join("");
  }

  /* =====================================================
     11. TOAST MESSAGES
  ===================================================== */

  function showToast(message) {
    let toast = document.getElementById("shopToast");

    if (!toast) {
      toast = document.createElement("div");
      toast.id = "shopToast";
      toast.className = "shop-toast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");

      Object.assign(toast.style, {
        position: "fixed",
        right: "20px",
        bottom: "20px",
        zIndex: "99999",
        maxWidth: "min(360px, calc(100vw - 32px))",
        padding: "14px 18px",
        borderRadius: "10px",
        color: "#ffffff",
        background: "#101d3a",
        boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
        fontSize: "13px",
        fontWeight: "700",
        lineHeight: "1.6",
        opacity: "0",
        transform: "translateY(8px)",
        transition: "opacity 0.2s ease, transform 0.2s ease"
      });

      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";

    window.clearTimeout(toastTimer);

    toastTimer = window.setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(8px)";
    }, 2600);
  }

  /* =====================================================
     12. ADD TO CART
  ===================================================== */

  function addToCart(productId) {
    const product = getProductById(productId);

    if (!product) {
      showToast("Product not found.");
      return;
    }

    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      if (existingItem.quantity >= 99) {
        showToast("Maximum quantity reached for this product.");
        return;
      }

      existingItem.quantity += 1;
    } else {
      cart.push({ id: product.id, quantity: 1 });
    }

    if (!saveCart()) return;

    renderCart();
    showToast(`${product.name} added to cart.`);
  }

  /* =====================================================
     13. REMOVE FROM CART
  ===================================================== */

  function removeFromCart(productId) {
    const product = getProductById(productId);

    cart = cart.filter((item) => item.id !== Number(productId));

    saveCart();
    renderCart();

    if (product) {
      showToast(`${product.name} removed from cart.`);
    }
  }

  /* =====================================================
     14. CLEAR CART
  ===================================================== */

  function clearCart() {
    if (cart.length === 0) {
      showToast("Your cart is already empty.");
      return;
    }

    cart = [];
    saveCart();
    renderCart();

    showToast("Your cart has been cleared.");
  }

  /* =====================================================
     15. CHECKOUT
     Demo checkout only; no payment is processed.
  ===================================================== */

  function checkout() {
    if (cart.length === 0) {
      showToast("Your cart is empty.");
      return;
    }

    let session = null;

    try {
      session = JSON.parse(
        sessionStorage.getItem(SESSION_KEY) || "null"
      );
    } catch (error) {
      console.warn("Unable to read login session.", error);
    }

    if (
      !session ||
      typeof session.email !== "string" ||
      !session.email.trim()
    ) {
      try {
        sessionStorage.setItem(
          "autocare_return_after_login",
          "shop.html#shoppingCart"
        );
      } catch (error) {
        console.warn("Unable to save return location.", error);
      }

      window.location.href = "login.html";
      return;
    }

    const items = cart.map((item) => {
      const product = getProductById(item.id);

      return {
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        quantity: item.quantity,
        image: product.image,
        fallbackImage: product.fallbackImage,
        subtotal: product.price * item.quantity
      };
    });

    const total = items.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );

    const order = {
      orderId: `AC-${Date.now()}`,
      userEmail: session.email.trim().toLowerCase(),
      userName: session.name || session.email.split("@")[0],
      date: new Date().toISOString(),
      items,
      total,
      status: "Processing"
    };

    const orders = readJSON(ORDERS_STORAGE_KEY, []);

    if (!Array.isArray(orders)) {
      showToast("Unable to read previous orders. Please try again.");
      return;
    }

    orders.unshift(order);

    try {
      localStorage.setItem(
        ORDERS_STORAGE_KEY,
        JSON.stringify(orders)
      );

      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error("Unable to save the order.", error);
      showToast("Order could not be saved. Please try again.");
      return;
    }

    cart = [];

    showToast("Order placed successfully!");

    window.setTimeout(() => {
      window.location.href = "dashboard.html#recentOrdersSection";
    }, 500);
  }

  /* =====================================================
     16. SEARCH EVENTS
  ===================================================== */

  searchInput?.addEventListener("input", () => {
    searchTerm = searchInput.value.trim();
    renderProducts();
  });

  searchForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    searchTerm = searchInput ? searchInput.value.trim() : "";
    renderProducts();
  });

  /* =====================================================
     17. CATEGORY FILTER EVENTS
  ===================================================== */

  categoriesContainer?.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;

    const button = event.target.closest("[data-category]");

    if (!button || !categoriesContainer.contains(button)) return;

    selectedCategory = button.dataset.category || "all";
    renderProducts();
  });

  /* =====================================================
     18. SORT EVENTS
  ===================================================== */

  sortSelect?.addEventListener("change", () => {
    selectedSort = sortSelect.value || "featured";
    renderProducts();
  });

  /* =====================================================
     19. CLEAR FILTERS
  ===================================================== */

  function clearFilters() {
    selectedCategory = "all";
    searchTerm = "";
    selectedSort = "featured";

    if (searchInput) searchInput.value = "";
    if (sortSelect) sortSelect.value = "featured";

    renderProducts();
  }

  clearCategoryButton?.addEventListener("click", clearFilters);
  resetFiltersButton?.addEventListener("click", clearFilters);

  /* =====================================================
     20. PRODUCT GRID EVENTS
  ===================================================== */

  productsGrid?.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;

    const button = event.target.closest("[data-add-to-cart]");

    if (!button || !productsGrid.contains(button)) return;

    addToCart(Number(button.dataset.addToCart));
  });

  productsGrid?.addEventListener("error", (event) => {
    const image = event.target;

    if (
      image instanceof HTMLImageElement &&
      image.classList.contains("shop-product-image")
    ) {
      handleProductImageError(image);
    }
  }, true);

  /* =====================================================
     21. CART EVENTS
  ===================================================== */

  cartItemsContainer?.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;

    const button = event.target.closest("[data-remove-from-cart]");

    if (!button) return;

    removeFromCart(Number(button.dataset.removeFromCart));
  });

  cartItemsContainer?.addEventListener("error", (event) => {
    const image = event.target;

    if (
      image instanceof HTMLImageElement &&
      image.classList.contains("shop-cart-product-image")
    ) {
      image.hidden = true;
    }
  }, true);

  clearCartButton?.addEventListener("click", clearCart);

  /* =====================================================
     22. INITIALIZE SHOP
  ===================================================== */

  renderProducts();
  renderCart();

  console.info("STACKLY AUTO CARE shop initialized.");
});

