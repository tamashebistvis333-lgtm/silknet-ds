import type { SVGProps } from 'react';

// Tiny stroke-based icon set used as defaults inside HelperText (success/info/
// warning/error) and as fallbacks in stories. All use `currentColor` so the
// surrounding component's text color drives them. Consumers can pass any other
// SVG / icon library output to the leftIcon/rightIcon props instead.

const base = (props: SVGProps<SVGSVGElement>): SVGProps<SVGSVGElement> => ({
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
  ...props,
});

export const CheckIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base({ ...props, strokeWidth: 2.5 })}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// Outlined "check inside a circle". Used in Toast/Feedback success states
// (matches Figma's check-circle icon: stroke ring + stroke checkmark).
export const CheckCircleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base(props)}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="8 12 11 15 16 9" />
  </svg>
);

export const InfoIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base(props)}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

export const WarnIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base(props)}>
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export const ErrorIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base(props)}>
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

// Generic icons useful in stories / examples.
export const PlusIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base(props)}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const UserIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base(props)}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const EyeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base(props)}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// ── Figma-exact icons ────────────────────────────────────────────────────────
// Geometry copied 1:1 from the Silknet New DS icon exports (their native
// viewBox is kept so stroke widths match Figma); color comes from currentColor.

const figma = (size: number, props: SVGProps<SVGSVGElement>): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: `0 0 ${size} ${size}`,
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
  ...props,
});

// "award" — Badge default icon (Figma 12×12).
export const AwardIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...figma(12, props)}>
    <path d="M2.13 5.51V7.995C2.13 8.905 2.13 8.905 2.99 9.485L5.355 10.85C5.71 11.055 6.29 11.055 6.645 10.85L9.01 9.485C9.87 8.905 9.87 8.905 9.87 7.995V5.51C9.87 4.6 9.87 4.6 9.01 4.02L6.645 2.655C6.29 2.45 5.71 2.45 5.355 2.655L2.99 4.02C2.13 4.6 2.13 4.6 2.13 5.51Z" />
    <path d="M8.75 3.815V2.5C8.75 1.5 8.25 1 7.25 1H4.75C3.75 1 3.25 1.5 3.25 2.5V3.78" />
    <path d="M6.315 5.495L6.6 5.94C6.645 6.01 6.745 6.08 6.82 6.1L7.33 6.23C7.645 6.31 7.73 6.58 7.525 6.83L7.19 7.235C7.14 7.3 7.1 7.415 7.105 7.495L7.135 8.02C7.155 8.345 6.925 8.51 6.625 8.39L6.135 8.195C6.06 8.165 5.935 8.165 5.86 8.195L5.37 8.39C5.07 8.51 4.84 8.34 4.86 8.02L4.89 7.495C4.895 7.415 4.855 7.295 4.805 7.235L4.47 6.83C4.265 6.58 4.35 6.31 4.665 6.23L5.175 6.1C5.255 6.08 5.355 6.005 5.395 5.94L5.68 5.495C5.86 5.225 6.14 5.225 6.315 5.495Z" />
  </svg>
);

// "close" — Chips remove icon. Figma ships 12px (stroke 1) and 16px (stroke 1.3).
export const CloseIcon = ({ size = 16, ...props }: SVGProps<SVGSVGElement> & { size?: 12 | 16 }) =>
  size === 12 ? (
    <svg {...figma(12, props)}>
      <path d="M2.81802 9.5L9.18198 3.13604" />
      <path d="M2.81802 3.00001L9.18198 9.36397" />
    </svg>
  ) : (
    <svg {...figma(16, { strokeWidth: 1.3, ...props })}>
      <path d="M3.75736 12.6667L12.2426 4.18139" />
      <path d="M3.75736 4.00001L12.2426 12.4853" />
    </svg>
  );

// "profile" — Avatar placeholder glyph (Figma 24×24, stroke 1.5). Scales down
// for smaller avatars via width/height.
export const ProfileIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...figma(24, { strokeWidth: 1.5, ...props })}>
    <path d="M12.16 10.87C12.06 10.86 11.94 10.86 11.83 10.87C9.45 10.79 7.56 8.84 7.56 6.44C7.56 3.99 9.54 2 12 2C14.45 2 16.44 3.99 16.44 6.44C16.43 8.84 14.54 10.79 12.16 10.87Z" />
    <path d="M7.16 14.56C4.74 16.18 4.74 18.82 7.16 20.43C9.91 22.27 14.42 22.27 17.17 20.43C19.59 18.81 19.59 16.17 17.17 14.56C14.43 12.73 9.92 12.73 7.16 14.56Z" />
  </svg>
);
