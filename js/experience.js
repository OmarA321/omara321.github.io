/* ===========================
   Experiences Page Script
   - Renders work & projects
   - Scroll reveal, tilt hover
   - Filters, deep links
   =========================== */

(() => {
  // ---- CONFIG: hook into your HTML ----
  const els = {
    timeline: document.querySelector("#work-timeline"),
    projectGrid: document.querySelector("#project-grid"),
    projectFilters: document.querySelector("#project-filters"),
    projectSearch: document.querySelector("#project-search"),
  };

  // If your IDs differ, update selectors above.

  // ---- DATA SOURCE ----
  // If you want to keep data outside JS, host JSON at /data/experience.json and swap to fetchJson().
  // For now we use inline data. ⬇️  Replace with your real resume items & projects.
  const work = [
    // EXAMPLE: Replace these with your real roles (from your Resume.pdf).
    {
      company: "Your Company Name",
      role: "Software Engineer Intern",
      location: "City, Country",
      start: "May 2025",
      end: "Aug 2025",
      stack: ["TypeScript", "React", "Node.js", "PostgreSQL"],
      summary:
        "Built features for a high-traffic web app, shipping performance improvements and UX polish.",
      bullets: [
        "Improved page load time by ~35% via code-splitting and memoization.",
        "Implemented end-to-end feature: saved searches with server-side pagination.",
        "Wrote Cypress tests and increased coverage to 85% for critical flows.",
      ],
      extra: [
        "Collaborated cross-functionally with design and data teams.",
        "Led weekly demo; mentored two newer interns on component patterns.",
      ],
      links: [
        { label: "Team Blog", href: "#", type: "primary" },
        { label: "Design Doc", href: "#" },
      ],
    },
    {
      company: "Another Org",
      role: "Full-Stack Developer (Part-time)",
      location: "Remote",
      start: "Jan 2024",
      end: "Apr 2025",
      stack: ["Next.js", "Prisma", "AWS", "Tailwind"],
      summary:
        "Delivered product increments across API, DB, and UI with a focus on reliability.",
      bullets: [
        "Introduced background job workers; reduced API tail latency by 46%.",
        "Added optimistic UI for settings; support tickets dropped ~20%.",
        "Automated CI checks and preview deployments.",
      ],
      extra: [
        "Security pass: closed 9 medium-risk items post audit.",
        "Cut infra costs by 18% through instance right-sizing.",
      ],
      links: [],
    },
  ];

  const projects = [
    // EXAMPLE: Replace using details from your featured projects in index.html, but with more depth.
    {
      title: "DistantSync",
      thumb: "", // optional image path
      tagline: "Realtime offline-first collaboration engine.",
      description:
        "Engineered CRDT-powered sync with conflict resolution. Built an Electron shell for desktop and a web client. Benchmarked 1M ops with sub-100ms reconciliation.",
      year: 2025,
      tech: ["TypeScript", "CRDTs", "WebRTC", "Electron"],
      roles: ["Lead Dev", "Infra"],
      links: [
        { label: "Live Demo", href: "#", type: "primary" },
        { label: "GitHub", href: "#" },
        { label: "Report", href: "#" },
      ],
    },
    {
      title: "NextHorizon",
      tagline: "AI-assisted route planning with constraints.",
      description:
        "Built heuristics + LLM re-ranking for multi-stop trips. Achieved 23% average time savings in simulated city routes.",
      year: 2024,
      tech: ["Python", "FastAPI", "React", "LLM"],
      roles: ["Algorithms", "Backend"],
      links: [
        { label: "Devpost", href: "#", type: "primary" },
        { label: "GitHub", href: "#" },
      ],
    },
    {
      title: "Portfolio v3",
      tagline: "This site, reimagined.",
      description:
        "Animated, accessible, and fast. Optimized CLS/LCP, added IntersectionObserver reveals, and theme-aware gradients.",
      year: 2025,
      tech: ["Vite", "Vanilla JS", "CSS"],
      roles: ["Design", "Frontend"],
      links: [{ label: "Source", href: "#" }],
    },
  ];

  // ---- Helpers ----
  const el = (tag, props = {}, ...children) => {
    const n = document.createElement(tag);
    Object.entries(props).forEach(([k, v]) => {
      if (k === "class") n.className = v;
      else if (k === "dataset") Object.assign(n.dataset, v);
      else if (k.startsWith("on") && typeof v === "function") n.addEventListener(k.slice(2), v);
      else if (v !== undefined && v !== null) n.setAttribute(k, v);
    });
    children.forEach(c => {
      if (c == null) return;
      if (typeof c === "string") n.appendChild(document.createTextNode(c));
      else n.appendChild(c);
    });
    return n;
  };

  const formatDateRange = (start, end) => `${start} — ${end || "Present"}`;

  // ---- Render: Work ----
  function renderWork() {
    if (!els.timeline) return;

    const container = el("div", { class: "timeline reveal" });

    work.forEach((job, idx) => {
      const item = el("div", { class: "timeline-item" },
        el("span", { class: "timeline-dot", "aria-hidden": "true" }),
        el("article", { class: "role-card glass tilt", tabindex: "0" },
          el("header", { class: "role-head tilt-lift" },
            el("div", { class: "role-title" }, `${job.role} · ${job.company}`),
            el("div", { class: "role-meta" },
              el("span", { class: "badge" }, formatDateRange(job.start, job.end)),
              job.location ? el("span", { class: "badge" }, job.location) : null
            ),
            job.stack?.length
              ? el("div", { class: "chips" },
                  ...job.stack.map(t => el("span", { class: "chip", "data-chip": t }, t)))
              : null
          ),
          job.summary ? el("p", { class: "role-desc" }, job.summary) : null,
          job.bullets?.length
            ? el("ul", { class: "role-bullets" },
                ...job.bullets.map(b => el("li", {}, b)))
            : null,
          (job.extra?.length)
            ? el("div", { class: "role-expand", role: "group", "aria-expanded": "false" },
                el("button", { onClick: toggleExpand }, "More impact", chevron()))
            : null,
          (job.extra?.length)
            ? el("div", { class: "role-extra" },
                el("ul", { class: "role-bullets" },
                  ...job.extra.map(e => el("li", {}, e))))
            : null,
          (job.links?.length)
            ? el("div", { class: "project-links" },
                ...job.links.map(linkBtn))
            : null
        )
      );

      container.appendChild(item);
    });

    els.timeline.innerHTML = "";
    els.timeline.appendChild(container);
  }

  function chevron() {
    const svg = el("span", { class: "chev", "aria-hidden": "true" });
    svg.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
           xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
        <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
    return svg;
  }

  function toggleExpand(e) {
    const group = e.currentTarget.closest(".role-expand");
    const expanded = group.getAttribute("aria-expanded") === "true";
    group.setAttribute("aria-expanded", String(!expanded));
  }

  function linkBtn({ label, href, type }) {
    return el("a", { class: `btn ${type === "primary" ? "primary" : ""}`, href, target: "_blank", rel: "noopener noreferrer" },
      label,
      el("span", { "aria-hidden": "true" }, "↗")
    );
  }

  // ---- Render: Projects ----
  function getAllTags() {
    const set = new Set();
    projects.forEach(p => (p.tech || []).forEach(t => set.add(t)));
    return Array.from(set).sort();
  }

  let activeTags = new Set();
  let query = "";

  function renderFilters() {
    if (!els.projectFilters) return;
    const tags = getAllTags();

    const chips = tags.map(tag =>
      el("button", {
        class: `chip`,
        "data-tag": tag,
        onClick: () => toggleTag(tag),
        "aria-pressed": "false"
      }, tag)
    );

    const wrap = el("div", { class: "chips" }, ...chips);
    els.projectFilters.innerHTML = "";
    els.projectFilters.appendChild(wrap);

    if (els.projectSearch) {
      els.projectSearch.addEventListener("input", (e) => {
        query = (e.target.value || "").toLowerCase();
        renderProjects();
      });
    }
  }

  function toggleTag(tag) {
    if (activeTags.has(tag)) activeTags.delete(tag);
    else activeTags.add(tag);
    // update visual state
    els.projectFilters.querySelectorAll(`[data-tag]`).forEach(btn => {
      const t = btn.getAttribute("data-tag");
      const on = activeTags.has(t);
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-pressed", String(on));
    });
    renderProjects();
  }

  function matchesFilters(p) {
    const q = query.trim();
    const inQuery =
      !q ||
      p.title.toLowerCase().includes(q) ||
      (p.description || "").toLowerCase().includes(q) ||
      (p.tagline || "").toLowerCase().includes(q) ||
      (p.tech || []).some(t => t.toLowerCase().includes(q));

    const inTags =
      activeTags.size === 0 ||
      (p.tech || []).some(t => activeTags.has(t));

    return inQuery && inTags;
  }

  function renderProjects() {
    if (!els.projectGrid) return;

    const items = projects.filter(matchesFilters);

    const cards = items.map(p => {
      const media = el("div", { class: "project-thumb tilt-lift" });
      if (p.thumb) {
        const img = el("img", {
          src: p.thumb,
          alt: `${p.title} thumbnail`,
          loading: "lazy",
          decoding: "async",
          style: "width:100%;height:100%;object-fit:cover;"
        });
        media.appendChild(img);
      } else {
        // decorative gradient background already styled
      }

      const title = el("div", { class: "project-title" }, p.title);
      const meta = el("div", { class: "project-meta" },
        p.year ? el("span", { class: "badge" }, p.year) : null,
        ...(p.roles || []).map(r => el("span", { class: "badge" }, r))
      );

      const tech = (p.tech?.length)
        ? el("div", { class: "chips" },
            ...p.tech.map(t => el("span", { class: "chip", "data-chip": t }, t)))
        : null;

      const links = (p.links?.length)
        ? el("div", { class: "project-links" }, ...p.links.map(linkBtn))
        : null;

      return el("article", { class: "project-card glass tilt reveal", tabindex: "0" },
        media,
        el("div", { class: "project-body" },
          title,
          meta,
          p.tagline ? el("div", { class: "muted" }, p.tagline) : null,
          p.description ? el("p", { class: "project-desc" }, p.description) : null,
          tech,
          links
        )
      );
    });

    els.projectGrid.innerHTML = "";
    if (!cards.length) {
      els.projectGrid.appendChild(
        el("div", { class: "muted" }, "No projects match your filters.")
      );
    } else {
      cards.forEach(c => els.projectGrid.appendChild(c));
    }
    activateReveal();
    activateTilt();
  }

  // ---- Effects: Reveal ----
  let revealObserver;
  function activateReveal() {
    const nodes = document.querySelectorAll(".reveal:not(.in)");
    if (!nodes.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach(n => n.classList.add("in"));
      return;
    }

    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    }
    nodes.forEach(n => revealObserver.observe(n));
  }

  // ---- Effects: Tilt (lightweight, no lib) ----
  let tiltAttached = false;
  function activateTilt() {
    if (tiltAttached) return;
    const cards = document.querySelectorAll(".tilt");
    cards.forEach(card => {
      const lift = card.querySelector(".tilt-lift") || card;
      const max = 10; // deg
      const onMove = (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        const rx = (+py * max).toFixed(2);
        const ry = (-px * max).toFixed(2);
        card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
        lift.style.transform = `translateZ(18px)`;
      };
      const reset = () => {
        card.style.transform = "";
        lift.style.transform = "";
      };
      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", reset);
      card.addEventListener("blur", reset, true);
    });
    tiltAttached = true;
  }

  // ---- Deep link to sections or filters (#tag=React etc.) ----
  function applyHash() {
    const hash = new URL(location.href).hash.slice(1);
    if (!hash) return;
    // #tag=React or #search=foo
    const params = new URLSearchParams(hash);
    const tag = params.get("tag");
    const search = params.get("search");
    if (tag) {
      activeTags.add(tag);
    }
    if (typeof search === "string" && els.projectSearch) {
      els.projectSearch.value = search;
      query = search.toLowerCase();
    }
  }

  // ---- Optional: fetch JSON if you host data separately ----
  async function fetchJson(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to fetch ${path}`);
    return res.json();
  }

  // ---- Init ----
  function init() {
    // If you later add external JSON:
    // fetchJson('/data/experience.json').then(({ work: w, projects: p }) => {
    //   work.splice(0, work.length, ...w);
    //   projects.splice(0, projects.length, ...p);
    //   afterData();
    // }).catch(() => afterData());

    afterData();
  }

  function afterData() {
    renderWork();
    renderFilters();
    applyHash();
    renderProjects();
    activateReveal();

    // Accessibility: keyboard focus adds .in to reveals
    document.addEventListener("focusin", (e) => {
      const r = e.target.closest(".reveal");
      if (r) r.classList.add("in");
    }, true);
  }


  // Image slideshow functionality
document.querySelectorAll('.project-slideshow').forEach(slideshow => {
    let currentSlide = 0;
    const slides = slideshow.querySelectorAll('.slide');
    const dots = slideshow.querySelectorAll('.nav-dot');
    const prevBtn = slideshow.querySelector('.slide-prev');
    const nextBtn = slideshow.querySelector('.slide-next');
    
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }
    
    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }
    
    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prev);
    }
    

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });
    
    // Auto-advance slides every 4 seconds
    setInterval(nextSlide, 2500);
});

  // Kick off
  init();
})();
