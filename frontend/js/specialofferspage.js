'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initAddButtons();
  initCardAnimations();
});

function initAddButtons() {
  document.querySelectorAll('.add-offer-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const card = btn.closest('.offer-card, .bulk-card');
      if (!card) return;

      const nameEl  = card.querySelector('.offer-name, h3, p.font-bold, p.text-xl');
      const priceEl = card.querySelector('.offer-price, p.font-bold');
      const imgEl   = card.querySelector('.offer-img, .bulk-card-img');

      Cart.add({
        name:   nameEl?.textContent?.trim()  || 'Special Offer',
        price:  priceEl?.textContent?.split(' ')[0]?.trim() || '₹0',
        image:  imgEl ? `url('${imgEl.style.backgroundImage.replace(/url\(['"]?|['"]?\)/g,'')}')` : '',
        seller: 'Special Offers'
      });

      btn.textContent = '✓ Added!';
      btn.style.background = 'var(--success)';
      btn.style.color = '#fff';
      setTimeout(() => {
        btn.textContent = 'Add';
        btn.style.background = '';
        btn.style.color = '';
      }, 1800);
    });
  });
}

function initCardAnimations() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        e.target.style.animationDelay = `${i * 0.08}s`;
        e.target.classList.add('animate-fade-in');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.offer-card, .bulk-card').forEach(el => obs.observe(el));
}
