/**
 * 3D Icons - Utility Component
 *
 * This module exports reusable functions for creating and decorating 3D icons.
 * It can be imported by other components (Cards, etc.)
 *
 */

/**
 * Create 3D icons element
 *
 * @param {boolean} vehiclesShowIcon - show or hide Vehicles & Mobility icon
 * @param {boolean} homeShowIcon - show or hide Home & Family icon
 * @param {boolean} personalShowIcon - show or hide Personal Protection icon
 * @returns {HTMLElement} 3D icons element
 */
export function create3Dicons(
  vehiclesShowIcon = false,
  homeShowIcon = false,
  personalShowIcon = false,
) {
  const iconsContainer = document.createElement('div');
  iconsContainer.className = ['icons-3d'].join(' ');

  if (vehiclesShowIcon) {
    const vehicleIcon = document.createElement('div');
    vehicleIcon.className = 'icons-3d-icon icon-mobility';
    const vehicleImg = document.createElement('img');
    vehicleImg.className = 'icon-img';
    vehicleImg.src = `${window.hlx.codeBasePath}/icons/vehicles.png`;
    vehicleImg.alt = '';
    vehicleIcon.appendChild(vehicleImg);
    iconsContainer.appendChild(vehicleIcon);
  }

  if (homeShowIcon) {
    const homeIcon = document.createElement('div');
    homeIcon.className = 'icons-3d-icon icon-property';
    const homeImg = document.createElement('img');
    homeImg.className = 'icon-img';
    homeImg.src = `${window.hlx.codeBasePath}/icons/property.png`;
    homeImg.alt = '';
    homeIcon.appendChild(homeImg);
    iconsContainer.appendChild(homeIcon);
  }

  if (personalShowIcon) {
    const personalIcon = document.createElement('div');
    personalIcon.className = 'icons-3d-icon icon-welfare';
    const personalImg = document.createElement('img');
    personalImg.className = 'icon-img';
    personalImg.src = `${window.hlx.codeBasePath}/icons/welfare.png`;
    personalImg.alt = '';
    personalIcon.appendChild(personalImg);
    iconsContainer.appendChild(personalIcon);
  }

  return iconsContainer;
}

/**
 * Create 3D icons from Universal Editor rows
 *
 * @param {Array} rows - Array of block children
 * @returns {HTMLElement}
 */
export function create3DiconsFromRows(rows) {
  if (!rows || rows.length === 0) return null;

  const vehicleShowIcon = rows[0]?.textContent?.trim() === 'true';
  const homeShowIcon = rows[1]?.textContent?.trim() === 'true';
  const personalShowIcon = rows[2]?.textContent?.trim() === 'true';

  return create3Dicons(
    vehicleShowIcon,
    homeShowIcon,
    personalShowIcon,
  );
}

/**
 * Decorator function for Link Button block
 *
 * @param {HTMLElement} block
 */
export default function decorate3Dicons(block) {
  if (!block) return;

  let rows = Array.from(block.children);
  const wrapper = block.querySelector('.default-content-wrapper');
  if (wrapper) rows = Array.from(wrapper.children);

  const hasInstrumentation = block.hasAttribute('data-aue-resource')
    || block.querySelector('[data-aue-resource]')
    || block.querySelector('[data-richtext-prop]');

  const vehicleIconShow = rows[0]?.textContent?.trim() === 'true';
  const homeIconShow = rows[1]?.textContent?.trim() === 'true';
  const personalIconShow = rows[2]?.textContent?.trim() === 'true';

  if (hasInstrumentation) {
    let icons3Delement = block.querySelector('div');
    if (!icons3Delement) {
      icons3Delement = create3Dicons(
        vehicleIconShow,
        homeIconShow,
        personalIconShow,
      );
      block.textContent = '';
      block.appendChild(icons3Delement);
    } else {
      icons3Delement.className = ['icons-3d'].join(' ');

      icons3Delement.querySelectorAll('.icons-3d-icon').forEach((icon) => icon.remove());
      if (vehicleIconShow) {
        const vehicleIcon = document.createElement('div');
        vehicleIcon.className = `icons-3d-icon icon-${vehicleIconShow}`;
        const vehicleImg = document.createElement('img');
        vehicleImg.className = 'icon-img';
        vehicleImg.src = `${window.hlx.codeBasePath}/icons/vehicles.png`;
        vehicleImg.alt = '';
        vehicleIcon.appendChild(vehicleImg);
        icons3Delement.appendChild(vehicleIcon);
      }
      if (homeIconShow) {
        const homeIcon = document.createElement('div');
        homeIcon.className = `icons-3d-icon icon-${homeIconShow}`;
        const homeImg = document.createElement('img');
        homeImg.className = 'icon-img';
        homeImg.src = `${window.hlx.codeBasePath}/icons/property.png`;
        homeImg.alt = '';
        homeIcon.appendChild(homeImg);
        icons3Delement.appendChild(homeIcon);
      }
      if (personalIconShow) {
        const personalIcon = document.createElement('div');
        personalIcon.className = `icons-3d-icon icon-${personalIconShow}`;
        const personalImg = document.createElement('img');
        personalImg.className = 'icon-img';
        personalImg.src = `${window.hlx.codeBasePath}/icons/welfare.png`;
        personalImg.alt = '';
        personalIcon.appendChild(personalImg);
        icons3Delement.appendChild(personalImg);
      }
    }
  } else {
    const icons3D = create3Dicons(
      vehicleIconShow,
      homeIconShow,
      personalIconShow,
    );
    block.textContent = '';
    block.appendChild(icons3D);
  }

  block.classList.add('icons3D-block');
}
