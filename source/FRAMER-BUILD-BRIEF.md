# QTA website: Framer build brief

Build the QTA site (qta.org.uk) in Framer from `qta-site.html` in this folder. That file is the approved prototype: one self-contained page with all copy, structure, styles and data. Treat it as the source of truth for wording and layout. Do not rewrite the copy.

## The business
- QTA is a training, survey and assessment company. Owner: Dan Wild. Contact: hello@qta.org.uk
- Three arms: Train (courses), Assess (risk, fire, COSHH assessments and surveys), Protect (PPE waterproofs)
- Accreditation partner: UK PAAS. Regulated by UK PAAS and Compliancy Management UK
- Covers all of the UK and Ireland

## Design tokens (from the `:root` block in the prototype)
- Fonts: Barlow Condensed (headings, uppercase, 600/700), Public Sans (body), IBM Plex Mono (labels, citations)
- Light: background #F2F5F8, surface #FFFFFF, sunk #E6EBF1, ink #101A24, muted #4E5C6B, line #C9D2DC
- Signal colours: blue #0A5CA8 (training), yellow #F5B800 with ink #1B1600 (assessments, primary button), green #0F7A4D (PPE), red #B3261E (fire)
- Dark band (header, hero, footer): #101A24 with text #F2F5F8 and muted #A9B6C4
- Dark theme values are in the prototype's dark blocks
- Motifs: blue circle, yellow triangle and green square as section markers; one yellow and dark hazard stripe under the hero; 3px corner radius; thick top rule on content blocks instead of boxed cards

## Sections, in order
1. Sticky header: QTA wordmark, section links, jurisdiction switch
2. Hero: "Safe on site. Right on paper." with three buttons and the Train / Assess / Protect list
3. Accreditation strip
4. What is QTA
5. Assessments and surveys (the heaviest section): who it is for, five services, four-step visit, the law
6. Courses: 16 cards with category filter
7. Upcoming dates table (all marked TBC)
8. Become an instructor: five steps
9. PPE: three features, label standards table, PPE law
10. The law: regulations table
11. Competence: Dan Wild, how to check a provider, accreditation
12. Testimonials: three reserved spaces
13. FAQ
14. Enquiry form
15. Footer

## Things that need real Framer features
- **Jurisdiction switch (Great Britain / Northern Ireland / Ireland).** This is the main feature. It changes the regulation shown on every course card, the assessment and PPE law boxes and the regulations table. In the prototype it is driven by the `LAW` object in the script. In Framer, build it as a code component or override holding the same data, with the choice shared across the page. Keep every link exactly as in `LAW`.
- **Courses.** Put the `COURSES` array into a CMS collection (name, category, description, law topics) so Dan can edit courses and add dates without touching the design. Category filter on the list.
- **Dates.** A second CMS collection: course, window, location, status.
- **Enquiry form.** Use Framer's native form, sending to hello@qta.org.uk. Fields as in the prototype: enquiry type, jurisdiction, name, business, email, phone, course or service, town or postcode, number of people or premises, preferred month, notes. The prototype's "copy your enquiry" panel is only a stand-in; drop it.
- **Responsive.** On phones the nav becomes one scrolling row under the wordmark and switch; grids stack to one column; tables scroll inside their own container.

## Rules for the content
- Do not invent testimonials. The three spaces stay marked as reserved until Dan supplies real ones.
- Do not name Gore-Tex or any other brand in the PPE section.
- Do not describe the Construction Safety Pass (CSP) as SOLAS Safe Pass or a CSR card. It is QTA's own accredited course.
- Do not claim IPAF, RTITB, CITB or any scheme other than UK PAAS.
- Dates are placeholders. Keep the TBC badges.
- Do not add durations, prices or product names that are not in the prototype.

## Still to come from Dan
Real course dates, testimonials, PPE product names, sizes and prices, UK PAAS and Compliancy Management UK logos and web addresses, phone number, photo, confirmation of the course descriptions against the UK PAAS syllabuses.

## Before publishing
- Check with Dan before connecting the qta.org.uk domain or publishing live.
- Open every regulation link once. The Northern Ireland and most Irish legislation links were checked; the Great Britain legislation and HSE links, the Irish 2005 Act, Fire Services Act 1981, BeSMART, EPA and Protect Our Water links were not.
- Set page title "QTA Training & Assessment", a meta description, and Organization and FAQ structured data.
