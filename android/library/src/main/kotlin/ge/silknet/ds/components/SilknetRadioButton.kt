// SilknetRadioButton — Compose mirror of iOS SilknetRadioButton.
// 18×18. Selected = primary-filled circle + 8.dp WHITE center punch
// (matches Figma SVG `<rect rx=9 fill=primary/><circle r=4 fill=white/>`).

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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.role
import androidx.compose.ui.semantics.selected
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import ge.silknet.ds.Silknet
import ge.silknet.ds.SilknetTheme

@Composable
fun SilknetRadioButton(
    selected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    isError: Boolean = false,
) {
    val boxFill: Color = when {
        !selected && isError -> Silknet.colors.backgroundSurface
        !selected && !enabled -> Silknet.colors.backgroundDisabled
        !selected -> Silknet.colors.backgroundLayer
        !enabled -> Silknet.colors.backgroundDisabled
        else -> Silknet.colors.backgroundPrimaryAccent
    }
    val borderColor: Color? = if (!selected) {
        if (isError) Silknet.colors.backgroundErrorAccent else Silknet.colors.borderDefault
    } else null

    Box(
        modifier = modifier
            .size(20.dp)
            .alpha(if (enabled) 1f else 0.5f)
            .clickable(enabled = enabled, onClick = onClick)
            .semantics {
                role = Role.RadioButton
                this.selected = selected
            },
        contentAlignment = Alignment.Center,
    ) {
        Box(
            modifier = Modifier
                .size(18.dp)
                .clip(CircleShape)
                .background(boxFill)
                .let { if (borderColor != null) it.border(1.dp, borderColor, CircleShape) else it },
            contentAlignment = Alignment.Center,
        ) {
            if (selected) {
                Box(
                    modifier = Modifier
                        .size(8.dp)
                        .clip(CircleShape)
                        .background(Color.White),
                )
            }
        }
    }
}

@Preview(name = "All states")
@Composable
private fun PreviewRadio() {
    SilknetTheme {
        Box(
            modifier = Modifier
                .background(Silknet.colors.backgroundLayer)
                .padding(24.dp)
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                RadioRow("Unselected", false)
                RadioRow("Selected", true)
                RadioRow("Error (unselected)", false, isError = true)
                RadioRow("Disabled (unselected)", false, enabled = false)
                RadioRow("Disabled (selected)", true, enabled = false)
            }
        }
    }
}

@Composable
private fun RadioRow(
    label: String,
    selected: Boolean,
    enabled: Boolean = true,
    isError: Boolean = false,
) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Text(label, style = Silknet.typography.bodyBodyDefault, color = Silknet.colors.textDefault,
             modifier = Modifier.width(220.dp))
        SilknetRadioButton(
            selected = selected,
            onClick = {},
            enabled = enabled,
            isError = isError,
        )
    }
}
