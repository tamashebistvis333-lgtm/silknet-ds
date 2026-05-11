# @silknet-ds/react

React component library for the Silknet design system. Built on top of [`@silknet-ds/tokens`](../tokens) — all colors, sizes, fonts come from the same Figma source.

## Install

```bash
npm install @silknet-ds/react @silknet-ds/tokens
# react & react-dom (>= 18) must already be in your project
```

## Use

```tsx
// Once at app entry — load CSS variables + component styles.
import '@silknet-ds/tokens/tokens.css';
import '@silknet-ds/react/styles.css';

import { Button, Input } from '@silknet-ds/react';

export function Demo() {
  return (
    <>
      <Button variant="primary">Save</Button>
      <Input label="სახელი" helperText="დამხმარე ტექსტი" />
    </>
  );
}
```

## Dark theme

Set `<html data-theme="dark">` to switch. Components use CSS variables that automatically follow.

## Components

| Component | Variants | Sizes | States |
|---|---|---|---|
| `Button` | primary, primary-soft, secondary, ghost, success, warning, error, info, silkfest, link | xs, sm, md, lg | default, hover, pressed, disabled |
| `IconButton` | primary, primary-soft, secondary, ghost | xs, sm, md, lg | default, hover, pressed, disabled |
| `Input` | — | — | default, hover, focused, filled, error, active-error, disabled |
| `TextArea` | — | — | same as Input |
| `HelperText` | — | — | default, success, info, warning, error |

### Examples

```tsx
import { Button, IconButton, Input, TextArea, HelperText, PlusIcon, UserIcon } from '@silknet-ds/react';

// Button
<Button variant="primary">Save</Button>
<Button variant="secondary" size="lg" leftIcon={<PlusIcon />}>Add item</Button>
<Button variant="ghost" disabled>Cancel</Button>
<Button variant="link" size="xs">Read more</Button>

// IconButton (aria-label is required)
<IconButton aria-label="Add"><PlusIcon /></IconButton>
<IconButton variant="ghost" size="sm" aria-label="Settings"><PlusIcon /></IconButton>

// Input — floating label, optional icons, error state
<Input label="სახელი" helperText="დამხმარე ტექსტი" />
<Input label="Email" leftIcon={<UserIcon />} type="email" />
<Input label="სახელი" error="აუცილებელი ველი" />
<Input label="სახელი" disabled defaultValue="readonly" />

// TextArea — same API, multi-line
<TextArea label="ტექსტ არეა" rows={4} />

// HelperText — semantic states with auto-rendered icons
<HelperText state="success">წარმატებულია</HelperText>
<HelperText state="error">შეცდომა</HelperText>
```

## Browse

Run the playground locally:

```bash
git clone https://github.com/tamashebistvis333-lgtm/silknet-ds.git
cd silknet-ds
npm install
npm run dev
```

…or if a hosted playground is published, link will appear in the repo README.

## License

MIT
