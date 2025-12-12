/* eslint-disable no-console */
/**
 * A tiny, safe, and idempotent DOM interceptor that rewrites hardcoded asset paths.
 *
 * Why this exists:
 * - Some embedded apps (e.g. Angular custom elements) reference assets as `/assets/...`
 * - In AEM EDS these assets live under `/static/assets/...`
 *
 * Design goals:
 * - **No infinite loops** (never produces `/static/static/...`)
 * - **Idempotent** (running multiple times is safe)
 * - **Low overhead** (MutationObserver + throttled work; no prototype monkey-patching)
 * - **Fail-safe** (guards everywhere; errors never break the page)
 *
 * @param {string} elementSelector - CSS selector for the root element to observe.
 * @param {object} [options]
 * @param {string} [options.fromPrefix='/assets/'] - Prefix to replace.
 * @param {string} [options.toPrefix='/static/assets/'] - Replacement prefix.
 * @param {string[]} [options.attributes] - Attributes to rewrite.
 * @param {boolean} [options.enableLogging=false] - Enable debug logging.
 * @param {number} [options.pollIntervalMs=100] - Poll interval while waiting for the root.
 * @param {number} [options.pollTimeoutMs=10000] - Max wait time for the root.
 * @returns {{ dispose: () => void }} A disposer you can call to disconnect observers.
 */
export function setupAssetPathInterceptor(elementSelector, options = {}) {
  const cfg = {
    fromPrefix: '/assets/',
    toPrefix: '/static/assets/',
    attributes: ['src', 'href', 'data-src', 'data-href', 'poster'],
    enableLogging: false,
    pollIntervalMs: 100,
    pollTimeoutMs: 10000,
    ...options,
  };

  // Global registry to avoid multiple observers doing the same work.
  // This keeps the interceptor idempotent even if multiple blocks call it.
  /** @type {Map<string, { count: number, dispose: () => void }>} */
  const registry = window.__edsAssetPathInterceptorRegistry
    || (window.__edsAssetPathInterceptorRegistry = new Map());
  const registryKey = `${elementSelector}|${cfg.fromPrefix}|${cfg.toPrefix}`;
  const existing = registry.get(registryKey);
  if (existing) {
    existing.count += 1;
    return {
      dispose: () => {
        existing.count -= 1;
        if (existing.count <= 0) {
          existing.dispose();
          registry.delete(registryKey);
        }
      },
    };
  }

  /** @type {number | null} */
  let pollTimer = null;
  /** @type {MutationObserver | null} */
  let observer = null;
  /** @type {Element | null} */
  let root = null;
  let disposed = false;
  let scheduled = false;
  let applying = false;

  const log = (msg) => {
    if (cfg.enableLogging) console.log(msg);
  };

  const safeString = (value) => (typeof value === 'string' ? value : null);

  // Compute how much `toPrefix` overlaps with `fromPrefix` to prevent re-rewrites.
  // Example: fromPrefix="/assets/", toPrefix="/static/assets/" => overlapPrefix="/static"
  const overlapLen = Math.max(0, cfg.toPrefix.length - cfg.fromPrefix.length);
  const overlapPrefix = overlapLen > 0 ? cfg.toPrefix.slice(0, overlapLen) : '';

  /**
   * Replace occurrences of `fromPrefix` with `toPrefix`, but never:
   * - create `/static/static/...`
   * - rewrite already rewritten paths (where the match is part of `toPrefix`)
   */
  const rewriteInString = (input) => {
    const str = safeString(input);
    if (!str) return input;

    if (!str.includes(cfg.fromPrefix)) return str;
    if (str.includes('/static/static/')) return str;
    if (str.includes(cfg.toPrefix)) return str;

    let out = '';
    let idx = 0;
    while (true) {
      const pos = str.indexOf(cfg.fromPrefix, idx);
      if (pos === -1) break;

      out += str.slice(idx, pos);

      const isPartOfToPrefix = overlapLen > 0
        && pos >= overlapLen
        && str.slice(pos - overlapLen, pos) === overlapPrefix;

      if (isPartOfToPrefix) {
        out += cfg.fromPrefix;
      } else {
        out += cfg.toPrefix;
      }

      idx = pos + cfg.fromPrefix.length;
    }

    out += str.slice(idx);
    return out;
  };

  const rewriteAttr = (el, attr) => {
    try {
      if (!el.hasAttribute(attr)) return;
      const current = el.getAttribute(attr);
      const next = rewriteInString(current);
      if (next !== current) {
        applying = true;
        el.setAttribute(attr, next);
        applying = false;
        log(`[asset-interceptor] ${attr}: ${current} -> ${next}`);
      }
    } catch (e) {
      // Never throw; this must be fail-safe.
      applying = false;
    }
  };

  const rewriteInlineStyleAttr = (el) => {
    try {
      if (!el.hasAttribute('style')) return;
      const current = el.getAttribute('style');
      const next = rewriteInString(current);
      if (next !== current) {
        applying = true;
        el.setAttribute('style', next);
        applying = false;
        log('[asset-interceptor] style attribute rewritten');
      }
    } catch (e) {
      applying = false;
    }
  };

  const processElement = (el) => {
    cfg.attributes.forEach((attr) => rewriteAttr(el, attr));
    rewriteInlineStyleAttr(el);
  };

  const processSubtree = (node) => {
    if (!node || node.nodeType !== Node.ELEMENT_NODE) return;
    const el = /** @type {Element} */ (node);

    processElement(el);

    // Only query the minimal set of elements that can contain URLs.
    const selector = [
      ...cfg.attributes.map((a) => `[${a}]`),
      '[style]',
    ].join(',');

    el.querySelectorAll(selector).forEach((child) => {
      processElement(child);
    });
  };

  const scheduleProcess = () => {
    if (scheduled || disposed) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      if (disposed || !root) return;
      processSubtree(root);
    });
  };

  const attachObserver = (target) => {
    if (observer || disposed) return;

    observer = new MutationObserver((mutations) => {
      if (disposed) return;
      if (applying) return;

      for (let i = 0; i < mutations.length; i += 1) {
        const m = mutations[i];
        if (m.type === 'childList') {
          m.addedNodes.forEach((n) => processSubtree(n));
        } else if (m.type === 'attributes') {
          const t = /** @type {Element} */ (m.target);
          // Process only the changed element; no full rescan.
          processElement(t);
        }
      }
    });

    observer.observe(target, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: [...cfg.attributes, 'style'],
    });

    // One initial pass over existing DOM.
    processSubtree(target);
    log(`[asset-interceptor] attached to ${elementSelector}`);
  };

  const findAndAttach = () => {
    try {
      root = document.querySelector(elementSelector);
      if (root) attachObserver(root);
      return Boolean(root);
    } catch (e) {
      return false;
    }
  };

  // Start immediately, otherwise poll for the root (custom element boot timing).
  const start = () => {
    if (disposed) return;
    if (findAndAttach()) return;

    const startedAt = Date.now();
    pollTimer = window.setInterval(() => {
      if (disposed) return;
      if (findAndAttach()) {
        if (pollTimer) window.clearInterval(pollTimer);
        pollTimer = null;
        return;
      }
      if (Date.now() - startedAt > cfg.pollTimeoutMs) {
        if (pollTimer) window.clearInterval(pollTimer);
        pollTimer = null;
      }
    }, cfg.pollIntervalMs);

    // Throttled safety: if something sets attributes in bulk, this keeps cost low.
    scheduleProcess();
  };

  start();

  const internalDispose = () => {
    disposed = true;
    if (pollTimer) window.clearInterval(pollTimer);
    pollTimer = null;
    if (observer) observer.disconnect();
    observer = null;
    root = null;
  };

  registry.set(registryKey, { count: 1, dispose: internalDispose });

  return {
    dispose: () => {
      const entry = registry.get(registryKey);
      if (!entry) return;
      entry.count -= 1;
      if (entry.count <= 0) {
        entry.dispose();
        registry.delete(registryKey);
      }
    },
  };
}
