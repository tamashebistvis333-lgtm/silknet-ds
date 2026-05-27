// SilknetCheckbox — verified against Figma node 4065:5125.
// 20×20 hit / 18×18 visible box, radius-xxs (4pt).
// Checked & indeterminate: primary-accent fill + white indicator.
// Error: surface bg + red border. Disabled+checked: disabled grey fill.

import SwiftUI

public struct SilknetCheckbox: View {
    @Binding private var isChecked: Bool
    private let indeterminate: Bool
    private let isError: Bool

    public init(
        isChecked: Binding<Bool>,
        indeterminate: Bool = false,
        isError: Bool = false
    ) {
        self._isChecked = isChecked
        self.indeterminate = indeterminate
        self.isError = isError
    }

    public var body: some View {
        Button {
            isChecked.toggle()
        } label: {
            EmptyView()
        }
        .buttonStyle(CheckboxStyle(isChecked: isChecked, indeterminate: indeterminate, isError: isError))
        .accessibilityElement()
        .accessibilityAddTraits(isChecked || indeterminate ? .isSelected : [])
        .accessibilityValue(indeterminate ? "mixed" : (isChecked ? "checked" : "unchecked"))
    }
}

private struct CheckboxStyle: ButtonStyle {
    let isChecked: Bool
    let indeterminate: Bool
    let isError: Bool

    @Environment(\.isEnabled) private var isEnabled

    func makeBody(configuration: Configuration) -> some View {
        let shape = RoundedRectangle(cornerRadius: .silknet.digitsRadiusXxs, style: .continuous)
        let filled = isChecked || indeterminate

        return ZStack {
            shape.fill(boxFill(filled: filled))
            if !filled {
                shape.strokeBorder(boxBorder, lineWidth: 1)
            }
            // Indicator
            if indeterminate {
                Capsule()
                    .fill(Color.silknet.textContrast)
                    .frame(width: 10, height: 2)
            } else if isChecked {
                CheckmarkShape()
                    .stroke(Color.silknet.textContrast, style: StrokeStyle(lineWidth: 2.5, lineCap: .round, lineJoin: .round))
                    .frame(width: 12, height: 12)
            }
        }
        .frame(width: 18, height: 18)
        .padding(1) // expands hit target to 20×20
        .opacity(isEnabled ? 1 : 0.5)
        .contentShape(Rectangle())
    }

    private func boxFill(filled: Bool) -> Color {
        if !filled {
            return isError ? .silknet.backgroundSurface : .silknet.backgroundLayer
        }
        // checked or indeterminate
        return isEnabled ? .silknet.backgroundPrimaryAccent : .silknet.backgroundDisabled
    }

    private var boxBorder: Color {
        isError ? .silknet.backgroundErrorAccent : .silknet.borderDefault
    }
}

// Simple checkmark path that scales to its frame.
private struct CheckmarkShape: Shape {
    func path(in rect: CGRect) -> Path {
        var p = Path()
        // Normalized coords matching React polyline "20 6 9 17 4 12" in 24-vbox.
        let map: (CGFloat, CGFloat) -> CGPoint = { x, y in
            CGPoint(x: rect.minX + rect.width * (x / 24), y: rect.minY + rect.height * (y / 24))
        }
        p.move(to: map(4, 12))
        p.addLine(to: map(9, 17))
        p.addLine(to: map(20, 6))
        return p
    }
}

#if DEBUG
private struct CheckboxPreview: View {
    @State var isChecked: Bool
    var indeterminate: Bool = false
    var isError: Bool = false
    var disabled: Bool = false
    var body: some View {
        SilknetCheckbox(isChecked: $isChecked, indeterminate: indeterminate, isError: isError)
            .disabled(disabled)
    }
}

#Preview("All states") {
    VStack(alignment: .leading, spacing: 16) {
        HStack { Text("Unchecked").frame(width: 200, alignment: .leading); CheckboxPreview(isChecked: false) }
        HStack { Text("Checked").frame(width: 200, alignment: .leading); CheckboxPreview(isChecked: true) }
        HStack { Text("Indeterminate").frame(width: 200, alignment: .leading); CheckboxPreview(isChecked: false, indeterminate: true) }
        HStack { Text("Error (unchecked)").frame(width: 200, alignment: .leading); CheckboxPreview(isChecked: false, isError: true) }
        HStack { Text("Disabled (unchecked)").frame(width: 200, alignment: .leading); CheckboxPreview(isChecked: false, disabled: true) }
        HStack { Text("Disabled (checked)").frame(width: 200, alignment: .leading); CheckboxPreview(isChecked: true, disabled: true) }
        HStack { Text("Disabled (indeterminate)").frame(width: 200, alignment: .leading); CheckboxPreview(isChecked: false, indeterminate: true, disabled: true) }
    }
    .padding(24)
    .background(Color.silknet.backgroundLayer)
    .font(.silknet.bodyBodyDefault)
    .foregroundColor(.silknet.textDefault)
}
#endif
