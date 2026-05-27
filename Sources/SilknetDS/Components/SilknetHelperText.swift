// SilknetHelperText — small caption shown standalone or by Input/TextArea.
// Default state = plain text only. Semantic states (success/info/warning/
// error) prepend a 16pt SF Symbol and switch to the matching text color.
// Mirrors React HelperText 1:1 (including the Figma-source typo:
// `--text-warrning` → `Color.silknet.textWarrning`).

import SwiftUI

public enum SilknetHelperTextState: Sendable {
    case `default`
    case success
    case info
    case warning
    case error
}

public struct SilknetHelperText: View {
    private let text: String
    private let state: SilknetHelperTextState

    public init(_ text: String, state: SilknetHelperTextState = .default) {
        self.text = text
        self.state = state
    }

    public var body: some View {
        HStack(spacing: .silknet.digitsSpacing2) {
            if let symbol = iconName {
                Image(systemName: symbol)
                    .resizable()
                    .scaledToFit()
                    .frame(width: 16, height: 16)
                    .foregroundColor(textColor)
            }
            Text(text)
                .font(.silknet.otherCaption)
                .foregroundColor(textColor)
                .kerning(0.25)
        }
    }

    private var iconName: String? {
        switch state {
        case .default: return nil
        case .success: return "checkmark.circle.fill"
        case .info:    return "info.circle.fill"
        case .warning: return "exclamationmark.triangle.fill"
        case .error:   return "xmark.octagon.fill"
        }
    }

    private var textColor: Color {
        switch state {
        case .default: return .silknet.textAdditional
        case .success: return .silknet.textSuccess
        case .info:    return .silknet.textInfo
        case .warning: return .silknet.textWarrning // Figma source spelling.
        case .error:   return .silknet.textError
        }
    }
}

#if DEBUG
#Preview("All states") {
    VStack(alignment: .leading, spacing: 12) {
        SilknetHelperText("Default helper text")
        SilknetHelperText("Looking good", state: .success)
        SilknetHelperText("Just so you know", state: .info)
        SilknetHelperText("Heads up", state: .warning)
        SilknetHelperText("Something went wrong", state: .error)
    }
    .padding(24)
    .background(Color.silknet.backgroundLayer)
}
#endif
