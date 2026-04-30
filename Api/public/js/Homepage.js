/**
 * ============================================================
 * APNA MANDI — Homepage
 * ============================================================
 * 
 * Features:
 * - Location display
 * - Search functionality
 * - Hero slider with auto-play
 * - Flash sale countdown
 * - Product cards with add-to-cart
 * - Wishlist toggle
 * - Category navigation
 * - Scroll reveal animations
 * 
 * ============================================================
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  try {
    initHomepage();
  } catch (err) {
    console.error('Homepage initialization error:', err);
  }
});

/**
 * Initialize all homepage components
 */
function initHomepage() {
  initLocation();
  initSearch();
  initHeroSlider();
  initCountdown();
  initProductCards();
  initWishlistButtons();
  initCategoryLinks();
  initSectionReveal();
  syncBadges();
}

/**
 * Display user's selected location
 */
function initLocation() {
  const locationEl = document.getElementById('hp-city');
  if (!locationEl) return;

  try {
    const locationData = JSON.parse(localStorage.getItem('locationData') || '{}');
    
    if (locationData.location) {
      const svg = locationEl.querySelector('svg');
      locationEl.textContent = locationData.location + ' ';
      
      // Re-append SVG icon if it exists
      if (svg) {
        locationEl.appendChild(svg);
      }
    }
  } catch (err) {
    console.error('Location display error:', err);
  }
}

/**
 * Initialize search functionality
 */
function initSearch() {
  const searchWrap = document.getElementById('hp-search-wrap');
  const searchInput = document.getElementById('homepage-search');
  
  if (!searchInput) return;

  // Click on search wrapper navigates to search page
  if (searchWrap) {
    searchWrap.addEventListener('click', () => {
      window.location.href = '/pages/searchfeed';
    });
  }

  // Enter key triggers search
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      try {
        const query = searchInput.value.trim();
        if (query) {
          localStorage.setItem('searchQuery', query);
        }
        window.location.href = '/pages/searchfeed';
      } catch (err) {
        console.error('Search error:', err);
        window.location.href = '/pages/searchfeed';
      }
    }
  });

  // Prevent input from triggering wrapper click
  searchInput.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}

/**
 * Initialize hero slider with auto-play
 */
function initHeroSlider() {
  const track = document.getElementById('hp-slider-track');
  const dots = document.querySelectorAll('.hp-slider__dot');
  const prevBtn = document.getElementById('hp-prev');
  const nextBtn = document.getElementById('hp-next');
  
  if (!track || track.children.length === 0) return;

  const totalSlides = track.children.length;
  let currentSlide = 0;
  let autoPlayTimer;
  let touchStartX = 0;

  /**
   * Navigate to specific slide
   */
  function goToSlide(index) {
    try {
      // Wrap around
      currentSlide = ((index % totalSlides) + totalSlides) % totalSlides;
      
      // Update transform
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
      
      // Update dots
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    } catch (err) {
      console.error('Slider navigation error:', err);
    }
  }

  /**
   * Restart auto-play timer
   */
  function restartAutoPlay() {
    clearInterval(autoPlayTimer);
    autoPlayTimer = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 4000);
  }

  // Previous button
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToSlide(currentSlide - 1);
      restartAutoPlay();
    });
  }

  // Next button
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToSlide(currentSlide + 1);
      restartAutoPlay();
    });
  }

  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(index);
      restartAutoPlay();
    });
  });

  // Touch/swipe support
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    try {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      
      // Swipe threshold: 40px
      if (Math.abs(diff) > 40) {
        goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
        restartAutoPlay();
      }
    } catch (err) {
      console.error('Touch swipe error:', err);
    }
  });

  // Pause on hover (desktop)
  track.addEventListener('mouseenter', () => {
    clearInterval(autoPlayTimer);
  });

  track.addEventListener('mouseleave', () => {
    restartAutoPlay();
  });

  // Initialize
  goToSlide(0);
  restartAutoPlay();
}

/**
 * Initialize flash sale countdown timer
 */
function initCountdown() {
  const timerEl = document.getElementById('countdown-timer');
  if (!timerEl) return;

  try {
    // Get or set end time
    let endTime = parseInt(localStorage.getItem('flashSaleEnd') || '0');
    
    if (!endTime || endTime < Date.now()) {
      // Set new end time: 2 hours from now
      endTime = Date.now() + (2 * 60 * 60 * 1000);
      localStorage.setItem('flashSaleEnd', String(endTime));
    }

    /**
     * Update countdown display
     */
    function updateCountdown() {
      try {
        const remaining = endTime - Date.now();
        
        if (remaining <= 0) {
          timerEl.textContent = 'Ended';
          timerEl.style.color = 'var(--text-muted)';
          return;
        }

        const hours = Math.floor(remaining / 3600000);
        const minutes = Math.floor((remaining % 3600000) / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);

        timerEl.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      } catch (err) {
        console.error('Countdown update error:', err);
      }
    }

    // Update immediately and every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
  } catch (err) {
    console.error('Countdown initialization error:', err);
  }
}

/**
 * Sync cart and wishlist badge counts
 */
function syncBadges() {
  try {
    // Cart count
    const cartCount = Cart.count();
    
    // Update all cart badges
    document.querySelectorAll('#cart-count, #nav-cart-badge').forEach(badge => {
      badge.textContent = cartCount > 99 ? '99+' : cartCount;
      badge.style.display = cartCount > 0 ? 'flex' : 'none';
    });

    // Wishlist count
    const wishlistCount = Wishlist.count();
    
    // Update wishlist badge
    const wishlistBadge = document.getElementById('wishlist-count');
    if (wishlistBadge) {
      wishlistBadge.textContent = wishlistCount > 99 ? '99+' : wishlistCount;
      wishlistBadge.style.display = wishlistCount > 0 ? 'flex' : 'none';
    }
  } catch (err) {
    console.error('Badge sync error:', err);
  }
}

/**
 * Initialize product card interactions
 */
function initProductCards() {
  // Add to cart buttons
  document.querySelectorAll('.hp-product-card__add').forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      
      try {
        const productId = button.dataset.id;
        const productName = button.dataset.name || 'Product';
        const productPrice = button.dataset.price || '0';
        
        // Get product image
        const card = button.closest('.hp-product-card');
        const imgEl = card?.querySelector('.hp-product-card__img');
        
        // Create product object
        const product = {
          id: productId || `p_${Date.now()}`,
          name: productName,
          price: productPrice,
          image: imgEl?.src || '',
          quantity: 1
        };

        // Add to cart using global Cart helper
        Cart.add(product);

        // Visual feedback
        const originalText = button.textContent;
        button.textContent = 'Added!';
        button.classList.add('added');
        
        setTimeout(() => {
          button.textContent = originalText;
          button.classList.remove('added');
        }, 1500);

        // Update badges
        syncBadges();
      } catch (err) {
        console.error('Add to cart error:', err);
        showToast('Failed to add item', 'error');
      }
    });
  });

  // Product card click (navigate to details)
  document.querySelectorAll('.hp-product-card').forEach(card => {
    card.addEventListener('click', () => {
      try {
        const nameEl = card.querySelector('.hp-product-card__name');
        const priceEl = card.querySelector('.hp-product-card__price');
        const imgEl = card.querySelector('.hp-product-card__img');
        const unitEl = card.querySelector('.hp-product-card__unit');
        
        // Save product data for details page
        const productData = {
          name: nameEl?.textContent.trim() || 'Product',
          price: priceEl?.textContent.trim() || '0',
          image: imgEl?.src || '',
          unit: unitEl?.textContent.trim() || '',
          seller: 'Apna Mandi',
          category: card.dataset.category || 'general'
        };

        localStorage.setItem('selectedProduct', JSON.stringify(productData));
        window.location.href = '/pages/productdetails';
      } catch (err) {
        console.error('Product card click error:', err);
        showToast('Failed to load product', 'error');
      }
    });
  });
}

/**
 * Initialize wishlist toggle buttons
 */
function initWishlistButtons() {
  document.querySelectorAll('.hp-product-card__wish').forEach(button => {
    const productId = button.dataset.id;
    
    // Set initial state
    try {
      if (Wishlist.get().some(item => item.id === productId)) {
        button.classList.add('active');
      }
    } catch (err) {
      console.error('Wishlist state check error:', err);
    }

    // Toggle wishlist on click
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      
      try {
        const card = button.closest('.hp-product-card');
        const nameEl = card?.querySelector('.hp-product-card__name');
        const priceEl = card?.querySelector('.hp-product-card__price');
        const imgEl = card?.querySelector('.hp-product-card__img');
        
        const product = {
          id: productId,
          name: nameEl?.textContent.trim() || 'Product',
          price: priceEl?.textContent.trim() || '0',
          image: imgEl?.src || ''
        };

        // Toggle using global Wishlist helper
        const isAdded = Wishlist.toggle(product);
        
        // Update button state
        button.classList.toggle('active', isAdded);
        
        // Update badges
        syncBadges();
      } catch (err) {
        console.error('Wishlist toggle error:', err);
        showToast('Failed to update wishlist', 'error');
      }
    });
  });
}

/**
 * Initialize category navigation links
 */
function initCategoryLinks() {
  document.querySelectorAll('.hp-cat').forEach(link => {
    link.addEventListener('click', () => {
      try {
        const category = link.dataset.category;
        if (category) {
          localStorage.setItem('selectedCategory', category);
        }
      } catch (err) {
        console.error('Category link error:', err);
      }
    });
  });
}

/**
 * Initialize scroll reveal animations
 */
function initSectionReveal() {
  try {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Show all sections immediately
      document.querySelectorAll('.section-reveal').forEach(el => {
        el.classList.add('visible');
      });
      return;
    }

    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger animation
          entry.target.style.transitionDelay = `${index * 0.05}s`;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -50px 0px'
    });

    // Observe all reveal sections
    document.querySelectorAll('.section-reveal').forEach(el => {
      observer.observe(el);
    });
  } catch (err) {
    console.error('Section reveal error:', err);
  }
}
