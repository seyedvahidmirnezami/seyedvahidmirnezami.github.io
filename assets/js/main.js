(() => {
  "use strict";

  const COURSE_URL = "https://www.udemy.com/course/master-transformers-from-scratch-bert-vit-ai-search/";
  const GH_USER = "seyedvahidmirnezami";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (sel, root = document) => root.querySelector(sel);

  /* ---------- Theme ---------- */
  const root = document.documentElement;
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

  /* ---------- Linear algebra for the demo ---------- */
  const matmul = (A, B) => A.map((row) => B[0].map((_, j) => row.reduce((s, a, k) => s + a * B[k][j], 0)));
  const transpose = (A) => A[0].map((_, j) => A.map((row) => row[j]));
  const softmaxRows = (S) => S.map((row) => {
    const m = Math.max(...row);
    const e = row.map((v) => Math.exp(v - m));
    const sum = e.reduce((a, b) => a + b, 0);
    return e.map((v) => v / sum);
  });

  // The "bank of river" example from Sessions 2 and 3 of the course.
  const WORDS = ["bank", "of", "river"];
  const X = [[1, 0, 1, 0], [0, 1, 0, 1], [1, 1, 0, 0]];
  const W_Q = [[1, 0, 1], [0, 1, 0], [0, 0, 1], [1, 1, 0]];
  const W_K = [[0, 1, 1], [1, 0, 0], [1, 0, 1], [0, 1, 0]];
  const W_V = [[1, 0, 0], [0, 0, 1], [0, 1, 0], [1, 0, 1]];

  const raw = (() => {
    const A = softmaxRows(matmul(X, transpose(X)));
    return { A, Y: matmul(A, X), V: X };
  })();
  const qkv = (() => {
    const Q = matmul(X, W_Q), K = matmul(X, W_K), V = matmul(X, W_V);
    const d = K[0].length;
    const S = matmul(Q, transpose(K)).map((r) => r.map((v) => v / Math.sqrt(d)));
    const A = softmaxRows(S);
    return { A, Y: matmul(A, V), V };
  })();

  const fmt = (v) => (Math.abs(v) < 0.0005 ? "0.000" : v.toFixed(3));
  const cssVar = (name) => getComputedStyle(root).getPropertyValue(name).trim();

  // Interpolate between the low-cell color and cyan/amber by weight.
  const cellStyle = (w) => {
    const t = Math.min(1, Math.max(0, w));
    const hot = t > 0.5 ? "var(--amber)" : "var(--cyan)";
    const pct = Math.round(18 + t * 82);
    const ink = t > 0.45 ? "#04121a" : "var(--text)";
    return `background: color-mix(in srgb, ${hot} ${pct}%, var(--cell-low)); color: ${ink};`;
  };

  /* ---------- Hero mini matrix ---------- */
  const mini = $("#mini-matrix");
  const renderMini = (A) => {
    mini.innerHTML = '<span></span>' + WORDS.map((w) => `<span class="mm-head">${w}</span>`).join("") +
      A.map((row, i) => `<span class="mm-row">${WORDS[i]}</span>` +
        row.map((v) => `<span class="mm-cell" style="${cellStyle(v)}">${v.toFixed(2)}</span>`).join("")).join("");
  };
  renderMini(raw.A);
  if (!reducedMotion) {
    let flip = false;
    setInterval(() => { flip = !flip; renderMini(flip ? qkv.A : raw.A); }, 3200);
  }

  /* ---------- Interactive demo ---------- */
  const state = { mode: "raw", query: 0 };
  const wordsEl = $("#demo-words");
  wordsEl.innerHTML = WORDS.map((w, i) =>
    `<button type="button" class="word" role="radio" aria-checked="${i === 0}" data-i="${i}">${w}</button>`).join("");

  const renderDemo = () => {
    const data = state.mode === "raw" ? raw : qkv;
    const row = data.A[state.query];
    $("#demo-query").textContent = WORDS[state.query];
    $("#demo-hint").textContent = state.mode === "raw"
      ? "Session 2: attention with no learned weights."
      : "Session 3: learnable query, key and value matrices, scaled by √3.";

    wordsEl.querySelectorAll(".word").forEach((b) => b.setAttribute("aria-checked", String(+b.dataset.i === state.query)));

    $("#demo-bars").innerHTML = row.map((w, j) => `
      <div class="bar">
        <span class="bar__label">${WORDS[j]}</span>
        <span class="bar__track"><span class="bar__fill" style="width:${(w * 100).toFixed(1)}%"></span></span>
        <span class="bar__val">${w.toFixed(3)}</span>
      </div>`).join("");

    $("#demo-matrix").innerHTML = '<span></span>' + WORDS.map((w) => `<span class="mm-head">${w}</span>`).join("") +
      data.A.map((r, i) => `<span class="mm-row">${WORDS[i]}</span>` +
        r.map((v) => `<span class="mm-cell${i === state.query ? " is-row" : ""}" data-i="${i}" style="${cellStyle(v)}">${v.toFixed(2)}</span>`).join("")).join("");

    const before = state.mode === "raw" ? X[state.query] : data.V[state.query];
    const after = data.Y[state.query];
    const cls = after.length === 3 ? "vec__cells vec__cells--3" : "vec__cells";
    $("#demo-vecs").innerHTML = `
      <div><p class="vec__label">${state.mode === "raw" ? "embedding" : "value vector"} of "${WORDS[state.query]}"</p>
        <div class="${cls}">${before.map((v) => `<span class="vcell">${fmt(v)}</span>`).join("")}</div></div>
      <div><p class="vec__label">context-aware output</p>
        <div class="${cls}">${after.map((v) => `<span class="vcell" style="${cellStyle(v * 0.85)}">${fmt(v)}</span>`).join("")}</div></div>`;
    $("#demo-vec-note").textContent = state.mode === "raw"
      ? "The new vector is a weighted mix of every word's embedding."
      : "With learned weights, the mix is over value vectors instead.";
  };

  wordsEl.addEventListener("click", (e) => {
    const b = e.target.closest(".word");
    if (b) { state.query = +b.dataset.i; renderDemo(); }
  });
  $("#demo-matrix").addEventListener("click", (e) => {
    const c = e.target.closest(".mm-cell");
    if (c) { state.query = +c.dataset.i; renderDemo(); }
  });
  document.querySelectorAll(".segmented button").forEach((b) => b.addEventListener("click", () => {
    state.mode = b.dataset.mode;
    document.querySelectorAll(".segmented button").forEach((o) => o.setAttribute("aria-checked", String(o === b)));
    renderDemo();
  }));
  renderDemo();

  /* ---------- Syllabus ---------- */
  const TRACKS = [
    { name: "Attention math", range: "0–7", lessons: [
      [0, "Vectors, Dot Products, and Matrices"],
      [1, "Why Attention? From Ambiguity to Context"],
      [2, "Self-Attention with Real Numbers", "self-attention-from-scratch"],
      [3, "Making Attention Learnable: Query, Key, and Value", "self-attention-from-scratch"],
      [4, "Multi-Head Attention", "self-attention-from-scratch"],
      [5, "The Transformer Encoder Block", "transformer-encoder-pytorch"],
      [6, "Positional Encoding", "transformer-encoder-pytorch"],
      [7, "BERT: The Encoder in the Wild"],
    ]},
    { name: "PyTorch", range: "8–10", lessons: [
      [8, "Tensors, Shape & the Tree Mental Model"],
      [9, "Autograd & nn.Module"],
      [10, "Data Pipelines & Layer Containers"],
    ]},
    { name: "BERT projects", range: "11–14", lessons: [
      [11, "BERT-Base Masked Language Model Pretraining in PyTorch"],
      [12, "Fine-Tune BERT for Disaster Tweet Classification"],
      [13, "Fine-Tune BERT for Named Entity Recognition"],
      [14, "Knowledge Distillation and DistilBERT"],
    ]},
    { name: "Vision & search", range: "15–16", lessons: [
      [15, "Vision Transformers and Cassava Leaf Disease", "vision-transformer-cassava"],
      [16, "Two Towers From Scratch: Semantic Search", "semantic-search-two-tower"],
    ]},
  ];
  const tabsEl = $(".syllabus__tabs");
  const listEl = $("#syllabus-list");
  tabsEl.innerHTML = TRACKS.map((t, i) =>
    `<button type="button" class="tab" role="tab" aria-selected="${i === 0}" data-i="${i}">${t.name}<small>${t.range}</small></button>`).join("");
  const renderTrack = (i) => {
    tabsEl.querySelectorAll(".tab").forEach((b) => b.setAttribute("aria-selected", String(+b.dataset.i === i)));
    listEl.innerHTML = TRACKS[i].lessons.map(([n, title, repo], k) => `
      <li class="lesson" style="animation-delay:${k * 40}ms">
        <span class="lesson__num">${String(n).padStart(2, "0")}</span>
        <span class="lesson__title">${title}</span>
        ${repo ? `<a class="lesson__tag" href="https://github.com/${GH_USER}/${repo}" target="_blank" rel="noopener">free code</a>` : ""}
      </li>`).join("");
  };
  tabsEl.addEventListener("click", (e) => {
    const b = e.target.closest(".tab");
    if (b) renderTrack(+b.dataset.i);
  });
  renderTrack(0);

  /* ---------- Repos ---------- */
  const REPOS = [
    { name: "self-attention-from-scratch", sessions: "Sessions 2–4", lang: "Jupyter Notebook",
      desc: "Self-attention explained with real numbers, then built in NumPy and PyTorch. Tests check every hand-worked number.",
      tags: ["attention", "numpy", "pytorch"] },
    { name: "transformer-encoder-pytorch", sessions: "Sessions 5–6", lang: "Jupyter Notebook",
      desc: "The full encoder block from scratch, plus an experiment: 50% accuracy without positional encoding, 100% with it.",
      tags: ["encoder", "positional-encoding", "pytorch"] },
    { name: "vision-transformer-cassava", sessions: "Session 15", lang: "Jupyter Notebook",
      desc: "Fine-tune a Vision Transformer on Kaggle cassava leaf photos, from patches to a competition submission.",
      tags: ["vit", "computer-vision", "kaggle"] },
    { name: "semantic-search-two-tower", sessions: "Session 16", lang: "Jupyter Notebook",
      desc: "Two-tower retrieval and cross-encoder re-ranking, built by hand from a plain transformer encoder.",
      tags: ["retrieval", "embeddings", "kaggle"] },
  ];
  const repoIcon = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.71 1.71.75.75 0 0 1-1.07 1.06A2.49 2.49 0 0 1 2 11.5v-9zm10.5-1h-8a1 1 0 0 0-1 1v6.71A2.5 2.5 0 0 1 4.5 9h8V1.5z"/></svg>';
  const starIcon = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 .25a.75.75 0 0 1 .67.42l1.88 3.8 4.19.61a.75.75 0 0 1 .42 1.28l-3.04 2.96.72 4.17a.75.75 0 0 1-1.09.79L8 12.31l-3.75 1.97a.75.75 0 0 1-1.09-.79l.72-4.17L.84 6.36a.75.75 0 0 1 .42-1.28l4.19-.61L7.33.67A.75.75 0 0 1 8 .25z"/></svg>';
  $("#repos").innerHTML = REPOS.map((r) => `
    <a class="repo reveal is-visible" href="https://github.com/${GH_USER}/${r.name}" target="_blank" rel="noopener">
      <div class="repo__top">${repoIcon}<span class="repo__name">${r.name}</span><span class="repo__session">${r.sessions}</span></div>
      <p class="repo__desc">${r.desc}</p>
      <div class="repo__meta">
        <span><i class="lang-dot lang-dot--nb"></i>${r.lang}</span>
        <span data-stars="${r.name}" hidden>${starIcon}<b>0</b></span>
      </div>
      <div class="repo__tags">${r.tags.map((t) => `<span>${t}</span>`).join("")}</div>
    </a>`).join("");

  // Live star counts. Shown only once loaded, so a rate-limited API never breaks the layout.
  fetch(`https://api.github.com/users/${GH_USER}/repos?per_page=100`)
    .then((r) => (r.ok ? r.json() : []))
    .then((list) => {
      list.forEach((repo) => {
        const el = document.querySelector(`[data-stars="${repo.name}"]`);
        if (el && repo.stargazers_count > 0) {
          el.querySelector("b").textContent = repo.stargazers_count;
          el.hidden = false;
        }
      });
    })
    .catch(() => {});

  /* ---------- Hero canvas: drifting attention grid ---------- */
  const canvas = $("#attention-canvas");
  const ctx = canvas.getContext("2d");
  let W = 0, H = 0, dpr = 1, cols = 0, rows = 0;
  const CELL = 34, GAP = 6;
  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
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
        // A soft diagonal band (tokens attending to their neighbours) plus drifting waves.
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
  let raf = 0, visible = true;
  const loop = (t) => { draw(t); raf = requestAnimationFrame(loop); };
  resize();
  window.addEventListener("resize", () => { resize(); if (reducedMotion) draw(0); });
  if (reducedMotion) {
    draw(0);
  } else {
    // Pause the animation when the hero is off screen.
    new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(loop);
    }).observe(canvas);
  }
})();
