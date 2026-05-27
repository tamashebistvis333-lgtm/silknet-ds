// SilknetToggle — pill switch. Verified against Figma node 2052:3503.
// Track 36×20, 16×16 white handle, 16pt travel between off↔on positions.
// OFF bg: --background-toggle-default. ON bg: --background-success-accent
// (Figma uses success green for ON). Error: 1px red border. Disabled:
// opacity 0.5.

import SwiftUI

public struct SilknetToggle: View {
    @Binding private var isOn: Bool
    private let isError: Bool

    public init(isOn: Binding<Bool>, isError: Bool = false) {
        self._isOn = isOn
        self.isError = isError
    }

    public var body: some View {
        Button {
            isOn.toggle()
        } label: {
            EmptyView()
        }
        .buttonStyle(ToggleButtonStyle(isOn: isOn, isError: isError))
        .accessibilityElement()
        .accessibilityAddTraits(.isButton)
        .accessibilityValue(isOn ? "on" : "off")
    }
}

private struct ToggleButtonStyle: ButtonStyle {
    let isOn: Bool
    let isError: Bool

    @Environment(\.isEnabled) private var isEnabled

    func makeBody(configuration: Configuration) -> some View {
        let trackShape = Capsule()
        return ZStack(alignment: isOn ? .trailing : .leading) {
            trackShape
                .fill(isOn ? Color.silknet.backgroundSuccessAccent : Color.silknet.backgroundToggleDefault)
            // Inner shadow approximation (Figma "inset 0 0 2 alpha-black-4").
            // SwiftUI has no real inset shadow; use a thin stroke at 4% black.
            trackShape
                .strokeBorder(Color.black.opacity(0.04), lineWidth: 1)
            // White handle.
            Circle()
                .fill(Color.white)
                .frame(width: 16, height: 16)
                .shadow(color: Color.black.opacity(0.12), radius: 1.5, x: 0, y: 1)
                .padding(2)
        }
        .frame(width: 36, height: 20)
        .overlay(
            isError
                ? trackShape.strokeBorder(Color.silknet.backgroundErrorAccent, lineWidth: 1)
                : nil
        )
        .opacity(isEnabled ? 1 : 0.5)
        .contentShape(trackShape)
        .animation(.easeInOut(duration: 0.15), value: isOn)
    }
}

#if DEBUG
private struct TogglePreview: View {
    @State var isOn: Bool
    var isError: Bool = false
    var disabled: Bool = false
    var body: some View {
        SilknetToggle(isOn: $isOn, isError: isError)
            .disabled(disabled)
    }
}

#Preview("All states") {
    VStack(alignment: .leading, spacing: 16) {
        HStack { Text("Off").frame(width: 120, alignment: .leading); TogglePreview(isOn: false) }
        HStack { Text("On").frame(width: 120, alignment: .leading); TogglePreview(isOn: true) }
        HStack { Text("Error (off)").frame(width: 120, alignment: .leading); TogglePreview(isOn: false, isError: true) }
        HStack { Text("Disabled off").frame(width: 120, alignment: .leading); TogglePreview(isOn: false, disabled: true) }
        HStack { Text("Disabled on").frame(width: 120, alignment: .leading); TogglePreview(isOn: true, disabled: true) }
    }
    .padding(24)
    .background(Color.silknet.backgroundLayer)
    .font(.silknet.bodyBodyDefault)
    .foregroundColor(.silknet.textDefault)
}
#endif
