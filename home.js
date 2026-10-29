
/* =========================================================
   AUTO-CARE — HOMEPAGE INTERACTIONS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* =====================================================
     1. HERO CONTENT ENTRANCE
  ===================================================== */

  const heroContent = document.querySelector(".home-hero-content");

  if (heroContent && !prefersReducedMotion) {
    heroContent.classList.add("home-hero-animate");
  }

  /* =====================================================
     2. SERVICE CARD STAGGER
  ===================================================== */

  const serviceCards = document.querySelectorAll(".home-service-card");

  serviceCards.forEach((card, index) => {
    card.style.setProperty("--card-index", index);

    card.addEventListener("mouseenter", () => {
      card.classList.add("is-hovered");
    });

    card.addEventListener("mouseleave", () => {
      card.classList.remove("is-hovered");
    });
  });

  /* =====================================================
     3. PART CATEGORY INTERACTION
  ===================================================== */

  document.querySelectorAll(".home-part-category").forEach((category) => {
    category.addEventListener("focusin", () => {
      category.classList.add("is-focused");
    });

    category.addEventListener("focusout", () => {
      category.classList.remove("is-focused");
    });
  });

  /* =====================================================
     4. SMOOTH INTERNAL SECTION NAVIGATION
  ===================================================== */

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start"
      });
    });
  });

  /* =====================================================
     5. ACCESSIBLE IMAGE FALLBACK
     Keep the card layout if an external image fails.
  ===================================================== */

  const imageElements = document.querySelectorAll(
    ".home-service-image, .home-about-image"
  );

  imageElements.forEach((element) => {
    const backgroundImage = window.getComputedStyle(element).backgroundImage;

    const imageMatch = backgroundImage.match(/url\(["']?(.*?)["']?\)/);

    if (!imageMatch || !imageMatch[1]) return;

    const image = new Image();

    image.onload = () => {
      element.classList.add("image-loaded");
      element.classList.remove("image-failed");
    };

    image.onerror = () => {
      element.classList.add("image-failed");
    };

    image.src = imageMatch[1];
  });

  /* =====================================================
     6. CTA BUTTON FEEDBACK
  ===================================================== */

  document.querySelectorAll(".home-cta .btn").forEach((button) => {
    button.addEventListener("pointerdown", () => {
      button.classList.add("button-pressed");
    });

    ["pointerup", "pointercancel", "pointerleave"].forEach((eventName) => {
      button.addEventListener(eventName, () => {
        button.classList.remove("button-pressed");
      });
    });
  });

});

