'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initFAQ();
  initContactLinks();
  initLegalLinks();
});

function initFAQ() {
  // Native <details> handles open/close — just add smooth animation
  document.querySelectorAll('details.faq-item').forEach(detail => {
    const body = detail.querySelector('.faq-body');
    detail.addEventListener('toggle', () => {
      if (detail.open && body) {
        body.classList.add('animate-fade-in');
      }
    });
  });
}

function initContactLinks() {
  // Phone and email links work natively via href
  // Live chat placeholder
  document.getElementById('live-chat-btn')?.addEventListener('click', () => {
    showToast('Live chat coming soon!');
  });
}

function initLegalLinks() {
  const pages = {
    'terms-link':   () => showToast('Terms of Service — coming soon'),
    'privacy-link': () => showToast('Privacy Policy — coming soon'),
    'refund-link':  () => showToast('Refund Policy — coming soon')
  };
  Object.entries(pages).forEach(([id, fn]) => {
    document.getElementById(id)?.addEventListener('click', fn);
  });

  document.getElementById('vendor-guide-btn')?.addEventListener('click', () => {
    showToast('Vendor Guide — coming soon');
  });
}
