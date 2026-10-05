# QTA Framer build: status

Source of truth: `source/FRAMER-BUILD-BRIEF.md` and `source/qta-site.html` (the approved prototype).

Nothing has been published and no domain is connected. Both wait for Dan's sign-off.

## Done in this repo

| Piece | Where | Notes |
|---|---|---|
| Jurisdiction data | `framer/code/lawData.tsx` | Generated from the prototype's `LAW` object by `scripts/extract.mjs`. Every link is unchanged; a test checks this. |
| Shared jurisdiction choice | `framer/code/jurisdiction.tsx` | One store for the whole page, remembered in the browser like the prototype (`qta-jur`). |
| Header switch | `framer/code/JurisdictionSwitch.tsx` | Great Britain / N. Ireland / Ireland. "Compact" and "Label" toggles for the phone breakpoint. |
| Law line on cards | `framer/code/LawCite.tsx` | "Law in …: link · link · link". On course cards, bind **Topics** to the CMS field **Law topics** and turn on **Card rule**. On assessment cards use `risk`, `fire`, `coshh`, `drain`. |
| Law boxes | `framer/code/LawBox.tsx` | Assessments: topics `risk,fire,coshh`, title "What the law asks of a small business". PPE: topics `ppe`, title "PPE law". |
| Regulations table | `framer/code/LawTable.tsx` | Intro line plus the full table, scrolling inside its own box on phones. |
| Courses CMS | `framer/cms/courses.json` / `.csv` | 16 courses: Name, Category, Description, Law topics. |
| Dates CMS | `framer/cms/dates.json` / `.csv` | 8 rows: Course, Window, Location, Status. All "DATE TBC". |
| Structured data | `framer/custom-code/head-end.html` | Organization and FAQPage JSON-LD; FAQ text taken word for word from the prototype. |
| Setup script | `scripts/framer-setup.ts` | Uploads the code files, 16 colour styles (light and dark), both CMS collections and the head code. Has no publish, deploy or domain calls. |
| Link check | `scripts/check-links.mjs` | Opens all 52 links and writes `framer/link-check.md`. |

Checks: `npm run check` (typecheck plus 14 tests that render each component for all three jurisdictions and compare its links with the prototype's).

## Blocked: needs access to Framer

This build container can't reach framer.com, legislation.gov.uk, hse.gov.uk or the other official sites (blocked by the environment's network policy). To continue:

1. Allow `framer.com`, `api.framer.com` and the official law sites in the environment's network settings, or switch it to full access.
2. In the Framer project: Settings → API Keys → create a key. Add it as the environment secret `FRAMER_API_KEY`, and the project link as `FRAMER_PROJECT_URL`.
3. Run `npm run framer:setup` and then `npm run check-links`.

## Still to build in Framer (after setup)

The setup script loads data, styles and components. The page layout comes next, using the canvas commands the script saves to `framer/agent/`, or by hand in the editor:

1. **Fonts and text styles.** Barlow Condensed 600/700 uppercase for H1/H2/H3, Public Sans for body, IBM Plex Mono for labels and citations.
2. **Sections 1–15 in the order the brief lists**, using the prototype's copy word for word. Header, hero and footer use the Band colours. Add the hazard stripe under the hero, use a 3px corner radius, put a 3px top rule on content blocks, and use the circle, triangle and square markers.
3. **Course filter.** Make a "Course grid" component with one variant per category plus All. Each variant holds a Collection List of Courses filtered to that category, and the filter buttons switch variants. Dan can edit courses in the CMS without touching the design. If he adds a new category, it needs a new option and a new variant.
4. **Dates table.** A Collection List of Dates in a table layout with a yellow "DATE TBC" badge bound to Status.
5. **Enquiry form.** A native Framer form sending to hello@qta.org.uk, with the 11 fields from the prototype. The "Course or service" options are the six assessment services, the 16 courses, "PPE waterproofs" and "Not sure yet". Drop the "copy your enquiry" panel.
6. **Responsive.** Phone breakpoint at 820px: the nav becomes one scrolling row under the wordmark and switch (switch set to Compact, no label), grids stack to one column, and tables scroll inside their own box.
7. **Site settings.** Page title "QTA Training & Assessment". Meta description: see below.

## Where Framer differs from the prototype (for Dan to OK)

- **"Enquire about this course" no longer pre-fills the form.** Framer's native form can't be pre-filled from a link, so the course and service buttons just jump to the form. The "Where is the work?" choice also no longer follows the header switch.
- **Meta description is new wording.** The prototype doesn't have one. Proposed, cut from the hero text: "QTA trains your people, assesses your premises and writes the documents your council, insurer and inspector ask for. Health and safety across the UK and Ireland."

## Before publishing (from the brief)

- [ ] Dan approves the Framer preview.
- [ ] Every regulation link opened once (`npm run check-links`). This matters most for the Great Britain legislation and HSE links, the Irish 2005 Act, the Fire Services Act 1981, BeSMART, EPA and Protect Our Water.
- [ ] Title, meta description and structured data in place.
- [ ] Dan says go before the site is published or qta.org.uk is connected.

## Still to come from Dan

Real course dates, testimonials, PPE product names, sizes and prices, UK PAAS and Compliancy Management UK logos and web addresses, phone number, photo, and confirmation of the course descriptions against the UK PAAS syllabuses.
