'use strict';

document.addEventListener('DOMContentLoaded', () => {
  renderWishlist();
  window.addEventListener('wishlist-updated', renderWishlist);
});

function renderWishlist() {
  const container = document.getElementById('wishlist-container');
  const countEl   = document.getElementById('wishlist-count-label');
  if (!container) return;

  const items = Wishlist.get();
  if (countEl) countEl.textContent = `My Wishlist (${items.length})`;

  if (!items.length) {
    container.innerHTML = `
      <div class="empty-state animate-fade-in">
        <svg width="56" height="56" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>
        <h3>Your wishlist is empty</h3>
        <p>Save items you love and find them here</p>
        <a href="/pages/searchfeed" class="button_primary" style="margin-top:0.5rem">Browse Products</a>
      </div>`;
    return;
  }

  container.innerHTML = items.map((item, i) => `
    <div class="wishlist-item stagger-${Math.min(i+1,5)}" data-name="${item.name}">
      <img class="wishlist-item-img"
           src="${item.image?.startsWith('url(') ? item.image.slice(4,-1).replace(/['"]/g,'') : item.image}"
           alt="${item.name}" onerror="this.src='https://via.placeholder.com/80'"/>
      <div style="flex:1;min-width:0">
        <h3 style="font-weight:600;font-size:0.9375rem;color:var(--text-primary)">${item.name}</h3>
        <p style="font-size:0.875rem;color:var(--primary-dark);font-weight:600;margin:0.15rem 0">${item.price}</p>
        <p style="font-size:0.75rem;color:var(--text-muted)">by ${item.vendor || item.seller || 'Apna Mandi'}</p>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;flex-shrink:0">
        <button class="button_primary add-wish-btn" style="font-size:0.8125rem;padding:0.5rem 0.875rem"
                data-name="${item.name}" data-price="${item.price}" data-image="${item.image}" data-seller="${item.vendor || item.seller || 'Apna Mandi'}">
          Add to Cart
        </button>
        <button class="remove-wish-btn" style="font-size:0.8125rem;color:var(--error);font-weight:500"
                data-name="${item.name}">
          Remove
        </button>
      </div>
    </div>
  `).join('');

  // Add to cart
  container.querySelectorAll('.add-wish-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      Cart.add({ name: btn.dataset.name, price: btn.dataset.price, image: btn.dataset.image, seller: btn.dataset.seller });
      btn.textContent = '✓ Added';
      btn.style.background = 'var(--success)';
      setTimeout(() => { btn.textContent = 'Add to Cart'; btn.style.background = ''; }, 1500);
    });
  });

  // Remove
  container.querySelectorAll('.remove-wish-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.wishlist-item');
      card.classList.add('removing');
      setTimeout(() => {
        const items = Wishlist.get().filter(i => i.name !== btn.dataset.name);
        Wishlist.save(items);
      }, 300);
    });
  });
}
