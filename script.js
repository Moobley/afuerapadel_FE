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

  // --- Search ---
  var searchGeneral = document.getElementById('search-general');
  var searchTornei = document.getElementById('search-tornei');

  searchGeneral.addEventListener('input', function () {
    filterTable('general-standings-body', this.value, [1]);
  });

  searchTornei.addEventListener('input', function () {
    filterTable('tornei-standings-body', this.value, [1, 2]);
  });

  function filterTable(tbodyId, query, cols) {
    var tbody = document.getElementById(tbodyId);
    var rows = tbody.querySelectorAll('tr');
    var q = query.toLowerCase().trim();
    rows.forEach(function (row) {
      if (row.querySelector('td[colspan]')) return;
      var match = false;
      for (var i = 0; i < cols.length; i++) {
        var cell = row.children[cols[i]];
        if (cell && cell.textContent.toLowerCase().indexOf(q) !== -1) {
          match = true;
          break;
        }
      }
      row.style.display = (!q || match) ? '' : 'none';
    });
  }

  // --- Multi-select dropdown toggle ---
  var toggleBtn = document.getElementById('tornei-toggle');

  toggleBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    var dd = document.getElementById('tornei-dropdown');
    dd.classList.toggle('tornei-selector__dropdown--open');
  });

  document.addEventListener('click', function (e) {
    var dd = document.getElementById('tornei-dropdown');
    if (!dd.contains(e.target) && e.target !== toggleBtn) {
      dd.classList.remove('tornei-selector__dropdown--open');
    }
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
      var cls = '';
      if (topCount === 1) {
        cls = ' class="is-champion"';
      } else if (topCount <= 4) {
        cls = ' class="is-top"';
      }
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
    searchTornei.style.display = selected.length > 0 ? '' : 'none';

    searchTornei.value = '';

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
        var cls = '';
        if (topCount === 1) {
          cls = ' class="is-champion"';
        } else if (topCount <= 4) {
          cls = ' class="is-top"';
        }
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
