const navToggle = document.querySelector(".nav-toggle");
const primaryNav = document.querySelector(".primary-nav");
const navLinks = Array.from(document.querySelectorAll(".nav-link"));
const sections = Array.from(document.querySelectorAll("main section[id]"));
const revealElements = document.querySelectorAll(".reveal");
const year = document.querySelector("#year");
const siteHeader = document.querySelector(".site-header");

// Keep footer year current automatically.
if (year) {
  year.textContent = new Date().getFullYear();
}

// Handle mobile navigation expand/collapse.
if (navToggle && primaryNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = primaryNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

// Add subtle header state while scrolling for better visual feedback.
window.addEventListener("scroll", () => {
  if (!siteHeader) return;
  const elevated = window.scrollY > 16;
  siteHeader.classList.toggle("scrolled", elevated);
});

// Close mobile menu after selecting a link.
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (primaryNav?.classList.contains("open")) {
      primaryNav.classList.remove("open");
      navToggle?.setAttribute("aria-expanded", "false");
    }
  });
});

// Highlight active section link while scrolling.
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const currentId = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          const active = link.getAttribute("href") === `#${currentId}`;
          link.classList.toggle("active", active);
        });
      });
    },
    {
      threshold: 0.45,
      rootMargin: "-20% 0px -40% 0px",
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

// Reveal elements once when they come into view.
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  revealElements.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index * 40, 260)}ms`;
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => element.classList.add("in-view"));
}

const form = document.getElementById("contactForm");
const msg = document.getElementById("formMessage");

form.addEventListener("submit", async function (e) {
  e.preventDefault(); // stop redirect

  const formData = new FormData(form);

  const response = await fetch(form.action, {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
    },
  });

  if (response.ok) {
    msg.style.display = "block"; // show message
    form.reset(); // clear form
  } else {
    alert("Something went wrong. Please try again.");
  }
});
