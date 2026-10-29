
/* =========================================================
   STACKLY AUTO CARE — SERVICES PAGE INTERACTIONS
   Service filtering, enquiry form and FAQ interactions.
   Demo only: no server submission or appointment booking.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =====================================================
     ELEMENTS
  ===================================================== */

  const serviceFilters = document.getElementById("serviceFilters");
  const serviceCards = document.querySelectorAll(".service-card");
  const servicesNoResults = document.getElementById("servicesNoResults");

  const enquiryForm = document.getElementById("servicesEnquiryForm");
  const serviceSelect = document.getElementById("requestedService");
  const formStatus = document.getElementById("servicesFormStatus");

  const customerName = document.getElementById("serviceCustomerName");
  const customerEmail = document.getElementById("serviceCustomerEmail");
  const customerPhone = document.getElementById("serviceCustomerPhone");
  const customerMessage = document.getElementById("serviceCustomerMessage");

  const faqItems = document.querySelectorAll(".services-faq-item");

  /* =====================================================
     SERVICE CATEGORY FILTER
  ===================================================== */

  function filterServices(category) {
    let visibleCount = 0;

    serviceCards.forEach((card) => {
      const cardCategory = card.dataset.serviceType || "";
      const matches = category === "all" || cardCategory === category;

      card.hidden = !matches;

      if (matches) {
        visibleCount += 1;
      }
    });

    if (servicesNoResults) {
      servicesNoResults.hidden = visibleCount > 0;
    }
  }

  serviceFilters?.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const button = target.closest("[data-service-filter]");

    if (!button || !serviceFilters.contains(button)) {
      return;
    }

    const category = button.dataset.serviceFilter || "all";

    serviceFilters.querySelectorAll("[data-service-filter]").forEach((item) => {
      const isActive = item === button;

      item.classList.toggle("active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    filterServices(category);
  });

  /* =====================================================
     SERVICE CARD → ENQUIRY FORM
  ===================================================== */

  function selectRequestedService(serviceName) {
    if (!serviceSelect) {
      return;
    }

    const matchingOption = Array.from(serviceSelect.options).find(
      (option) => option.value === serviceName
    );

    serviceSelect.value = matchingOption
      ? matchingOption.value
      : "Other Enquiry";

    clearFormStatus();
  }

  document.querySelectorAll("[data-service-select]").forEach((link) => {
    link.addEventListener("click", () => {
      const serviceName = link.dataset.serviceSelect;

      if (serviceName) {
        selectRequestedService(serviceName);
      }
    });
  });

  /* =====================================================
     FORM STATUS
  ===================================================== */

  function setFormStatus(message, isError = false) {
    if (!formStatus) {
      return;
    }

    formStatus.textContent = message;
    formStatus.classList.toggle("error", isError);
    formStatus.classList.toggle("success", !isError && message !== "");
    formStatus.classList.toggle("is-visible", message !== "");
  }

  function clearFormStatus() {
    if (!formStatus) {
      return;
    }

    formStatus.textContent = "";
    formStatus.classList.remove("error", "success", "is-visible");
  }

  enquiryForm?.addEventListener("input", clearFormStatus);
  enquiryForm?.addEventListener("change", clearFormStatus);

  /* =====================================================
     PHONE VALIDATION
     Allows digits and common formatting characters.
     Requires 7–15 digits and rejects letters.
  ===================================================== */

  function isValidPhone(phone) {
    const trimmedPhone = phone.trim();

    if (!/^[0-9+\s()-]+$/.test(trimmedPhone)) {
      return false;
    }

    const digits = trimmedPhone.replace(/\D/g, "");

    return digits.length >= 7 && digits.length <= 15;
  }

  /* =====================================================
     ENQUIRY FORM SUBMISSION
     Demo only — no server submission.
  ===================================================== */

  enquiryForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    clearFormStatus();

    if (!enquiryForm.checkValidity()) {
      enquiryForm.reportValidity();

      setFormStatus(
        "Please check the form fields and enter valid details.",
        true
      );

      return;
    }

    const name = customerName?.value.trim() || "";
    const email = customerEmail?.value.trim() || "";
    const phone = customerPhone?.value.trim() || "";
    const service = serviceSelect?.value || "";
    const message = customerMessage?.value.trim() || "";

    /* NAME VALIDATION */

    if (name.length < 2) {
      setFormStatus(
        "Please enter a name with at least 2 characters.",
        true
      );

      customerName?.focus();
      return;
    }

    /* EMAIL VALIDATION */

    if (!customerEmail || !customerEmail.validity.valid) {
      setFormStatus(
        "Please enter a valid email address.",
        true
      );

      customerEmail?.focus();
      return;
    }

    /* PHONE VALIDATION */

    if (!isValidPhone(phone)) {
      setFormStatus(
        "Please enter a valid phone number using 7 to 15 digits. Letters are not allowed.",
        true
      );

      customerPhone?.focus();
      return;
    }

    /* SERVICE VALIDATION */

    if (!service) {
      setFormStatus(
        "Please choose the service you need.",
        true
      );

      serviceSelect?.focus();
      return;
    }

    /* MESSAGE VALIDATION */

    if (message.length < 5) {
      setFormStatus(
        "Please describe your service needs in a little more detail.",
        true
      );

      customerMessage?.focus();
      return;
    }

    const enquiry = {
      name,
      email,
      phone,
      service,
      message
    };

    /* CONFIRMATION DIALOG */

    const reviewText = [
      "Please review your service enquiry:",
      "",
      `Name: ${enquiry.name}`,
      `Email: ${enquiry.email}`,
      `Phone: ${enquiry.phone}`,
      `Service: ${enquiry.service}`,
      "",
      `Message: ${enquiry.message}`,
      "",
      "This is a demo form. No data will be sent."
    ].join("\n");

    const confirmed = window.confirm(reviewText);

    if (!confirmed) {
      setFormStatus(
        "Your details are still in the form. You can review or edit them."
      );

      return;
    }

    /* =================================================
       CLEAR FORM AFTER CONFIRMATION
       Reset fields only after the user confirms.
    ================================================= */

    enquiryForm.reset();

    // Display success AFTER reset so the status remains visible.
    setFormStatus(
      "Your enquiry form has been validated successfully. This is a demo, so your details have not been sent or saved."
    );

    /* SUBMIT BUTTON FEEDBACK */

    const submitButton = enquiryForm.querySelector(
      'button[type="submit"]'
    );

    if (submitButton) {
      const originalText = submitButton.textContent;

      submitButton.disabled = true;
      submitButton.textContent = "Validated ✓";

      window.setTimeout(() => {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }, 1800);
    }
  });

  /* =====================================================
     FAQ ACCORDION
     Keep one FAQ open at a time.
  ===================================================== */

  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) {
        return;
      }

      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.open = false;
        }
      });
    });
  });

  /* =====================================================
     INITIALISE
  ===================================================== */

  filterServices("all");

  console.info("Stackly Auto Care services page initialised.");
});

