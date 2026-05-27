// SilknetHelperText — Compose mirror of iOS SilknetHelperText.
// Caption text; default state has no icon, semantic states prepend a 16dp
// Material icon and switch text color.

package ge.silknet.ds.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Error
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import ge.silknet.ds.Silknet
import ge.silknet.ds.SilknetTheme

enum class SilknetHelperTextState { Default, Success, Info, Warning, Error }

@Composable
fun SilknetHelperText(
    text: String,
    modifier: Modifier = Modifier,
    state: SilknetHelperTextState = SilknetHelperTextState.Default,
) {
    val color = colorFor(state)
    val icon = iconFor(state)
    Row(
        modifier = modifier,
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(Silknet.dimens.digitsSpacing2),
    ) {
        if (icon != null) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = color,
                modifier = Modifier.size(16.dp),
            )
        }
        Text(
            text = text,
            color = color,
            style = Silknet.typography.otherCaption.copy(letterSpacing = 0.25.sp),
        )
    }
}

@Composable
private fun colorFor(state: SilknetHelperTextState): Color = when (state) {
    SilknetHelperTextState.Default -> Silknet.colors.textAdditional
    SilknetHelperTextState.Success -> Silknet.colors.textSuccess
    SilknetHelperTextState.Info    -> Silknet.colors.textInfo
    SilknetHelperTextState.Warning -> Silknet.colors.textWarrning // Figma source spelling.
    SilknetHelperTextState.Error   -> Silknet.colors.textError
}

private fun iconFor(state: SilknetHelperTextState): ImageVector? = when (state) {
    SilknetHelperTextState.Default -> null
    SilknetHelperTextState.Success -> Icons.Filled.CheckCircle
    SilknetHelperTextState.Info    -> Icons.Filled.Info
    SilknetHelperTextState.Warning -> Icons.Filled.Warning
    SilknetHelperTextState.Error   -> Icons.Filled.Error
}

@Preview(name = "All states")
@Composable
private fun PreviewHelperText() {
    SilknetTheme {
        Box(
            modifier = Modifier
                .background(Silknet.colors.backgroundLayer)
                .padding(24.dp)
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                SilknetHelperText("Default helper text")
                SilknetHelperText("Looking good", state = SilknetHelperTextState.Success)
                SilknetHelperText("Just so you know", state = SilknetHelperTextState.Info)
                SilknetHelperText("Heads up", state = SilknetHelperTextState.Warning)
                SilknetHelperText("Something went wrong", state = SilknetHelperTextState.Error)
            }
        }
    }
}
