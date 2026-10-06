// Checks the Framer components against the prototype: same data, same links per
// jurisdiction, and every component follows the shared switch.
import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { JSDOM } from "jsdom"
import { act } from "react"
import { createRoot } from "react-dom/client"
// @ts-ignore plain JS helper
import { loadPrototypeData } from "../scripts/extract.mjs"
import { JN, LAW, type Jurisdiction } from "../framer/code/lawData.tsx"
import { setJurisdiction, parseTopics } from "../framer/code/jurisdiction.tsx"
import LawCite from "../framer/code/LawCite.tsx"
import LawBox from "../framer/code/LawBox.tsx"
import LawTable from "../framer/code/LawTable.tsx"
import JurisdictionSwitch from "../framer/code/JurisdictionSwitch.tsx"

const proto = JSON.parse(JSON.stringify(loadPrototypeData()))

const dom = new JSDOM("<!doctype html><div id=root></div>", { url: "https://qta.org.uk/" })
Object.assign(globalThis, { window: dom.window, document: dom.window.document, IS_REACT_ACT_ENVIRONMENT: true })
const JURS: Jurisdiction[] = ["gb", "ni", "ie"]
const hrefs = (html: string) => [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, "&"))

// The prototype's lawLine(): links for the topics, de-duplicated by name, first three.
function protoLawLine(keys: string[], jur: Jurisdiction) {
    const seen: Record<string, 1> = {}
    const all: { n: string; u: string }[] = []
    keys.forEach((k) => proto.LAW[k][jur].l.forEach((x: any) => { if (!seen[x.n]) { seen[x.n] = 1; all.push(x) } }))
    return all.slice(0, 3).map((x) => x.u)
}

// Render in a DOM so the components read the live store, as they do in the browser.
function render(el: JSX.Element, jur: Jurisdiction) {
    const host = document.createElement("div")
    const root = createRoot(host)
    act(() => root.render(el))
    act(() => setJurisdiction(jur))
    const html = host.innerHTML
    act(() => root.unmount())
    return html
}

test("generated law data matches the prototype exactly", () => {
    assert.deepEqual(LAW, proto.LAW)
    assert.deepEqual(JN, proto.JN)
})

test("CMS courses match the prototype COURSES array", () => {
    const courses = JSON.parse(readFileSync(new URL("../framer/cms/courses.json", import.meta.url), "utf8"))
    assert.equal(courses.length, 16)
    courses.forEach((c: any, i: number) => {
        const p = proto.COURSES[i]
        assert.equal(c.name, p.n)
        assert.equal(c.category, p.c)
        assert.equal(c.description, p.d)
        assert.deepEqual(parseTopics(c.lawTopics), p.k)
    })
})

test("dates keep their TBC status", () => {
    const dates = JSON.parse(readFileSync(new URL("../framer/cms/dates.json", import.meta.url), "utf8"))
    assert.equal(dates.length, 8)
    dates.forEach((d: any) => assert.equal(d.status, "DATE TBC"))
})

for (const jur of JURS) {
    test(`course card law line matches the prototype for ${jur}`, () => {
        for (const c of proto.COURSES) {
            const html = render(<LawCite {...(LawCite as any).defaultProps} topics={c.k.join(",")} dashedRule />, jur)
            assert.deepEqual(hrefs(html), protoLawLine(c.k, jur), c.n)
            assert.ok(html.includes("Law in " + JN[jur] + ": "))
        }
    })

    test(`assessment and PPE law boxes match the prototype for ${jur}`, () => {
        const html = render(<LawBox {...(LawBox as any).defaultProps} topics="risk,fire,coshh" />, jur)
        assert.ok(html.includes("What the law asks of a small business in " + JN[jur]))
        assert.deepEqual(hrefs(html), ["risk", "fire", "coshh"].flatMap((k) => proto.LAW[k][jur].l.map((x: any) => x.u)))
        const ppe = render(<LawBox {...(LawBox as any).defaultProps} title="PPE law" topics="ppe" />, jur)
        assert.ok(ppe.includes("PPE law in " + JN[jur]))
        assert.deepEqual(hrefs(ppe), proto.LAW.ppe[jur].l.map((x: any) => x.u))
    })

    test(`regulations table lists every topic and link for ${jur}`, () => {
        const html = render(<LawTable {...(LawTable as any).defaultProps} />, jur)
        assert.ok(html.includes("Showing the law for " + JN[jur] + "."))
        assert.deepEqual(hrefs(html), Object.keys(proto.LAW).flatMap((k) => proto.LAW[k][jur].l.map((x: any) => x.u)))
        assert.equal((html.match(/<tr>/g) || []).length, Object.keys(proto.LAW).length + 1)
    })
}

test("switch marks exactly the selected jurisdiction as pressed", () => {
    const html = render(<JurisdictionSwitch {...(JurisdictionSwitch as any).defaultProps} />, "ni")
    assert.equal((html.match(/aria-pressed="true"/g) || []).length, 1)
    assert.match(html, /aria-pressed="true"[^>]*>N\. Ireland</)
})

test("unknown CMS topics are ignored rather than crashing", () => {
    assert.deepEqual(parseTopics("lifting, nope ,equip"), ["lifting", "equip"])
    assert.equal(render(<LawCite {...(LawCite as any).defaultProps} topics="nope" />, "gb"), "")
})
