/* -----------------------------------
   Emarath Global v3 - script.js
   Dynamic, animated, WeWork-inspired
----------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");
  const backToTop = document.getElementById("backToTop");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
  const storedTheme = localStorage.getItem("theme");

  /* ---------- Theme Handling ---------- */
  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    updateThemeIcon(theme);
  }

  function updateThemeIcon(theme) {
    themeToggle.innerHTML = theme === "dark" ? "☀️" : "🌙";
  }

  // Initialize theme
  if (storedTheme) {
    setTheme(storedTheme);
  } else {
    setTheme(prefersDark.matches ? "dark" : "light");
  }

  // Toggle on click
  themeToggle.addEventListener("click", () => {
    const current = root.getAttribute("data-theme");
    setTheme(current === "dark" ? "light" : "dark");
  });

  /* ---------- Reveal Animations ---------- */
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!prefersReducedMotion) {
    const revealEls = document.querySelectorAll(".reveal, .reveal-delay");

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const elements = entry.target.querySelectorAll
            ? entry.target.querySelectorAll(".reveal, .reveal-delay")
            : [entry.target];
          let delay = 0;
          elements.forEach(el => {
            setTimeout(() => el.classList.add("visible"), delay);
            delay += 120; // stagger timing
          });
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(el => observer.observe(el));
  }

  /* ---------- Back to Top Button ---------- */
  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      backToTop.style.display = "block";
    } else {
      backToTop.style.display = "none";
    }
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });

  /* ---------- Animated Gradient Sync ---------- */
  const sections = document.querySelectorAll(".gradient-shift");
  const colors = [
    "linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)",
    "linear-gradient(135deg, #F5F6F7 0%, #FFF 100%)",
    "linear-gradient(135deg, #f9f9f9 0%, #ececec 100%)",
    "linear-gradient(135deg, #fff 0%, #f9f9f9 100%)",
  ];

  window.addEventListener("scroll", () => {
    let scrollPos = window.scrollY + window.innerHeight / 2;
    sections.forEach((section, i) => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (scrollPos >= top && scrollPos < bottom) {
        section.style.background = colors[i % colors.length];
      }
    });
  });

  /* ---------- Footer Year ---------- */
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});
