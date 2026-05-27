// SilknetTextArea — multi-line variant of SilknetInput.
// Min height 104.dp, padding 14 horizontal 16, same floating-label pattern.

package ge.silknet.ds.components

import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsFocusedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import ge.silknet.ds.Silknet
import ge.silknet.ds.SilknetTheme

@Composable
fun SilknetTextArea(
    label: String,
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    helperText: String? = null,
    error: String? = null,
    enabled: Boolean = true,
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isFocused by interactionSource.collectIsFocusedAsState()
    val isError = error != null
    val helper = error ?: helperText
    val helperState = if (isError) SilknetHelperTextState.Error else SilknetHelperTextState.Default
    val floated = isFocused || value.isNotEmpty()
    val shape = RoundedCornerShape(Silknet.dimens.digitsRadiusS)

    val containerBg = when {
        isError && !isFocused -> Silknet.colors.backgroundError
        isFocused -> Silknet.colors.backgroundLayer
        else -> Silknet.colors.backgroundInputDefault
    }
    val borderCol = when {
        isError && isFocused -> Silknet.colors.backgroundErrorAccent
        isError -> Silknet.colors.borderError
        isFocused -> Silknet.colors.backgroundPrimaryAccent
        else -> Silknet.colors.borderSubtle
    }
    val glowCol = if (isError) Silknet.palette.red16 else Silknet.palette.primary16

    val labelGap by animateDpAsState(
        targetValue = if (floated) 4.dp else 0.dp,
        animationSpec = tween(150),
        label = "labelGap",
    )

    Column(
        modifier = modifier.alpha(if (enabled) 1f else 0.5f),
        verticalArrangement = Arrangement.spacedBy(Silknet.dimens.digitsSpacing2),
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .defaultMinSize(minHeight = 104.dp)
                .clip(shape)
                .background(containerBg)
                .border(1.dp, borderCol, shape)
                .let { if (isFocused) it.border(4.dp, glowCol, shape) else it }
                .padding(horizontal = Silknet.dimens.digitsSpacing4, vertical = 14.dp),
            verticalArrangement = Arrangement.spacedBy(labelGap),
        ) {
            val labelStyle = if (floated)
                Silknet.typography.subtitleSubtitle3 else Silknet.typography.bodyBodyAccent
            Text(
                text = label,
                color = Silknet.colors.textAdditional,
                style = labelStyle,
            )

            BasicTextField(
                value = value,
                onValueChange = onValueChange,
                enabled = enabled,
                interactionSource = interactionSource,
                textStyle = Silknet.typography.bodyBodyDefault.copy(color = Silknet.colors.textDefault),
                cursorBrush = SolidColor(
                    if (floated) Silknet.colors.backgroundPrimaryAccent else Color.Transparent
                ),
                modifier = Modifier
                    .fillMaxWidth()
                    .defaultMinSize(minHeight = if (floated) 60.dp else 0.dp)
                    .alpha(if (floated) 1f else 0f),
            )
        }

        if (helper != null) {
            SilknetHelperText(helper, state = helperState)
        }
    }
}

@Preview(name = "States")
@Composable
private fun PreviewTextArea() {
    SilknetTheme {
        Box(
            modifier = Modifier
                .background(Silknet.colors.backgroundLayer)
                .padding(24.dp)
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                SilknetTextArea(label = "Comments", value = "", onValueChange = {})
                SilknetTextArea(label = "Filled", value = "Hello\nMulti-line\nContent", onValueChange = {})
                SilknetTextArea(label = "Error", value = "", onValueChange = {}, error = "Description is required")
                SilknetTextArea(label = "Disabled", value = "", onValueChange = {}, enabled = false)
            }
        }
    }
}
