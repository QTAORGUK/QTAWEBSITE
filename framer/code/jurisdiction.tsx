// Shared "which law applies" choice. Every law-aware component on the page reads
// this one store, so flipping the header switch updates them all together.
import { useSyncExternalStore } from "react"
import { JN, LAW, type Jurisdiction, type LawLink } from "./lawData.tsx"

const KEY = "qta-jur"
const listeners = new Set<() => void>()

function readSaved(): Jurisdiction {
    try {
        const s = window.localStorage.getItem(KEY)
        if (s && s in JN) return s as Jurisdiction
    } catch {}
    return "gb"
}

let current: Jurisdiction = typeof window === "undefined" ? "gb" : readSaved()

export function setJurisdiction(j: Jurisdiction) {
    if (j === current) return
    current = j
    try {
        window.localStorage.setItem(KEY, j)
    } catch {}
    listeners.forEach((fn) => fn())
}

function subscribe(fn: () => void) {
    listeners.add(fn)
    return () => listeners.delete(fn)
}

export function useJurisdiction(): Jurisdiction {
    return useSyncExternalStore(subscribe, () => current, () => "gb")
}

// "lifting, equip" -> ["lifting", "equip"], ignoring unknown keys so a CMS typo
// shows fewer links rather than crashing the card.
export function parseTopics(topics: string): string[] {
    return topics
        .split(/[\s,]+/)
        .map((k) => k.trim())
        .filter((k) => k in LAW)
}

// Links for several topics, de-duplicated by name, as the prototype's lawLine().
export function linksFor(keys: string[], jur: Jurisdiction, max = Infinity): LawLink[] {
    const seen = new Set<string>()
    const all: LawLink[] = []
    keys.forEach((k) =>
        LAW[k][jur].l.forEach((x) => {
            if (!seen.has(x.n)) {
                seen.add(x.n)
                all.push(x)
            }
        })
    )
    return all.slice(0, max)
}
