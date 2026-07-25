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
