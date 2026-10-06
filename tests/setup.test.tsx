// The CMS step must not duplicate items already in Framer (Dan's project was loaded by
// hand, with different slugs) and must never overwrite them.
import { test } from "node:test"
import assert from "node:assert/strict"
import { addMissingItems } from "../scripts/framer-setup.ts"

function fakeCollection(items: { id: string; slug: string; fieldData: Record<string, any> }[]) {
    const added: any[] = []
    return {
        added,
        col: {
            getItems: async () => items,
            addItems: async (input: any[]) => void added.push(...input),
        } as any,
    }
}

const s = (value: string) => ({ type: "string", value })

test("matches existing items by name, not slug, and leaves them alone", async () => {
    const { col, added } = fakeCollection([
        { id: "1", slug: "construction-safety-pass-(csp)", fieldData: { name: s("Construction Safety Pass (CSP)"), desc: s("QTA’s edited text") } },
    ])
    const n = await addMissingItems(col, ["name"], [
        { slug: "construction-safety-pass-csp", fieldData: { name: s("Construction Safety Pass (CSP)"), desc: s("QTA's accredited…") } },
        { slug: "telehandler", fieldData: { name: s("Telehandler"), desc: s("Load charts…") } },
    ])
    assert.equal(n, 1)
    assert.deepEqual(added.map((a) => a.slug), ["telehandler"])
})

test("dates are matched on course and window together", async () => {
    const { col, added } = fakeCollection([
        { id: "1", slug: "basic-instructor", fieldData: { c: s("Basic instructor"), w: s("January 2027") } },
    ])
    await addMissingItems(col, ["c", "w"], [
        { slug: "basic-instructor-january-2027", fieldData: { c: s("Basic instructor"), w: s("January 2027") } },
        { slug: "basic-instructor-june-2027", fieldData: { c: s("Basic instructor"), w: s("June 2027") } },
    ])
    assert.deepEqual(added.map((a) => a.slug), ["basic-instructor-june-2027"])
})

test("nothing is sent when everything is already there", async () => {
    const { col, added } = fakeCollection([{ id: "1", slug: "x", fieldData: { name: s("Telehandler") } }])
    assert.equal(await addMissingItems(col, ["name"], [{ slug: "telehandler", fieldData: { name: s("telehandler ") } }]), 0)
    assert.equal(added.length, 0)
})
