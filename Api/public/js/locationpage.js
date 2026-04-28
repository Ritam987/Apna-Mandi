'use strict';

// Default center: Mumbai
const DEFAULT_LAT = 19.0760;
const DEFAULT_LNG = 72.8777;

let map, marker, selectedLat, selectedLng, selectedAddress = '';

document.addEventListener('DOMContentLoaded', () => {
  initMap();
  initSearch();
  initGPS();
  initConfirm();

  // If user already has a saved location, center on it
  try {
    const saved = JSON.parse(localStorage.getItem('locationData') || '{}');
    if (saved.lat && saved.lng) {
      setMapLocation(saved.lat, saved.lng, saved.location || '');
    } else {
      // Try GPS on load silently
      tryGPS(false);
    }
  } catch {
    tryGPS(false);
  }
});

/* ── Map init ───────────────────────────────────────────────── */
function initMap() {
  map = L.map('map', {
    center: [DEFAULT_LAT, DEFAULT_LNG],
    zoom: 13,
    zoomControl: true,
    attributionControl: false
  });

  // OpenStreetMap tiles (free, no API key)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
  }).addTo(map);

  // Custom yellow marker
  const icon = L.divIcon({
    className: '',
    html: `<div style="
      width:2.25rem;height:2.25rem;
      background:var(--primary,#f5c518);
      border:3px solid #fff;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      box-shadow:0 3px 10px rgba(0,0,0,.3);
    "></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36]
  });

  marker = L.marker([DEFAULT_LAT, DEFAULT_LNG], { icon, draggable: true }).addTo(map);

  // Click on map → move marker + reverse geocode
  map.on('click', (e) => {
    const { lat, lng } = e.latlng;
    moveMarker(lat, lng);
    reverseGeocode(lat, lng);
  });

  // Drag marker → reverse geocode
  marker.on('dragend', () => {
    const { lat, lng } = marker.getLatLng();
    reverseGeocode(lat, lng);
  });

  // Hide hint after first interaction
  map.on('click dragend', () => {
    const hint = document.getElementById('map-hint');
    if (hint) hint.style.display = 'none';
  });
}

/* ── Move marker ────────────────────────────────────────────── */
function moveMarker(lat, lng) {
  selectedLat = lat;
  selectedLng = lng;
  marker.setLatLng([lat, lng]);

  const latEl = document.getElementById('lat-val');
  const lngEl = document.getElementById('lng-val');
  const coordsEl = document.getElementById('coords-display');
  if (latEl) latEl.textContent = lat.toFixed(5);
  if (lngEl) lngEl.textContent = lng.toFixed(5);
  if (coordsEl) coordsEl.style.display = 'block';
}

/* ── Set full location ──────────────────────────────────────── */
function setMapLocation(lat, lng, address) {
  map.setView([lat, lng], 15);
  moveMarker(lat, lng);
  if (address) updateSelectedText(address);
}

/* ── Reverse geocode (Nominatim — free) ─────────────────────── */
let geocodeTimer;
function reverseGeocode(lat, lng) {
  clearTimeout(geocodeTimer);
  updateSelectedText('Locating…');

  geocodeTimer = setTimeout(async () => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      const addr = data.address || {};
      const parts = [
        addr.neighbourhood || addr.suburb || addr.village,
        addr.city || addr.town || addr.county,
        addr.state
      ].filter(Boolean);
      const label = parts.join(', ') || data.display_name?.split(',').slice(0, 2).join(',') || 'Selected Location';
      selectedAddress = label;
      updateSelectedText(label);
    } catch {
      updateSelectedText(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    }
  }, 600);
}

function updateSelectedText(text) {
  const el = document.getElementById('selected-loc-text');
  if (el) el.textContent = text;
  selectedAddress = text;
}

/* ── Search (Nominatim forward geocode) ─────────────────────── */
let searchTimer;
function initSearch() {
  const input      = document.getElementById('hub-search');
  const dropdown   = document.getElementById('location-suggestions');
  const spinner    = document.getElementById('search-spinner');

  input?.addEventListener('input', () => {
    const q = input.value.trim();
    clearTimeout(searchTimer);
    if (!q) { dropdown.style.display = 'none'; return; }

    spinner.style.display = 'block';
    searchTimer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=6&countrycodes=in`,
          { headers: { 'Accept-Language': 'en' } }
        );
        const results = await res.json();
        spinner.style.display = 'none';

        if (!results.length) {
          dropdown.innerHTML = `<div style="padding:0.875rem 1rem;font-size:0.875rem;color:var(--text-muted)">No results found</div>`;
          dropdown.style.display = 'block';
          return;
        }

        dropdown.innerHTML = results.map(r => `
          <div class="location-suggestion" data-lat="${r.lat}" data-lng="${r.lon}"
               data-name="${r.display_name.split(',').slice(0,3).join(',')}">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="flex-shrink:0;color:var(--text-muted)">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span style="font-size:0.875rem;line-height:1.4">${r.display_name.split(',').slice(0,3).join(', ')}</span>
          </div>
        `).join('');
        dropdown.style.display = 'block';

        dropdown.querySelectorAll('.location-suggestion').forEach(el => {
          el.addEventListener('click', () => {
            const lat  = parseFloat(el.dataset.lat);
            const lng  = parseFloat(el.dataset.lng);
            const name = el.dataset.name;
            input.value = name;
            dropdown.style.display = 'none';
            setMapLocation(lat, lng, name);
          });
        });
      } catch {
        spinner.style.display = 'none';
        dropdown.style.display = 'none';
      }
    }, 500);
  });

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#hub-search') && !e.target.closest('#location-suggestions')) {
      dropdown.style.display = 'none';
    }
  });
}

/* ── GPS ────────────────────────────────────────────────────── */
function initGPS() {
  document.getElementById('use-gps-btn')?.addEventListener('click', () => tryGPS(true));
}

function tryGPS(showFeedback) {
  if (!('geolocation' in navigator)) {
    if (showFeedback) showToast('GPS not supported on this device', 'error');
    return;
  }
  if (showFeedback) showToast('Getting your location…');

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude: lat, longitude: lng } = pos.coords;
      setMapLocation(lat, lng, 'Your current location');
      reverseGeocode(lat, lng);
      if (showFeedback) showToast('Location found!', 'success');
    },
    (err) => {
      if (showFeedback) {
        const msg = err.code === 1 ? 'Location permission denied. Search manually.'
                  : 'Could not get location. Search manually.';
        showToast(msg, 'error');
      }
    },
    { timeout: 8000, maximumAge: 60000 }
  );
}

/* ── Confirm ────────────────────────────────────────────────── */
function initConfirm() {
  const btn = document.getElementById('confirm-btn');
  btn?.addEventListener('click', () => {
    const loc = selectedAddress || document.getElementById('selected-loc-text')?.textContent || 'Mumbai, India';

    if (loc === 'Detecting…' || loc === 'Locating…') {
      showToast('Please wait, still detecting location…', 'error');
      return;
    }

    btn.disabled = true;
    btn.innerHTML = `<span class="spinner spinner-dark"></span> Confirming…`;

    localStorage.setItem('locationData', JSON.stringify({
      location:  loc,
      lat:       selectedLat || DEFAULT_LAT,
      lng:       selectedLng || DEFAULT_LNG,
      confirmed: true,
      timestamp: new Date().toISOString()
    }));

    showToast('Hub location confirmed!', 'success');
    setTimeout(() => { window.location.href = '/pages/Homepage'; }, 800);
  });
}
