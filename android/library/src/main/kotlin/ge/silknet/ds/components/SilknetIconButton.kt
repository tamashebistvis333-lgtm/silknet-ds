// SilknetIconButton — square, single-icon button. Mirrors iOS SilknetIconButton.
// Verified against Figma node 2052:3517. Uniform padding = (size − icon) / 2.

package ge.silknet.ds.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.LocalContentColor
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import ge.silknet.ds.Silknet
import ge.silknet.ds.SilknetTheme

enum class SilknetIconButtonVariant { Primary, PrimarySoft, Secondary, Ghost }

@Composable
fun SilknetIconButton(
    contentDescription: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: SilknetIconButtonVariant = SilknetIconButtonVariant.Primary,
    size: SilknetButtonSize = SilknetButtonSize.Md,
    enabled: Boolean = true,
    icon: @Composable () -> Unit,
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()

    val bg = iconBgFor(variant, enabled)
    val fg = iconFgFor(variant, enabled)
    val borderColor = iconBorderFor(variant, enabled)
    val shape = RoundedCornerShape(iconCornerFor(size))
    val iconSizeDp = iconSizeFor(size)
    val pad = iconPadFor(size)

    Box(
        modifier = modifier
            .semantics { this.contentDescription = contentDescription }
            .clip(shape)
            .background(bg)
            .let { if (borderColor != null) it.border(1.dp, borderColor, shape) else it }
            .clickable(
                interactionSource = interactionSource,
                indication = null,
                enabled = enabled,
                onClick = onClick,
            )
            .padding(pad),
        contentAlignment = Alignment.Center,
    ) {
        if (isPressed && enabled) {
            Box(
                modifier = Modifier
                    .matchParentSize()
                    .background(Color.Black.copy(alpha = 0.16f))
            )
        }
        Box(modifier = Modifier.size(iconSizeDp)) {
            CompositionLocalProvider(LocalContentColor provides fg) { icon() }
        }
    }
}

@Composable
private fun iconBgFor(variant: SilknetIconButtonVariant, enabled: Boolean): Color {
    if (!enabled) {
        return when (variant) {
            SilknetIconButtonVariant.Primary, SilknetIconButtonVariant.PrimarySoft -> Silknet.colors.backgroundDisabled
            SilknetIconButtonVariant.Secondary, SilknetIconButtonVariant.Ghost -> Color.Transparent
        }
    }
    return when (variant) {
        SilknetIconButtonVariant.Primary -> Silknet.colors.backgroundPrimaryAccent
        SilknetIconButtonVariant.PrimarySoft -> Silknet.colors.backgroundPrimarySoft
        SilknetIconButtonVariant.Secondary -> Silknet.colors.backgroundLayer
        SilknetIconButtonVariant.Ghost -> Color.Transparent
    }
}

@Composable
private fun iconFgFor(variant: SilknetIconButtonVariant, enabled: Boolean): Color {
    if (!enabled) {
        return when (variant) {
            SilknetIconButtonVariant.Primary, SilknetIconButtonVariant.PrimarySoft -> Silknet.colors.textContrast
            SilknetIconButtonVariant.Secondary, SilknetIconButtonVariant.Ghost -> Silknet.colors.textDisabled
        }
    }
    return when (variant) {
        SilknetIconButtonVariant.Primary -> Silknet.colors.textContrast
        SilknetIconButtonVariant.PrimarySoft -> Silknet.colors.textPrimary
        SilknetIconButtonVariant.Secondary, SilknetIconButtonVariant.Ghost -> Silknet.colors.textSecondary
    }
}

@Composable
private fun iconBorderFor(variant: SilknetIconButtonVariant, enabled: Boolean): Color? {
    if (variant != SilknetIconButtonVariant.Secondary) return null
    return if (enabled) Silknet.colors.borderDefault else Silknet.colors.backgroundDisabled
}

@Composable
private fun iconCornerFor(size: SilknetButtonSize): Dp = when (size) {
    SilknetButtonSize.Xs, SilknetButtonSize.Sm -> Silknet.dimens.digitsRadiusXs
    SilknetButtonSize.Md, SilknetButtonSize.Lg -> Silknet.dimens.digitsRadiusS
}

private fun iconSizeFor(size: SilknetButtonSize): Dp = when (size) {
    SilknetButtonSize.Xs, SilknetButtonSize.Sm -> 16.dp
    SilknetButtonSize.Md, SilknetButtonSize.Lg -> 20.dp
}

@Composable
private fun iconPadFor(size: SilknetButtonSize): Dp = when (size) {
    SilknetButtonSize.Xs -> Silknet.dimens.digitsSpacing1
    SilknetButtonSize.Sm -> Silknet.dimens.digitsSpacing2
    SilknetButtonSize.Md -> Silknet.dimens.digitsSpacing3
    SilknetButtonSize.Lg -> Silknet.dimens.digitsSpacing4
}

@Preview(name = "All variants — md")
@Composable
private fun PreviewIconAllVariants() {
    SilknetTheme {
        Box(
            modifier = Modifier
                .background(Silknet.colors.backgroundLayer)
                .padding(24.dp)
        ) {
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                SilknetIconButton("Add", {}, variant = SilknetIconButtonVariant.Primary) { PlusGlyph() }
                SilknetIconButton("Add", {}, variant = SilknetIconButtonVariant.PrimarySoft) { PlusGlyph() }
                SilknetIconButton("Add", {}, variant = SilknetIconButtonVariant.Secondary) { PlusGlyph() }
                SilknetIconButton("Add", {}, variant = SilknetIconButtonVariant.Ghost) { PlusGlyph() }
            }
        }
    }
}

@Preview(name = "Sizes")
@Composable
private fun PreviewIconSizes() {
    SilknetTheme {
        Box(
            modifier = Modifier
                .background(Silknet.colors.backgroundLayer)
                .padding(24.dp)
        ) {
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
                SilknetIconButton("xs", {}, size = SilknetButtonSize.Xs) { PlusGlyph() }
                SilknetIconButton("sm", {}, size = SilknetButtonSize.Sm) { PlusGlyph() }
                SilknetIconButton("md", {}, size = SilknetButtonSize.Md) { PlusGlyph() }
                SilknetIconButton("lg", {}, size = SilknetButtonSize.Lg) { PlusGlyph() }
            }
        }
    }
}

// Tiny stand-in icon so previews don't depend on an icons dependency.
@Composable
private fun PlusGlyph() {
    Box(
        modifier = Modifier
            .size(20.dp),
        contentAlignment = Alignment.Center,
    ) {
        Box(Modifier.size(width = 12.dp, height = 2.dp).background(LocalContentColor.current))
        Box(Modifier.size(width = 2.dp, height = 12.dp).background(LocalContentColor.current))
    }
}
