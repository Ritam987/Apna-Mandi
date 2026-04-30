/* ============================================================
   APNA MANDI — Shared Utilities & Helpers
   ============================================================
   
   This file contains global utilities, helper functions, and
   state management for the Apna Mandi application.
   
   Contents:
   - Toast notifications
   - LocalStorage helpers (Cart, Wishlist, User)
   - Utility functions (debounce, throttle, formatters)
   - DOM helpers
   - Animation utilities
   - Navigation badge updates
   
   ============================================================ */

'use strict';

/* ── Toast Notifications ────────────────────────────────────── */

/**
 * Display a toast notification message
 * @param {string} message - The message to display
 * @param {string} [type='default'] - Toast type: 'success', 'error', 'warning', 'info', or 'default'
 * @param {number} [duration=2500] - Duration in milliseconds before auto-hide
 * @example
 * showToast('Item added to cart', 'success');
 * showToast('Please fill all fields', 'error', 3000);
 */
window.showToast = function(message, type = 'default', duration = 2500) {
  try {
    let toast = document.getElementById('am-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'am-toast';
      toast.className = 'toast';
      toast.setAttribute('role', 'alert');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    
    // Set background color based on type
    const colors = {
      success: 'var(--success)',
      error: 'var(--error)',
      warning: 'var(--warning)',
      info: 'var(--info)',
      default: 'var(--text-primary)'
    };
    toast.style.background = colors[type] || colors.default;
    
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
  } catch (err) {
    console.error('Toast error:', err);
  }
};

/* ── Cart Helpers ───────────────────────────────────────────── */

/**
 * Cart management utilities
 * @namespace Cart
 */
window.Cart = {
  /**
   * Get all cart items from localStorage
   * @returns {Array} Array of cart items
   */
  get() {
    try {
      const data = localStorage.getItem('apnaMandi_cart');
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.error('Cart get error:', err);
      return [];
    }
  },

  /**
   * Save cart items to localStorage
   * @param {Array} items - Array of cart items to save
   */
  save(items) {
    try {
      localStorage.setItem('apnaMandi_cart', JSON.stringify(items));
      window.dispatchEvent(new Event('cart-updated'));
    } catch (err) {
      console.error('Cart save error:', err);
      showToast('Failed to update cart', 'error');
    }
  },

  /**
   * Add a product to the cart
   * @param {Object} product - Product object with name, price, image, etc.
   * @param {string} product.name - Product name (required)
   * @param {string|number} product.price - Product price
   * @param {string} [product.image] - Product image URL
   * @param {string} [product.seller] - Seller name
   * @param {number} [product.quantity=1] - Quantity to add
   */
  add(product) {
    try {
      if (!product || !product.name) {
        throw new Error('Invalid product data');
      }

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
    } catch (err) {
      console.error('Cart add error:', err);
      showToast('Failed to add item to cart', 'error');
    }
  },

  /**
   * Remove an item from the cart
   * @param {string|number} id - Item ID to remove
   */
  remove(id) {
    try {
      this.save(this.get().filter(i => i.id !== id));
    } catch (err) {
      console.error('Cart remove error:', err);
      showToast('Failed to remove item', 'error');
    }
  },

  /**
   * Update item quantity in cart
   * @param {string|number} id - Item ID
   * @param {number} qty - New quantity (0 or negative removes item)
   */
  updateQty(id, qty) {
    try {
      const items = this.get();
      const idx = items.findIndex(i => i.id === id);
      if (idx === -1) return;
      
      if (qty <= 0) {
        this.remove(id);
        return;
      }
      
      items[idx].quantity = qty;
      this.save(items);
    } catch (err) {
      console.error('Cart updateQty error:', err);
      showToast('Failed to update quantity', 'error');
    }
  },

  /**
   * Get total number of items in cart
   * @returns {number} Total item count
   */
  count() {
    try {
      return this.get().reduce((sum, item) => sum + (item.quantity || 0), 0);
    } catch (err) {
      console.error('Cart count error:', err);
      return 0;
    }
  },

  /**
   * Calculate cart total price
   * @returns {number} Total price
   */
  total() {
    try {
      return this.get().reduce((sum, item) => {
        const match = String(item.price).match(/[\d.]+/);
        const price = match ? parseFloat(match[0]) : 0;
        return sum + (price * (item.quantity || 0));
      }, 0);
    } catch (err) {
      console.error('Cart total error:', err);
      return 0;
    }
  },

  /**
   * Clear all items from cart
   */
  clear() {
    try {
      this.save([]);
      showToast('Cart cleared', 'success');
    } catch (err) {
      console.error('Cart clear error:', err);
      showToast('Failed to clear cart', 'error');
    }
  }
};

/* ── Wishlist Helpers ───────────────────────────────────────── */

/**
 * Wishlist management utilities
 * @namespace Wishlist
 */
window.Wishlist = {
  /**
   * Get all wishlist items from localStorage
   * @returns {Array} Array of wishlist items
   */
  get() {
    try {
      const data = localStorage.getItem('apnaMandi_wishlist');
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.error('Wishlist get error:', err);
      return [];
    }
  },

  /**
   * Save wishlist items to localStorage
   * @param {Array} items - Array of wishlist items to save
   */
  save(items) {
    try {
      localStorage.setItem('apnaMandi_wishlist', JSON.stringify(items));
      window.dispatchEvent(new Event('wishlist-updated'));
    } catch (err) {
      console.error('Wishlist save error:', err);
      showToast('Failed to update wishlist', 'error');
    }
  },

  /**
   * Toggle product in wishlist (add if not present, remove if present)
   * @param {Object} product - Product object
   * @returns {boolean} True if added, false if removed
   */
  toggle(product) {
    try {
      if (!product || !product.name) {
        throw new Error('Invalid product data');
      }

      const items = this.get();
      const idx = items.findIndex(i => i.name === product.name);
      
      if (idx !== -1) {
        items.splice(idx, 1);
        this.save(items);
        showToast('Removed from wishlist');
        return false;
      } else {
        items.push({
          id: Date.now(),
          ...product,
          addedAt: new Date().toISOString()
        });
        this.save(items);
        showToast('Added to wishlist ♥', 'success');
        return true;
      }
    } catch (err) {
      console.error('Wishlist toggle error:', err);
      showToast('Failed to update wishlist', 'error');
      return false;
    }
  },

  /**
   * Check if product is in wishlist
   * @param {string} name - Product name
   * @returns {boolean} True if in wishlist
   */
  has(name) {
    try {
      return this.get().some(i => i.name === name);
    } catch (err) {
      console.error('Wishlist has error:', err);
      return false;
    }
  },

  /**
   * Get wishlist item count
   * @returns {number} Number of items in wishlist
   */
  count() {
    try {
      return this.get().length;
    } catch (err) {
      console.error('Wishlist count error:', err);
      return 0;
    }
  }
};

/* ── User Helpers ───────────────────────────────────────────── */

/**
 * User authentication and profile management
 * @namespace User
 */
window.User = {
  /**
   * Get user data from localStorage
   * @returns {Object|null} User object or null if not logged in
   */
  get() {
    try {
      const data = localStorage.getItem('userData');
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error('User get error:', err);
      return null;
    }
  },

  /**
   * Check if user is logged in
   * @returns {boolean} True if user is logged in
   */
  isLoggedIn() {
    try {
      const user = this.get();
      return !!(user && user.phone);
    } catch (err) {
      console.error('User isLoggedIn error:', err);
      return false;
    }
  },

  /**
   * Save user data to localStorage
   * @param {Object} data - User data object
   */
  save(data) {
    try {
      localStorage.setItem('userData', JSON.stringify(data));
    } catch (err) {
      console.error('User save error:', err);
      showToast('Failed to save user data', 'error');
    }
  },

  /**
   * Logout user and clear all data
   */
  logout() {
    try {
      localStorage.removeItem('userData');
      localStorage.removeItem('locationData');
      window.location.href = '/pages/login';
    } catch (err) {
      console.error('User logout error:', err);
      showToast('Logout failed', 'error');
    }
  }
};

/* ── Utility Functions ──────────────────────────────────────── */

/**
 * Debounce function - delays execution until after wait time has elapsed
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 * @example
 * const debouncedSearch = debounce(searchFunction, 500);
 * input.addEventListener('input', debouncedSearch);
 */
window.debounce = function(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function - limits execution to once per wait period
 * @param {Function} func - Function to throttle
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Throttled function
 * @example
 * const throttledScroll = throttle(handleScroll, 100);
 * window.addEventListener('scroll', throttledScroll);
 */
window.throttle = function(func, wait) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, wait);
    }
  };
};

/**
 * Format price with currency symbol
 * @param {number|string} price - Price to format
 * @param {string} [currency='₹'] - Currency symbol
 * @returns {string} Formatted price string
 * @example
 * formatPrice(299) // "₹299"
 * formatPrice(1299.50) // "₹1,299.50"
 */
window.formatPrice = function(price, currency = '₹') {
  try {
    const num = typeof price === 'string' ? parseFloat(price.replace(/[^\d.]/g, '')) : price;
    if (isNaN(num)) return `${currency}0`;
    return `${currency}${num.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  } catch (err) {
    console.error('formatPrice error:', err);
    return `${currency}0`;
  }
};

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @param {string} [format='short'] - Format type: 'short', 'long', 'time'
 * @returns {string} Formatted date string
 * @example
 * formatDate(new Date()) // "30 Apr 2026"
 * formatDate(new Date(), 'long') // "30 April 2026"
 * formatDate(new Date(), 'time') // "2:30 PM"
 */
window.formatDate = function(date, format = 'short') {
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return 'Invalid date';
    
    const options = {
      short: { day: 'numeric', month: 'short', year: 'numeric' },
      long: { day: 'numeric', month: 'long', year: 'numeric' },
      time: { hour: 'numeric', minute: '2-digit', hour12: true }
    };
    
    return d.toLocaleDateString('en-IN', options[format] || options.short);
  } catch (err) {
    console.error('formatDate error:', err);
    return 'Invalid date';
  }
};

/**
 * Format phone number
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone number
 * @example
 * formatPhone('9876543210') // "+91 98765 43210"
 */
window.formatPhone = function(phone) {
  try {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
    return phone;
  } catch (err) {
    console.error('formatPhone error:', err);
    return phone;
  }
};

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
window.isValidEmail = function(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Validate phone number (10 digits)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid phone
 */
window.isValidPhone = function(phone) {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10;
};

/**
 * Sanitize HTML to prevent XSS
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
window.sanitizeHTML = function(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} True if successful
 */
window.copyToClipboard = async function(text) {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      showToast('Copied to clipboard', 'success');
      return true;
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast('Copied to clipboard', 'success');
      return true;
    }
  } catch (err) {
    console.error('Copy to clipboard error:', err);
    showToast('Failed to copy', 'error');
    return false;
  }
};

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
window.generateId = function() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/* ── Nav Badge Updater ──────────────────────────────────────── */
/**
 * Update navigation badge counts for cart and wishlist
 */
function updateNavBadges() {
  try {
    const cartCount = Cart.count();
    const wishCount = Wishlist.count();

    // Update cart badges
    document.querySelectorAll('#cart-count, #nav-cart-badge').forEach(el => {
      el.textContent = cartCount > 99 ? '99+' : cartCount;
      el.style.display = cartCount > 0 ? 'flex' : 'none';
    });

    // Update wishlist badges
    document.querySelectorAll('#wishlist-count').forEach(el => {
      el.textContent = wishCount > 99 ? '99+' : wishCount;
      el.style.display = wishCount > 0 ? 'flex' : 'none';
    });
  } catch (err) {
    console.error('updateNavBadges error:', err);
  }
}

window.addEventListener('cart-updated',     updateNavBadges);
window.addEventListener('wishlist-updated', updateNavBadges);
document.addEventListener('DOMContentLoaded', updateNavBadges);

/* ── Page Entrance Animation ────────────────────────────────── */

/**
 * Add entrance animation to main content on page load
 */
document.addEventListener('DOMContentLoaded', () => {
  try {
    const main = document.querySelector('main') || document.querySelector('.page-wrapper');
    if (main) {
      main.classList.add('page-enter');
    }
  } catch (err) {
    console.error('Page entrance animation error:', err);
  }
});

/* ── Intersection Observer for Scroll Reveals ───────────────── */

/**
 * Reveal elements on scroll using Intersection Observer
 */
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.section-reveal').forEach(el => observer.observe(el));
  } catch (err) {
    console.error('Intersection observer error:', err);
  }
});

/* ── Ripple Effect on Buttons ───────────────────────────────── */

/**
 * Add material design ripple effect to buttons
 */
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Add ripple animation styles
    if (!document.getElementById('ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'ripple-styles';
      style.textContent = `
        @keyframes ripple-anim {
          to {
            transform: scale(2.5);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    // Handle button clicks
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.button_primary, .button_secondary');
      if (!btn) return;

      const ripple = document.createElement('span');
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
        width: ${size}px;
        height: ${size}px;
        left: ${e.clientX - rect.left - size/2}px;
        top: ${e.clientY - rect.top - size/2}px;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-anim 0.5s ease-out forwards;
      `;

      // Ensure button has proper positioning
      const btnPosition = getComputedStyle(btn).position;
      if (btnPosition === 'static') {
        btn.style.position = 'relative';
      }
      btn.style.overflow = 'hidden';

      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  } catch (err) {
    console.error('Ripple effect error:', err);
  }
});
