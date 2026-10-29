/* =========================================================
   STACKLY AUTO CARE — CUSTOMER DASHBOARD
   Authentication, Vehicle Management, Notifications,
   Search, Persistent Shop Orders and Order Deletion.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =====================================================
     1. AUTHENTICATION + USER PROFILE
  ===================================================== */

  const SESSION_KEY = "autocare_demo_session";
  const VEHICLE_STORAGE_KEY = "autocare_vehicle";
  const ORDERS_STORAGE_KEY = "autocare_shop_orders";

  let currentSession = null;

  try {
    currentSession = JSON.parse(
      sessionStorage.getItem(SESSION_KEY) || "null"
    );
  } catch (error) {
    console.warn("Unable to read login session.", error);
  }

  if (
    !currentSession ||
    typeof currentSession.email !== "string" ||
    !currentSession.email.trim()
  ) {
    window.location.replace("login.html");
    return;
  }

  const currentUserEmail = currentSession.email.trim().toLowerCase();

  const dashboardUserName = document.getElementById("dashboardUserName");
  const dashboardAvatar = document.getElementById("dashboardAvatar");

  const loggedInName =
    typeof currentSession.name === "string" &&
    currentSession.name.trim()
      ? currentSession.name.trim()
      : currentSession.email.split("@")[0];

  if (dashboardUserName) {
    dashboardUserName.textContent = loggedInName;
  }

  if (dashboardAvatar) {
    const initials = loggedInName
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");

    dashboardAvatar.textContent = initials || "AC";

    dashboardAvatar.setAttribute(
      "aria-label",
      `${loggedInName}'s profile`
    );
  }

  const toolbarUserName = document.getElementById(
    "dashboardToolbarUserName"
  );

  if (toolbarUserName) {
    toolbarUserName.textContent = loggedInName;
  }

  /* =====================================================
     2. LOGOUT
  ===================================================== */

  const logoutLink =
    document.getElementById("dashboardLogoutLink") ||
    document.querySelector('.dashboard-side-link[href="login.html"]');

  if (logoutLink) {
    const logoutLabel = logoutLink.querySelector("span:last-child");

    if (logoutLabel) {
      logoutLabel.textContent = "Log Out";
    }

    logoutLink.href = "login.html";

    logoutLink.setAttribute(
      "aria-label",
      "Log out of your account"
    );

    logoutLink.addEventListener("click", (event) => {
      event.preventDefault();

      try {
        sessionStorage.removeItem(SESSION_KEY);
      } catch (error) {
        console.error("Unable to clear login session.", error);
      }

      window.location.replace("login.html");
    });
  }

  /* =====================================================
     3. ELEMENT REFERENCES
  ===================================================== */

  const dashboardSearch = document.getElementById("dashboardSearch");

  const notificationButton = document.getElementById(
    "notificationButton"
  );

  const notificationModal = document.getElementById(
    "notificationModal"
  );

  const closeNotificationModal = document.getElementById(
    "closeNotificationModal"
  );

  const dismissNotificationButton = document.getElementById(
    "dismissNotificationButton"
  );

  const vehicleModal = document.getElementById("vehicleModal");
  const addVehicleButton = document.getElementById("addVehicleButton");
  const editVehicleButton = document.getElementById("editVehicleButton");
  const closeVehicleModal = document.getElementById("closeVehicleModal");
  const cancelVehicleModal = document.getElementById("cancelVehicleModal");

  const vehicleForm = document.getElementById("vehicleForm");
  const vehicleModalTitle = document.getElementById("vehicleModalTitle");

  const inputVehicleName = document.getElementById("inputVehicleName");
  const inputVehicleMake = document.getElementById("inputVehicleMake");

  const inputVehicleRegistration = document.getElementById(
    "inputVehicleRegistration"
  );

  const inputVehicleLastService = document.getElementById(
    "inputVehicleLastService"
  );

  const vehicleName = document.getElementById("vehicleName");
  const vehicleDetails = document.getElementById("vehicleDetails");
  const vehicleRegistration = document.getElementById("vehicleRegistration");
  const vehicleLastService = document.getElementById("vehicleLastService");

  const recentOrdersBody = document.getElementById("recentOrdersBody");

  const sidebarLinks = document.querySelectorAll(
    ".dashboard-side-link"
  );

  /* =====================================================
     4. TOAST MESSAGE
  ===================================================== */

  function showMessage(message, type = "success") {
    let messageBox = document.getElementById("dashboardMessage");

    if (!messageBox) {
      messageBox = document.createElement("div");

      messageBox.id = "dashboardMessage";
      messageBox.className = "dashboard-message";

      messageBox.setAttribute("role", "status");
      messageBox.setAttribute("aria-live", "polite");

      Object.assign(messageBox.style, {
        position: "fixed",
        right: "20px",
        bottom: "20px",
        zIndex: "2000",
        maxWidth: "min(380px, calc(100vw - 40px))",
        padding: "14px 18px",
        borderRadius: "12px",
        color: "#ffffff",
        fontSize: "14px",
        fontWeight: "600",
        lineHeight: "1.5",
        boxShadow: "0 12px 30px rgba(15, 23, 42, 0.18)",
        opacity: "0",
        transform: "translateY(10px)",
        transition: "opacity 180ms ease, transform 180ms ease"
      });

      document.body.appendChild(messageBox);
    }

    messageBox.textContent = message;

    messageBox.style.background =
      type === "error" ? "#b91c1c" : "#0f766e";

    messageBox.style.opacity = "1";
    messageBox.style.transform = "translateY(0)";

    window.clearTimeout(showMessage.timeoutId);

    showMessage.timeoutId = window.setTimeout(() => {
      messageBox.style.opacity = "0";
      messageBox.style.transform = "translateY(10px)";
    }, 3200);
  }

  /* =====================================================
     5. VEHICLE STORAGE
  ===================================================== */

  function readVehicle() {
    try {
      const storedVehicle = localStorage.getItem(VEHICLE_STORAGE_KEY);

      if (!storedVehicle) return null;

      const vehicle = JSON.parse(storedVehicle);

      if (
        !vehicle ||
        typeof vehicle !== "object" ||
        Array.isArray(vehicle) ||
        typeof vehicle.name !== "string" ||
        typeof vehicle.make !== "string"
      ) {
        return null;
      }

      return vehicle;
    } catch (error) {
      console.warn("Unable to read vehicle information.", error);
      return null;
    }
  }

  function saveVehicle(vehicle) {
    try {
      localStorage.setItem(
        VEHICLE_STORAGE_KEY,
        JSON.stringify(vehicle)
      );

      return true;
    } catch (error) {
      console.error("Unable to save vehicle information.", error);

      showMessage(
        "Vehicle details could not be saved. Check browser storage.",
        "error"
      );

      return false;
    }
  }

  function formatDate(dateString) {
    if (!dateString) return "Not provided";

    const date = new Date(`${dateString}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return "Not provided";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }

  function updateVehicleDisplay(vehicle) {
    if (!vehicle) {
      if (vehicleName) {
        vehicleName.textContent = "Add your vehicle";
      }

      if (vehicleDetails) {
        vehicleDetails.textContent =
          "Add your vehicle details to personalise your dashboard.";
      }

      if (vehicleRegistration) {
        vehicleRegistration.textContent = "Not provided";
      }

      if (vehicleLastService) {
        vehicleLastService.textContent = "Not provided";
      }

      return;
    }

    if (vehicleName) {
      vehicleName.textContent = vehicle.name;
    }

    if (vehicleDetails) {
      vehicleDetails.textContent = vehicle.make;
    }

    if (vehicleRegistration) {
      vehicleRegistration.textContent =
        vehicle.registration || "Not provided";
    }

    if (vehicleLastService) {
      vehicleLastService.textContent = formatDate(vehicle.lastService);
    }
  }

  /* =====================================================
     6. VEHICLE MODAL
  ===================================================== */

  function openVehicleModal(mode = "add") {
    if (!vehicleModal || !vehicleForm) {
      showMessage(
        "Vehicle form is unavailable on this page.",
        "error"
      );

      return;
    }

    const savedVehicle = readVehicle();

    vehicleForm.reset();

    if (mode === "edit" && savedVehicle) {
      if (inputVehicleName) {
        inputVehicleName.value = savedVehicle.name || "";
      }

      if (inputVehicleMake) {
        inputVehicleMake.value = savedVehicle.make || "";
      }

      if (inputVehicleRegistration) {
        inputVehicleRegistration.value =
          savedVehicle.registration || "";
      }

      if (inputVehicleLastService) {
        inputVehicleLastService.value =
          savedVehicle.lastService || "";
      }

      if (vehicleModalTitle) {
        vehicleModalTitle.textContent = "Edit Vehicle";
      }
    } else if (vehicleModalTitle) {
      vehicleModalTitle.textContent = "Add Your Vehicle";
    }

    if (typeof vehicleModal.showModal === "function") {
      if (!vehicleModal.open) {
        vehicleModal.showModal();
      }
    } else {
      vehicleModal.setAttribute("open", "");
    }

    window.setTimeout(() => inputVehicleName?.focus(), 50);
  }

  function closeDialog(dialog) {
    if (!dialog) return;

    if (typeof dialog.close === "function" && dialog.open) {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
    }
  }

  addVehicleButton?.addEventListener("click", () => {
    openVehicleModal("add");
  });

  editVehicleButton?.addEventListener("click", () => {
    openVehicleModal(readVehicle() ? "edit" : "add");
  });

  closeVehicleModal?.addEventListener("click", () => {
    closeDialog(vehicleModal);
  });

  cancelVehicleModal?.addEventListener("click", () => {
    closeDialog(vehicleModal);
  });

  vehicleForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = inputVehicleName?.value.trim() || "";
    const make = inputVehicleMake?.value.trim() || "";

    const registration =
      inputVehicleRegistration?.value.trim().toUpperCase() || "";

    const lastService = inputVehicleLastService?.value || "";

    if (!name || !make) {
      showMessage(
        "Please enter the vehicle name and make.",
        "error"
      );

      return;
    }

    const vehicle = {
      name,
      make,
      registration,
      lastService
    };

    if (!saveVehicle(vehicle)) return;

    updateVehicleDisplay(vehicle);
    closeDialog(vehicleModal);

    showMessage("Vehicle details saved successfully.");
  });

  /* =====================================================
     7. NOTIFICATIONS MODAL
  ===================================================== */

  notificationButton?.addEventListener("click", () => {
    if (!notificationModal) {
      showMessage(
        "Notifications are unavailable right now.",
        "error"
      );

      return;
    }

    if (typeof notificationModal.showModal === "function") {
      if (!notificationModal.open) {
        notificationModal.showModal();
      }
    } else {
      notificationModal.setAttribute("open", "");
    }
  });

  closeNotificationModal?.addEventListener("click", () => {
    closeDialog(notificationModal);
  });

  dismissNotificationButton?.addEventListener("click", () => {
    closeDialog(notificationModal);
  });

  [vehicleModal, notificationModal].forEach((dialog) => {
    dialog?.addEventListener("click", (event) => {
      if (event.target === dialog) {
        closeDialog(dialog);
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    if (vehicleModal?.open) {
      closeDialog(vehicleModal);
    }

    if (notificationModal?.open) {
      closeDialog(notificationModal);
    }
  });

  /* =====================================================
     8. ORDERS STORAGE AND FORMATTING
  ===================================================== */

  function readOrders() {
    try {
      const savedOrders = JSON.parse(
        localStorage.getItem(ORDERS_STORAGE_KEY) || "[]"
      );

      if (!Array.isArray(savedOrders)) {
        return [];
      }

      return savedOrders.filter((order) => (
        order &&
        typeof order.orderId === "string" &&
        typeof order.userEmail === "string" &&
        order.userEmail.trim().toLowerCase() === currentUserEmail &&
        Array.isArray(order.items)
      ));
    } catch (error) {
      console.warn("Unable to read saved orders.", error);
      return [];
    }
  }

  /*
    Read all saved orders for safe updates.

    This is important because multiple users' orders may
    exist in the same localStorage array. Deleting one of
    the current user's orders must not delete other users'
    orders.
  */
  function readAllStoredOrders() {
    try {
      const savedOrders = JSON.parse(
        localStorage.getItem(ORDERS_STORAGE_KEY) || "[]"
      );

      return Array.isArray(savedOrders) ? savedOrders : null;
    } catch (error) {
      console.error("Unable to read the orders storage.", error);
      return null;
    }
  }

  function formatOrderDate(dateString) {
    if (!dateString) return "—";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }

  function formatPrice(price) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(Number(price) || 0);
  }

  function createElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) {
      element.className = className;
    }

    if (text !== undefined) {
      element.textContent = text;
    }

    return element;
  }

  /* =====================================================
     9. DELETE A SPECIFIC ORDER
  ===================================================== */

  function deleteSpecificOrder(orderId) {
    if (!orderId) {
      showMessage("Unable to identify this order.", "error");
      return;
    }

    const orders = readOrders();

    const selectedOrder = orders.find(
      (order) => order.orderId === orderId
    );

    if (!selectedOrder) {
      showMessage(
        "This order was not found in your account.",
        "error"
      );

      return;
    }

    const itemCount = selectedOrder.items.length;

    const itemDescription =
      itemCount === 1
        ? "1 product"
        : `${itemCount} products`;

    const confirmed = window.confirm(
      `Delete order #${orderId}?\n\n` +
      `This order contains ${itemDescription}.\n\n` +
      "This action cannot be undone."
    );

    if (!confirmed) return;

    const allStoredOrders = readAllStoredOrders();

    if (!allStoredOrders) {
      showMessage(
        "Unable to update orders. Please try again.",
        "error"
      );

      return;
    }

    /*
      Remove only the selected order belonging to the
      currently logged-in user.

      Other orders and other users' orders remain intact.
    */
    const updatedOrders = allStoredOrders.filter((order) => {
      if (
        !order ||
        typeof order.orderId !== "string" ||
        typeof order.userEmail !== "string"
      ) {
        return true;
      }

      const belongsToCurrentUser =
        order.userEmail.trim().toLowerCase() === currentUserEmail;

      const isSelectedOrder = order.orderId === orderId;

      return !(belongsToCurrentUser && isSelectedOrder);
    });

    try {
      localStorage.setItem(
        ORDERS_STORAGE_KEY,
        JSON.stringify(updatedOrders)
      );
    } catch (error) {
      console.error("Unable to save the updated orders.", error);

      showMessage(
        "The order could not be deleted. Check browser storage.",
        "error"
      );

      return;
    }

    /*
      Force the table to show its empty state if the last
      order has been deleted. Existing sample HTML rows
      should not reappear after a real order is deleted.
    */
    renderOrders(true);

    showMessage(`Order #${orderId} deleted successfully.`);
  }

  /* =====================================================
     10. PRODUCT IMAGE WITH FALLBACK
  ===================================================== */

  function configureOrderImage(image, item) {
    const primaryImage =
      typeof item.image === "string"
        ? item.image.trim()
        : "";

    /*
      Use the product's existing fallbackImage first.
      The generic local image is for older saved orders
      that may not contain fallbackImage.
    */
    const fallbackImage =
      typeof item.fallbackImage === "string" &&
      item.fallbackImage.trim()
        ? item.fallbackImage.trim()
        : "assets/shop/car parts.webp";

    image.className = "dashboard-order-product-image";
    image.alt = item.name
      ? `${item.name} product image`
      : "Automotive product image";

    image.loading = "lazy";
    image.decoding = "async";

    image.dataset.fallbackAttempted = "false";

    image.addEventListener("error", () => {
      if (image.dataset.fallbackAttempted !== "true") {
        image.dataset.fallbackAttempted = "true";

        if (fallbackImage) {
          image.src = fallbackImage;
          return;
        }
      }

      image.hidden = true;
    });

    /*
      Avoid setting an empty src because an empty image
      source may cause the browser to request the page URL.
    */
    if (primaryImage) {
      image.src = primaryImage;
    } else {
      image.dataset.fallbackAttempted = "true";
      image.src = fallbackImage;
    }
  }

  /* =====================================================
     11. RENDER CHECKOUT ORDERS
  ===================================================== */

  function renderOrders(forceEmptyState = false) {
    if (!recentOrdersBody) return;

    const orders = readOrders();

    if (orders.length === 0) {
      updateOrderCounts(0);

      /*
        On the first page load, retain the existing example
        rows if the account has no real orders.

        After a real order has been deleted, clear the table
        and display the proper empty state instead.
      */
      if (forceEmptyState) {
        recentOrdersBody.replaceChildren();
        filterOrders();
      }

      return;
    }

    recentOrdersBody.replaceChildren();

    orders.forEach((order) => {
      const orderItems = order.items;

      orderItems.forEach((item, itemIndex) => {
        const row = document.createElement("tr");

        row.dataset.orderId = order.orderId;

        /* -----------------------------------------------
           ORDER ID + DELETE BUTTON
        ------------------------------------------------ */

        const orderIdCell = document.createElement("td");

        const orderId = createElement(
          "span",
          "dashboard-order-id",
          `#${order.orderId}`
        );

        orderIdCell.appendChild(orderId);

        /*
          Show one Delete button per order rather than
          repeating the button for every product in it.
        */
        if (itemIndex === 0) {
          const deleteButton = createElement(
            "button",
            "dashboard-delete-order",
            "Delete"
          );

          deleteButton.type = "button";

          deleteButton.setAttribute(
            "aria-label",
            `Delete order ${order.orderId}`
          );

          deleteButton.title = "Delete this entire order";

          /*
            Inline styling keeps the feature usable without
            requiring changes to dashboard.css.
          */
          Object.assign(deleteButton.style, {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
            marginTop: "7px",
            padding: "6px 10px",
            border: "1px solid #fecaca",
            borderRadius: "7px",
            background: "#fff1f2",
            color: "#b91c1c",
            fontFamily: "inherit",
            fontSize: "12px",
            fontWeight: "700",
            lineHeight: "1.3",
            cursor: "pointer",
            transition: "background 160ms ease, color 160ms ease"
          });

          deleteButton.addEventListener("mouseenter", () => {
            deleteButton.style.background = "#b91c1c";
            deleteButton.style.color = "#ffffff";
          });

          deleteButton.addEventListener("mouseleave", () => {
            deleteButton.style.background = "#fff1f2";
            deleteButton.style.color = "#b91c1c";
          });

          deleteButton.addEventListener("click", () => {
            deleteSpecificOrder(order.orderId);
          });

          orderIdCell.appendChild(deleteButton);
        }

        row.appendChild(orderIdCell);

        /* -----------------------------------------------
           PRODUCT IMAGE + DETAILS
        ------------------------------------------------ */

        const productCell = document.createElement("td");

        const productWrapper = createElement(
          "div",
          "dashboard-order-product"
        );

        const image = document.createElement("img");

        configureOrderImage(image, item);

        const productInfo = document.createElement("div");

        productInfo.appendChild(
          createElement(
            "strong",
            "",
            item.name || "Spare Part"
          )
        );

        productInfo.appendChild(
          createElement(
            "span",
            "",
            `${item.category || "Automotive Parts"} · Qty: ${
              Number(item.quantity) || 1
            }`
          )
        );

        productWrapper.append(image, productInfo);

        productCell.appendChild(productWrapper);

        row.appendChild(productCell);

        /* -----------------------------------------------
           ORDER DATE
        ------------------------------------------------ */

        const dateCell = document.createElement("td");

        dateCell.textContent =
          itemIndex === 0
            ? formatOrderDate(order.date)
            : "—";

        row.appendChild(dateCell);

        /* -----------------------------------------------
           AMOUNT
        ------------------------------------------------ */

        const amountCell = document.createElement("td");

        amountCell.textContent = formatPrice(
          Number(item.price || 0) *
          Number(item.quantity || 1)
        );

        row.appendChild(amountCell);

        /* -----------------------------------------------
           ORDER STATUS
        ------------------------------------------------ */

        const statusCell = document.createElement("td");

        const statusText = String(
          order.status || "Processing"
        );

        const statusClass = statusText
          .toLowerCase()
          .replace(/\s+/g, "-");

        const statusBadge = createElement(
          "span",
          `dashboard-order-status status-${statusClass}`,
          statusText
        );

        statusCell.appendChild(statusBadge);

        row.appendChild(statusCell);

        recentOrdersBody.appendChild(row);
      });
    });

    updateOrderCounts(orders.length);

    filterOrders();
  }

  /* =====================================================
     12. UPDATE ORDER STATISTICS
  ===================================================== */

  function updateOrderCounts(orderCount) {
    const orderCountElement = document.getElementById("orderCount");

    const orderStatValue = document.getElementById(
      "orderStatValue"
    );

    if (orderCountElement) {
      orderCountElement.textContent = String(orderCount);
    }

    if (orderStatValue) {
      orderStatValue.textContent = String(orderCount);
    }
  }

  /* =====================================================
     13. SEARCH ORDERS
  ===================================================== */

  function filterOrders() {
    if (!dashboardSearch || !recentOrdersBody) return;

    const query = dashboardSearch.value.trim().toLowerCase();

    const rows = Array.from(
      recentOrdersBody.querySelectorAll("tr")
    ).filter((row) => row.dataset.emptyState !== "true");

    let visibleCount = 0;

    rows.forEach((row) => {
      const matches = row.textContent
        .toLowerCase()
        .includes(query);

      row.hidden = !matches;

      if (matches) {
        visibleCount += 1;
      }
    });

    recentOrdersBody.querySelector(
      "[data-empty-state='true']"
    )?.remove();

    if (visibleCount === 0) {
      const emptyRow = document.createElement("tr");

      emptyRow.dataset.emptyState = "true";

      const cell = document.createElement("td");

      const headerRow = recentOrdersBody
        .closest("table")
        ?.querySelector("thead tr");

      cell.colSpan = headerRow
        ? Math.max(1, headerRow.querySelectorAll("th").length)
        : 5;

      cell.textContent = query
        ? "No orders match your search."
        : "No orders are available yet.";

      Object.assign(cell.style, {
        textAlign: "center",
        padding: "28px 16px",
        color: "#64748b"
      });

      emptyRow.appendChild(cell);

      recentOrdersBody.appendChild(emptyRow);
    }
  }

  dashboardSearch?.addEventListener("input", filterOrders);

  dashboardSearch?.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      dashboardSearch.value = "";

      filterOrders();

      dashboardSearch.blur();
    }
  });

  /* =====================================================
     14. SIDEBAR ACTIVE LINK
  ===================================================== */

  sidebarLinks.forEach((link) => {
    link.addEventListener("click", () => {
      sidebarLinks.forEach((item) => {
        item.classList.remove("active");
        item.removeAttribute("aria-current");
      });

      link.classList.add("active");

      link.setAttribute("aria-current", "page");
    });
  });

  /* =====================================================
     15. INITIALIZE DASHBOARD
  ===================================================== */

  function initialiseDashboard() {
    updateVehicleDisplay(readVehicle());

    renderOrders();
  }

  initialiseDashboard();

  console.info("STACKLY AUTO CARE dashboard initialized.");
});