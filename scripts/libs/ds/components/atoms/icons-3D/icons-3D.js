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
    vehicleImg.src = `${window.hlx.codeBasePath}/assets/vehicles.webp`;
    vehicleImg.alt = '';
    vehicleIcon.appendChild(vehicleImg);
    iconsContainer.appendChild(vehicleIcon);
  }

  if (homeShowIcon) {
    const homeIcon = document.createElement('div');
    homeIcon.className = 'icons-3d-icon icon-property';
    const homeImg = document.createElement('img');
    homeImg.className = 'icon-img';
    homeImg.src = `${window.hlx.codeBasePath}/assets/property.webp`;
    homeImg.alt = '';
    homeIcon.appendChild(homeImg);
    iconsContainer.appendChild(homeIcon);
  }

  if (personalShowIcon) {
    const personalIcon = document.createElement('div');
    personalIcon.className = 'icons-3d-icon icon-welfare';
    const personalImg = document.createElement('img');
    personalImg.className = 'icon-img';
    personalImg.src = `${window.hlx.codeBasePath}/assets/welfare.webp`;
    personalImg.alt = '';
    personalIcon.appendChild(personalImg);
    iconsContainer.appendChild(personalIcon);
  }

  return iconsContainer;
}
