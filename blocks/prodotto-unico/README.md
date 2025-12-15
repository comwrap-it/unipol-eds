# Prodotto Unico Component

## Overview

Il componente **Prodotto Unico** integra un'applicazione Angular (`tpd-interprete-angular-dx-api-pu`) all'interno di AEM EDS. Il componente carica dinamicamente gli script e gli stili necessari e inizializza l'applicazione Angular.

## Component Type

- **Level**: Organism
- **Category**: External Integration
- **Technology**: Angular (Custom Element)

## Setup e Configurazione

### Ottenere i Parametri da qa.unipol.it

Prima di utilizzare il componente, è necessario ottenere i seguenti parametri dall'ambiente QA:

1. **`caseId-pu`**: ID del caso da qa.unipol.it
2. **`assignmentId-pu`**: Oggetto JSON con i dati dell'assegnazione da qa.unipol.it

#### Come ottenere i parametri:

1. Accedi a **qa.unipol.it**
2. Naviga alla sezione relativa al prodotto Unica
3. Apri la console del browser (F12)
4. Recupera i valori di:
   - `sessionStorage.getItem('caseId-pu')` per il caseId
   - `sessionStorage.getItem('assignmentId-pu')` per l'assignmentId

### Script di Inizializzazione

Per inizializzare il componente e navigare alla pagina, esegui il seguente script nella console del browser:

```javascript
let start = (dk, caseId, assignmentId) => {
  localStorage.setItem("_dk", JSON.stringify(dk));
  sessionStorage.setItem("caseId-pu", caseId);
  sessionStorage.setItem("assignmentId-pu", JSON.stringify(assignmentId));
  window.location.href = "/prodotto-unico";
};

start(
  {
    "clientId": "713e8770-0bde-47cb-ac0b-f0faf211d0af",
    "clientSecret": "vB3hL4rC5uM6xQ8wX0uH4vL8fR3iC0xL2tC8iN0bK6cW2pB7iO",
    "apiKey": "AIzaSyBdutiwcN-MfwP4a31SKdRGgv5qtktHSvA"
  },
  "caseId-pu", // <-- Sostituisci con il valore ottenuto da qa.unipol.it
  {} // <-- Sostituisci con l'oggetto assignmentId ottenuto da qa.unipol.it
);
```

## Esempio Completo

```javascript
let start = (dk, caseId, assignmentId) => {
  localStorage.setItem("_dk", JSON.stringify(dk));
  sessionStorage.setItem("caseId-pu", caseId);
  sessionStorage.setItem("assignmentId-pu", JSON.stringify(assignmentId));
  window.location.href = "/prodotto-unico";
};

start(
  {
    "clientId": "713e8770-0bde-47cb-ac0b-f0faf211d0af",
    "clientSecret": "vB3hL4rC5uM6xQ8wX0uH4vL8fR3iC0xL2tC8iN0bK6cW2pB7iO",
    "apiKey": "AIzaSyBdutiwcN-MfwP4a31SKdRGgv5qtktHSvA"
  },
  "UG-INS-PU-WORK-QUOTAZIONE Q-50526", // caseId-pu da qa.unipol.it
  {"value":"ASSIGN-WORKLIST UG-INS-PU-WORK-QUOTAZIONE Q-50526!RACCOLTADATIPET","expiry":1764344965194} // assignmentId-pu da qa.unipol.it
);
```

## Funzionamento

1. Lo script salva le credenziali (`dk`) in `localStorage`
2. I parametri `caseId-pu` e `assignmentId-pu` vengono salvati in `sessionStorage`
3. La pagina viene reindirizzata a `/prodotto-unico`
4. Il componente Prodotto Unico carica automaticamente:
   - CSS: `/static/css/styles.css`
   - JavaScript (in ordine):
     - `/static/js/runtime.js`
     - `/static/js/polyfills.js`
     - `/static/js/vendor.js`
     - `/static/js/main.js`
5. L'applicazione Angular si inizializza nell'elemento `<tpd-interprete-angular-dx-api-pu>`

## Note Importanti

- ⚠️ I parametri `caseId-pu` e `assignmentId-pu` **devono essere ottenuti da qa.unipol.it** prima di eseguire lo script
- ⚠️ Assicurati che la rotta `/prodotto-unico` sia configurata correttamente nel progetto
- ⚠️ Le credenziali nel parametro `dk` sono sensibili e non devono essere committate nel repository

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Richiede supporto per ES6 Modules
- Richiede supporto per Custom Elements

## File Structure

```
blocks/prodotto-unico/
├── prodotto-unico.js          # Logica di caricamento e inizializzazione
├── prodotto-unico.css         # Stili del container e ingombro iniziale
├── _prodotto-unico.json       # Configurazione Universal Editor
└── README.md                   # Questa documentazione
```

## Related Components

- **Section** (Template) - Container per il blocco prodotto-unico
- **Header** (Organism) - Header della pagina che contiene il componente

