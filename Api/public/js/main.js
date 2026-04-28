/* ============================================================
   APNA MANDI — Shared Utilities
   ============================================================ */

'use strict';

/* ── Toast ──────────────────────────────────────────────────── */
window.showToast = function(message, type = 'default', duration = 2500) {
  let toast = document.getElementById('am-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'am-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.background = type === 'success' ? 'var(--success)'
                         : type === 'error'   ? 'var(--error)'
                         : 'var(--text-primary)';
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
};

/* ── Cart helpers ───────────────────────────────────────────── */
window.Cart = {
  get() {
    try { return JSON.parse(localStorage.getItem('cartItems') || '[]'); }
    catch { return []; }
  },
  save(items) {
    localStorage.setItem('cartItems', JSON.stringify(items));
    window.dispatchEvent(new Event('cart-updated'));
  },
  add(product) {
    const items = this.get();
    const idx = items.findIndex(i => i.name === product.name);
    if (idx !== -1) {
      items[idx].quantity += (product.quantity || 1);
    } else {
      items.push({
        id: Date.now() + Math.random(),
        name: product.name,
        price: product.price,
        image: product.image || '',
        seller: product.seller || 'Apna Mandi',
        quantity: product.quantity || 1,
        addedAt: new Date().toISOString()
      });
    }
    this.save(items);
    showToast(`${product.name} added to cart`, 'success');
  },
  remove(id) {
    this.save(this.get().filter(i => i.id !== id));
  },
  updateQty(id, qty) {
    const items = this.get();
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) return;
    if (qty <= 0) { this.remove(id); return; }
    items[idx].quantity = qty;
    this.save(items);
  },
  count() {
    return this.get().reduce((s, i) => s + i.quantity, 0);
  },
  total() {
    return this.get().reduce((s, i) => {
      const m = String(i.price).match(/[\d.]+/);
      return s + (m ? parseFloat(m[0]) * i.quantity : 0);
    }, 0);
  },
  clear() { this.save([]); }
};

/* ── Wishlist helpers ───────────────────────────────────────── */
window.Wishlist = {
  get() {
    try { return JSON.parse(localStorage.getItem('wishlistItems') || '[]'); }
    catch { return []; }
  },
  save(items) {
    localStorage.setItem('wishlistItems', JSON.stringify(items));
    window.dispatchEvent(new Event('wishlist-updated'));
  },
  toggle(product) {
    const items = this.get();
    const idx = items.findIndex(i => i.name === product.name);
    if (idx !== -1) {
      items.splice(idx, 1);
      this.save(items);
      showToast('Removed from wishlist');
      return false;
    } else {
      items.push({ id: Date.now(), ...product, addedAt: new Date().toISOString() });
      this.save(items);
      showToast('Added to wishlist ♥', 'success');
      return true;
    }
  },
  has(name) { return this.get().some(i => i.name === name); },
  count() { return this.get().length; }
};

/* ── User helpers ───────────────────────────────────────────── */
window.User = {
  get() {
    try { return JSON.parse(localStorage.getItem('userData') || 'null'); }
    catch { return null; }
  },
  isLoggedIn() { const u = this.get(); return !!(u && u.phone); },
  save(data) { localStorage.setItem('userData', JSON.stringify(data)); },
  logout() {
    localStorage.removeItem('userData');
    localStorage.removeItem('locationData');
    window.location.href = '/pages/login';
  }
};

/* ── Nav badge updater ──────────────────────────────────────── */
function updateNavBadges() {
  const cartCount = Cart.count();
  const wishCount = Wishlist.count();

  document.querySelectorAll('#cart-count').forEach(el => {
    el.textContent = cartCount;
    el.style.display = cartCount > 0 ? 'flex' : 'none';
  });
  document.querySelectorAll('#wishlist-count').forEach(el => {
    el.textContent = wishCount;
    el.style.display = wishCount > 0 ? 'flex' : 'none';
  });
}

window.addEventListener('cart-updated',     updateNavBadges);
window.addEventListener('wishlist-updated', updateNavBadges);
document.addEventListener('DOMContentLoaded', updateNavBadges);

/* ── Page entrance animation ────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const main = document.querySelector('main') || document.querySelector('.page-wrapper');
  if (main) main.classList.add('page-enter');
});

/* ── Intersection Observer for scroll reveals ───────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.section-reveal').forEach(el => observer.observe(el));
});

/* ── Ripple effect on buttons ───────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.button_primary, .button_secondary');
    if (!btn) return;
    const ripple = document.createElement('span');
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position:absolute; border-radius:50%; pointer-events:none;
      width:${size}px; height:${size}px;
      left:${e.clientX - rect.left - size/2}px;
      top:${e.clientY - rect.top - size/2}px;
      background:rgba(0,0,0,.08);
      transform:scale(0); animation:ripple-anim 0.5s ease-out forwards;
    `;
    if (getComputedStyle(btn).position === 'static') btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });

  const style = document.createElement('style');
  style.textContent = `@keyframes ripple-anim { to { transform:scale(2.5); opacity:0; } }`;
  document.head.appendChild(style);
});
