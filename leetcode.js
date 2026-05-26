(async function () {
  const USERNAME = "Qpham0410";
  const BASE = "https://alfa-leetcode-api.onrender.com";

  // ── Fetch stats ──────────────────────────────────────────────────
  async function loadStats() {
    try {
      const res = await fetch(`${BASE}/${USERNAME}/solved`);
      const data = await res.json();

      const set = (id, val) => {
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

  // ── Fetch calendar ───────────────────────────────────────────────
  async function loadCalendar() {
    const container = document.getElementById("lc-heatmap");
    if (!container) return;

    let calendar = {};
    try {
      const year = new Date().getFullYear();
      const [r1, r2] = await Promise.all([
        fetch(`${BASE}/userCalendar?username=${USERNAME}&year=${year}`),
        fetch(`${BASE}/userCalendar?username=${USERNAME}&year=${year - 1}`),
      ]);
      const [d1, d2] = await Promise.all([r1.json(), r2.json()]);
      Object.assign(calendar, JSON.parse(d1.submissionCalendar || "{}"));
      Object.assign(calendar, JSON.parse(d2.submissionCalendar || "{}"));
    } catch (_) {
      container.innerHTML = '<p class="lc-heatmap__error">Could not load submission calendar.</p>';
      return;
    }

    // Build last 52 weeks starting on the most recent Sunday
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(today);
    start.setDate(start.getDate() - 364);
    start.setDate(start.getDate() - start.getDay()); // align to Sunday

    const allCounts = Object.values(calendar).map(Number);
    const maxCount = Math.max(...allCounts, 1);

    const weeks = [];
    const cur = new Date(start);
    while (cur <= today) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        const ts = String(Math.floor(cur.getTime() / 1000));
        week.push({ date: new Date(cur), count: Number(calendar[ts] || 0) });
        cur.setDate(cur.getDate() + 1);
      }
      weeks.push(week);
    }

    // Year total
    const yearStart = Math.floor(new Date(today.getFullYear(), 0, 1).getTime() / 1000);
    const yearEnd   = Math.floor(today.getTime() / 1000);
    let yearTotal = 0;
    for (const [ts, cnt] of Object.entries(calendar)) {
      if (Number(ts) >= yearStart && Number(ts) <= yearEnd) yearTotal += Number(cnt);
    }
    const countEl = document.getElementById("lc-year-count");
    if (countEl) countEl.textContent = `${yearTotal} submissions in ${today.getFullYear()}`;

    // Render grid
    container.innerHTML = "";
    const grid = document.createElement("div");
    grid.className = "lc-heatmap__grid";

    weeks.forEach(week => {
      const col = document.createElement("div");
      col.className = "lc-heatmap__col";
      week.forEach(({ date, count }) => {
        const cell = document.createElement("div");
        cell.className = "lc-heatmap__cell";
        const level = count === 0 ? 0 : Math.ceil((count / maxCount) * 4);
        cell.dataset.level = level;
        const label = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        cell.title = `${label}: ${count} submission${count !== 1 ? "s" : ""}`;
        col.appendChild(cell);
      });
      grid.appendChild(col);
    });

    container.appendChild(grid);
  }

  // ── GitHub contributions ─────────────────────────────────────────
  async function loadGitHub() {
    const container = document.getElementById("gh-heatmap");
    if (!container) return;

    let contributions = [];
    try {
      const res = await fetch("https://github-contributions-api.jogruber.de/v4/HoneyBadger2006?y=last");
      const data = await res.json();
      contributions = data.contributions || [];
    } catch (_) {
      container.innerHTML = '<p class="lc-heatmap__error">Could not load GitHub contributions.</p>';
      return;
    }

    // Map date → {count, level}
    const byDate = {};
    let yearTotal = 0;
    const thisYear = new Date().getFullYear().toString();
    contributions.forEach(({ date, count, level }) => {
      byDate[date] = { count, level };
      if (date.startsWith(thisYear)) yearTotal += count;
    });

    const countEl = document.getElementById("gh-year-count");
    if (countEl) countEl.textContent = `${yearTotal} contributions in ${thisYear}`;

    // Build last 52 weeks
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(today);
    start.setDate(start.getDate() - 364);
    start.setDate(start.getDate() - start.getDay());

    container.innerHTML = "";
    const grid = document.createElement("div");
    grid.className = "lc-heatmap__grid";

    const cur = new Date(start);
    while (cur <= today) {
      const col = document.createElement("div");
      col.className = "lc-heatmap__col";
      for (let d = 0; d < 7; d++) {
        const key = cur.toISOString().slice(0, 10);
        const entry = byDate[key] || { count: 0, level: 0 };
        const cell = document.createElement("div");
        cell.className = "lc-heatmap__cell";
        cell.dataset.level = entry.level;
        const label = cur.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        cell.title = `${label}: ${entry.count} contribution${entry.count !== 1 ? "s" : ""}`;
        col.appendChild(cell);
        cur.setDate(cur.getDate() + 1);
      }
      grid.appendChild(col);
    }

    container.appendChild(grid);
  }

  loadStats();
  loadCalendar();
  loadGitHub();
})();
