// The shaded law box under the assessments ("What the law asks of a small business")
// and under PPE ("PPE law"). Matches the prototype's .lawbox and box().
import { addPropertyControls, ControlType } from "framer"
import { JN, LAW } from "./lawData.tsx"
import { parseTopics, useJurisdiction } from "./jurisdiction.tsx"
import { LawLinks } from "./LawLinks.tsx"

type Props = {
    title: string
    topics: string
    ink: string
    sunk: string
    accent: string
    link: string
    font: any
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */
export default function LawBox(props: Props) {
    const { title, topics, ink, sunk, accent, link, font } = props
    const jur = useJurisdiction()
    return (
        <div aria-live="polite" style={{ width: "100%", boxSizing: "border-box", background: sunk, borderLeft: `6px solid ${accent}`, padding: "16px 19.2px", display: "grid", gap: 8, color: ink, fontSize: 16, lineHeight: 1.6, ...font }}>
            <b>{title + " in " + JN[jur]}</b>
            <ul style={{ margin: 0, paddingLeft: 17.6, display: "grid", gap: 4.8 }}>
                {parseTopics(topics).map((k) => (
                    <li key={k}>
                        {LAW[k][jur].t + " "}
                        <LawLinks links={LAW[k][jur].l} style={{ color: link }} />
                    </li>
                ))}
            </ul>
        </div>
    )
}

LawBox.defaultProps = {
    title: "What the law asks of a small business",
    topics: "risk,fire,coshh",
    ink: "#101A24",
    sunk: "#E6EBF1",
    accent: "#0A5CA8",
    link: "#0A5CA8",
}

addPropertyControls(LawBox, {
    title: { type: ControlType.String, title: "Title", defaultValue: "What the law asks of a small business" },
    topics: { type: ControlType.String, title: "Topics", defaultValue: "risk,fire,coshh" },
    ink: { type: ControlType.Color, title: "Ink", defaultValue: "#101A24" },
    sunk: { type: ControlType.Color, title: "Background", defaultValue: "#E6EBF1" },
    accent: { type: ControlType.Color, title: "Bar", defaultValue: "#0A5CA8" },
    link: { type: ControlType.Color, title: "Link", defaultValue: "#0A5CA8" },
    font: { type: ControlType.Font, title: "Font", controls: "extended", defaultFontType: "sans-serif" } as any,
})
