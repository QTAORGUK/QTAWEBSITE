// Opens every regulation and source link once, as the brief asks before publishing.
//   node scripts/check-links.mjs        -> prints a table and writes framer/link-check.md
import { readFileSync, writeFileSync } from "node:fs"
import { loadPrototypeData } from "./extract.mjs"

const root = new URL("..", import.meta.url)
const { LAW } = loadPrototypeData()
const html = readFileSync(new URL("source/qta-site.html", root), "utf8")

const urls = new Map()
for (const [topic, t] of Object.entries(LAW))
    for (const j of ["gb", "ni", "ie"])
        for (const l of t[j].l) if (!urls.has(l.u)) urls.set(l.u, `${l.n} (${topic}/${j})`)
for (const m of html.matchAll(/<a href="(https?:[^"]+)">([^<]+)<\/a>/g)) if (!urls.has(m[1])) urls.set(m[1], `${m[2]} (footer)`)

async function check(u) {
    for (const method of ["HEAD", "GET"]) {
        try {
            const r = await fetch(u, { method, redirect: "follow", signal: AbortSignal.timeout(20000), headers: { "user-agent": "Mozilla/5.0 QTA link check" } })
            if (r.ok || method === "GET") return { status: r.status, final: r.url !== u ? r.url : "" }
        } catch (e) {
            if (method === "GET") return { status: "error", final: String(e.cause?.code || e.message) }
        }
    }
}

const rows = []
for (const [u, label] of urls) {
    const r = await check(u)
    rows.push({ u, label, ...r })
    console.log(`${r.status}\t${label}\t${u}${r.final ? "  -> " + r.final : ""}`)
}
const bad = rows.filter((r) => r.status !== 200)
writeFileSync(
    new URL("framer/link-check.md", root),
    `# Link check, ${new Date().toISOString().slice(0, 10)}\n\n${rows.length} links, ${bad.length} not returning 200.\n\n| Status | Link | URL | Redirects to |\n|---|---|---|---|\n` +
        rows.map((r) => `| ${r.status} | ${r.label} | ${r.u} | ${r.final} |`).join("\n") + "\n"
)
process.exitCode = bad.length ? 1 : 0
