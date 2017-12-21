
export const THEME_VARIABLES = [

  {
    property: '--primary'
  },
  {
    property: '--primary-contrast'
  },
  {
    property: '--secondary'
  },
  {
    property: '--secondary-contrast'
  },
  {
    property: '--tertiary'
  },
  {
    property: '--tertiary-contrast'
  },
  {
    property: '--success'
  },
  {
    property: '--success-contrast'
  },
  {
    property: '--warning'
  },
  {
    property: '--warning-contrast'
  },
  {
    property: '--danger'
  },
  {
    property: '--danger-contrast'
  },
  {
    property: '--light'
  },
  {
    property: '--light-contrast'
  },
  {
    property: '--medium'
  },
  {
    property: '--medium-contrast'
  },
  {
    property: '--dark'
  },
  {
    property: '--dark-contrast'
  },
  {
    property: '--content-color'
  },
  {
    property: '--content-sub-color'
  },
  {
    property: '--content-background'
  },
  {
    property: '--content-sub-background'
  },
  {
    property: '--toolbar-background'
  },
  {
    property: '--tabbar-background'
  },
  {
    property: '--item-background'
  },
  {
    property: '--item-sub-background'
  },
  {
    property: '--border-color'
  },

];

export const SERVER_DOMAIN = `http://localhost:5454`;
export const DATA_URL = `${SERVER_DOMAIN}/data`;
export const SAVE_CSS_URL = `${SERVER_DOMAIN}/save-css`;

export function createSaveCssUrl(themeName: string, cssText: string) {
  cssText = encodeURIComponent(cssText);
  return `${SAVE_CSS_URL}?theme=${themeName}&css=${cssText}`;
}

export function getThemeName(themeUrl: string) {
  const fileName = themeUrl.replace(/\\/g, '/').split('/').pop();
  return fileName.split('.')[0].toLowerCase();
}
