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

// "close". Figma ships 12px (stroke 1, Chips), 16px (stroke 1.3, Chips) and
// 20px (stroke 1.5, ActionSheet / FeedbackScreen close button).
export const CloseIcon = ({ size = 16, ...props }: SVGProps<SVGSVGElement> & { size?: 12 | 16 | 20 }) =>
  size === 12 ? (
    <svg {...figma(12, props)}>
      <path d="M2.81802 9.5L9.18198 3.13604" />
      <path d="M2.81802 3.00001L9.18198 9.36397" />
    </svg>
  ) : size === 20 ? (
    <svg {...figma(20, { strokeWidth: 1.5, ...props })}>
      <path d="M4.6967 15.8333L15.3033 5.22674" />
      <path d="M4.69671 5.00001L15.3033 15.6066" />
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

// 16px icons (stroke 1.3) — menu-item, Bonus-container.
export const StarIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...figma(16, { strokeWidth: 1.3, ...props })}>
    <path d="M9.15333 2.34L10.3267 4.68667C10.4867 5.01333 10.9133 5.32667 11.2733 5.38667L13.4 5.74C14.76 5.96667 15.08 6.95333 14.1 7.92667L12.4467 9.58C12.1667 9.86 12.0133 10.4 12.1 10.7867L12.5733 12.8333C12.9467 14.4533 12.0867 15.08 10.6533 14.2333L8.66 13.0533C8.3 12.84 7.70667 12.84 7.34 13.0533L5.34667 14.2333C3.92 15.08 3.05333 14.4467 3.42667 12.8333L3.9 10.7867C3.98667 10.4 3.83333 9.86 3.55333 9.58L1.9 7.92667C0.926667 6.95333 1.24 5.96667 2.6 5.74L4.72667 5.38667C5.08 5.32667 5.50667 5.01333 5.66667 4.68667L6.84 2.34C7.48 1.06667 8.52 1.06667 9.15333 2.34Z" />
  </svg>
);

export const ArrowRightIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...figma(16, { strokeWidth: 1.3, ...props })}>
    <path d="M5.94 13.28L10.2867 8.93333C10.8 8.42 10.8 7.58 10.2867 7.06667L5.94 2.72" />
  </svg>
);

export const EditIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...figma(16, { strokeWidth: 1.3, ...props })}>
    <path d="M8.84 2.4L3.36667 8.19333C3.16 8.41333 2.96 8.84667 2.92 9.14667L2.67333 11.3067C2.58667 12.0867 3.14667 12.62 3.92 12.4867L6.06667 12.12C6.36667 12.0667 6.78667 11.8467 6.99333 11.62L12.4667 5.82667C13.4133 4.82667 13.84 3.68667 12.3667 2.29333C10.9 0.913333 9.78667 1.4 8.84 2.4Z" />
    <path d="M7.92667 3.36667C8.21333 5.20667 9.70667 6.61333 11.56 6.8" />
    <path d="M2 14.6667H14" />
  </svg>
);

export const TrashIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...figma(16, { strokeWidth: 1.3, ...props })}>
    <path d="M14 3.98667C11.78 3.76667 9.54667 3.65333 7.32 3.65333C6 3.65333 4.68 3.72 3.36 3.85333L2 3.98667" />
    <path d="M5.66667 3.31333L5.81333 2.44C5.92 1.80667 6 1.33333 7.12667 1.33333H8.87334C10 1.33333 10.0867 1.83333 10.1867 2.44667L10.3333 3.31333" />
    <path d="M12.5667 6.09333L12.1333 12.8067C12.06 13.8533 12 14.6667 10.14 14.6667H5.86C4 14.6667 3.94 13.8533 3.86667 12.8067L3.43333 6.09333" />
    <path d="M6.88667 11H9.10667" />
    <path d="M6.33333 8.33333H9.66667" />
  </svg>
);

// "global" — Bonus-container default icon (international minutes etc.).
export const GlobalIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...figma(16, { strokeWidth: 1.3, ...props })}>
    <path d="M14.6667 8C14.6667 11.6819 11.6819 14.6667 8 14.6667C4.3181 14.6667 1.33333 11.6819 1.33333 8C1.33333 4.3181 4.3181 1.33333 8 1.33333C11.6819 1.33333 14.6667 4.3181 14.6667 8Z" />
    <path d="M5.33333 2H6C4.7 5.89333 4.7 10.1067 6 14H5.33333" />
    <path d="M10 2C11.3 5.89333 11.3 10.1067 10 14" />
    <path d="M2 10.6667V10C5.89333 11.3 10.1067 11.3 14 10V10.6667" />
    <path d="M2 6C5.89333 4.7 10.1067 4.7 14 6" />
  </svg>
);

// 24px icons (stroke 1.5) — list-item, Navigation item.
export const AirplaneIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...figma(24, { strokeWidth: 1.5, ...props })}>
    <path d="M17.8 19.2L16 11L19.5 7.50004C21 6.00004 20 4.00002 20 4.00002C20 4.00002 18 3.00004 16.5 4.50004L13 8.00004L4.8 6.20004C4.3 6.10004 3.9 6.30004 3.7 6.70004L3.4 7.20004C3.2 7.70004 3.3 8.20004 3.7 8.50004L9 12L7 15H4L3 16L6 18L8 21L9 20V17L12 15L15.5 20.3C15.8 20.7 16.3 20.8 16.8 20.6L17.3 20.4C17.7 20.1 17.9 19.7 17.8 19.2Z" />
  </svg>
);

// "home-2". `filled` = Navigation item selected state (solid house, door cut
// out in text/contrast).
export const HomeIcon = ({ filled = false, ...props }: SVGProps<SVGSVGElement> & { filled?: boolean }) => (
  <svg {...figma(24, { strokeWidth: 1.5, ...props })}>
    <path
      d="M9.02 2.84L3.63 7.04C2.73 7.74 2 9.23 2 10.36V17.77C2 20.09 3.89 21.99 6.21 21.99H17.79C20.11 21.99 22 20.09 22 17.78V10.5C22 9.29 21.19 7.74 20.2 7.05L14.02 2.72C12.62 1.74 10.37 1.79 9.02 2.84Z"
      fill={filled ? 'currentColor' : 'none'}
    />
    <path d="M12 17.99V14.99" style={filled ? { stroke: 'var(--text-contrast)' } : undefined} />
  </svg>
);

export const ArrowLeftIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...figma(16, { strokeWidth: 1.3, ...props })}>
    <path d="M6.38 3.95333L2.33333 8L6.38 12.0467" />
    <path d="M13.6667 8H2.44667" />
  </svg>
);

export const MessagesIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...figma(16, { strokeWidth: 1.3, ...props })}>
    <path
      d="M11.9867 7.19334V9.86001C11.9867 10.0333 11.98 10.2 11.96 10.36C11.8067 12.16 10.7467 13.0533 8.79334 13.0533H8.52667C8.36001 13.0533 8.2 13.1333 8.1 13.2667L7.30001 14.3333C6.94668 14.8067 6.37333 14.8067 6.02 14.3333L5.21999 13.2667C5.13332 13.1533 4.94 13.0533 4.79334 13.0533H4.52667C2.40001 13.0533 1.33333 12.5267 1.33333 9.86001V7.19334C1.33333 5.24001 2.23334 4.18001 4.02667 4.02667C4.18667 4.00667 4.35334 4 4.52667 4H8.79334C10.92 4 11.9867 5.06667 11.9867 7.19334Z"
      strokeWidth={1.5}
    />
    <path d="M14.6533 4.52667V7.19334C14.6533 9.15334 13.7533 10.2067 11.96 10.36C11.98 10.2 11.9867 10.0333 11.9867 9.86001V7.19334C11.9867 5.06667 10.92 4 8.79334 4H4.52667C4.35334 4 4.18667 4.00667 4.02667 4.02667C4.18001 2.23334 5.24001 1.33333 7.19334 1.33333H11.46C13.5867 1.33333 14.6533 2.40001 14.6533 4.52667Z" />
    <path d="M8.997 8.83333H9.003" />
    <path d="M6.66367 8.83333H6.66967" />
    <path d="M4.33033 8.83333H4.33633" />
  </svg>
);

// 20px icons (stroke 1.5) — navigation-header search, FAQ chevron.
export const SearchIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...figma(20, { strokeWidth: 1.5, ...props })}>
    <path d="M17.5 17.5L13.8833 13.8833" />
    <path d="M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z" />
  </svg>
);

// "arrow-up" — FAQ open state; rotate 180° for closed.
export const ChevronUpIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...figma(20, { strokeWidth: 1.5, ...props })}>
    <path d="M16.6 12.5417L11.1667 7.10833C10.525 6.46667 9.475 6.46667 8.83333 7.10833L3.4 12.5417" />
  </svg>
);
