// Inline list of law links separated by " · ", shared by the other law components.
import type { CSSProperties } from "react"
import type { LawLink } from "./lawData.tsx"

export function LawLinks({ links, style }: { links: LawLink[]; style?: CSSProperties }) {
    return (
        <>
            {links.map((x, i) => (
                <span key={x.n}>
                    {i > 0 && " · "}
                    <a href={x.u} target="_blank" rel="noopener" style={{ color: "inherit", textUnderlineOffset: 3, overflowWrap: "anywhere", ...style }}>
                        {x.n}
                    </a>
                </span>
            ))}
        </>
    )
}
