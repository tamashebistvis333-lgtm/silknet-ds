// Auto-generated from silknet-ds tokens. Do not edit by hand.
// Source: tokens/*.json. Re-run `npm run build:swift` after token changes.

import SwiftUI
import UIKit

/// Silknet color palette. Use via the `Color.silknet` static accessor:
///
///     Text("Hello").foregroundColor(Color.silknet.textDefault)
///
/// Semantic colors automatically switch between light and dark when the user
/// changes the system appearance — no manual theme code required.
public extension Color {
    static let silknet = SilknetColorPalette()
}

public struct SilknetColorPalette {
    // ── Semantic colors (auto-switch light/dark) ────────────────────────────
    public let textDefault: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.973, green: 0.976, blue: 0.976, alpha: 1) : UIColor(red: 0.196, green: 0.227, blue: 0.247, alpha: 1)
    })

    public let textSecondary: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.878, green: 0.89, blue: 0.898, alpha: 1) : UIColor(red: 0.294, green: 0.337, blue: 0.369, alpha: 1)
    })

    public let textAdditional: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.69, green: 0.725, blue: 0.749, alpha: 1) : UIColor(red: 0.412, green: 0.459, blue: 0.494, alpha: 1)
    })

    public let textDisabled: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.294, green: 0.337, blue: 0.369, alpha: 1) : UIColor(red: 0.878, green: 0.89, blue: 0.898, alpha: 1)
    })

    public let textContrast: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0, green: 0, blue: 0, alpha: 1) : UIColor(red: 1, green: 1, blue: 1, alpha: 1)
    })

    public let textPrimary: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.6, green: 0.816, blue: 0.969, alpha: 1) : UIColor(red: 0, green: 0.431, blue: 0.737, alpha: 1)
    })

    public let textSuccess: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.549, green: 0.886, blue: 0.706, alpha: 1) : UIColor(red: 0.129, green: 0.522, blue: 0.341, alpha: 1)
    })

    public let textError: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.973, green: 0.651, blue: 0.678, alpha: 1) : UIColor(red: 0.722, green: 0.196, blue: 0.231, alpha: 1)
    })

    public let textWarrning: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 1, green: 0.851, blue: 0.502, alpha: 1) : UIColor(red: 0.6, green: 0.4, blue: 0, alpha: 1)
    })

    public let textInfo: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.682, green: 0.867, blue: 0.957, alpha: 1) : UIColor(red: 0.106, green: 0.431, blue: 0.596, alpha: 1)
    })

    public let textOrange: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.973, green: 0.741, blue: 0.627, alpha: 1) : UIColor(red: 0.667, green: 0.267, blue: 0.094, alpha: 1)
    })

    public let textPurple: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.745, green: 0.659, blue: 0.969, alpha: 1) : UIColor(red: 0.357, green: 0.161, blue: 0.749, alpha: 1)
    })

    public let textPink: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.969, green: 0.659, blue: 0.875, alpha: 1) : UIColor(red: 0.749, green: 0.161, blue: 0.533, alpha: 1)
    })

    public let textTeal: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.588, green: 0.89, blue: 0.89, alpha: 1) : UIColor(red: 0.086, green: 0.549, blue: 0.549, alpha: 1)
    })

    public let textSilkfest: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 1, green: 0.671, blue: 0.4, alpha: 1) : UIColor(red: 0.6, green: 0.271, blue: 0, alpha: 1)
    })

    public let backgroundSurface: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.114, green: 0.137, blue: 0.153, alpha: 1) : UIColor(red: 0.973, green: 0.976, blue: 0.976, alpha: 1)
    })

    public let backgroundSurfaceHover: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.196, green: 0.227, blue: 0.247, alpha: 1) : UIColor(red: 0.929, green: 0.937, blue: 0.941, alpha: 1)
    })

    public let backgroundSurfacePressed: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.294, green: 0.337, blue: 0.369, alpha: 1) : UIColor(red: 0.878, green: 0.89, blue: 0.898, alpha: 1)
    })

    public let backgroundLayer: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.196, green: 0.227, blue: 0.247, alpha: 1) : UIColor(red: 1, green: 1, blue: 1, alpha: 1)
    })

    public let backgroundLayerHover: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0, green: 0, blue: 0, alpha: 0.078) : UIColor(red: 0, green: 0, blue: 0, alpha: 0.078)
    })

    public let backgroundLayerPressed: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0, green: 0, blue: 0, alpha: 0.161) : UIColor(red: 0, green: 0, blue: 0, alpha: 0.161)
    })

    public let backgroundPrimaryAccent: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0, green: 0.537, blue: 0.922, alpha: 1) : UIColor(red: 0, green: 0.537, blue: 0.922, alpha: 1)
    })

    public let backgroundSuccessAccent: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.161, green: 0.682, blue: 0.435, alpha: 1) : UIColor(red: 0.161, green: 0.682, blue: 0.435, alpha: 1)
    })

    public let backgroundErrorAccent: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.859, green: 0.247, blue: 0.286, alpha: 1) : UIColor(red: 0.859, green: 0.247, blue: 0.286, alpha: 1)
    })

    public let backgroundWarningAccent: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.898, green: 0.624, blue: 0, alpha: 1) : UIColor(red: 0.898, green: 0.624, blue: 0, alpha: 1)
    })

    public let backgroundInfoAccent: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.145, green: 0.592, blue: 0.816, alpha: 1) : UIColor(red: 0.145, green: 0.592, blue: 0.816, alpha: 1)
    })

    public let backgroundOrangeAccent: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.882, green: 0.361, blue: 0.098, alpha: 1) : UIColor(red: 0.882, green: 0.361, blue: 0.098, alpha: 1)
    })

    public let backgroundPurpleAccent: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.467, green: 0.263, blue: 0.871, alpha: 1) : UIColor(red: 0.467, green: 0.263, blue: 0.871, alpha: 1)
    })

    public let backgroundPinkAccent: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.871, green: 0.263, blue: 0.647, alpha: 1) : UIColor(red: 0.871, green: 0.263, blue: 0.647, alpha: 1)
    })

    public let backgroundTealAccent: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.153, green: 0.667, blue: 0.667, alpha: 1) : UIColor(red: 0.153, green: 0.667, blue: 0.667, alpha: 1)
    })

    public let backgroundSilkfestAccent: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.8, green: 0.361, blue: 0, alpha: 1) : UIColor(red: 0.8, green: 0.361, blue: 0, alpha: 1)
    })

    public let backgroundDisabled: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.294, green: 0.337, blue: 0.369, alpha: 1) : UIColor(red: 0.878, green: 0.89, blue: 0.898, alpha: 1)
    })

    public let backgroundPrimary: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0, green: 0.106, blue: 0.184, alpha: 1) : UIColor(red: 0.906, green: 0.957, blue: 0.992, alpha: 1)
    })

    public let backgroundSuccess: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.055, green: 0.208, blue: 0.145, alpha: 1) : UIColor(red: 0.894, green: 0.965, blue: 0.925, alpha: 1)
    })

    public let backgroundError: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.247, green: 0.063, blue: 0.082, alpha: 1) : UIColor(red: 0.992, green: 0.922, blue: 0.925, alpha: 1)
    })

    public let backgroundWarning: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.302, green: 0.2, blue: 0, alpha: 1) : UIColor(red: 1, green: 0.965, blue: 0.882, alpha: 1)
    })

    public let backgroundInfo: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.059, green: 0.247, blue: 0.341, alpha: 1) : UIColor(red: 0.914, green: 0.965, blue: 0.988, alpha: 1)
    })

    public let backgroundOrange: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.243, green: 0.098, blue: 0.035, alpha: 1) : UIColor(red: 0.992, green: 0.925, blue: 0.89, alpha: 1)
    })

    public let backgroundPurple: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.129, green: 0.059, blue: 0.282, alpha: 1) : UIColor(red: 0.937, green: 0.914, blue: 0.988, alpha: 1)
    })

    public let backgroundPink: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.282, green: 0.059, blue: 0.2, alpha: 1) : UIColor(red: 0.988, green: 0.914, blue: 0.961, alpha: 1)
    })

    public let backgroundTeal: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.02, green: 0.2, blue: 0.212, alpha: 1) : UIColor(red: 0.922, green: 0.98, blue: 0.98, alpha: 1)
    })

    public let backgroundSilkfest: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.2, green: 0.09, blue: 0, alpha: 1) : UIColor(red: 1, green: 0.89, blue: 0.8, alpha: 1)
    })

    public let backgroundToggleDefault: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.294, green: 0.337, blue: 0.369, alpha: 1) : UIColor(red: 0.929, green: 0.937, blue: 0.941, alpha: 1)
    })

    public let backgroundChipDefault: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.294, green: 0.337, blue: 0.369, alpha: 1) : UIColor(red: 0.973, green: 0.976, blue: 0.976, alpha: 1)
    })

    public let backgroundChipSelected: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.973, green: 0.976, blue: 0.976, alpha: 1) : UIColor(red: 0.294, green: 0.337, blue: 0.369, alpha: 1)
    })

    public let backgroundPrimarySoft: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.2, green: 0.631, blue: 0.937, alpha: 0.078) : UIColor(red: 0.2, green: 0.631, blue: 0.937, alpha: 0.078)
    })

    public let backgroundNavigation: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.69, green: 0.725, blue: 0.749, alpha: 0.039) : UIColor(red: 1, green: 1, blue: 1, alpha: 0.239)
    })

    public let backgroundInputDefault: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.69, green: 0.725, blue: 0.749, alpha: 0.078) : UIColor(red: 0.69, green: 0.725, blue: 0.749, alpha: 0.078)
    })

    public let backgroundInputHover: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.69, green: 0.725, blue: 0.749, alpha: 0.161) : UIColor(red: 0.69, green: 0.725, blue: 0.749, alpha: 0.161)
    })

    public let backgroundInputPressed: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.69, green: 0.725, blue: 0.749, alpha: 0.239) : UIColor(red: 0.69, green: 0.725, blue: 0.749, alpha: 0.239)
    })

    public let borderDefault: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.412, green: 0.459, blue: 0.494, alpha: 1) : UIColor(red: 0.69, green: 0.725, blue: 0.749, alpha: 0.322)
    })

    public let borderSubtle: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.294, green: 0.337, blue: 0.369, alpha: 1) : UIColor(red: 0.69, green: 0.725, blue: 0.749, alpha: 0.161)
    })

    public let borderFilled: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.294, green: 0.337, blue: 0.369, alpha: 1) : UIColor(red: 0.412, green: 0.459, blue: 0.494, alpha: 1)
    })

    public let borderPrimaryFocus: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0, green: 0.537, blue: 0.922, alpha: 1) : UIColor(red: 0, green: 0.537, blue: 0.922, alpha: 1)
    })

    public let borderPrimary: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0, green: 0.216, blue: 0.369, alpha: 1) : UIColor(red: 0.8, green: 0.906, blue: 0.984, alpha: 1)
    })

    public let borderSuccess: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.075, green: 0.298, blue: 0.204, alpha: 1) : UIColor(red: 0.776, green: 0.925, blue: 0.843, alpha: 1)
    })

    public let borderError: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.4, green: 0.106, blue: 0.133, alpha: 1) : UIColor(red: 0.984, green: 0.816, blue: 0.827, alpha: 1)
    })

    public let borderErrorFocus: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.4, green: 0.106, blue: 0.133, alpha: 1) : UIColor(red: 0.859, green: 0.247, blue: 0.286, alpha: 1)
    })

    public let borderWarning: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.451, green: 0.298, blue: 0, alpha: 1) : UIColor(red: 1, green: 0.914, blue: 0.722, alpha: 1)
    })

    public let borderInfo: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.075, green: 0.306, blue: 0.424, alpha: 1) : UIColor(red: 0.824, green: 0.925, blue: 0.976, alpha: 1)
    })

    public let borderOrange: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.349, green: 0.141, blue: 0.051, alpha: 1) : UIColor(red: 0.984, green: 0.859, blue: 0.796, alpha: 1)
    })

    public let borderPurple: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.184, green: 0.086, blue: 0.412, alpha: 1) : UIColor(red: 0.851, green: 0.792, blue: 0.98, alpha: 1)
    })

    public let borderPink: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.412, green: 0.086, blue: 0.29, alpha: 1) : UIColor(red: 0.976, green: 0.796, blue: 0.918, alpha: 1)
    })

    public let borderTeal: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.039, green: 0.302, blue: 0.322, alpha: 1) : UIColor(red: 0.765, green: 0.937, blue: 0.937, alpha: 1)
    })

    public let borderSilkfest: Color = Color(uiColor: UIColor { trait in
        trait.userInterfaceStyle == .dark ? UIColor(red: 0.302, green: 0.137, blue: 0, alpha: 1) : UIColor(red: 1, green: 0.78, blue: 0.6, alpha: 1)
    })

    // ── Primitive palette (static; same value across themes) ────────────────
    public let primary100: Color = Color(uiColor: UIColor(red: 0.906, green: 0.957, blue: 0.992, alpha: 1))
    public let primary200: Color = Color(uiColor: UIColor(red: 0.8, green: 0.906, blue: 0.984, alpha: 1))
    public let primary300: Color = Color(uiColor: UIColor(red: 0.6, green: 0.816, blue: 0.969, alpha: 1))
    public let primary400: Color = Color(uiColor: UIColor(red: 0.4, green: 0.722, blue: 0.953, alpha: 1))
    public let primary500: Color = Color(uiColor: UIColor(red: 0.2, green: 0.631, blue: 0.937, alpha: 1))
    public let primary600: Color = Color(uiColor: UIColor(red: 0, green: 0.537, blue: 0.922, alpha: 1))
    public let primary700: Color = Color(uiColor: UIColor(red: 0, green: 0.431, blue: 0.737, alpha: 1))
    public let primary800: Color = Color(uiColor: UIColor(red: 0, green: 0.322, blue: 0.553, alpha: 1))
    public let primary900: Color = Color(uiColor: UIColor(red: 0, green: 0.216, blue: 0.369, alpha: 1))
    public let primary950: Color = Color(uiColor: UIColor(red: 0, green: 0.106, blue: 0.184, alpha: 1))
    public let primary4: Color = Color(uiColor: UIColor(red: 0.2, green: 0.631, blue: 0.937, alpha: 0.039))
    public let primary8: Color = Color(uiColor: UIColor(red: 0.2, green: 0.631, blue: 0.937, alpha: 0.078))
    public let primary16: Color = Color(uiColor: UIColor(red: 0.2, green: 0.631, blue: 0.937, alpha: 0.161))
    public let primary24: Color = Color(uiColor: UIColor(red: 0.2, green: 0.631, blue: 0.937, alpha: 0.239))
    public let primary32: Color = Color(uiColor: UIColor(red: 0.2, green: 0.631, blue: 0.937, alpha: 0.322))
    public let primary40: Color = Color(uiColor: UIColor(red: 0.2, green: 0.631, blue: 0.937, alpha: 0.4))
    public let primary48: Color = Color(uiColor: UIColor(red: 0.2, green: 0.631, blue: 0.937, alpha: 0.478))
    public let grey100: Color = Color(uiColor: UIColor(red: 0.973, green: 0.976, blue: 0.976, alpha: 1))
    public let grey200: Color = Color(uiColor: UIColor(red: 0.929, green: 0.937, blue: 0.941, alpha: 1))
    public let grey300: Color = Color(uiColor: UIColor(red: 0.878, green: 0.89, blue: 0.898, alpha: 1))
    public let grey400: Color = Color(uiColor: UIColor(red: 0.804, green: 0.824, blue: 0.839, alpha: 1))
    public let grey500: Color = Color(uiColor: UIColor(red: 0.69, green: 0.725, blue: 0.749, alpha: 1))
    public let grey600: Color = Color(uiColor: UIColor(red: 0.557, green: 0.604, blue: 0.639, alpha: 1))
    public let grey700: Color = Color(uiColor: UIColor(red: 0.412, green: 0.459, blue: 0.494, alpha: 1))
    public let grey800: Color = Color(uiColor: UIColor(red: 0.294, green: 0.337, blue: 0.369, alpha: 1))
    public let grey900: Color = Color(uiColor: UIColor(red: 0.196, green: 0.227, blue: 0.247, alpha: 1))
    public let grey950: Color = Color(uiColor: UIColor(red: 0.114, green: 0.137, blue: 0.153, alpha: 1))
    public let grey4: Color = Color(uiColor: UIColor(red: 0.69, green: 0.725, blue: 0.749, alpha: 0.039))
    public let grey8: Color = Color(uiColor: UIColor(red: 0.69, green: 0.725, blue: 0.749, alpha: 0.078))
    public let grey16: Color = Color(uiColor: UIColor(red: 0.69, green: 0.725, blue: 0.749, alpha: 0.161))
    public let grey24: Color = Color(uiColor: UIColor(red: 0.69, green: 0.725, blue: 0.749, alpha: 0.239))
    public let grey32: Color = Color(uiColor: UIColor(red: 0.69, green: 0.725, blue: 0.749, alpha: 0.322))
    public let grey40: Color = Color(uiColor: UIColor(red: 0.69, green: 0.725, blue: 0.749, alpha: 0.4))
    public let grey48: Color = Color(uiColor: UIColor(red: 0.69, green: 0.725, blue: 0.749, alpha: 0.478))
    public let green100: Color = Color(uiColor: UIColor(red: 0.894, green: 0.965, blue: 0.925, alpha: 1))
    public let green200: Color = Color(uiColor: UIColor(red: 0.776, green: 0.925, blue: 0.843, alpha: 1))
    public let green300: Color = Color(uiColor: UIColor(red: 0.549, green: 0.886, blue: 0.706, alpha: 1))
    public let green400: Color = Color(uiColor: UIColor(red: 0.365, green: 0.843, blue: 0.604, alpha: 1))
    public let green500: Color = Color(uiColor: UIColor(red: 0.196, green: 0.788, blue: 0.502, alpha: 1))
    public let green600: Color = Color(uiColor: UIColor(red: 0.161, green: 0.682, blue: 0.435, alpha: 1))
    public let green700: Color = Color(uiColor: UIColor(red: 0.129, green: 0.522, blue: 0.341, alpha: 1))
    public let green800: Color = Color(uiColor: UIColor(red: 0.094, green: 0.416, blue: 0.278, alpha: 1))
    public let green900: Color = Color(uiColor: UIColor(red: 0.075, green: 0.298, blue: 0.204, alpha: 1))
    public let green950: Color = Color(uiColor: UIColor(red: 0.055, green: 0.208, blue: 0.145, alpha: 1))
    public let green4: Color = Color(uiColor: UIColor(red: 0.196, green: 0.788, blue: 0.502, alpha: 0.039))
    public let green8: Color = Color(uiColor: UIColor(red: 0.196, green: 0.788, blue: 0.502, alpha: 0.078))
    public let green16: Color = Color(uiColor: UIColor(red: 0.196, green: 0.788, blue: 0.502, alpha: 0.161))
    public let green24: Color = Color(uiColor: UIColor(red: 0.196, green: 0.788, blue: 0.502, alpha: 0.239))
    public let green32: Color = Color(uiColor: UIColor(red: 0.196, green: 0.788, blue: 0.502, alpha: 0.322))
    public let green40: Color = Color(uiColor: UIColor(red: 0.196, green: 0.788, blue: 0.502, alpha: 0.4))
    public let green48: Color = Color(uiColor: UIColor(red: 0.196, green: 0.788, blue: 0.502, alpha: 0.478))
    public let red100: Color = Color(uiColor: UIColor(red: 0.992, green: 0.922, blue: 0.925, alpha: 1))
    public let red200: Color = Color(uiColor: UIColor(red: 0.984, green: 0.816, blue: 0.827, alpha: 1))
    public let red300: Color = Color(uiColor: UIColor(red: 0.973, green: 0.651, blue: 0.678, alpha: 1))
    public let red400: Color = Color(uiColor: UIColor(red: 0.953, green: 0.455, blue: 0.494, alpha: 1))
    public let red500: Color = Color(uiColor: UIColor(red: 0.961, green: 0.318, blue: 0.361, alpha: 1))
    public let red600: Color = Color(uiColor: UIColor(red: 0.859, green: 0.247, blue: 0.286, alpha: 1))
    public let red700: Color = Color(uiColor: UIColor(red: 0.722, green: 0.196, blue: 0.231, alpha: 1))
    public let red800: Color = Color(uiColor: UIColor(red: 0.561, green: 0.149, blue: 0.18, alpha: 1))
    public let red900: Color = Color(uiColor: UIColor(red: 0.4, green: 0.106, blue: 0.133, alpha: 1))
    public let red950: Color = Color(uiColor: UIColor(red: 0.247, green: 0.063, blue: 0.082, alpha: 1))
    public let red4: Color = Color(uiColor: UIColor(red: 0.961, green: 0.318, blue: 0.361, alpha: 0.039))
    public let red8: Color = Color(uiColor: UIColor(red: 0.961, green: 0.318, blue: 0.361, alpha: 0.078))
    public let red16: Color = Color(uiColor: UIColor(red: 0.961, green: 0.318, blue: 0.361, alpha: 0.161))
    public let red24: Color = Color(uiColor: UIColor(red: 0.961, green: 0.318, blue: 0.361, alpha: 0.239))
    public let red32: Color = Color(uiColor: UIColor(red: 0.961, green: 0.318, blue: 0.361, alpha: 0.322))
    public let red40: Color = Color(uiColor: UIColor(red: 0.961, green: 0.318, blue: 0.361, alpha: 0.4))
    public let red48: Color = Color(uiColor: UIColor(red: 0.961, green: 0.318, blue: 0.361, alpha: 0.478))
    public let yellow100: Color = Color(uiColor: UIColor(red: 1, green: 0.965, blue: 0.882, alpha: 1))
    public let yellow200: Color = Color(uiColor: UIColor(red: 1, green: 0.914, blue: 0.722, alpha: 1))
    public let yellow300: Color = Color(uiColor: UIColor(red: 1, green: 0.851, blue: 0.502, alpha: 1))
    public let yellow400: Color = Color(uiColor: UIColor(red: 1, green: 0.784, blue: 0.29, alpha: 1))
    public let yellow500: Color = Color(uiColor: UIColor(red: 1, green: 0.718, blue: 0.078, alpha: 1))
    public let yellow600: Color = Color(uiColor: UIColor(red: 0.898, green: 0.624, blue: 0, alpha: 1))
    public let yellow700: Color = Color(uiColor: UIColor(red: 0.749, green: 0.51, blue: 0, alpha: 1))
    public let yellow800: Color = Color(uiColor: UIColor(red: 0.6, green: 0.4, blue: 0, alpha: 1))
    public let yellow900: Color = Color(uiColor: UIColor(red: 0.451, green: 0.298, blue: 0, alpha: 1))
    public let yellow950: Color = Color(uiColor: UIColor(red: 0.302, green: 0.2, blue: 0, alpha: 1))
    public let yellow4: Color = Color(uiColor: UIColor(red: 1, green: 0.718, blue: 0.078, alpha: 0.039))
    public let yellow8: Color = Color(uiColor: UIColor(red: 1, green: 0.718, blue: 0.078, alpha: 0.078))
    public let yellow16: Color = Color(uiColor: UIColor(red: 1, green: 0.718, blue: 0.078, alpha: 0.161))
    public let yellow24: Color = Color(uiColor: UIColor(red: 1, green: 0.718, blue: 0.078, alpha: 0.239))
    public let yellow32: Color = Color(uiColor: UIColor(red: 1, green: 0.718, blue: 0.078, alpha: 0.322))
    public let yellow40: Color = Color(uiColor: UIColor(red: 1, green: 0.718, blue: 0.078, alpha: 0.4))
    public let yellow48: Color = Color(uiColor: UIColor(red: 1, green: 0.718, blue: 0.078, alpha: 0.478))
    public let blue100: Color = Color(uiColor: UIColor(red: 0.914, green: 0.965, blue: 0.988, alpha: 1))
    public let blue200: Color = Color(uiColor: UIColor(red: 0.824, green: 0.925, blue: 0.976, alpha: 1))
    public let blue300: Color = Color(uiColor: UIColor(red: 0.682, green: 0.867, blue: 0.957, alpha: 1))
    public let blue400: Color = Color(uiColor: UIColor(red: 0.506, green: 0.792, blue: 0.937, alpha: 1))
    public let blue500: Color = Color(uiColor: UIColor(red: 0.239, green: 0.682, blue: 0.902, alpha: 1))
    public let blue600: Color = Color(uiColor: UIColor(red: 0.145, green: 0.592, blue: 0.816, alpha: 1))
    public let blue700: Color = Color(uiColor: UIColor(red: 0.11, green: 0.498, blue: 0.69, alpha: 1))
    public let blue800: Color = Color(uiColor: UIColor(red: 0.106, green: 0.431, blue: 0.596, alpha: 1))
    public let blue900: Color = Color(uiColor: UIColor(red: 0.075, green: 0.306, blue: 0.424, alpha: 1))
    public let blue950: Color = Color(uiColor: UIColor(red: 0.059, green: 0.247, blue: 0.341, alpha: 1))
    public let blue4: Color = Color(uiColor: UIColor(red: 0.239, green: 0.682, blue: 0.902, alpha: 0.039))
    public let blue8: Color = Color(uiColor: UIColor(red: 0.239, green: 0.682, blue: 0.902, alpha: 0.078))
    public let blue16: Color = Color(uiColor: UIColor(red: 0.239, green: 0.682, blue: 0.902, alpha: 0.161))
    public let blue24: Color = Color(uiColor: UIColor(red: 0.239, green: 0.682, blue: 0.902, alpha: 0.239))
    public let blue32: Color = Color(uiColor: UIColor(red: 0.239, green: 0.682, blue: 0.902, alpha: 0.322))
    public let blue40: Color = Color(uiColor: UIColor(red: 0.239, green: 0.682, blue: 0.902, alpha: 0.4))
    public let blue48: Color = Color(uiColor: UIColor(red: 0.239, green: 0.682, blue: 0.902, alpha: 0.478))
    public let orange100: Color = Color(uiColor: UIColor(red: 0.992, green: 0.925, blue: 0.89, alpha: 1))
    public let orange200: Color = Color(uiColor: UIColor(red: 0.984, green: 0.859, blue: 0.796, alpha: 1))
    public let orange300: Color = Color(uiColor: UIColor(red: 0.973, green: 0.741, blue: 0.627, alpha: 1))
    public let orange400: Color = Color(uiColor: UIColor(red: 0.965, green: 0.604, blue: 0.424, alpha: 1))
    public let orange500: Color = Color(uiColor: UIColor(red: 0.941, green: 0.455, blue: 0.212, alpha: 1))
    public let orange600: Color = Color(uiColor: UIColor(red: 0.882, green: 0.361, blue: 0.098, alpha: 1))
    public let orange700: Color = Color(uiColor: UIColor(red: 0.667, green: 0.267, blue: 0.094, alpha: 1))
    public let orange800: Color = Color(uiColor: UIColor(red: 0.49, green: 0.196, blue: 0.071, alpha: 1))
    public let orange900: Color = Color(uiColor: UIColor(red: 0.349, green: 0.141, blue: 0.051, alpha: 1))
    public let orange950: Color = Color(uiColor: UIColor(red: 0.243, green: 0.098, blue: 0.035, alpha: 1))
    public let orange4: Color = Color(uiColor: UIColor(red: 0.941, green: 0.455, blue: 0.212, alpha: 0.039))
    public let orange8: Color = Color(uiColor: UIColor(red: 0.941, green: 0.455, blue: 0.212, alpha: 0.078))
    public let orange16: Color = Color(uiColor: UIColor(red: 0.941, green: 0.455, blue: 0.212, alpha: 0.161))
    public let orange24: Color = Color(uiColor: UIColor(red: 0.941, green: 0.455, blue: 0.212, alpha: 0.239))
    public let orange32: Color = Color(uiColor: UIColor(red: 0.941, green: 0.455, blue: 0.212, alpha: 0.322))
    public let orange40: Color = Color(uiColor: UIColor(red: 0.941, green: 0.455, blue: 0.212, alpha: 0.4))
    public let orange48: Color = Color(uiColor: UIColor(red: 0.941, green: 0.455, blue: 0.212, alpha: 0.478))
    public let purple100: Color = Color(uiColor: UIColor(red: 0.937, green: 0.914, blue: 0.988, alpha: 1))
    public let purple200: Color = Color(uiColor: UIColor(red: 0.851, green: 0.792, blue: 0.98, alpha: 1))
    public let purple300: Color = Color(uiColor: UIColor(red: 0.745, green: 0.659, blue: 0.969, alpha: 1))
    public let purple400: Color = Color(uiColor: UIColor(red: 0.663, green: 0.525, blue: 0.957, alpha: 1))
    public let purple500: Color = Color(uiColor: UIColor(red: 0.576, green: 0.392, blue: 0.945, alpha: 1))
    public let purple600: Color = Color(uiColor: UIColor(red: 0.467, green: 0.263, blue: 0.871, alpha: 1))
    public let purple700: Color = Color(uiColor: UIColor(red: 0.357, green: 0.161, blue: 0.749, alpha: 1))
    public let purple800: Color = Color(uiColor: UIColor(red: 0.275, green: 0.122, blue: 0.58, alpha: 1))
    public let purple900: Color = Color(uiColor: UIColor(red: 0.184, green: 0.086, blue: 0.412, alpha: 1))
    public let purple950: Color = Color(uiColor: UIColor(red: 0.129, green: 0.059, blue: 0.282, alpha: 1))
    public let purple4: Color = Color(uiColor: UIColor(red: 0.576, green: 0.392, blue: 0.945, alpha: 0.039))
    public let purple8: Color = Color(uiColor: UIColor(red: 0.576, green: 0.392, blue: 0.945, alpha: 0.078))
    public let purple16: Color = Color(uiColor: UIColor(red: 0.576, green: 0.392, blue: 0.945, alpha: 0.161))
    public let purple24: Color = Color(uiColor: UIColor(red: 0.576, green: 0.392, blue: 0.945, alpha: 0.239))
    public let purple32: Color = Color(uiColor: UIColor(red: 0.576, green: 0.392, blue: 0.945, alpha: 0.322))
    public let purple40: Color = Color(uiColor: UIColor(red: 0.576, green: 0.392, blue: 0.945, alpha: 0.4))
    public let purple48: Color = Color(uiColor: UIColor(red: 0.576, green: 0.392, blue: 0.945, alpha: 0.478))
    public let pink100: Color = Color(uiColor: UIColor(red: 0.988, green: 0.914, blue: 0.961, alpha: 1))
    public let pink200: Color = Color(uiColor: UIColor(red: 0.976, green: 0.796, blue: 0.918, alpha: 1))
    public let pink300: Color = Color(uiColor: UIColor(red: 0.969, green: 0.659, blue: 0.875, alpha: 1))
    public let pink400: Color = Color(uiColor: UIColor(red: 0.957, green: 0.525, blue: 0.812, alpha: 1))
    public let pink500: Color = Color(uiColor: UIColor(red: 0.945, green: 0.392, blue: 0.741, alpha: 1))
    public let pink600: Color = Color(uiColor: UIColor(red: 0.871, green: 0.263, blue: 0.647, alpha: 1))
    public let pink700: Color = Color(uiColor: UIColor(red: 0.749, green: 0.161, blue: 0.533, alpha: 1))
    public let pink800: Color = Color(uiColor: UIColor(red: 0.58, green: 0.122, blue: 0.412, alpha: 1))
    public let pink900: Color = Color(uiColor: UIColor(red: 0.412, green: 0.086, blue: 0.29, alpha: 1))
    public let pink950: Color = Color(uiColor: UIColor(red: 0.282, green: 0.059, blue: 0.2, alpha: 1))
    public let pink4: Color = Color(uiColor: UIColor(red: 0.945, green: 0.392, blue: 0.741, alpha: 0.039))
    public let pink8: Color = Color(uiColor: UIColor(red: 0.945, green: 0.392, blue: 0.741, alpha: 0.078))
    public let pink16: Color = Color(uiColor: UIColor(red: 0.945, green: 0.392, blue: 0.741, alpha: 0.161))
    public let pink24: Color = Color(uiColor: UIColor(red: 0.945, green: 0.392, blue: 0.741, alpha: 0.239))
    public let pink32: Color = Color(uiColor: UIColor(red: 0.945, green: 0.392, blue: 0.741, alpha: 0.322))
    public let pink40: Color = Color(uiColor: UIColor(red: 0.945, green: 0.392, blue: 0.741, alpha: 0.4))
    public let pink48: Color = Color(uiColor: UIColor(red: 0.945, green: 0.392, blue: 0.741, alpha: 0.478))
    public let teal100: Color = Color(uiColor: UIColor(red: 0.922, green: 0.98, blue: 0.98, alpha: 1))
    public let teal200: Color = Color(uiColor: UIColor(red: 0.765, green: 0.937, blue: 0.937, alpha: 1))
    public let teal300: Color = Color(uiColor: UIColor(red: 0.588, green: 0.89, blue: 0.89, alpha: 1))
    public let teal400: Color = Color(uiColor: UIColor(red: 0.416, green: 0.843, blue: 0.843, alpha: 1))
    public let teal500: Color = Color(uiColor: UIColor(red: 0.2, green: 0.8, blue: 0.8, alpha: 1))
    public let teal600: Color = Color(uiColor: UIColor(red: 0.153, green: 0.667, blue: 0.667, alpha: 1))
    public let teal700: Color = Color(uiColor: UIColor(red: 0.086, green: 0.549, blue: 0.549, alpha: 1))
    public let teal800: Color = Color(uiColor: UIColor(red: 0.059, green: 0.431, blue: 0.431, alpha: 1))
    public let teal900: Color = Color(uiColor: UIColor(red: 0.039, green: 0.302, blue: 0.322, alpha: 1))
    public let teal950: Color = Color(uiColor: UIColor(red: 0.02, green: 0.2, blue: 0.212, alpha: 1))
    public let teal4: Color = Color(uiColor: UIColor(red: 0.2, green: 0.8, blue: 0.8, alpha: 0.039))
    public let teal8: Color = Color(uiColor: UIColor(red: 0.2, green: 0.8, blue: 0.8, alpha: 0.078))
    public let teal16: Color = Color(uiColor: UIColor(red: 0.2, green: 0.8, blue: 0.8, alpha: 0.161))
    public let teal24: Color = Color(uiColor: UIColor(red: 0.2, green: 0.8, blue: 0.8, alpha: 0.239))
    public let teal32: Color = Color(uiColor: UIColor(red: 0.2, green: 0.8, blue: 0.8, alpha: 0.322))
    public let teal40: Color = Color(uiColor: UIColor(red: 0.2, green: 0.8, blue: 0.8, alpha: 0.4))
    public let teal48: Color = Color(uiColor: UIColor(red: 0.2, green: 0.8, blue: 0.8, alpha: 0.478))
    public let alphaWhite4: Color = Color(uiColor: UIColor(red: 1, green: 1, blue: 1, alpha: 0.039))
    public let alphaWhite8: Color = Color(uiColor: UIColor(red: 1, green: 1, blue: 1, alpha: 0.078))
    public let alphaWhite12: Color = Color(uiColor: UIColor(red: 1, green: 1, blue: 1, alpha: 0.122))
    public let alphaWhite16: Color = Color(uiColor: UIColor(red: 1, green: 1, blue: 1, alpha: 0.161))
    public let alphaWhite24: Color = Color(uiColor: UIColor(red: 1, green: 1, blue: 1, alpha: 0.239))
    public let alphaWhite32: Color = Color(uiColor: UIColor(red: 1, green: 1, blue: 1, alpha: 0.322))
    public let alphaWhite48: Color = Color(uiColor: UIColor(red: 1, green: 1, blue: 1, alpha: 0.478))
    public let alphaWhite64: Color = Color(uiColor: UIColor(red: 1, green: 1, blue: 1, alpha: 0.639))
    public let alphaWhite80: Color = Color(uiColor: UIColor(red: 1, green: 1, blue: 1, alpha: 0.8))
    public let alphaWhite96: Color = Color(uiColor: UIColor(red: 1, green: 1, blue: 1, alpha: 0.961))
    public let alphaWhite100: Color = Color(uiColor: UIColor(red: 1, green: 1, blue: 1, alpha: 1))
    public let alphaBlack4: Color = Color(uiColor: UIColor(red: 0, green: 0, blue: 0, alpha: 0.039))
    public let alphaBlack8: Color = Color(uiColor: UIColor(red: 0, green: 0, blue: 0, alpha: 0.078))
    public let alphaBlack12: Color = Color(uiColor: UIColor(red: 0, green: 0, blue: 0, alpha: 0.122))
    public let alphaBlack16: Color = Color(uiColor: UIColor(red: 0, green: 0, blue: 0, alpha: 0.161))
    public let alphaBlack24: Color = Color(uiColor: UIColor(red: 0, green: 0, blue: 0, alpha: 0.239))
    public let alphaBlack32: Color = Color(uiColor: UIColor(red: 0, green: 0, blue: 0, alpha: 0.322))
    public let alphaBlack48: Color = Color(uiColor: UIColor(red: 0, green: 0, blue: 0, alpha: 0.478))
    public let alphaBlack64: Color = Color(uiColor: UIColor(red: 0, green: 0, blue: 0, alpha: 0.639))
    public let alphaBlack80: Color = Color(uiColor: UIColor(red: 0, green: 0, blue: 0, alpha: 0.8))
    public let alphaBlack96: Color = Color(uiColor: UIColor(red: 0, green: 0, blue: 0, alpha: 0.961))
    public let alphaBlack100: Color = Color(uiColor: UIColor(red: 0, green: 0, blue: 0, alpha: 1))
}
