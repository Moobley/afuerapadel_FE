# Torneo Afuera Padel — Single Page Design

## Overview

Single-page website for the Afuera Padel tournament. Displays a hero section,
two classification sections (general ranking + per-tournament ranking with
multi-select), and contact footer. Stack: vanilla HTML/CSS/JS, no framework,
no build tools.

## Files

```
index.html                             → HTML structure
style.css                              → All styles (responsive)
script.js                              → Data loading, aggregation, rendering
assets/logo.jpg                        → Logo
assets/logo.ico                        → Favicon
assets/tornei_json/                    → Tournament JSON files
  manifest.json                        → List of available torneo files
  RISULTATO_TORNEO_AAAA_MM_GG.json     → One per tournament
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
- Left: small logo (`logo.jpg`, ~42px height)
- Right: nav links — `Classifica Generale` | `Tornei` | `Contatti`
- Mobile: hamburger icon → slide-down menu

### 2. Hero (full-viewport height)
- Left half: logo (larger, ~260px)
- Diagonal decorative line (secondary-to-tertiary gradient) crossing center
- Right half: tagline "Afuera Padel — Dove ogni colpo conta"
- Subtle fade-in animation on load

### 3. Classifica Generale Section
- Section title "Classifica Generale" (secondary color)
- Description paragraph
- Table: Posizione | Giocatore | Punteggio Totale
- Data: aggregates scores from ALL torneo JSONs, sums per player, sorts desc
- Top 4 rows highlighted with secondary border

### 4. Tornei Section
- Section title "Tornei" (secondary color)
- Multi-select dropdown (checkbox list) of all available tornei sorted newest first
- Table below, updates based on selection:
  - Single torneo selected: Posizione | Giocatore 1 | Giocatore 2 | Punteggio
  - Multiple tornei selected: Posizione | Giocatore 1 | Giocatore 2 | Punteggio | Torneo

### 5. Footer
- Background: primary color
- Content:
  - ✉️ afuerapadelclub@gmail.com
  - 📞 3510149242
  - 📍 Via Molino Vecchio 32, C/da M. Troisi, Acerra 80011 — link "Apri su Google Maps"
  - 📷 @afuera_padelindoor (link to Instagram)
  - © credit line

## Data Flow

1. Page loads → `script.js` fetches `assets/tornei_json/manifest.json`
2. Manifest lists all torneo files with date and filename
3. Populates the multi-select dropdown (newest first)
4. For **Classifica Generale**: fetches ALL torneo JSONs, iterates every
   "TABELLONE FINALE" entry, assigns `Punteggio assegnato` to both
   `Giocatore 1` and `Giocatore 2` individually, sums per player, sorts desc
5. For **Tornei section**: on selection change, fetches selected torneo JSONs
   and renders the corresponding table rows

## JSON Schema

Each torneo file:
```json
{
  "TABELLONE FINALE": [
    {
      "POSIZIONE": "VINCITORE - 1° POSTO",
      "Giocatore 1": "PIPPO",
      "Giocatore 2": "FRANCO",
      "Punteggio assegnato": 103
    }
  ]
}
```

Manifest file (`manifest.json`):
```json
[
  { "file": "RISULTATO_TORNEO_2026_07_25.json", "date": "2026-07-25" }
]
```

## Scoring Logic

- Each player in a pair receives the full `Punteggio assegnato` individually
- General ranking: sum of all scores across all tornei per player
- No deduplication needed (same player name = same person)

## Responsive Breakpoints

- **Desktop (>768px):** Full layout, horizontal nav
- **Mobile (≤768px):** Hamburger menu, stacked hero, horizontally scrolling
  tables, stacked footer contacts, full-width multi-select

## Navigation

- Anchor-based smooth scroll: `#classifica-generale`, `#tornei`, `#contatti`
- Active link highlighted (secondary color)

## Edge Cases

- Manifest fetch fails → show error "Impossibile caricare l'elenco dei tornei."
- Individual torneo JSON fails → skip that file, show warning, continue with rest
- No tornei selected → show "Seleziona uno o più tornei per visualizzare la classifica."
- Same player name in multiple tornei → summed correctly in classifica generale
- Very long player names → CSS truncation/ellipsis
- Tables on small screens → overflow-x auto
- Zero scores → still listed (player participated, scored 0)
