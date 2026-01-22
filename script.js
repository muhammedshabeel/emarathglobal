(() => {
  const root = document.documentElement;
  root.classList.remove("no-js");

  // ===== Theme (persisted)
  const THEME_KEY = "emarath_theme";
  const themeToggle = document.querySelector(".theme-toggle");

  function setTheme(mode) {
    if (mode === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem(THEME_KEY, mode);
  }

  const saved = localStorage.getItem(THEME_KEY);
  if (saved) setTheme(saved);
  else {
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  }

  themeToggle?.addEventListener("click", () => {
    const next = root.classList.contains("dark") ? "light" : "dark";
    setTheme(next);
  });

  // ===== Mobile nav
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.getElementById("navMenu");

  navToggle?.addEventListener("click", () => {
    const open = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });

  // Close menu on link click (mobile)
  navMenu?.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    navMenu.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });

  // ===== Smooth scroll with sticky header offset
  const headerH = () => {
    const h = getComputedStyle(document.documentElement).getPropertyValue("--header-h");
    const n = parseInt(h, 10);
    return Number.isFinite(n) ? n : 72;
  };

  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;

    const id = a.getAttribute("href");
    if (!id || id === "#") return;

    const target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - (headerH() + 14);
    window.scrollTo({ top, behavior: "smooth" });
  });

  // ===== Scrollspy (active nav)
  const links = Array.from(document.querySelectorAll(".nav-link"))
    .filter((l) => l.getAttribute("href")?.startsWith("#"));

  const sections = links
    .map((l) => document.querySelector(l.getAttribute("href")))
    .filter(Boolean);

  function scrollSpy() {
    const y = window.scrollY + headerH() + 80;
    let current = null;

    for (const s of sections) {
      if (s.offsetTop <= y) current = s;
    }

    links.forEach((l) => l.classList.remove("is-active"));
    if (current) {
      const active = links.find((l) => l.getAttribute("href") === `#${current.id}`);
      active?.classList.add("is-active");
    }
  }
  window.addEventListener("scroll", scrollSpy, { passive: true });
  scrollSpy();

  // ===== Portfolio filter
  const filterBtns = Array.from(document.querySelectorAll(".filter-btn"));
  const projects = Array.from(document.querySelectorAll(".project"));

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      const f = btn.dataset.filter;
      projects.forEach((p) => {
        const match = f === "all" || p.dataset.industry === f;
        p.style.display = match ? "" : "none";
      });
    });
  });

  // ===== FAQ: keep it tidy (optional single-open)
  const qas = Array.from(document.querySelectorAll(".qa"));
  qas.forEach((d) => {
    d.addEventListener("toggle", () => {
      if (!d.open) return;
      qas.forEach((other) => {
        if (other !== d) other.open = false;
      });
    });
  });

  // ===== Contact form validation (mock submit)
  const form = document.getElementById("contactForm");
  const state = form?.querySelector(".form-state");

  function setError(name, msg) {
    const el = form?.querySelector(`[data-error-for="${name}"]`);
    if (el) el.textContent = msg || "";
  }

  function validateEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());
  }

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    state.textContent = "";

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    let ok = true;

    setError("name", "");
    setError("email", "");
    setError("message", "");

    if (!name) { setError("name", "Please enter your name."); ok = false; }
    if (!email || !validateEmail(email)) { setError("email", "Please enter a valid email."); ok = false; }
    if (!message || message.length < 10) { setError("message", "Please write a brief message (10+ characters)."); ok = false; }

    if (!ok) return;

    // Mock submit
    state.textContent = "Sending…";
    await new Promise((r) => setTimeout(r, 650));

    state.textContent = "Message sent. We’ll get back to you shortly.";
    form.reset();
  });

  // ===== Scroll reveal animations (IntersectionObserver)
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduceMotion && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-inview");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll("[data-animate]").forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll("[data-animate]").forEach((el) => el.classList.add("is-inview"));
  }

  // ===== Back to top
  const backTop = document.querySelector(".back-top");
  backTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  // ===== Year
  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());

  // ===== Analytics stub (CTA clicks)
  document.querySelectorAll(".js-cta").forEach((el) => {
    el.addEventListener("click", () => {
      const ev = el.getAttribute("data-event") || "cta_click";
      console.log("[analytics]", ev, { href: el.getAttribute("href") || null });
    });
  });
})();
