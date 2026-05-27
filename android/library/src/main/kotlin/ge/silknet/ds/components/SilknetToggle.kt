// SilknetToggle — Compose pill switch. Mirrors iOS SilknetToggle.
// 36×20 track, 16×16 white handle. OFF = backgroundToggleDefault.
// ON = backgroundSuccessAccent. Error = 1.dp red border. Disabled = 0.5 alpha.

package ge.silknet.ds.components

import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.role
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import ge.silknet.ds.Silknet
import ge.silknet.ds.SilknetTheme

@Composable
fun SilknetToggle(
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    isError: Boolean = false,
) {
    val trackBg = if (checked) Silknet.colors.backgroundSuccessAccent
                  else Silknet.colors.backgroundToggleDefault
    val handleOffset by animateDpAsState(
        targetValue = if (checked) 18.dp else 2.dp,
        animationSpec = tween(durationMillis = 150),
        label = "handleOffset",
    )

    Box(
        modifier = modifier
            .size(width = 36.dp, height = 20.dp)
            .clip(CircleShape)
            .alpha(if (enabled) 1f else 0.5f)
            .background(trackBg)
            .let {
                if (isError) it.border(1.dp, Silknet.colors.backgroundErrorAccent, CircleShape)
                else it
            }
            .clickable(enabled = enabled) { onCheckedChange(!checked) }
            .semantics {
                role = Role.Switch
                stateDescription = if (checked) "on" else "off"
            },
        contentAlignment = Alignment.CenterStart,
    ) {
        Box(
            modifier = Modifier
                .offset(x = handleOffset)
                .size(16.dp)
                .clip(CircleShape)
                .background(Color.White),
        )
    }
}

@Preview(name = "All states")
@Composable
private fun PreviewToggle() {
    SilknetTheme {
        Box(
            modifier = Modifier
                .background(Silknet.colors.backgroundLayer)
                .padding(24.dp)
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                ToggleRow("Off", initial = false)
                ToggleRow("On", initial = true)
                ToggleRow("Error (off)", initial = false, isError = true)
                ToggleRow("Disabled (off)", initial = false, enabled = false)
                ToggleRow("Disabled (on)", initial = true, enabled = false)
            }
        }
    }
}

@Composable
private fun ToggleRow(label: String, initial: Boolean, enabled: Boolean = true, isError: Boolean = false) {
    var checked by remember { mutableStateOf(initial) }
    Row(verticalAlignment = Alignment.CenterVertically) {
        Text(label, style = Silknet.typography.bodyBodyDefault, color = Silknet.colors.textDefault,
             modifier = Modifier.width(160.dp))
        SilknetToggle(
            checked = checked,
            onCheckedChange = { checked = it },
            enabled = enabled,
            isError = isError,
        )
    }
}
