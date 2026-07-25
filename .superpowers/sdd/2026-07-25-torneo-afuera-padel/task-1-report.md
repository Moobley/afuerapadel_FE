# Task 1: Create index.html — Report

## What I implemented

Created `index.html` with the full HTML structure for the Torneo Afuera Padel single-page website. The file includes:

- `<header>` with logo, hamburger menu button, and nav links ("Torneo", "Contatti")
- `<main>` with a hero section (logo + title + diagonal divider) and a torneo section (description + standings table with loading placeholder)
- `<footer>` with contact info (email, phone, address with Google Maps link, Instagram link) and copyright
- Links to `style.css` and `script.js` (to be created in later tasks)
- Asset references to `assets/logo.ico` (favicon) and `assets/logo.jpg` (logo)

## What I tested

- Opened `index.html` in the default browser — page renders raw unstyled content as expected
- No structural HTML issues (tags are well-formed)
- Console does show 404s for `style.css` and `script.js` (expected — those files will be created in subsequent tasks)

## Files changed

- `index.html` (new, 93 lines)

## Self-review findings

- CSS and JS files don't exist yet, so the page will show 404 errors in console for those resources. This is by design — they are created in later tasks.
- All IDs and class names match the convention used by the spec (`header`, `hamburger`, `nav`, `hero`, `torneo`, `table-wrapper`, `standings`, `standings-body`, `contatti`, etc.)

## Issues or concerns

None.
