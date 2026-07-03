/* ============ Preloader: hide once loaded (min display + safety cap) ============ */
(() => {
  const pl = document.getElementById('preloader');
  if (!pl) return;
  // internal navigation (flagged in the <head> script): skip the load screen entirely
  if (document.documentElement.classList.contains('no-preloader')) {
    pl.remove();
    document.documentElement.classList.add('entered');
    return;
  }
  let hidden = false;
  const reveal = () => document.documentElement.classList.add('entered');
  const hide = () => {
    if (hidden) return; hidden = true;
    pl.classList.add('done');                 // fade the load screen out (~.7s)
    setTimeout(() => {
      pl.remove();
      setTimeout(reveal, 160);                // header + hero slide/fade in a moment after the screen ends
    }, 720);
  };
  window.addEventListener('load', () => setTimeout(hide, 2200));  // min display so the fill bar + logo are seen
  setTimeout(hide, 6000);                                         // safety cap if load never fires
})();

/* ============ Hero: cycle the last word ============ */
(() => {
  const el = document.getElementById('cycleWord');
  if (!el) return;
  const words = ['HEALTHY', 'THRIVING', 'PRISTINE'];
  let i = 0;
  const reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  if (reduce) return; // keep it static for reduced motion
  el.style.transition = 'opacity .38s var(--ease), transform .38s var(--ease)';
  setInterval(() => {
    el.style.opacity = '0'; el.style.transform = 'translateY(-12px)';   // slide up + fade out
    setTimeout(() => {
      i = (i + 1) % words.length;
      el.textContent = words[i];
      el.style.transition = 'none';
      el.style.opacity = '0'; el.style.transform = 'translateY(12px)';  // reposition below, hidden
      requestAnimationFrame(() => requestAnimationFrame(() => {
        el.style.transition = 'opacity .42s var(--ease), transform .42s var(--ease)';
        el.style.opacity = '1'; el.style.transform = 'translateY(0)';   // slide up into place
      }));
    }, 400);
  }, 2600);
})();

/* ============ Sticky header shadow on scroll ============ */
const header = document.getElementById('header');
// Suppress header transitions until after the first paint so nothing animates on load/refresh.
header.classList.add('no-anim');
let ticking = false;
const onScroll = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    header.classList.toggle('scrolled', window.scrollY > 12);
    ticking = false;
  });
};
window.addEventListener('scroll', onScroll, {passive:true});
onScroll();
// let the initial state settle, then re-enable transitions
requestAnimationFrame(() => requestAnimationFrame(() => header.classList.remove('no-anim')));

/* ============ Scroll-spy: highlight the active section's menu item ============ */
const spyMap = [
  { link: document.querySelector('nav.center a[href="/"]'),     section: document.querySelector('.hero') },
  { link: document.querySelector('nav.center a[href="#about"]'),   section: document.getElementById('about') },
  { link: document.querySelector('nav.center .drop-toggle'),       section: document.getElementById('services') },
  { link: document.querySelector('nav.center a[href="#gallery"]'), section: document.getElementById('gallery') },
  { link: document.querySelector('nav.center a[href="#contact"]'), section: document.getElementById('contact') },
].filter(x => x.link && x.section);
function updateActiveNav(){
  const pos = window.scrollY + 150;               // a bit below the sticky header
  let active = spyMap[0];
  for (const item of spyMap){
    if (item.section.getBoundingClientRect().top + window.scrollY <= pos) active = item;
  }
  spyMap.forEach(i => i.link.classList.toggle('active', i === active));
}
let spyTick = false;
const onSpy = () => { if (spyTick) return; spyTick = true; requestAnimationFrame(() => { updateActiveNav(); spyTick = false; }); };
window.addEventListener('scroll', onSpy, {passive:true});
updateActiveNav();

/* ============ Mobile slide-out menu ============ */
const burger = document.getElementById('burger');
const nav = document.getElementById('primaryNav');
const navOverlay = document.getElementById('navOverlay');
const navClose = document.getElementById('navClose');
const dropParent = nav.querySelector('.has-dropdown');
const dropToggle = nav.querySelector('.drop-toggle');
const isMobileNav = () => window.matchMedia('(max-width:860px)').matches;
function openMenu(){
  nav.classList.add('mobile-open');
  burger.classList.add('open');
  navOverlay.classList.add('show');
  document.body.classList.add('menu-open');
}
function closeMenu(){
  nav.classList.remove('mobile-open');
  burger.classList.remove('open');
  navOverlay.classList.remove('show');
  document.body.classList.remove('menu-open');
  dropParent.classList.remove('open');
}
burger.addEventListener('click', () => nav.classList.contains('mobile-open') ? closeMenu() : openMenu());
navClose.addEventListener('click', closeMenu);
navOverlay.addEventListener('click', closeMenu);
// On mobile, tapping "Services" expands the submenu instead of navigating away.
dropToggle.addEventListener('click', (e) => {
  if (isMobileNav()) { e.preventDefault(); dropParent.classList.toggle('open'); }
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  // keep the menu open when the tap only expands the Services submenu
  if (isMobileNav() && a.classList.contains('drop-toggle')) return;
  closeMenu();
}));
// clean up if the viewport grows back to desktop while the menu is open
window.addEventListener('resize', () => { if (!isMobileNav()) closeMenu(); });

/* ============ Mega menu: reveal service image on hover ============ */
const megaItems = [...document.querySelectorAll('.mega-item')];
const megaCards = [...document.querySelectorAll('.mega-card')];
function activateMega(i){
  megaItems.forEach(x => x.classList.toggle('is-active', x.dataset.i === i));
  megaCards.forEach(c => c.classList.toggle('is-active', c.dataset.i === i));
}
megaItems.forEach(it => {
  it.addEventListener('mouseenter', () => { if (!isMobileNav()) activateMega(it.dataset.i); });
});
// reset to the first service when the menu closes
if (dropParent) dropParent.addEventListener('mouseleave', () => { if (!isMobileNav()) activateMega('0'); });

/* ============ Desktop floating contact button ============ */
(() => {
  const wrap = document.getElementById('fabWrap');
  const toggle = document.getElementById('fabToggle');
  const close = document.getElementById('fabClose');
  if (!wrap || !toggle) return;
  const setOpen = (open) => { wrap.classList.toggle('open', open); toggle.setAttribute('aria-expanded', open); };
  toggle.addEventListener('click', () => setOpen(!wrap.classList.contains('open')));
  close.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  document.addEventListener('click', (e) => { if (!wrap.contains(e.target)) setOpen(false); });
})();
function fabSubmit(e){
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  btn.innerHTML = '✓ Message Sent!';
  btn.style.background = 'var(--green)';
  setTimeout(() => {
    alert("Thanks! We've received your message and will call you back shortly.\n\nPrefer to talk now? Call 318.664.2328.");
    form.reset();
    btn.innerHTML = 'Send Message <span class="arrow">→</span>';
    btn.style.background = '';
  }, 500);
  return false;
}

/* ============ Mobile "Message" → slide-up contact sheet ============ */
(() => {
  // build the sheet once and append to the page
  const sheet = document.createElement('div');
  sheet.className = 'sheet';
  sheet.id = 'contactSheet';
  sheet.setAttribute('aria-hidden', 'true');
  sheet.innerHTML = `
    <div class="sheet-backdrop" data-close></div>
    <div class="sheet-panel" role="dialog" aria-label="Send us a message" aria-modal="true">
      <span class="sheet-grip" aria-hidden="true"></span>
      <button class="sheet-close" data-close aria-label="Close"><svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg></button>
      <h3>Send us a message</h3>
      <p>Tell us about your project and we'll get right back to you.</p>
      <a href="tel:13186642328" class="btn btn-green sheet-call">
        <svg viewBox="0 0 24 24" fill="none"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.2 1l-2.3 2.3Z" fill="currentColor"/></svg>
        Call 318.664.2328
      </a>
      <div class="sheet-or"><span>or send a message</span></div>
      <form class="sheet-form" onsubmit="return fabSubmit(event)">
        <input type="text" name="name" placeholder="Your name" aria-label="Your name" required>
        <input type="tel" name="phone" placeholder="Phone number" aria-label="Phone number" required>
        <textarea name="msg" rows="3" placeholder="How can we help?" aria-label="Message"></textarea>
        <button type="submit" class="btn btn-blue">Send Message <span class="arrow">→</span></button>
      </form>
    </div>`;
  document.body.appendChild(sheet);

  const open = () => { sheet.classList.add('open'); sheet.setAttribute('aria-hidden', 'false'); document.body.classList.add('menu-open'); };
  const close = () => { sheet.classList.remove('open'); sheet.setAttribute('aria-hidden', 'true'); document.body.classList.remove('menu-open'); };
  sheet.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  // wire the sticky footer "Message" button to open the sheet instead of navigating
  document.querySelectorAll('.mobile-bar a').forEach(a => {
    const label = a.querySelector('span')?.textContent.trim().toLowerCase();
    if (label === 'message') {
      a.addEventListener('click', (e) => { e.preventDefault(); open(); });
    }
  });
})();

/* ============ Service cards: flip on desktop hover; tap opens the service page on mobile ============ */
(() => {
  const isTouch = () => window.matchMedia('(max-width:860px)').matches;
  document.querySelectorAll('.svc-flip').forEach(card => {
    card.addEventListener('click', (e) => {
      if (!isTouch()) return;             // desktop uses hover flip
      if (e.target.closest('a')) return;  // real links still work
      const link = card.querySelector('.more');
      if (link) window.location.href = link.getAttribute('href');
    });
  });
})();

/* ============ Services carousel arrows (mobile) ============ */
(() => {
  const grid = document.querySelector('.services-grid');
  if (!grid) return;
  document.querySelectorAll('.svc-arrow').forEach(btn => btn.addEventListener('click', () => {
    const card = grid.querySelector('.svc');
    const step = card ? card.getBoundingClientRect().width + 16 : grid.clientWidth * 0.85;
    grid.scrollBy({ left: step * (+btn.dataset.dir), behavior: 'smooth' });
  }));
})();

/* ============ Seamless infinite marquee ============ */
const track = document.getElementById('marquee');
if (track) track.innerHTML += track.innerHTML; // duplicate for seamless -50% loop

/* ============ Gallery dual-row marquees (duplicate for seamless loop) ============ */
['galRow1','galRow2'].forEach(id => {
  const row = document.getElementById(id);
  if (row) row.innerHTML += row.innerHTML;
});

/* ============ Gallery lightbox with navigation ============ */
(() => {
  // Build a unique, ordered list (rows are duplicated for the loop, so dedupe by src)
  const items = [], indexBySrc = new Map();
  document.querySelectorAll('.gal img').forEach(img => {
    const src = img.getAttribute('src');
    if (!indexBySrc.has(src)) {
      indexBySrc.set(src, items.length);
      items.push({ src, alt: img.alt || '', cap: img.nextElementSibling?.textContent?.trim() || '' });
    }
  });
  if (!items.length) return;

  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCap = document.getElementById('lbCap');
  const lbCounter = document.getElementById('lbCounter');
  let current = 0;

  const render = () => {
    const it = items[current];
    lbImg.src = it.src; lbImg.alt = it.alt;
    lbCap.textContent = it.cap;
    lbCounter.textContent = `${current + 1} / ${items.length}`;
  };
  const open = (i) => { current = (i + items.length) % items.length; render(); lb.classList.add('open'); lb.setAttribute('aria-hidden','false'); document.body.classList.add('menu-open'); };
  const close = () => { lb.classList.remove('open'); lb.setAttribute('aria-hidden','true'); document.body.classList.remove('menu-open'); };
  const go = (step) => { current = (current + step + items.length) % items.length; render(); };

  // delegate clicks at document level so both the home marquee rows and the gallery-page grid work
  document.addEventListener('click', (e) => {
    const tile = e.target.closest('.gal');
    if (!tile) return;
    const src = tile.querySelector('img')?.getAttribute('src');
    if (indexBySrc.has(src)) open(indexBySrc.get(src));
  });
  document.getElementById('lbClose').addEventListener('click', close);
  document.getElementById('lbPrev').addEventListener('click', () => go(-1));
  document.getElementById('lbNext').addEventListener('click', () => go(1));
  // click outside the image/controls closes
  lb.addEventListener('click', (e) => { if (e.target === lb || e.target.id === 'lbFigure') close(); });
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') go(-1);
    else if (e.key === 'ArrowRight') go(1);
  });
})();

/* ============ Accordion ============ */
document.querySelectorAll('.acc-item').forEach(item => {
  const q = item.querySelector('.acc-q');
  const a = item.querySelector('.acc-a');
  const setOpen = (open) => { a.style.maxHeight = open ? a.scrollHeight + 'px' : null; };
  // init open state
  if (item.classList.contains('active')) requestAnimationFrame(() => setOpen(true));
  q.addEventListener('click', () => {
    const isActive = item.classList.contains('active');
    document.querySelectorAll('.acc-item').forEach(o => {
      o.classList.remove('active');
      o.querySelector('.acc-a').style.maxHeight = null;
    });
    if (!isActive) { item.classList.add('active'); setOpen(true); }
  });
});
window.addEventListener('resize', () => {
  const open = document.querySelector('.acc-item.active .acc-a');
  if (open) open.style.maxHeight = open.scrollHeight + 'px';
});

/* ============ Reveal on scroll ============ */
const io = new IntersectionObserver((entries) => {
  entries.forEach(en => { if (en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target);} });
}, {threshold:.14});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ============ Animated count-up stats ============ */
const counters = document.querySelectorAll('[data-count]');
const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
const runCount = (el) => {
  const target = +el.dataset.count, suffix = el.querySelector('span')?.outerHTML || '', dur = 1700;
  let startTs = null;
  const frame = (ts) => {
    if (startTs === null) startTs = ts;
    const p = Math.min(1, (ts - startTs) / dur);
    el.innerHTML = Math.round(target * easeOutCubic(p)) + suffix;
    if (p < 1) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
};
const cio = new IntersectionObserver((entries) => {
  entries.forEach(en => { if (en.isIntersecting){ runCount(en.target); cio.unobserve(en.target); } });
}, {threshold:.5});
counters.forEach(c => cio.observe(c));

/* ============ Footer year ============ */
document.getElementById('year').textContent = new Date().getFullYear();
