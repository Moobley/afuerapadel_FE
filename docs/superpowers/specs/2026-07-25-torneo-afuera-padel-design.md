# Torneo Afuera Padel — Single Page Design

## Overview

Single-page website for the Afuera Padel tournament. Displays a hero section,
tournament info, a classification standings table (loaded from JSON), and
contact footer. Stack: vanilla HTML/CSS/JS, no framework, no build tools.

## Files

```
index.html      → HTML structure
style.css       → All styles (responsive)
script.js       → Fetch JSON, render table, nav interactions
assets/         → logo.jpg, logo.ico, RISULTATO TORNEO.json
```

## Color Palette

| Role       | Hex       | Usage                                |
|------------|-----------|--------------------------------------|
| Primary    | `#231F1E` | Page background, header/footer bg    |
| Secondary  | `#F55A22` | Accent headings, hero diagonal, CTAs  |
| Tertiary   | `#00A1B3` | Links, Instagram icon, hover effects  |
| Text       | `#FFFFFF` | Body copy                            |
| Surface    | `#2A2625` | Table row alternate, card bg          |

## Layout (top → bottom)

### 1. Header (sticky)
- Left: small logo (`logo.jpg`, ~50px height)
- Right: nav links — `Torneo` | `Contatti`
- Mobile: hamburger icon → slide-down menu

### 2. Hero (full-viewport height)
- Left half: logo (larger, ~200px)
- Diagonal decorative line (secondary color) crossing from top-right toward bottom-left
- Right half: catchy tagline (white, large weight)
- Subtle fade-in animation on load

### 3. Torneo Section
- Section title "Torneo" (secondary color)
- Placeholder description paragraph
- Standings table below

### 4. Standings Table
- Columns: Posizione | Giocatore 1 | Giocatore 2 | Punteggio
- Data source: `fetch('assets/RISULTATO TORNEO.json')`
- Top 4 positions (winner → semifinalist) highlighted with subtle secondary border
- Alternating row backgrounds for readability
- Hover highlight on rows
- Horizontally scrollable on mobile

### 5. Footer
- Background: primary color
- Content:
  - ✉️ afuerapadelclub@gmail.com
  - 📞 3510149242
  - 📍 Via Molino Vecchio 32, C/da M. Troisi, Acerra 80011 — link "Apri su Google Maps"
  - 📷 @afuera_padelindoor (link to Instagram)
  - © credit line

## Data Flow

1. Page loads → `script.js` calls `fetch('assets/RISULTATO TORNEO.json')`
2. On success, renders the "TABELLONE FINALE" array as table rows
3. Each entry: `CLASSIFICA FINALE` → Posizione, `Column2`/`Column3` → Giocatori, `Column4` → Punteggio
4. On error, show inline error message "Impossibile caricare i dati del torneo."

## Responsive Breakpoints

- **Desktop (>768px):** Full layout, horizontal nav
- **Mobile (≤768px):** Hamburger menu, stacked hero (logo above text), horizontally scrolling table, stacked footer contacts

## Navigation

- Anchor-based smooth scroll: `#torneo` and `#contatti`
- Active link highlighted (secondary color)

## Edge Cases

- JSON missing/fetch fails → graceful message, no broken layout
- Very long player names → CSS truncation/ellipsis
- Table on small screens → overflow-x auto with sticky first column
