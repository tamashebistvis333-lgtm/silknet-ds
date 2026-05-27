// SilknetRadioButton — verified against Figma node 4067:5347 + its SVG asset.
// Selected = fully-filled primary circle + 8pt WHITE center punch (NOT a ring
// with a colored dot — that was the original misread; the Figma SVG is
// `<rect rx=9 fill=primary/><circle r=4 fill=white/>`).

import SwiftUI

public struct SilknetRadioButton: View {
    private let isSelected: Bool
    private let isError: Bool
    private let action: () -> Void

    public init(
        isSelected: Bool,
        isError: Bool = false,
        action: @escaping () -> Void = {}
    ) {
        self.isSelected = isSelected
        self.isError = isError
        self.action = action
    }

    public var body: some View {
        Button(action: action) {
            EmptyView()
        }
        .buttonStyle(RadioStyle(isSelected: isSelected, isError: isError))
        .accessibilityElement()
        .accessibilityAddTraits(isSelected ? [.isSelected, .isButton] : .isButton)
    }
}

private struct RadioStyle: ButtonStyle {
    let isSelected: Bool
    let isError: Bool

    @Environment(\.isEnabled) private var isEnabled

    func makeBody(configuration: Configuration) -> some View {
        return ZStack {
            // Outer circle (the "box" / ring).
            Circle().fill(boxFill)
            if !isSelected {
                Circle().strokeBorder(boxBorder, lineWidth: 1)
            }
            // Inner white center punch — present only when selected.
            if isSelected {
                Circle()
                    .fill(Color.white)
                    .frame(width: 8, height: 8)
            }
        }
        .frame(width: 18, height: 18)
        .padding(1) // hit target 20×20
        .contentShape(Circle())
    }

    private var boxFill: Color {
        if !isSelected {
            if isError { return .silknet.backgroundSurface }
            if !isEnabled { return .silknet.backgroundDisabled }
            return .silknet.backgroundLayer
        }
        // Selected
        return isEnabled ? .silknet.backgroundPrimaryAccent : .silknet.backgroundDisabled
    }

    private var boxBorder: Color {
        if isError { return .silknet.backgroundErrorAccent }
        return .silknet.borderDefault
    }
}

#if DEBUG
#Preview("All states") {
    VStack(alignment: .leading, spacing: 16) {
        HStack { Text("Unselected").frame(width: 200, alignment: .leading); SilknetRadioButton(isSelected: false) }
        HStack { Text("Selected").frame(width: 200, alignment: .leading); SilknetRadioButton(isSelected: true) }
        HStack { Text("Error (unselected)").frame(width: 200, alignment: .leading); SilknetRadioButton(isSelected: false, isError: true) }
        HStack { Text("Disabled (unselected)").frame(width: 200, alignment: .leading); SilknetRadioButton(isSelected: false).disabled(true) }
        HStack { Text("Disabled (selected)").frame(width: 200, alignment: .leading); SilknetRadioButton(isSelected: true).disabled(true) }
    }
    .padding(24)
    .background(Color.silknet.backgroundLayer)
    .font(.silknet.bodyBodyDefault)
    .foregroundColor(.silknet.textDefault)
}
#endif
