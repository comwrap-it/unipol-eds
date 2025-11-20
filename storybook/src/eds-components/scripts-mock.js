/**
 * Mock delle funzioni scripts per Storybook
 * Questo file sostituisce le dipendenze da scripts/scripts.js per i componenti EDS
 */

export function moveInstrumentation(from, to) {
  // In Storybook non abbiamo bisogno dell'instrumentazione
  // Questa è una funzione no-op per evitare errori
  return;
}

// Altre funzioni mock che potrebbero essere necessarie
export function getEnvType() {
  return 'storybook';
}

export function buildAutoBlocks() {
  // No-op in Storybook
}

export function loadEager() {
  // No-op in Storybook
}

export function loadLazy() {
  // No-op in Storybook
}