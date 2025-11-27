export const SWITCH_LABEL_STATES = {
  DEFAULT: "default",
  ACTIVE: "active",
};

/**
 * Creates a Switch Label element
 *
 * @param {Object} params
 * @param {string} params.status - "default" | "active"
 * @param {string} params.label - text content
 * @returns {HTMLElement}
 */
export function createSwitchLabel( status, label ) {
  const wrapper = document.createElement("div");
  wrapper.className = "switch-label";

  const isActive = status === SWITCH_LABEL_STATES.ACTIVE;
  if (isActive) wrapper.classList.add("active");

  const textEl = document.createElement("div");
  textEl.className = "switch-label-text";
  textEl.textContent = label || "";

  wrapper.appendChild(textEl);

  if (isActive) {
    const dot = document.createElement("div");
    dot.className = "switch-label-dot";
    wrapper.appendChild(dot);
  }

  return wrapper;
}

/**
 * Extract AEM instrumentation attributes
 */
export function extractInstrumentationAttributes(el) {
  const attrs = {};
  if (!el) return attrs;

  [...el.attributes].forEach((attr) => {
    if (
      attr.name.startsWith("data-aue-") ||
      attr.name.startsWith("data-richtext-")
    ) {
      attrs[attr.name] = attr.value;
    }
  });

  return attrs;
}

/**
 * Decorator
 *
 * @param {HTMLElement} block
 */
export default function decorateSwitchLabel(block) {
  if (!block) return;

  let rows = [...block.children];
  const wrapper = block.querySelector(".default-content-wrapper");
  if (wrapper) rows = [...wrapper.children];

  const status =
    rows[0]?.textContent?.trim().toLowerCase() ||
    SWITCH_LABEL_STATES.DEFAULT;

  const label = rows[1]?.textContent?.trim() || "";

  const instrumentation = extractInstrumentationAttributes(rows[0]);

  block.textContent = "";

  const switchLabel = createSwitchLabel({
    status,
    label,
    instrumentation,
  });

  block.appendChild(switchLabel);
  block.classList.add("switch-label-block");
}
