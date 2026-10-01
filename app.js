const CONTACT_EMAIL = 'testimonyakinbinu490@gmail.com';

document.getElementById('year').textContent = new Date().getFullYear();

const siteHeader = document.querySelector('.site-header');
// Case-study pages have no announcement bar, so this is optional.
const announcement = document.querySelector('.announcement');
const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const menuBackdrop = document.getElementById('menu-backdrop');
const mobileQuery = window.matchMedia('(max-width: 900px)');

function setMenu(open) {
  if (open && !mobileQuery.matches) return;
  if (open) {
    // Measured at open time: the header is not fixed, so its viewport bottom
    // is the only correct offset while the page is scroll-locked.
    mobileMenu.style.setProperty('--menu-top', `${Math.round(siteHeader.getBoundingClientRect().bottom)}px`);
  }
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  mobileMenu.hidden = !open;
  menuBackdrop.hidden = !open;
  document.body.classList.toggle('menu-open', open);
}

menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
menuBackdrop.addEventListener('click', () => setMenu(false));

window.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || menuButton.getAttribute('aria-expanded') !== 'true') return;
  setMenu(false);
  menuButton.focus();
});

// Keep tab focus inside the panel while it is open.
mobileMenu.addEventListener('keydown', event => {
  if (event.key !== 'Tab' || mobileMenu.hidden) return;
  const focusables = [...mobileMenu.querySelectorAll('a[href]')];
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

// Returning to desktop width must not leave the panel open or the page locked.
mobileQuery.addEventListener('change', event => { if (!event.matches) setMenu(false); });

// Highlight the nav link for the section currently in view.
const navSections = ['work', 'services', 'approach', 'about']
  .map(id => document.getElementById(id))
  .filter(Boolean);
const desktopNav = new Map([...document.querySelectorAll('.desktop-nav a')]
  .map(link => [link.getAttribute('href').slice(1), link]));

const highlightNav = () => {
  const line = window.scrollY + siteHeader.offsetHeight + (announcement ? announcement.offsetHeight : 0) + window.innerHeight * 0.3;
  let current = '';
  navSections.forEach(section => { if (line >= section.offsetTop) current = section.id; });
  desktopNav.forEach((link, id) => {
    link.classList.toggle('is-active', id === current);
    if (id === current) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
};
window.addEventListener('scroll', highlightNav, { passive: true });
window.addEventListener('resize', highlightNav, { passive: true });
highlightNav();

const filters = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.project-card');
filters.forEach(button => button.addEventListener('click', () => {
  const selection = button.dataset.filter;
  // Match on the filter value, not on element identity: the same filter exists
  // in two places (header pill and section bar), so clicking one must light up
  // both. Comparing elements left the other copy with nothing selected.
  filters.forEach(item => {
    const active = item.dataset.filter === selection;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  cards.forEach(card => { card.hidden = selection !== 'all' && !card.dataset.category.split(' ').includes(selection); });
}));

/* ---------- Project rail ----------
   A scroll-snap carousel: the centred card is the active one. Snapping
   handles the movement, so this only tracks which card is nearest the
   centre and mirrors that into the counter and the arrow buttons. */
const rail = document.getElementById('project-grid');
const railPrev = document.getElementById('rail-prev');
const railNext = document.getElementById('rail-next');
const railCount = document.getElementById('rail-count');
let railIndex = 0;

const visibleCards = () => [...rail.querySelectorAll('.project-card')].filter(c => !c.hidden);

/* Rect-delta rather than offsetLeft: the rail is not the offsetParent of its
   cards, so offsetLeft resolved against a further ancestor and every scroll
   landed in the wrong place — the arrows did nothing. */
const scrollToCard = (card, behavior = 'smooth') => {
  if (!card) return;
  const railRect = rail.getBoundingClientRect();
  const cardRect = card.getBoundingClientRect();
  const delta = (cardRect.left - railRect.left) - (rail.clientWidth - cardRect.width) / 2;
  rail.scrollBy({ left: delta, behavior });
};

const setActiveCard = index => {
  const list = visibleCards();
  // Clear across every card, not just visible ones: a card hidden by a filter
  // would otherwise keep a stale is-current and report a 0x0 rect.
  rail.querySelectorAll('.project-card').forEach(card => card.classList.remove('is-current'));
  if (!list.length) {
    railCount.textContent = '00 / 00';
    railPrev.disabled = railNext.disabled = true;
    return;
  }
  railIndex = Math.max(0, Math.min(index, list.length - 1));
  list[railIndex].classList.add('is-current');
  railCount.textContent = `${String(railIndex + 1).padStart(2, '0')} / ${String(list.length).padStart(2, '0')}`;
  railPrev.disabled = railIndex === 0;
  railNext.disabled = railIndex === list.length - 1;
};

// Nearest-to-centre wins, so the active card follows a real drag or flick.
let railQueued = false;
const syncRail = () => {
  railQueued = false;
  const list = visibleCards();
  if (!list.length) { setActiveCard(0); return; }
  const railBox = rail.getBoundingClientRect();
  const centre = railBox.left + rail.clientWidth / 2;
  let best = 0;
  let bestDistance = Infinity;
  list.forEach((card, i) => {
    const box = card.getBoundingClientRect();
    const d = Math.abs(box.left + box.width / 2 - centre);
    if (d < bestDistance) { bestDistance = d; best = i; }
  });
  setActiveCard(best);
};

const queueRail = () => {
  if (railQueued) return;
  railQueued = true;
  requestAnimationFrame(syncRail);
};

rail.addEventListener('scroll', queueRail, { passive: true });
rail.addEventListener('keydown', event => {
  if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
  event.preventDefault();
  scrollToCard(visibleCards()[railIndex + (event.key === 'ArrowRight' ? 1 : -1)]);
});

railPrev.addEventListener('click', () => scrollToCard(visibleCards()[railIndex - 1]));
railNext.addEventListener('click', () => scrollToCard(visibleCards()[railIndex + 1]));

// A filter change can hide the active card, so re-centre on what is left.
filters.forEach(button => button.addEventListener('click', () => {
  setTimeout(() => {
    const list = visibleCards();
    setActiveCard(0);
    scrollToCard(list[0], 'auto');
  }, 0);
}));

setActiveCard(0);
requestAnimationFrame(() => scrollToCard(visibleCards()[0], 'auto'));

/* ---------- Contextual header ----------
   While the work section is on screen the pill swaps its nav links for the
   project filters. Both filter groups stay in sync because the handler above
   toggles every .filter button at once, so the section copy and the header
   copy can never disagree. */
const workSection = document.getElementById('work');
if (workSection) {
  const workObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => siteHeader.classList.toggle('in-work', entry.isIntersecting));
  }, { threshold: 0.01, rootMargin: '-96px 0px -25% 0px' });
  workObserver.observe(workSection);
}


// Only the home page carries the inquiry form; case studies link back to it.
const form = document.getElementById('contact-form');
if (form) {
  const status = document.getElementById('form-status');
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const subject = `Textify project inquiry — ${data.get('type')}`;
    const body = `Name: ${data.get('name')}\nEmail: ${data.get('email')}\nProject type: ${data.get('type')}\n\nProject details:\n${data.get('message')}`;
    status.textContent = 'Opening your email app with your inquiry ready to send.';
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (!reducedMotion.matches) {
  const revealTargets = document.querySelectorAll('.section-heading, .project-card, .service-row, .process-card, .about-grid, .contact-grid');
  revealTargets.forEach((element, index) => {
    element.classList.add('reveal-ready');
    element.style.setProperty('--reveal-delay', `${(index % 3) * 85}ms`);
  });
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .09, rootMargin: '0px 0px -30px 0px' });
  revealTargets.forEach(element => revealObserver.observe(element));
}

/* ---------- 3D scroll depth ----------
   Publishes --vp on each section: 0 as it enters from below, 1 as it leaves
   the top. CSS does the rest, so no layout is read back and nothing reflows.
   One rect read per section per frame, coalesced to a single rAF. */
const depthQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const depthSections = [...document.querySelectorAll('main > section')];
let depthQueued = false;

const updateDepth = () => {
  depthQueued = false;
  const vh = window.innerHeight;
  depthSections.forEach(section => {
    const rect = section.getBoundingClientRect();
    const progress = (vh - rect.top) / (vh + rect.height);
    section.style.setProperty('--vp', Math.min(1, Math.max(0, progress)).toFixed(4));
  });
};

const queueDepth = () => {
  if (depthQueued) return;
  depthQueued = true;
  requestAnimationFrame(updateDepth);
};

// CSS already neutralises the transforms via --depth, so skip the work entirely
// when the visitor has asked for reduced motion.
depthQuery.addEventListener('change', event => {
  if (event.matches) return;
  queueDepth();
});
if (!depthQuery.matches) {
  window.addEventListener('scroll', queueDepth, { passive: true });
  window.addEventListener('resize', queueDepth, { passive: true });
  updateDepth();
}
