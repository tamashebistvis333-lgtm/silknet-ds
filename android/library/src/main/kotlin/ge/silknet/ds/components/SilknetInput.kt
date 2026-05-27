// SilknetInput — Compose floating-label text field. Mirrors React Input 1:1.
// 52.dp tall, padding 8 horizontal 16, radius-s, border-subtle. Focus = primary
// border + 4.dp primary-16 glow. Error = pink bg + red border; focused error
// gets red border + red-16 glow. Disabled = 0.5 alpha.

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
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.LocalContentColor
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import ge.silknet.ds.Silknet
import ge.silknet.ds.SilknetTheme

@Composable
fun SilknetInput(
    label: String,
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    helperText: String? = null,
    error: String? = null,
    enabled: Boolean = true,
    visualTransformation: VisualTransformation = VisualTransformation.None,
    keyboardOptions: KeyboardOptions = KeyboardOptions.Default,
    leftIcon: (@Composable () -> Unit)? = null,
    rightIcon: (@Composable () -> Unit)? = null,
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isFocused by interactionSource.collectIsFocusedAsState()
    val isError = error != null
    val helper = error ?: helperText
    val helperState = if (isError) SilknetHelperTextState.Error else SilknetHelperTextState.Default
    val floated = isFocused || value.isNotEmpty()
    val shape = RoundedCornerShape(Silknet.dimens.digitsRadiusS)

    val containerBg = resolveBg(isFocused = isFocused, isError = isError)
    val borderCol = resolveBorder(isFocused = isFocused, isError = isError)
    val glowCol = if (isError) Silknet.palette.red16 else Silknet.palette.primary16

    val labelTopPadding by animateDpAsState(
        targetValue = if (floated) 6.dp else 14.dp,
        animationSpec = tween(150),
        label = "labelTop",
    )

    Column(
        modifier = modifier.alpha(if (enabled) 1f else 0.5f),
        verticalArrangement = Arrangement.spacedBy(Silknet.dimens.digitsSpacing2),
    ) {
        Box(
            modifier = Modifier
                .height(52.dp)
                .clip(shape)
                .background(containerBg)
                .border(1.dp, borderCol, shape)
                .let {
                    if (isFocused) it.border(4.dp, glowCol, shape) else it
                },
        ) {
            Row(
                modifier = Modifier.padding(horizontal = Silknet.dimens.digitsSpacing4),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(Silknet.dimens.digitsSpacing3),
            ) {
                if (leftIcon != null) {
                    Box(modifier = Modifier.size(20.dp)) {
                        CompositionLocalProvider(LocalContentColor provides Silknet.colors.textAdditional) {
                            leftIcon()
                        }
                    }
                }

                Box(
                    modifier = Modifier
                        .height(52.dp)
                        .weight(1f),
                ) {
                    // Floating label.
                    val labelStyle = if (floated)
                        Silknet.typography.subtitleSubtitle3 else Silknet.typography.bodyBodyAccent
                    Text(
                        text = label,
                        color = Silknet.colors.textAdditional,
                        style = labelStyle,
                        modifier = Modifier.padding(top = labelTopPadding),
                    )

                    if (floated) {
                        BasicTextField(
                            value = value,
                            onValueChange = onValueChange,
                            enabled = enabled,
                            visualTransformation = visualTransformation,
                            keyboardOptions = keyboardOptions,
                            interactionSource = interactionSource,
                            singleLine = true,
                            textStyle = Silknet.typography.bodyBodyDefault.copy(color = Silknet.colors.textDefault),
                            cursorBrush = SolidColor(Silknet.colors.backgroundPrimaryAccent),
                            modifier = Modifier
                                .align(Alignment.BottomStart)
                                .padding(bottom = 6.dp),
                        )
                    } else {
                        // Hidden field still needs to exist for tap focus to work.
                        BasicTextField(
                            value = value,
                            onValueChange = onValueChange,
                            enabled = enabled,
                            visualTransformation = visualTransformation,
                            keyboardOptions = keyboardOptions,
                            interactionSource = interactionSource,
                            singleLine = true,
                            textStyle = Silknet.typography.bodyBodyDefault.copy(color = Color.Transparent),
                            cursorBrush = SolidColor(Color.Transparent),
                            modifier = Modifier
                                .alpha(0f)
                                .height(52.dp),
                        )
                    }
                }

                if (rightIcon != null) {
                    Box(modifier = Modifier.size(20.dp)) {
                        CompositionLocalProvider(LocalContentColor provides Silknet.colors.textAdditional) {
                            rightIcon()
                        }
                    }
                }
            }
        }

        if (helper != null) {
            SilknetHelperText(helper, state = helperState)
        }
    }
}

@Composable
private fun resolveBg(isFocused: Boolean, isError: Boolean): Color = when {
    isError && !isFocused -> Silknet.colors.backgroundError
    isFocused -> Silknet.colors.backgroundLayer
    else -> Silknet.colors.backgroundInputDefault
}

@Composable
private fun resolveBorder(isFocused: Boolean, isError: Boolean): Color = when {
    isError && isFocused -> Silknet.colors.backgroundErrorAccent
    isError -> Silknet.colors.borderError
    isFocused -> Silknet.colors.backgroundPrimaryAccent
    else -> Silknet.colors.borderSubtle
}

@Preview(name = "States")
@Composable
private fun PreviewInput() {
    SilknetTheme {
        Box(
            modifier = Modifier
                .background(Silknet.colors.backgroundLayer)
                .padding(24.dp)
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                SilknetInput(label = "Empty", value = "", onValueChange = {})
                SilknetInput(label = "Filled", value = "Sandro", onValueChange = {})
                SilknetInput(label = "With helper", value = "", onValueChange = {}, helperText = "Use your full name")
                SilknetInput(label = "Empty error", value = "", onValueChange = {}, error = "Required field")
                SilknetInput(label = "Filled error", value = "bad@", onValueChange = {}, error = "Invalid email")
                SilknetInput(label = "Disabled", value = "", onValueChange = {}, enabled = false)
            }
        }
    }
}
