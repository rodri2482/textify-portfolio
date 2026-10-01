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

## Liquid glass
The current visual layer. It lives entirely in `liquid.css`, loaded last, so the whole aesthetic reverts by deleting a single `<link>`.

- **Canvas:** deep navy (`#0b1020`) with a radial lift toward `#22375f` and a faint 64px grid. The move off warm paper is what makes the glass legible — dark translucency over cream composited to a muddy brown.
- **Palette:** `--ink` flips from near-black to near-white so every `color:var(--ink)` site becomes light text in one move; the six places that used `--ink` as a *background* are re-pinned to `--ink-surface`.
- **Two glass variants.** Pale glass (`--glass-bg`) floats over light content; dark glass (`--glass-dark-bg`) is used wherever the section is near-black — announcement bar, contact form, footer chips. Pale glass behind light label text is unreadable, so these are not interchangeable.
- **Glass never overrides brand colour.** `.header-cta`, `.button-dark`, `.button-blue` and `.cs-discuss` are deliberately excluded from the glass primitive; they keep their fill and gain only the lit top edge and lift.
- **Specular sheen** (`--glass-spec`) plus an inset top highlight is what reads as glass rather than blur.
- **Backdrop roots:** an ancestor with `opacity < 1`, `filter`, `mask` or `will-change` on those truncates a child's `backdrop-filter`. The scroll reveal therefore animates `blur`, never `opacity`, so at rest the backdrop root is gone and the glass actually blurs.
- **Fallback:** without `backdrop-filter` support the tokens drop to an opaque fill, so contrast never degrades to translucent-on-photography.

## Case studies
Each project has a dedicated page under `works/` rather than sharing one modal. The page rhythm is: back link, asymmetric title block with a metadata table, full-bleed hero in a rigid frame, a scope list against editorial prose with a Playfair pull-quote, a square detail tile paired with a typographic "impression" panel, a full-width cobalt statement band, then a next-project link and an inquiry button.

Pages are generated from `tools/build-works.mjs` so the copy stays consistent across all six. Content mirrors the Goodly Consult structural rhythm — a per-project page with meta and next-project navigation — without importing its social proof, pricing or statistics, which would breach the content-integrity rule above.
