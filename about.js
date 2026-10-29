/* =========================================================
AUTO-CARE — ABOUT PAGE INTERACTIONS
FAQ accordion + smooth anchor navigation
Shared navigation, preloader and reveal handled by common.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
/* ---------------------------------
ABOUT PAGE FAQ ACCORDION
--------------------------------- */

const faqItems = document.querySelectorAll(".about-faq-item");

faqItems.forEach((item) => {
const summary = item.querySelector("summary");


if (!summary) return;

summary.addEventListener("click", (event) => {
  // Allow the browser to toggle the clicked FAQ naturally.
  // Close other FAQ items after the current item opens.
  if (!item.open) {
    faqItems.forEach((otherItem) => {
      if (otherItem !== item) {
        otherItem.open = false;
      }
    });
  }
});


});

/* ---------------------------------
ABOUT PAGE INTERNAL ANCHOR LINKS
--------------------------------- */

const internalLinks = document.querySelectorAll(
'.about-page a[href^="#"]'
);

internalLinks.forEach((link) => {
link.addEventListener("click", (event) => {
const targetId = link.getAttribute("href");


  if (!targetId || targetId === "#") return;

  const targetElement = document.querySelector(targetId);

  if (!targetElement) return;

  event.preventDefault();

  targetElement.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth",
    block: "start",
  });

  if (window.history && window.history.replaceState) {
    window.history.replaceState(null, "", targetId);
  }
});


});
});
