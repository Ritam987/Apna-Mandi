'use strict';

document.addEventListener('DOMContentLoaded', () => {
  loadSavedAddresses();
  initSlotSelection();
  initAddAddress();
  initContinue();
});

let selectedAddress = null;

const SAVED_ADDRESSES = [
  { id: 1, label: 'Home',   icon: 'home',   address: '123, MG Road, Kochi, Kerala 682001' },
  { id: 2, label: 'Office', icon: 'office', address: '456, Marine Drive, Kochi, Kerala 682031' }
];

function loadSavedAddresses() {
  const container = document.getElementById('address-list');
  if (!container) return;

  try {
    const stored = JSON.parse(localStorage.getItem('savedAddresses') || 'null');
    const addresses = stored || SAVED_ADDRESSES;

    container.innerHTML = addresses.map((a, i) => `
      <div class="address-card ${i === 0 ? 'selected' : ''}" data-id="${a.id}" onclick="selectAddress(${a.id})">
        <div class="check-badge">
          <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <div style="display:flex;align-items:flex-start;gap:0.875rem">
          <div style="width:2.5rem;height:2.5rem;border-radius:var(--radius-md);background:var(--bg-soft);display:flex;align-items:center;justify-content:center;flex-shrink:0">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
          </div>
          <div style="flex:1">
            <p style="font-weight:600;font-size:0.9375rem;color:var(--text-primary)">${a.label}</p>
            <p style="font-size:0.8125rem;color:var(--text-secondary);margin-top:0.15rem;line-height:1.4">${a.address}</p>
          </div>
          <button onclick="event.stopPropagation();deleteAddress(${a.id})"
                  style="color:var(--text-muted);padding:0.25rem;transition:color 0.2s ease"
                  onmouseover="this.style.color='var(--error)'" onmouseout="this.style.color='var(--text-muted)'"
                  aria-label="Delete address">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
      </div>
    `).join('');

    if (addresses.length) selectedAddress = addresses[0];
  } catch {}
}

window.selectAddress = function(id) {
  document.querySelectorAll('.address-card').forEach(c => c.classList.remove('selected'));
  const card = document.querySelector(`.address-card[data-id="${id}"]`);
  card?.classList.add('selected');
  const stored = JSON.parse(localStorage.getItem('savedAddresses') || 'null') || SAVED_ADDRESSES;
  selectedAddress = stored.find(a => a.id === id);
};

window.deleteAddress = function(id) {
  const stored = JSON.parse(localStorage.getItem('savedAddresses') || 'null') || SAVED_ADDRESSES;
  const updated = stored.filter(a => a.id !== id);
  localStorage.setItem('savedAddresses', JSON.stringify(updated));
  loadSavedAddresses();
  showToast('Address removed');
};

function initSlotSelection() {
  document.querySelectorAll('.slot-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.slot-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
    });
  });
}

function initAddAddress() {
  const btn     = document.getElementById('add-address-btn');
  const modal   = document.getElementById('add-address-modal');
  const overlay = document.getElementById('modal-overlay');
  const form    = document.getElementById('add-address-form');
  const closeBtn = document.getElementById('close-address-modal');

  function openModal()  { modal?.classList.add('open'); overlay?.classList.add('open'); }
  function closeModal() { modal?.classList.remove('open'); overlay?.classList.remove('open'); }

  btn?.addEventListener('click', openModal);
  overlay?.addEventListener('click', closeModal);
  closeBtn?.addEventListener('click', closeModal);

  form?.addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const stored = JSON.parse(localStorage.getItem('savedAddresses') || 'null') || SAVED_ADDRESSES;
    const newAddr = { id: Date.now(), label: data.label || 'New Address', address: data.address };
    stored.push(newAddr);
    localStorage.setItem('savedAddresses', JSON.stringify(stored));
    loadSavedAddresses();
    closeModal();
    form.reset();
    showToast('Address saved!', 'success');
  });
}

function initContinue() {
  const btn = document.getElementById('continue-btn');
  btn?.addEventListener('click', () => {
    if (!selectedAddress) { showToast('Please select a delivery address', 'error'); return; }
    const slot = document.querySelector('.slot-option.selected, .slot-option:has(input:checked)');
    const instructions = document.getElementById('delivery-instructions')?.value || '';
    localStorage.setItem('deliveryInfo', JSON.stringify({
      address: selectedAddress,
      slot: slot?.querySelector('span')?.textContent || 'Today, 6:00 PM - 7:00 PM',
      instructions
    }));
    window.location.href = '/pages/checkout';
  });
}

window.continueToPayment = function() {
  const slot = document.querySelector('input[name="delivery_slot"]:checked');
  const instructions = document.getElementById('delivery-instructions')?.value || '';
  const addr = selectedAddress || { address: '123, MG Road, Kochi', label: 'Home' };
  localStorage.setItem('deliveryInfo', JSON.stringify({
    address: addr,
    slot: slot ? slot.closest('label').querySelector('span')?.textContent || 'Today, 6:00 PM - 7:00 PM' : 'Today, 6:00 PM - 7:00 PM',
    instructions: instructions
  }));
  window.location.href = '/pages/checkout';
};
