# Ranking Afuera Padel

Caricamento dei dati dei tornei per il sito.

**Sito:** https://moobley.github.io/afuerapadel_FE/

## Metodo rapido (consigliato)

Usa il **convertitore online** per caricare l'Excel e pubblicare i dati su GitHub in un click:

1. Apri https://moobley.github.io/afuerapadel_FE/convertitore.html
2. Carica il file Excel (.xlsx)
3. Seleziona la data del torneo
4. Verifica che le colonne siano mappate correttamente
5. Inserisci il token GitHub (fornito dallo sviluppatore)
6. Clicca **"Pubblica su GitHub"**

Il JSON e il `manifest.json` vengono aggiornati automaticamente. Il sito si aggiorna in 1-2 minuti.

## Struttura dei file

```
assets/tornei_json/
├── manifest.json              ← Indice dei tornei
├── RISULTATO_TORNEO_2026_05_01.json
├── RISULTATO_TORNEO_2026_06_10.json
└── RISULTATO_TORNEO_2026_07_25.json
```

## Struttura dei dati

Ogni file torneo segue questo formato:

```json
{
  "TABELLONE FINALE": [
    {
      "POSIZIONE": "VINCITORE - 1° POSTO",
      "Giocatore 1": "MARCO",
      "Giocatore 2": "LUCA",
      "Punteggio assegnato": 103
    }
  ]
}
```

### Campi richiesti

| Campo | Tipo | Esempio |
|-------|------|---------|
| `POSIZIONE` | testo | `VINCITORE - 1° POSTO` |
| `Giocatore 1` | testo (MAIUSCOLO) | `MARCO` |
| `Giocatore 2` | testo (MAIUSCOLO) | `LUCA` |
| `Punteggio assegnato` | numero intero | `95` |

**Etichette per `POSIZIONE`:**
- `VINCITORE - 1° POSTO`
- `FINALISTA - 2° POSTO`
- `SEMIFINALISTA - 3° POSTO`
- `SEMIFINALISTA - 4° POSTO`
- `USCITI AI QUARTI DI FINALE`
- `USCITI AGLI OTTAVI DI FINALE`
- `USCITI AI SEDICESIMI DI FINALE`
- `33° POSTO`, `34° POSTO`, ... (oltre la 32)

### Regole

| Regola | Dettaglio |
|--------|-----------|
| **Nomi maiuscoli** | I nomi giocatori vanno in MAIUSCOLO |
| **Punteggi interi** | Senza decimali |
| **JSON valido** | Niente virgole finali o commenti |
| **Chiave fissa** | `"TABELLONE FINALE"` identico in ogni file |

## Come funziona

Il sito carica `manifest.json`, poi scarica ogni file JSON elencato e somma i punteggi di ogni giocatore per generare:

- **Classifica Generale** – tutti i giocatori con punteggio totale
- **Classifica per torneo** – filtrata per tornei selezionati
- **Top 4 per torneo** – le prime 4 squadre

I punteggi sono individuali: se una coppia prende 100 punti, entrambi ricevono 100 punti ciascuno nella classifica generale.
