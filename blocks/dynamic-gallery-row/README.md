# Dynamic Gallery Row

## Panoramica
Blocca che visualizza una galleria “in scorrimento continuo” (marquee) composta da una sequenza di **Dynamic Gallery Card**.

Il blocco:
- Renderizza le card una dopo l’altra su una singola riga
- Avvia automaticamente lo scorrimento (fuori da Author Mode)
- Espone un pulsante **play/pause** a livello di sezione per mettere in pausa o riprendere l’animazione

## Come utilizzare

### 1) Inserisci il blocco
Aggiungi il blocco **Dynamic Gallery Row** nella pagina.

### 2) Aggiungi uno o più elementi “Dynamic Gallery Card”
Il contenuto del blocco è una lista di card. Ogni card può includere:
- **Immagine** (obbligatoria)
- **Testo alternativo** (obbligatorio)
- **Tag** (opzionale)
- **Bottone** (opzionale, visibile su hover)

### 3) Configura il bottone (opzionale)
Se compili sia **Testo Bottone** che **Link** (tramite content picker), su hover viene mostrato un overlay con un bottone.

Nota: il link è pensato per puntare a un **fragment**; al click il fragment viene caricato e iniettato nella pagina.

## Note importanti
- In Author Mode lo scorrimento automatico e la duplicazione delle card sono disabilitati per facilitare l’editing.
- Il blocco aggiunge un pulsante play/pause una sola volta per sezione.
