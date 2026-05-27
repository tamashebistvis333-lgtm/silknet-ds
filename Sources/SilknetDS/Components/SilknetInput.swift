// SilknetInput — floating-label text field. Mirrors React Input 1:1.
// Height 52, padding 8 horizontal 16, radius-s (12), border-subtle border.
// Focus = primary border + 4pt primary-16 glow. Error = pink bg + red border;
// when also focused, gets red border + red-16 glow. Disabled = 0.5 alpha.
//
//     @State var name = ""
//     SilknetInput(label: "Name", text: $name)
//     SilknetInput(label: "Email", text: $email, error: "Invalid email")

import SwiftUI

public struct SilknetInput<LeftIcon: View, RightIcon: View>: View {
    private let label: String
    @Binding private var text: String
    private let helperText: String?
    private let error: String?
    private let leftIcon: () -> LeftIcon
    private let rightIcon: () -> RightIcon

    @FocusState private var isFocused: Bool
    @Environment(\.isEnabled) private var isEnabled

    public init(
        label: String,
        text: Binding<String>,
        helperText: String? = nil,
        error: String? = nil,
        @ViewBuilder leftIcon: @escaping () -> LeftIcon,
        @ViewBuilder rightIcon: @escaping () -> RightIcon
    ) {
        self.label = label
        self._text = text
        self.helperText = helperText
        self.error = error
        self.leftIcon = leftIcon
        self.rightIcon = rightIcon
    }

    public var body: some View {
        let isError = error != nil
        let helper = error ?? helperText
        let helperState: SilknetHelperTextState = isError ? .error : .default

        return VStack(alignment: .leading, spacing: .silknet.digitsSpacing2) {
            HStack(spacing: .silknet.digitsSpacing3) {
                leftIcon()
                    .frame(width: 20, height: 20)
                    .foregroundColor(.silknet.textAdditional)

                ZStack(alignment: .leading) {
                    // Floating label.
                    Text(label)
                        .font(isFloated ? .silknet.subtitleSubtitle3 : .silknet.bodyBodyAccent)
                        .foregroundColor(.silknet.textAdditional)
                        .offset(y: isFloated ? -10 : 0)
                        .animation(.easeOut(duration: 0.15), value: isFloated)

                    // Field.
                    TextField("", text: $text)
                        .font(.silknet.bodyBodyDefault)
                        .foregroundColor(.silknet.textDefault)
                        .tint(.silknet.backgroundPrimaryAccent)
                        .focused($isFocused)
                        .offset(y: isFloated ? 8 : 0)
                        .opacity(isFloated ? 1 : 0)
                        .allowsHitTesting(true)
                }
                .frame(height: 36)
                .frame(maxWidth: .infinity, alignment: .leading)

                rightIcon()
                    .frame(width: 20, height: 20)
                    .foregroundColor(.silknet.textAdditional)
            }
            .padding(.horizontal, .silknet.digitsSpacing4)
            .padding(.vertical, .silknet.digitsSpacing2)
            .frame(height: 52)
            .background(backgroundColor)
            .overlay(
                RoundedRectangle(cornerRadius: .silknet.digitsRadiusS, style: .continuous)
                    .stroke(borderColor, lineWidth: 1)
            )
            .overlay(
                // Focus / error glow ring (4pt outside).
                RoundedRectangle(cornerRadius: .silknet.digitsRadiusS, style: .continuous)
                    .stroke(glowColor, lineWidth: 4)
                    .opacity(isFocused ? 1 : 0)
            )
            .clipShape(RoundedRectangle(cornerRadius: .silknet.digitsRadiusS, style: .continuous))
            .contentShape(Rectangle())
            .onTapGesture { isFocused = true }

            if let helper {
                SilknetHelperText(helper, state: helperState)
            }
        }
        .opacity(isEnabled ? 1 : 0.5)
    }

    private var isFloated: Bool { isFocused || !text.isEmpty }

    private var backgroundColor: Color {
        if error != nil && !isFocused { return .silknet.backgroundError }
        if isFocused { return .silknet.backgroundLayer }
        return .silknet.backgroundInputDefault
    }

    private var borderColor: Color {
        if error != nil {
            return isFocused ? .silknet.backgroundErrorAccent : .silknet.borderError
        }
        return isFocused ? .silknet.backgroundPrimaryAccent : .silknet.borderSubtle
    }

    private var glowColor: Color {
        error != nil ? .silknet.red16 : .silknet.primary16
    }
}

// MARK: - Convenience initializers (drop one or both icons).

public extension SilknetInput where LeftIcon == EmptyView, RightIcon == EmptyView {
    init(
        label: String,
        text: Binding<String>,
        helperText: String? = nil,
        error: String? = nil
    ) {
        self.init(
            label: label, text: text, helperText: helperText, error: error,
            leftIcon: { EmptyView() }, rightIcon: { EmptyView() }
        )
    }
}

public extension SilknetInput where RightIcon == EmptyView {
    init(
        label: String,
        text: Binding<String>,
        helperText: String? = nil,
        error: String? = nil,
        @ViewBuilder leftIcon: @escaping () -> LeftIcon
    ) {
        self.init(
            label: label, text: text, helperText: helperText, error: error,
            leftIcon: leftIcon, rightIcon: { EmptyView() }
        )
    }
}

public extension SilknetInput where LeftIcon == EmptyView {
    init(
        label: String,
        text: Binding<String>,
        helperText: String? = nil,
        error: String? = nil,
        @ViewBuilder rightIcon: @escaping () -> RightIcon
    ) {
        self.init(
            label: label, text: text, helperText: helperText, error: error,
            leftIcon: { EmptyView() }, rightIcon: rightIcon
        )
    }
}

#if DEBUG
private struct InputPreview: View {
    @State var text: String = ""
    var label: String
    var helperText: String? = nil
    var error: String? = nil
    var leftIconName: String? = nil
    var rightIconName: String? = nil

    var body: some View {
        if let left = leftIconName, let right = rightIconName {
            SilknetInput(
                label: label, text: $text, helperText: helperText, error: error,
                leftIcon: { Image(systemName: left) },
                rightIcon: { Image(systemName: right) }
            )
        } else if let left = leftIconName {
            SilknetInput(label: label, text: $text, helperText: helperText, error: error,
                         leftIcon: { Image(systemName: left) })
        } else if let right = rightIconName {
            SilknetInput(label: label, text: $text, helperText: helperText, error: error,
                         rightIcon: { Image(systemName: right) })
        } else {
            SilknetInput(label: label, text: $text, helperText: helperText, error: error)
        }
    }
}

#Preview("Default + filled") {
    VStack(spacing: 16) {
        InputPreview(label: "Empty field")
        InputPreview(text: "Sandro", label: "Filled field")
        InputPreview(text: "Sandro", label: "With helper", helperText: "Use your full name")
    }
    .padding(24)
    .background(Color.silknet.backgroundLayer)
}

#Preview("Error states") {
    VStack(spacing: 16) {
        InputPreview(label: "Empty error", error: "Required field")
        InputPreview(text: "bad@", label: "Filled error", error: "Invalid email")
    }
    .padding(24)
    .background(Color.silknet.backgroundLayer)
}

#Preview("Icons + disabled") {
    VStack(spacing: 16) {
        InputPreview(label: "Search", leftIconName: "magnifyingglass")
        InputPreview(text: "+995", label: "Phone", leftIconName: "phone.fill", rightIconName: "xmark.circle.fill")
        InputPreview(label: "Disabled field")
            .disabled(true)
    }
    .padding(24)
    .background(Color.silknet.backgroundLayer)
}
#endif
