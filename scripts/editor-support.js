import {
  decorateBlock,
  decorateBlocks,
  decorateButtons,
  decorateIcons,
  decorateSections,
  loadBlock,
  loadScript,
  loadSections,
} from './aem.js';
import { decorateRichtext } from './editor-support-rte.js';
import { decorateMain } from './scripts.js';

async function applyChanges(event) {
  // redecorate default content and blocks on patches (in the properties rail)
  const { detail } = event;

  // eslint-disable-next-line no-console
  console.log('🔧 applyChanges called', { detail });

  const resource = detail?.request?.target?.resource // update, patch components
    || detail?.request?.target?.container?.resource // update, patch, add to sections
    || detail?.request?.to?.container?.resource; // move in sections

  // eslint-disable-next-line no-console
  console.log('🔧 Resource:', resource);

  if (!resource) {
    // eslint-disable-next-line no-console
    console.log('❌ No resource found');
    return false;
  }
  const updates = detail?.response?.updates;

  // eslint-disable-next-line no-console
  console.log('🔧 Updates:', updates);

  if (!updates.length) {
    // eslint-disable-next-line no-console
    console.log('❌ No updates');
    return false;
  }

  // eslint-disable-next-line no-console
  console.log('🔍 FULL UPDATE OBJECT:', JSON.stringify(updates[0], null, 2));

  const { content } = updates[0];

  // eslint-disable-next-line no-console
  console.log('🔧 Content:', content ? `${content.substring(0, 200)}...` : 'NO CONTENT');

  if (!content) {
    // eslint-disable-next-line no-console
    console.log('❌ No content in update');
    return false;
  }

  // load dompurify
  await loadScript(`${window.hlx.codeBasePath}/scripts/dompurify.min.js`);

  const sanitizedContent = window.DOMPurify.sanitize(content, { USE_PROFILES: { html: true } });
  const parsedUpdate = new DOMParser().parseFromString(sanitizedContent, 'text/html');
  const element = document.querySelector(`[data-aue-resource="${resource}"]`);

  if (element) {
    if (element.matches('main')) {
      const newMain = parsedUpdate.querySelector(`[data-aue-resource="${resource}"]`);
      newMain.style.display = 'none';
      element.insertAdjacentElement('afterend', newMain);
      decorateMain(newMain);
      decorateRichtext(newMain);
      await loadSections(newMain);
      element.remove();
      newMain.style.display = null;
      // eslint-disable-next-line no-use-before-define
      attachEventListners(newMain);
      return true;
    }

    const block = element.parentElement?.closest('.block[data-aue-resource]') || element?.closest('.block[data-aue-resource]');

    // eslint-disable-next-line no-console
    console.log('🔧 Block found?', !!block, block);

    if (block) {
      const blockResource = block.getAttribute('data-aue-resource');

      // eslint-disable-next-line no-console
      console.log('🔧 Block resource:', blockResource);

      const newBlock = parsedUpdate.querySelector(`[data-aue-resource="${blockResource}"]`);

      // eslint-disable-next-line no-console
      console.log('🔧 New block from update?', !!newBlock, newBlock);

      if (newBlock) {
        // eslint-disable-next-line no-console
        console.log('✅ RE-DECORATING BLOCK!');

        newBlock.style.display = 'none';
        block.insertAdjacentElement('afterend', newBlock);
        decorateButtons(newBlock);
        decorateIcons(newBlock);
        decorateBlock(newBlock);
        decorateRichtext(newBlock);
        await loadBlock(newBlock);
        block.remove();
        newBlock.style.display = null;
        return true;
      }
    } else {
      // sections and default content, may be multiple in the case of richtext
      const newElements = parsedUpdate.querySelectorAll(`[data-aue-resource="${resource}"],[data-richtext-resource="${resource}"]`);
      if (newElements.length) {
        const { parentElement } = element;
        if (element.matches('.section')) {
          const [newSection] = newElements;
          newSection.style.display = 'none';
          element.insertAdjacentElement('afterend', newSection);
          decorateButtons(newSection);
          decorateIcons(newSection);
          decorateRichtext(newSection);
          decorateSections(parentElement);
          decorateBlocks(parentElement);
          await loadSections(parentElement);
          element.remove();
          newSection.style.display = null;
        } else {
          element.replaceWith(...newElements);
          decorateButtons(parentElement);
          decorateIcons(parentElement);
          decorateRichtext(parentElement);
        }
        return true;
      }
    }
  }

  return false;
}

function attachEventListners(main) {
  // eslint-disable-next-line no-console
  console.log('🎯 attachEventListners called with main:', main);

  if (!main) {
    // eslint-disable-next-line no-console
    console.error('❌ No main element found!');
    return;
  }

  [
    'aue:content-patch',
    'aue:content-update',
    'aue:content-add',
    'aue:content-move',
    'aue:content-remove',
    'aue:content-copy',
  ].forEach((eventType) => {
    // eslint-disable-next-line no-console
    console.log(`📌 Attaching listener for ${eventType}`);

    main?.addEventListener(eventType, async (event) => {
      // eslint-disable-next-line no-console
      console.log(`🎬 EVENT HANDLER CALLED for ${eventType}`, event);

      event.stopPropagation();
      const applied = await applyChanges(event);

      // eslint-disable-next-line no-console
      console.log(`🎬 Applied? ${applied}`);

      if (!applied) {
        // eslint-disable-next-line no-console
        console.log('⚠️ Not applied, reloading page...');
        window.location.reload();
      }
    });
  });
}

const mainElement = document.querySelector('main');
// eslint-disable-next-line no-console
console.log('🔍 Main element found:', mainElement);

attachEventListners(mainElement);

// decorate rich text
// this has to happen after decorateMain(), and everythime decorateBlocks() is called
decorateRichtext();
// in cases where the block decoration is not done in one synchronous iteration we need to listen
// for new richtext-instrumented elements. this happens for example when using experimentation.
const observer = new MutationObserver(() => decorateRichtext());
observer.observe(document, { attributeFilter: ['data-richtext-prop'], subtree: true });
