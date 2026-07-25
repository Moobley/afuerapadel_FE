# Torneo Afuera Padel v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Upgrade from single-tournament page to multi-tournament ranking with general ranking (aggregated across all tornei) and per-tournament selector with multi-select.

**Architecture:** Modify existing HTML/CSS/JS files. Nav gains "Classifica Generale" and "Tornei" links. A `manifest.json` lists available torneo files. JS loads all torneos, aggregates for general ranking, and renders a multi-select dropdown for per-torneo view.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript (ES6), no dependencies.

## Global Constraints

- Colors: primary `#231F1E`, secondary `#F55A22`, tertiary `#00A1B3`
- Language: Italian
- Font: system sans-serif stack
- Responsive breakpoint: `768px` for mobile
- No external libraries or CDNs
- Smooth scroll for same-page anchor navigation

---

### Task 1: Update index.html — nav and sections

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: existing header, hero, footer structure
- Produces: nav with 3 links, two new content sections

- [ ] **Step 1: Read and update index.html**

Read the current `index.html`. Make these changes:

1. **Nav links** — change from 2 to 3 links:
```html
<nav class="header__nav" id="nav">
  <a href="#classifica-generale" class="header__link">Classifica Generale</a>
  <a href="#tornei" class="header__link">Tornei</a>
  <a href="#contatti" class="header__link">Contatti</a>
</nav>
```

2. **Replace the single torneo section** with two sections:

```html
<section class="classifica-generale" id="classifica-generale">
  <div class="container">
    <h2 class="section-title">Classifica Generale</h2>
    <p class="section-desc">
      Classifica complessiva di tutti i tornei. I punti di ogni partecipante
      vengono sommati attraverso le varie edizioni.
    </p>
    <div class="table-wrapper">
      <table class="standings" id="general-standings">
        <thead>
          <tr>
            <th>Posizione</th>
            <th>Giocatore</th>
            <th>Punteggio Totale</th>
          </tr>
        </thead>
        <tbody id="general-standings-body">
          <tr><td colspan="3">Caricamento classifica generale…</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</section>

<section class="tornei" id="tornei">
  <div class="container">
    <h2 class="section-title">Tornei</h2>
    <p class="section-desc">Seleziona uno o più tornei per visualizzare la classifica.</p>
    <div class="tornei-selector" id="tornei-selector">
      <button class="tornei-selector__toggle" id="tornei-toggle">
        Seleziona tornei
      </button>
      <div class="tornei-selector__dropdown" id="tornei-dropdown">
        <!-- Checkboxes rendered by JS -->
      </div>
    </div>
    <div class="table-wrapper" id="tornei-table-wrapper" style="display:none">
      <table class="standings" id="tornei-standings">
        <thead>
          <tr>
            <th>Posizione</th>
            <th>Giocatore 1</th>
            <th>Giocatore 2</th>
            <th>Punteggio</th>
            <th class="torneo-col">Torneo</th>
          </tr>
        </thead>
        <tbody id="tornei-standings-body">
          <tr><td colspan="5" id="tornei-empty-msg">Seleziona uno o più tornei per visualizzare la classifica.</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</section>
```

3. **Keep the old `.torneo` section reference** — remove it entirely; the new sections replace it.

- [ ] **Step 2: Verify HTML**

Open `index.html` in browser. Expected: nav shows 3 links, two new sections visible (Classifica Generale + Tornei with multi-select placeholder). No console errors.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: update HTML with general ranking and per-torneo sections"
```

---

### Task 2: Create manifest.json

**Files:**
- Create: `assets/tornei_json/manifest.json`

- [ ] **Step 1: Write manifest.json**

```json
[
  {
    "file": "RISULTATO_TORNEO_2026_07_25.json",
    "date": "2026-07-25"
  }
]
```

- [ ] **Step 2: Verify**

Run: `Get-Content assets/tornei_json/manifest.json` — should parse as valid JSON array with one entry.

- [ ] **Step 3: Commit**

```bash
git add assets/tornei_json/manifest.json
git commit -m "feat: add torneo manifest"
```

---

### Task 3: Rewrite script.js — multi-file logic, aggregation, dual rendering

**Files:**
- Modify: `script.js`

**Interfaces:**
- Consumes: `assets/tornei_json/manifest.json` + torneo JSON files
- Produces: two rendered tables (`#general-standings-body` and `#tornei-standings-body`)

- [ ] **Step 1: Write the new script.js**

Read the current `script.js`. Replace the entire content with:

```javascript
(function () {
  var MANIFEST_URL = 'assets/tornei_json/manifest.json';
  var allData = {};

  // --- Mobile hamburger ---
  var hamburger = document.getElementById('hamburger');
  var nav = document.getElementById('nav');

  hamburger.addEventListener('click', function () {
    var isOpen = nav.classList.toggle('header__nav--open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  nav.querySelectorAll('.header__link').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('header__nav--open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // --- Multi-select dropdown toggle ---
  var toggleBtn = document.getElementById('tornei-toggle');

  toggleBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    var dd = document.getElementById('tornei-dropdown');
    dd.classList.toggle('tornei-selector__dropdown--open');
  });

  document.addEventListener('click', function () {
    var dd = document.getElementById('tornei-dropdown');
    dd.classList.remove('tornei-selector__dropdown--open');
  });

  // --- Load manifest ---
  fetch(MANIFEST_URL)
    .then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function (manifest) {
      if (!manifest || manifest.length === 0) {
        showGeneralError('Nessun torneo disponibile.');
        showTorneiError('Nessun torneo disponibile.');
        return;
      }
      manifest.sort(function (a, b) { return b.date.localeCompare(a.date); });
      buildDropdown(manifest);
      loadAllTornei(manifest);
    })
    .catch(function () {
      showGeneralError('Impossibile caricare l\'elenco dei tornei.');
      showTorneiError('Impossibile caricare l\'elenco dei tornei.');
    });

  function loadAllTornei(manifest) {
    var pending = manifest.length;
    var hasError = false;

    manifest.forEach(function (entry) {
      var url = 'assets/tornei_json/' + entry.file;
      fetch(url)
        .then(function (r) {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          return r.json();
        })
        .then(function (data) {
          allData[entry.file] = data;
        })
        .catch(function () {
          hasError = true;
        })
        .then(function () {
          pending--;
          if (pending === 0) {
            if (hasError) console.warn('Alcuni tornei non sono stati caricati.');
            onAllLoaded(manifest);
          }
        });
    });
  }

  function onAllLoaded(manifest) {
    renderGeneralRanking();
    renderTorneiDropdown(manifest);
    updateTorneiTable(manifest);
  }

  // --- General Ranking ---
  function renderGeneralRanking() {
    var players = {};

    Object.keys(allData).forEach(function (file) {
      var rows = allData[file]['TABELLONE FINALE'];
      if (!rows) return;
      rows.forEach(function (r) {
        var score = r['Punteggio assegnato'];
        if (score == null) return;
        var g1 = r['Giocatore 1'];
        var g2 = r['Giocatore 2'];
        if (g1) players[g1] = (players[g1] || 0) + score;
        if (g2) players[g2] = (players[g2] || 0) + score;
      });
    });

    var sorted = Object.keys(players).sort(function (a, b) {
      return players[b] - players[a];
    });

    var tbody = document.getElementById('general-standings-body');
    if (sorted.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3">Nessun dato disponibile.</td></tr>';
      return;
    }

    var html = '';
    var topCount = 0;
    sorted.forEach(function (name) {
      topCount++;
      var cls = topCount <= 4 ? ' class="is-top"' : '';
      html += '<tr' + cls + '><td>' + topCount + '°</td><td>' + escapeHtml(name) + '</td><td>' + players[name] + '</td></tr>';
    });
    tbody.innerHTML = html;
  }

  // --- Tornei Selector ---
  function buildDropdown(manifest) {
    var dd = document.getElementById('tornei-dropdown');
    dd.innerHTML = '';
    manifest.forEach(function (entry) {
      var label = document.createElement('label');
      label.className = 'tornei-selector__item';
      var cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.value = entry.file;
      cb.className = 'tornei-selector__checkbox';
      cb.addEventListener('change', function () {
        updateTorneiTable(manifest);
      });
      label.appendChild(cb);
      label.appendChild(document.createTextNode(' ' + formatDate(entry.date)));
      dd.appendChild(label);
    });
  }

  function renderTorneiDropdown(manifest) {
    // already built in buildDropdown, no additional render needed
  }

  function getSelectedFiles() {
    var cbs = document.querySelectorAll('.tornei-selector__checkbox:checked');
    var files = [];
    cbs.forEach(function (cb) { files.push(cb.value); });
    return files;
  }

  function updateTorneiTable(manifest) {
    var selected = getSelectedFiles();
    var wrapper = document.getElementById('tornei-table-wrapper');
    var emptyMsg = document.getElementById('tornei-empty-msg');
    var tbody = document.getElementById('tornei-standings-body');
    var thead = document.querySelector('#tornei-standings thead');

    // Always show the table wrapper so thead is visible
    wrapper.style.display = '';

    if (selected.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5">Seleziona uno o più tornei per visualizzare la classifica.</td></tr>';
      var torneoCol = document.querySelector('.torneo-col');
      if (torneoCol) torneoCol.style.display = 'none';
      return;
    }

    var showTorneoCol = selected.length > 1;
    var torneoCol = document.querySelector('.torneo-col');
    if (torneoCol) torneoCol.style.display = showTorneoCol ? '' : 'none';

    var html = '';
    var pos = 0;
    var topCount = 0;

    selected.forEach(function (file) {
      var data = allData[file];
      if (!data) return;
      var rows = data['TABELLONE FINALE'];
      if (!rows) return;

      rows.forEach(function (r) {
        var posLabel = r['POSIZIONE'];
        if (!posLabel) return;
        pos++;
        var g1 = r['Giocatore 1'] || '';
        var g2 = r['Giocatore 2'] || '';
        var score = r['Punteggio assegnato'] != null ? r['Punteggio assegnato'] : '';
        var torneoName = showTorneoCol ? formatDate(getFileDate(file, manifest)) : '';
        topCount++;
        var cls = topCount <= 4 ? ' class="is-top"' : '';
        html += '<tr' + cls + '>';
        html += '<td>' + escapeHtml(posLabel) + '</td>';
        html += '<td>' + escapeHtml(g1) + '</td>';
        html += '<td>' + escapeHtml(g2) + '</td>';
        html += '<td>' + escapeHtml(String(score)) + '</td>';
        if (showTorneoCol) html += '<td>' + escapeHtml(torneoName) + '</td>';
        html += '</tr>';
      });
    });

    tbody.innerHTML = html || '<tr><td colspan="5">Nessun dato disponibile per i tornei selezionati.</td></tr>';
  }

  // --- Helpers ---
  function getFileDate(file, manifest) {
    for (var i = 0; i < manifest.length; i++) {
      if (manifest[i].file === file) return manifest[i].date;
    }
    return '';
  }

  function formatDate(dateStr) {
    var parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return parts[2] + '/' + parts[1] + '/' + parts[0];
  }

  function showGeneralError(msg) {
    document.getElementById('general-standings-body').innerHTML = '<tr><td colspan="3">' + escapeHtml(msg) + '</td></tr>';
  }

  function showTorneiError(msg) {
    document.getElementById('tornei-standings-body').innerHTML = '<tr><td colspan="5">' + escapeHtml(msg) + '</td></tr>';
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

Start a local server: `npx serve .`

Open in browser. Expected:
- General ranking table shows players with summed scores, sorted by points
- Multi-select dropdown with one torneo (date formatted as DD/MM/YYYY)
- Click the dropdown toggle → shows checkbox, click a torneo → table appears
- With single torneo selected, "Torneo" column hidden
- With 2+ selected (when more tornei are added), Torneo column shown
- Nav hamburger still works on mobile
- No console errors

- [ ] **Step 3: Commit**

```bash
git add script.js
git commit -m "feat: rewrite JS with multi-torneo loading, general ranking, and per-torneo selector"
```

---

### Task 4: Update style.css — new section and dropdown styles

**Files:**
- Modify: `style.css`

- [ ] **Step 1: Read and update style.css**

Append these styles to the existing `style.css`:

```css
/* --- Section desc --- */
.section-desc {
  color: rgba(255,255,255,0.7);
  margin-bottom: 40px;
  max-width: 700px;
}

/* --- Classifica Generale --- */
.classifica-generale {
  padding: 80px 0;
}

/* --- Tornei --- */
.tornei {
  padding: 80px 0;
}

/* --- Multi-select dropdown --- */
.tornei-selector {
  position: relative;
  margin-bottom: 32px;
  max-width: 320px;
}

.tornei-selector__toggle {
  width: 100%;
  padding: 12px 16px;
  background: #2A2625;
  color: #fff;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 6px;
  cursor: pointer;
  text-align: left;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s;
  position: relative;
}

.tornei-selector__toggle::after {
  content: '\25BC';
  font-size: 10px;
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255,255,255,0.4);
}

.tornei-selector__toggle:hover {
  border-color: #F55A22;
}

.tornei-selector__dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #2A2625;
  border: 1px solid rgba(255,255,255,0.12);
  border-top: 0;
  border-radius: 0 0 6px 6px;
  max-height: 0;
  overflow: hidden;
  visibility: hidden;
  transition: max-height 0.25s ease;
  z-index: 50;
}

.tornei-selector__dropdown--open {
  max-height: 300px;
  visibility: visible;
  overflow-y: auto;
}

.tornei-selector__item {
  display: block;
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.15s;
}

.tornei-selector__item:hover {
  background: rgba(245, 90, 34, 0.12);
}

.tornei-selector__checkbox {
  margin-right: 8px;
  accent-color: #F55A22;
}

/* --- Torneo column (multi-select) --- */
.torneo-col {
  min-width: 120px;
}

@media (max-width: 768px) {
  .tornei-selector {
    max-width: 100%;
  }
}
```

- [ ] **Step 2: Verify styling**

Open `index.html` via local server. Expected:
- "Classifica Generale" section with title, desc, table
- "Tornei" section with multi-select dropdown, same styling as rest
- Dropdown toggle opens/closes with animation
- Checkbox items with hover effect
- Torneo column hidden when single torneo selected
- Responsive layout

- [ ] **Step 3: Commit**

```bash
git add style.css
git commit -m "feat: add styles for general ranking and tornei multi-select"
```

---

### Task 5: Final verification

**Files:** (no changes — manual checks only)

- [ ] **Step 1: Full functional test**

Start server: `npx serve .`

Verify:
- Nav: Classifica Generale, Tornei, Contatti → smooth scroll to sections
- General ranking: shows all players with summed points, sorted desc
- Top 4 players highlighted with orange left border
- Multi-select: toggle opens dropdown, shows "25/07/2026"
- Check the torneo → table appears with per-torneo ranking
- With single selection, Torneo column hidden
- Footer contacts all present and clickable
- Header hamburger works on mobile (≤768px)
- No console errors

- [ ] **Step 2: Commit any final fixes**

```bash
git add -A
git commit -m "chore: final adjustments after verification"
```
