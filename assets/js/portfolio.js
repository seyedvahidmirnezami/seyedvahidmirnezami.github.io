(() => {
  "use strict";

  const ME = "Seyed Vahid Mirnezami";
  const LQ = "https://latentquest.ai/";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (sel) => document.querySelector(sel);
  const root = document.documentElement;

  /* ---------- Theme ---------- */
  $("#theme-toggle").addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  /* ---------- Nav border on scroll ---------- */
  const nav = $(".nav");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  $("#year").textContent = new Date().getFullYear();

  /* ---------- Live course list from LatentQuest ---------- */
  // site.js from latentquest.github.io sets window.SITE. If it didn't load,
  // the static course card in the HTML stays as a fallback.
  const site = window.SITE;
  if (site && Array.isArray(site.courses)) {
    const mine = site.courses.filter((c) => !c.instructors || c.instructors.includes(ME));
    if (mine.length) {
      const abs = (path) => (/^https?:/.test(path) ? path : LQ + path);
      $("#teach-courses").innerHTML = mine.map((c) => `
        <article class="teach-card reveal">
          ${c.image ? `<img class="teach-card__img" src="${abs(c.image)}" alt="" loading="lazy">` : ""}
          <div class="teach-card__body">
            <p class="course-card__status course-card__status--${c.status}">${c.status === "soon" ? "Coming soon" : "Available now"}</p>
            <h3>${c.title}</h3>
            <p class="course-card__tagline">${c.tagline}</p>
            <div class="course-card__actions">
              ${c.status === "soon"
                ? `<a class="btn btn--ghost btn--sm" href="${LQ}" target="_blank" rel="noopener">Learn more</a>`
                : `<a class="btn btn--primary btn--sm" href="${c.url}" target="_blank" rel="noopener">Enroll on Udemy</a>
                   <a class="btn btn--ghost btn--sm" href="${LQ}" target="_blank" rel="noopener">Course details</a>
                   <a class="btn btn--ghost btn--sm" href="${LQ}coupon/?course=${encodeURIComponent(c.slug)}" target="_blank" rel="noopener">Get a coupon</a>`}
            </div>
          </div>
        </article>`).join("");
    }
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reducedMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Hero canvas: drifting attention grid ---------- */
  const canvas = $("#attention-canvas");
  const ctx = canvas.getContext("2d");
  const cssVar = (name) => getComputedStyle(root).getPropertyValue(name).trim();
  let W = 0, H = 0, cols = 0, rows = 0;
  const CELL = 34, GAP = 6;
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(W / (CELL + GAP)) + 1;
    rows = Math.ceil(H / (CELL + GAP)) + 1;
  };
  const draw = (t) => {
    ctx.clearRect(0, 0, W, H);
    const cyan = cssVar("--cyan"), amber = cssVar("--amber");
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const diag = Math.exp(-Math.pow((j - i * (cols / rows) - Math.sin(t / 2600 + i / 4) * 2.2), 2) / 6);
        const wave = 0.5 + 0.5 * Math.sin(t / 1900 + i * 0.7 + j * 0.45);
        const w = Math.min(1, diag * 0.9 + wave * 0.12);
        if (w < 0.06) continue;
        ctx.globalAlpha = w * 0.85;
        ctx.fillStyle = w > 0.62 ? amber : cyan;
        const x = j * (CELL + GAP), y = i * (CELL + GAP);
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(x, y, CELL, CELL, 7) : ctx.rect(x, y, CELL, CELL);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  };
  let raf = 0;
  const loop = (t) => { draw(t); raf = requestAnimationFrame(loop); };
  resize();
  window.addEventListener("resize", () => { resize(); if (reducedMotion) draw(0); });
  if (reducedMotion) {
    draw(0);
  } else {
    new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      if (e.isIntersecting) raf = requestAnimationFrame(loop);
    }).observe(canvas);
  }
})();
