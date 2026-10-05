// "Law in Great Britain: link · link · link" line. Used on the assessment cards and on
// every course card, where "Topics" is bound to the course's "Law topics" CMS field.
import { addPropertyControls, ControlType } from "framer"
import { JN } from "./lawData.tsx"
import { linksFor, parseTopics, useJurisdiction } from "./jurisdiction.tsx"
import { LawLinks } from "./LawLinks.tsx"

type Props = {
    topics: string
    dashedRule: boolean
    max: number
    muted: string
    link: string
    line: string
    font: any
    monoFont: any
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */
export default function LawCite(props: Props) {
    const { topics, dashedRule, max, muted, link, line, font, monoFont } = props
    const jur = useJurisdiction()
    const links = linksFor(parseTopics(topics), jur, max)
    if (!links.length) return null
    return (
        <p
            style={{
                margin: 0,
                width: "100%",
                ...font,
                fontSize: dashedRule ? 13.6 : 12.8,
                lineHeight: 1.6,
                color: link,
                ...(dashedRule && { borderTop: `1px dashed ${line}`, paddingTop: 9.6 }),
            }}
        >
            <span style={{ ...monoFont, fontSize: 11.8, letterSpacing: "0.09em", textTransform: "uppercase", color: muted }}>
                {"Law in " + JN[jur] + ": "}
            </span>
            <LawLinks links={links} />
        </p>
    )
}

LawCite.defaultProps = { topics: "risk", dashedRule: false, max: 3, muted: "#4E5C6B", link: "#0A5CA8", line: "#C9D2DC" }

addPropertyControls(LawCite, {
    topics: { type: ControlType.String, title: "Topics", defaultValue: "risk", description: "Comma-separated LAW keys, e.g. lifting,equip" },
    dashedRule: { type: ControlType.Boolean, title: "Card rule", defaultValue: false, description: "On for course cards" },
    max: { type: ControlType.Number, title: "Max links", defaultValue: 3, min: 1, max: 10, step: 1 },
    muted: { type: ControlType.Color, title: "Muted", defaultValue: "#4E5C6B" },
    link: { type: ControlType.Color, title: "Link", defaultValue: "#0A5CA8" },
    line: { type: ControlType.Color, title: "Line", defaultValue: "#C9D2DC" },
    font: { type: ControlType.Font, title: "Font", controls: "extended", defaultFontType: "monospace" } as any,
    monoFont: { type: ControlType.Font, title: "Label font", controls: "extended", defaultFontType: "monospace" } as any,
})
