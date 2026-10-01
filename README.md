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

The hero is a six-plane CSS perspective scene and the portrait drifts as the hero scrolls, driven by a `--vp` custom property that `app.js` publishes per section on a single `requestAnimationFrame`. Everything else is deliberately flat: interaction states use colour, borders and 1px offset blocks rather than lift, tilt or drop shadows, per the Stitch design system's "Architectural Planar Depth" rule. Depth costs no payload and falls back to flat layout. See `DESIGN.md` for the full depth notes.

## Contact

The displayed address is `testimonyakinbinu490@gmail.com`. The form validates the fields, then opens the visitor's email app with a prefilled draft to that address. The visitor must send it from their email app; this static site has no server-side email service.

## Design notes

The visual system began in Google Stitch under **Textify Ecommerce Portfolio** (project ID `6616324723813221497`). See `DESIGN.md` for art direction. [Goodly Consult](https://goodlyconsult.com/) informed the broad editorial rhythm; Textify uses its own identity, color, portrait composition, work imagery, and page design.
