// Auto-generated from silknet-ds tokens. Do not edit by hand.
// Re-run `npm run build:android` (or `npm run sync`) after token changes.

package ge.silknet.ds

import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

/**
 * Font family used by the Silknet text styles below. Falls back to the
 * platform default sans-serif if "Noto Sans Georgian" is not bundled with the host
 * app — the consumer should ship the font as an asset to get pixel-perfect
 * Figma parity.
 */
val SilknetFontFamily: FontFamily = FontFamily.SansSerif // see KDoc above

/**
 * Composite text styles matching Figma's Local Styles. Each combines family +
 * weight + size + line-height + letter-spacing into a single [TextStyle].
 *
 *     Text("Title", style = SilknetTypography.headingHeading1)
 */
object SilknetTypography {
    val headingHeading1 = TextStyle(
        fontFamily = SilknetFontFamily,
        fontWeight = FontWeight.Medium,
        fontSize = 32.sp,
        lineHeight = 48.sp,
        letterSpacing = 0.sp,
    )
    val headingHeading2 = TextStyle(
        fontFamily = SilknetFontFamily,
        fontWeight = FontWeight.Medium,
        fontSize = 28.sp,
        lineHeight = 40.sp,
        letterSpacing = 0.sp,
    )
    val headingHeading3 = TextStyle(
        fontFamily = SilknetFontFamily,
        fontWeight = FontWeight.Medium,
        fontSize = 20.sp,
        lineHeight = 28.sp,
        letterSpacing = 0.sp,
    )
    val headingHeading4 = TextStyle(
        fontFamily = SilknetFontFamily,
        fontWeight = FontWeight.SemiBold,
        fontSize = 16.sp,
        lineHeight = 24.sp,
        letterSpacing = 0.sp,
    )
    val headingDisplay = TextStyle(
        fontFamily = SilknetFontFamily,
        fontWeight = FontWeight.Normal,
        fontSize = 20.sp,
        lineHeight = 28.sp,
        letterSpacing = 0.sp,
    )
    val subtitleSubtitle1 = TextStyle(
        fontFamily = SilknetFontFamily,
        fontWeight = FontWeight.Medium,
        fontSize = 16.sp,
        lineHeight = 24.sp,
        letterSpacing = 0.sp,
    )
    val subtitleSubtitle2 = TextStyle(
        fontFamily = SilknetFontFamily,
        fontWeight = FontWeight.Medium,
        fontSize = 14.sp,
        lineHeight = 20.sp,
        letterSpacing = 0.sp,
    )
    val subtitleSubtitle3 = TextStyle(
        fontFamily = SilknetFontFamily,
        fontWeight = FontWeight.Medium,
        fontSize = 12.sp,
        lineHeight = 16.sp,
        letterSpacing = 0.sp,
    )
    val bodyBodyAccent = TextStyle(
        fontFamily = SilknetFontFamily,
        fontWeight = FontWeight.Normal,
        fontSize = 16.sp,
        lineHeight = 24.sp,
        letterSpacing = 0.sp,
    )
    val bodyBodyDefault = TextStyle(
        fontFamily = SilknetFontFamily,
        fontWeight = FontWeight.Normal,
        fontSize = 14.sp,
        lineHeight = 20.sp,
        letterSpacing = 0.sp,
    )
    val bodyBodyAdditional = TextStyle(
        fontFamily = SilknetFontFamily,
        fontWeight = FontWeight.Normal,
        fontSize = 12.sp,
        lineHeight = 16.sp,
        letterSpacing = 0.sp,
    )
    val buttonButtonDefault = TextStyle(
        fontFamily = SilknetFontFamily,
        fontWeight = FontWeight.Medium,
        fontSize = 14.sp,
        lineHeight = 20.sp,
        letterSpacing = 0.2.sp,
    )
    val buttonButtonAdditional = TextStyle(
        fontFamily = SilknetFontFamily,
        fontWeight = FontWeight.Medium,
        fontSize = 12.sp,
        lineHeight = 16.sp,
        letterSpacing = 0.2.sp,
    )
    val buttonLinkbuttonDefault = TextStyle(
        fontFamily = SilknetFontFamily,
        fontWeight = FontWeight.Medium,
        fontSize = 14.sp,
        lineHeight = 16.sp,
        letterSpacing = 0.2.sp,
    )
    val buttonLinkbuttonAdditional = TextStyle(
        fontFamily = SilknetFontFamily,
        fontWeight = FontWeight.Medium,
        fontSize = 12.sp,
        lineHeight = 16.sp,
        letterSpacing = 0.sp,
    )
    val otherCaption = TextStyle(
        fontFamily = SilknetFontFamily,
        fontWeight = FontWeight.Normal,
        fontSize = 11.sp,
        lineHeight = 16.sp,
        letterSpacing = 0.25.sp,
    )
    val otherOverline = TextStyle(
        fontFamily = SilknetFontFamily,
        fontWeight = FontWeight.SemiBold,
        fontSize = 11.sp,
        lineHeight = 12.sp,
        letterSpacing = 0.25.sp,
    )
}
