const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelector(".nav-links");

if (menuButton && navLinks) {
  menuButton.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });
}

const revealItems = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.14,
    rootMargin: "0px 0px -40px 0px",
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

const progressBar = document.querySelector("#scroll-progress");

function updateProgressBar() {
  if (!progressBar) return;

  const scrollTop = window.scrollY;
  const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;

  progressBar.style.width = `${progress}%`;
}

window.addEventListener("scroll", updateProgressBar);
updateProgressBar();


// Mobile navigation overlap fix
(() => {
  const button = document.querySelector(".menu-button");
  const links = document.querySelector(".nav-links");

  if (!button || !links) return;

  const syncMenuState = () => {
    const isOpen =
      links.classList.contains("open") ||
      links.classList.contains("active") ||
      button.getAttribute("aria-expanded") === "true";

    document.body.classList.toggle("menu-open", isOpen);
  };

  button.addEventListener("click", () => {
    window.setTimeout(syncMenuState, 0);
  });

  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("menu-open");
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      document.body.classList.remove("menu-open");
    } else {
      syncMenuState();
    }
  });
})();
