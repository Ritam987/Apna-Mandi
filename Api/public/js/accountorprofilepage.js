'use strict';

document.addEventListener('DOMContentLoaded', () => {
  loadUserData();
  initQuickActions();
  initSettings();
  initLogout();
});

function loadUserData() {
  const user = User.get();
  if (!user) return;

  const nameEl  = document.getElementById('user-name');
  const phoneEl = document.getElementById('user-phone');
  if (nameEl)  nameEl.textContent  = user.fullName || 'Guest User';
  if (phoneEl) phoneEl.textContent = user.phone ? `+91 ${user.phone}` : '';
}

function initQuickActions() {
  const actions = {
    'btn-cart':    '/pages/hubcart',
    'btn-orders':  '/pages/ordertracking',
    'btn-wishlist':'/pages/mywishlist',
    'btn-offers':  '/pages/specialoffers'
  };
  Object.entries(actions).forEach(([id, url]) => {
    document.getElementById(id)?.addEventListener('click', () => {
      window.location.href = url;
    });
  });
}

function initSettings() {
  const settings = {
    'btn-addresses': '/pages/deliveryinfo',
    'btn-payments':  () => showToast('Payment methods coming soon'),
    'btn-notifications': () => showToast('Notifications coming soon'),
    'btn-help':      '/pages/help'
  };
  Object.entries(settings).forEach(([id, action]) => {
    document.getElementById(id)?.addEventListener('click', () => {
      if (typeof action === 'string') window.location.href = action;
      else action();
    });
  });
}

function initLogout() {
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
      User.logout();
    }
  });
}
