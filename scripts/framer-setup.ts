// Loads the QTA build into a Framer project through the Framer Server API:
// code components, colour styles, the Courses and Dates CMS collections and the
// head custom code (JSON-LD). Safe to re-run: it updates what it created before.
//
// It never publishes, deploys or touches domains. Those wait for Dan's sign-off.
//
//   FRAMER_PROJECT_URL=https://framer.com/projects/... FRAMER_API_KEY=... npm run framer:setup
//   add --dry-run to print the plan without connecting.
import { readFileSync, readdirSync, writeFileSync } from "node:fs"
import { connect, type Collection, type Field, type Framer } from "framer-api"

const root = new URL("..", import.meta.url)
const read = (p: string) => readFileSync(new URL(p, root), "utf8")
const dryRun = process.argv.includes("--dry-run")
const log = (...a: unknown[]) => console.log(...a)

// Light and dark values from the prototype's :root and dark blocks.
const COLORS: [string, string, string][] = [
    ["QTA/Background", "#F2F5F8", "#0D151D"],
    ["QTA/Surface", "#FFFFFF", "#15202B"],
    ["QTA/Sunk", "#E6EBF1", "#1C2A37"],
    ["QTA/Ink", "#101A24", "#EAF0F5"],
    ["QTA/Muted", "#4E5C6B", "#9FB0C0"],
    ["QTA/Line", "#C9D2DC", "#2E3F50"],
    ["QTA/Blue", "#0A5CA8", "#2E86D6"],
    ["QTA/Blue ink", "#FFFFFF", "#06121D"],
    ["QTA/Yellow", "#F5B800", "#F5B800"],
    ["QTA/Yellow ink", "#1B1600", "#1B1600"],
    ["QTA/Green", "#0F7A4D", "#35B37E"],
    ["QTA/Red", "#B3261E", "#F0766E"],
    ["QTA/Link", "#0A5CA8", "#6DB3F2"],
    ["QTA/Band", "#101A24", "#060C12"],
    ["QTA/Band ink", "#F2F5F8", "#EAF0F5"],
    ["QTA/Band muted", "#A9B6C4", "#9FB0C0"],
]

type Course = { slug: string; name: string; category: string; description: string; lawTopics: string; order: number }
type DateRow = { slug: string; course: string; window: string; location: string; status: string; order: number }
const courses: Course[] = JSON.parse(read("framer/cms/courses.json"))
const dates: DateRow[] = JSON.parse(read("framer/cms/dates.json"))
const categories = [...new Set(courses.map((c) => c.category))]
const codeFiles = readdirSync(new URL("framer/code", root)).filter((f) => f.endsWith(".tsx"))

async function upsertCodeFiles(framer: Framer) {
    for (const name of codeFiles) {
        const code = read(`framer/code/${name}`)
        const existing = await framer.getCodeFile(name)
        if (existing) {
            if (existing.content !== code) await existing.setFileContent(code)
            log(`code: updated ${name}`)
        } else {
            await framer.createCodeFile(name, code)
            log(`code: created ${name}`)
        }
    }
}

async function upsertColors(framer: Framer) {
    const existing = await framer.getColorStyles()
    for (const [name, light, dark] of COLORS) {
        const style = existing.find((s) => s.name === name || s.path === name)
        if (style) await style.setAttributes({ light, dark })
        else await framer.createColorStyle({ name, light, dark })
        log(`color: ${name}`)
    }
}

async function collection(framer: Framer, name: string, fields: Parameters<Collection["addFields"]>[0]) {
    const all = await framer.getCollections()
    const col = all.find((c) => c.name === name) ?? (await framer.createCollection(name))
    const have = await col.getFields()
    const missing = fields.filter((f) => !have.some((h) => same(h.name, f.name)))
    if (missing.length) await col.addFields(missing)
    return { col, fields: await col.getFields() }
}

// Field names are matched loosely: the project may already hold "Law Topics" for "Law topics".
const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase()

function byName(fields: Field[], name: string) {
    const f = fields.find((x) => same(x.name, name))
    if (!f) throw new Error(`Field "${name}" missing`)
    return f
}

// Adds only the items not already in the collection, matched on the text of the key
// fields rather than the slug (items imported by hand get different slugs). Existing
// items are never overwritten, so edits Dan makes in the Framer CMS survive a re-run.
export async function addMissingItems(
    col: Collection,
    keyFieldIds: string[],
    items: { slug: string; fieldData: Record<string, { type: string; value: string }> }[]
) {
    const key = (fd: Record<string, any>) => keyFieldIds.map((id) => String(fd[id]?.value ?? "").trim().toLowerCase()).join("|")
    const existing = new Set((await col.getItems()).map((e) => key(e.fieldData)))
    const slugs = new Set((await col.getItems()).map((e) => e.slug))
    const missing = items.filter((it) => !existing.has(key(it.fieldData)) && !slugs.has(it.slug))
    if (missing.length) await col.addItems(missing as any)
    return missing.length
}

async function setupCourses(framer: Framer) {
    const { col, fields } = await collection(framer, "Courses", [
        { type: "string", name: "Name" },
        { type: "enum", name: "Category", cases: categories.map((name) => ({ name })) },
        { type: "string", name: "Description" },
        { type: "string", name: "Law topics" },
    ])
    const name = byName(fields, "Name")
    const cat = byName(fields, "Category")
    const desc = byName(fields, "Description")
    const topics = byName(fields, "Law topics")
    if (cat.type !== "enum") throw new Error("Category must be an option field")
    const caseId = (n: string) => {
        const c = cat.cases.find((x) => same(x.name, n))
        if (!c) throw new Error(`Category option "${n}" missing; add it in Framer and re-run`)
        return c.id
    }
    const added = await addMissingItems(
        col,
        [name.id],
        courses.map((c) => ({
            slug: c.slug,
            fieldData: {
                [name.id]: { type: "string", value: c.name },
                [cat.id]: { type: "enum", value: caseId(c.category) },
                [desc.id]: { type: "string", value: c.description },
                [topics.id]: { type: "string", value: c.lawTopics },
            },
        }))
    )
    log(`cms: Courses, ${added} added, ${courses.length - added} already there`)
}

async function setupDates(framer: Framer) {
    const { col, fields } = await collection(framer, "Dates", [
        { type: "string", name: "Course" },
        { type: "string", name: "Window" },
        { type: "string", name: "Location" },
        { type: "string", name: "Status" },
    ])
    const f = (n: string) => byName(fields, n).id
    const added = await addMissingItems(
        col,
        [f("Course"), f("Window")],
        dates.map((d) => ({
            slug: d.slug,
            fieldData: {
                [f("Course")]: { type: "string", value: d.course },
                [f("Window")]: { type: "string", value: d.window },
                [f("Location")]: { type: "string", value: d.location },
                [f("Status")]: { type: "string", value: d.status },
            },
        }))
    )
    log(`cms: Dates, ${added} added, ${dates.length - added} already there`)
}

async function main() {
    if (dryRun) {
        log("Plan (dry run, nothing sent):")
        log(`  code files: ${codeFiles.join(", ")}`)
        log(`  colour styles: ${COLORS.length}`)
        log(`  Courses: ${courses.length} items in ${categories.length} categories (${categories.join(", ")})`)
        log(`  Dates: ${dates.length} items`)
        log("  custom code: head end, Organization + FAQPage JSON-LD")
        log("  agent prompt and project context saved to framer/agent/")
        log("  NOT done: publish, deploy, domains")
        return
    }
    const url = process.env.FRAMER_PROJECT_URL
    if (!url || !process.env.FRAMER_API_KEY) throw new Error("Set FRAMER_PROJECT_URL and FRAMER_API_KEY")
    const framer = await connect(url, process.env.FRAMER_API_KEY)
    try {
        log(`connected: ${(await framer.getProjectInfo()).name}`)
        await upsertCodeFiles(framer)
        await upsertColors(framer)
        await setupCourses(framer)
        await setupDates(framer)
        await framer.setCustomCode({ location: "headEnd", html: read("framer/custom-code/head-end.html") })
        log("custom code: head end set")
        // The canvas command syntax is only documented by the API itself; keep a copy
        // so the page layout can be written against it.
        writeFileSync(new URL("framer/agent/system-prompt.txt", root), await framer.agent.getSystemPrompt())
        writeFileSync(new URL("framer/agent/project-context.txt", root), await framer.agent.getContext())
        log("agent docs saved to framer/agent/")
    } finally {
        await framer.disconnect()
    }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch((e) => {
        console.error(e)
        process.exit(1)
    })
}
