'use strict';

document.addEventListener('DOMContentLoaded', () => {
  loadOrderData();
  animateTimeline();
  animateProgressBar();
  initButtons();
});

function loadOrderData() {
  try {
    const params  = new URLSearchParams(window.location.search);
    const data    = JSON.parse(localStorage.getItem('orderData') || '{}');
    const orderId = params.get('orderId') || data.orderId || '12345';

    const headerEl = document.querySelector('.order-id-header');
    if (headerEl) headerEl.textContent = `Track Order #${orderId}`;

    if (data.items?.length) {
      const container = document.getElementById('order-summary-items');
      if (container) {
        container.innerHTML = data.items.map(item => `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:0.4rem 0;border-bottom:1px solid var(--border-light)">
            <div>
              <p style="font-weight:500;font-size:0.875rem">${item.name}</p>
              <p style="font-size:0.75rem;color:var(--text-secondary)">${item.quantity} kg</p>
            </div>
            <p style="font-weight:600;font-size:0.875rem">₹${getItemTotal(item)}</p>
          </div>
        `).join('');
      }
      const totalEl = document.getElementById('order-total');
      if (totalEl && data.total) totalEl.textContent = `₹${data.total}`;
    }
  } catch {}
}

function getItemTotal(item) {
  const m = String(item.price).match(/[\d.]+/);
  return m ? (parseFloat(m[0]) * item.quantity).toFixed(0) : '0';
}

function animateProgressBar() {
  const fill = document.querySelector('.track-progress-fill');
  if (!fill) return;
  fill.style.width = '0';
  setTimeout(() => { fill.style.width = '100%'; }, 300);
}

function animateTimeline() {
  const items = document.querySelectorAll('.timeline-item');
  items.forEach((item, i) => {
    item.style.animationDelay = `${i * 0.15}s`;
    item.classList.add('animate-fade-in');
  });
}

function initButtons() {
  document.getElementById('reorder-btn')?.addEventListener('click', () => {
    const btn = document.getElementById('reorder-btn');
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner spinner-dark"></span> Processing…`;
    setTimeout(() => { window.location.href = '/pages/checkout'; }, 1000);
  });

  document.getElementById('support-btn')?.addEventListener('click', () => {
    window.location.href = '/pages/help';
  });

  // Copy transaction ID
  document.querySelector('.transaction-id')?.addEventListener('click', function() {
    const id = this.textContent.split(': ')[1];
    if (!id) return;
    navigator.clipboard.writeText(id).then(() => showToast('Transaction ID copied!', 'success'));
  });
}
