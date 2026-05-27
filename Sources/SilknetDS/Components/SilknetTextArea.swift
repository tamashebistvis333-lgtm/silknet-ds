// SilknetTextArea — multi-line variant of SilknetInput. Mirrors React TextArea.
// Min height 104, padding 14 horizontal 16, same floating-label pattern. Uses
// TextEditor for multi-line input + ZStack to overlay the floating label.

import SwiftUI

public struct SilknetTextArea: View {
    private let label: String
    @Binding private var text: String
    private let helperText: String?
    private let error: String?

    @FocusState private var isFocused: Bool
    @Environment(\.isEnabled) private var isEnabled

    public init(
        label: String,
        text: Binding<String>,
        helperText: String? = nil,
        error: String? = nil
    ) {
        self.label = label
        self._text = text
        self.helperText = helperText
        self.error = error
    }

    public var body: some View {
        let isError = error != nil
        let helper = error ?? helperText
        let helperState: SilknetHelperTextState = isError ? .error : .default

        return VStack(alignment: .leading, spacing: .silknet.digitsSpacing2) {
            VStack(alignment: .leading, spacing: .silknet.digitsSpacing1) {
                Text(label)
                    .font(isFloated ? .silknet.subtitleSubtitle3 : .silknet.bodyBodyAccent)
                    .foregroundColor(.silknet.textAdditional)
                    .animation(.easeOut(duration: 0.15), value: isFloated)

                // TextEditor with its native background hidden, so the parent
                // container's background shows through.
                TextEditor(text: $text)
                    .font(.silknet.bodyBodyDefault)
                    .foregroundColor(.silknet.textDefault)
                    .tint(.silknet.backgroundPrimaryAccent)
                    .focused($isFocused)
                    .scrollContentBackground(.hidden)
                    .background(Color.clear)
                    .frame(minHeight: 60)
                    .opacity(isFloated ? 1 : 0)
            }
            .padding(.horizontal, .silknet.digitsSpacing4)
            .padding(.vertical, 14)
            .frame(maxWidth: .infinity, minHeight: 104, alignment: .topLeading)
            .background(backgroundColor)
            .overlay(
                RoundedRectangle(cornerRadius: .silknet.digitsRadiusS, style: .continuous)
                    .stroke(borderColor, lineWidth: 1)
            )
            .overlay(
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

#if DEBUG
private struct TextAreaPreview: View {
    @State var text: String = ""
    var label: String
    var helperText: String? = nil
    var error: String? = nil
    var body: some View {
        SilknetTextArea(label: label, text: $text, helperText: helperText, error: error)
    }
}

#Preview("All states") {
    VStack(spacing: 16) {
        TextAreaPreview(label: "Comments")
        TextAreaPreview(text: "Hello\nMulti-line\nContent", label: "Filled")
        TextAreaPreview(label: "Error", error: "Description is required")
        TextAreaPreview(label: "Disabled")
            .disabled(true)
    }
    .padding(24)
    .background(Color.silknet.backgroundLayer)
}
#endif
