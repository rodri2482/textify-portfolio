/* Generates one static case-study page per project into works/.
   Re-run after editing the copy below:  node tools/build-works.mjs
   Copy stays descriptive about what the design covers. No statistics,
   conversion figures, testimonials or awards — nothing unverified. */

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const projects = [
  {
    slug: 'lauravogue',
    title: 'LauraVogue',
    category: 'Fashion ecommerce',
    kicker: 'Fashion',
    image: 'laura.jpg',
    secondImage: null,
    headline: ['Quietly', 'confident.'],
    accent: 'confident.',
    description:
      'An editorial fashion storefront led by confident campaign imagery and a curated product presentation, where photography carries the brand and the interface stays out of its way.',
    scope: ['Storefront design', 'Campaign-led presentation', 'Product discovery', 'Responsive product pages'],
    pullQuote: 'Restraint reads as confidence when every product shot is given room to land.',
    statement: 'Editorial rhythm, held all the way to checkout.',
    captions: ['LAURAVOGUE', 'FASHION / 01'],
    url: 'https://lauravogue.com/'
  },
  {
    slug: 'ecoraft',
    title: 'Ecoraftt',
    category: 'Lifestyle ecommerce',
    kicker: 'Lifestyle',
    image: 'ecoraft.jpg',
    secondImage: null,
    headline: ['Style for', 'every day.'],
    accent: 'every day.',
    description:
      'A broad lifestyle store that organises fashion, footwear and family collections into distinct shopping paths, so a large catalogue still feels easy to move through.',
    scope: ['Lifestyle catalog', 'Collection navigation', 'Category architecture', 'Responsive shopping'],
    pullQuote: 'A wide catalogue only works once it is divided into clear paths.',
    statement: 'Many collections, one calm way in.',
    captions: ['ECORAFTT', 'LIFESTYLE / 02'],
    url: 'https://www.ecoraftt.com/?pb=0'
  },
  {
    slug: 'dewlip',
    title: 'Dewlip',
    category: 'Beauty ecommerce',
    kicker: 'Beauty',
    image: 'dewlip.jpg',
    secondImage: null,
    headline: ['The beauty', 'of a ritual.'],
    accent: 'of a ritual.',
    description:
      'A beauty storefront with product-led visuals and a focused presentation for its lip-care collection, treating a small range as a routine rather than a transaction.',
    scope: ['Beauty storefront', 'Product imagery', 'Focused catalog', 'Ritual-led storytelling'],
    pullQuote: 'Skincare sells a routine before it sells a product.',
    statement: 'A small range, treated as a ritual.',
    captions: ['DEWLIP', 'BEAUTY / 03'],
    url: 'https://dewlip.myshopify.com/'
  },
  {
    slug: 'alma-valenti',
    title: 'Alma Valenti',
    category: 'Fashion ecommerce',
    kicker: 'Fashion',
    image: 'alma.jpg',
    secondImage: null,
    headline: ['An effortless', 'point of view.'],
    accent: 'point of view.',
    description:
      'A fashion retail experience with seasonal campaign imagery and clear routes into the collection, built so each drop arrives with its own character.',
    scope: ['Fashion storefront', 'Seasonal campaign', 'Collection discovery', 'Lookbook pages'],
    pullQuote: 'Seasonal work only lands when the structure underneath stays still.',
    statement: 'Summer on the front, order underneath.',
    captions: ['ALMA VALENTI', 'FASHION / 04'],
    url: 'https://almavalenti.com/'
  },
  {
    slug: 'renova-fashion',
    title: 'Renova Fashion',
    category: 'Fashion ecommerce',
    kicker: 'Fashion',
    image: 'renova-women.jpg',
    secondImage: 'renova.jpg',
    headline: ['A new', 'expression.'],
    accent: 'expression.',
    description:
      'A fashion store with expressive seasonal imagery and a broad apparel collection, giving the photography room to be loud while the grid stays disciplined.',
    scope: ['Fashion storefront', 'Seasonal imagery', 'Collection discovery', 'Apparel category system'],
    pullQuote: 'A broader catalogue needs a louder silhouette and a quieter grid.',
    statement: 'Expressive imagery, disciplined navigation.',
    captions: ['RENOVA FASHION', 'FASHION / 05'],
    url: 'https://renova-fashion.com/'
  },
  {
    slug: 'peter-oliveira',
    title: 'Peter Oliveira',
    category: 'Fashion ecommerce',
    kicker: 'Fashion',
    image: 'peter.jpg',
    secondImage: null,
    headline: ['Modern', 'essentials.'],
    accent: 'essentials.',
    description:
      'An apparel storefront built around clean product presentation and modern essentials, where fit and fabric detail do the persuading.',
    scope: ['Apparel storefront', 'Product presentation', 'Collection navigation', 'Fit-and-fabric detail'],
    pullQuote: 'Essentials sell on clarity: what it is, and what it costs.',
    statement: 'Basics, explained without noise.',
    captions: ['PETER OLIVEIRA', 'FASHION / 06'],
    url: 'https://peteroliveira.com/'
  }
];

const head = (p, depth) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#f4f1e9">
  <meta name="description" content="${p.title} — ${p.category} designed by Textify. ${p.description}">
  <title>${p.title} — Textify case study</title>
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='13' fill='%23455cf7'/%3E%3Ctext x='32' y='46' font-family='Arial,Helvetica,sans-serif' font-size='42' fill='%23fff' text-anchor='middle'%3E%E2%9C%B3%3C/text%3E%3C/svg%3E">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${p.title} — Textify case study">
  <meta property="og:description" content="${p.description}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,500;1,600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${depth}styles.css">
  <link rel="stylesheet" href="${depth}v2.css">
  <script src="${depth}app.js" defer></script>
</head>
<body class="cs-page">
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-top">
    <div class="site-header cs-header" id="top">
      <a class="wordmark" href="${depth}index.html" aria-label="Textify home">textify<span class="wordmark-mark">✳</span></a>
      <nav class="desktop-nav" aria-label="Main navigation">
        <a href="${depth}index.html#work">Work</a><a href="${depth}index.html#services">Services</a><a href="${depth}index.html#approach">Approach</a><a href="${depth}index.html#about">About</a>
      </nav>
      <a class="header-cta" href="${depth}index.html#contact">Start a project <span aria-hidden="true">↗</span></a>
      <button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu"><span></span><span></span></button>
    </div>
  </header>
  <nav class="mobile-menu" id="mobile-menu" aria-label="Mobile navigation" hidden>
    <a href="${depth}index.html#work">Work</a><a href="${depth}index.html#services">Services</a><a href="${depth}index.html#approach">Approach</a><a href="${depth}index.html#about">About</a>
    <a href="${depth}index.html#contact" class="mobile-menu-cta">Start a project <span aria-hidden="true">↗</span></a>
    <p class="mobile-menu-foot"><a href="mailto:testimonyakinbinu490@gmail.com">testimonyakinbinu490@gmail.com</a></p>
  </nav>
  <div class="menu-backdrop" id="menu-backdrop" hidden></div>

  <main id="main" class="cs-main">
    <section class="cs-intro">
      <div class="wrap">
        <a class="cs-back" href="${depth}index.html#work"><span aria-hidden="true">←</span> All work</a>
        <div class="cs-title-grid">
          <h1 class="cs-headline">${p.headline[0]}<br><em>${p.accent}</em></h1>
          <div class="cs-lede">
            <p>${p.description}</p>
            <dl class="cs-meta">
              <div><dt>Client</dt><dd>${p.title}</dd></div>
              <div><dt>Category</dt><dd>${p.category}</dd></div>
              <div><dt>Deliverable</dt><dd>Storefront design</dd></div>
              <div><dt>Live site</dt><dd><a href="${p.url}" target="_blank" rel="noopener noreferrer">${p.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}</a></dd></div>
            </dl>
          </div>
        </div>
      </div>
    </section>

    <figure class="cs-hero">
      <img src="${depth}assets/${p.image}" alt="${p.title} ${p.kicker.toLowerCase()} campaign imagery for Textify" fetchpriority="high">
    </figure>

    <section class="cs-body">
      <div class="wrap cs-body-grid">
        <div class="cs-scope">
          <p class="cs-label">Scope</p>
          <ul class="cs-scope-list">
${p.scope.map(s => `            <li>${s}</li>`).join('\n')}
          </ul>
        </div>
        <div class="cs-prose">
          <p>Every project starts with the story behind the products. From there, the work brings together visual direction, thoughtful interaction, and a clear path to purchase — so the store reads the same way the brand does.</p>
          <blockquote class="cs-quote"><p>${p.pullQuote}</p></blockquote>
          <p>Typography, colour and layout are set to stay out of the way of the photography. Where the imagery is expressive, the interface gets quieter; where the catalogue is broad, the navigation gets more deliberate.</p>
        </div>
      </div>
    </section>

    <section class="cs-pair">
      <div class="wrap cs-pair-grid">
        <figure class="cs-tile">
          <span class="cs-tile-crop${p.secondImage ? '' : ' cs-tile-crop--detail'}"><img src="${depth}assets/${p.secondImage || p.image}" alt="${p.title} ${p.secondImage ? 'storefront presentation' : 'product detail'}" loading="lazy"></span>
          <figcaption>${p.captions[0]}</figcaption>
        </figure>
        <figure class="cs-tile cs-tile--spec">
          <div class="cs-spec">
            <p class="cs-label">Impression</p>
            <p class="cs-spec-word">${p.accent.replace(/\.$/, '')}</p>
            <ul class="cs-spec-list">
              <li>Typography / Space Grotesk · DM Sans</li>
              <li>Accent / Playfair Display italic</li>
              <li>Surfaces / #F4F1E9 · #FCF9F1</li>
              <li>Accent colour / #455CF7</li>
              <li>Depth / 1px hairlines, no shadows</li>
            </ul>
          </div>
          <figcaption>${p.captions[1]}</figcaption>
        </figure>
      </div>
    </section>

    <section class="cs-band">
      <div class="wrap">
        <p class="cs-statement">${p.statement}</p>
      </div>
    </section>

    <section class="cs-next">
      <div class="wrap cs-next-grid">
        <div>
          <p class="cs-label">Next project</p>
          <a class="cs-next-link" href="./${projects[(projects.indexOf(p) + 1) % projects.length].slug}.html">${projects[(projects.indexOf(p) + 1) % projects.length].title} <span aria-hidden="true">→</span></a>
        </div>
        <a class="cs-discuss" href="${depth}index.html#contact">Discuss a project like this</a>
      </div>
    </section>
  </main>

  <footer class="footer footer-menu">
    <div class="wrap">
      <div class="footer-bottom">
        <span>© <span id="year"></span> TEXTIFY</span>
        <span>INDEPENDENT ECOMMERCE DESIGN</span>
        <a class="footer-back" href="#top">Back to top <span aria-hidden="true">↑</span></a>
      </div>
    </div>
  </footer>
</body>
</html>
`;

await mkdir(join(ROOT, 'works'), { recursive: true });

for (const p of projects) {
  const html = head(p, '../');
  await writeFile(join(ROOT, 'works', `${p.slug}.html`), html, 'utf8');
  console.log('wrote works/' + p.slug + '.html');
}

// Export the same data so index.html can link to the right page per card.
const cards = projects
  .map(p => `          <a class="project-open" href="./works/${p.slug}.html">`)
  .join('\n');
await writeFile(join(ROOT, 'tools', 'card-links.txt'), cards + '\n', 'utf8');
console.log('wrote tools/card-links.txt');