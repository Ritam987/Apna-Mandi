'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initSearch();
  initFilters();
  initProductCards();
  initSortSheet();
  loadSearchQuery();
});

/* ── Products data (mock) ───────────────────────────────────── */
const PRODUCTS = [
  { name: 'Fresh Tomatoes',    price: '₹20/kg',   category: 'vegetables', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-j4DLROYhJyV4Pyx2lM4et8woi3EulQ4frZ_khN_8HrnXBJVjPtyVUSA64HWdU7mUp0ZkFZtCwll3BjCQ_33nCkvEMPvOPLFul4aWdR-okO6IGZIO8SAhTxaJ-JTaQk5XljU6QSa_0F-vmbtSipw9BqwZn5eIcYV029YmH3C1YoxMN4sAFEkWbdRIjK7GlGzU1yCg968GqgFRg-nKSDjh4STNYuA5-HPzcQ9TARvVLxb9HRn2xTTp4LWlY27_GbNV0Fq_vg3D5zY', seller: 'Fresh Farms' },
  { name: 'Organic Potatoes',  price: '₹15/kg',   category: 'vegetables', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNw-7p4FGgGBj8BTeznl3-p9f0bPPD1iyqapgKPD41DsdqFT529MoA56Og79OlUVHb9L0XPXAT23wpVElQUwQzyFOGtCltix3g9msSjwVuNTMnXPjqGjyuuXIHaW2D2sfm2kX5m_anDF0-gNOLgwU-VfTKq-FzY-Y2vzYFjJILvgfVml02KhWNc4BJZib5m2pJN5QKo48VB535nypKUbtKyCeTHn1KIQPD8rmUIO-27wQ0CUwEylqzIr5R9cndgYmI8ODe3KaCF8M', seller: 'Green Valley' },
  { name: 'Green Chilies',     price: '₹30/kg',   category: 'vegetables', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtX0P77ULcXRdlEjPQ03GZFMgPOOuFwxrII35QXBIPUvRgWfq8mm7CmWfFcIFRL11_jarl8GkdApHfrw5tgTsLNCDl3ejyFBZMnllwxMR9ihkMS1iynbRZv_dDeEy53nh3O_3RWcbLevL4L1ZwLNkOBUueLCpRhJJitmoXhLcTRCvn0jgoNkjbXOlm8Vzev5lywcrNXSe037Bf7VUMiO1zcbQHx6bSaiXwFwxQXt2lQY193RN2ylm0eKL_3G4RNinSGKrIuVAjPok', seller: 'Spice Hub' },
  { name: 'Onions',            price: '₹18/kg',   category: 'vegetables', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjIlQJGqY00gLqjbBWApJM-Y_zojscoM7kJaTS5gPezmFeJ3pdOx1kPnNjawa1OFhOn45NNWzLtfq0BEZ2CTQN6bA4bwSEuHN4HletpsiJqfs4e2Duym2V15iw76CwE7h2bYbWGRYhmCZy1J0zsKw1usOCPR2JRqAWbfmqk65YYZ1DZdxSP4A-GmsukSUJotEXm3FoFc9_iiZboyC2l8z0MAAT2etMbO3CT1XZbHaZQP_yOjYRppPLMIxVU4tM9eW6bC7u-9WCqU0', seller: 'Fresh Farms' },
  { name: 'Cumin Seeds',       price: '₹200/kg',  category: 'spices',     image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtVGtXSahICHzF5aTuW_IgL0QoXFF9p8I5WW-dy3mU_pFrsBGd6LPLkiIroobGZuQQ1FWJnB7czNTXTeDYemVOGpcmwfcilAImXNg9RMf2H4U5g-__alv9u6Ji6qFCLAkMPaQlnKWBFE97HhXh1OiFNmsxU3mP7Gex-4nhZw0JetRZuprBYpcDXtbjhNDJZmAaNuDgtttxi-9N36Wg39nWNuSBbeXn__0Pa6eFb6KyERrLIGSMDGUXTnoLJ6oO6lhS4CpCkjEwD9Q', seller: 'Spice Merchants' },
  { name: 'Turmeric Powder',   price: '₹150/kg',  category: 'spices',     image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXeQGrZP3LM1ScWL-CHUXF-WJ_8ctUJlUwidrwAanZuN2atZSfNsAhs4cg2rXDBwOFmcxY6MTBk9DFBkswMRa0bW9Pfa_g4Wz7tBIuSP5LjP-gt6VQwr-ozL4v9fFaJlYivJ-bm0g6jl_X7ciZWiei2K9vVuE8kiTdnibF1ekn99gTY5RVP2KEFlAriOmbJmrONin9IFS1qgq0XF-sJjksWn6DedZQBA7eH4BVMLFet78L8OBQ8B3W3o6UZKphKM4-Rp5Q7BweyKs', seller: 'Spice Merchants' },
  { name: 'Full Cream Milk',   price: '₹60/L',    category: 'dairy',      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8H0CiwILDAo9Q2l80awq_RxilLtB-5_z3AKUhsyJynzYhddNqqtKjoBY5AA6YkqKT2nGSOREkd9X5aP7pxyJhASvx223OZa962neZPmeA1x-oRVz1355ZuLSSq8BFUpRjtQzJNTf7-TfnVwW-0OahNEvay1BFWX6Jw5-ewwA_C1AQsqgaZ-P-ZGzccHOrk9_FAK8N3AFyJ6ZdnBHWqvxYGjX4kOixBGOGI_YEWcDiKHK0HI79RXV_OOu5liliU7206KAVwkpIjCM', seller: 'Dairy Delights' },
  { name: 'Paneer',            price: '₹350/kg',  category: 'dairy',      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfTT9JmxXyJUkfNmTGVN-IocahbNZA-icDwY_12D1HHOrzawJLKYPQ_OqV7oeOGSWKdseJ7NuUZTOf2aUM-Z7yu0DG5AOJxWD82ojCqTLpu8DcBrD_DZIGF-a8zz9oC9Zqt-YJ8YyoWbTX_1t-1wf5ANePt6DWyt_yJPBPmBnC7vVeythwSOKWvlGkRzbQxyji6NNUwRx1tpgtM71kFXSzluaqqDr7hXQSW3iEqgDM0s029_uvnyQk_EXf6IKTInc-cLQmV6vm8a0', seller: 'Dairy Delights' },
  { name: 'Alphonso Mangoes',  price: '₹120/kg',  category: 'fruits',     image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAld4qAbnvAeYJ59ZP8VUD1j10I87MFZvn9Re6rPDJeePqYfaPm6VTtpm1jZ9AKwwiPeZR4rGt6Ard9ba8uemJb-TPNWzK9uIAtWanp0kM1lC0j0225X66vOlN3la6HsTgXMkr6ywqyn1Rnur7SLanMFOdYDuNEGuPIpZjdBGJXC-XXoZL7xuH82sFWL22CB_PyTdyp5UyVr4MZ358G0Q_AF11qzCUvcvJRaOw7yYuOIEPRfa5mCGD5-RN5mzvbm1-hGFRPwmtPEYI', seller: 'Fruit Paradise' },
  { name: 'Bananas',           price: '₹40/dozen',category: 'fruits',     image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwBj53r9bNR96tvMymXHVdHPbsLWCSIiucJ8C2A4atqNqPOqCpxIW5A9u6IUCCdjTlIA0YmqO1QfToj9RzD-a4ZmdD_W_-L6qPUceKVzBRrcvLX3_8yUd3pkcKsOPjgmZw_eGAlrp9iwaVHyhN8zMKExmElwaeMivN9iGNV_PoldUrd1MPoov1Zn0oFyboOzzYLDpFEQFE5jK4cRCTpKLICcUFHq7FLUb-uV6KT1aCEx6ckr8ycklgo-dbnLmNeQalHV4BxurztiQ', seller: 'Fruit Paradise' },
];

let activeCategory = 'all';
let sortBy = 'default';

/* ── Render ─────────────────────────────────────────────────── */
function renderProducts(list) {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  if (!list.length) {
    grid.innerHTML = `
      <div class="col-span-2 empty-state">
        <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <h3>No products found</h3>
        <p>Try a different search or category</p>
      </div>`;
    return;
  }

  grid.innerHTML = list.map((p, i) => `
    <div class="product-card product-card-inner stagger-${Math.min(i+1,5)}"
         data-name="${p.name}" data-price="${p.price}"
         data-image="${p.image}" data-seller="${p.seller}"
         data-category="${p.category}">
      <div class="product-img-wrap" style="position:relative">
        <div class="bg-cover" style="background-image:url('${p.image}');width:100%;height:100%;"></div>
        <button class="wishlist-btn ${Wishlist.has(p.name) ? 'active' : ''}"
                aria-label="Toggle wishlist" data-name="${p.name}">
          <svg width="16" height="16" fill="${Wishlist.has(p.name) ? 'var(--error)' : 'none'}"
               stroke="${Wishlist.has(p.name) ? 'var(--error)' : 'currentColor'}" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </button>
      </div>
      <div style="padding:0.75rem">
        <p class="font-semibold text-sm" style="color:var(--text-primary)">${p.name}</p>
        <p style="color:var(--text-secondary);font-size:0.8125rem;margin:0.15rem 0 0.5rem">${p.price}</p>
        <button class="button_primary add-to-cart-btn" style="width:100%;font-size:0.8125rem;padding:0.5rem 0.75rem">
          Add to Cart
        </button>
      </div>
    </div>
  `).join('');

  // Wishlist buttons
  grid.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const name = btn.dataset.name;
      const product = PRODUCTS.find(p => p.name === name);
      const added = Wishlist.toggle(product);
      const svg = btn.querySelector('svg');
      btn.classList.toggle('active', added);
      svg.setAttribute('fill', added ? 'var(--error)' : 'none');
      svg.setAttribute('stroke', added ? 'var(--error)' : 'currentColor');
    });
  });

  // Add to cart buttons
  grid.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const card = btn.closest('.product-card');
      Cart.add({
        name:   card.dataset.name,
        price:  card.dataset.price,
        image:  `url('${card.dataset.image}')`,
        seller: card.dataset.seller
      });
      btn.textContent = '✓ Added';
      btn.style.background = 'var(--success)';
      setTimeout(() => {
        btn.textContent = 'Add to Cart';
        btn.style.background = '';
      }, 1500);
    });
  });

  // Card click → product details
  grid.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('.wishlist-btn, .add-to-cart-btn')) return;
      localStorage.setItem('selectedProduct', JSON.stringify({
        name:     card.dataset.name,
        price:    card.dataset.price,
        image:    `url('${card.dataset.image}')`,
        seller:   card.dataset.seller,
        category: card.dataset.category
      }));
      window.location.href = '/pages/productdetails';
    });
  });
}

/* ── Filter ─────────────────────────────────────────────────── */
function getFiltered(query = '') {
  let list = [...PRODUCTS];
  if (activeCategory !== 'all') list = list.filter(p => p.category === activeCategory);
  if (query) list = list.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
  if (sortBy === 'price-asc')  list.sort((a,b) => parseFloat(a.price) - parseFloat(b.price));
  if (sortBy === 'price-desc') list.sort((a,b) => parseFloat(b.price) - parseFloat(a.price));
  if (sortBy === 'name')       list.sort((a,b) => a.name.localeCompare(b.name));
  return list;
}

function initSearch() {
  const input = document.getElementById('search-input');
  if (!input) return;
  input.addEventListener('input', () => renderProducts(getFiltered(input.value)));
}

function initFilters() {
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeCategory = chip.dataset.category || 'all';
      const q = document.getElementById('search-input')?.value || '';
      renderProducts(getFiltered(q));
    });
  });
}

function initSortSheet() {
  document.querySelectorAll('[data-sort]').forEach(btn => {
    btn.addEventListener('click', () => {
      sortBy = btn.dataset.sort;
      const q = document.getElementById('search-input')?.value || '';
      renderProducts(getFiltered(q));
    });
  });
}

function loadSearchQuery() {
  const q = localStorage.getItem('searchQuery') || '';
  const cat = localStorage.getItem('selectedCategory') || '';
  if (q) {
    const input = document.getElementById('search-input');
    if (input) input.value = q;
    localStorage.removeItem('searchQuery');
  }
  if (cat) {
    activeCategory = cat;
    document.querySelectorAll('.chip').forEach(c => {
      c.classList.toggle('active', c.dataset.category === cat || (cat === '' && c.dataset.category === 'all'));
    });
    localStorage.removeItem('selectedCategory');
  }
  renderProducts(getFiltered(q));
}

function initProductCards() {
  // Initial render handled by loadSearchQuery
}
