# Dynamic Gallery Card

## Panoramica
Componente “card” utilizzato all’interno della **Dynamic Gallery Row**.

Ogni card mostra:
- Un’immagine (16:9)
- Un tag (opzionale) in alto a sinistra
- Un overlay (su hover) con un bottone (opzionale)

## Come utilizzare

### Campi principali
1. **Immagine** (*obbligatoria*)
2. **Testo alternativo per l’immagine** (*obbligatorio*)

### Tag (opzionale)
Puoi configurare un tag tramite:
- **Tag text**
- **Tag Category**
- **Tag type**

### Bottone (opzionale)
- **Testo Bottone**: testo mostrato nel bottone
- **Link**: selezionato tramite AEM Content Picker

Se compili sia Testo Bottone che Link, su hover viene mostrato l’overlay con il bottone.

## Note importanti
- Il click del bottone è gestito per caricare un fragment e iniettarlo nella pagina (non come navigazione standard).
- Se mancano Testo Bottone o Link, l’overlay non conterrà alcun bottone.
