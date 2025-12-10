/**
 * Editorial Carousel Card - modular version.
 */
import { extractInstrumentationAttributes } from '../atoms/buttons/standard-button/standard-button.js';
import { createLinkButtonFromRows } from '../atoms/buttons/link-button/link-button.js';
import { createTagFromRows } from '../atoms/tag/tag.js';
import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

let stylesLoaded = false;

async function ensureStylesLoaded() {
  if (stylesLoaded) return;
  const { loadCSS } = await import('../../scripts/aem.js');
  await Promise.all([
    loadCSS(
      `${window.hlx.codeBasePath}/blocks/atoms/buttons/link-button/link-button.css`,
    ),
    loadCSS(`${window.hlx.codeBasePath}/blocks/atoms/tag/tag.css`),
    loadCSS(`${window.hlx.codeBasePath}/blocks/atoms/icons-3D/icons-3D.css`),
  ]);
  stylesLoaded = true;
}

function getRows(block) {
  const wrapper = block.querySelector('.default-content-wrapper');
  return wrapper ? Array.from(wrapper.children) : Array.from(block.children);
}

function buildImageSection(rows) {
  const imageRow = rows[13];
  if (!imageRow) return null;

  const cardImage = document.createElement('div');
  cardImage.className = 'editorial-carousel-card-image';

  const tagRows = rows.slice(10, 13);
  const tagElement = createTagFromRows(tagRows);
  if (tagElement?.classList) {
    tagElement.classList.add('editorial-carousel-card-tag');
    cardImage.appendChild(tagElement);
  }

  const altText = rows[14]?.textContent?.trim() || '';
  const picture = imageRow.querySelector('picture');
  if (picture) {
    picture.querySelector('img')?.setAttribute('alt', altText);
    cardImage.appendChild(picture);
  } else {
    const img = imageRow.querySelector('img');
    const link = imageRow.querySelector('a');
    const src = img?.src || link?.href;

    if (src) {
      const optimizedPic = createOptimizedPicture(
        src,
        altText,
        false,
        [
          { media: '(min-width: 769)', width: '316' },
          { media: '(max-width: 768)', width: '240' },
          { media: '(max-width: 392)', width: '343' },
        ],
      );
      const newImg = optimizedPic.querySelector('img');
      if (newImg && img) moveInstrumentation(img, newImg);
      if (newImg && link) moveInstrumentation(link, newImg);
      cardImage.appendChild(optimizedPic);
    }
  }

  return cardImage.children.length ? cardImage : null;
}

function buildTextSection(rows) {
  const cardTextContent = document.createElement('div');
  cardTextContent.className = 'editorial-carousel-card-text';

  const titleRow = rows[0];
  if (titleRow) {
    const existingHeading = titleRow.querySelector('h1, h2, h3, h4, h5, h6');
    if (existingHeading) {
      existingHeading.className = 'title';
      moveInstrumentation(titleRow, existingHeading);
      cardTextContent.appendChild(existingHeading);
    } else {
      const title = document.createElement('h3');
      title.className = 'title';
      while (titleRow.firstChild) {
        title.appendChild(titleRow.firstChild);
      }
      moveInstrumentation(titleRow, title);
      if (title.textContent?.trim()) {
        cardTextContent.appendChild(title);
      }
    }
  }

  const subtitleRow = rows[1];
  if (subtitleRow) {
    const existingPara = subtitleRow.querySelector('p');
    if (existingPara) {
      existingPara.className = 'description';
      moveInstrumentation(subtitleRow, existingPara);
      cardTextContent.appendChild(existingPara);
    } else if (subtitleRow.textContent?.trim()) {
      const subtitle = document.createElement('p');
      subtitle.className = 'description';
      while (subtitleRow.firstChild) {
        subtitle.appendChild(subtitleRow.firstChild);
      }
      moveInstrumentation(subtitleRow, subtitle);
      cardTextContent.appendChild(subtitle);
    }
  }

  return cardTextContent;
}

function buildButtonsSection(rows) {
  const buttonRows = rows.slice(2, 9);
  const buttonElement = createLinkButtonFromRows(buttonRows);
  if (!buttonElement) return null;

  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'button-subdescription';
  buttonsContainer.appendChild(buttonElement);

  const note = rows[9];
  if (note) {
    const existingPara = note.querySelector('p');
    if (existingPara) {
      existingPara.className = 'subdescription';
      moveInstrumentation(note, existingPara);
      buttonsContainer.appendChild(existingPara);
    } else if (note.textContent?.trim()) {
      const noteFromHTML = document.createElement('p');
      noteFromHTML.className = 'subdescription';
      while (note.firstChild) {
        noteFromHTML.appendChild(note.firstChild);
      }
      moveInstrumentation(note, noteFromHTML);
      buttonsContainer.appendChild(noteFromHTML);
    }
  }

  return buttonsContainer;
}

function applyInstrumentation(card, instrumentation, block) {
  Object.entries(instrumentation).forEach(([name, value]) => {
    card.setAttribute(name, value);
  });
  if (block.dataset.blockName) {
    card.dataset.blockName = block.dataset.blockName;
  }
}

export default async function handleEditorialProductCarouselWidget(block) {
  if (!block || block.classList.contains('card-block')) return;
  await ensureStylesLoaded();

  const rows = getRows(block);
  const instrumentation = extractInstrumentationAttributes(rows[0]);

  const card = document.createElement('div');
  card.className = 'editorial-carousel-card-container';

  const cardContent = document.createElement('div');
  cardContent.className = 'editorial-carousel-card-content';

  const imageSection = buildImageSection(rows);
  const textSection = buildTextSection(rows);
  const buttonsSection = buildButtonsSection(rows);

  if (imageSection) card.appendChild(imageSection);
  if (textSection) cardContent.appendChild(textSection);
  if (buttonsSection) cardContent.appendChild(buttonsSection);
  if (cardContent.children.length > 0) {
    card.appendChild(cardContent);
  }

  applyInstrumentation(card, instrumentation, block);
  card.classList.add('card-block');
  block.replaceChildren(card);
}
