import { loadCSS } from "../../../scripts/aem.js";
import { createWarrantyCard } from "../../molecules/cards/warranty-card/warranty-card.js";

/**
 * ensures styles are loaded only once
 */
let isStylesAlreadyLoaded = false;
const ensureStylesLoaded = async () => {
  if (isStylesAlreadyLoaded) return;
  await loadCSS("../../molecules/cards/warranty-card/warranty-card.css");
  isStylesAlreadyLoaded = true;
};

/**
 * @typedef {Object} WarrantyCardProps
 * @property {string} category
 * @property {string} title
 * @property {string} description
 * @property {string} icon
 * @property {{label: string, href: string}} linkButtonConfig
 * @property {{label: string, category?: string, type?: string}} tagConfig
 * @property {HTMLElement} titleRow
 * @property {HTMLElement} descriptionRow
 */

/**
 * Builds a card grid from structured card configs.
 * Each card supports the documented properties above.
 * @param {WarrantyCardProps[]} cards
 * @returns {Promise<HTMLElement>} The card grid element
 */
export default async function createCardGrid(
  cards
) {
  ensureStylesLoaded();
  // Create card grid container
  const cardGrid = document.createElement("div");
  cardGrid.className = "card-grid reveal-in-up";

  // Process each row as a warranty card
  const cardPromises = cards.map(async (card) => {
    const newCard = await createWarrantyCard(
        card.category,
        card.title,
        card.description,
        card.icon,
        card.linkButtonConfig,
        card.tagConfig,
        card.titleRow,
        card.descriptionRow,
    );
    cardGrid.appendChild(newCard);
  });
  await Promise.all(cardPromises);

  return cardGrid;
}
