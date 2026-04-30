'use strict';

/* ── Mock Data ─────────────────────────────────────────────── */

const SO_FLASH_ITEMS = [
  {
    id: 'fs-1',
    name: 'Alphonso Mangoes',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=300&q=80',
    originalPrice: 320,
    discountedPrice: 199,
    discountPct: 38,
    unit: '1 kg',
    category: 'flash'
  },
  {
    id: 'fs-2',
    name: 'Fresh Strawberries',
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=300&q=80',
    originalPrice: 180,
    discountedPrice: 99,
    discountPct: 45,
    unit: '250 g',
    category: 'flash'
  },
  {
    id: 'fs-3',
    name: 'Organic Spinach',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&q=80',
    originalPrice: 60,
    discountedPrice: 35,
    discountPct: 42,
    unit: '500 g',
    category: 'flash'
  },
  {
    id: 'fs-4',
    name: 'Cherry Tomatoes',
    image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=300&q=80',
    originalPrice: 90,
    discountedPrice: 55,
    discountPct: 39,
    unit: '500 g',
    category: 'flash'
  },
  {
    id: 'fs-5',
    name: 'Dragon Fruit',
    image: 'https://images.unsplash.com/photo-1527325678964-54921661f888?w=300&q=80',
    originalPrice: 250,
    discountedPrice: 149,
    discountPct: 40,
    unit: '1 piece',
    category: 'flash'
  }
];

const SO_BULK_ITEMS = [
  {
    id: 'bk-1',
    name: 'Basmati Rice',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&q=80',
    originalPrice: 850,
    discountedPrice: 699,
    discountPct: 18,
    unit: 'per kg',
    bulkQty: '10 kg pack',
    category: 'bulk'
  },
  {
    id: 'bk-2',
    name: 'Yellow Lentils (Dal)',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300&q=80',
    originalPrice: 480,
    discountedPrice: 380,
    discountPct: 21,
    unit: 'per kg',
    bulkQty: '5 kg pack',
    category: 'bulk'
  },
  {
    id: 'bk-3',
    name: 'Onions',
    image: 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=300&q=80',
    originalPrice: 350,
    discountedPrice: 249,
    discountPct: 29,
    unit: 'per kg',
    bulkQty: '10 kg sack',
    category: 'bulk'
  }
];

const SO_SEASONAL_ITEMS = [
  {
    id: 'sn-1',
    name: 'Watermelon',
    image: 'https://images.unsplash.com/photo-1563114773-84221bd62daa?w=300&q=80',
    originalPrice: 80,
    discountedPrice: 55,
    discountPct: 31,
    unit: 'per kg',
    category: 'seasonal'
  },
  {
    id: 'sn-2',
    name: 'Sweet Corn',
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=300&q=80',
    originalPrice: 40,
    discountedPrice: 25,
    discountPct: 38,
    unit: '2 cobs',
    category: 'seasonal'
  },
  {
    id: 'sn-3',
    name: 'Litchi',
    image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=300&q=80',
    originalPrice: 120,
    discountedPrice: 79,
    discountPct: 34,
    unit: '500 g',
    category: 'seasonal'
  },
  {
    id: 'sn-4',
    name: 'Raw Mango',
    image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=300&q=80',
    originalPrice: 70,
    discountedPrice: 45,
    discountPct: 36,
    unit: '500 g',
    category: 'seasonal'
  }
];

const SO_SURPLUS_ITEMS = [
  {
    id: 'sp-1',
    name: 'Mixed Vegetables',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&q=80',
    originalPrice: 150,
    discountedPrice: 79,
    discountPct: 47,
    unit: '1 kg assorted',
    category: 'surplus'
  },
  {
    id: 'sp-2',
    name: 'Overripe Bananas',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&q=80',
    originalPrice: 60,
    discountedPrice: 25,
    discountPct: 58,
    unit: '1 dozen',
    category: 'surplus'
  }
];

/* ── Countdown ─────────────────────────────────────────────── */

function initCountdown() {
  const KEY = 'soCountdownEnd';
  const TWO_HOURS = 2 * 60 * 60 * 1000;
  const el = document.getElementById('so-countdown');
  if (!el) return;

  let target = parseInt(localStorage.getItem(KEY), 10);
  if (!target || target <= Date.now()) {
    target = Date.now() + TWO_HOURS;
    localStorage.setItem(KEY, String(target));
  }

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      el.textContent = 'Ended';
      return;
    }
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    el.textContent =
      String(h).padStart(2, '0') + ':' +
      String(m).padStart(2, '0') + ':' +
      String(s).padStart(2, '0');
  }

  tick();
  setInterval(tick, 1000);
}

/* ── Render helpers ────────────────────────────────────────── */

function offerCardHTML(item) {
  return `
    <div class="offer-card">
      <div class="offer-card__img-wrap">
        <img class="offer-card__img" src="${item.image}" alt="${item.name}" loading="lazy"/>
        <span class="discount-badge" style="position:absolute;top:6px;left:6px">${item.discountPct}% OFF</span>
      </div>
      <div class="offer-card__body">
        <p class="offer-card__name">${item.name}</p>
        <p class="offer-card__unit">${item.unit}</p>
        <div class="offer-card__prices">
          <span class="offer-card__price">₹${item.discountedPrice}</span>
          <span class="offer-card__mrp">₹${item.originalPrice}</span>
        </div>
        <button
          class="so-add-btn"
          data-id="${item.id}"
          data-name="${item.name}"
          data-price="${item.discountedPrice}"
          data-image="${item.image}"
        >Add</button>
      </div>
    </div>`;
}

function renderFlashSale(items) {
  const container = document.getElementById('so-featured-list');
  if (!container) return;
  container.innerHTML = items.map(offerCardHTML).join('');
}

function renderBulk(items) {
  const container = document.getElementById('so-bulk-list');
  if (!container) return;
  container.innerHTML = items.map(item => `
    <div class="bulk-card">
      <img class="bulk-card__img" src="${item.image}" alt="${item.name}" loading="lazy"/>
      <div class="bulk-card__info">
        <p class="bulk-card__name">${item.name}</p>
        <p class="bulk-card__qty">${item.bulkQty}</p>
        <p class="bulk-card__price">₹${item.discountedPrice} <span style="font-size:0.72rem;font-weight:400;color:var(--text-muted)">${item.unit}</span></p>
        <button
          class="so-add-btn"
          data-id="${item.id}"
          data-name="${item.name}"
          data-price="${item.discountedPrice}"
          data-image="${item.image}"
        >Add</button>
      </div>
    </div>`).join('');
}

function renderSeasonal(items) {
  const container = document.getElementById('so-seasonal-list');
  if (!container) return;
  container.innerHTML = items.map(offerCardHTML).join('');
}

function renderSurplus(items) {
  const container = document.getElementById('so-surplus-list');
  if (!container) return;
  container.innerHTML = items.map(offerCardHTML).join('');
}

/* ── Filter chips ──────────────────────────────────────────── */

function initFilterChips() {
  const sectionMap = {
    flash:    'so-featured-section',
    bulk:     'so-bulk-section',
    seasonal: 'so-seasonal-section',
    surplus:  'so-surplus-section'
  };

  const chips = document.querySelectorAll('.so-filters .chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const filter = chip.dataset.filter;
      Object.values(sectionMap).forEach(id => {
        const sec = document.getElementById(id);
        if (sec) sec.style.display = 'block';
      });

      if (filter !== 'all') {
        Object.entries(sectionMap).forEach(([key, id]) => {
          if (key !== filter) {
            const sec = document.getElementById(id);
            if (sec) sec.style.display = 'none';
          }
        });
      }
    });
  });
}

/* ── Add to cart ───────────────────────────────────────────── */

function initAddButtons() {
  const root = document.querySelector('.so-main');
  if (!root) return;

  root.addEventListener('click', e => {
    const btn = e.target.closest('.so-add-btn');
    if (!btn) return;

    const { id, name, price, image } = btn.dataset;

    // Read existing cart
    let cart = [];
    try {
      cart = JSON.parse(localStorage.getItem('apnaMandi_cart') || '[]');
    } catch (_) {
      cart = [];
    }

    // Add item
    cart.push({
      id: Date.now() + Math.random(),
      name,
      price: parseFloat(price),
      qty: 1,
      image
    });
    localStorage.setItem('apnaMandi_cart', JSON.stringify(cart));

    // Visual feedback
    btn.textContent = '✓ Added!';
    btn.classList.add('added');
    setTimeout(() => {
      btn.textContent = 'Add';
      btn.classList.remove('added');
    }, 1800);

    // Toast
    if (typeof window.showToast === 'function') {
      window.showToast(name + ' added to cart', 'success');
    }
  });
}

/* ── Reveal animations ─────────────────────────────────────── */

function initRevealAnimations() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.offer-card, .bulk-card').forEach(el => obs.observe(el));
}

/* ── Boot ──────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  renderFlashSale(SO_FLASH_ITEMS);
  renderBulk(SO_BULK_ITEMS);
  renderSeasonal(SO_SEASONAL_ITEMS);
  renderSurplus(SO_SURPLUS_ITEMS);
  initFilterChips();
  initAddButtons();
  initRevealAnimations();
});
