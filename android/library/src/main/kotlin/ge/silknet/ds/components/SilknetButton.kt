// SilknetButton — Jetpack Compose mirror of the iOS SilknetButton.
// Verified against Figma Button component (node 27:110 family).
// 5 variants × 4 sizes; pressed = 16% alpha-black overlay (matches React +
// SwiftUI overlay pattern).

package ge.silknet.ds.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import ge.silknet.ds.Silknet
import ge.silknet.ds.SilknetTheme

enum class SilknetButtonVariant { Primary, PrimarySoft, Secondary, Ghost, Link }
enum class SilknetButtonSize { Xs, Sm, Md, Lg }

@Composable
fun SilknetButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: SilknetButtonVariant = SilknetButtonVariant.Primary,
    size: SilknetButtonSize = SilknetButtonSize.Md,
    enabled: Boolean = true,
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()

    val bg = backgroundFor(variant, enabled)
    val fg = foregroundFor(variant, enabled)
    val borderColor = borderFor(variant, enabled)
    val shape = RoundedCornerShape(cornerRadiusFor(size))

    val baseModifier = modifier
        .height(heightFor(size))
        .clip(shape)
        .background(bg)
        .let { if (borderColor != null) it.border(1.dp, borderColor, shape) else it }
        .clickable(
            interactionSource = interactionSource,
            indication = null,
            enabled = enabled,
            onClick = onClick,
        )

    Box(
        modifier = baseModifier,
        contentAlignment = Alignment.Center,
    ) {
        // Pressed overlay (skipped for link — link uses opacity darken instead).
        val pressedOverlayAlpha = when {
            !isPressed || !enabled -> 0f
            variant == SilknetButtonVariant.Link -> 0f
            else -> 0.16f
        }
        Box(
            modifier = Modifier
                .matchParentSize()
                .background(Color.Black.copy(alpha = pressedOverlayAlpha))
        )
        val effectiveFg = if (variant == SilknetButtonVariant.Link && isPressed && enabled) {
            fg.copy(alpha = 0.84f)
        } else fg

        Text(
            text = text,
            color = effectiveFg,
            style = textStyleFor(size, variant),
            textDecoration = if (variant == SilknetButtonVariant.Link)
                TextDecoration.Underline else TextDecoration.None,
            modifier = Modifier.padding(horizontal = horizontalPaddingFor(size, variant)),
        )
    }
}

// ---- style resolvers ----

@Composable
private fun backgroundFor(variant: SilknetButtonVariant, enabled: Boolean): Color {
    if (!enabled) {
        return when (variant) {
            SilknetButtonVariant.Primary, SilknetButtonVariant.PrimarySoft -> Silknet.colors.backgroundDisabled
            SilknetButtonVariant.Secondary, SilknetButtonVariant.Ghost, SilknetButtonVariant.Link -> Color.Transparent
        }
    }
    return when (variant) {
        SilknetButtonVariant.Primary -> Silknet.colors.backgroundPrimaryAccent
        SilknetButtonVariant.PrimarySoft -> Silknet.colors.backgroundPrimarySoft
        SilknetButtonVariant.Secondary -> Silknet.colors.backgroundLayer
        SilknetButtonVariant.Ghost, SilknetButtonVariant.Link -> Color.Transparent
    }
}

@Composable
private fun foregroundFor(variant: SilknetButtonVariant, enabled: Boolean): Color {
    if (!enabled) {
        return when (variant) {
            // Filled disabled = white text "ghosted out" (design intent — text-contrast on disabled-grey bg).
            SilknetButtonVariant.Primary, SilknetButtonVariant.PrimarySoft -> Silknet.colors.textContrast
            SilknetButtonVariant.Secondary, SilknetButtonVariant.Ghost, SilknetButtonVariant.Link -> Silknet.colors.textDisabled
        }
    }
    return when (variant) {
        SilknetButtonVariant.Primary -> Silknet.colors.textContrast
        SilknetButtonVariant.PrimarySoft -> Silknet.colors.textPrimary
        SilknetButtonVariant.Secondary, SilknetButtonVariant.Ghost -> Silknet.colors.textSecondary
        SilknetButtonVariant.Link -> Silknet.colors.textPrimary
    }
}

@Composable
private fun borderFor(variant: SilknetButtonVariant, enabled: Boolean): Color? {
    if (variant != SilknetButtonVariant.Secondary) return null
    return if (enabled) Silknet.colors.borderDefault else Silknet.colors.backgroundDisabled
}

private fun heightFor(size: SilknetButtonSize): Dp = when (size) {
    SilknetButtonSize.Xs -> 24.dp
    SilknetButtonSize.Sm -> 32.dp
    SilknetButtonSize.Md -> 44.dp
    SilknetButtonSize.Lg -> 52.dp
}

@Composable
private fun cornerRadiusFor(size: SilknetButtonSize): Dp = when (size) {
    SilknetButtonSize.Xs, SilknetButtonSize.Sm -> Silknet.dimens.digitsRadiusXs
    SilknetButtonSize.Md, SilknetButtonSize.Lg -> Silknet.dimens.digitsRadiusS
}

@Composable
private fun horizontalPaddingFor(size: SilknetButtonSize, variant: SilknetButtonVariant): Dp {
    if (variant == SilknetButtonVariant.Link) return 0.dp
    return when (size) {
        SilknetButtonSize.Xs -> Silknet.dimens.digitsSpacing2
        SilknetButtonSize.Sm -> Silknet.dimens.digitsSpacing3
        SilknetButtonSize.Md -> Silknet.dimens.digitsSpacing4
        SilknetButtonSize.Lg -> Silknet.dimens.digitsSpacing5
    }
}

@Composable
private fun textStyleFor(size: SilknetButtonSize, variant: SilknetButtonVariant): TextStyle {
    val base = when (size) {
        SilknetButtonSize.Xs, SilknetButtonSize.Sm -> Silknet.typography.buttonButtonAdditional
        SilknetButtonSize.Md, SilknetButtonSize.Lg -> Silknet.typography.buttonButtonDefault
    }
    return if (variant == SilknetButtonVariant.Link) {
        when (size) {
            SilknetButtonSize.Xs, SilknetButtonSize.Sm -> Silknet.typography.buttonLinkbuttonAdditional
            SilknetButtonSize.Md, SilknetButtonSize.Lg -> Silknet.typography.buttonLinkbuttonDefault
        }
    } else base
}

// ---- previews ----

@Preview(name = "All variants — md")
@Composable
private fun PreviewAllVariants() {
    SilknetTheme {
        Box(
            modifier = Modifier
                .background(Silknet.colors.backgroundLayer)
                .padding(24.dp)
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    SilknetButton("Primary", {}, variant = SilknetButtonVariant.Primary)
                    SilknetButton("Soft", {}, variant = SilknetButtonVariant.PrimarySoft)
                    SilknetButton("Secondary", {}, variant = SilknetButtonVariant.Secondary)
                }
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    SilknetButton("Ghost", {}, variant = SilknetButtonVariant.Ghost)
                    SilknetButton("Link", {}, variant = SilknetButtonVariant.Link)
                }
            }
        }
    }
}

@Preview(name = "Sizes — primary")
@Composable
private fun PreviewSizes() {
    SilknetTheme {
        Box(
            modifier = Modifier
                .background(Silknet.colors.backgroundLayer)
                .padding(24.dp)
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                SilknetButton("xs", {}, size = SilknetButtonSize.Xs)
                SilknetButton("sm", {}, size = SilknetButtonSize.Sm)
                SilknetButton("md", {}, size = SilknetButtonSize.Md)
                SilknetButton("lg", {}, size = SilknetButtonSize.Lg)
            }
        }
    }
}

@Preview(name = "Disabled")
@Composable
private fun PreviewDisabled() {
    SilknetTheme {
        Box(
            modifier = Modifier
                .background(Silknet.colors.backgroundLayer)
                .padding(24.dp)
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                SilknetButton("Primary", {}, variant = SilknetButtonVariant.Primary, enabled = false)
                SilknetButton("Soft", {}, variant = SilknetButtonVariant.PrimarySoft, enabled = false)
                SilknetButton("Secondary", {}, variant = SilknetButtonVariant.Secondary, enabled = false)
                SilknetButton("Ghost", {}, variant = SilknetButtonVariant.Ghost, enabled = false)
                SilknetButton("Link", {}, variant = SilknetButtonVariant.Link, enabled = false)
            }
        }
    }
}
