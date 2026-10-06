// "The law, with the links": intro line plus the full regulations table, scrolling
// inside its own container on phones. Matches the prototype's #lawintro and #lawtable.
import { addPropertyControls, ControlType } from "framer"
import { JN, LAW } from "./lawData.tsx"
import { useJurisdiction } from "./jurisdiction.tsx"
import { LawLinks } from "./LawLinks.tsx"

type Props = {
    showIntro: boolean
    ink: string
    muted: string
    surface: string
    sunk: string
    line: string
    link: string
    font: any
    monoFont: any
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */
export default function LawTable(props: Props) {
    const { showIntro, ink, muted, surface, sunk, line, link, font, monoFont } = props
    const jur = useJurisdiction()
    const cell = { textAlign: "left", padding: "11.2px 14.4px", borderBottom: `1px solid ${line}`, verticalAlign: "top" } as const
    const keys = Object.keys(LAW)
    return (
        <div style={{ width: "100%", display: "grid", gap: 25.6, color: ink, ...font }}>
            {showIntro && (
                <p style={{ margin: 0, fontSize: 18.4, lineHeight: 1.6, maxWidth: "62ch", color: muted }}>
                    {"Showing the law for " + JN[jur] + ". Change it with the switch at the top of the page. Every link goes to the legislation itself or to the regulator."}
                </p>
            )}
            <div style={{ overflowX: "auto", border: `1px solid ${line}`, background: surface }}>
                <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 608, fontSize: 15, lineHeight: 1.6 }}>
                    <thead>
                        <tr>
                            {["Topic", "What it requires, in plain terms", "Legislation and official guidance"].map((h) => (
                                <th key={h} style={{ ...cell, ...monoFont, fontSize: 11.5, letterSpacing: "0.09em", textTransform: "uppercase", color: muted, fontWeight: 500, background: sunk }}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {keys.map((k, i) => {
                            const td = i === keys.length - 1 ? { ...cell, borderBottom: 0 } : cell
                            return (
                                <tr key={k}>
                                    <td style={td}>{LAW[k].label}</td>
                                    <td style={td}>{LAW[k][jur].t}</td>
                                    <td style={td}>
                                        <LawLinks links={LAW[k][jur].l} style={{ color: link }} />
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

LawTable.defaultProps = { showIntro: true, ink: "#101A24", muted: "#4E5C6B", surface: "#FFFFFF", sunk: "#E6EBF1", line: "#C9D2DC", link: "#0A5CA8" }

addPropertyControls(LawTable, {
    showIntro: { type: ControlType.Boolean, title: "Intro line", defaultValue: true },
    ink: { type: ControlType.Color, title: "Ink", defaultValue: "#101A24" },
    muted: { type: ControlType.Color, title: "Muted", defaultValue: "#4E5C6B" },
    surface: { type: ControlType.Color, title: "Surface", defaultValue: "#FFFFFF" },
    sunk: { type: ControlType.Color, title: "Header", defaultValue: "#E6EBF1" },
    line: { type: ControlType.Color, title: "Line", defaultValue: "#C9D2DC" },
    link: { type: ControlType.Color, title: "Link", defaultValue: "#0A5CA8" },
    font: { type: ControlType.Font, title: "Font", controls: "extended", defaultFontType: "sans-serif" } as any,
    monoFont: { type: ControlType.Font, title: "Header font", controls: "extended", defaultFontType: "monospace" } as any,
})
