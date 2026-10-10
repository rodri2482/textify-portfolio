# Textify — Design System

> **Superseded in part.** The "Elevation & Depth" rule below (flat surfaces,
> no blur, no shadow, 0px radius) described the original editorial system and
> no longer describes the build. The site now runs a dark-navy canvas with a
> Liquid Glass treatment, defined in `liquid.css`. See **Liquid glass** below.

## Purpose
An independent ecommerce design portfolio pairing expressive portrait motion with editorial project pages. The supplied monochrome founder portrait is the identity anchor, cut out for layering while preserving facial identity. The broad page rhythm takes inspiration from Goodly Consult; the palette, portrait composition, copy, and work presentation are Textify's own.

## Color
- Paper: `#F4F1E9` — warm off-white canvas
- White: `#FCF9F1` — quiet project surfaces
- Ink: `#101116` — primary type and immersive hero
- Cobalt: `#455CF7` — action, emphasis, and signature detail
- Lavender: `#CBD2FF` and `#DFE3F8` — luminous accents
- Hairline: `#D6D4CC` — borders and rules

## Typography
- Headline: Space Grotesk, medium weight, tight tracking, large editorial scale
- Body: DM Sans, regular to medium
- Italic accent: Playfair Display italic
- Labels: Space Grotesk bold uppercase, 10–11px, wide tracking

## Composition
- A dark full-width hero with a subtle gradient behind a transparent founder portrait.
- Plenty of negative space with strong horizontal rules.
- Six selected projects in alternating editorial image scales using actual store photography.
- A full-width lavender statement and dark contact section for pacing.
- Thin borders, perspective hover movement, scroll reveals, and restrained iconography.

## Interaction
- Mobile menu with clear focus and touch targets.
- Filterable portfolio cards; each card opens a concise case study and links to the live store.
- Expandable service and FAQ rows.
- Validated inquiry form that opens a draft addressed to `testimonyakinbinu490@gmail.com`.
- Gentle portrait float, project-card perspective tilt, and scroll reveals.
- Keyboard support and reduced-motion behavior.

## Depth
Depth is CSS perspective and Z-offsets only — no WebGL, no extra payload, and it degrades to flat layout wherever transforms are unsupported. Per the Stitch design system's *Architectural Planar Depth* rule, depth is **scroll parallax only**; interaction states stay flat and signal through colour, borders and 1px offset blocks rather than lift, tilt or blurred shadows.

- The hero is a six-plane scene: background grid recedes to `-100px`, side type to `-60px`, while the copy (`+24px`), portrait label (`+40px`) and portrait (`+50px`) step forward.
- The portrait also drifts vertically as the hero scrolls, driven by a `--vp` custom property that `app.js` publishes per section (0 as it enters from below, 1 as it leaves the top). One rect read per section per frame, coalesced into a single `requestAnimationFrame`.
- Hover feedback is deliberately non-dimensional: project cards deepen an existing hard shadow, process cards toggle surface colour, service rows shift padding and rotate the arrow, form fields take a 2px cobalt bottom border.
- `--depth` scales every parallax and Z term, so `prefers-reduced-motion` switches the whole scene off in one place.

## Content integrity
Only the six user-supplied sites are shown as live portfolio work: Ecoraftt, LauraVogue, Dewlip, Alma Valenti, Renova Fashion, and Peter Oliveira. No unverified statistics, testimonials, or fabricated client results. The static contact form opens an email draft; it does not send by itself.

The home page carries a word-of-mouth section, and it ships **empty on purpose**: the quote block is an explicit, bracketed placeholder, not an invented testimonial. It stays a placeholder until a real client quote — in writing, with name and brand — is dropped in; publishing fabricated social proof would breach this rule.

## Liquid glass
The current visual layer. It lives entirely in `liquid.css`, loaded last, so the whole aesthetic reverts by deleting a single `<link>`.

- **Canvas:** deep navy (`#0b1020`) with a radial lift toward `#22375f` and a faint 64px grid. The move off warm paper is what makes the glass legible — dark translucency over cream composited to a muddy brown.
- **Palette:** `--ink` flips from near-black to near-white so every `color:var(--ink)` site becomes light text in one move; the six places that used `--ink` as a *background* are re-pinned to `--ink-surface`.
- **Two glass variants.** Pale glass (`--glass-bg`) floats over light content; dark glass (`--glass-dark-bg`) is used wherever the section is near-black — announcement bar, contact form, footer chips. Pale glass behind light label text is unreadable, so these are not interchangeable.
- **Glass never overrides brand colour.** `.header-cta`, `.button-dark`, `.button-blue` and `.cs-discuss` are deliberately excluded from the glass primitive; they keep their fill and gain only the lit top edge and lift.
- **Specular sheen** (`--glass-spec`) plus an inset top highlight is what reads as glass rather than blur.
- **Backdrop roots:** an ancestor with `opacity < 1`, `filter`, `mask` or `will-change` on those truncates a child's `backdrop-filter`. The scroll reveal therefore animates `blur`, never `opacity`, so at rest the backdrop root is gone and the glass actually blurs.
- **Fallback:** without `backdrop-filter` support the tokens drop to an opaque fill, so contrast never degrades to translucent-on-photography.

## Third pass — the 2026 refinement

The newest block, at the end of `liquid.css`. Additive like the layer around it: delete the block and the site returns to the second-pass material with nothing else to change.

- **Foundation.** `--font-mono` and `--glass-accent` were referenced by the rail counter, the case-study spec list and the approach icons but never declared, so all three resolved to the initial value and fell back to the body face. Both are now declared. `color-scheme: dark` reaches the last of the light browser chrome — select popups, the date picker, autofill.
- **Type.** The display italic (`em` in every headline, the case-study statement, the spec word) is a gradient clipped to the text rather than a flat periwinkle. Headlines are balanced. Section eyebrows are chips. The eyebrow rule had been repinned to `--ink-surface` by the navy block — the canvas colour — which made it 26px of invisible; it is a gradient that fades out instead.
- **Hero.** An aurora field and a pointer spotlight, both pseudo-elements on `.hero-v2`, so the atmosphere costs no markup. The aurora sits above the receding grid and below the portrait; the spotlight is painted from two custom properties `app.js` writes on the hero, at most one rect read per frame, and never on a touch device. The portrait gains a cool rim light. An availability chip sits with the hero actions.
- **Chrome.** A 2px reading-progress hairline above the sticky pill, and a ticker that is a hairlined, edge-masked strip rather than an opaque band cutting the page in two.
- **Rail.** The progress bar is cut into six cells, so the wait reads as a counter as well as a timer. The card under the pointer takes one pass of light.
- **Sections.** `<details>` rows animate open through `::details-content` where the browser supports it and stay instant where it does not. Service numbers are tiles that light with their row. The approach icons are glass tiles at a definite size — as bare inline SVGs with a `viewBox` and no `width` they were sizing themselves to the flex line. The statement band and the case-study band carry a drifting aurora; the footer wordmark is a vertical gradient.
- **Case studies.** Metadata is a sheet rather than four rules on the canvas, the hero frame gets a scrim, scope rows get a lit dot, the pull-quote gets a bleeding quotation mark, next-project is a pill. The spec panel was still describing the cream theme — "Surfaces / #F4F1E9 · #FCF9F1", "no shadows" — and now describes the build.
- **Reduced transparency.** `prefers-reduced-transparency` drops every glass surface to opaque and keeps the rim and the glow, so the material degrades rather than disappearing.
- **Motion.** The aurora exists only inside `prefers-reduced-motion: no-preference`, the spotlight is never switched on under reduce, and the new sweeps and lifts are reset in the reduced-motion block.

## Case studies
Each project has a dedicated page under `works/` rather than sharing one modal. The page rhythm is: back link, asymmetric title block with a metadata table, full-bleed hero in a rigid frame, a scope list against editorial prose with a Playfair pull-quote, a square detail tile paired with a typographic "impression" panel, a full-width cobalt statement band, then a next-project link and an inquiry button.

Pages are generated from `tools/build-works.mjs` so the copy stays consistent across all six. Content mirrors the Goodly Consult structural rhythm — a per-project page with meta and next-project navigation — without importing its social proof, pricing or statistics, which would breach the content-integrity rule above.
