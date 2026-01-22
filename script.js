/* --------------------------------
   Emarath Global Private Limited
   script.js
---------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  const body = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");
  const backToTop = document.getElementById("backToTop");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
  const storedTheme = localStorage.getItem("theme");

  // ----- Theme Handling -----
  function setTheme(theme) {
    body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    updateIcon(theme);
  }

  function updateIcon(theme) {
    themeToggle.innerHTML =
      theme === "dark"
        ? "☀️"
        : "🌙";
  }

  // Initialize Theme
  if (storedTheme) {
    setTheme(storedTheme);
  } else {
    setTheme(prefersDark.matches ? "dark" : "light");
  }

  // Toggle Theme
  themeToggle.addEventListener("click", () => {
    const current = body.getAttribute("data-theme");
    setTheme(current === "dark" ? "light" : "dark");
  });

  // ----- Reveal on Scroll -----
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!prefersReducedMotion) {
    const reveals = document.querySelectorAll(".section, .card, .step, blockquote");
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    reveals.forEach(el => {
      el.classList.add("reveal");
      observer.observe(el);
    });
  }

  // ----- Back to Top -----
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTop.style.display = "block";
    } else {
      backToTop.style.display = "none";
    }
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });

  // ----- Footer Year -----
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});
