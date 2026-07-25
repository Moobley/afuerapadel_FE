(function () {
  var MANIFEST_URL = 'assets/tornei_json/manifest.json';
  var allData = {};

  // --- Header logo visibility ---
  var headerLogo = document.querySelector('.header__logo');
  var heroSection = document.getElementById('hero');

  function updateHeaderLogo() {
    var rect = heroSection.getBoundingClientRect();
    headerLogo.style.opacity = rect.bottom <= 0 ? '1' : '0';
    headerLogo.style.pointerEvents = rect.bottom <= 0 ? 'auto' : 'none';
  }

  window.addEventListener('scroll', updateHeaderLogo);
  window.addEventListener('resize', updateHeaderLogo);
  updateHeaderLogo();

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
    filterTable('tornei-standings-body', this.value, [1]);
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
  function setupDropdown(toggleId, dropdownId) {
    var toggleBtn = document.getElementById(toggleId);
    var dd = document.getElementById(dropdownId);

    toggleBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      dd.classList.toggle('tornei-selector__dropdown--open');
    });

    document.addEventListener('click', function (e) {
      if (!dd.contains(e.target) && e.target !== toggleBtn) {
        dd.classList.remove('tornei-selector__dropdown--open');
      }
    });
  }

  setupDropdown('tornei-toggle', 'tornei-dropdown');
  setupDropdown('top5-toggle', 'top5-dropdown');

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
      buildDropdown(manifest, 'tornei-dropdown', function () { updateTorneiTable(manifest); });
      buildDropdown(manifest, 'top5-dropdown', function () { updateTop5(manifest); }, 'radio');
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
    updateTorneiTable(manifest);
    updateTop5(manifest);
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
  function buildDropdown(manifest, dropdownId, onChange, inputType) {
    inputType = inputType || 'checkbox';
    var dd = document.getElementById(dropdownId);
    dd.innerHTML = '';
    manifest.forEach(function (entry) {
      var label = document.createElement('label');
      label.className = 'tornei-selector__item';
      var input = document.createElement('input');
      input.type = inputType;
      input.value = entry.file;
      input.className = 'tornei-selector__checkbox';
      if (inputType === 'radio') input.name = dropdownId;
      input.addEventListener('change', onChange);
      label.appendChild(input);
      label.appendChild(document.createTextNode(' ' + formatDate(entry.date)));
      dd.appendChild(label);
    });
  }

  function getSelectedFiles(containerId) {
    var container = document.getElementById(containerId);
    var cbs = container.querySelectorAll('.tornei-selector__checkbox:checked');
    var files = [];
    cbs.forEach(function (cb) { files.push(cb.value); });
    return files;
  }

  function updateTorneiTable(manifest) {
    var selected = getSelectedFiles('tornei-selector');
    var wrapper = document.getElementById('tornei-table-wrapper');
    var tbody = document.getElementById('tornei-standings-body');

    wrapper.style.display = '';
    searchTornei.style.display = selected.length > 0 ? '' : 'none';
    searchTornei.value = '';

    if (selected.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3">Seleziona uno o più tornei per visualizzare la classifica.</td></tr>';
      return;
    }

    var players = {};

    selected.forEach(function (file) {
      var data = allData[file];
      if (!data) return;
      var rows = data['TABELLONE FINALE'];
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

  // --- Top 4 per torneo ---
  function updateTop5(manifest) {
    var selected = getSelectedFiles('top5-selector');
    var container = document.getElementById('top5-cards');
    container.className = 'top5__cards';

    if (selected.length === 0) {
      container.innerHTML = '<p style="color:rgba(255,255,255,0.5);">Seleziona uno o più tornei per vedere le prime 5 squadre.</p>';
      return;
    }

    var html = '';
    selected.forEach(function (file) {
      var data = allData[file];
      if (!data) return;
      var rows = data['TABELLONE FINALE'];
      if (!rows) return;
      var dateStr = formatDate(getFileDate(file, manifest));
      var top5 = rows.slice(0, 4);
      html += '<div class="top5-card">';
      html += '<div class="top5-card__header">' + escapeHtml(dateStr) + '</div>';
      html += '<table class="standings"><thead><tr><th>Posizione</th><th>Giocatore 1</th><th>Giocatore 2</th><th>Punteggio</th></tr></thead><tbody>';
      var topCount = 0;
      top5.forEach(function (r) {
        topCount++;
        var pos = r['POSIZIONE'] || topCount;
        var g1 = r['Giocatore 1'] || '';
        var g2 = r['Giocatore 2'] || '';
        var score = r['Punteggio assegnato'] != null ? r['Punteggio assegnato'] : '';
        var cls = '';
        if (topCount === 1) cls = ' class="is-champion"';
        else if (topCount <= 4) cls = ' class="is-top"';
        html += '<tr' + cls + '><td>' + escapeHtml(String(pos)) + '</td><td>' + escapeHtml(g1) + '</td><td>' + escapeHtml(g2) + '</td><td>' + escapeHtml(String(score)) + '</td></tr>';
      });
      html += '</tbody></table></div>';
    });

    container.innerHTML = html || '<p style="color:rgba(255,255,255,0.5);">Nessun dato disponibile.</p>';
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
    document.getElementById('tornei-standings-body').innerHTML = '<tr><td colspan="3">' + escapeHtml(msg) + '</td></tr>';
  }

  function escapeHtml(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }
})();
