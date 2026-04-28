'use strict';

document.addEventListener('DOMContentLoaded', () => {
  renderOrderSummary();
  initPaymentOptions();
  initCoupon();
  initPlaceOrder();
});

function renderOrderSummary() {
  const container = document.getElementById('order-items');
  const items = Cart.get();
  if (!container) return;

  if (!items.length) {
    window.location.href = '/pages/hubcart';
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="order-item-row">
      <div style="width:3rem;height:3rem;border-radius:var(--radius-md);background-size:cover;background-position:center;flex-shrink:0"
           style="background-image:${item.image}"></div>
      <div style="flex:1;min-width:0">
        <p style="font-weight:500;font-size:0.875rem;color:var(--text-primary)">${item.name}</p>
        <p style="font-size:0.75rem;color:var(--text-secondary)">${item.quantity} × ${item.price}</p>
      </div>
      <p style="font-weight:600;font-size:0.9375rem;flex-shrink:0">₹${getItemTotal(item)}</p>
    </div>
  `).join('');

  updateTotals();
}

function getItemTotal(item) {
  const m = String(item.price).match(/[\d.]+/);
  return m ? (parseFloat(m[0]) * item.quantity).toFixed(0) : '0';
}

function updateTotals(discount = 0) {
  const items    = Cart.get();
  const subtotal = items.reduce((s, i) => {
    const m = String(i.price).match(/[\d.]+/);
    return s + (m ? parseFloat(m[0]) * i.quantity : 0);
  }, 0);
  const delivery = 0;
  const total    = subtotal - discount + delivery;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('subtotal-val',  `₹${subtotal.toFixed(0)}`);
  set('delivery-val',  delivery === 0 ? 'Free' : `₹${delivery}`);
  set('discount-val',  discount > 0 ? `-₹${discount.toFixed(0)}` : '—');
  set('total-val',     `₹${total.toFixed(0)}`);
}

function initPaymentOptions() {
  document.querySelectorAll('.payment-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      const radio = opt.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });
  // Select first by default
  document.querySelector('.payment-option')?.click();
}

function initCoupon() {
  const btn   = document.getElementById('apply-coupon');
  const input = document.getElementById('coupon-input');
  const msg   = document.getElementById('coupon-msg');

  const COUPONS = { 'APNA10': 10, 'MANDI20': 20, 'FRESH50': 50 };

  btn?.addEventListener('click', () => {
    const code = input?.value.trim().toUpperCase();
    if (!code) { showToast('Enter a coupon code', 'error'); return; }
    if (COUPONS[code]) {
      const disc = COUPONS[code];
      updateTotals(disc);
      if (msg) { msg.textContent = `✓ Coupon applied! ₹${disc} off`; msg.style.color = 'var(--success)'; }
      input.disabled = true;
      btn.disabled = true;
      showToast(`Coupon applied! ₹${disc} off`, 'success');
    } else {
      if (msg) { msg.textContent = 'Invalid coupon code'; msg.style.color = 'var(--error)'; }
      input.classList.add('input-error', 'animate-shake');
      setTimeout(() => input.classList.remove('animate-shake', 'input-error'), 700);
    }
  });
}

function initPlaceOrder() {
  const btn = document.getElementById('place-order-btn');
  btn?.addEventListener('click', () => {
    const paymentOpt = document.querySelector('.payment-option.selected, input[name="payment"]:checked');
    if (!paymentOpt) { showToast('Please select a payment method', 'error'); return; }

    btn.disabled = true;
    btn.innerHTML = `<span class="spinner spinner-dark"></span> Processing…`;

    setTimeout(() => {
      const orderId = `ORD${Date.now()}`;
      const items   = Cart.get();
      const total   = Cart.total();
      localStorage.setItem('orderData', JSON.stringify({ orderId, items, total, placedAt: new Date().toISOString() }));
      Cart.clear();
      window.location.href = '/pages/orderconfirmation';
    }, 1800);
  });
}
