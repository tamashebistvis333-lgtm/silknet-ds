// Auto-generated from silknet-ds tokens. Do not edit by hand.
// Re-run `npm run build:android` (or `npm run sync`) after token changes.

package ge.silknet.ds

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.staticCompositionLocalOf

private val LocalSilknetColors = staticCompositionLocalOf<SilknetColors> {
    error("SilknetTheme not provided. Wrap your composable in SilknetTheme { ... }.")
}

/**
 * Wrap your app (or a subtree) in [SilknetTheme] to expose theme-aware tokens
 * via [Silknet]:
 *
 *     SilknetTheme {
 *         Text("Hello", color = Silknet.colors.textDefault)
 *     }
 *
 * Defaults to system appearance via [isSystemInDarkTheme]; pass an explicit
 * [isDark] to force a theme.
 */
@Composable
fun SilknetTheme(
    isDark: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit,
) {
    val colors = if (isDark) SilknetColorsDark else SilknetColorsLight
    CompositionLocalProvider(
        LocalSilknetColors provides colors,
        content = content,
    )
}

/**
 * Top-level access to Silknet design tokens inside a [SilknetTheme] subtree.
 *
 *     Silknet.colors.backgroundPrimaryAccent   // theme-aware
 *     Silknet.dimens.digitsSpacing4            // 16.dp
 *     Silknet.typography.headingHeading1       // TextStyle
 *     Silknet.palette.primary500               // raw color (no theme switch)
 */
object Silknet {
    val colors: SilknetColors
        @Composable get() = LocalSilknetColors.current
    val dimens: SilknetDimensions get() = SilknetDimensions
    val typography: SilknetTypography get() = SilknetTypography
    val palette: SilknetPalette get() = SilknetPalette
}
