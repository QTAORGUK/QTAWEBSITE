// Header switch: Great Britain / N. Ireland / Ireland. Matches the prototype's .jur/.seg.
import { addPropertyControls, ControlType } from "framer"
import { setJurisdiction, useJurisdiction } from "./jurisdiction.tsx"
import type { Jurisdiction } from "./lawData.tsx"

const OPTIONS: [Jurisdiction, string][] = [
    ["gb", "Great Britain"],
    ["ni", "N. Ireland"],
    ["ie", "Ireland"],
]

type Props = {
    showLabel: boolean
    compact: boolean
    ink: string
    muted: string
    active: string
    activeInk: string
    font: any
    monoFont: any
}

/**
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function JurisdictionSwitch(props: Props) {
    const { showLabel, compact, ink, muted, active, activeInk, font, monoFont } = props
    const jur = useJurisdiction()
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", ...font }}>
            {showLabel && (
                <span id="qta-jurlabel" style={{ ...monoFont, fontSize: 11.8, letterSpacing: "0.09em", textTransform: "uppercase", color: muted }}>
                    Show the law for
                </span>
            )}
            <div role="group" aria-label="Show the law for" style={{ display: "flex", border: `1px solid ${muted}`, borderRadius: 3, overflow: "hidden" }}>
                {OPTIONS.map(([key, label]) => {
                    const on = key === jur
                    return (
                        <button
                            key={key}
                            type="button"
                            aria-pressed={on}
                            onClick={() => setJurisdiction(key)}
                            style={{
                                font: "inherit",
                                fontSize: compact ? 12.8 : 13.6,
                                fontWeight: 600,
                                background: on ? active : "transparent",
                                color: on ? activeInk : ink,
                                border: 0,
                                padding: compact ? "5.6px 8.8px" : "6.4px 11.2px",
                                cursor: "pointer",
                            }}
                        >
                            {label}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

JurisdictionSwitch.defaultProps = {
    showLabel: true,
    compact: false,
    ink: "#F2F5F8",
    muted: "#A9B6C4",
    active: "#F5B800",
    activeInk: "#1B1600",
}

addPropertyControls(JurisdictionSwitch, {
    showLabel: { type: ControlType.Boolean, title: "Label", defaultValue: true },
    compact: { type: ControlType.Boolean, title: "Compact", defaultValue: false },
    ink: { type: ControlType.Color, title: "Text", defaultValue: "#F2F5F8" },
    muted: { type: ControlType.Color, title: "Muted", defaultValue: "#A9B6C4" },
    active: { type: ControlType.Color, title: "Active", defaultValue: "#F5B800" },
    activeInk: { type: ControlType.Color, title: "Active text", defaultValue: "#1B1600" },
    font: { type: ControlType.Font, title: "Font", controls: "extended", defaultFontType: "sans-serif" } as any,
    monoFont: { type: ControlType.Font, title: "Label font", controls: "extended", defaultFontType: "monospace" } as any,
})
