export const themes = {
  themeOne: {
    '--primary-color': '#1e88e5',
    '--secondary-color': '#ec5200',
    '--bg-color': '#fff',
    '--text-color': '#333'
  },
  themeTwo: {
    '--primary-color': '#c32525ff',
    '--secondary-color': '#e3b211ff',
    '--bg-color': '#121212',
    '--text-color': '#eee'
  }
};

export function applyTheme(themeName) {
  const theme = themes[themeName];
  if (!theme) return;
  Object.keys(theme).forEach(variable => {
    document.documentElement.style.setProperty(variable, theme[variable]);
  });
}
