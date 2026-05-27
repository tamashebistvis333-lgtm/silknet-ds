// SilknetIconButton — square Button with a single icon, no text.
// Verified against Figma node 2052:3517. Reuses the SilknetButton color
// system but with uniform padding and icon-only content.
//
//     SilknetIconButton(label: "Add", variant: .primary) {
//         Image(systemName: "plus")
//     } action: { /* onTap */ }

import SwiftUI

public enum SilknetIconButtonVariant: Sendable {
    case primary
    case primarySoft
    case secondary
    case ghost
}

public struct SilknetIconButton<Icon: View>: View {
    private let label: String
    private let variant: SilknetIconButtonVariant
    private let size: SilknetButtonSize
    private let icon: () -> Icon
    private let action: () -> Void

    public init(
        label: String,
        variant: SilknetIconButtonVariant = .primary,
        size: SilknetButtonSize = .md,
        @ViewBuilder icon: @escaping () -> Icon,
        action: @escaping () -> Void = {}
    ) {
        self.label = label
        self.variant = variant
        self.size = size
        self.icon = icon
        self.action = action
    }

    public var body: some View {
        Button(action: action) {
            icon()
                .frame(width: iconSize, height: iconSize)
        }
        .buttonStyle(SilknetIconButtonStyle(variant: variant, size: size))
        .accessibilityLabel(label)
    }

    private var iconSize: CGFloat {
        switch size {
        case .xs, .sm: return 16
        case .md, .lg: return 20
        }
    }
}

private struct SilknetIconButtonStyle: ButtonStyle {
    let variant: SilknetIconButtonVariant
    let size: SilknetButtonSize

    @Environment(\.isEnabled) private var isEnabled

    func makeBody(configuration: Configuration) -> some View {
        let pressed = configuration.isPressed
        let shape = RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)

        return configuration.label
            .padding(uniformPadding)
            .foregroundColor(foregroundColor)
            .background(
                ZStack {
                    backgroundColor.clipShape(shape)
                    if pressed && isEnabled {
                        Color.black.opacity(0.16).clipShape(shape)
                    }
                }
            )
            .overlay(borderOverlay(shape: shape))
            .contentShape(shape)
    }

    private var uniformPadding: CGFloat {
        // Per Figma: icon sits centered with padding = (size − icon) / 2.
        // xs(24): icon 16, pad 4. sm(32): icon 16, pad 8. md(44): icon 20, pad 12. lg(52): icon 20, pad 16.
        switch size {
        case .xs: return .silknet.digitsSpacing1
        case .sm: return .silknet.digitsSpacing2
        case .md: return .silknet.digitsSpacing3
        case .lg: return .silknet.digitsSpacing4
        }
    }

    private var cornerRadius: CGFloat {
        switch size {
        case .xs, .sm: return .silknet.digitsRadiusXs
        case .md, .lg: return .silknet.digitsRadiusS
        }
    }

    private var backgroundColor: Color {
        if !isEnabled {
            switch variant {
            case .secondary, .ghost: return .clear
            case .primary, .primarySoft: return .silknet.backgroundDisabled
            }
        }
        switch variant {
        case .primary:     return .silknet.backgroundPrimaryAccent
        case .primarySoft: return .silknet.backgroundPrimarySoft
        case .secondary:   return .silknet.backgroundLayer
        case .ghost:       return .clear
        }
    }

    private var foregroundColor: Color {
        if !isEnabled {
            switch variant {
            case .primary, .primarySoft: return .silknet.textContrast
            case .secondary, .ghost:     return .silknet.textDisabled
            }
        }
        switch variant {
        case .primary:           return .silknet.textContrast
        case .primarySoft:       return .silknet.textPrimary
        case .secondary, .ghost: return .silknet.textSecondary
        }
    }

    @ViewBuilder
    private func borderOverlay(shape: RoundedRectangle) -> some View {
        if !isEnabled, variant == .secondary {
            shape.strokeBorder(Color.silknet.backgroundDisabled, lineWidth: 1)
        } else if isEnabled, variant == .secondary {
            shape.strokeBorder(Color.silknet.borderDefault, lineWidth: 1)
        }
    }
}

#if DEBUG
#Preview("All variants — md") {
    HStack(spacing: 16) {
        SilknetIconButton(label: "Add", variant: .primary)     { Image(systemName: "plus") }
        SilknetIconButton(label: "Add", variant: .primarySoft) { Image(systemName: "plus") }
        SilknetIconButton(label: "Add", variant: .secondary)   { Image(systemName: "plus") }
        SilknetIconButton(label: "Add", variant: .ghost)       { Image(systemName: "plus") }
    }
    .padding(24)
    .background(Color.silknet.backgroundLayer)
}

#Preview("Sizes — primary") {
    HStack(spacing: 16) {
        SilknetIconButton(label: "xs", size: .xs) { Image(systemName: "plus") }
        SilknetIconButton(label: "sm", size: .sm) { Image(systemName: "plus") }
        SilknetIconButton(label: "md", size: .md) { Image(systemName: "plus") }
        SilknetIconButton(label: "lg", size: .lg) { Image(systemName: "plus") }
    }
    .padding(24)
    .background(Color.silknet.backgroundLayer)
}

#Preview("Disabled") {
    HStack(spacing: 16) {
        SilknetIconButton(label: "Add", variant: .primary)     { Image(systemName: "plus") }.disabled(true)
        SilknetIconButton(label: "Add", variant: .primarySoft) { Image(systemName: "plus") }.disabled(true)
        SilknetIconButton(label: "Add", variant: .secondary)   { Image(systemName: "plus") }.disabled(true)
        SilknetIconButton(label: "Add", variant: .ghost)       { Image(systemName: "plus") }.disabled(true)
    }
    .padding(24)
    .background(Color.silknet.backgroundLayer)
}
#endif
