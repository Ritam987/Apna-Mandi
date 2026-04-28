'use strict';

document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  window.addEventListener('cart-updated', renderCart);
});

function renderCart() {
  const container = document.getElementById('cart-items-container');
  if (!container) return;

  const items = Cart.get();

  if (!items.length) {
    container.innerHTML = `
      <div class="empty-state animate-fade-in">
        <svg width="56" height="56" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.4 5.6A1 1 0 007 20h10M7 13H5.4M9 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z"/>
        </svg>
        <h3>Your cart is empty</h3>
        <p>Add some fresh products to get started!</p>
        <div style="display:flex;flex-direction:column;gap:0.75rem;width:100%;max-width:280px;margin-top:0.5rem">
          <a href="/pages/searchfeed" class="button_primary" style="text-align:center">Browse Products</a>
          <a href="/pages/specialoffers" class="button_secondary" style="text-align:center">View Special Offers</a>
        </div>
      </div>`;
    hideSummary();
    return;
  }

  container.innerHTML = items.map((item, i) => `
    <div class="cart-item stagger-${Math.min(i+1,5)}" data-id="${item.id}">
      <div style="display:flex;align-items:flex-start;gap:0.875rem">
        <div class="cart-item-image" style="background-image:${item.image}"></div>
        <div style="flex:1;min-width:0">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:0.5rem">
            <div>
              <h3 style="font-weight:600;font-size:0.9375rem;color:var(--text-primary);line-height:1.3">${item.name}</h3>
              <p style="font-size:0.8125rem;color:var(--text-secondary);margin-top:0.1rem">by ${item.seller}</p>
              <p style="font-weight:700;font-size:1rem;color:var(--primary-dark);margin-top:0.25rem">${item.price}</p>
            </div>
            <button class="remove-btn" onclick="removeCartItem('${item.id}')" aria-label="Remove item">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-top:0.75rem">
            <div class="qty-controls">
              <button class="qty-btn" onclick="changeQty('${item.id}', -1)">−</button>
              <span class="qty-value" id="qty-${item.id}">${item.quantity}</span>
              <button class="qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
            </div>
            <span style="font-weight:600;font-size:0.9375rem;color:var(--text-primary)">
              ₹${getItemTotal(item)}
            </span>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  renderSummary(items);
}

function getItemTotal(item) {
  const m = String(item.price).match(/[\d.]+/);
  return m ? (parseFloat(m[0]) * item.quantity).toFixed(0) : '0';
}

function renderSummary(items) {
  const bar = document.getElementById('cart-summary-bar');
  if (!bar) return;

  const subtotal = items.reduce((s, i) => {
    const m = String(i.price).match(/[\d.]+/);
    return s + (m ? parseFloat(m[0]) * i.quantity : 0);
  }, 0);
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  bar.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:0.5rem;margin-bottom:0.875rem">
      <div class="price-row">
        <span style="color:var(--text-secondary)">Subtotal (${totalItems} item${totalItems !== 1 ? 's' : ''})</span>
        <span style="font-weight:600">₹${subtotal.toFixed(0)}</span>
      </div>
      <div class="price-row">
        <span style="color:var(--text-secondary)">Delivery Fee</span>
        <span style="font-weight:600;color:var(--success)">Free</span>
      </div>
      <div class="price-row" style="font-weight:700;font-size:1.0625rem;border-top:1px solid var(--border-light);padding-top:0.5rem;margin-top:0.25rem">
        <span>Total</span>
        <span>₹${subtotal.toFixed(0)}</span>
      </div>
    </div>
    <button class="button_primary" style="width:100%" onclick="proceedToDelivery()">
      Continue to Delivery
    </button>`;
  bar.style.display = 'block';
}

function hideSummary() {
  const bar = document.getElementById('cart-summary-bar');
  if (bar) bar.style.display = 'none';
}

/* ── Global handlers (called from inline onclick) ───────────── */
window.changeQty = function(id, delta) {
  const items = Cart.get();
  const item  = items.find(i => String(i.id) === String(id));
  if (!item) return;
  const newQty = item.quantity + delta;
  if (newQty <= 0) { removeCartItem(id); return; }
  Cart.updateQty(item.id, newQty);
  const el = document.getElementById(`qty-${id}`);
  if (el) {
    el.textContent = newQty;
    el.classList.add('bump');
    setTimeout(() => el.classList.remove('bump'), 300);
  }
  renderCart();
};

window.removeCartItem = function(id) {
  const card = document.querySelector(`[data-id="${id}"]`);
  if (card) {
    card.style.transition = 'all 0.3s ease';
    card.style.opacity = '0';
    card.style.transform = 'translateX(60px)';
    setTimeout(() => {
      Cart.remove(parseFloat(id));
      renderCart();
    }, 280);
  } else {
    Cart.remove(parseFloat(id));
    renderCart();
  }
};

window.proceedToDelivery = function() {
  const items = Cart.get();
  if (!items.length) { showToast('Your cart is empty', 'error'); return; }
  window.location.href = '/pages/deliveryinfo';
};
