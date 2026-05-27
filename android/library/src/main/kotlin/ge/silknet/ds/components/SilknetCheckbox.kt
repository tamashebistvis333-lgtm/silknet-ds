// SilknetCheckbox — Compose mirror of iOS SilknetCheckbox.
// 18×18 visible, 4.dp corner radius. Checked/indeterminate = primary fill +
// white indicator. Error = surface bg + red border. Disabled = 0.5 alpha.

package ge.silknet.ds.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.role
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.semantics.toggleableState
import androidx.compose.ui.state.ToggleableState
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.foundation.Canvas
import ge.silknet.ds.Silknet
import ge.silknet.ds.SilknetTheme

@Composable
fun SilknetCheckbox(
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    isError: Boolean = false,
    indeterminate: Boolean = false,
) {
    val filled = checked || indeterminate
    val shape = RoundedCornerShape(Silknet.dimens.digitsRadiusXxs)

    val boxBg: Color = when {
        !filled && isError -> Silknet.colors.backgroundSurface
        !filled -> Silknet.colors.backgroundLayer
        !enabled -> Silknet.colors.backgroundDisabled
        else -> Silknet.colors.backgroundPrimaryAccent
    }
    val boxBorder: Color? = when {
        filled -> null
        isError -> Silknet.colors.backgroundErrorAccent
        else -> Silknet.colors.borderDefault
    }
    val indicator: Color = Silknet.colors.textContrast

    Box(
        modifier = modifier
            .size(20.dp)
            .alpha(if (enabled) 1f else 0.5f)
            .clickable(enabled = enabled) { onCheckedChange(!checked) }
            .semantics {
                role = Role.Checkbox
                toggleableState = when {
                    indeterminate -> ToggleableState.Indeterminate
                    checked -> ToggleableState.On
                    else -> ToggleableState.Off
                }
                stateDescription = when {
                    indeterminate -> "mixed"
                    checked -> "checked"
                    else -> "unchecked"
                }
            },
        contentAlignment = Alignment.Center,
    ) {
        Box(
            modifier = Modifier
                .size(18.dp)
                .clip(shape)
                .background(boxBg)
                .let { if (boxBorder != null) it.border(1.dp, boxBorder, shape) else it },
            contentAlignment = Alignment.Center,
        ) {
            when {
                indeterminate -> {
                    Box(
                        modifier = Modifier
                            .size(width = 10.dp, height = 2.dp)
                            .clip(RoundedCornerShape(1.dp))
                            .background(indicator)
                    )
                }
                checked -> {
                    Canvas(modifier = Modifier.size(12.dp)) {
                        // Normalized polyline "4 12 → 9 17 → 20 6" in 24-vbox.
                        val w = size.width
                        val h = size.height
                        val map = { x: Float, y: Float -> Offset(w * (x / 24f), h * (y / 24f)) }
                        val path = Path().apply {
                            moveTo(map(4f, 12f).x, map(4f, 12f).y)
                            lineTo(map(9f, 17f).x, map(9f, 17f).y)
                            lineTo(map(20f, 6f).x, map(20f, 6f).y)
                        }
                        drawPath(
                            path = path,
                            color = indicator,
                            style = Stroke(
                                width = 2.5f * (w / 12f),
                                cap = StrokeCap.Round,
                                join = StrokeJoin.Round,
                            ),
                        )
                    }
                }
            }
        }
    }
}

@Preview(name = "All states")
@Composable
private fun PreviewCheckbox() {
    SilknetTheme {
        Box(
            modifier = Modifier
                .background(Silknet.colors.backgroundLayer)
                .padding(24.dp)
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                CheckRow("Unchecked", false)
                CheckRow("Checked", true)
                CheckRow("Indeterminate", false, indeterminate = true)
                CheckRow("Error (unchecked)", false, isError = true)
                CheckRow("Disabled (unchecked)", false, enabled = false)
                CheckRow("Disabled (checked)", true, enabled = false)
                CheckRow("Disabled (indeterminate)", false, indeterminate = true, enabled = false)
            }
        }
    }
}

@Composable
private fun CheckRow(
    label: String,
    initial: Boolean,
    enabled: Boolean = true,
    isError: Boolean = false,
    indeterminate: Boolean = false,
) {
    var checked by remember { mutableStateOf(initial) }
    Row(verticalAlignment = Alignment.CenterVertically) {
        Text(label, style = Silknet.typography.bodyBodyDefault, color = Silknet.colors.textDefault,
             modifier = Modifier.width(220.dp))
        SilknetCheckbox(
            checked = checked,
            onCheckedChange = { checked = it },
            enabled = enabled,
            isError = isError,
            indeterminate = indeterminate,
        )
    }
}
