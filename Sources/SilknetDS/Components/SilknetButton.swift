// SilknetButton — SwiftUI port of @silknet-ds/react's Button.
// Verified against Figma node 4104:5038 (Button frame) and the React
// implementation in packages/react/src/Button/Button.css.
//
// API:
//
//     SilknetButton("Save") { /* onTap */ }
//     SilknetButton("Cancel", variant: .secondary)
//     SilknetButton("Add", variant: .primary, size: .lg, leftIcon: AnyView(Image(systemName: "plus")))
//     SilknetButton("Read more", variant: .link, size: .xs)
//
// Use the standard `.disabled(true)` modifier to disable.

import SwiftUI

public enum SilknetButtonVariant: Sendable {
    case primary
    case primarySoft
    case secondary
    case ghost
    case link
}

public enum SilknetButtonSize: Sendable {
    case xs
    case sm
    case md
    case lg
}

public struct SilknetButton: View {
    private let title: String
    private let variant: SilknetButtonVariant
    private let size: SilknetButtonSize
    private let leftIcon: AnyView?
    private let rightIcon: AnyView?
    private let action: () -> Void

    public init(
        _ title: String,
        variant: SilknetButtonVariant = .primary,
        size: SilknetButtonSize = .md,
        leftIcon: AnyView? = nil,
        rightIcon: AnyView? = nil,
        action: @escaping () -> Void = {}
    ) {
        self.title = title
        self.variant = variant
        self.size = size
        self.leftIcon = leftIcon
        self.rightIcon = rightIcon
        self.action = action
    }

    public var body: some View {
        Button(action: action) {
            HStack(spacing: gap) {
                if let leftIcon { leftIcon.frame(width: iconSize, height: iconSize) }
                Text(title)
                    .font(font)
                    .tracking(0.2)
                if let rightIcon { rightIcon.frame(width: iconSize, height: iconSize) }
            }
        }
        .buttonStyle(SilknetButtonStyle(variant: variant, size: size))
    }

    // MARK: - Size-derived layout values

    private var gap: CGFloat {
        switch size {
        case .xs, .sm: return .silknet.digitsSpacing2 // 8
        case .md, .lg: return .silknet.digitsSpacing3 // 12
        }
    }

    private var iconSize: CGFloat {
        switch size {
        case .xs, .sm: return 16
        case .md, .lg: return 20
        }
    }

    private var font: Font {
        switch size {
        case .xs, .sm: return .silknet.buttonButtonAdditional
        case .md, .lg: return .silknet.buttonButtonDefault
        }
    }
}

// MARK: - ButtonStyle (handles bg, border, padding, pressed overlay, disabled)

private struct SilknetButtonStyle: ButtonStyle {
    let variant: SilknetButtonVariant
    let size: SilknetButtonSize

    @Environment(\.isEnabled) private var isEnabled

    func makeBody(configuration: Configuration) -> some View {
        let pressed = configuration.isPressed
        let shape = RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)

        return configuration.label
            .padding(.horizontal, horizontalPadding)
            .padding(.vertical, verticalPadding)
            .foregroundColor(foregroundColor(pressed: pressed))
            .background(
                ZStack {
                    backgroundColor.clipShape(shape)
                    // Alpha-black overlay mirrors React's hover/pressed gradient
                    // (8% on hover, 16% on press). iOS has no hover — show only
                    // the pressed overlay. Link variant has no background to
                    // overlay; its color shifts via foregroundColor() above.
                    if pressed && isEnabled && variant != .link {
                        Color.black.opacity(0.16).clipShape(shape)
                    }
                }
            )
            .overlay(borderOverlay(shape: shape))
            .modifier(LinkUnderline(active: variant == .link && pressed && isEnabled))
            .contentShape(shape)
            .opacity(isEnabled ? 1 : 1) // disabled colors are explicit; keep opacity 1
    }

    // MARK: - Size

    private var horizontalPadding: CGFloat {
        if variant == .link { return 0 }
        switch size {
        case .xs: return .silknet.digitsSpacing2 // 8
        case .sm: return .silknet.digitsSpacing3 // 12
        case .md: return .silknet.digitsSpacing4 // 16
        case .lg: return .silknet.digitsSpacing5 // 20
        }
    }

    private var verticalPadding: CGFloat {
        if variant == .link { return 0 }
        switch size {
        case .xs: return .silknet.digitsSpacing1 // 4
        case .sm: return .silknet.digitsSpacing2 // 8
        case .md: return .silknet.digitsSpacing3 // 12
        case .lg: return .silknet.digitsSpacing4 // 16
        }
    }

    private var cornerRadius: CGFloat {
        switch size {
        case .xs, .sm: return .silknet.digitsRadiusXs // 8
        case .md, .lg: return .silknet.digitsRadiusS  // 12
        }
    }

    // MARK: - Colors

    private var backgroundColor: Color {
        // Disabled — variant-specific; matches React .silk-button:disabled rules.
        if !isEnabled {
            switch variant {
            case .secondary, .ghost, .link: return .clear
            case .primary, .primarySoft:    return .silknet.backgroundDisabled
            }
        }
        switch variant {
        case .primary:     return .silknet.backgroundPrimaryAccent
        case .primarySoft: return .silknet.backgroundPrimarySoft
        case .secondary:   return .silknet.backgroundLayer
        case .ghost, .link: return .clear
        }
    }

    private func foregroundColor(pressed: Bool) -> Color {
        // Disabled
        if !isEnabled {
            switch variant {
            case .primary, .primarySoft: return .silknet.textContrast  // white on grey — intentional ghost-out
            case .secondary, .ghost, .link: return .silknet.textDisabled
            }
        }
        // Enabled
        switch variant {
        case .primary: return .silknet.textContrast
        case .primarySoft: return .silknet.textPrimary
        case .secondary, .ghost: return .silknet.textSecondary
        case .link:
            // color-mix(primary, 8%/16% black) — approximated via opacity.
            // 1 → primary, 0.92 → hover-ish, 0.84 → pressed-ish.
            if pressed {
                return Color.silknet.backgroundPrimaryAccent.opacity(0.84)
            }
            return .silknet.backgroundPrimaryAccent
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

// Link variant: underline only when pressed (matches React's text-decoration
// rule). Pulled into its own ViewModifier so we can toggle without restructuring.
private struct LinkUnderline: ViewModifier {
    let active: Bool
    func body(content: Content) -> some View {
        if active {
            content.underline()
        } else {
            content
        }
    }
}

// MARK: - Xcode Previews

#if DEBUG
private struct PreviewSwatch<Content: View>: View {
    let label: String
    @ViewBuilder var content: Content
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(label)
                .font(.caption.monospaced())
                .foregroundColor(.secondary)
            content
        }
    }
}

#Preview("All variants — md") {
    VStack(alignment: .leading, spacing: 16) {
        PreviewSwatch(label: "primary")     { SilknetButton("Button", variant: .primary) }
        PreviewSwatch(label: "primary-soft"){ SilknetButton("Button", variant: .primarySoft) }
        PreviewSwatch(label: "secondary")   { SilknetButton("Button", variant: .secondary) }
        PreviewSwatch(label: "ghost")       { SilknetButton("Button", variant: .ghost) }
        PreviewSwatch(label: "link (xs)")   { SilknetButton("Button", variant: .link, size: .xs) }
    }
    .padding(24)
    .background(Color.silknet.backgroundLayer)
}

#Preview("Sizes — primary") {
    VStack(alignment: .leading, spacing: 16) {
        PreviewSwatch(label: "xs") { SilknetButton("Button", size: .xs) }
        PreviewSwatch(label: "sm") { SilknetButton("Button", size: .sm) }
        PreviewSwatch(label: "md") { SilknetButton("Button", size: .md) }
        PreviewSwatch(label: "lg") { SilknetButton("Button", size: .lg) }
    }
    .padding(24)
    .background(Color.silknet.backgroundLayer)
}

#Preview("Disabled") {
    VStack(alignment: .leading, spacing: 16) {
        PreviewSwatch(label: "primary disabled")     { SilknetButton("Button", variant: .primary).disabled(true) }
        PreviewSwatch(label: "primary-soft disabled"){ SilknetButton("Button", variant: .primarySoft).disabled(true) }
        PreviewSwatch(label: "secondary disabled")   { SilknetButton("Button", variant: .secondary).disabled(true) }
        PreviewSwatch(label: "ghost disabled")       { SilknetButton("Button", variant: .ghost).disabled(true) }
        PreviewSwatch(label: "link disabled")        { SilknetButton("Button", variant: .link, size: .xs).disabled(true) }
    }
    .padding(24)
    .background(Color.silknet.backgroundLayer)
}

#Preview("Dark mode — all variants") {
    VStack(alignment: .leading, spacing: 16) {
        SilknetButton("Button", variant: .primary)
        SilknetButton("Button", variant: .primarySoft)
        SilknetButton("Button", variant: .secondary)
        SilknetButton("Button", variant: .ghost)
        SilknetButton("Button", variant: .link, size: .xs)
    }
    .padding(24)
    .background(Color.silknet.backgroundLayer)
    .preferredColorScheme(.dark)
}
#endif
