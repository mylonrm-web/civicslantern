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

function initHeroWaveCanvas() {
  const heroes = document.querySelectorAll(".hero");
  if (!heroes.length) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const heroLayers = [];

  heroes.forEach((hero, index) => {
    if (hero.querySelector(".hero-wave-canvas")) return;

    const canvas = document.createElement("canvas");
    canvas.className = "hero-wave-canvas";
    canvas.setAttribute("aria-hidden", "true");
    hero.prepend(canvas);

    const context = canvas.getContext("2d");
    if (!context) return;

    heroLayers.push({
      canvas,
      context,
      hero,
      height: 0,
      phase: index * 1.7,
      ratio: 1,
      width: 0,
    });
  });

  if (!heroLayers.length) return;

  function resizeLayer(layer) {
    const bounds = layer.hero.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(bounds.width));
    const height = Math.max(1, Math.round(bounds.height));

    if (layer.width === width && layer.height === height && layer.ratio === ratio) {
      return;
    }

    layer.width = width;
    layer.height = height;
    layer.ratio = ratio;
    layer.canvas.width = Math.round(width * ratio);
    layer.canvas.height = Math.round(height * ratio);
    layer.context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function drawShape(context, fill, buildPath) {
    context.beginPath();
    buildPath();
    context.closePath();
    context.fillStyle = fill;
    context.fill();
  }

  function drawLayer(layer, timestamp) {
    resizeLayer(layer);

    const { context, width, height, phase } = layer;
    const time = timestamp * 0.000075 + phase;
    const driftA = Math.sin(time) * 28;
    const driftB = Math.cos(time * 0.72 + 0.8) * 24;
    const driftC = Math.sin(time * 0.58 + 2.2) * 34;
    const lift = Math.sin(time * 0.44 + 1.6) * 14;

    context.fillStyle = "#6c7895";
    context.fillRect(0, 0, width, height);

    drawShape(context, "#98a2b6", () => {
      context.moveTo(-0.15 * width + driftA, -0.12 * height);
      context.bezierCurveTo(
        0.02 * width + driftB,
        0.03 * height,
        0.14 * width + driftA,
        0.10 * height + lift,
        0.19 * width + driftC,
        0.29 * height
      );
      context.bezierCurveTo(
        0.27 * width + driftB,
        0.56 * height,
        0.14 * width + driftA,
        0.71 * height,
        0.04 * width + driftC,
        1.08 * height
      );
      context.lineTo(-0.18 * width, 1.08 * height);
      context.lineTo(-0.18 * width, -0.12 * height);
    });

    drawShape(context, "#7f8ba5", () => {
      context.moveTo(0.17 * width + driftB, -0.14 * height);
      context.bezierCurveTo(
        0.30 * width + driftC,
        0.06 * height,
        0.38 * width + driftA,
        0.20 * height,
        0.34 * width + driftB,
        0.42 * height + lift
      );
      context.bezierCurveTo(
        0.31 * width + driftC,
        0.60 * height,
        0.25 * width + driftA,
        0.72 * height,
        0.28 * width + driftB,
        1.08 * height
      );
      context.lineTo(0.45 * width + driftC, 1.08 * height);
      context.bezierCurveTo(
        0.51 * width + driftA,
        0.72 * height,
        0.48 * width + driftB,
        0.45 * height,
        0.42 * width + driftC,
        0.22 * height
      );
      context.bezierCurveTo(
        0.37 * width + driftA,
        0.04 * height,
        0.29 * width + driftB,
        -0.06 * height,
        0.27 * width + driftC,
        -0.14 * height
      );
    });

    drawShape(context, "#5f6e90", () => {
      context.moveTo(0.47 * width + driftC, -0.14 * height);
      context.bezierCurveTo(
        0.52 * width + driftA,
        0.06 * height,
        0.55 * width + driftB,
        0.26 * height,
        0.59 * width + driftC,
        0.48 * height
      );
      context.bezierCurveTo(
        0.64 * width + driftA,
        0.72 * height,
        0.68 * width + driftB,
        0.88 * height,
        0.70 * width + driftC,
        1.10 * height
      );
      context.lineTo(0.86 * width + driftB, 1.10 * height);
      context.bezierCurveTo(
        0.80 * width + driftA,
        0.72 * height,
        0.72 * width + driftC,
        0.48 * height,
        0.67 * width + driftB,
        0.20 * height
      );
      context.bezierCurveTo(
        0.64 * width + driftA,
        0.04 * height,
        0.58 * width + driftC,
        -0.06 * height,
        0.56 * width + driftB,
        -0.14 * height
      );
    });

    drawShape(context, "#8b96ad", () => {
      context.moveTo(0.71 * width + driftA, 0.23 * height + lift);
      context.bezierCurveTo(
        0.77 * width + driftC,
        0.10 * height,
        0.90 * width + driftB,
        0.06 * height,
        1.12 * width + driftA,
        -0.03 * height
      );
      context.lineTo(1.12 * width, 1.10 * height);
      context.lineTo(0.88 * width + driftC, 1.10 * height);
      context.bezierCurveTo(
        0.89 * width + driftB,
        0.82 * height,
        0.80 * width + driftA,
        0.64 * height,
        0.84 * width + driftC,
        0.48 * height
      );
      context.bezierCurveTo(
        0.87 * width + driftB,
        0.36 * height,
        0.94 * width + driftA,
        0.31 * height,
        1.12 * width + driftC,
        0.20 * height
      );
      context.lineTo(1.12 * width, -0.03 * height);
    });

    drawShape(context, "#9fa8ba", () => {
      context.moveTo(0.92 * width + driftB, 0.40 * height);
      context.bezierCurveTo(
        1.01 * width + driftA,
        0.29 * height,
        1.10 * width + driftC,
        0.25 * height,
        1.18 * width,
        0.20 * height + lift
      );
      context.lineTo(1.18 * width, 1.10 * height);
      context.lineTo(0.99 * width + driftA,
        1.10 * height
      );
      context.bezierCurveTo(
        1.02 * width + driftC,
        0.82 * height,
        0.96 * width + driftB,
        0.66 * height,
        0.94 * width + driftA,
        0.53 * height
      );
      context.bezierCurveTo(
        0.92 * width + driftC,
        0.48 * height,
        0.90 * width + driftA,
        0.44 * height,
        0.92 * width + driftB,
        0.40 * height
      );
    });
  }

  function renderHeroWaves(timestamp) {
    heroLayers.forEach((layer) => drawLayer(layer, timestamp));

    if (!prefersReducedMotion.matches) {
      window.requestAnimationFrame(renderHeroWaves);
    }
  }

  window.addEventListener("resize", () => {
    heroLayers.forEach((layer) => {
      layer.width = 0;
      drawLayer(layer, performance.now());
    });
  });

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(() => {
      heroLayers.forEach((layer) => {
        layer.width = 0;
        drawLayer(layer, performance.now());
      });
    });

    heroLayers.forEach((layer) => observer.observe(layer.hero));
  }

  renderHeroWaves(performance.now());
}

initHeroWaveCanvas();
