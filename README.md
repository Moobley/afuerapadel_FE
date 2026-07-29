# Ranking Afuera Padel

Caricamento dei dati dei tornei per il sito.

## Struttura dei file

```
assets/tornei_json/
├── manifest.json              ← Indice dei tornei (DA AGGIORNARE OGNI VOLTA)
├── RISULTATO_TORNEO_2026_05_01.json
├── RISULTATO_TORNEO_2026_06_10.json
└── RISULTATO_TORNEO_2026_07_25.json   ← Inserisci qui i nuovi file
```

## Come aggiungere un nuovo torneo

### 1. Prepara il file Excel

Il cliente fornisce un Excel con la classifica del torneo. Il file deve avere queste colonne (in qualsiasi ordine):

| Colonna | Descrizione | Esempio |
|---------|-------------|---------|
| `POSIZIONE` | Descrizione del piazzamento | `VINCITORE - 1° POSTO` |
| `Giocatore 1` | Nome primo giocatore | `MARCO` |
| `Giocatore 2` | Nome secondo giocatore | `LUCA` |
| `Punteggio assegnato` | Punti ottenuti | `95` |

Se le colonne nell'Excel hanno nomi diversi, **rinominale** prima di convertire.

**Etichette possibili per `POSIZIONE`:**
- `VINCITORE - 1° POSTO`
- `FINALISTA - 2° POSTO`
- `SEMIFINALISTA - 3° POSTO`
- `SEMIFINALISTA - 4° POSTO`
- `USCITI AI QUARTI DI FINALE`
- `USCITI AGLI OTTAVI DI FINALE`
- `USCITI AI SEDICESIMI DI FINALE`
- `33° POSTO`, `34° POSTO`, ... (per posizioni oltre la 32)

### 2. Converti l'Excel in JSON

Usa un convertitore online (es. [convertcsv.com](https://www.convertcsv.com/csv-to-json.htm) o [tableconvert.com](https://tableconvert.com/)).

Il risultato deve essere un JSON con questa struttura:

```json
{
  "TABELLONE FINALE": [
    {
      "POSIZIONE": "VINCITORE - 1° POSTO",
      "Giocatore 1": "MARCO",
      "Giocatore 2": "LUCA",
      "Punteggio assegnato": 103
    },
    {
      "POSIZIONE": "FINALISTA - 2° POSTO",
      "Giocatore 1": "PIETRO",
      "Giocatore 2": "SARA",
      "Punteggio assegnato": 98
    }
  ]
}
```

**Attenzione ai nomi dei campi:**
- Devono essere **identici** a quelli sopra (inclusi spazi, accenti, maiuscole)
- Il nome `Giocatore 1` ha spazio e numero, non usare `Giocatore1` o `giocatore_1`
- `POSIZIONE` non ha accento sulla O
- `Punteggio assegnato` è al singolare

### 3. Salva il file JSON

Assegna al file un nome secondo lo schema:

```
RISULTATO_TORNEO_YYYY_MM_DD.json
```

Esempi:
- `RISULTATO_TORNEO_2026_05_01.json` (torneo del 1 Maggio 2026)
- `RISULTATO_TORNEO_2026_08_15.json` (torneo del 15 Agosto 2026)

Salvalo nella cartella `assets/tornei_json/`.

### 4. Aggiorna il manifest

Apri `assets/tornei_json/manifest.json` e aggiungi una nuova entry per il torneo:

```json
[
  { "file": "RISULTATO_TORNEO_2026_07_25.json", "date": "2026-07-25" },
  { "file": "RISULTATO_TORNEO_2026_08_15.json", "date": "2026-08-15" },
  { "file": "RISULTATO_TORNEO_2026_06_10.json", "date": "2026-06-10" },
  { "file": "RISULTATO_TORNEO_2026_05_01.json", "date": "2026-05-01" }
]
```

Ogni entry ha due campi:
- `"file"`: nome esatto del file JSON (caso-sensitive)
- `"date"`: data in formato `YYYY-MM-DD` (mesi e giorni con 2 cifre)

L'ordine non conta, il sito ordina da solo per data.

### 5. Carica su GitHub

Commita e pusha i file modificati:

```
git add assets/tornei_json/
git commit -m "Aggiunto torneo del 15 Agosto 2026"
git push
```

Dopo 1-2 minuti GitHub Pages aggiorna il sito automaticamente.

## Regole importanti

| Regola | Dettaglio |
|--------|-----------|
| **Nomi maiuscoli** | I nomi giocatori vanno in MAIUSCOLO (es. `MARCO`, non `Marco`) |
| **Punteggi interi** | Senza decimali (es. `95`, non `95.0`) |
| **JSON valido** | Controlla che il file sia parsabile (niente virgole finali, niente commenti) |
| **Stessa struttura** | Tutti i file torneo devono avere la stessa forma: chiave `"TABELLONE FINALE"` e array di oggetti |
| **Tutti i giocatori** | Vanno inseriti TUTTI i partecipanti, non solo i primi |

## Come funziona (a grandi linee)

Il sito carica `manifest.json`, poi scarica ogni file torneo elencato e somma i punteggi di ogni giocatore attraverso tutti i tornei per generare:

- **Classifica Generale** – tutti i giocatori con punteggio totale sommato
- **Classifica per torneo** – come sopra ma filtrata per tornei selezionati
- **Top 4 per torneo** – le prime 4 squadre di ogni torneo

I punteggi vengono assegnati individualmente: se una coppia prende 100 punti, entrambi i giocatori ricevono 100 punti ciascuno nella classifica generale.
