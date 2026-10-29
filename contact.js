
/* =========================================================
   STACKLY AUTO CARE — CONTACT PAGE
   Form validation, character counter, FAQ and smooth scrolling.

   Demo only: this form does not send data to a backend.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");

  if (!contactForm) return;

  const contactName = document.getElementById("contactName");
  const contactEmail = document.getElementById("contactEmail");
  const contactPhone = document.getElementById("contactPhone");
  const contactSubject = document.getElementById("contactSubject");
  const contactVehicle = document.getElementById("contactVehicle");
  const contactMessage = document.getElementById("contactMessage");
  const contactConsent = document.getElementById("contactConsent");

  const characterCount = document.getElementById("contactCharacterCount");
  const submitButton = document.getElementById("contactSubmitButton");
  const formStatus = document.getElementById("contactFormStatus");

  const errorElements = {
    contactName: document.getElementById("contactNameError"),
    contactEmail: document.getElementById("contactEmailError"),
    contactPhone: document.getElementById("contactPhoneError"),
    contactSubject: document.getElementById("contactSubjectError"),
    contactMessage: document.getElementById("contactMessageError"),
    contactConsent: document.getElementById("contactConsentError"),
  };

  const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function showFieldError(field, message) {
    if (!field) return;

    const errorElement = errorElements[field.id];

    if (errorElement) errorElement.textContent = message;

    field.setAttribute("aria-invalid", "true");
  }

  function clearFieldError(field) {
    if (!field) return;

    const errorElement = errorElements[field.id];

    if (errorElement) errorElement.textContent = "";

    field.removeAttribute("aria-invalid");
  }

  function clearFormStatus() {
    if (!formStatus) return;

    formStatus.textContent = "";
    formStatus.classList.remove("success", "error");
  }

  function updateCharacterCount() {
    if (!contactMessage || !characterCount) return;

    const length = contactMessage.value.length;
    const maximum = Number(contactMessage.maxLength) || 1500;

    characterCount.textContent = String(length);
    characterCount.style.color = length >= maximum ? "#dc2626" : "";
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidPhone(phone) {
    if (!phone) return true;

    if (!/^[+\d\s().-]+$/.test(phone)) return false;

    const digits = phone.replace(/\D/g, "");

    return digits.length >= 7 && digits.length <= 15;
  }

  function validateName() {
    const value = contactName.value.trim();

    if (!value) {
      showFieldError(contactName, "Please enter your full name.");
      return false;
    }

    if (value.length < 2) {
      showFieldError(contactName, "Name must contain at least 2 characters.");
      return false;
    }

    if (value.length > 80) {
      showFieldError(contactName, "Name must not exceed 80 characters.");
      return false;
    }

    clearFieldError(contactName);
    return true;
  }

  function validateEmail() {
    const value = contactEmail.value.trim();

    if (!value) {
      showFieldError(contactEmail, "Please enter your email address.");
      return false;
    }

    if (!isValidEmail(value)) {
      showFieldError(contactEmail, "Please enter a valid email address.");
      return false;
    }

    clearFieldError(contactEmail);
    return true;
  }

  function validatePhone() {
    const value = contactPhone.value.trim();

    if (!isValidPhone(value)) {
      showFieldError(
        contactPhone,
        "Enter a valid phone number containing 7–15 digits."
      );
      return false;
    }

    clearFieldError(contactPhone);
    return true;
  }

  function validateSubject() {
    if (!contactSubject.value) {
      showFieldError(contactSubject, "Please choose an enquiry type.");
      return false;
    }

    clearFieldError(contactSubject);
    return true;
  }

  function validateMessage() {
    const value = contactMessage.value.trim();

    if (!value) {
      showFieldError(contactMessage, "Please enter your message.");
      return false;
    }

    if (value.length < 10) {
      showFieldError(contactMessage, "Please enter at least 10 characters.");
      return false;
    }

    if (contactMessage.value.length > 1500) {
      showFieldError(
        contactMessage,
        "Your message must not exceed 1500 characters."
      );
      return false;
    }

    clearFieldError(contactMessage);
    return true;
  }

  function validateConsent() {
    if (!contactConsent.checked) {
      showFieldError(
        contactConsent,
        "Please confirm the information before continuing."
      );
      return false;
    }

    clearFieldError(contactConsent);
    return true;
  }

  const liveFields = [
    [contactName, validateName],
    [contactEmail, validateEmail],
    [contactPhone, validatePhone],
    [contactSubject, validateSubject],
  ];

  liveFields.forEach(([field, validate]) => {
    if (!field) return;

    function handleChange() {
      if (field.getAttribute("aria-invalid") === "true") {
        validate();
      }

      clearFormStatus();
    }

    field.addEventListener("input", handleChange);
    field.addEventListener("change", handleChange);
  });

  contactMessage.addEventListener("input", () => {
    updateCharacterCount();

    if (contactMessage.getAttribute("aria-invalid") === "true") {
      validateMessage();
    }

    clearFormStatus();
  });

  contactConsent.addEventListener("change", () => {
    if (contactConsent.getAttribute("aria-invalid") === "true") {
      validateConsent();
    }

    clearFormStatus();
  });

  updateCharacterCount();

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearFormStatus();

    const isValid = [
      validateName(),
      validateEmail(),
      validatePhone(),
      validateSubject(),
      validateMessage(),
      validateConsent(),
    ].every(Boolean);

    if (!isValid) {
      if (formStatus) {
        formStatus.textContent =
          "Please review the highlighted fields and try again.";
        formStatus.classList.add("error");
      }

      const firstInvalid = contactForm.querySelector('[aria-invalid="true"]');

      if (firstInvalid) {
        firstInvalid.focus();

        firstInvalid.scrollIntoView({
          behavior: prefersReducedMotion() ? "auto" : "smooth",
          block: "center",
        });
      }

      return;
    }

    /*
      Frontend demo only.
      Connect a backend endpoint before accepting real enquiries.
    */
    const enquiryDetails = {
      name: contactName.value.trim(),
      email: contactEmail.value.trim(),
      phone: contactPhone.value.trim(),
      subject: contactSubject.value,
      vehicle: contactVehicle.value.trim(),
      message: contactMessage.value.trim(),
    };

    if (!enquiryDetails.name || !enquiryDetails.email) return;

    if (formStatus) {
      formStatus.textContent =
        "Your form passed validation! This is a demo form, so your message has not been sent. Connect a backend to receive real enquiries.";
      formStatus.classList.add("success");
    }

    contactForm.reset();
    updateCharacterCount();

    Object.values(errorElements).forEach((errorElement) => {
      if (errorElement) errorElement.textContent = "";
    });

    contactForm.querySelectorAll("[aria-invalid]").forEach((field) => {
      field.removeAttribute("aria-invalid");
    });

    if (submitButton) submitButton.blur();
  });

  /* FAQ accordion: keep only one item open at a time. */
  const faqItems = document.querySelectorAll(".contact-faq-item");

  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;

      faqItems.forEach((otherItem) => {
        if (otherItem !== item && otherItem.open) {
          otherItem.open = false;
        }
      });
    });
  });

  /* Smooth scroll for in-page links. */
  document.querySelectorAll('.contact-page a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start",
      });
    });
  });
});

