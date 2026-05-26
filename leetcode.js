(async function () {
  const LC_USER   = "Qpham0410";
  const GH_USER   = "HoneyBadger2006";
  const LC_BASE   = "https://alfa-leetcode-api.onrender.com";
  const GH_BASE   = "https://github-contributions-api.jogruber.de/v4";

  const START_YEAR = 2024;
  const THIS_YEAR  = new Date().getFullYear();
  const YEARS      = Array.from({ length: THIS_YEAR - START_YEAR + 1 }, (_, i) => THIS_YEAR - i);

  const lcCache = {}; // year → {byDate}
  const ghCache = {}; // year → {byDate}

  // ── Heatmap grid renderer ─────────────────────────────────────────
  function renderHeatmap(container, byDate, year, labelFn) {
    container.innerHTML = "";
    const grid = document.createElement("div");
    grid.className = "lc-heatmap__grid";

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const rangeEnd   = year === THIS_YEAR ? new Date(today) : new Date(year, 11, 31);
    const rangeStart = new Date(year, 0, 1);
    rangeStart.setDate(rangeStart.getDate() - rangeStart.getDay()); // align to Sunday

    const cur = new Date(rangeStart);
    while (cur <= rangeEnd) {
      const col = document.createElement("div");
      col.className = "lc-heatmap__col";
      for (let d = 0; d < 7; d++) {
        if (cur > rangeEnd) { cur.setDate(cur.getDate() + 1); continue; }
        const key   = cur.toISOString().slice(0, 10);
        const entry = byDate[key] || { count: 0, level: 0 };
        const cell  = document.createElement("div");
        cell.className    = "lc-heatmap__cell";
        cell.dataset.level = entry.level;
        cell.title        = labelFn(new Date(cur), entry.count);
        col.appendChild(cell);
        cur.setDate(cur.getDate() + 1);
      }
      if (col.children.length) grid.appendChild(col);
    }
    container.appendChild(grid);
  }

  // ── Year-button row ───────────────────────────────────────────────
  function renderYearBtns(wrapId, activeYear, onYearClick) {
    const wrap = document.getElementById(wrapId);
    if (!wrap) return;
    wrap.innerHTML = "";
    YEARS.forEach(y => {
      const btn = document.createElement("button");
      btn.textContent = y;
      btn.className   = "year-btn" + (y === activeYear ? " year-btn--active" : "");
      btn.addEventListener("click", () => onYearClick(y));
      wrap.appendChild(btn);
    });
  }

  // ── LeetCode stats ────────────────────────────────────────────────
  async function loadStats() {
    try {
      const res  = await fetch(`${LC_BASE}/${LC_USER}/solved`);
      const data = await res.json();
      const set  = (id, val) => {
        const card = document.getElementById(id);
        if (!card) return;
        card.querySelector(".lc-stat__num").textContent = val ?? "—";
        card.classList.remove("lc-stat-card--loading");
      };
      set("lc-easy",   data.easySolved);
      set("lc-medium", data.mediumSolved);
      set("lc-hard",   data.hardSolved);
      set("lc-total",  data.solvedProblem);
    } catch (_) {
      ["lc-easy","lc-medium","lc-hard","lc-total"].forEach(id => {
        const card = document.getElementById(id);
        if (card) card.classList.remove("lc-stat-card--loading");
      });
    }
  }

  // ── LeetCode calendar ─────────────────────────────────────────────
  async function loadCalendar(year) {
    const container = document.getElementById("lc-heatmap");
    if (!container) return;
    container.innerHTML = '<p class="lc-heatmap__loading">Loading…</p>';
    renderYearBtns("lc-year-btns", year, loadCalendar);

    if (!lcCache[year]) {
      try {
        const res  = await fetch(`${LC_BASE}/userCalendar?username=${LC_USER}&year=${year}`);
        const data = await res.json();
        const raw  = JSON.parse(data.submissionCalendar || "{}");

        let maxCount = 1;
        const byDate = {};
        for (const [ts, cnt] of Object.entries(raw)) {
          const key   = new Date(Number(ts) * 1000).toISOString().slice(0, 10);
          const count = Number(cnt);
          byDate[key] = { count, level: 0 };
          if (count > maxCount) maxCount = count;
        }
        for (const e of Object.values(byDate)) {
          e.level = e.count === 0 ? 0 : Math.ceil((e.count / maxCount) * 4);
        }
        lcCache[year] = byDate;
      } catch (_) {
        container.innerHTML = '<p class="lc-heatmap__error">Could not load calendar.</p>';
        return;
      }
    }

    const byDate = lcCache[year];
    const yearTotal = Object.entries(byDate)
      .filter(([k]) => k.startsWith(String(year)))
      .reduce((s, [, e]) => s + e.count, 0);

    const countEl = document.getElementById("lc-year-count");
    if (countEl) countEl.textContent = `${yearTotal} submissions in ${year}`;

    renderHeatmap(container, byDate, year, (date, count) => {
      const lbl = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      return `${lbl}: ${count} submission${count !== 1 ? "s" : ""}`;
    });
  }

  // ── GitHub contributions ──────────────────────────────────────────
  async function loadGitHub(year) {
    const container = document.getElementById("gh-heatmap");
    if (!container) return;
    container.innerHTML = '<p class="lc-heatmap__loading">Loading…</p>';
    renderYearBtns("gh-year-btns", year, loadGitHub);

    if (!ghCache[year]) {
      try {
        const res  = await fetch(`${GH_BASE}/${GH_USER}?y=${year}`);
        const data = await res.json();
        const byDate = {};
        (data.contributions || []).forEach(({ date, count, level }) => {
          byDate[date] = { count, level };
        });
        ghCache[year] = byDate;
      } catch (_) {
        container.innerHTML = '<p class="lc-heatmap__error">Could not load contributions.</p>';
        return;
      }
    }

    const byDate = ghCache[year];
    const yearTotal = Object.entries(byDate)
      .filter(([k]) => k.startsWith(String(year)))
      .reduce((s, [, e]) => s + e.count, 0);

    const countEl = document.getElementById("gh-year-count");
    if (countEl) countEl.textContent = `${yearTotal} contributions in ${year}`;

    renderHeatmap(container, byDate, year, (date, count) => {
      const lbl = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      return `${lbl}: ${count} contribution${count !== 1 ? "s" : ""}`;
    });
  }

  loadStats();
  loadCalendar(THIS_YEAR);
  loadGitHub(THIS_YEAR);
})();
