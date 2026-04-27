'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initLocation();
  initSearch();
  initHeroSlider();
  initFlashSaleCountdown();
  initCards();
  initSectionReveal();
});

/* ── Location display ───────────────────────────────────────── */
function initLocation() {
  const el = document.querySelector('.location-text');
  if (!el) return;
  try {
    const loc = JSON.parse(localStorage.getItem('locationData') || '{}');
    if (loc.location) el.textContent = loc.location;
  } catch {}
}

/* ── Search ─────────────────────────────────────────────────── */
function initSearch() {
  const input = document.getElementById('homepage-search');
  if (!input) return;

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const q = input.value.trim();
      if (q) {
        localStorage.setItem('searchQuery', q);
        window.location.href = '/pages/searchfeed';
      }
    }
  });

  // Tap on search bar → go to search page
  input.addEventListener('focus', () => {
    const q = input.value.trim();
    if (!q) {
      setTimeout(() => { window.location.href = '/pages/searchfeed'; }, 150);
    }
  });
}

/* ── Hero Slider ────────────────────────────────────────────── */
function initHeroSlider() {
  const slider    = document.querySelector('.hero-slider');
  const dots      = document.querySelectorAll('.slider-dot');
  const prevBtn   = document.querySelector('.slider-prev');
  const nextBtn   = document.querySelector('.slider-next');
  if (!slider) return;

  const total = slider.children.length;
  let current = 0;
  let autoTimer;

  function goTo(idx) {
    current = (idx + total) % total;
    slider.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 3500);
  }

  prevBtn?.addEventListener('click', () => { goTo(current - 1); startAuto(); });
  nextBtn?.addEventListener('click', () => { goTo(current + 1); startAuto(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); startAuto(); }));

  // Touch swipe
  let touchX = 0;
  slider.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    const diff = touchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { goTo(diff > 0 ? current + 1 : current - 1); startAuto(); }
  });

  goTo(0);
  startAuto();
}

/* ── Flash Sale Countdown ───────────────────────────────────── */
function initFlashSaleCountdown() {
  const el = document.querySelector('.countdown-badge');
  if (!el) return;

  // Set end time 2 hours from now if not stored
  let endTime = parseInt(localStorage.getItem('flashSaleEnd') || '0');
  if (!endTime || endTime < Date.now()) {
    endTime = Date.now() + 2 * 60 * 60 * 1000;
    localStorage.setItem('flashSaleEnd', endTime);
  }

  function tick() {
    const diff = endTime - Date.now();
    if (diff <= 0) { el.textContent = 'Ended'; return; }
    const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
    const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
    el.textContent = `${h}:${m}:${s}`;
  }
  tick();
  setInterval(tick, 1000);
}

/* ── Clickable Cards ────────────────────────────────────────── */
function initCards() {
  // Flash sale cards
  document.querySelectorAll('.flash-sale-card').forEach(card => {
    card.addEventListener('click', () => {
      storeProduct(card);
      window.location.href = '/pages/productdetails';
    });
  });

  // Category items
  document.querySelectorAll('.category-item').forEach(item => {
    item.addEventListener('click', () => {
      const cat = item.dataset.category;
      if (cat) localStorage.setItem('selectedCategory', cat);
      window.location.href = '/pages/searchfeed';
    });
  });

  // Continue shopping & top deals
  document.querySelectorAll('.continue-shopping-card, .top-deals-card').forEach(card => {
    card.addEventListener('click', () => {
      storeProduct(card);
      window.location.href = '/pages/productdetails';
    });
  });
}

function storeProduct(card) {
  const nameEl  = card.querySelector('p');
  const priceEl = card.querySelector('.text-red-600, .font-bold');
  const imgEl   = card.querySelector('.bg-cover');
  localStorage.setItem('selectedProduct', JSON.stringify({
    name:   nameEl?.textContent?.trim()  || 'Product',
    price:  priceEl?.textContent?.trim() || '₹0',
    image:  imgEl?.style?.backgroundImage || '',
    seller: 'Apna Mandi',
    category: 'general'
  }));
}

/* ── Section Reveal ─────────────────────────────────────────── */
function initSectionReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        e.target.style.transitionDelay = `${i * 0.06}s`;
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.section-reveal').forEach(el => obs.observe(el));
}
