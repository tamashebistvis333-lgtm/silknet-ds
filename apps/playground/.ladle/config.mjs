// Ladle config — keep it minimal. Title is shown in the browser tab and
// sidebar header. Default theme is `light` so designers see Light first.
//
// Stories are auto-discovered from src/**/*.stories.tsx.
//
// `base` is set from LADLE_BASE_URL so GitHub Pages deployments can scope
// assets to the repo subpath (e.g. /silknet-ds/) without changing local dev.

// Sidebar order: Welcome → Button → Icon Button → Helper Text → Input → Text Area.
// Ladle's `storyOrder` accepts a string[] with prefix wildcards — listing
// `welcome*` first, then `button*`, etc. cleanly groups everything in the
// desired order without us needing to enumerate sub-stories per group.
export default {
  defaultStory: 'welcome--readme',
  appendToHead: '<style>body{margin:0}</style>',
  base: process.env.LADLE_BASE_URL || '/',
  storyOrder: [
    'welcome*',
    'tokens*',
    'button*',
    'icon-button*',
    'toggle*',
    'checkbox*',
    'radio-button*',
    'helper-text*',
    'input*',
    'text-area*',
    'toast*',
    'feedback*',
    'base-feedback*',
  ],
};
