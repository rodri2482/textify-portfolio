# Textify ecommerce portfolio

A responsive ecommerce portfolio built around the supplied founder portrait and six user-supplied live stores.

## Open locally

Open `index.html` in a browser, or upload the entire folder to a static host. All site code and image assets are included. Google Fonts require an internet connection; system fallbacks are provided.

## Included work

- [LauraVogue](https://lauravogue.com/) — `works/lauravogue.html`
- [Ecoraftt](https://www.ecoraftt.com/?pb=0) — `works/ecoraft.html`
- [Dewlip](https://dewlip.myshopify.com/) — `works/dewlip.html`
- [Alma Valenti](https://almavalenti.com/) — `works/alma-valenti.html`
- [Renova Fashion](https://renova-fashion.com/) — `works/renova-fashion.html`
- [Peter Oliveira](https://peteroliveira.com/) — `works/peter-oliveira.html`

Each project has its own case-study page under `works/`. Work cards on the home page link straight to them, and every case study links out to the live storefront. The imagery in `assets/` was taken from those user-supplied sites for this portfolio presentation.

## Case-study pages

The six pages in `works/` are generated, not hand-maintained. Copy and per-project settings live in `tools/build-works.mjs`; edit there and re-run:

```
node tools/build-works.mjs
```

It writes every page in `works/`, so never edit those files directly — they will be overwritten. It also emits `tools/card-links.txt`, a reference of the card markup used on the home page.

Case-study copy stays descriptive about what the design covers. No statistics, conversion figures, testimonials, awards or client quotes appear anywhere, per the content-integrity rule in `DESIGN.md`.

Each store currently supplies one campaign image, so the square detail tile re-crops that frame rather than repeating it verbatim. Supplying two or three distinct frames per store would let the layout carry a full image set.

## Motion and interaction

The hero layers the supplied portrait over a subtle dark gradient, with gentle portrait movement. The abstract rings and floating badge have been removed. Sections reveal on scroll. Reduced-motion settings disable decorative animation. Filters, project panels, service and FAQ disclosures, and the mobile menu are interactive.

## The project rail

The rail runs itself: it holds each project for `data-dwell="120000"` (two minutes) then glides to the next over `data-glide="1100"`, both set on `#project-grid`. A progress line above the rail and a pause control under it show where it is in the wait; hovering the rail, touching it, pressing an arrow key, switching tabs or filtering all interrupt the timer and start the wait again when you let go. Arrow keys move one project at a time and wrap at both ends. The mouse can also drag the rail, which leaves the native touch scrolling alone and steps over the case-study link once a drag has clearly begun.

Reduced motion switches the whole thing off: no autoplay, no progress line, no pause control, instant navigation.

Looping is done with copies of the cards at each end of the strip, not by rewinding: the rail glides onto a copy exactly as it would onto the original and then swaps the scroll position, which is invisible because the two occupy the same pixels. Three details keep that true, each commented in `app.js`: landing spots come from layout rather than painted rectangles (a card turned in 3D projects off-centre), a copy is always in the same scroll-reveal state as the card it was made from (otherwise the swap hands over a blurred card), and copies are `inert` so they never double the links a keyboard walks through.

## Visual layer

`liquid.css` carries the current look: a dark-navy canvas with a Liquid Glass treatment, and scroll-driven storytelling animations where the browser supports `animation-timeline: view()` (with the IntersectionObserver reveal as the fallback elsewhere). It is loaded last and is entirely self-contained — delete its single `<link>` to fall back to the editorial system in `styles.css` + `v2.css`.

Two gotchas it works around, both documented inline: an ancestor with `opacity < 1` or `filter` becomes a backdrop root and silently kills a child's `backdrop-filter`, and pale glass behind light label text is unreadable, so dark-surface components take a dark-glass variant.

## LinkedIn

A floating circular button links to `linkedin.com/in/testimony-akinbinu-3198b1413`. The share-tracking `utm_*` parameters were stripped; they are campaign tags, not part of the profile URL.

The hero is a six-plane CSS perspective scene and the portrait drifts as the hero scrolls, driven by a `--vp` custom property that `app.js` publishes per section on a single `requestAnimationFrame`. Everything else is deliberately flat: interaction states use colour, borders and 1px offset blocks rather than lift, tilt or drop shadows, per the Stitch design system's "Architectural Planar Depth" rule. Depth costs no payload and falls back to flat layout. See `DESIGN.md` for the full depth notes.

## Contact

The displayed address is `testimonyakinbinu490@gmail.com`. The form validates the fields, then opens the visitor's email app with a prefilled draft to that address. The visitor must send it from their email app; this static site has no server-side email service.

## Design notes

The visual system began in Google Stitch under **Textify Ecommerce Portfolio** (project ID `6616324723813221497`). See `DESIGN.md` for art direction. [Goodly Consult](https://goodlyconsult.com/) informed the broad editorial rhythm; Textify uses its own identity, color, portrait composition, work imagery, and page design.
