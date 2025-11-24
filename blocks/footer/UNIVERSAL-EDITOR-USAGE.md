# Footer - Uso in Universal Editor

## Dove Aggiungere il Componente

### ✅ **CORRETTO: Nel Fragment `/footer`**

Il componente footer deve essere aggiunto **dentro il fragment `/footer`**, che viene caricato automaticamente dal blocco `footer` su tutte le pagine.

**Struttura**:
```
/footer (Fragment Page)
└── Section (div con classe "section footer-section")
    └── footer-unipol (Block)
        ├── text-list (Column 1)
        ├── text-list (Column 2)
        ├── text-list (Column 3)
        ├── text-list (Column 4)
        ├── footer-download-section
        ├── footer-utility-links
        └── footer-bottom
```

### ❌ **NON CORRETTO: Direttamente nelle Pagine**

**NON** aggiungere il footer direttamente in:
- ❌ `<main>` delle pagine normali
- ❌ Section delle pagine normali

**Perché?**
- Il footer deve essere **globale** e apparire su tutte le pagine
- Il fragment `/footer` viene caricato automaticamente dal blocco `footer`
- Se aggiunto direttamente nelle pagine, apparirebbe solo su quelle pagine specifiche

---

## Struttura AEM EDS

### Struttura Generale

```
<body>
  <header></header>  ← Auto-popolato dal blocco header
  <main>
    <div class="section">  ← Section 1
      <!-- Contenuto pagina -->
    </div>
    <div class="section">  ← Section 2
      <!-- Contenuto pagina -->
    </div>
  </main>
  <footer></footer>  ← Auto-popolato dal blocco footer
</body>
```

### Come Funziona il Footer

```
┌─────────────────────────────────────┐
│ <footer> (vuoto nella pagina)       │
│                                     │
│  ↓                                  │
│  Footer Block (footer.js)          │
│  ↓                                  │
│  Carica Fragment /footer            │
│  ↓                                  │
│  Se trova footer-section → Usa quello│
│  Se trova footer-unipol → Usa quello│
│  Altrimenti → Usa default footer    │
│  ↓                                  │
│  Popola <footer>                    │
└─────────────────────────────────────┘
```

---

## Istruzioni Passo-Passo

### Step 1: Accedi al Fragment `/footer`

1. Vai su **AEM EDS Universal Editor**
2. Naviga alla pagina `/footer` (o creala se non esiste)
3. Questa è una **pagina fragment**, non una pagina normale

### Step 2: Aggiungi una Section con Classe `footer-section`

1. Clicca su **"Add Section"** o **"Aggiungi Section"**
2. Viene creata una `<div class="section">`
3. **IMPORTANTE**: Aggiungi la classe `footer-section` alla section
   - Nelle proprietà della section, aggiungi `footer-section` come classe aggiuntiva
   - Oppure usa lo stile metadata della section per aggiungere la classe

### Step 3: Aggiungi il Block `footer-unipol`

1. Dentro la section, clicca su **"Add Block"** o **"Aggiungi Blocco"**
2. Seleziona o digita: **`footer-unipol`**
3. Il blocco viene creato con classe `footer-unipol block`

### Step 4: Configura le Colonne di Link (text-list)

**Per ogni colonna di link**:
1. Aggiungi un blocco **`text-list`** dentro `footer-unipol`
2. Configura il text-list:
   - **Row 1**: Titolo della colonna (opzionale)
   - **Row 2+**: Link (uno per riga)
     - Testo del link
     - URL del link

**Esempio - Colonna 1: "Prodotti"**
```
text-list
├── Row 1: "Prodotti" (titolo)
├── Row 2: "Auto" | /auto
├── Row 3: "Casa" | /casa
└── Row 4: "Vita" | /vita
```

### Step 5: Configura Footer Download Section

1. Aggiungi un blocco **`footer-download-section`** dentro `footer-unipol`
2. Configura le righe:
   - **Row 1**: Logo Unipol (immagine)
   - **Row 2**: Testo bottone Unipol Group
   - **Row 3**: URL bottone Unipol Group
   - **Row 4**: Icona bottone Unipol Group (immagine)
   - **Row 5**: Immagine QR Code
   - **Row 6**: Testo QR Code
   - **Row 7**: Immagine Google Play
   - **Row 8**: URL Google Play
   - **Row 9**: Immagine App Store
   - **Row 10**: URL App Store

### Step 6: Configura Footer Utility Links

1. Aggiungi un blocco **`footer-utility-links`** dentro `footer-unipol`
2. Per ogni link utility, aggiungi una riga:
   - **Row 1**: Link Privacy | /privacy
   - **Row 2**: Link Termini | /termini
   - **Row 3**: Link Cookie | /cookie
   - ... e così via

### Step 7: Configura Footer Bottom

1. Aggiungi un blocco **`footer-bottom`** dentro `footer-unipol`
2. Configura:
   - **Row 1**: Testo copyright (può essere un blocco `footer-text` con richtext)
   - **Row 2+**: Icone social (una per riga, usando `footer-social-icon`)
     - Immagine icona
     - URL social media
     - Label accessibilità

---

## Esempio Completo

### Fragment `/footer` in Universal Editor

```
┌─────────────────────────────────────────┐
│ /footer (Fragment Page)                  │
├─────────────────────────────────────────┤
│ Section (footer-section)                │
│ ┌─────────────────────────────────────┐ │
│ │ footer-unipol                       │ │
│ ├─────────────────────────────────────┤ │
│ │ text-list (Colonna 1)              │ │
│ │ ├── Row 1: "Prodotti"              │ │
│ │ ├── Row 2: Auto | /auto             │ │
│ │ └── Row 3: Casa | /casa             │ │
│ │                                     │ │
│ │ text-list (Colonna 2)              │ │
│ │ ├── Row 1: "Servizi"                │ │
│ │ └── Row 2: Assistenza | /assistenza  │ │
│ │                                     │ │
│ │ footer-download-section            │ │
│ │ ├── Row 1: [Logo]                   │ │
│ │ ├── Row 2: "Scarica l'app"          │ │
│ │ ├── Row 3: /app                     │ │
│ │ ├── Row 4: [Icona]                 │ │
│ │ ├── Row 5: [QR Code]               │ │
│ │ ├── Row 6: "Scansiona per scaricare"│ │
│ │ ├── Row 7: [Google Play]           │ │
│ │ ├── Row 8: /google-play             │ │
│ │ ├── Row 9: [App Store]             │ │
│ │ └── Row 10: /app-store              │ │
│ │                                     │ │
│ │ footer-utility-links               │ │
│ │ ├── Row 1: Privacy | /privacy       │ │
│ │ ├── Row 2: Termini | /termini       │ │
│ │ └── Row 3: Cookie | /cookie         │ │
│ │                                     │ │
│ │ footer-bottom                      │ │
│ │ ├── Row 1: "© 2024 Unipol..."       │ │
│ │ ├── Row 2: [Facebook Icon] | /fb    │ │
│ │ ├── Row 3: [Twitter Icon] | /tw     │ │
│ │ └── Row 4: [LinkedIn Icon] | /li     │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## Struttura Componenti

### Organismo: `footer-unipol`

**Componenti supportati** (in ordine):
1. `text-list` - Colonne di link (una o più)
2. `footer-link-column` - Wrapper per text-list (opzionale)
3. `footer-download-section` - Sezione download app
4. `footer-utility-links` - Link utility (privacy, termini, ecc.)
5. `footer-bottom` - Sezione bottom (copyright + social)

### Molecole

#### `footer-download-section`
- **Row 1**: Logo Unipol (immagine)
- **Row 2**: Testo bottone
- **Row 3**: URL bottone
- **Row 4**: Icona bottone (immagine)
- **Row 5**: QR Code (immagine)
- **Row 6**: Testo QR Code
- **Row 7**: Google Play (immagine)
- **Row 8**: URL Google Play
- **Row 9**: App Store (immagine)
- **Row 10**: URL App Store

#### `footer-utility-links`
- **Row 1+**: Link utility (uno per riga)
  - Formato: Testo | URL

#### `footer-bottom`
- **Row 1**: Testo copyright (può essere `footer-text` con richtext)
- **Row 2+**: Icone social (una per riga)
  - Immagine icona
  - URL social media
  - Label accessibilità

### Atomi

#### `footer-text`
- **Row 1**: Testo (richtext supportato)

#### `footer-social-icon`
- **Row 1**: Immagine icona
- **Row 2**: URL social media
- **Row 3**: Label accessibilità

#### `footer-link`
- **Row 1**: Testo link
- **Row 2**: URL link
- **Row 3**: Variant (default | utility)

---

## Domande Frequenti

### Q: Posso aggiungere il footer direttamente in una pagina normale?

**A**: **NO**. Se lo aggiungi direttamente in una pagina:
- ❌ Apparirà solo su quella pagina specifica
- ❌ Non sarà globale
- ❌ Non seguirà il pattern AEM EDS per i footer

**Soluzione**: Aggiungilo sempre nel fragment `/footer`.

---

### Q: La section deve avere la classe `footer-section`?

**A**: **SÌ, è importante**. La classe `footer-section` permette al decoratore `footer-section.js` di riconoscere e organizzare correttamente i blocchi.

**Come aggiungerla**:
1. Nelle proprietà della section in Universal Editor
2. Oppure usando lo stile metadata della section

---

### Q: Posso avere più blocchi `footer-unipol` nel fragment?

**A**: **Tecnicamente sì, ma non consigliato**. Il codice cerca il **primo** blocco `footer-unipol` o `footer-section` trovato. Avere più blocchi potrebbe causare comportamenti inattesi.

**Best Practice**: Un solo blocco `footer-unipol` per fragment, dentro una section con classe `footer-section`.

---

### Q: Cosa succede se non aggiungo `footer-unipol` nel fragment?

**A**: Il sistema usa automaticamente la **struttura footer di default** di AEM EDS.

**Fallback**: Se `footer-unipol` non è presente, viene usata la struttura footer standard.

---

### Q: Posso mettere `footer-unipol` in una section insieme ad altri blocchi?

**A**: **Sì, ma non necessario**. Il fragment `/footer` tipicamente contiene solo il footer. Puoi metterlo insieme ad altri blocchi, ma è meglio tenerlo isolato per chiarezza.

---

### Q: Il fragment `/footer` deve essere una pagina separata?

**A**: **SÌ**. Il fragment `/footer` è una pagina separata che viene caricata dinamicamente dal blocco `footer`. Non è parte del contenuto delle pagine normali.

---

### Q: Come funziona l'editabilità in Universal Editor?

**A**: Tutte le componenti del footer sono **completamente editabili** in Universal Editor:

✅ **Blocchi editabili**: Ogni blocco (footer-unipol, footer-download-section, ecc.) mantiene gli attributi `data-aue-*` per l'editabilità

✅ **Elementi interni editabili**: Link, testi, immagini mantengono i loro attributi di instrumentation

✅ **Richtext supportato**: I testi possono usare richtext per formattazione avanzata

✅ **Preservazione attributi**: Tutti gli attributi Universal Editor vengono preservati durante la decorazione

---

## Verifica

### Come Verificare che Funzioni

1. **Apri Universal Editor** su una pagina qualsiasi
2. **Controlla il footer**: Dovrebbe mostrare `footer-unipol` se configurato
3. **Apri DevTools**:
   ```javascript
   // Verifica che footer-unipol sia presente
   document.querySelector('.footer-unipol');
   // Dovrebbe restituire l'elemento
   ```

4. **Verifica attributi Universal Editor**:
   ```javascript
   // Verifica che gli attributi data-aue-* siano presenti
   document.querySelector('.footer-unipol')?.hasAttribute('data-aue-resource');
   // Dovrebbe restituire true
   ```

5. **Controlla Console**: Non dovrebbero esserci errori

### Se Non Funziona

1. **Verifica Fragment Path**:
   ```javascript
   // In console
   document.querySelector('meta[name="footer"]')?.content;
   // Dovrebbe essere "/footer" o il tuo path
   ```

2. **Verifica Block Class**:
   ```html
   <!-- Nel fragment /footer -->
   <div class="footer-unipol block" data-block-name="footer-unipol">
   ```

3. **Verifica Section Class**:
   ```html
   <!-- Nel fragment /footer -->
   <div class="section footer-section">
   ```

4. **Verifica Metadata**:
   - La pagina deve avere: `<meta name="footer" content="/footer">`

---

## Best Practices

### ✅ DO (Fai)

- ✅ Aggiungi il footer nel fragment `/footer`
- ✅ Mettilo dentro una section con classe `footer-section`
- ✅ Configura tutti i blocchi nell'ordine corretto
- ✅ Usa `text-list` per le colonne di link
- ✅ Testa su più pagine per verificare che sia globale
- ✅ Verifica che tutti gli elementi siano editabili in Universal Editor

### ❌ DON'T (Non Fare)

- ❌ Non aggiungere direttamente nelle pagine normali
- ❌ Non mettere in `<main>` delle pagine
- ❌ Non dimenticare la classe `footer-section` sulla section
- ❌ Non creare più blocchi `footer-unipol` nello stesso fragment
- ❌ Non dimenticare di configurare il metadata `footer`

---

## Riepilogo

| Dove | Come | Quando |
|------|------|--------|
| **Fragment `/footer`** | ✅ Dentro una Section con classe `footer-section` | Sempre |
| **Pagina normale** | ❌ Non aggiungere | Mai |
| **Section di pagina** | ❌ Non aggiungere | Mai |
| **Main di pagina** | ❌ Non aggiungere | Mai |

**Regola d'oro**: Il footer va **solo** nel fragment `/footer`, dentro una section con classe `footer-section`.

---

## Struttura Completa del Footer

```
/footer (Fragment)
└── Section (footer-section)
    └── footer-unipol
        ├── text-list (Colonna 1)
        ├── text-list (Colonna 2)
        ├── text-list (Colonna 3)
        ├── text-list (Colonna 4)
        ├── footer-download-section
        ├── footer-utility-links
        └── footer-bottom
            ├── footer-text (copyright)
            └── footer-social-icon (multiple)
```

---

**Last Updated**: December 2024  
**Status**: ✅ Production Ready  
**Usage**: Fragment `/footer` → Section (`footer-section`) → Block `footer-unipol`

