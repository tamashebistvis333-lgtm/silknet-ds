// Auto-generated from silknet-ds tokens. Do not edit by hand.
// Source: tokens/*.json. Re-run `npm run build:swift` after token changes.

import SwiftUI
import CoreGraphics

/// Font family, weights, sizes, and line heights — primitive typography.
/// For ready-to-use Font instances see `Font.silknet` below.
public enum SilknetTypography {
    public static let fontFamily: String = "Noto Sans Georgian"
}

public struct SilknetFontWeights {
    public let fontWeightRegular: Font.Weight = .regular
    public let fontWeightMedium: Font.Weight = .medium
    public let fontWeightSemibold: Font.Weight = .semibold
    public let fontWeightBold: Font.Weight = .bold
}
public extension SilknetTypography {
    static let weight = SilknetFontWeights()
}

public struct SilknetFontSizes {
    public let fontSizeHeadingHeading1: CGFloat = 32
    public let fontSizeHeadingHeading2: CGFloat = 28
    public let fontSizeHeadingHeading3: CGFloat = 20
    public let fontSizeHeadingHeading4: CGFloat = 16
    public let fontSizeHeadingDisplayDisplay: CGFloat = 20
    public let fontSizeSubtitleSubtitle1: CGFloat = 16
    public let fontSizeSubtitleSubtitle2: CGFloat = 14
    public let fontSizeSubtitleSubtitle3: CGFloat = 12
    public let fontSizeBodyBodyAccent: CGFloat = 16
    public let fontSizeBodyBodyDefault: CGFloat = 14
    public let fontSizeBodyBodyAdditional: CGFloat = 12
    public let fontSizeButtonButtonDefault: CGFloat = 14
    public let fontSizeButtonButtonAdditional: CGFloat = 12
    public let fontSizeOtherCaption: CGFloat = 11
    public let fontSizeOtherOverline: CGFloat = 11
}
public extension SilknetTypography {
    static let size = SilknetFontSizes()
}

public struct SilknetLineHeights {
    public let fontHeightHeadingHeading1: CGFloat = 48
    public let fontHeightHeadingHeading2: CGFloat = 40
    public let fontHeightHeadingHeading3: CGFloat = 28
    public let fontHeightHeadingHeading4: CGFloat = 24
    public let fontHeightHeadingDisplayDisplay: CGFloat = 28
    public let fontHeightSubtitleSubtitle1: CGFloat = 24
    public let fontHeightSubtitleSubtitle2: CGFloat = 20
    public let fontHeightSubtitleSubtitle3: CGFloat = 16
    public let fontHeightBodyBodyAccent: CGFloat = 24
    public let fontHeightBodyBodyDefault: CGFloat = 20
    public let fontHeightBodyBodyAdditional: CGFloat = 16
    public let fontHeightButtonButtonDefault: CGFloat = 20
    public let fontHeightButtonButtonAdditional: CGFloat = 16
    public let fontHeightOtherCaption: CGFloat = 16
    public let fontHeightOtherOverline: CGFloat = 12
}
public extension SilknetTypography {
    static let lineHeight = SilknetLineHeights()
}

/// Composite text styles. Use via `Font.silknet`:
///
///     Text("Title").font(.silknet.headingHeading1)
///
/// Each composite resolves family + weight + size into a single Font.
/// Line height and letter spacing must currently be applied separately
/// (e.g. via `.lineSpacing()`) — SwiftUI's Font doesn't carry those.
public extension Font {
    static let silknet = SilknetFonts()
}

public struct SilknetFonts {
    public let headingHeading1: Font = .custom("Noto Sans Georgian", size: 32).weight(.medium)
    public let headingHeading2: Font = .custom("Noto Sans Georgian", size: 28).weight(.medium)
    public let headingHeading3: Font = .custom("Noto Sans Georgian", size: 20).weight(.medium)
    public let headingHeading4: Font = .custom("Noto Sans Georgian", size: 16).weight(.semibold)
    public let headingDisplay: Font = .custom("Noto Sans Georgian", size: 20).weight(.regular)
    public let subtitleSubtitle1: Font = .custom("Noto Sans Georgian", size: 16).weight(.medium)
    public let subtitleSubtitle2: Font = .custom("Noto Sans Georgian", size: 14).weight(.medium)
    public let subtitleSubtitle3: Font = .custom("Noto Sans Georgian", size: 12).weight(.medium)
    public let bodyBodyAccent: Font = .custom("Noto Sans Georgian", size: 16).weight(.regular)
    public let bodyBodyDefault: Font = .custom("Noto Sans Georgian", size: 14).weight(.regular)
    public let bodyBodyAdditional: Font = .custom("Noto Sans Georgian", size: 12).weight(.regular)
    public let buttonButtonDefault: Font = .custom("Noto Sans Georgian", size: 14).weight(.medium)
    public let buttonButtonAdditional: Font = .custom("Noto Sans Georgian", size: 12).weight(.medium)
    public let buttonLinkbuttonDefault: Font = .custom("Noto Sans Georgian", size: 14).weight(.medium)
    public let buttonLinkbuttonAdditional: Font = .custom("Noto Sans Georgian", size: 12).weight(.medium)
    public let otherCaption: Font = .custom("Noto Sans Georgian", size: 11).weight(.regular)
    public let otherOverline: Font = .custom("Noto Sans Georgian", size: 11).weight(.semibold)
}
