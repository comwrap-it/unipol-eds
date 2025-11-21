# Number Block - Character Limits Implementation

## Problema Identificato

La proprietà `maxlength` in Universal Editor **non sempre funziona in modo affidabile**, specialmente con il componente `text-input`. Gli autori potrebbero riuscire a inserire più caratteri del limite specificato.

## Soluzione Implementata

Abbiamo implementato un **doppio livello di validazione**:

### 1. ✅ Validazione in Universal Editor (JSON)

**File**: `_number-block.json`

```json
{
  "component": "text",          // ← Cambiato da "text-input"
  "label": "Titolo blocco 1",
  "name": "numberBlockText1",
  "maxlength": 7                // ← Limite UI
}
```

**Modifiche**:
- ✅ `text-input` → `text` (supporto migliore per `maxlength`)
- ✅ Rimosso `valueType: "string"` (non necessario per `text`)
- ✅ Aggiunto `maxlength` su tutti i campi richtext

### 2. ✅ Validazione JavaScript (Fallback)

**File**: `number-block.js`

```javascript
// Character limits
const MAX_TITLE_LENGTH = 7;
const MAX_DESCRIPTION_LENGTH = 40;

// Truncate function
function truncateTextContent(element, maxLength) {
  const textContent = element.textContent || '';
  if (textContent.length > maxLength) {
    const truncated = textContent.substring(0, maxLength);
    element.textContent = truncated;
    console.warn(`Text truncated to ${maxLength} characters`);
  }
}

// Applied in decorate()
if (rowIndex === 0 || rowIndex === 2 || rowIndex === 4) {
  truncateTextContent(inner, MAX_TITLE_LENGTH);    // 7 chars
} else if (rowIndex === 1 || rowIndex === 3 || rowIndex === 5) {
  truncateTextContent(inner, MAX_DESCRIPTION_LENGTH); // 40 chars
}
```

**Vantaggi**:
- ✅ **Garantisce** i limiti anche se Universal Editor fallisce
- ✅ Logging in console per debugging
- ✅ Non rompe l'instrumentation AEM
- ✅ Performance: validazione solo al render

---

## Limiti Configurati

### Titoli (Valori Numerici)
**Limite**: 7 caratteri

**Esempi validi**:
```
1.500+   (6 caratteri)
99,9%    (5 caratteri)
€50.000  (7 caratteri)
10 anni  (7 caratteri)
5.000    (5 caratteri)
```

**Perché 7 caratteri?**
- Permette numeri grandi con separatori
- Include simboli (%, €, +)
- Mantiene il layout compatto
- Ottimale per mobile

### Descrizioni
**Limite**: 40 caratteri

**Esempi validi**:
```
"Clienti soddisfatti"                    (21 caratteri)
"Anni di esperienza nel settore"        (32 caratteri)
"Prodotti assicurativi disponibili"     (35 caratteri)
"Consulenti pronti ad aiutarti"         (31 caratteri)
```

**Perché 40 caratteri?**
- 1-2 righe di testo su desktop
- 2-3 righe su mobile
- Leggibilità ottimale
- Descrizione concisa ma informativa

---

## Comportamento del Sistema

### Scenario 1: Autore Rispetta i Limiti
```
Input Universal Editor: "1.500+"
                        ↓
          JSON maxlength: OK (7 chars)
                        ↓
        JavaScript validate: OK (7 chars)
                        ↓
            Output: "1.500+"
```

### Scenario 2: Autore Supera i Limiti in UI
```
Input Universal Editor: "1.500 clienti"
                        ↓
          JSON maxlength: DOVREBBE bloccare
                        ↓
        JavaScript validate: TRONCA a "1.500 c"
                        ↓
            Output: "1.500 c" + warning console
```

### Scenario 3: Contenuto Esistente Troppo Lungo
```
Contenuto migrato: "Oltre 1.500 clienti"
                        ↓
        JavaScript validate: TRONCA a "Oltre 1"
                        ↓
   Output: "Oltre 1" + warning console
```

---

## Come Testare

### 1. Test in Universal Editor

**Passi**:
1. Apri Universal Editor
2. Seleziona/crea un Number Block
3. Prova a inserire più di 7 caratteri nel titolo
4. Prova a inserire più di 40 caratteri nella descrizione

**Risultato atteso**:
- ✅ Universal Editor dovrebbe bloccare l'input (dopo la modifica)
- ✅ Se riesci a inserire più caratteri, il JavaScript tronca al render

### 2. Test con Console

Apri DevTools Console e verifica i warning:

```javascript
// Se superi i limiti, vedrai:
"Text truncated to 7 characters: "1.500 c""
"Text truncated to 40 characters: "Clienti soddisfatti del nostro serviz""
```

### 3. Test Programmatico

```javascript
// In console browser:
const block = document.querySelector('.number-block');
const title = block.querySelector('.text-block-number');
console.log('Title length:', title.textContent.length); 
// Dovrebbe essere <= 7
```

---

## Migrazione Contenuti Esistenti

Se hai già contenuti che superano i limiti:

### ⚠️ Problema
I contenuti esistenti verranno troncati al primo render.

### ✅ Soluzione
Revisiona i contenuti prima della migrazione:

```bash
# Script per trovare contenuti troppo lunghi
grep -r "numberBlockText" content/ | while read line; do
  length=${#line}
  if [ $length -gt 7 ]; then
    echo "⚠️  Titolo troppo lungo: $line"
  fi
done
```

### 📝 Checklist Migrazione
- [ ] Identifica contenuti che superano i limiti
- [ ] Rivedi e abbrevia i testi
- [ ] Testa in staging
- [ ] Verifica layout su mobile
- [ ] Rilascia in produzione

---

## Troubleshooting

### Problema: Il limite non viene applicato

**Causa**: Cache browser o AEM

**Soluzione**:
```bash
# 1. Pulisci cache browser
Ctrl+Shift+R (hard reload)

# 2. Riavvia AEM (se necessario)
# 3. Verifica il JSON sia aggiornato
curl https://your-site.aem.live/blocks/number-block/_number-block.json
```

### Problema: Testo troncato male

**Causa**: Tronca caratteri UTF-8 multi-byte

**Soluzione**: La funzione `substring()` è sicura per UTF-8 in JavaScript moderno. Se hai problemi:

```javascript
// Alternativa sicura:
function safeSubstring(text, maxLength) {
  const chars = Array.from(text); // Gestisce emoji/unicode
  if (chars.length > maxLength) {
    return chars.slice(0, maxLength).join('');
  }
  return text;
}
```

### Problema: Warning in console troppi

**Causa**: JavaScript tronca ogni render

**Soluzione**: Correggi i contenuti in Universal Editor invece di affidarsi al troncamento automatico.

---

## Best Practices

### ✅ DO

1. **Rispetta i limiti durante l'authoring**
   ```
   ✓ "1.500+"
   ✓ "Clienti felici"
   ```

2. **Testa su mobile**
   - I limiti sono ottimizzati per mobile
   - Verifica sempre su viewport piccoli

3. **Usa abbreviazioni intelligenti**
   ```
   ✓ "10k+"    invece di "10.000+"
   ✓ "Esperti"  invece di "Esperti del settore"
   ```

4. **Monitora i warning**
   - Controlla la console periodicamente
   - Correggi contenuti che vengono troncati

### ❌ DON'T

1. **Non ignorare i warning**
   ```
   ✗ Lasciare contenuti che vengono sempre troncati
   ```

2. **Non aumentare i limiti senza motivo**
   ```
   ✗ MAX_TITLE_LENGTH = 20  // Rompe il layout!
   ```

3. **Non usare caratteri speciali inutili**
   ```
   ✗ "🎉 1.500+"  // Emoji conta come caratteri
   ```

4. **Non dimenticare le traduzioni**
   ```
   IT: "Clienti" (7 chars)
   DE: "Kunden" (6 chars) ✓
   EN: "Customers" (9 chars) ✗  // Troppo lungo!
   ```

---

## Modificare i Limiti

Se hai bisogno di cambiare i limiti:

### 1. Aggiorna JSON

```json
{
  "component": "text",
  "maxlength": 10  // ← Nuovo limite
}
```

### 2. Aggiorna JavaScript

```javascript
const MAX_TITLE_LENGTH = 10;  // ← Stesso valore
```

### 3. Aggiorna CSS

Se aumenti i limiti, verifica che il layout non si rompa:

```css
.text-block-number {
  /* Potrebbe servire più spazio */
  font-size: 2rem; /* Riduci se necessario */
}
```

### 4. Testa Tutto

- [ ] Universal Editor accetta il nuovo limite
- [ ] JavaScript tronca al nuovo limite
- [ ] Layout OK su desktop
- [ ] Layout OK su mobile
- [ ] Layout OK su tablet

---

## Riferimenti Tecnici

### File Modificati

```
blocks/number-block/
├── _number-block.json       ← Definizione campi + maxlength
├── number-block.js          ← Validazione JavaScript
├── number-block.css         ← Stili (non modificato)
└── CHARACTER-LIMITS.md      ← Questo documento
```

### Funzioni Chiave

| Funzione | Responsabilità |
|----------|---------------|
| `truncateTextContent()` | Tronca testo se supera limite |
| `processRow()` | Applica validazione per riga |
| `decorate()` | Orchestration principale |

### Costanti

```javascript
MAX_TITLE_LENGTH = 7;          // Valori numerici
MAX_DESCRIPTION_LENGTH = 40;   // Descrizioni testuali
```

---

## FAQ

**Q: Perché non usare `maxlength` HTML sull'input?**  
A: Universal Editor gestisce i suoi input, non possiamo controllare l'HTML direttamente.

**Q: Il troncamento è visibile all'utente finale?**  
A: No, avviene al render. L'utente finale vede solo il testo troncato.

**Q: Posso disabilitare il troncamento JavaScript?**  
A: Non raccomandato, ma puoi commentare le righe che chiamano `truncateTextContent()`.

**Q: Il troncamento rispetta le parole?**  
A: No, tronca esattamente al carattere N. Se serve word-boundary:

```javascript
function truncateWords(text, maxLength) {
  if (text.length <= maxLength) return text;
  const truncated = text.substring(0, maxLength);
  return truncated.substring(0, truncated.lastIndexOf(' '));
}
```

---

**Ultimo aggiornamento**: November 21, 2024  
**Versione**: 1.0  
**Status**: ✅ Production Ready

