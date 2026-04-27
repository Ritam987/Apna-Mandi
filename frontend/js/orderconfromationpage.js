'use strict';

document.addEventListener('DOMContentLoaded', () => {
  loadOrderData();
  initCopyOrderId();
});

function loadOrderData() {
  try {
    const data = JSON.parse(localStorage.getItem('orderData') || '{}');
    const orderId = data.orderId || `ORD${Date.now()}`;

    const idEl = document.getElementById('order-id');
    if (idEl) idEl.textContent = orderId;

    const itemsEl = document.getElementById('order-items-summary');
    if (itemsEl && data.items?.length) {
      itemsEl.innerHTML = data.items.map(item => `
        <div class="order-summary-row">
          <div>
            <p style="font-weight:500;font-size:0.9rem">${item.name}</p>
            <p style="font-size:0.8rem;color:var(--text-secondary)">${item.quantity} item${item.quantity > 1 ? 's' : ''}</p>
          </div>
          <p style="font-weight:600">₹${getItemTotal(item)}</p>
        </div>
      `).join('');
    }

    const totalEl = document.getElementById('order-total');
    if (totalEl && data.total) totalEl.textContent = `₹${data.total}`;

    // Animate success ring after short delay
    setTimeout(() => {
      document.querySelector('.success-ring')?.classList.add('animate-bounce-in');
    }, 100);
  } catch {}
}

function getItemTotal(item) {
  const m = String(item.price).match(/[\d.]+/);
  return m ? (parseFloat(m[0]) * item.quantity).toFixed(0) : '0';
}

function initCopyOrderId() {
  const badge = document.querySelector('.order-id-badge');
  badge?.addEventListener('click', () => {
    const id = document.getElementById('order-id')?.textContent;
    if (!id) return;
    navigator.clipboard.writeText(id).then(() => {
      showToast('Order ID copied!', 'success');
    }).catch(() => {
      showToast('Order ID: ' + id);
    });
  });
}

window.trackOrder = function() {
  const data = JSON.parse(localStorage.getItem('orderData') || '{}');
  window.location.href = `/pages/ordertracking?orderId=${data.orderId || ''}`;
};

window.continueShopping = function() {
  window.location.href = '/pages/Homepage';
};
