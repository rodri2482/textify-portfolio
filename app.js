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
  // Queried live rather than cached: the rail adds a looping copy of every
  // card and those have to be filtered alongside the originals.
  document.querySelectorAll('.project-card').forEach(card => {
    card.hidden = selection !== 'all' && !card.dataset.category.split(' ').includes(selection);
  });
}));

/* ---------- Project rail ----------
   A scroll-snap carousel that walks itself through the projects. Snapping
   already supplies momentum, touch and keyboard scrolling, so this only
   decides where the rail should rest: it eases each glide by hand, mirrors
   the active card into the counter and the progress bar, and keeps exactly
   one dwell timer alive at a time.

   The wrap is invisible because the rail is padded by half a viewport: a
   card and its copy at the far end sit in the same place on screen, so
   looping is a scroll position swap nobody can see.

   Only the home page has a rail, so the whole block is optional. */
const rail = document.getElementById('project-grid');
if (rail) {
  /* ---------- Carousel timing: change these two numbers ----------
     DWELL_MS  how long a project holds the centre before the next slides
               in. 120000ms is two minutes. To retime it without touching
               this file, put data-dwell on the rail in the markup:
               <div class="project-grid" data-dwell="45000" ...>
     GLIDE_MS  how long one slide takes. Longer reads as more cinematic. */
  const DWELL_MS = Number(rail.dataset.dwell) || 120000;
  const GLIDE_MS = Number(rail.dataset.glide) || 1100;

  const railHost = rail.closest('section') || document.body;
  const railCount = document.getElementById('rail-count');
  const progressBar = document.getElementById('rail-progress-bar');
  const toggle = document.getElementById('rail-toggle');
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');

  // Every card in the rail, originals and looping copies alike.
  const strip = () => [...rail.querySelectorAll('.project-card')];
  const isClone = card => card.classList.contains('is-clone');
  const realCards = () => strip().filter(card => !isClone(card));
  const visibleCards = () => realCards().filter(card => !card.hidden);
  const projectOf = card => Number(card.dataset.project);

  realCards().forEach((card, index) => { card.dataset.project = String(index); });

  /* Where a card sits before any of it is painted, measured from the rail's
     own box so the numbers do not move when a card is turned in 3D. */
  const layoutCentreOf = card => card.offsetLeft + rail.clientLeft + card.offsetWidth / 2;

  /* Layout maths, not painted maths. Reading offsetLeft skips the 3D transform
     a card is carrying right now, so the same card asks for the same scroll
     position every time - whether it is currently a neighbour seen edge on, or
     the copy the loop is about to swap in. Measuring painted rects instead put
     the landing spot a whole 46px apart at the seam, because a rotated card's
     projection is not centred on its own box. The rect fallback keeps the rail
     honest if the cards ever stop resolving against the rail itself. */
  const scrollLeftFor = card => {
    if (card.offsetParent === rail) return layoutCentreOf(card) - rail.clientWidth / 2;
    const railRect = rail.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    return rail.scrollLeft + (cardRect.left - railRect.left) - (rail.clientWidth - cardRect.width) / 2;
  };

  /* A copy has to sit in the same reveal state as the card it was made from.
     The scroll reveal watches the originals as they come into view, so without
     this a copy can still be blurred at the moment the loop swaps a sharp
     original out for its copy, and the hand-over shows up as a blur. Classes
     only, so nothing here reads back a box. */
  const syncReveal = () => {
    const originals = new Map(realCards().map(card => [projectOf(card), card]));
    strip().forEach(card => {
      const original = originals.get(projectOf(card));
      if (original) card.classList.toggle('is-visible', original.classList.contains('is-visible'));
    });
  };

  const setActive = index => {
    const cards = strip();
    const active = cards[index];
    if (!active) return;
    railIndex = index;
    const project = projectOf(active);
    // Every copy of the project lights up, not just the one in view: when the
    // loop swaps a card for its copy, both have to look the same.
    cards.forEach(card => card.classList.toggle('is-current', projectOf(card) === project));
    syncReveal();
    const list = visibleCards();
    const position = list.findIndex(card => projectOf(card) === project);
    railCount.textContent = list.length && position >= 0
      ? `${String(position + 1).padStart(2, '0')} / ${String(list.length).padStart(2, '0')}`
      : '00 / 00';
  };

  // Next card in the chosen direction that a filter has left standing.
  const nextVisible = (from, direction) => {
    const cards = strip();
    const count = cards.length;
    for (let step = 1; step <= count; step += 1) {
      const index = (((from + direction * step) % count) + count) % count;
      if (!cards[index].hidden) return index;
    }
    return from;
  };

  let glideFrame = 0;
  const stopGlide = () => {
    if (!glideFrame) return;
    cancelAnimationFrame(glideFrame);
    glideFrame = 0;
  };

  // Symmetric ease: leaves slowly, arrives slowly. That long tail is what
  // makes a move read as a camera move instead of a scroll.
  const easeInOut = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const glideTo = (card, onArrive) => {
    stopGlide();
    const to = scrollLeftFor(card);
    const from = rail.scrollLeft;
    if (motionQuery.matches || !Number.isFinite(to) || Math.abs(to - from) < 1) {
      rail.scrollLeft = to;
      onArrive();
      return;
    }
    const startedAt = performance.now();
    const step = now => {
      const elapsed = Math.min(1, (now - startedAt) / GLIDE_MS);
      rail.scrollLeft = from + (to - from) * easeInOut(elapsed);
      // Cards drifting into view are being revealed as the rail moves; keep
      // their copies in step frame by frame, not only when the move ends.
      syncReveal();
      if (elapsed < 1) { glideFrame = requestAnimationFrame(step); return; }
      glideFrame = 0;
      // Land exactly on the snap point so the browser never nudges it after us.
      rail.scrollLeft = to;
      onArrive();
    };
    glideFrame = requestAnimationFrame(step);
  };

  let railIndex = 0;
  let inView = false;
  let hovering = false;
  let dragging = false;
  let userPaused = false;
  let dwellTimer = 0;
  let progressFrame = 0;
  let dwellStartedAt = 0;
  let dwellLeft = DWELL_MS;

  const autoplayAllowed = () => !userPaused && !motionQuery.matches && inView && !hovering
    && !dragging && !document.hidden && visibleCards().length > 1;

  const paintProgress = ratio => {
    if (progressBar) progressBar.style.transform = `scaleX(${ratio})`;
  };

  // One timer at a time, always: every entry point clears what was running
  // before it schedules anything of its own.
  const clearTimers = () => {
    if (dwellTimer) { clearTimeout(dwellTimer); dwellTimer = 0; }
    if (progressFrame) { cancelAnimationFrame(progressFrame); progressFrame = 0; }
  };

  const tickProgress = () => {
    const ratio = Math.min(1, (performance.now() - dwellStartedAt) / DWELL_MS);
    paintProgress(ratio.toFixed(4));
    progressFrame = ratio < 1 ? requestAnimationFrame(tickProgress) : 0;
  };

  const startDwell = (fromZero = true) => {
    clearTimers();
    dwellLeft = fromZero ? DWELL_MS : Math.max(0, dwellLeft);
    dwellStartedAt = performance.now() - (DWELL_MS - dwellLeft);
    if (!autoplayAllowed()) { paintProgress(((DWELL_MS - dwellLeft) / DWELL_MS).toFixed(4)); return; }
    dwellTimer = setTimeout(() => {
      dwellTimer = 0;
      progressFrame = 0;
      advance();
    }, dwellLeft);
    progressFrame = requestAnimationFrame(tickProgress);
  };

  const pauseDwell = () => {
    if (dwellTimer) dwellLeft = Math.max(0, DWELL_MS - (performance.now() - dwellStartedAt));
    clearTimers();
  };

  const settleAt = index => {
    const cards = strip();
    const active = cards[index];
    if (!active) return;
    let target = index;
    if (isClone(active)) {
      target = cards.findIndex(card => !isClone(card) && projectOf(card) === projectOf(active));
      const left = scrollLeftFor(cards[target]);
      const reachable = left >= 0 && left <= rail.scrollWidth - rail.clientWidth;
      // Identical pixels: a copy and its original occupy the same spot, so
      // swapping the scroll position is what makes the loop seamless. If the
      // original cannot reach the centre on this layout the copy stays put,
      // which looks exactly the same.
      if (reachable) { rail.scrollLeft = left; setActive(target); startDwell(true); return; }
    }
    setActive(target);
    startDwell(true);
  };

  const goTo = index => {
    const card = strip()[index];
    if (!card || card.hidden) return;
    setActive(index);                       // counter and highlight lead the move
    paintProgress('0');
    glideTo(card, () => settleAt(index));
  };

  const advance = () => {
    if (visibleCards().length < 2) { startDwell(true); return; }
    const next = nextVisible(railIndex, 1);
    if (next !== railIndex) goTo(next);
  };

  // Nearest-to-centre wins, so the active card follows a real drag or flick.
  let railQueued = false;
  const syncRail = () => {
    railQueued = false;
    if (glideFrame) return;                 // our own glide is not a drag
    const list = strip().filter(card => !card.hidden);
    if (!list.length) return;
    // Measured against scroll position, the same way scrollLeftFor works. Asking
    // painted rects instead let the 3D tilt of a card tip the decision and name
    // a project the rail was not actually resting on.
    const railCentre = rail.scrollLeft + rail.clientWidth / 2;
    let best = 0;
    let bestDistance = Infinity;
    list.forEach((card, index) => {
      const distance = Math.abs(layoutCentreOf(card) - railCentre);
      if (distance < bestDistance) { bestDistance = distance; best = index; }
    });
    setActive(best);
  };

  const queueRail = () => {
    if (railQueued) return;
    railQueued = true;
    requestAnimationFrame(syncRail);
  };

  /* Seamless wrap. The rail is padded by half a viewport so a card can only
     sit in the centre with room on both sides, so the strip needs copies at
     each end: copies of the tail in front, copies of the head behind. Only as
     many as the viewport can actually show are made. */
  const cloneSpan = () => {
    const card = visibleCards()[0] || realCards()[0];
    if (!card || !card.offsetWidth) return 1;
    const gap = parseFloat(getComputedStyle(rail).columnGap || getComputedStyle(rail).gap) || 0;
    const step = card.offsetWidth + gap;
    // Cards that fit to one side of centre, rounded up for the half a card the
    // edge of the viewport leaves showing, plus one to spare. The spare is what
    // makes the loop honest: when the rail comes to rest on a copy at either
    // end, the card the eye expects beyond it is a copy too, so the strip never
    // shows the edge of the world as the carousel wraps.
    return Math.max(1, Math.ceil(rail.clientWidth / 2 / step)) + 1;
  };

  const copyOf = card => {
    const copy = card.cloneNode(true);
    copy.classList.add('is-clone');
    copy.removeAttribute('id');
    copy.setAttribute('aria-hidden', 'true');
    // inert keeps a copy out of the tab order and off the pointer, so looping
    // never doubles the links a keyboard or screen reader walks through.
    if ('inert' in copy) copy.inert = true;
    copy.querySelectorAll('a, button').forEach(el => el.setAttribute('tabindex', '-1'));
    return copy;
  };

  const syncClones = () => {
    strip().filter(isClone).forEach(copy => copy.remove());
    const cards = realCards();
    const first = cards[0];
    if (!first) return;
    const span = cloneSpan();
    // The same number of copies at each end, so the strip reads the same
    // whichever side of the world the rail is resting on. The tail goes in
    // back to front, otherwise the copy nearest the first project would be the
    // last project and stepping back would land on the wrong card.
    for (let offset = span; offset >= 1; offset -= 1) {
      const source = cards[cards.length - offset];
      if (!source) break;
      rail.insertBefore(copyOf(source), first);
    }
    for (let offset = 0; offset < span && offset < cards.length; offset += 1) {
      rail.appendChild(copyOf(cards[offset]));
    }
  };

  rail.addEventListener('scroll', queueRail, { passive: true });
  rail.addEventListener('dragstart', event => event.preventDefault());

  rail.addEventListener('keydown', event => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    const next = nextVisible(railIndex, event.key === 'ArrowRight' ? 1 : -1);
    if (next === railIndex) return;
    event.preventDefault();
    goTo(next);                             // a manual move restarts the wait
  });

  /* Dragging the rail. A finger already scrolls it, but nothing moves a rail
     for a click and drag, and the transport buttons are gone, so the mouse
     gets the same gesture. Once it has travelled a few pixels it counts as a
     drag, and the case-study link under the cursor is left alone. */
  let dragX = 0;
  let dragScroll = 0;
  let dragTravel = 0;
  let swallowClick = false;
  const dropDraggedClick = event => {
    if (!swallowClick) return;
    swallowClick = false;
    event.preventDefault();
    event.stopPropagation();
  };
  window.addEventListener('click', dropDraggedClick, true);

  // Dragging is a manual move too: hold the rail still while it is in a hand,
  // then start counting the wait again from zero when it is released.
  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    rail.classList.remove('is-dragging');
    stopGlide();
    if (dragTravel > 6) swallowClick = true;    // that was a drag, not a click
    startDwell(true);
  };
  rail.addEventListener('pointerdown', event => {
    if (event.button) return;
    dragging = true;
    swallowClick = false;                       // a fresh gesture clears any stale swallow
    dragX = event.clientX;
    dragScroll = rail.scrollLeft;
    dragTravel = 0;
    pauseDwell();
    if (event.pointerType === 'mouse') rail.classList.add('is-dragging');
  });
  // Tracked on the window rather than by capturing the pointer: a capture
  // retargets the click that follows to the rail, and the case study under the
  // cursor would stop opening.
  window.addEventListener('pointermove', event => {
    if (!dragging || event.pointerType !== 'mouse') return;
    const travel = event.clientX - dragX;
    if (Math.abs(travel) > 6) dragTravel = Math.abs(travel);
    rail.scrollLeft = dragScroll - travel;
  });
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);

  if (hoverQuery.matches) {
    rail.addEventListener('mouseenter', () => { hovering = true; pauseDwell(); });
    rail.addEventListener('mouseleave', () => { hovering = false; startDwell(false); });
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pauseDwell();
    else if (autoplayAllowed()) startDwell(false);
  });

  // A filter change can hide the active card, so re-centre on what is left.
  filters.forEach(button => button.addEventListener('click', () => {
    setTimeout(() => {
      const list = visibleCards();
      const current = strip()[railIndex];
      const target = list.find(card => projectOf(card) === projectOf(current)) || list[0];
      if (!target) { railCount.textContent = '00 / 00'; return; }
      rail.scrollLeft = scrollLeftFor(target);
      setActive(strip().indexOf(target));
      paintProgress('0');
      startDwell(true);
    }, 0);
  }));

  if (toggle) {
    toggle.addEventListener('click', () => {
      userPaused = !userPaused;
      toggle.setAttribute('aria-pressed', String(userPaused));
      toggle.setAttribute('aria-label', userPaused ? 'Play the project carousel' : 'Pause the project carousel');
      if (userPaused) pauseDwell(); else startDwell(true);
    });
  }

  const applyMotionPreference = () => {
    railHost.dataset.autoplay = motionQuery.matches ? 'off' : 'on';
    if (motionQuery.matches) { pauseDwell(); paintProgress('0'); }
  };
  motionQuery.addEventListener('change', applyMotionPreference);

  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resizeTimer = 0;
      const project = projectOf(strip()[railIndex]);
      syncClones();
      const target = strip().find(card => !isClone(card) && projectOf(card) === project && !card.hidden)
        || visibleCards()[0]
        || strip()[0];
      if (!target) return;
      rail.scrollLeft = scrollLeftFor(target);
      setActive(strip().indexOf(target));
      paintProgress('0');
    }, 160);
  });

  const railObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      inView = entry.isIntersecting;
      if (inView) startDwell(true);
      else pauseDwell();
    });
  }, { threshold: 0.2 });
  railObserver.observe(rail);

  applyMotionPreference();

  // Copies go in before the first paint, so the rail opens on project one
  // rather than on a copy of it.
  requestAnimationFrame(() => {
    syncClones();
    const first = realCards()[0];
    if (!first) return;
    rail.scrollLeft = scrollLeftFor(first);
    setActive(strip().indexOf(first));
    paintProgress('0');
  });
}

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

/* ---------- Reading progress ----------
   A hairline along the very top of the viewport. It is deliberately not a
   second scroll listener doing its own maths per event: the listener only
   asks for a frame, and the frame is the only thing that reads layout.
   The bar is decorative, so CSS hides it under reduced motion. */
const progressFill = document.getElementById('scroll-progress-bar');
if (progressFill) {
  let progressQueued = false;

  const paintScrollProgress = () => {
    progressQueued = false;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    progressFill.style.transform = `scaleX(${ratio.toFixed(4)})`;
  };

  const queueProgress = () => {
    if (progressQueued) return;
    progressQueued = true;
    requestAnimationFrame(paintScrollProgress);
  };

  window.addEventListener('scroll', queueProgress, { passive: true });
  window.addEventListener('resize', queueProgress, { passive: true });
  paintScrollProgress();
}

/* ---------- Hero spotlight ----------
   A soft pool of light that follows the mouse across the hero. Only on a
   real pointer — a touch device has no hover to answer, and a stray
   touchmove would leave a light stuck where the finger lifted. The value is
   published as a percentage so CSS decides the size, colour and falloff;
   one rect read per frame at most. */
const heroScene = document.querySelector('.hero-v2');
if (heroScene) {
  const spotQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
  let spotQueued = false;
  let spotClientX = 0;
  let spotClientY = 0;

  const paintSpot = () => {
    spotQueued = false;
    const rect = heroScene.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = ((spotClientX - rect.left) / rect.width) * 100;
    const y = ((spotClientY - rect.top) / rect.height) * 100;
    heroScene.style.setProperty('--spot-x', `${x.toFixed(2)}%`);
    heroScene.style.setProperty('--spot-y', `${y.toFixed(2)}%`);
  };

  const onSpotMove = event => {
    if (event.pointerType && event.pointerType !== 'mouse') return;
    spotClientX = event.clientX;
    spotClientY = event.clientY;
    heroScene.classList.add('has-spot');
    if (spotQueued) return;
    spotQueued = true;
    requestAnimationFrame(paintSpot);
  };

  const onSpotLeave = () => heroScene.classList.remove('has-spot');

  const enableSpot = () => {
    if (!spotQuery.matches || reducedMotion.matches) return;
    heroScene.removeEventListener('pointermove', onSpotMove);
    heroScene.addEventListener('pointermove', onSpotMove);
    heroScene.addEventListener('pointerleave', onSpotLeave);
  };

  const disableSpot = () => {
    heroScene.removeEventListener('pointermove', onSpotMove);
    heroScene.removeEventListener('pointerleave', onSpotLeave);
    onSpotLeave();
  };

  enableSpot();
  reducedMotion.addEventListener('change', () => (reducedMotion.matches ? disableSpot() : enableSpot()));
}
