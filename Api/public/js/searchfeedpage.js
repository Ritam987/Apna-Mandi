/**
 * ============================================================
 * APNA MANDI — Search Feed Page
 * ============================================================
 * 
 * Features:
 * - Product search with real-time filtering
 * - Category filters
 * - Sort options (price, name, discount)
 * - Wishlist toggle
 * - Add to cart
 * - Product details navigation
 * 
 * ============================================================
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  try {
    initSearch();
    initFilters();
    initSortChips();
    loadSearchQuery();
  } catch (err) {
    console.error('Search feed initialization error:', err);
    showToast('Failed to load products', 'error');
  }
});

/* ── Products data ──────────────────────────────────────────── */
const PRODUCTS = [
  { id:'s1',  name:'Fresh Tomatoes',    price:35,  mrp:50,  unit:'1 kg',    category:'vegetables', badge:'30% OFF',    badgeType:'red',    image:'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=300&q=80',    seller:'Fresh Farms' },
  { id:'s2',  name:'Red Onions',        price:24,  mrp:30,  unit:'1 kg',    category:'vegetables', badge:'20% OFF',    badgeType:'red',    image:'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=300&q=80',    seller:'Green Valley' },
  { id:'s3',  name:'Potatoes',          price:38,  mrp:50,  unit:'2 kg',    category:'vegetables', badge:'25% OFF',    badgeType:'red',    image:'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=300&q=80',    seller:'Fresh Farms' },
  { id:'s4',  name:'Fresh Spinach',     price:17,  mrp:20,  unit:'500 g',   category:'vegetables', badge:'Fresh',      badgeType:'green',  image:'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&q=80',    seller:'Green Valley' },
  { id:'s5',  name:'Capsicum Mix',      price:55,  mrp:70,  unit:'500 g',   category:'vegetables', badge:'New',        badgeType:'blue',   image:'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=300&q=80',    seller:'Fresh Farms' },
  { id:'s6',  name:'Alphonso Mango',    price:280, mrp:350, unit:'1 dozen', category:'fruits',     badge:'Seasonal',   badgeType:'red',    image:'https://images.unsplash.com/photo-1553279768-865429fa0078?w=300&q=80',    seller:'Fruit Paradise' },
  { id:'s7',  name:'Bananas',           price:40,  mrp:50,  unit:'1 dozen', category:'fruits',     badge:'Fresh',      badgeType:'green',  image:'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&q=80',    seller:'Fruit Paradise' },
  { id:'s8',  name:'Watermelon',        price:60,  mrp:80,  unit:'1 piece', category:'fruits',     badge:'25% OFF',    badgeType:'red',    image:'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&q=80',    seller:'Fruit Paradise' },
  { id:'s9',  name:'Turmeric Powder',   price:60,  mrp:100, unit:'500 g',   category:'spices',     badge:'40% OFF',    badgeType:'red',    image:'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&q=80',    seller:'Spice Merchants' },
  { id:'s10', name:'Red Chilli Powder', price:65,  mrp:100, unit:'500 g',   category:'spices',     badge:'35% OFF',    badgeType:'red',    image:'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=300&q=80',    seller:'Spice Merchants' },
  { id:'s11', name:'Cumin Seeds',       price:120, mrp:150, unit:'250 g',   category:'spices',     badge:'Premium',    badgeType:'purple', image:'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&q=80',    seller:'Spice Merchants' },
  { id:'s12', name:'Full Cream Milk',   price:62,  mrp:70,  unit:'1 litre', category:'dairy',      badge:'Fresh',      badgeType:'blue',   image:'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&q=80',    seller:'Dairy Delights' },
  { id:'s13', name:'Fresh Paneer',      price:75,  mrp:90,  unit:'200 g',   category:'dairy',      badge:'Daily Fresh',badgeType:'green',  image:'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&q=80',    seller:'Dairy Delights' },
  { id:'s14', name:'Fresh Curd',        price:40,  mrp:50,  unit:'500 g',   category:'dairy',      badge:'Fresh',      badgeType:'green',  image:'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&q=80',    seller:'Dairy Delights' },
  { id:'s15', name:'Basmati Rice',      price:320, mrp:380, unit:'5 kg',    category:'grains',     badge:'15% OFF',    badgeType:'red',    image:'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&q=80',    seller:'Grain Masters' },
  { id:'s16', name:'California Almonds',price:180, mrp:220, unit:'250 g',   category:'dry-fruits', badge:'Premium',    badgeType:'purple', image:'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=300&q=80',    seller:'Dry Fruit Hub' },
  { id:'s17', name:'Fresh Ginger',      price:27,  mrp:30,  unit:'250 g',   category:'vegetables', badge:'10% OFF',    badgeType:'red',    image:'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=300&q=80',    seller:'Fresh Farms' },
  { id:'s18', name:'Fresh Garlic',      price:45,  mrp:55,  unit:'250 g',   category:'vegetables', badge:'Fresh',      badgeType:'green',  image:'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&q=80',    seller:'Fresh Farms' },
];

let activeCategory = 'all';
let sortBy = 'default';

/**
 * Render products to the grid
 * @param {Array} list - Array of products to display
 */
function renderProducts(list) {
  try {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    const countEl = document.getElementById('result-count');
    if (countEl) countEl.textContent = `${list.length} product${list.length !== 1 ? 's' : ''}`;

    if (!list.length) {
      grid.innerHTML = `
        <div class="sf-empty">
          <svg width="56" height="56" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <h3>No products found</h3>
          <p>Try a different search or category</p>
        </div>`;
      return;
    }

  grid.innerHTML = list.map((p, i) => {
    const discount = p.mrp > p.price ? Math.round((1 - p.price / p.mrp) * 100) : 0;
    const isWished = Wishlist.has(p.name);
    return `
    <div class="sf-card stagger-${Math.min(i+1,5)}"
         data-id="${p.id}" data-name="${p.name}" data-price="${p.price}"
         data-image="${p.image}" data-seller="${p.seller}" data-category="${p.category}">
      <div class="sf-card__img-wrap">
        <img class="sf-card__img" src="${p.image}" alt="${p.name}" loading="lazy"/>
        ${p.badge ? `<span class="sf-card__badge sf-badge--${p.badgeType}">${p.badge}</span>` : ''}
        <button class="sf-card__wish ${isWished ? 'active' : ''}"
                aria-label="Toggle wishlist" data-name="${p.name}">
          <svg width="15" height="15" fill="${isWished ? '#ef4444' : 'none'}"
               stroke="${isWished ? '#ef4444' : 'currentColor'}" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </button>
      </div>
      <div class="sf-card__body">
        <p class="sf-card__name">${p.name}</p>
        <p class="sf-card__unit">${p.unit}</p>
        <div class="sf-card__price-row">
          <span class="sf-card__price">₹${p.price}</span>
          ${p.mrp > p.price ? `<span class="sf-card__mrp">₹${p.mrp}</span>` : ''}
        </div>
        <button class="sf-card__add" data-id="${p.id}">+ Add</button>
      </div>
    </div>`;
  }).join('');

  // Wishlist buttons
  grid.querySelectorAll('.sf-card__wish').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      try {
        const name = btn.dataset.name;
        const product = PRODUCTS.find(p => p.name === name);
        if (!product) return;
        
        const added = Wishlist.toggle(product);
        const svg = btn.querySelector('svg');
        btn.classList.toggle('active', added);
        svg.setAttribute('fill', added ? '#ef4444' : 'none');
        svg.setAttribute('stroke', added ? '#ef4444' : 'currentColor');
      } catch (err) {
        console.error('Wishlist toggle error:', err);
        showToast('Failed to update wishlist', 'error');
      }
    });
  });

  // Add to cart buttons
  grid.querySelectorAll('.sf-card__add').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      try {
        const card = btn.closest('.sf-card');
        const product = PRODUCTS.find(p => p.id === card.dataset.id);
        if (!product) return;
        
        Cart.add({
          id:     product.id,
          name:   product.name,
          price:  `₹${product.price}`,
          image:  product.image,
          seller: product.seller
        });
        
        btn.textContent = '✓ Added';
        btn.classList.add('added');
        setTimeout(() => {
          btn.textContent = '+ Add';
          btn.classList.remove('added');
        }, 1500);
      } catch (err) {
        console.error('Add to cart error:', err);
        showToast('Failed to add item', 'error');
      }
    });
  });

  // Card click → product details
  grid.querySelectorAll('.sf-card').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('.sf-card__wish, .sf-card__add')) return;
      try {
        const product = PRODUCTS.find(p => p.id === card.dataset.id);
        if (!product) return;
        
        localStorage.setItem('selectedProduct', JSON.stringify({
          name:     product.name,
          price:    `₹${product.price}`,
          image:    product.image,
          seller:   product.seller,
          category: product.category
        }));
        window.location.href = '/pages/productdetails';
      } catch (err) {
        console.error('Product navigation error:', err);
        showToast('Failed to load product', 'error');
      }
    });
  });
  } catch (err) {
    console.error('Render products error:', err);
    showToast('Failed to display products', 'error');
  }
}

/* ── Filter & Sort ──────────────────────────────────────────── */
function getFiltered(query = '') {
  let list = [...PRODUCTS];
  if (activeCategory !== 'all') list = list.filter(p => p.category === activeCategory);
  if (query) list = list.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
  if (sortBy === 'price-asc')  list.sort((a,b) => a.price - b.price);
  if (sortBy === 'price-desc') list.sort((a,b) => b.price - a.price);
  if (sortBy === 'name')       list.sort((a,b) => a.name.localeCompare(b.name));
  if (sortBy === 'discount')   list.sort((a,b) => (b.mrp - b.price) - (a.mrp - a.price));
  return list;
}

function initSearch() {
  const input = document.getElementById('search-input');
  if (!input) return;
  input.addEventListener('input', () => renderProducts(getFiltered(input.value)));
}

function initFilters() {
  document.querySelectorAll('[data-category]').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('[data-category]').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeCategory = chip.dataset.category || 'all';
      const q = document.getElementById('search-input')?.value || '';
      renderProducts(getFiltered(q));
    });
  });
}

function initSortChips() {
  document.querySelectorAll('[data-sort]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-sort]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      sortBy = btn.dataset.sort;
      const q = document.getElementById('search-input')?.value || '';
      renderProducts(getFiltered(q));
    });
  });
}

function loadSearchQuery() {
  const q   = localStorage.getItem('searchQuery') || '';
  const cat = localStorage.getItem('selectedCategory') || '';
  if (q) {
    const input = document.getElementById('search-input');
    if (input) input.value = q;
    localStorage.removeItem('searchQuery');
  }
  if (cat) {
    activeCategory = cat;
    document.querySelectorAll('[data-category]').forEach(c => {
      c.classList.toggle('active', c.dataset.category === cat || (!cat && c.dataset.category === 'all'));
    });
    localStorage.removeItem('selectedCategory');
  }
  renderProducts(getFiltered(q));
}
