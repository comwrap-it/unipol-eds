# Storybook Organization - EDS Components

## 📋 Panoramica

Le stories di Storybook sono state riorganizzate sia **logicamente** che **fisicamente** per seguire la stessa struttura gerarchica dei componenti EDS nella cartella `blocks/`, creando una navigazione intuitiva e coerente.

## 🗂️ Struttura Fisica delle Cartelle

```
src/stories/
├── atoms/
│   └── buttons/
│       ├── StandardButton.stories.js
│       ├── IconButton.stories.js
│       └── LinkButton.stories.js
├── organisms/
│   ├── Cards.stories.js
│   ├── CardsLive.stories.js
│   ├── CardsOriginal.stories.js
│   ├── Header.stories.js
│   ├── Footer.stories.js
│   ├── Hero.stories.js
│   ├── Columns.stories.js
│   └── Fragment.stories.js
├── molecules/
│   └── (pronto per futuri componenti)
├── development/
│   └── IntegrationTests.stories.js
└── (altri file non-EDS rimangono nella root)
```

## 🏗️ Struttura Organizzativa

### **Atoms/Buttons/**
Componenti atomici per i pulsanti, seguendo la struttura `blocks/atoms/buttons/`:

- **`Atoms/Buttons/Standard Button`** (`atoms/buttons/StandardButton.stories.js`)
  - Pulsante standard con varianti: primary, accent, secondary
  - Stati: hover, pressed, disabled, loading
  - Dimensioni: small, medium, large

- **`Atoms/Buttons/Icon Button`** (`atoms/buttons/IconButton.stories.js`)
  - Pulsanti con icone
  - Varianti e stati completi
  - Icone di esempio integrate

- **`Atoms/Buttons/Link Button`** (`atoms/buttons/LinkButton.stories.js`)
  - Pulsanti che funzionano come link
  - Supporto per link esterni, download
  - Attributi target e rel configurabili

### **Organisms/**
Componenti complessi che rappresentano sezioni complete, seguendo la struttura `blocks/`:

- **`Organisms/Cards`** (`organisms/CardsLive.stories.js`)
  - Implementazione principale delle cards
  - Test live con dati reali

- **`Organisms/Cards/Original Implementation`** (`organisms/CardsOriginal.stories.js`)
  - Versione originale del componente cards
  - Esempi con numero variabile di cards

- **`Organisms/Cards/Advanced Examples`** (`organisms/Cards.stories.js`)
  - Esempi avanzati e personalizzazioni
  - Layout a colonne configurabili

- **`Organisms/Header`** (`organisms/Header.stories.js`)
  - Componente header del sito

- **`Organisms/Footer`** (`organisms/Footer.stories.js`)
  - Componente footer del sito

- **`Organisms/Hero`** (`organisms/Hero.stories.js`)
  - Sezioni hero per landing page
  - Varianti con e senza immagini di sfondo

- **`Organisms/Columns`** (`organisms/Columns.stories.js`)
  - Layout a colonne responsive
  - Da 2 a 4 colonne configurabili

- **`Organisms/Fragment`** (`organisms/Fragment.stories.js`)
  - Frammenti di contenuto riutilizzabili
  - Caricamento dinamico di contenuti

### **Molecules/**
Componenti di media complessità (pronto per futuri sviluppi):
- Cartella preparata per accogliere componenti molecolari
- Struttura fisica già creata in `molecules/`

### **Development/**
Strumenti di sviluppo e test:

- **`Development/Integration Tests`** (`development/IntegrationTests.stories.js`)
  - Test di integrazione EDS
  - Verifiche di configurazione
  - Controlli di caricamento CSS e Web Components

## 🎯 Benefici della Nuova Organizzazione

### **1. Coerenza Architettonica**
- La navigazione in Storybook rispecchia esattamente la struttura dei `blocks/`
- Facile comprensione della gerarchia dei componenti
- Allineamento con i principi di Atomic Design

### **2. Navigazione Intuitiva**
- Raggruppamento logico per tipologia di componente
- Facile individuazione dei componenti desiderati
- Struttura scalabile per futuri componenti

### **3. Struttura Fisica Organizzata**
- **Cartelle fisiche** che rispecchiano la gerarchia logica
- **File rinominati** con nomi più chiari e descrittivi
- **Separazione netta** tra componenti EDS e altri file
- **Scalabilità** per futuri componenti nelle categorie appropriate

### **4. Manutenibilità**
- Organizzazione chiara per sviluppatori
- Facile aggiunta di nuovi componenti nella categoria corretta
- Documentazione auto-esplicativa
- **Percorsi file** che riflettono la struttura logica

### **5. Esperienza Utente Migliorata**
- Designer e sviluppatori possono navigare facilmente
- Comprensione immediata della gerarchia dei componenti
- Accesso rapido a esempi e varianti
- **Struttura del progetto** più intuitiva e professionale

## 🔄 Importazioni Dirette

Tutti i componenti importano direttamente dai `blocks/` originali utilizzando gli alias Vite:

```javascript
// Esempio di importazione
import componentDecorate from '@blocks/component-name/component-name.js';
import '@blocks/component-name/component-name.css';
```

Questo garantisce:
- **Zero duplicazione** del codice
- **Aggiornamenti automatici** quando si modifica il componente originale
- **Single source of truth** per tutti i componenti

## 📱 Accesso a Storybook

Storybook è accessibile all'indirizzo: **http://localhost:6006/**

La nuova organizzazione è immediatamente visibile nella sidebar di navigazione, con una struttura ad albero che riflette perfettamente l'architettura EDS.

---

*Documento aggiornato: Gennaio 2025*
*Versione Storybook: 10.0.0*