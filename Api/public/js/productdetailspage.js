'use strict';

document.addEventListener('DOMContentLoaded', () => {
  loadProduct();
  initQuantity();
  initTabs();
  initAddToCart();
  initWishlist();
});

let currentQty = 1;
let basePrice  = 45;

/* ── Load product from localStorage ────────────────────────── */
function loadProduct() {
  try {
    const data = JSON.parse(localStorage.getItem('selectedProduct') || '{}');
    if (!data.name) return;

    const imgEl    = document.querySelector('.product-hero-img');
    const nameEl   = document.querySelector('.product-name');
    const sellerEl = document.querySelector('.product-seller');
    const priceEl  = document.querySelector('.product-price');
    const descEl   = document.querySelector('.product-desc');
    const reviewEl = document.querySelector('.product-review');

    if (imgEl && data.image) imgEl.style.backgroundImage = data.image;
    if (nameEl)   nameEl.textContent   = data.name;
    if (sellerEl) sellerEl.textContent = `Sold by: ${data.seller || 'Apna Mandi'}`;

    const match = String(data.price).match(/[\d.]+/);
    if (match) { basePrice = parseFloat(match[0]); }
    if (priceEl) priceEl.textContent = `₹${basePrice} / kg`;

    if (descEl) {
      descEl.textContent = data.category === 'spices'
        ? `Premium quality ${data.name.toLowerCase()}, carefully selected and packaged for authentic Indian cooking.`
        : `Freshly sourced ${data.name.toLowerCase()}, perfect for everyday cooking. Delivered directly from local farms.`;
    }
    if (reviewEl) {
      reviewEl.textContent = `Excellent quality ${data.name.toLowerCase()}. Very fresh and exactly as described. Highly recommended!`;
    }
  } catch {}
}

/* ── Quantity ───────────────────────────────────────────────── */
function initQuantity() {
  const display = document.getElementById('qty-display');
  const minusBtn = document.getElementById('qty-minus');
  const plusBtn  = document.getElementById('qty-plus');
  const priceEl  = document.querySelector('.product-price');

  function update() {
    if (display) {
      display.textContent = `${currentQty} kg`;
      display.classList.add('bump');
      setTimeout(() => display.classList.remove('bump'), 300);
    }
    if (priceEl) priceEl.textContent = `₹${(basePrice * currentQty).toFixed(0)} / ${currentQty} kg`;
  }

  minusBtn?.addEventListener('click', () => { if (currentQty > 1) { currentQty--; update(); } });
  plusBtn?.addEventListener('click',  () => { if (currentQty < 50) { currentQty++; update(); } });
}

/* ── Tabs ───────────────────────────────────────────────────── */
function initTabs() {
  const tabs    = document.querySelectorAll('.detail-tab');
  const panels  = document.querySelectorAll('.detail-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.add('hidden'));
      tab.classList.add('active');
      const target = document.getElementById(tab.dataset.panel);
      target?.classList.remove('hidden');
    });
  });
}

/* ── Add to Cart ────────────────────────────────────────────── */
function initAddToCart() {
  const btn = document.getElementById('add-to-cart-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    try {
      const data = JSON.parse(localStorage.getItem('selectedProduct') || '{}');
      Cart.add({
        name:     data.name || 'Product',
        price:    `₹${basePrice}`,
        image:    data.image || '',
        seller:   data.seller || 'Apna Mandi',
        quantity: currentQty
      });
      btn.innerHTML = `✓ Added to Cart`;
      btn.style.background = 'var(--success)';
      setTimeout(() => {
        btn.innerHTML = `Add to Hub Cart`;
        btn.style.background = '';
        window.location.href = '/pages/hubcart';
      }, 1200);
    } catch {}
  });
}

/* ── Wishlist ───────────────────────────────────────────────── */
function initWishlist() {
  const btn = document.getElementById('wishlist-btn');
  if (!btn) return;
  try {
    const data = JSON.parse(localStorage.getItem('selectedProduct') || '{}');
    const isWished = Wishlist.has(data.name);
    updateWishBtn(btn, isWished);
    btn.addEventListener('click', () => {
      const added = Wishlist.toggle(data);
      updateWishBtn(btn, added);
    });
  } catch {}
}

function updateWishBtn(btn, active) {
  const svg = btn.querySelector('svg');
  if (!svg) return;
  svg.setAttribute('fill', active ? 'var(--error)' : 'none');
  svg.setAttribute('stroke', active ? 'var(--error)' : 'currentColor');
}
