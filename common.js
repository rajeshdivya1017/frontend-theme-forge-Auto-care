/* =========================================================
   AUTO-CARE — COMMON JAVASCRIPT
   Navigation | Preloader | Scroll Reveal | Back To Top
   Footer Email Form | All Pages
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const body = document.body;
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector("#navLinks");
  const preloader = document.querySelector(".preloader");
  const backToTop = document.querySelector(".back-to-top");

  /* =====================================================
     1. CURRENT YEAR
  ===================================================== */

  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  /* =====================================================
     2. ACTIVE NAVIGATION LINK
  ===================================================== */

  function updateActiveLink() {
    const currentPage =
      window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".nav-link").forEach((link) => {
      const href = link.getAttribute("href");

      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        return;
      }

      const linkPage = href.split("/").pop().split("?")[0];
      const isActive = linkPage === currentPage;

      link.classList.toggle("active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  updateActiveLink();

  /* =====================================================
     3. MOBILE NAVIGATION
  ===================================================== */

  function closeMobileMenu() {
    if (!menuToggle || !navLinks) return;

    menuToggle.classList.remove("active");
    navLinks.classList.remove("open");
    body.classList.remove("menu-open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  }

  if (menuToggle && navLinks) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");

    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");

      menuToggle.classList.toggle("active", isOpen);
      body.classList.toggle("menu-open", isOpen);

      menuToggle.setAttribute("aria-expanded", String(isOpen));

      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
      );
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("click", (event) => {
      if (
        navLinks.classList.contains("open") &&
        !navLinks.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMobileMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 850) {
        closeMobileMenu();
      }
    });
  }

  /* =====================================================
     4. HEADER SCROLL EFFECT
  ===================================================== */

  function updateHeader() {
    if (!header) return;

    header.classList.toggle("scrolled", window.scrollY > 25);
  }

  updateHeader();

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });

  /* =====================================================
     5. COMMON PRELOADER
     Works on pages containing .preloader.
     Preserves the existing preloader HTML and animation.
  ===================================================== */

  if (preloader) {
    const minimumDisplayTime = 450;
    const startTime = performance.now();
    let loaderHidden = false;

    function hidePreloader() {
      if (loaderHidden) return;

      loaderHidden = true;

      const elapsed = performance.now() - startTime;
      const remaining = Math.max(
        0,
        minimumDisplayTime - elapsed
      );

      window.setTimeout(() => {
        preloader.classList.add("hidden");
        body.classList.remove("is-loading");

        window.setTimeout(() => {
          if (preloader.isConnected) {
            preloader.style.display = "none";
          }
        }, 500);
      }, remaining);
    }

    body.classList.add("is-loading");

    if (document.readyState === "complete") {
      hidePreloader();
    } else {
      window.addEventListener("load", hidePreloader, {
        once: true
      });

      // Safety fallback for slow-loading resources.
      window.setTimeout(hidePreloader, 2200);
    }
  }

  /* =====================================================
     6. SCROLL REVEAL ANIMATIONS
  ===================================================== */

  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  /* =====================================================
     7. BACK TO TOP
  ===================================================== */

  function updateBackToTop() {
    if (!backToTop) return;

    backToTop.classList.toggle(
      "visible",
      window.scrollY > 400
    );
  }

  if (backToTop) {
    updateBackToTop();

    window.addEventListener("scroll", updateBackToTop, {
      passive: true
    });

    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
          ? "auto"
          : "smooth"
      });
    });
  }
    /* =====================================================
     8. PREVENT EMPTY PLACEHOLDER LINKS FROM JUMPING
  ===================================================== */

  document.querySelectorAll('a[href="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
    });
  });

 
/* =========================================================
   9. FOOTER EMAIL FORM — TOAST NOTIFICATION
========================================================= */

const footerEmailForm = document.getElementById("footerEmailForm");
const footerEmailInput = document.getElementById("footerEmail");
const footerEmailFeedback = document.getElementById("footerEmailFeedback");

if (footerEmailForm && footerEmailInput) {
  let footerEmailToastTimer;

  function showFooterEmailToast(message, type = "success") {
    let toast = document.getElementById("footerEmailToast");

    if (!toast) {
      toast = document.createElement("div");
      toast.id = "footerEmailToast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");

      Object.assign(toast.style, {
        position: "fixed",
        right: "24px",
        bottom: "24px",
        zIndex: "999999",
        maxWidth: "min(360px, calc(100vw - 32px))",
        padding: "14px 20px",
        borderRadius: "12px",
        color: "#ffffff",
        background: "#142b24",
        border: "1px solid rgba(134, 239, 172, 0.3)",
        borderLeft: "4px solid #22c55e",
        boxShadow: "0 12px 35px rgba(0, 0, 0, 0.22)",
        fontSize: "13px",
        lineHeight: "1.5",
        opacity: "0",
        visibility: "hidden",
        transform: "translateY(12px)",
        transition: "opacity .25s ease, transform .25s ease, visibility .25s ease",
        pointerEvents: "none"
      });

      document.body.appendChild(toast);
    }

    clearTimeout(footerEmailToastTimer);

    toast.textContent = message;
    toast.style.background = type === "error" ? "#351b20" : "#142b24";
    toast.style.borderLeftColor = type === "error" ? "#ef4444" : "#22c55e";
    toast.style.borderColor = type === "error"
      ? "rgba(252, 165, 165, .35)"
      : "rgba(134, 239, 172, .3)";

    // Show the toast
    toast.style.visibility = "visible";
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";

    footerEmailToastTimer = window.setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(12px)";

      window.setTimeout(() => {
        toast.style.visibility = "hidden";
      }, 250);
    }, 3500);
  }

  footerEmailForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = footerEmailInput.value.trim();

    if (!email || !footerEmailInput.checkValidity()) {
      showFooterEmailToast(
        "Please enter a valid email address.",
        "error"
      );
      footerEmailInput.focus();
      return;
    }

    showFooterEmailToast(
      "Our team will reach you soon!",
      "success"
    );

    footerEmailForm.reset();

    if (footerEmailFeedback) {
      footerEmailFeedback.textContent = "";
      footerEmailFeedback.className = "footer-email-feedback";
    }
  });
}




  /* =====================================================
     10. CLOSE MENU AND HANDLE BROWSER BACK/FORWARD
  ===================================================== */

  window.addEventListener("pageshow", (event) => {
    closeMobileMenu();

    const navigationEntry = performance.getEntriesByType("navigation")[0];
    const isBackForward =
      event.persisted || navigationEntry?.type === "back_forward";

    if (preloader && isBackForward) {
      preloader.classList.add("hidden");
      preloader.style.display = "none";
      body.classList.remove("is-loading");
    }

    updateActiveLink();
    updateHeader();
    updateBackToTop();
  });

});