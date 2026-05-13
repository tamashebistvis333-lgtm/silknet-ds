// Auto-generated from silknet-ds tokens. Do not edit by hand.
// Re-run `npm run build:playground-data` (or `npm run sync`) after token
// changes. CI verifies this file is up to date.

export interface ColorToken {
  path: string;
  name: string;
  category: string;
  hex: string;
  hexDark?: string;
  ios: string;
  androidCompose: string;
  reactCss: string;
}

export interface FontWeight {
  name: string;
  value: string;
  cssWeight: number;
}

export interface TextStyleToken {
  path: string;
  category: string;
  name: string;
  fontFamily: string;
  fontWeight: number;
  fontSize: string;
  lineHeight: string;
  letterSpacing: string;
  ios: string;
  androidCompose: string;
  reactCssBlock: string;
}

export const fontFamily: string = "Noto Sans Georgian";

export const fontWeights: FontWeight[] = [
  {
    "name": "regular",
    "value": "regular",
    "cssWeight": 400
  },
  {
    "name": "medium",
    "value": "medium",
    "cssWeight": 500
  },
  {
    "name": "semibold",
    "value": "semibold",
    "cssWeight": 600
  },
  {
    "name": "bold",
    "value": "bold",
    "cssWeight": 700
  }
];

export const semanticColors: ColorToken[] = [
  {
    "path": "Text/default",
    "name": "textDefault",
    "category": "Text",
    "hex": "#323A3F",
    "hexDark": "#F8F9F9",
    "ios": "Color.silknet.textDefault",
    "androidCompose": "Silknet.colors.textDefault",
    "reactCss": "var(--text-default)"
  },
  {
    "path": "Text/secondary",
    "name": "textSecondary",
    "category": "Text",
    "hex": "#4B565E",
    "hexDark": "#E0E3E5",
    "ios": "Color.silknet.textSecondary",
    "androidCompose": "Silknet.colors.textSecondary",
    "reactCss": "var(--text-secondary)"
  },
  {
    "path": "Text/additional",
    "name": "textAdditional",
    "category": "Text",
    "hex": "#69757E",
    "hexDark": "#B0B9BF",
    "ios": "Color.silknet.textAdditional",
    "androidCompose": "Silknet.colors.textAdditional",
    "reactCss": "var(--text-additional)"
  },
  {
    "path": "Text/disabled",
    "name": "textDisabled",
    "category": "Text",
    "hex": "#E0E3E5",
    "hexDark": "#4B565E",
    "ios": "Color.silknet.textDisabled",
    "androidCompose": "Silknet.colors.textDisabled",
    "reactCss": "var(--text-disabled)"
  },
  {
    "path": "Text/contrast",
    "name": "textContrast",
    "category": "Text",
    "hex": "#FFFFFF",
    "hexDark": "#000000",
    "ios": "Color.silknet.textContrast",
    "androidCompose": "Silknet.colors.textContrast",
    "reactCss": "var(--text-contrast)"
  },
  {
    "path": "Text/primary",
    "name": "textPrimary",
    "category": "Text",
    "hex": "#006EBC",
    "hexDark": "#99D0F7",
    "ios": "Color.silknet.textPrimary",
    "androidCompose": "Silknet.colors.textPrimary",
    "reactCss": "var(--text-primary)"
  },
  {
    "path": "Text/success",
    "name": "textSuccess",
    "category": "Text",
    "hex": "#218557",
    "hexDark": "#8CE2B4",
    "ios": "Color.silknet.textSuccess",
    "androidCompose": "Silknet.colors.textSuccess",
    "reactCss": "var(--text-success)"
  },
  {
    "path": "Text/error",
    "name": "textError",
    "category": "Text",
    "hex": "#B8323B",
    "hexDark": "#F8A6AD",
    "ios": "Color.silknet.textError",
    "androidCompose": "Silknet.colors.textError",
    "reactCss": "var(--text-error)"
  },
  {
    "path": "Text/warrning",
    "name": "textWarrning",
    "category": "Text",
    "hex": "#996600",
    "hexDark": "#FFD980",
    "ios": "Color.silknet.textWarrning",
    "androidCompose": "Silknet.colors.textWarrning",
    "reactCss": "var(--text-warrning)"
  },
  {
    "path": "Text/info",
    "name": "textInfo",
    "category": "Text",
    "hex": "#1B6E98",
    "hexDark": "#AEDDF4",
    "ios": "Color.silknet.textInfo",
    "androidCompose": "Silknet.colors.textInfo",
    "reactCss": "var(--text-info)"
  },
  {
    "path": "Text/orange",
    "name": "textOrange",
    "category": "Text",
    "hex": "#AA4418",
    "hexDark": "#F8BDA0",
    "ios": "Color.silknet.textOrange",
    "androidCompose": "Silknet.colors.textOrange",
    "reactCss": "var(--text-orange)"
  },
  {
    "path": "Text/purple",
    "name": "textPurple",
    "category": "Text",
    "hex": "#5B29BF",
    "hexDark": "#BEA8F7",
    "ios": "Color.silknet.textPurple",
    "androidCompose": "Silknet.colors.textPurple",
    "reactCss": "var(--text-purple)"
  },
  {
    "path": "Text/pink",
    "name": "textPink",
    "category": "Text",
    "hex": "#BF2988",
    "hexDark": "#F7A8DF",
    "ios": "Color.silknet.textPink",
    "androidCompose": "Silknet.colors.textPink",
    "reactCss": "var(--text-pink)"
  },
  {
    "path": "Text/teal",
    "name": "textTeal",
    "category": "Text",
    "hex": "#168C8C",
    "hexDark": "#96E3E3",
    "ios": "Color.silknet.textTeal",
    "androidCompose": "Silknet.colors.textTeal",
    "reactCss": "var(--text-teal)"
  },
  {
    "path": "Text/silkfest",
    "name": "textSilkfest",
    "category": "Text",
    "hex": "#994500",
    "hexDark": "#FFAB66",
    "ios": "Color.silknet.textSilkfest",
    "androidCompose": "Silknet.colors.textSilkfest",
    "reactCss": "var(--text-silkfest)"
  },
  {
    "path": "Background/surface",
    "name": "backgroundSurface",
    "category": "Background",
    "hex": "#F8F9F9",
    "hexDark": "#1D2327",
    "ios": "Color.silknet.backgroundSurface",
    "androidCompose": "Silknet.colors.backgroundSurface",
    "reactCss": "var(--background-surface)"
  },
  {
    "path": "Background/surface-hover",
    "name": "backgroundSurfaceHover",
    "category": "Background",
    "hex": "#EDEFF0",
    "hexDark": "#323A3F",
    "ios": "Color.silknet.backgroundSurfaceHover",
    "androidCompose": "Silknet.colors.backgroundSurfaceHover",
    "reactCss": "var(--background-surface-hover)"
  },
  {
    "path": "Background/surface-pressed",
    "name": "backgroundSurfacePressed",
    "category": "Background",
    "hex": "#E0E3E5",
    "hexDark": "#4B565E",
    "ios": "Color.silknet.backgroundSurfacePressed",
    "androidCompose": "Silknet.colors.backgroundSurfacePressed",
    "reactCss": "var(--background-surface-pressed)"
  },
  {
    "path": "Background/layer",
    "name": "backgroundLayer",
    "category": "Background",
    "hex": "#FFFFFF",
    "hexDark": "#323A3F",
    "ios": "Color.silknet.backgroundLayer",
    "androidCompose": "Silknet.colors.backgroundLayer",
    "reactCss": "var(--background-layer)"
  },
  {
    "path": "Background/layer-hover",
    "name": "backgroundLayerHover",
    "category": "Background",
    "hex": "#00000014",
    "hexDark": "#00000014",
    "ios": "Color.silknet.backgroundLayerHover",
    "androidCompose": "Silknet.colors.backgroundLayerHover",
    "reactCss": "var(--background-layer-hover)"
  },
  {
    "path": "Background/layer-pressed",
    "name": "backgroundLayerPressed",
    "category": "Background",
    "hex": "#00000029",
    "hexDark": "#00000029",
    "ios": "Color.silknet.backgroundLayerPressed",
    "androidCompose": "Silknet.colors.backgroundLayerPressed",
    "reactCss": "var(--background-layer-pressed)"
  },
  {
    "path": "Background/primary-accent",
    "name": "backgroundPrimaryAccent",
    "category": "Background",
    "hex": "#0089EB",
    "hexDark": "#0089EB",
    "ios": "Color.silknet.backgroundPrimaryAccent",
    "androidCompose": "Silknet.colors.backgroundPrimaryAccent",
    "reactCss": "var(--background-primary-accent)"
  },
  {
    "path": "Background/success-accent",
    "name": "backgroundSuccessAccent",
    "category": "Background",
    "hex": "#29AE6F",
    "hexDark": "#29AE6F",
    "ios": "Color.silknet.backgroundSuccessAccent",
    "androidCompose": "Silknet.colors.backgroundSuccessAccent",
    "reactCss": "var(--background-success-accent)"
  },
  {
    "path": "Background/error-accent",
    "name": "backgroundErrorAccent",
    "category": "Background",
    "hex": "#DB3F49",
    "hexDark": "#DB3F49",
    "ios": "Color.silknet.backgroundErrorAccent",
    "androidCompose": "Silknet.colors.backgroundErrorAccent",
    "reactCss": "var(--background-error-accent)"
  },
  {
    "path": "Background/warning-accent",
    "name": "backgroundWarningAccent",
    "category": "Background",
    "hex": "#E59F00",
    "hexDark": "#E59F00",
    "ios": "Color.silknet.backgroundWarningAccent",
    "androidCompose": "Silknet.colors.backgroundWarningAccent",
    "reactCss": "var(--background-warning-accent)"
  },
  {
    "path": "Background/info-accent",
    "name": "backgroundInfoAccent",
    "category": "Background",
    "hex": "#2597D0",
    "hexDark": "#2597D0",
    "ios": "Color.silknet.backgroundInfoAccent",
    "androidCompose": "Silknet.colors.backgroundInfoAccent",
    "reactCss": "var(--background-info-accent)"
  },
  {
    "path": "Background/orange-accent",
    "name": "backgroundOrangeAccent",
    "category": "Background",
    "hex": "#E15C19",
    "hexDark": "#E15C19",
    "ios": "Color.silknet.backgroundOrangeAccent",
    "androidCompose": "Silknet.colors.backgroundOrangeAccent",
    "reactCss": "var(--background-orange-accent)"
  },
  {
    "path": "Background/purple-accent",
    "name": "backgroundPurpleAccent",
    "category": "Background",
    "hex": "#7743DE",
    "hexDark": "#7743DE",
    "ios": "Color.silknet.backgroundPurpleAccent",
    "androidCompose": "Silknet.colors.backgroundPurpleAccent",
    "reactCss": "var(--background-purple-accent)"
  },
  {
    "path": "Background/pink-accent",
    "name": "backgroundPinkAccent",
    "category": "Background",
    "hex": "#DE43A5",
    "hexDark": "#DE43A5",
    "ios": "Color.silknet.backgroundPinkAccent",
    "androidCompose": "Silknet.colors.backgroundPinkAccent",
    "reactCss": "var(--background-pink-accent)"
  },
  {
    "path": "Background/teal-accent",
    "name": "backgroundTealAccent",
    "category": "Background",
    "hex": "#27AAAA",
    "hexDark": "#27AAAA",
    "ios": "Color.silknet.backgroundTealAccent",
    "androidCompose": "Silknet.colors.backgroundTealAccent",
    "reactCss": "var(--background-teal-accent)"
  },
  {
    "path": "Background/silkfest-accent",
    "name": "backgroundSilkfestAccent",
    "category": "Background",
    "hex": "#CC5C00",
    "hexDark": "#CC5C00",
    "ios": "Color.silknet.backgroundSilkfestAccent",
    "androidCompose": "Silknet.colors.backgroundSilkfestAccent",
    "reactCss": "var(--background-silkfest-accent)"
  },
  {
    "path": "Background/disabled",
    "name": "backgroundDisabled",
    "category": "Background",
    "hex": "#E0E3E5",
    "hexDark": "#4B565E",
    "ios": "Color.silknet.backgroundDisabled",
    "androidCompose": "Silknet.colors.backgroundDisabled",
    "reactCss": "var(--background-disabled)"
  },
  {
    "path": "Background/primary",
    "name": "backgroundPrimary",
    "category": "Background",
    "hex": "#E7F4FD",
    "hexDark": "#001B2F",
    "ios": "Color.silknet.backgroundPrimary",
    "androidCompose": "Silknet.colors.backgroundPrimary",
    "reactCss": "var(--background-primary)"
  },
  {
    "path": "Background/success",
    "name": "backgroundSuccess",
    "category": "Background",
    "hex": "#E4F6EC",
    "hexDark": "#0E3525",
    "ios": "Color.silknet.backgroundSuccess",
    "androidCompose": "Silknet.colors.backgroundSuccess",
    "reactCss": "var(--background-success)"
  },
  {
    "path": "Background/error",
    "name": "backgroundError",
    "category": "Background",
    "hex": "#FDEBEC",
    "hexDark": "#3F1015",
    "ios": "Color.silknet.backgroundError",
    "androidCompose": "Silknet.colors.backgroundError",
    "reactCss": "var(--background-error)"
  },
  {
    "path": "Background/warning",
    "name": "backgroundWarning",
    "category": "Background",
    "hex": "#FFF6E1",
    "hexDark": "#4D3300",
    "ios": "Color.silknet.backgroundWarning",
    "androidCompose": "Silknet.colors.backgroundWarning",
    "reactCss": "var(--background-warning)"
  },
  {
    "path": "Background/info",
    "name": "backgroundInfo",
    "category": "Background",
    "hex": "#E9F6FC",
    "hexDark": "#0F3F57",
    "ios": "Color.silknet.backgroundInfo",
    "androidCompose": "Silknet.colors.backgroundInfo",
    "reactCss": "var(--background-info)"
  },
  {
    "path": "Background/orange",
    "name": "backgroundOrange",
    "category": "Background",
    "hex": "#FDECE3",
    "hexDark": "#3E1909",
    "ios": "Color.silknet.backgroundOrange",
    "androidCompose": "Silknet.colors.backgroundOrange",
    "reactCss": "var(--background-orange)"
  },
  {
    "path": "Background/purple",
    "name": "backgroundPurple",
    "category": "Background",
    "hex": "#EFE9FC",
    "hexDark": "#210F48",
    "ios": "Color.silknet.backgroundPurple",
    "androidCompose": "Silknet.colors.backgroundPurple",
    "reactCss": "var(--background-purple)"
  },
  {
    "path": "Background/pink",
    "name": "backgroundPink",
    "category": "Background",
    "hex": "#FCE9F5",
    "hexDark": "#480F33",
    "ios": "Color.silknet.backgroundPink",
    "androidCompose": "Silknet.colors.backgroundPink",
    "reactCss": "var(--background-pink)"
  },
  {
    "path": "Background/teal",
    "name": "backgroundTeal",
    "category": "Background",
    "hex": "#EBFAFA",
    "hexDark": "#053336",
    "ios": "Color.silknet.backgroundTeal",
    "androidCompose": "Silknet.colors.backgroundTeal",
    "reactCss": "var(--background-teal)"
  },
  {
    "path": "Background/silkfest",
    "name": "backgroundSilkfest",
    "category": "Background",
    "hex": "#FFE3CC",
    "hexDark": "#331700",
    "ios": "Color.silknet.backgroundSilkfest",
    "androidCompose": "Silknet.colors.backgroundSilkfest",
    "reactCss": "var(--background-silkfest)"
  },
  {
    "path": "Background/toggle-default",
    "name": "backgroundToggleDefault",
    "category": "Background",
    "hex": "#EDEFF0",
    "hexDark": "#4B565E",
    "ios": "Color.silknet.backgroundToggleDefault",
    "androidCompose": "Silknet.colors.backgroundToggleDefault",
    "reactCss": "var(--background-toggle-default)"
  },
  {
    "path": "Background/chip-default",
    "name": "backgroundChipDefault",
    "category": "Background",
    "hex": "#F8F9F9",
    "hexDark": "#4B565E",
    "ios": "Color.silknet.backgroundChipDefault",
    "androidCompose": "Silknet.colors.backgroundChipDefault",
    "reactCss": "var(--background-chip-default)"
  },
  {
    "path": "Background/chip-selected",
    "name": "backgroundChipSelected",
    "category": "Background",
    "hex": "#4B565E",
    "hexDark": "#F8F9F9",
    "ios": "Color.silknet.backgroundChipSelected",
    "androidCompose": "Silknet.colors.backgroundChipSelected",
    "reactCss": "var(--background-chip-selected)"
  },
  {
    "path": "Background/primary-soft",
    "name": "backgroundPrimarySoft",
    "category": "Background",
    "hex": "#33A1EF14",
    "hexDark": "#33A1EF14",
    "ios": "Color.silknet.backgroundPrimarySoft",
    "androidCompose": "Silknet.colors.backgroundPrimarySoft",
    "reactCss": "var(--background-primary-soft)"
  },
  {
    "path": "Background/navigation",
    "name": "backgroundNavigation",
    "category": "Background",
    "hex": "#FFFFFF3d",
    "hexDark": "#B0B9BF0a",
    "ios": "Color.silknet.backgroundNavigation",
    "androidCompose": "Silknet.colors.backgroundNavigation",
    "reactCss": "var(--background-navigation)"
  },
  {
    "path": "Background/input/default",
    "name": "backgroundInputDefault",
    "category": "Background",
    "hex": "#B0B9BF14",
    "hexDark": "#B0B9BF14",
    "ios": "Color.silknet.backgroundInputDefault",
    "androidCompose": "Silknet.colors.backgroundInputDefault",
    "reactCss": "var(--background-input-default)"
  },
  {
    "path": "Background/input/hover",
    "name": "backgroundInputHover",
    "category": "Background",
    "hex": "#B0B9BF29",
    "hexDark": "#B0B9BF29",
    "ios": "Color.silknet.backgroundInputHover",
    "androidCompose": "Silknet.colors.backgroundInputHover",
    "reactCss": "var(--background-input-hover)"
  },
  {
    "path": "Background/input/pressed",
    "name": "backgroundInputPressed",
    "category": "Background",
    "hex": "#B0B9BF3d",
    "hexDark": "#B0B9BF3d",
    "ios": "Color.silknet.backgroundInputPressed",
    "androidCompose": "Silknet.colors.backgroundInputPressed",
    "reactCss": "var(--background-input-pressed)"
  },
  {
    "path": "border/default",
    "name": "borderDefault",
    "category": "border",
    "hex": "#B0B9BF52",
    "hexDark": "#69757E",
    "ios": "Color.silknet.borderDefault",
    "androidCompose": "Silknet.colors.borderDefault",
    "reactCss": "var(--border-default)"
  },
  {
    "path": "border/subtle",
    "name": "borderSubtle",
    "category": "border",
    "hex": "#B0B9BF29",
    "hexDark": "#4B565E",
    "ios": "Color.silknet.borderSubtle",
    "androidCompose": "Silknet.colors.borderSubtle",
    "reactCss": "var(--border-subtle)"
  },
  {
    "path": "border/filled",
    "name": "borderFilled",
    "category": "border",
    "hex": "#69757E",
    "hexDark": "#4B565E",
    "ios": "Color.silknet.borderFilled",
    "androidCompose": "Silknet.colors.borderFilled",
    "reactCss": "var(--border-filled)"
  },
  {
    "path": "border/primary-focus",
    "name": "borderPrimaryFocus",
    "category": "border",
    "hex": "#0089EB",
    "hexDark": "#0089EB",
    "ios": "Color.silknet.borderPrimaryFocus",
    "androidCompose": "Silknet.colors.borderPrimaryFocus",
    "reactCss": "var(--border-primary-focus)"
  },
  {
    "path": "border/primary",
    "name": "borderPrimary",
    "category": "border",
    "hex": "#CCE7FB",
    "hexDark": "#00375E",
    "ios": "Color.silknet.borderPrimary",
    "androidCompose": "Silknet.colors.borderPrimary",
    "reactCss": "var(--border-primary)"
  },
  {
    "path": "border/success",
    "name": "borderSuccess",
    "category": "border",
    "hex": "#C6ECD7",
    "hexDark": "#134C34",
    "ios": "Color.silknet.borderSuccess",
    "androidCompose": "Silknet.colors.borderSuccess",
    "reactCss": "var(--border-success)"
  },
  {
    "path": "border/error",
    "name": "borderError",
    "category": "border",
    "hex": "#FBD0D3",
    "hexDark": "#661B22",
    "ios": "Color.silknet.borderError",
    "androidCompose": "Silknet.colors.borderError",
    "reactCss": "var(--border-error)"
  },
  {
    "path": "border/error-focus",
    "name": "borderErrorFocus",
    "category": "border",
    "hex": "#DB3F49",
    "hexDark": "#661B22",
    "ios": "Color.silknet.borderErrorFocus",
    "androidCompose": "Silknet.colors.borderErrorFocus",
    "reactCss": "var(--border-error-focus)"
  },
  {
    "path": "border/warning",
    "name": "borderWarning",
    "category": "border",
    "hex": "#FFE9B8",
    "hexDark": "#734C00",
    "ios": "Color.silknet.borderWarning",
    "androidCompose": "Silknet.colors.borderWarning",
    "reactCss": "var(--border-warning)"
  },
  {
    "path": "border/info",
    "name": "borderInfo",
    "category": "border",
    "hex": "#D2ECF9",
    "hexDark": "#134E6C",
    "ios": "Color.silknet.borderInfo",
    "androidCompose": "Silknet.colors.borderInfo",
    "reactCss": "var(--border-info)"
  },
  {
    "path": "border/orange",
    "name": "borderOrange",
    "category": "border",
    "hex": "#FBDBCB",
    "hexDark": "#59240D",
    "ios": "Color.silknet.borderOrange",
    "androidCompose": "Silknet.colors.borderOrange",
    "reactCss": "var(--border-orange)"
  },
  {
    "path": "border/purple",
    "name": "borderPurple",
    "category": "border",
    "hex": "#D9CAFA",
    "hexDark": "#2F1669",
    "ios": "Color.silknet.borderPurple",
    "androidCompose": "Silknet.colors.borderPurple",
    "reactCss": "var(--border-purple)"
  },
  {
    "path": "border/pink",
    "name": "borderPink",
    "category": "border",
    "hex": "#F9CBEA",
    "hexDark": "#69164A",
    "ios": "Color.silknet.borderPink",
    "androidCompose": "Silknet.colors.borderPink",
    "reactCss": "var(--border-pink)"
  },
  {
    "path": "border/teal",
    "name": "borderTeal",
    "category": "border",
    "hex": "#C3EFEF",
    "hexDark": "#0A4D52",
    "ios": "Color.silknet.borderTeal",
    "androidCompose": "Silknet.colors.borderTeal",
    "reactCss": "var(--border-teal)"
  },
  {
    "path": "border/silkfest",
    "name": "borderSilkfest",
    "category": "border",
    "hex": "#FFC799",
    "hexDark": "#4D2300",
    "ios": "Color.silknet.borderSilkfest",
    "androidCompose": "Silknet.colors.borderSilkfest",
    "reactCss": "var(--border-silkfest)"
  }
];

export const paletteColors: ColorToken[] = [
  {
    "path": "Primary/100",
    "name": "primary100",
    "category": "Primary",
    "hex": "#E7F4FD",
    "ios": "Color.silknet.primary100",
    "androidCompose": "SilknetPalette.primary100",
    "reactCss": "var(--primary-100)"
  },
  {
    "path": "Primary/200",
    "name": "primary200",
    "category": "Primary",
    "hex": "#CCE7FB",
    "ios": "Color.silknet.primary200",
    "androidCompose": "SilknetPalette.primary200",
    "reactCss": "var(--primary-200)"
  },
  {
    "path": "Primary/300",
    "name": "primary300",
    "category": "Primary",
    "hex": "#99D0F7",
    "ios": "Color.silknet.primary300",
    "androidCompose": "SilknetPalette.primary300",
    "reactCss": "var(--primary-300)"
  },
  {
    "path": "Primary/400",
    "name": "primary400",
    "category": "Primary",
    "hex": "#66B8F3",
    "ios": "Color.silknet.primary400",
    "androidCompose": "SilknetPalette.primary400",
    "reactCss": "var(--primary-400)"
  },
  {
    "path": "Primary/500",
    "name": "primary500",
    "category": "Primary",
    "hex": "#33A1EF",
    "ios": "Color.silknet.primary500",
    "androidCompose": "SilknetPalette.primary500",
    "reactCss": "var(--primary-500)"
  },
  {
    "path": "Primary/600",
    "name": "primary600",
    "category": "Primary",
    "hex": "#0089EB",
    "ios": "Color.silknet.primary600",
    "androidCompose": "SilknetPalette.primary600",
    "reactCss": "var(--primary-600)"
  },
  {
    "path": "Primary/700",
    "name": "primary700",
    "category": "Primary",
    "hex": "#006EBC",
    "ios": "Color.silknet.primary700",
    "androidCompose": "SilknetPalette.primary700",
    "reactCss": "var(--primary-700)"
  },
  {
    "path": "Primary/800",
    "name": "primary800",
    "category": "Primary",
    "hex": "#00528D",
    "ios": "Color.silknet.primary800",
    "androidCompose": "SilknetPalette.primary800",
    "reactCss": "var(--primary-800)"
  },
  {
    "path": "Primary/900",
    "name": "primary900",
    "category": "Primary",
    "hex": "#00375E",
    "ios": "Color.silknet.primary900",
    "androidCompose": "SilknetPalette.primary900",
    "reactCss": "var(--primary-900)"
  },
  {
    "path": "Primary/950",
    "name": "primary950",
    "category": "Primary",
    "hex": "#001B2F",
    "ios": "Color.silknet.primary950",
    "androidCompose": "SilknetPalette.primary950",
    "reactCss": "var(--primary-950)"
  },
  {
    "path": "Primary/4%",
    "name": "primary4",
    "category": "Primary",
    "hex": "#33A1EF0a",
    "ios": "Color.silknet.primary4",
    "androidCompose": "SilknetPalette.primary4",
    "reactCss": "var(--primary-4)"
  },
  {
    "path": "Primary/8%",
    "name": "primary8",
    "category": "Primary",
    "hex": "#33A1EF14",
    "ios": "Color.silknet.primary8",
    "androidCompose": "SilknetPalette.primary8",
    "reactCss": "var(--primary-8)"
  },
  {
    "path": "Primary/16%",
    "name": "primary16",
    "category": "Primary",
    "hex": "#33A1EF29",
    "ios": "Color.silknet.primary16",
    "androidCompose": "SilknetPalette.primary16",
    "reactCss": "var(--primary-16)"
  },
  {
    "path": "Primary/24%",
    "name": "primary24",
    "category": "Primary",
    "hex": "#33A1EF3d",
    "ios": "Color.silknet.primary24",
    "androidCompose": "SilknetPalette.primary24",
    "reactCss": "var(--primary-24)"
  },
  {
    "path": "Primary/32%",
    "name": "primary32",
    "category": "Primary",
    "hex": "#33A1EF52",
    "ios": "Color.silknet.primary32",
    "androidCompose": "SilknetPalette.primary32",
    "reactCss": "var(--primary-32)"
  },
  {
    "path": "Primary/40%",
    "name": "primary40",
    "category": "Primary",
    "hex": "#33A1EF66",
    "ios": "Color.silknet.primary40",
    "androidCompose": "SilknetPalette.primary40",
    "reactCss": "var(--primary-40)"
  },
  {
    "path": "Primary/48%",
    "name": "primary48",
    "category": "Primary",
    "hex": "#33A1EF7a",
    "ios": "Color.silknet.primary48",
    "androidCompose": "SilknetPalette.primary48",
    "reactCss": "var(--primary-48)"
  },
  {
    "path": "Grey/100",
    "name": "grey100",
    "category": "Grey",
    "hex": "#F8F9F9",
    "ios": "Color.silknet.grey100",
    "androidCompose": "SilknetPalette.grey100",
    "reactCss": "var(--grey-100)"
  },
  {
    "path": "Grey/200",
    "name": "grey200",
    "category": "Grey",
    "hex": "#EDEFF0",
    "ios": "Color.silknet.grey200",
    "androidCompose": "SilknetPalette.grey200",
    "reactCss": "var(--grey-200)"
  },
  {
    "path": "Grey/300",
    "name": "grey300",
    "category": "Grey",
    "hex": "#E0E3E5",
    "ios": "Color.silknet.grey300",
    "androidCompose": "SilknetPalette.grey300",
    "reactCss": "var(--grey-300)"
  },
  {
    "path": "Grey/400",
    "name": "grey400",
    "category": "Grey",
    "hex": "#CDD2D6",
    "ios": "Color.silknet.grey400",
    "androidCompose": "SilknetPalette.grey400",
    "reactCss": "var(--grey-400)"
  },
  {
    "path": "Grey/500",
    "name": "grey500",
    "category": "Grey",
    "hex": "#B0B9BF",
    "ios": "Color.silknet.grey500",
    "androidCompose": "SilknetPalette.grey500",
    "reactCss": "var(--grey-500)"
  },
  {
    "path": "Grey/600",
    "name": "grey600",
    "category": "Grey",
    "hex": "#8E9AA3",
    "ios": "Color.silknet.grey600",
    "androidCompose": "SilknetPalette.grey600",
    "reactCss": "var(--grey-600)"
  },
  {
    "path": "Grey/700",
    "name": "grey700",
    "category": "Grey",
    "hex": "#69757E",
    "ios": "Color.silknet.grey700",
    "androidCompose": "SilknetPalette.grey700",
    "reactCss": "var(--grey-700)"
  },
  {
    "path": "Grey/800",
    "name": "grey800",
    "category": "Grey",
    "hex": "#4B565E",
    "ios": "Color.silknet.grey800",
    "androidCompose": "SilknetPalette.grey800",
    "reactCss": "var(--grey-800)"
  },
  {
    "path": "Grey/900",
    "name": "grey900",
    "category": "Grey",
    "hex": "#323A3F",
    "ios": "Color.silknet.grey900",
    "androidCompose": "SilknetPalette.grey900",
    "reactCss": "var(--grey-900)"
  },
  {
    "path": "Grey/950",
    "name": "grey950",
    "category": "Grey",
    "hex": "#1D2327",
    "ios": "Color.silknet.grey950",
    "androidCompose": "SilknetPalette.grey950",
    "reactCss": "var(--grey-950)"
  },
  {
    "path": "Grey/4%",
    "name": "grey4",
    "category": "Grey",
    "hex": "#B0B9BF0a",
    "ios": "Color.silknet.grey4",
    "androidCompose": "SilknetPalette.grey4",
    "reactCss": "var(--grey-4)"
  },
  {
    "path": "Grey/8%",
    "name": "grey8",
    "category": "Grey",
    "hex": "#B0B9BF14",
    "ios": "Color.silknet.grey8",
    "androidCompose": "SilknetPalette.grey8",
    "reactCss": "var(--grey-8)"
  },
  {
    "path": "Grey/16%",
    "name": "grey16",
    "category": "Grey",
    "hex": "#B0B9BF29",
    "ios": "Color.silknet.grey16",
    "androidCompose": "SilknetPalette.grey16",
    "reactCss": "var(--grey-16)"
  },
  {
    "path": "Grey/24%",
    "name": "grey24",
    "category": "Grey",
    "hex": "#B0B9BF3d",
    "ios": "Color.silknet.grey24",
    "androidCompose": "SilknetPalette.grey24",
    "reactCss": "var(--grey-24)"
  },
  {
    "path": "Grey/32%",
    "name": "grey32",
    "category": "Grey",
    "hex": "#B0B9BF52",
    "ios": "Color.silknet.grey32",
    "androidCompose": "SilknetPalette.grey32",
    "reactCss": "var(--grey-32)"
  },
  {
    "path": "Grey/40%",
    "name": "grey40",
    "category": "Grey",
    "hex": "#B0B9BF66",
    "ios": "Color.silknet.grey40",
    "androidCompose": "SilknetPalette.grey40",
    "reactCss": "var(--grey-40)"
  },
  {
    "path": "Grey/48%",
    "name": "grey48",
    "category": "Grey",
    "hex": "#B0B9BF7a",
    "ios": "Color.silknet.grey48",
    "androidCompose": "SilknetPalette.grey48",
    "reactCss": "var(--grey-48)"
  },
  {
    "path": "Green/100",
    "name": "green100",
    "category": "Green",
    "hex": "#E4F6EC",
    "ios": "Color.silknet.green100",
    "androidCompose": "SilknetPalette.green100",
    "reactCss": "var(--green-100)"
  },
  {
    "path": "Green/200",
    "name": "green200",
    "category": "Green",
    "hex": "#C6ECD7",
    "ios": "Color.silknet.green200",
    "androidCompose": "SilknetPalette.green200",
    "reactCss": "var(--green-200)"
  },
  {
    "path": "Green/300",
    "name": "green300",
    "category": "Green",
    "hex": "#8CE2B4",
    "ios": "Color.silknet.green300",
    "androidCompose": "SilknetPalette.green300",
    "reactCss": "var(--green-300)"
  },
  {
    "path": "Green/400",
    "name": "green400",
    "category": "Green",
    "hex": "#5DD79A",
    "ios": "Color.silknet.green400",
    "androidCompose": "SilknetPalette.green400",
    "reactCss": "var(--green-400)"
  },
  {
    "path": "Green/500",
    "name": "green500",
    "category": "Green",
    "hex": "#32C980",
    "ios": "Color.silknet.green500",
    "androidCompose": "SilknetPalette.green500",
    "reactCss": "var(--green-500)"
  },
  {
    "path": "Green/600",
    "name": "green600",
    "category": "Green",
    "hex": "#29AE6F",
    "ios": "Color.silknet.green600",
    "androidCompose": "SilknetPalette.green600",
    "reactCss": "var(--green-600)"
  },
  {
    "path": "Green/700",
    "name": "green700",
    "category": "Green",
    "hex": "#218557",
    "ios": "Color.silknet.green700",
    "androidCompose": "SilknetPalette.green700",
    "reactCss": "var(--green-700)"
  },
  {
    "path": "Green/800",
    "name": "green800",
    "category": "Green",
    "hex": "#186A47",
    "ios": "Color.silknet.green800",
    "androidCompose": "SilknetPalette.green800",
    "reactCss": "var(--green-800)"
  },
  {
    "path": "Green/900",
    "name": "green900",
    "category": "Green",
    "hex": "#134C34",
    "ios": "Color.silknet.green900",
    "androidCompose": "SilknetPalette.green900",
    "reactCss": "var(--green-900)"
  },
  {
    "path": "Green/950",
    "name": "green950",
    "category": "Green",
    "hex": "#0E3525",
    "ios": "Color.silknet.green950",
    "androidCompose": "SilknetPalette.green950",
    "reactCss": "var(--green-950)"
  },
  {
    "path": "Green/4%",
    "name": "green4",
    "category": "Green",
    "hex": "#32C9800a",
    "ios": "Color.silknet.green4",
    "androidCompose": "SilknetPalette.green4",
    "reactCss": "var(--green-4)"
  },
  {
    "path": "Green/8%",
    "name": "green8",
    "category": "Green",
    "hex": "#32C98014",
    "ios": "Color.silknet.green8",
    "androidCompose": "SilknetPalette.green8",
    "reactCss": "var(--green-8)"
  },
  {
    "path": "Green/16%",
    "name": "green16",
    "category": "Green",
    "hex": "#32C98029",
    "ios": "Color.silknet.green16",
    "androidCompose": "SilknetPalette.green16",
    "reactCss": "var(--green-16)"
  },
  {
    "path": "Green/24%",
    "name": "green24",
    "category": "Green",
    "hex": "#32C9803d",
    "ios": "Color.silknet.green24",
    "androidCompose": "SilknetPalette.green24",
    "reactCss": "var(--green-24)"
  },
  {
    "path": "Green/32%",
    "name": "green32",
    "category": "Green",
    "hex": "#32C98052",
    "ios": "Color.silknet.green32",
    "androidCompose": "SilknetPalette.green32",
    "reactCss": "var(--green-32)"
  },
  {
    "path": "Green/40%",
    "name": "green40",
    "category": "Green",
    "hex": "#32C98066",
    "ios": "Color.silknet.green40",
    "androidCompose": "SilknetPalette.green40",
    "reactCss": "var(--green-40)"
  },
  {
    "path": "Green/48%",
    "name": "green48",
    "category": "Green",
    "hex": "#32C9807a",
    "ios": "Color.silknet.green48",
    "androidCompose": "SilknetPalette.green48",
    "reactCss": "var(--green-48)"
  },
  {
    "path": "Red/100",
    "name": "red100",
    "category": "Red",
    "hex": "#FDEBEC",
    "ios": "Color.silknet.red100",
    "androidCompose": "SilknetPalette.red100",
    "reactCss": "var(--red-100)"
  },
  {
    "path": "Red/200",
    "name": "red200",
    "category": "Red",
    "hex": "#FBD0D3",
    "ios": "Color.silknet.red200",
    "androidCompose": "SilknetPalette.red200",
    "reactCss": "var(--red-200)"
  },
  {
    "path": "Red/300",
    "name": "red300",
    "category": "Red",
    "hex": "#F8A6AD",
    "ios": "Color.silknet.red300",
    "androidCompose": "SilknetPalette.red300",
    "reactCss": "var(--red-300)"
  },
  {
    "path": "Red/400",
    "name": "red400",
    "category": "Red",
    "hex": "#F3747E",
    "ios": "Color.silknet.red400",
    "androidCompose": "SilknetPalette.red400",
    "reactCss": "var(--red-400)"
  },
  {
    "path": "Red/500",
    "name": "red500",
    "category": "Red",
    "hex": "#F5515C",
    "ios": "Color.silknet.red500",
    "androidCompose": "SilknetPalette.red500",
    "reactCss": "var(--red-500)"
  },
  {
    "path": "Red/600",
    "name": "red600",
    "category": "Red",
    "hex": "#DB3F49",
    "ios": "Color.silknet.red600",
    "androidCompose": "SilknetPalette.red600",
    "reactCss": "var(--red-600)"
  },
  {
    "path": "Red/700",
    "name": "red700",
    "category": "Red",
    "hex": "#B8323B",
    "ios": "Color.silknet.red700",
    "androidCompose": "SilknetPalette.red700",
    "reactCss": "var(--red-700)"
  },
  {
    "path": "Red/800",
    "name": "red800",
    "category": "Red",
    "hex": "#8F262E",
    "ios": "Color.silknet.red800",
    "androidCompose": "SilknetPalette.red800",
    "reactCss": "var(--red-800)"
  },
  {
    "path": "Red/900",
    "name": "red900",
    "category": "Red",
    "hex": "#661B22",
    "ios": "Color.silknet.red900",
    "androidCompose": "SilknetPalette.red900",
    "reactCss": "var(--red-900)"
  },
  {
    "path": "Red/950",
    "name": "red950",
    "category": "Red",
    "hex": "#3F1015",
    "ios": "Color.silknet.red950",
    "androidCompose": "SilknetPalette.red950",
    "reactCss": "var(--red-950)"
  },
  {
    "path": "Red/4%",
    "name": "red4",
    "category": "Red",
    "hex": "#F5515C0a",
    "ios": "Color.silknet.red4",
    "androidCompose": "SilknetPalette.red4",
    "reactCss": "var(--red-4)"
  },
  {
    "path": "Red/8%",
    "name": "red8",
    "category": "Red",
    "hex": "#F5515C14",
    "ios": "Color.silknet.red8",
    "androidCompose": "SilknetPalette.red8",
    "reactCss": "var(--red-8)"
  },
  {
    "path": "Red/16%",
    "name": "red16",
    "category": "Red",
    "hex": "#F5515C29",
    "ios": "Color.silknet.red16",
    "androidCompose": "SilknetPalette.red16",
    "reactCss": "var(--red-16)"
  },
  {
    "path": "Red/24%",
    "name": "red24",
    "category": "Red",
    "hex": "#F5515C3d",
    "ios": "Color.silknet.red24",
    "androidCompose": "SilknetPalette.red24",
    "reactCss": "var(--red-24)"
  },
  {
    "path": "Red/32%",
    "name": "red32",
    "category": "Red",
    "hex": "#F5515C52",
    "ios": "Color.silknet.red32",
    "androidCompose": "SilknetPalette.red32",
    "reactCss": "var(--red-32)"
  },
  {
    "path": "Red/40%",
    "name": "red40",
    "category": "Red",
    "hex": "#F5515C66",
    "ios": "Color.silknet.red40",
    "androidCompose": "SilknetPalette.red40",
    "reactCss": "var(--red-40)"
  },
  {
    "path": "Red/48%",
    "name": "red48",
    "category": "Red",
    "hex": "#F5515C7a",
    "ios": "Color.silknet.red48",
    "androidCompose": "SilknetPalette.red48",
    "reactCss": "var(--red-48)"
  },
  {
    "path": "Yellow/100",
    "name": "yellow100",
    "category": "Yellow",
    "hex": "#FFF6E1",
    "ios": "Color.silknet.yellow100",
    "androidCompose": "SilknetPalette.yellow100",
    "reactCss": "var(--yellow-100)"
  },
  {
    "path": "Yellow/200",
    "name": "yellow200",
    "category": "Yellow",
    "hex": "#FFE9B8",
    "ios": "Color.silknet.yellow200",
    "androidCompose": "SilknetPalette.yellow200",
    "reactCss": "var(--yellow-200)"
  },
  {
    "path": "Yellow/300",
    "name": "yellow300",
    "category": "Yellow",
    "hex": "#FFD980",
    "ios": "Color.silknet.yellow300",
    "androidCompose": "SilknetPalette.yellow300",
    "reactCss": "var(--yellow-300)"
  },
  {
    "path": "Yellow/400",
    "name": "yellow400",
    "category": "Yellow",
    "hex": "#FFC84A",
    "ios": "Color.silknet.yellow400",
    "androidCompose": "SilknetPalette.yellow400",
    "reactCss": "var(--yellow-400)"
  },
  {
    "path": "Yellow/500",
    "name": "yellow500",
    "category": "Yellow",
    "hex": "#FFB714",
    "ios": "Color.silknet.yellow500",
    "androidCompose": "SilknetPalette.yellow500",
    "reactCss": "var(--yellow-500)"
  },
  {
    "path": "Yellow/600",
    "name": "yellow600",
    "category": "Yellow",
    "hex": "#E59F00",
    "ios": "Color.silknet.yellow600",
    "androidCompose": "SilknetPalette.yellow600",
    "reactCss": "var(--yellow-600)"
  },
  {
    "path": "Yellow/700",
    "name": "yellow700",
    "category": "Yellow",
    "hex": "#BF8200",
    "ios": "Color.silknet.yellow700",
    "androidCompose": "SilknetPalette.yellow700",
    "reactCss": "var(--yellow-700)"
  },
  {
    "path": "Yellow/800",
    "name": "yellow800",
    "category": "Yellow",
    "hex": "#996600",
    "ios": "Color.silknet.yellow800",
    "androidCompose": "SilknetPalette.yellow800",
    "reactCss": "var(--yellow-800)"
  },
  {
    "path": "Yellow/900",
    "name": "yellow900",
    "category": "Yellow",
    "hex": "#734C00",
    "ios": "Color.silknet.yellow900",
    "androidCompose": "SilknetPalette.yellow900",
    "reactCss": "var(--yellow-900)"
  },
  {
    "path": "Yellow/950",
    "name": "yellow950",
    "category": "Yellow",
    "hex": "#4D3300",
    "ios": "Color.silknet.yellow950",
    "androidCompose": "SilknetPalette.yellow950",
    "reactCss": "var(--yellow-950)"
  },
  {
    "path": "Yellow/4%",
    "name": "yellow4",
    "category": "Yellow",
    "hex": "#FFB7140a",
    "ios": "Color.silknet.yellow4",
    "androidCompose": "SilknetPalette.yellow4",
    "reactCss": "var(--yellow-4)"
  },
  {
    "path": "Yellow/8%",
    "name": "yellow8",
    "category": "Yellow",
    "hex": "#FFB71414",
    "ios": "Color.silknet.yellow8",
    "androidCompose": "SilknetPalette.yellow8",
    "reactCss": "var(--yellow-8)"
  },
  {
    "path": "Yellow/16%",
    "name": "yellow16",
    "category": "Yellow",
    "hex": "#FFB71429",
    "ios": "Color.silknet.yellow16",
    "androidCompose": "SilknetPalette.yellow16",
    "reactCss": "var(--yellow-16)"
  },
  {
    "path": "Yellow/24%",
    "name": "yellow24",
    "category": "Yellow",
    "hex": "#FFB7143d",
    "ios": "Color.silknet.yellow24",
    "androidCompose": "SilknetPalette.yellow24",
    "reactCss": "var(--yellow-24)"
  },
  {
    "path": "Yellow/32%",
    "name": "yellow32",
    "category": "Yellow",
    "hex": "#FFB71452",
    "ios": "Color.silknet.yellow32",
    "androidCompose": "SilknetPalette.yellow32",
    "reactCss": "var(--yellow-32)"
  },
  {
    "path": "Yellow/40%",
    "name": "yellow40",
    "category": "Yellow",
    "hex": "#FFB71466",
    "ios": "Color.silknet.yellow40",
    "androidCompose": "SilknetPalette.yellow40",
    "reactCss": "var(--yellow-40)"
  },
  {
    "path": "Yellow/48%",
    "name": "yellow48",
    "category": "Yellow",
    "hex": "#FFB7147a",
    "ios": "Color.silknet.yellow48",
    "androidCompose": "SilknetPalette.yellow48",
    "reactCss": "var(--yellow-48)"
  },
  {
    "path": "Blue/100",
    "name": "blue100",
    "category": "Blue",
    "hex": "#E9F6FC",
    "ios": "Color.silknet.blue100",
    "androidCompose": "SilknetPalette.blue100",
    "reactCss": "var(--blue-100)"
  },
  {
    "path": "Blue/200",
    "name": "blue200",
    "category": "Blue",
    "hex": "#D2ECF9",
    "ios": "Color.silknet.blue200",
    "androidCompose": "SilknetPalette.blue200",
    "reactCss": "var(--blue-200)"
  },
  {
    "path": "Blue/300",
    "name": "blue300",
    "category": "Blue",
    "hex": "#AEDDF4",
    "ios": "Color.silknet.blue300",
    "androidCompose": "SilknetPalette.blue300",
    "reactCss": "var(--blue-300)"
  },
  {
    "path": "Blue/400",
    "name": "blue400",
    "category": "Blue",
    "hex": "#81CAEF",
    "ios": "Color.silknet.blue400",
    "androidCompose": "SilknetPalette.blue400",
    "reactCss": "var(--blue-400)"
  },
  {
    "path": "Blue/500",
    "name": "blue500",
    "category": "Blue",
    "hex": "#3DAEE6",
    "ios": "Color.silknet.blue500",
    "androidCompose": "SilknetPalette.blue500",
    "reactCss": "var(--blue-500)"
  },
  {
    "path": "Blue/600",
    "name": "blue600",
    "category": "Blue",
    "hex": "#2597D0",
    "ios": "Color.silknet.blue600",
    "androidCompose": "SilknetPalette.blue600",
    "reactCss": "var(--blue-600)"
  },
  {
    "path": "Blue/700",
    "name": "blue700",
    "category": "Blue",
    "hex": "#1C7FB0",
    "ios": "Color.silknet.blue700",
    "androidCompose": "SilknetPalette.blue700",
    "reactCss": "var(--blue-700)"
  },
  {
    "path": "Blue/800",
    "name": "blue800",
    "category": "Blue",
    "hex": "#1B6E98",
    "ios": "Color.silknet.blue800",
    "androidCompose": "SilknetPalette.blue800",
    "reactCss": "var(--blue-800)"
  },
  {
    "path": "Blue/900",
    "name": "blue900",
    "category": "Blue",
    "hex": "#134E6C",
    "ios": "Color.silknet.blue900",
    "androidCompose": "SilknetPalette.blue900",
    "reactCss": "var(--blue-900)"
  },
  {
    "path": "Blue/950",
    "name": "blue950",
    "category": "Blue",
    "hex": "#0F3F57",
    "ios": "Color.silknet.blue950",
    "androidCompose": "SilknetPalette.blue950",
    "reactCss": "var(--blue-950)"
  },
  {
    "path": "Blue/4%",
    "name": "blue4",
    "category": "Blue",
    "hex": "#3DAEE60a",
    "ios": "Color.silknet.blue4",
    "androidCompose": "SilknetPalette.blue4",
    "reactCss": "var(--blue-4)"
  },
  {
    "path": "Blue/8%",
    "name": "blue8",
    "category": "Blue",
    "hex": "#3DAEE614",
    "ios": "Color.silknet.blue8",
    "androidCompose": "SilknetPalette.blue8",
    "reactCss": "var(--blue-8)"
  },
  {
    "path": "Blue/16%",
    "name": "blue16",
    "category": "Blue",
    "hex": "#3DAEE629",
    "ios": "Color.silknet.blue16",
    "androidCompose": "SilknetPalette.blue16",
    "reactCss": "var(--blue-16)"
  },
  {
    "path": "Blue/24%",
    "name": "blue24",
    "category": "Blue",
    "hex": "#3DAEE63d",
    "ios": "Color.silknet.blue24",
    "androidCompose": "SilknetPalette.blue24",
    "reactCss": "var(--blue-24)"
  },
  {
    "path": "Blue/32%",
    "name": "blue32",
    "category": "Blue",
    "hex": "#3DAEE652",
    "ios": "Color.silknet.blue32",
    "androidCompose": "SilknetPalette.blue32",
    "reactCss": "var(--blue-32)"
  },
  {
    "path": "Blue/40%",
    "name": "blue40",
    "category": "Blue",
    "hex": "#3DAEE666",
    "ios": "Color.silknet.blue40",
    "androidCompose": "SilknetPalette.blue40",
    "reactCss": "var(--blue-40)"
  },
  {
    "path": "Blue/48%",
    "name": "blue48",
    "category": "Blue",
    "hex": "#3DAEE67a",
    "ios": "Color.silknet.blue48",
    "androidCompose": "SilknetPalette.blue48",
    "reactCss": "var(--blue-48)"
  },
  {
    "path": "Orange/100",
    "name": "orange100",
    "category": "Orange",
    "hex": "#FDECE3",
    "ios": "Color.silknet.orange100",
    "androidCompose": "SilknetPalette.orange100",
    "reactCss": "var(--orange-100)"
  },
  {
    "path": "Orange/200",
    "name": "orange200",
    "category": "Orange",
    "hex": "#FBDBCB",
    "ios": "Color.silknet.orange200",
    "androidCompose": "SilknetPalette.orange200",
    "reactCss": "var(--orange-200)"
  },
  {
    "path": "Orange/300",
    "name": "orange300",
    "category": "Orange",
    "hex": "#F8BDA0",
    "ios": "Color.silknet.orange300",
    "androidCompose": "SilknetPalette.orange300",
    "reactCss": "var(--orange-300)"
  },
  {
    "path": "Orange/400",
    "name": "orange400",
    "category": "Orange",
    "hex": "#F69A6C",
    "ios": "Color.silknet.orange400",
    "androidCompose": "SilknetPalette.orange400",
    "reactCss": "var(--orange-400)"
  },
  {
    "path": "Orange/500",
    "name": "orange500",
    "category": "Orange",
    "hex": "#F07436",
    "ios": "Color.silknet.orange500",
    "androidCompose": "SilknetPalette.orange500",
    "reactCss": "var(--orange-500)"
  },
  {
    "path": "Orange/600",
    "name": "orange600",
    "category": "Orange",
    "hex": "#E15C19",
    "ios": "Color.silknet.orange600",
    "androidCompose": "SilknetPalette.orange600",
    "reactCss": "var(--orange-600)"
  },
  {
    "path": "Orange/700",
    "name": "orange700",
    "category": "Orange",
    "hex": "#AA4418",
    "ios": "Color.silknet.orange700",
    "androidCompose": "SilknetPalette.orange700",
    "reactCss": "var(--orange-700)"
  },
  {
    "path": "Orange/800",
    "name": "orange800",
    "category": "Orange",
    "hex": "#7D3212",
    "ios": "Color.silknet.orange800",
    "androidCompose": "SilknetPalette.orange800",
    "reactCss": "var(--orange-800)"
  },
  {
    "path": "Orange/900",
    "name": "orange900",
    "category": "Orange",
    "hex": "#59240D",
    "ios": "Color.silknet.orange900",
    "androidCompose": "SilknetPalette.orange900",
    "reactCss": "var(--orange-900)"
  },
  {
    "path": "Orange/950",
    "name": "orange950",
    "category": "Orange",
    "hex": "#3E1909",
    "ios": "Color.silknet.orange950",
    "androidCompose": "SilknetPalette.orange950",
    "reactCss": "var(--orange-950)"
  },
  {
    "path": "Orange/4%",
    "name": "orange4",
    "category": "Orange",
    "hex": "#F074360a",
    "ios": "Color.silknet.orange4",
    "androidCompose": "SilknetPalette.orange4",
    "reactCss": "var(--orange-4)"
  },
  {
    "path": "Orange/8%",
    "name": "orange8",
    "category": "Orange",
    "hex": "#F0743614",
    "ios": "Color.silknet.orange8",
    "androidCompose": "SilknetPalette.orange8",
    "reactCss": "var(--orange-8)"
  },
  {
    "path": "Orange/16%",
    "name": "orange16",
    "category": "Orange",
    "hex": "#F0743629",
    "ios": "Color.silknet.orange16",
    "androidCompose": "SilknetPalette.orange16",
    "reactCss": "var(--orange-16)"
  },
  {
    "path": "Orange/24%",
    "name": "orange24",
    "category": "Orange",
    "hex": "#F074363d",
    "ios": "Color.silknet.orange24",
    "androidCompose": "SilknetPalette.orange24",
    "reactCss": "var(--orange-24)"
  },
  {
    "path": "Orange/32%",
    "name": "orange32",
    "category": "Orange",
    "hex": "#F0743652",
    "ios": "Color.silknet.orange32",
    "androidCompose": "SilknetPalette.orange32",
    "reactCss": "var(--orange-32)"
  },
  {
    "path": "Orange/40%",
    "name": "orange40",
    "category": "Orange",
    "hex": "#F0743666",
    "ios": "Color.silknet.orange40",
    "androidCompose": "SilknetPalette.orange40",
    "reactCss": "var(--orange-40)"
  },
  {
    "path": "Orange/48%",
    "name": "orange48",
    "category": "Orange",
    "hex": "#F074367a",
    "ios": "Color.silknet.orange48",
    "androidCompose": "SilknetPalette.orange48",
    "reactCss": "var(--orange-48)"
  },
  {
    "path": "Purple/100",
    "name": "purple100",
    "category": "Purple",
    "hex": "#EFE9FC",
    "ios": "Color.silknet.purple100",
    "androidCompose": "SilknetPalette.purple100",
    "reactCss": "var(--purple-100)"
  },
  {
    "path": "Purple/200",
    "name": "purple200",
    "category": "Purple",
    "hex": "#D9CAFA",
    "ios": "Color.silknet.purple200",
    "androidCompose": "SilknetPalette.purple200",
    "reactCss": "var(--purple-200)"
  },
  {
    "path": "Purple/300",
    "name": "purple300",
    "category": "Purple",
    "hex": "#BEA8F7",
    "ios": "Color.silknet.purple300",
    "androidCompose": "SilknetPalette.purple300",
    "reactCss": "var(--purple-300)"
  },
  {
    "path": "Purple/400",
    "name": "purple400",
    "category": "Purple",
    "hex": "#A986F4",
    "ios": "Color.silknet.purple400",
    "androidCompose": "SilknetPalette.purple400",
    "reactCss": "var(--purple-400)"
  },
  {
    "path": "Purple/500",
    "name": "purple500",
    "category": "Purple",
    "hex": "#9364F1",
    "ios": "Color.silknet.purple500",
    "androidCompose": "SilknetPalette.purple500",
    "reactCss": "var(--purple-500)"
  },
  {
    "path": "Purple/600",
    "name": "purple600",
    "category": "Purple",
    "hex": "#7743DE",
    "ios": "Color.silknet.purple600",
    "androidCompose": "SilknetPalette.purple600",
    "reactCss": "var(--purple-600)"
  },
  {
    "path": "Purple/700",
    "name": "purple700",
    "category": "Purple",
    "hex": "#5B29BF",
    "ios": "Color.silknet.purple700",
    "androidCompose": "SilknetPalette.purple700",
    "reactCss": "var(--purple-700)"
  },
  {
    "path": "Purple/800",
    "name": "purple800",
    "category": "Purple",
    "hex": "#461F94",
    "ios": "Color.silknet.purple800",
    "androidCompose": "SilknetPalette.purple800",
    "reactCss": "var(--purple-800)"
  },
  {
    "path": "Purple/900",
    "name": "purple900",
    "category": "Purple",
    "hex": "#2F1669",
    "ios": "Color.silknet.purple900",
    "androidCompose": "SilknetPalette.purple900",
    "reactCss": "var(--purple-900)"
  },
  {
    "path": "Purple/950",
    "name": "purple950",
    "category": "Purple",
    "hex": "#210F48",
    "ios": "Color.silknet.purple950",
    "androidCompose": "SilknetPalette.purple950",
    "reactCss": "var(--purple-950)"
  },
  {
    "path": "Purple/4%",
    "name": "purple4",
    "category": "Purple",
    "hex": "#9364F10a",
    "ios": "Color.silknet.purple4",
    "androidCompose": "SilknetPalette.purple4",
    "reactCss": "var(--purple-4)"
  },
  {
    "path": "Purple/8%",
    "name": "purple8",
    "category": "Purple",
    "hex": "#9364F114",
    "ios": "Color.silknet.purple8",
    "androidCompose": "SilknetPalette.purple8",
    "reactCss": "var(--purple-8)"
  },
  {
    "path": "Purple/16%",
    "name": "purple16",
    "category": "Purple",
    "hex": "#9364F129",
    "ios": "Color.silknet.purple16",
    "androidCompose": "SilknetPalette.purple16",
    "reactCss": "var(--purple-16)"
  },
  {
    "path": "Purple/24%",
    "name": "purple24",
    "category": "Purple",
    "hex": "#9364F13d",
    "ios": "Color.silknet.purple24",
    "androidCompose": "SilknetPalette.purple24",
    "reactCss": "var(--purple-24)"
  },
  {
    "path": "Purple/32%",
    "name": "purple32",
    "category": "Purple",
    "hex": "#9364F152",
    "ios": "Color.silknet.purple32",
    "androidCompose": "SilknetPalette.purple32",
    "reactCss": "var(--purple-32)"
  },
  {
    "path": "Purple/40%",
    "name": "purple40",
    "category": "Purple",
    "hex": "#9364F166",
    "ios": "Color.silknet.purple40",
    "androidCompose": "SilknetPalette.purple40",
    "reactCss": "var(--purple-40)"
  },
  {
    "path": "Purple/48%",
    "name": "purple48",
    "category": "Purple",
    "hex": "#9364F17a",
    "ios": "Color.silknet.purple48",
    "androidCompose": "SilknetPalette.purple48",
    "reactCss": "var(--purple-48)"
  },
  {
    "path": "Pink/100",
    "name": "pink100",
    "category": "Pink",
    "hex": "#FCE9F5",
    "ios": "Color.silknet.pink100",
    "androidCompose": "SilknetPalette.pink100",
    "reactCss": "var(--pink-100)"
  },
  {
    "path": "Pink/200",
    "name": "pink200",
    "category": "Pink",
    "hex": "#F9CBEA",
    "ios": "Color.silknet.pink200",
    "androidCompose": "SilknetPalette.pink200",
    "reactCss": "var(--pink-200)"
  },
  {
    "path": "Pink/300",
    "name": "pink300",
    "category": "Pink",
    "hex": "#F7A8DF",
    "ios": "Color.silknet.pink300",
    "androidCompose": "SilknetPalette.pink300",
    "reactCss": "var(--pink-300)"
  },
  {
    "path": "Pink/400",
    "name": "pink400",
    "category": "Pink",
    "hex": "#F486CF",
    "ios": "Color.silknet.pink400",
    "androidCompose": "SilknetPalette.pink400",
    "reactCss": "var(--pink-400)"
  },
  {
    "path": "Pink/500",
    "name": "pink500",
    "category": "Pink",
    "hex": "#F164BD",
    "ios": "Color.silknet.pink500",
    "androidCompose": "SilknetPalette.pink500",
    "reactCss": "var(--pink-500)"
  },
  {
    "path": "Pink/600",
    "name": "pink600",
    "category": "Pink",
    "hex": "#DE43A5",
    "ios": "Color.silknet.pink600",
    "androidCompose": "SilknetPalette.pink600",
    "reactCss": "var(--pink-600)"
  },
  {
    "path": "Pink/700",
    "name": "pink700",
    "category": "Pink",
    "hex": "#BF2988",
    "ios": "Color.silknet.pink700",
    "androidCompose": "SilknetPalette.pink700",
    "reactCss": "var(--pink-700)"
  },
  {
    "path": "Pink/800",
    "name": "pink800",
    "category": "Pink",
    "hex": "#941F69",
    "ios": "Color.silknet.pink800",
    "androidCompose": "SilknetPalette.pink800",
    "reactCss": "var(--pink-800)"
  },
  {
    "path": "Pink/900",
    "name": "pink900",
    "category": "Pink",
    "hex": "#69164A",
    "ios": "Color.silknet.pink900",
    "androidCompose": "SilknetPalette.pink900",
    "reactCss": "var(--pink-900)"
  },
  {
    "path": "Pink/950",
    "name": "pink950",
    "category": "Pink",
    "hex": "#480F33",
    "ios": "Color.silknet.pink950",
    "androidCompose": "SilknetPalette.pink950",
    "reactCss": "var(--pink-950)"
  },
  {
    "path": "Pink/4%",
    "name": "pink4",
    "category": "Pink",
    "hex": "#F164BD0a",
    "ios": "Color.silknet.pink4",
    "androidCompose": "SilknetPalette.pink4",
    "reactCss": "var(--pink-4)"
  },
  {
    "path": "Pink/8%",
    "name": "pink8",
    "category": "Pink",
    "hex": "#F164BD14",
    "ios": "Color.silknet.pink8",
    "androidCompose": "SilknetPalette.pink8",
    "reactCss": "var(--pink-8)"
  },
  {
    "path": "Pink/16%",
    "name": "pink16",
    "category": "Pink",
    "hex": "#F164BD29",
    "ios": "Color.silknet.pink16",
    "androidCompose": "SilknetPalette.pink16",
    "reactCss": "var(--pink-16)"
  },
  {
    "path": "Pink/24%",
    "name": "pink24",
    "category": "Pink",
    "hex": "#F164BD3d",
    "ios": "Color.silknet.pink24",
    "androidCompose": "SilknetPalette.pink24",
    "reactCss": "var(--pink-24)"
  },
  {
    "path": "Pink/32%",
    "name": "pink32",
    "category": "Pink",
    "hex": "#F164BD52",
    "ios": "Color.silknet.pink32",
    "androidCompose": "SilknetPalette.pink32",
    "reactCss": "var(--pink-32)"
  },
  {
    "path": "Pink/40%",
    "name": "pink40",
    "category": "Pink",
    "hex": "#F164BD66",
    "ios": "Color.silknet.pink40",
    "androidCompose": "SilknetPalette.pink40",
    "reactCss": "var(--pink-40)"
  },
  {
    "path": "Pink/48%",
    "name": "pink48",
    "category": "Pink",
    "hex": "#F164BD7a",
    "ios": "Color.silknet.pink48",
    "androidCompose": "SilknetPalette.pink48",
    "reactCss": "var(--pink-48)"
  },
  {
    "path": "Teal/100",
    "name": "teal100",
    "category": "Teal",
    "hex": "#EBFAFA",
    "ios": "Color.silknet.teal100",
    "androidCompose": "SilknetPalette.teal100",
    "reactCss": "var(--teal-100)"
  },
  {
    "path": "Teal/200",
    "name": "teal200",
    "category": "Teal",
    "hex": "#C3EFEF",
    "ios": "Color.silknet.teal200",
    "androidCompose": "SilknetPalette.teal200",
    "reactCss": "var(--teal-200)"
  },
  {
    "path": "Teal/300",
    "name": "teal300",
    "category": "Teal",
    "hex": "#96E3E3",
    "ios": "Color.silknet.teal300",
    "androidCompose": "SilknetPalette.teal300",
    "reactCss": "var(--teal-300)"
  },
  {
    "path": "Teal/400",
    "name": "teal400",
    "category": "Teal",
    "hex": "#6AD7D7",
    "ios": "Color.silknet.teal400",
    "androidCompose": "SilknetPalette.teal400",
    "reactCss": "var(--teal-400)"
  },
  {
    "path": "Teal/500",
    "name": "teal500",
    "category": "Teal",
    "hex": "#33CCCC",
    "ios": "Color.silknet.teal500",
    "androidCompose": "SilknetPalette.teal500",
    "reactCss": "var(--teal-500)"
  },
  {
    "path": "Teal/600",
    "name": "teal600",
    "category": "Teal",
    "hex": "#27AAAA",
    "ios": "Color.silknet.teal600",
    "androidCompose": "SilknetPalette.teal600",
    "reactCss": "var(--teal-600)"
  },
  {
    "path": "Teal/700",
    "name": "teal700",
    "category": "Teal",
    "hex": "#168C8C",
    "ios": "Color.silknet.teal700",
    "androidCompose": "SilknetPalette.teal700",
    "reactCss": "var(--teal-700)"
  },
  {
    "path": "Teal/800",
    "name": "teal800",
    "category": "Teal",
    "hex": "#0F6E6E",
    "ios": "Color.silknet.teal800",
    "androidCompose": "SilknetPalette.teal800",
    "reactCss": "var(--teal-800)"
  },
  {
    "path": "Teal/900",
    "name": "teal900",
    "category": "Teal",
    "hex": "#0A4D52",
    "ios": "Color.silknet.teal900",
    "androidCompose": "SilknetPalette.teal900",
    "reactCss": "var(--teal-900)"
  },
  {
    "path": "Teal/950",
    "name": "teal950",
    "category": "Teal",
    "hex": "#053336",
    "ios": "Color.silknet.teal950",
    "androidCompose": "SilknetPalette.teal950",
    "reactCss": "var(--teal-950)"
  },
  {
    "path": "Teal/4%",
    "name": "teal4",
    "category": "Teal",
    "hex": "#33CCCC0a",
    "ios": "Color.silknet.teal4",
    "androidCompose": "SilknetPalette.teal4",
    "reactCss": "var(--teal-4)"
  },
  {
    "path": "Teal/8%",
    "name": "teal8",
    "category": "Teal",
    "hex": "#33CCCC14",
    "ios": "Color.silknet.teal8",
    "androidCompose": "SilknetPalette.teal8",
    "reactCss": "var(--teal-8)"
  },
  {
    "path": "Teal/16%",
    "name": "teal16",
    "category": "Teal",
    "hex": "#33CCCC29",
    "ios": "Color.silknet.teal16",
    "androidCompose": "SilknetPalette.teal16",
    "reactCss": "var(--teal-16)"
  },
  {
    "path": "Teal/24%",
    "name": "teal24",
    "category": "Teal",
    "hex": "#33CCCC3d",
    "ios": "Color.silknet.teal24",
    "androidCompose": "SilknetPalette.teal24",
    "reactCss": "var(--teal-24)"
  },
  {
    "path": "Teal/32%",
    "name": "teal32",
    "category": "Teal",
    "hex": "#33CCCC52",
    "ios": "Color.silknet.teal32",
    "androidCompose": "SilknetPalette.teal32",
    "reactCss": "var(--teal-32)"
  },
  {
    "path": "Teal/40%",
    "name": "teal40",
    "category": "Teal",
    "hex": "#33CCCC66",
    "ios": "Color.silknet.teal40",
    "androidCompose": "SilknetPalette.teal40",
    "reactCss": "var(--teal-40)"
  },
  {
    "path": "Teal/48%",
    "name": "teal48",
    "category": "Teal",
    "hex": "#33CCCC7a",
    "ios": "Color.silknet.teal48",
    "androidCompose": "SilknetPalette.teal48",
    "reactCss": "var(--teal-48)"
  },
  {
    "path": "Silkfest/100",
    "name": "silkfest100",
    "category": "Silkfest",
    "hex": "#FFE3CC",
    "ios": "Color.silknet.silkfest100",
    "androidCompose": "SilknetPalette.silkfest100",
    "reactCss": "var(--silkfest-100)"
  },
  {
    "path": "Silkfest/200",
    "name": "silkfest200",
    "category": "Silkfest",
    "hex": "#FFC799",
    "ios": "Color.silknet.silkfest200",
    "androidCompose": "SilknetPalette.silkfest200",
    "reactCss": "var(--silkfest-200)"
  },
  {
    "path": "Silkfest/300",
    "name": "silkfest300",
    "category": "Silkfest",
    "hex": "#FFAB66",
    "ios": "Color.silknet.silkfest300",
    "androidCompose": "SilknetPalette.silkfest300",
    "reactCss": "var(--silkfest-300)"
  },
  {
    "path": "Silkfest/400",
    "name": "silkfest400",
    "category": "Silkfest",
    "hex": "#FF8F33",
    "ios": "Color.silknet.silkfest400",
    "androidCompose": "SilknetPalette.silkfest400",
    "reactCss": "var(--silkfest-400)"
  },
  {
    "path": "Silkfest/500",
    "name": "silkfest500",
    "category": "Silkfest",
    "hex": "#FF7300",
    "ios": "Color.silknet.silkfest500",
    "androidCompose": "SilknetPalette.silkfest500",
    "reactCss": "var(--silkfest-500)"
  },
  {
    "path": "Silkfest/600",
    "name": "silkfest600",
    "category": "Silkfest",
    "hex": "#CC5C00",
    "ios": "Color.silknet.silkfest600",
    "androidCompose": "SilknetPalette.silkfest600",
    "reactCss": "var(--silkfest-600)"
  },
  {
    "path": "Silkfest/700",
    "name": "silkfest700",
    "category": "Silkfest",
    "hex": "#994500",
    "ios": "Color.silknet.silkfest700",
    "androidCompose": "SilknetPalette.silkfest700",
    "reactCss": "var(--silkfest-700)"
  },
  {
    "path": "Silkfest/800",
    "name": "silkfest800",
    "category": "Silkfest",
    "hex": "#662E00",
    "ios": "Color.silknet.silkfest800",
    "androidCompose": "SilknetPalette.silkfest800",
    "reactCss": "var(--silkfest-800)"
  },
  {
    "path": "Silkfest/900",
    "name": "silkfest900",
    "category": "Silkfest",
    "hex": "#4D2300",
    "ios": "Color.silknet.silkfest900",
    "androidCompose": "SilknetPalette.silkfest900",
    "reactCss": "var(--silkfest-900)"
  },
  {
    "path": "Silkfest/950",
    "name": "silkfest950",
    "category": "Silkfest",
    "hex": "#331700",
    "ios": "Color.silknet.silkfest950",
    "androidCompose": "SilknetPalette.silkfest950",
    "reactCss": "var(--silkfest-950)"
  },
  {
    "path": "Silkfest/4%",
    "name": "silkfest4",
    "category": "Silkfest",
    "hex": "#FF73000a",
    "ios": "Color.silknet.silkfest4",
    "androidCompose": "SilknetPalette.silkfest4",
    "reactCss": "var(--silkfest-4)"
  },
  {
    "path": "Silkfest/8%",
    "name": "silkfest8",
    "category": "Silkfest",
    "hex": "#FF730014",
    "ios": "Color.silknet.silkfest8",
    "androidCompose": "SilknetPalette.silkfest8",
    "reactCss": "var(--silkfest-8)"
  },
  {
    "path": "Silkfest/16%",
    "name": "silkfest16",
    "category": "Silkfest",
    "hex": "#FF730029",
    "ios": "Color.silknet.silkfest16",
    "androidCompose": "SilknetPalette.silkfest16",
    "reactCss": "var(--silkfest-16)"
  },
  {
    "path": "Silkfest/24%",
    "name": "silkfest24",
    "category": "Silkfest",
    "hex": "#FF73003d",
    "ios": "Color.silknet.silkfest24",
    "androidCompose": "SilknetPalette.silkfest24",
    "reactCss": "var(--silkfest-24)"
  },
  {
    "path": "Silkfest/32%",
    "name": "silkfest32",
    "category": "Silkfest",
    "hex": "#FF730052",
    "ios": "Color.silknet.silkfest32",
    "androidCompose": "SilknetPalette.silkfest32",
    "reactCss": "var(--silkfest-32)"
  },
  {
    "path": "Silkfest/40%",
    "name": "silkfest40",
    "category": "Silkfest",
    "hex": "#FF730066",
    "ios": "Color.silknet.silkfest40",
    "androidCompose": "SilknetPalette.silkfest40",
    "reactCss": "var(--silkfest-40)"
  },
  {
    "path": "Silkfest/48%",
    "name": "silkfest48",
    "category": "Silkfest",
    "hex": "#FF73007a",
    "ios": "Color.silknet.silkfest48",
    "androidCompose": "SilknetPalette.silkfest48",
    "reactCss": "var(--silkfest-48)"
  },
  {
    "path": "Alpha/White/4%",
    "name": "alphaWhite4",
    "category": "Alpha",
    "hex": "#FFFFFF0a",
    "ios": "Color.silknet.alphaWhite4",
    "androidCompose": "SilknetPalette.alphaWhite4",
    "reactCss": "var(--alpha-white-4)"
  },
  {
    "path": "Alpha/White/8%",
    "name": "alphaWhite8",
    "category": "Alpha",
    "hex": "#FFFFFF14",
    "ios": "Color.silknet.alphaWhite8",
    "androidCompose": "SilknetPalette.alphaWhite8",
    "reactCss": "var(--alpha-white-8)"
  },
  {
    "path": "Alpha/White/12%",
    "name": "alphaWhite12",
    "category": "Alpha",
    "hex": "#FFFFFF1f",
    "ios": "Color.silknet.alphaWhite12",
    "androidCompose": "SilknetPalette.alphaWhite12",
    "reactCss": "var(--alpha-white-12)"
  },
  {
    "path": "Alpha/White/16%",
    "name": "alphaWhite16",
    "category": "Alpha",
    "hex": "#FFFFFF29",
    "ios": "Color.silknet.alphaWhite16",
    "androidCompose": "SilknetPalette.alphaWhite16",
    "reactCss": "var(--alpha-white-16)"
  },
  {
    "path": "Alpha/White/24%",
    "name": "alphaWhite24",
    "category": "Alpha",
    "hex": "#FFFFFF3d",
    "ios": "Color.silknet.alphaWhite24",
    "androidCompose": "SilknetPalette.alphaWhite24",
    "reactCss": "var(--alpha-white-24)"
  },
  {
    "path": "Alpha/White/32%",
    "name": "alphaWhite32",
    "category": "Alpha",
    "hex": "#FFFFFF52",
    "ios": "Color.silknet.alphaWhite32",
    "androidCompose": "SilknetPalette.alphaWhite32",
    "reactCss": "var(--alpha-white-32)"
  },
  {
    "path": "Alpha/White/48%",
    "name": "alphaWhite48",
    "category": "Alpha",
    "hex": "#FFFFFF7a",
    "ios": "Color.silknet.alphaWhite48",
    "androidCompose": "SilknetPalette.alphaWhite48",
    "reactCss": "var(--alpha-white-48)"
  },
  {
    "path": "Alpha/White/64%",
    "name": "alphaWhite64",
    "category": "Alpha",
    "hex": "#FFFFFFa3",
    "ios": "Color.silknet.alphaWhite64",
    "androidCompose": "SilknetPalette.alphaWhite64",
    "reactCss": "var(--alpha-white-64)"
  },
  {
    "path": "Alpha/White/80%",
    "name": "alphaWhite80",
    "category": "Alpha",
    "hex": "#FFFFFFcc",
    "ios": "Color.silknet.alphaWhite80",
    "androidCompose": "SilknetPalette.alphaWhite80",
    "reactCss": "var(--alpha-white-80)"
  },
  {
    "path": "Alpha/White/96%",
    "name": "alphaWhite96",
    "category": "Alpha",
    "hex": "#FFFFFFf5",
    "ios": "Color.silknet.alphaWhite96",
    "androidCompose": "SilknetPalette.alphaWhite96",
    "reactCss": "var(--alpha-white-96)"
  },
  {
    "path": "Alpha/White/100%",
    "name": "alphaWhite100",
    "category": "Alpha",
    "hex": "#FFFFFF",
    "ios": "Color.silknet.alphaWhite100",
    "androidCompose": "SilknetPalette.alphaWhite100",
    "reactCss": "var(--alpha-white-100)"
  },
  {
    "path": "Alpha/Black/4%",
    "name": "alphaBlack4",
    "category": "Alpha",
    "hex": "#0000000a",
    "ios": "Color.silknet.alphaBlack4",
    "androidCompose": "SilknetPalette.alphaBlack4",
    "reactCss": "var(--alpha-black-4)"
  },
  {
    "path": "Alpha/Black/8%",
    "name": "alphaBlack8",
    "category": "Alpha",
    "hex": "#00000014",
    "ios": "Color.silknet.alphaBlack8",
    "androidCompose": "SilknetPalette.alphaBlack8",
    "reactCss": "var(--alpha-black-8)"
  },
  {
    "path": "Alpha/Black/12%",
    "name": "alphaBlack12",
    "category": "Alpha",
    "hex": "#0000001f",
    "ios": "Color.silknet.alphaBlack12",
    "androidCompose": "SilknetPalette.alphaBlack12",
    "reactCss": "var(--alpha-black-12)"
  },
  {
    "path": "Alpha/Black/16%",
    "name": "alphaBlack16",
    "category": "Alpha",
    "hex": "#00000029",
    "ios": "Color.silknet.alphaBlack16",
    "androidCompose": "SilknetPalette.alphaBlack16",
    "reactCss": "var(--alpha-black-16)"
  },
  {
    "path": "Alpha/Black/24%",
    "name": "alphaBlack24",
    "category": "Alpha",
    "hex": "#0000003d",
    "ios": "Color.silknet.alphaBlack24",
    "androidCompose": "SilknetPalette.alphaBlack24",
    "reactCss": "var(--alpha-black-24)"
  },
  {
    "path": "Alpha/Black/32%",
    "name": "alphaBlack32",
    "category": "Alpha",
    "hex": "#00000052",
    "ios": "Color.silknet.alphaBlack32",
    "androidCompose": "SilknetPalette.alphaBlack32",
    "reactCss": "var(--alpha-black-32)"
  },
  {
    "path": "Alpha/Black/48%",
    "name": "alphaBlack48",
    "category": "Alpha",
    "hex": "#0000007a",
    "ios": "Color.silknet.alphaBlack48",
    "androidCompose": "SilknetPalette.alphaBlack48",
    "reactCss": "var(--alpha-black-48)"
  },
  {
    "path": "Alpha/Black/64%",
    "name": "alphaBlack64",
    "category": "Alpha",
    "hex": "#000000a3",
    "ios": "Color.silknet.alphaBlack64",
    "androidCompose": "SilknetPalette.alphaBlack64",
    "reactCss": "var(--alpha-black-64)"
  },
  {
    "path": "Alpha/Black/80%",
    "name": "alphaBlack80",
    "category": "Alpha",
    "hex": "#000000cc",
    "ios": "Color.silknet.alphaBlack80",
    "androidCompose": "SilknetPalette.alphaBlack80",
    "reactCss": "var(--alpha-black-80)"
  },
  {
    "path": "Alpha/Black/96%",
    "name": "alphaBlack96",
    "category": "Alpha",
    "hex": "#000000f5",
    "ios": "Color.silknet.alphaBlack96",
    "androidCompose": "SilknetPalette.alphaBlack96",
    "reactCss": "var(--alpha-black-96)"
  },
  {
    "path": "Alpha/Black/100%",
    "name": "alphaBlack100",
    "category": "Alpha",
    "hex": "#000000",
    "ios": "Color.silknet.alphaBlack100",
    "androidCompose": "SilknetPalette.alphaBlack100",
    "reactCss": "var(--alpha-black-100)"
  }
];

export const textStyles: TextStyleToken[] = [
  {
    "path": "Heading/Heading 1",
    "category": "Heading",
    "name": "headingHeading1",
    "fontFamily": "Noto Sans Georgian",
    "fontWeight": 500,
    "fontSize": "32px",
    "lineHeight": "48px",
    "letterSpacing": "0px",
    "ios": "Font.silknet.headingHeading1",
    "androidCompose": "Silknet.typography.headingHeading1",
    "reactCssBlock": "font-family: 'Noto Sans Georgian', system-ui, sans-serif;\nfont-weight: 500;\nfont-size: 32px;\nline-height: 48px;\nletter-spacing: 0px;"
  },
  {
    "path": "Heading/Heading 2",
    "category": "Heading",
    "name": "headingHeading2",
    "fontFamily": "Noto Sans Georgian",
    "fontWeight": 500,
    "fontSize": "28px",
    "lineHeight": "40px",
    "letterSpacing": "0px",
    "ios": "Font.silknet.headingHeading2",
    "androidCompose": "Silknet.typography.headingHeading2",
    "reactCssBlock": "font-family: 'Noto Sans Georgian', system-ui, sans-serif;\nfont-weight: 500;\nfont-size: 28px;\nline-height: 40px;\nletter-spacing: 0px;"
  },
  {
    "path": "Heading/Heading 3",
    "category": "Heading",
    "name": "headingHeading3",
    "fontFamily": "Noto Sans Georgian",
    "fontWeight": 500,
    "fontSize": "20px",
    "lineHeight": "28px",
    "letterSpacing": "0px",
    "ios": "Font.silknet.headingHeading3",
    "androidCompose": "Silknet.typography.headingHeading3",
    "reactCssBlock": "font-family: 'Noto Sans Georgian', system-ui, sans-serif;\nfont-weight: 500;\nfont-size: 20px;\nline-height: 28px;\nletter-spacing: 0px;"
  },
  {
    "path": "Heading/Heading 4",
    "category": "Heading",
    "name": "headingHeading4",
    "fontFamily": "Noto Sans Georgian",
    "fontWeight": 600,
    "fontSize": "16px",
    "lineHeight": "24px",
    "letterSpacing": "0px",
    "ios": "Font.silknet.headingHeading4",
    "androidCompose": "Silknet.typography.headingHeading4",
    "reactCssBlock": "font-family: 'Noto Sans Georgian', system-ui, sans-serif;\nfont-weight: 600;\nfont-size: 16px;\nline-height: 24px;\nletter-spacing: 0px;"
  },
  {
    "path": "Heading/Display",
    "category": "Heading",
    "name": "headingDisplay",
    "fontFamily": "Noto Sans Georgian",
    "fontWeight": 400,
    "fontSize": "20px",
    "lineHeight": "28px",
    "letterSpacing": "0px",
    "ios": "Font.silknet.headingDisplay",
    "androidCompose": "Silknet.typography.headingDisplay",
    "reactCssBlock": "font-family: 'Noto Sans Georgian', system-ui, sans-serif;\nfont-weight: 400;\nfont-size: 20px;\nline-height: 28px;\nletter-spacing: 0px;"
  },
  {
    "path": "Subtitle/Subtitle 1",
    "category": "Subtitle",
    "name": "subtitleSubtitle1",
    "fontFamily": "Noto Sans Georgian",
    "fontWeight": 500,
    "fontSize": "16px",
    "lineHeight": "24px",
    "letterSpacing": "0px",
    "ios": "Font.silknet.subtitleSubtitle1",
    "androidCompose": "Silknet.typography.subtitleSubtitle1",
    "reactCssBlock": "font-family: 'Noto Sans Georgian', system-ui, sans-serif;\nfont-weight: 500;\nfont-size: 16px;\nline-height: 24px;\nletter-spacing: 0px;"
  },
  {
    "path": "Subtitle/Subtitle 2",
    "category": "Subtitle",
    "name": "subtitleSubtitle2",
    "fontFamily": "Noto Sans Georgian",
    "fontWeight": 500,
    "fontSize": "14px",
    "lineHeight": "20px",
    "letterSpacing": "0px",
    "ios": "Font.silknet.subtitleSubtitle2",
    "androidCompose": "Silknet.typography.subtitleSubtitle2",
    "reactCssBlock": "font-family: 'Noto Sans Georgian', system-ui, sans-serif;\nfont-weight: 500;\nfont-size: 14px;\nline-height: 20px;\nletter-spacing: 0px;"
  },
  {
    "path": "Subtitle/Subtitle 3",
    "category": "Subtitle",
    "name": "subtitleSubtitle3",
    "fontFamily": "Noto Sans Georgian",
    "fontWeight": 500,
    "fontSize": "12px",
    "lineHeight": "16px",
    "letterSpacing": "0px",
    "ios": "Font.silknet.subtitleSubtitle3",
    "androidCompose": "Silknet.typography.subtitleSubtitle3",
    "reactCssBlock": "font-family: 'Noto Sans Georgian', system-ui, sans-serif;\nfont-weight: 500;\nfont-size: 12px;\nline-height: 16px;\nletter-spacing: 0px;"
  },
  {
    "path": "Body/Body accent",
    "category": "Body",
    "name": "bodyBodyAccent",
    "fontFamily": "Noto Sans Georgian",
    "fontWeight": 400,
    "fontSize": "16px",
    "lineHeight": "24px",
    "letterSpacing": "0px",
    "ios": "Font.silknet.bodyBodyAccent",
    "androidCompose": "Silknet.typography.bodyBodyAccent",
    "reactCssBlock": "font-family: 'Noto Sans Georgian', system-ui, sans-serif;\nfont-weight: 400;\nfont-size: 16px;\nline-height: 24px;\nletter-spacing: 0px;"
  },
  {
    "path": "Body/Body default",
    "category": "Body",
    "name": "bodyBodyDefault",
    "fontFamily": "Noto Sans Georgian",
    "fontWeight": 400,
    "fontSize": "14px",
    "lineHeight": "20px",
    "letterSpacing": "0px",
    "ios": "Font.silknet.bodyBodyDefault",
    "androidCompose": "Silknet.typography.bodyBodyDefault",
    "reactCssBlock": "font-family: 'Noto Sans Georgian', system-ui, sans-serif;\nfont-weight: 400;\nfont-size: 14px;\nline-height: 20px;\nletter-spacing: 0px;"
  },
  {
    "path": "Body/Body additional",
    "category": "Body",
    "name": "bodyBodyAdditional",
    "fontFamily": "Noto Sans Georgian",
    "fontWeight": 400,
    "fontSize": "12px",
    "lineHeight": "16px",
    "letterSpacing": "0px",
    "ios": "Font.silknet.bodyBodyAdditional",
    "androidCompose": "Silknet.typography.bodyBodyAdditional",
    "reactCssBlock": "font-family: 'Noto Sans Georgian', system-ui, sans-serif;\nfont-weight: 400;\nfont-size: 12px;\nline-height: 16px;\nletter-spacing: 0px;"
  },
  {
    "path": "Button/Button default",
    "category": "Button",
    "name": "buttonButtonDefault",
    "fontFamily": "Noto Sans Georgian",
    "fontWeight": 500,
    "fontSize": "14px",
    "lineHeight": "20px",
    "letterSpacing": "0.2px",
    "ios": "Font.silknet.buttonButtonDefault",
    "androidCompose": "Silknet.typography.buttonButtonDefault",
    "reactCssBlock": "font-family: 'Noto Sans Georgian', system-ui, sans-serif;\nfont-weight: 500;\nfont-size: 14px;\nline-height: 20px;\nletter-spacing: 0.2px;"
  },
  {
    "path": "Button/Button additional",
    "category": "Button",
    "name": "buttonButtonAdditional",
    "fontFamily": "Noto Sans Georgian",
    "fontWeight": 500,
    "fontSize": "12px",
    "lineHeight": "16px",
    "letterSpacing": "0.2px",
    "ios": "Font.silknet.buttonButtonAdditional",
    "androidCompose": "Silknet.typography.buttonButtonAdditional",
    "reactCssBlock": "font-family: 'Noto Sans Georgian', system-ui, sans-serif;\nfont-weight: 500;\nfont-size: 12px;\nline-height: 16px;\nletter-spacing: 0.2px;"
  },
  {
    "path": "Button/LinkButton default",
    "category": "Button",
    "name": "buttonLinkbuttonDefault",
    "fontFamily": "Noto Sans Georgian",
    "fontWeight": 500,
    "fontSize": "14px",
    "lineHeight": "16px",
    "letterSpacing": "0.2px",
    "ios": "Font.silknet.buttonLinkbuttonDefault",
    "androidCompose": "Silknet.typography.buttonLinkbuttonDefault",
    "reactCssBlock": "font-family: 'Noto Sans Georgian', system-ui, sans-serif;\nfont-weight: 500;\nfont-size: 14px;\nline-height: 16px;\nletter-spacing: 0.2px;"
  },
  {
    "path": "Button/LinkButton additional",
    "category": "Button",
    "name": "buttonLinkbuttonAdditional",
    "fontFamily": "Noto Sans Georgian",
    "fontWeight": 500,
    "fontSize": "12px",
    "lineHeight": "16px",
    "letterSpacing": "0px",
    "ios": "Font.silknet.buttonLinkbuttonAdditional",
    "androidCompose": "Silknet.typography.buttonLinkbuttonAdditional",
    "reactCssBlock": "font-family: 'Noto Sans Georgian', system-ui, sans-serif;\nfont-weight: 500;\nfont-size: 12px;\nline-height: 16px;\nletter-spacing: 0px;"
  },
  {
    "path": "Other/Caption",
    "category": "Other",
    "name": "otherCaption",
    "fontFamily": "Noto Sans Georgian",
    "fontWeight": 400,
    "fontSize": "11px",
    "lineHeight": "16px",
    "letterSpacing": "0.25px",
    "ios": "Font.silknet.otherCaption",
    "androidCompose": "Silknet.typography.otherCaption",
    "reactCssBlock": "font-family: 'Noto Sans Georgian', system-ui, sans-serif;\nfont-weight: 400;\nfont-size: 11px;\nline-height: 16px;\nletter-spacing: 0.25px;"
  },
  {
    "path": "Other/Overline",
    "category": "Other",
    "name": "otherOverline",
    "fontFamily": "Noto Sans Georgian",
    "fontWeight": 600,
    "fontSize": "11px",
    "lineHeight": "12px",
    "letterSpacing": "0.25px",
    "ios": "Font.silknet.otherOverline",
    "androidCompose": "Silknet.typography.otherOverline",
    "reactCssBlock": "font-family: 'Noto Sans Georgian', system-ui, sans-serif;\nfont-weight: 600;\nfont-size: 11px;\nline-height: 12px;\nletter-spacing: 0.25px;"
  }
];
