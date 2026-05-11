// Ladle config — keep it minimal. Title is shown in the browser tab and
// sidebar header. Default theme is `light` so designers see Light first.
//
// Stories are auto-discovered from src/**/*.stories.tsx.
//
// `base` is set from LADLE_BASE_URL so GitHub Pages deployments can scope
// assets to the repo subpath (e.g. /silknet-ds/) without changing local dev.

export default {
  defaultStory: 'welcome--readme',
  appendToHead: '<style>body{margin:0}</style>',
  base: process.env.LADLE_BASE_URL || '/',
};
