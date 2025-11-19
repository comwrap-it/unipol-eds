import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  if (!block) return;

  const items = Array.from(block.children);

  items.forEach((item) => {

    const cols = Array.from(item.children);
    if (!cols.length) return;

    // flag
    const rawFlag = cols[0]?.textContent?.trim();
    const hasFlag = rawFlag === "true" || rawFlag === "false";
    const showTitle = hasFlag ? rawFlag === "true" : false;

    // estraggo i valori (senza rimuovere i nodi!)
    const titleHTML = cols[1]?.innerHTML || "";
    const linkText = cols[2]?.textContent?.trim() || "";
    const linkHref = cols[3]?.querySelector("a")?.href || "";

    // 🔥 svuoto SOLO il contenitore dell’item
    item.innerHTML = "";

    // ----- title
    if (showTitle && titleHTML) {
      const titleWrapper = document.createElement("div");
      titleWrapper.innerHTML = titleHTML;
      item.appendChild(titleWrapper);
    }

    // ----- link
    const linkWrapper = document.createElement("div");
    const p = document.createElement("p");
    p.classList.add("button-container");

    const a = document.createElement("a");
    a.href = linkHref;
    a.className = "button";
    a.textContent = linkText;
    a.title = linkText;

    p.appendChild(a);
    linkWrapper.appendChild(p);
    item.appendChild(linkWrapper);

  });
}
