# Torneo Afuera Padel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a single-page website for the Afuera Padel tournament with hero, classification table (from JSON), and contacts footer.

**Architecture:** Three vanilla files — `index.html` (structure), `style.css` (styling), `script.js` (data & interactivity). No frameworks or build tools. Data loaded at runtime via `fetch` from existing `assets/RISULTATO TORNEO.json`.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript (ES6), no dependencies.

## Global Constraints

- Colors: primary `#231F1E`, secondary `#F55A22`, tertiary `#00A1B3`
- Language: Italian
- Font: system sans-serif stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`)
- Responsive breakpoint: `768px` for mobile
- No external libraries or CDNs
- Smooth scroll for same-page anchor navigation

---

### Task 1: Create index.html

**Files:**
- Create: `index.html`

**Interfaces:**
- Consumes: nothing
- Produces: HTML skeleton that `style.css` and `script.js` hook into via class/id selectors

- [ ] **Step 1: Write index.html**

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Torneo Afuera Padel</title>
  <link rel="icon" type="image/x-icon" href="assets/logo.ico">
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <header class="header">
    <div class="header__inner container">
      <a href="#" class="header__logo">
        <img src="assets/logo.jpg" alt="Afuera Padel" class="header__logo-img">
      </a>
      <button class="header__hamburger" id="hamburger" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
      <nav class="header__nav" id="nav">
        <a href="#torneo" class="header__link">Torneo</a>
        <a href="#contatti" class="header__link">Contatti</a>
      </nav>
    </div>
  </header>

  <main>
    <section class="hero" id="hero">
      <div class="hero__inner container">
        <div class="hero__logo-col">
          <img src="assets/logo.jpg" alt="Afuera Padel" class="hero__logo">
        </div>
        <div class="hero__diagonal" aria-hidden="true"></div>
        <div class="hero__text-col">
          <h1 class="hero__title">Afuera Padel<br><span class="hero__sub">Dove ogni colpo conta</span></h1>
        </div>
      </div>
    </section>

    <section class="torneo" id="torneo">
      <div class="container">
        <h2 class="section-title">Torneo</h2>
        <p class="torneo__desc">
          Benvenuto al Torneo Afuera Padel. Qui trovi la classifica finale
          con tutte le posizioni, i giocatori e i punteggi assegnati.
        </p>
        <div class="table-wrapper" id="table-wrapper">
          <table class="standings" id="standings">
            <thead>
              <tr>
                <th>Posizione</th>
                <th>Giocatore 1</th>
                <th>Giocatore 2</th>
                <th>Punteggio</th>
              </tr>
            </thead>
            <tbody id="standings-body">
              <tr><td colspan="4">Caricamento dati in corso…</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </main>

  <footer class="footer" id="contatti">
    <div class="container">
      <div class="footer__grid">
        <div class="footer__item">
          <span class="footer__icon">✉️</span>
          <a href="mailto:afuerapadelclub@gmail.com" class="footer__link">afuerapadelclub@gmail.com</a>
        </div>
        <div class="footer__item">
          <span class="footer__icon">📞</span>
          <a href="tel:3510149242" class="footer__link">3510149242</a>
        </div>
        <div class="footer__item">
          <span class="footer__icon">📍</span>
          <span>Via Molino Vecchio 32, C/da M. Troisi, Acerra 80011</span>
          <a href="https://www.google.com/maps/search/?api=1&query=Via+Molino+Vecchio+32+Acerra" target="_blank" rel="noopener" class="footer__maps-link">Apri su Google Maps</a>
        </div>
        <div class="footer__item">
          <span class="footer__icon">📷</span>
          <a href="https://instagram.com/afuera_padelindoor" target="_blank" rel="noopener" class="footer__link">@afuera_padelindoor</a>
        </div>
      </div>
      <p class="footer__copy">&copy; 2026 Afuera Padel. Tutti i diritti riservati.</p>
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify HTML validity**

Open `index.html` in browser. Expected: blank page (no CSS/JS yet) with raw unstyled content visible. No console errors.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add HTML structure for torneo page"
```

---

### Task 2: Create style.css

**Files:**
- Create: `style.css`

**Interfaces:**
- Consumes: HTML class/id selectors from Task 1
- Produces: full visual presentation

- [ ] **Step 1: Write style.css**

```css
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background-color: #231F1E;
  color: #fff;
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* --- Header --- */
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #231F1E;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.header__logo-img {
  height: 42px;
  width: auto;
  display: block;
}

.header__nav {
  display: flex;
  gap: 32px;
}

.header__link {
  color: #fff;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: color 0.2s;
}

.header__link:hover {
  color: #F55A22;
}

.header__hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.header__hamburger span {
  display: block;
  width: 24px;
  height: 2px;
  background: #fff;
  border-radius: 2px;
  transition: transform 0.3s;
}

@media (max-width: 768px) {
  .header__nav {
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    background: #231F1E;
    flex-direction: column;
    gap: 0;
    padding: 0;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }

  .header__nav--open {
    max-height: 200px;
  }

  .header__link {
    display: block;
    padding: 14px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  .header__hamburger {
    display: flex;
  }
}

/* --- Hero --- */
.hero {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
}

.hero__inner {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  width: 100%;
  gap: 0;
}

.hero__logo-col {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
}

.hero__logo {
  max-width: 260px;
  height: auto;
  opacity: 0;
  animation: fadeIn 0.8s ease forwards;
}

.hero__diagonal {
  width: 3px;
  height: 320px;
  background: linear-gradient(180deg, #F55A22, #00A1B3);
  transform: rotate(-15deg);
  opacity: 0.7;
}

.hero__text-col {
  display: flex;
  align-items: center;
  padding: 40px;
  opacity: 0;
  animation: fadeIn 0.8s ease 0.3s forwards;
}

.hero__title {
  font-size: 2.8rem;
  font-weight: 800;
  line-height: 1.2;
}

.hero__sub {
  display: block;
  font-size: 1.4rem;
  font-weight: 400;
  color: #F55A22;
  margin-top: 8px;
}

@keyframes fadeIn {
  to { opacity: 1; }
}

@media (max-width: 768px) {
  .hero__inner {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 20px;
    padding: 40px 0;
  }

  .hero__diagonal {
    display: none;
  }

  .hero__logo {
    max-width: 160px;
  }

  .hero__title {
    font-size: 1.8rem;
  }

  .hero__sub {
    font-size: 1.1rem;
  }
}

/* --- Sections --- */
.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #F55A22;
  margin-bottom: 16px;
}

/* --- Torneo --- */
.torneo {
  padding: 80px 0;
}

.torneo__desc {
  color: rgba(255,255,255,0.7);
  margin-bottom: 40px;
  max-width: 700px;
}

/* --- Standings Table --- */
.table-wrapper {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.08);
}

.standings {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.standings thead {
  background: #F55A22;
  position: sticky;
  top: 0;
}

.standings th {
  padding: 14px 16px;
  text-align: left;
  font-weight: 600;
  white-space: nowrap;
}

.standings td {
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}

.standings tbody tr {
  background: #231F1E;
  transition: background 0.15s;
}

.standings tbody tr:nth-child(even) {
  background: #2A2625;
}

.standings tbody tr:hover {
  background: rgba(245, 90, 34, 0.12);
}

.standings tbody tr.is-top {
  border-left: 3px solid #F55A22;
}

@media (max-width: 768px) {
  .standings {
    font-size: 13px;
  }

  .standings th,
  .standings td {
    padding: 10px 12px;
  }
}

/* --- Footer --- */
.footer {
  background: #231F1E;
  border-top: 1px solid rgba(255,255,255,0.08);
  padding: 60px 0 40px;
}

.footer__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.footer__item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
  color: rgba(255,255,255,0.7);
}

.footer__icon {
  font-size: 18px;
}

.footer__link {
  color: #00A1B3;
  text-decoration: none;
  transition: color 0.2s;
}

.footer__link:hover {
  color: #F55A22;
}

.footer__maps-link {
  color: #00A1B3;
  text-decoration: none;
  font-size: 13px;
  margin-top: 2px;
  transition: color 0.2s;
}

.footer__maps-link:hover {
  color: #F55A22;
}

.footer__copy {
  text-align: center;
  font-size: 13px;
  color: rgba(255,255,255,0.35);
  border-top: 1px solid rgba(255,255,255,0.06);
  padding-top: 24px;
}
```

- [ ] **Step 2: Verify styling**

Open `index.html` in browser. Expected: full layout visible — dark background, sticky header, hero with logo + diagonal + tagline, torneo section, footer contacts. Hamburger hidden on desktop.

- [ ] **Step 3: Commit**

```bash
git add style.css
git commit -m "feat: add styles with responsive layout"
```

---

### Task 3: Create script.js

**Files:**
- Create: `script.js`

**Interfaces:**
- Consumes: `assets/RISULTATO TORNEO.json` (existing)
- Produces: rendered table rows in `#standings-body`

- [ ] **Step 1: Write script.js**

```javascript
(function () {
  const STANDINGS_URL = 'assets/RISULTATO TORNEO.json';
  const TOP_POSITIONS = ['VINCITORE', 'FINALISTA', 'SEMIFINALISTA'];

  // --- Mobile hamburger ---
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');

  hamburger.addEventListener('click', function () {
    nav.classList.toggle('header__nav--open');
  });

  // Close nav on link click
  nav.querySelectorAll('.header__link').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('header__nav--open');
    });
  });

  // --- Load standings ---
  var tbody = document.getElementById('standings-body');

  fetch(STANDINGS_URL)
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function (data) {
      var rows = data['TABELLONE FINALE'];
      if (!rows || rows.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4">Nessun dato disponibile.</td></tr>';
        return;
      }
      renderTable(rows);
    })
    .catch(function (err) {
      tbody.innerHTML = '<tr><td colspan="4">Impossibile caricare i dati del torneo.</td></tr>';
    });

  function renderTable(rows) {
    var html = '';
    var isFirst = true;
    var topCount = 0;

    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      if (!r['CLASSIFICA FINALE'] || r['CLASSIFICA FINALE'] === 'POSIZIONE') continue;

      var pos = r['CLASSIFICA FINALE'] || '';
      var g1 = r['Column2'] || '';
      var g2 = r['Column3'] || '';
      var score = r['Column4'] != null ? r['Column4'] : '';

      var cls = '';
      if (topCount < 4) {
        cls = ' class="is-top"';
        topCount++;
      }

      html += '<tr' + cls + '>'
        + '<td>' + escapeHtml(pos) + '</td>'
        + '<td>' + escapeHtml(g1) + '</td>'
        + '<td>' + escapeHtml(g2) + '</td>'
        + '<td>' + score + '</td>'
        + '</tr>';
    }

    tbody.innerHTML = html || '<tr><td colspan="4">Nessun dato disponibile.</td></tr>';
  }

  function escapeHtml(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }
})();
```

- [ ] **Step 2: Verify functionality**

Open `index.html` via a local server (since `fetch` requires HTTP — use any method). Expected: standings table populated with data from JSON. Top 4 rows have orange left border. Hamburger toggles nav on mobile width.

If you don't have a local server, use:

```powershell
# From project root — requires Node.js
npx serve .
```

Or open with VS Code Live Server. The table should render all ~63 entries with positions, player names (where available), and scores.

- [ ] **Step 3: Commit**

```bash
git add script.js
git commit -m "feat: add JS for data loading, table rendering, and nav"
```

---

### Task 4: Final verification

**Files:** (no changes — only manual checks)

- [ ] **Step 1: Open in browser via local server**

Verify:
- Sticky header with logo + nav links
- Hamburger visible on mobile, hidden on desktop
- Hero with logo (left), diagonal line, tagline (right)
- Hero fades in on load
- "Torneo" section with description and standings table
- Table populated with all positions (1-64)
- Top 4 rows highlighted with orange left border
- Footer with email (link), phone (link), address + Maps link, Instagram link
- Smooth scroll on "Torneo" and "Contatti" links
- Responsive layout at ≤768px

- [ ] **Step 2: Commit any final changes**

```bash
git add -A
git commit -m "chore: final adjustments after verification"
```
