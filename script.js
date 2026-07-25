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
