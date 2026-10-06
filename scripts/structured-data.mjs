// Builds framer/custom-code/head-end.html: Organization and FAQPage JSON-LD, with the
// FAQ questions and answers taken verbatim from the prototype.
//   node scripts/structured-data.mjs
import { readFileSync, writeFileSync } from "node:fs"

const root = new URL("..", import.meta.url)
const html = readFileSync(new URL("source/qta-site.html", root), "utf8")

export const TITLE = "QTA Training & Assessment"
export const DESCRIPTION =
    "QTA trains your people, assesses your premises and writes the documents your council, insurer and inspector ask for. Health and safety across the UK and Ireland."

const strip = (s) => s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
const faqSection = html.match(/<section id="faq"[\s\S]*?<\/section>/)[0]
export const FAQ = [...faqSection.matchAll(/<summary>([\s\S]*?)<\/summary><p>([\s\S]*?)<\/p>/g)].map((m) => ({
    q: strip(m[1]),
    a: strip(m[2]),
}))

const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: TITLE,
    alternateName: "QTA",
    url: "https://qta.org.uk/",
    email: "hello@qta.org.uk",
    description: DESCRIPTION,
    founder: { "@type": "Person", name: "Dan Wild" },
    areaServed: [
        { "@type": "Country", name: "United Kingdom" },
        { "@type": "Country", name: "Ireland" },
    ],
}

const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
    })),
}

const tag = (obj) => `<script type="application/ld+json">\n${JSON.stringify(obj, null, 2).replace(/</g, "\\u003c")}\n</script>`

if (import.meta.url === `file://${process.argv[1]}`) {
    writeFileSync(new URL("framer/custom-code/head-end.html", root), tag(organization) + "\n" + tag(faqPage) + "\n")
    console.log(`FAQ entries: ${FAQ.length}`)
}
