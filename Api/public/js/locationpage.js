/**
 * ============================================================
 * APNA MANDI — Location Page
 * ============================================================
 * 
 * Features:
 * - Interactive Leaflet map
 * - GPS location detection
 * - Search with autocomplete
 * - Reverse geocoding
 * - Draggable marker
 * - Click to select location
 * 
 * ============================================================
 */

'use strict';

// Default center: Mumbai, India
const DEFAULT_LAT = 19.0760;
const DEFAULT_LNG = 72.8777;

// Global variables
let map = null;
let marker = null;
let selectedLat = DEFAULT_LAT;
let selectedLng = DEFAULT_LNG;
let selectedAddress = 'Mumbai, India';
let searchTimer = null;
let geocodeTimer = null;

/**
 * Initialize location page
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('Location page initializing...');
  
  // Wait for Leaflet to load with retry mechanism
  let retryCount = 0;
  const maxRetries = 10;
  
  const checkLeaflet = () => {
    if (typeof L !== 'undefined') {
      console.log('Leaflet loaded successfully');
      try {
        initMap();
        initSearch();
        initGPS();
        initConfirm();
        loadSavedLocation();
      } catch (err) {
        console.error('Location page initialization error:', err);
        showToast('Failed to initialize location page', 'error');
      }
    } else {
      retryCount++;
      if (retryCount < maxRetries) {
        console.log(`Waiting for Leaflet... (attempt ${retryCount}/${maxRetries})`);
        setTimeout(checkLeaflet, 200);
      } else {
        console.error('Leaflet failed to load after multiple attempts');
        showToast('Map library failed to load. Please refresh the page.', 'error');
        
        // Show error message on map
        const mapEl = document.getElementById('map');
        if (mapEl) {
          mapEl.innerHTML = `
            <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:2rem;text-align:center;color:var(--text-muted)">
              <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-bottom:1rem;opacity:0.5">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
              <p style="font-weight:600;margin-bottom:0.5rem">Map Failed to Load</p>
              <p style="font-size:0.875rem">Please refresh the page or check your internet connection</p>
            </div>
          `;
        }
      }
    }
  };
  
  checkLeaflet();
});

/**
 * Initialize Leaflet map
 */
function initMap() {
  console.log('Initializing map...');
  
  try {
    // Create map
    map = L.map('map', {
      center: [DEFAULT_LAT, DEFAULT_LNG],
      zoom: 13,
      zoomControl: true,
      attributionControl: false,
      scrollWheelZoom: true,
      dragging: true,
      touchZoom: true,
      doubleClickZoom: true
    });

    console.log('Map created successfully');

    // Add CartoDB Positron tiles (clean, light style)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      minZoom: 3,
      attribution: '© OpenStreetMap © CARTO',
      subdomains: 'abcd'
    }).addTo(map);

    console.log('Tiles added successfully');

    // Create custom marker icon (purple teardrop)
    const markerIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.163 0 0 7.163 0 16c0 10 16 26 16 26S32 26 32 16C32 7.163 24.837 0 16 0z" fill="#8A2BE2"/>
          <circle cx="16" cy="16" r="7" fill="white"/>
        </svg>
      `,
      iconSize: [32, 42],
      iconAnchor: [16, 42],
      popupAnchor: [0, -42]
    });

    // Add draggable marker
    marker = L.marker([DEFAULT_LAT, DEFAULT_LNG], {
      icon: markerIcon,
      draggable: true,
      autoPan: true
    }).addTo(map);

    console.log('Marker added successfully');

    // Map click event - move marker and reverse geocode
    map.on('click', (e) => {
      console.log('Map clicked:', e.latlng);
      const { lat, lng } = e.latlng;
      moveMarkerTo(lat, lng);
      reverseGeocode(lat, lng);
      hideMapHint();
    });

    // Marker drag event - reverse geocode on drag end
    marker.on('dragend', () => {
      const { lat, lng } = marker.getLatLng();
      console.log('Marker dragged to:', lat, lng);
      selectedLat = lat;
      selectedLng = lng;
      updateCoordinatesDisplay(lat, lng);
      reverseGeocode(lat, lng);
      hideMapHint();
    });

    // Hide hint on any interaction
    map.on('movestart', hideMapHint);

    // Force map to recalculate size
    setTimeout(() => {
      map.invalidateSize();
      console.log('Map size invalidated');
    }, 100);

    console.log('Map initialization complete');
  } catch (err) {
    console.error('Map initialization error:', err);
    showToast('Failed to initialize map', 'error');
  }
}

/**
 * Move marker to specific coordinates
 */
function moveMarkerTo(lat, lng) {
  try {
    selectedLat = lat;
    selectedLng = lng;
    
    if (marker) {
      marker.setLatLng([lat, lng]);
    }
    
    if (map) {
      map.setView([lat, lng], 15, {
        animate: true,
        duration: 0.5
      });
    }
    
    updateCoordinatesDisplay(lat, lng);
    console.log('Marker moved to:', lat, lng);
  } catch (err) {
    console.error('Move marker error:', err);
  }
}

/**
 * Update coordinates display
 */
function updateCoordinatesDisplay(lat, lng) {
  try {
    const latEl = document.getElementById('lat-val');
    const lngEl = document.getElementById('lng-val');
    const coordsEl = document.getElementById('coords-display');
    
    if (latEl) latEl.textContent = lat.toFixed(5);
    if (lngEl) lngEl.textContent = lng.toFixed(5);
    if (coordsEl) coordsEl.style.display = 'block';
  } catch (err) {
    console.error('Update coordinates error:', err);
  }
}

/**
 * Update selected location text
 */
function updateLocationText(text) {
  try {
    const el = document.getElementById('selected-loc-text');
    if (el) {
      el.textContent = text;
      selectedAddress = text;
    }
    console.log('Location text updated:', text);
  } catch (err) {
    console.error('Update location text error:', err);
  }
}

/**
 * Hide map hint overlay
 */
function hideMapHint() {
  try {
    const hint = document.getElementById('map-hint');
    if (hint) {
      hint.style.opacity = '0';
      setTimeout(() => {
        hint.style.display = 'none';
      }, 300);
    }
  } catch (err) {
    console.error('Hide map hint error:', err);
  }
}

/**
 * Reverse geocode coordinates to address
 */
function reverseGeocode(lat, lng) {
  clearTimeout(geocodeTimer);
  updateLocationText('Locating…');

  geocodeTimer = setTimeout(async () => {
    try {
      console.log('Reverse geocoding:', lat, lng);
      
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;
      const response = await fetch(url, {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'ApnaMandi/1.0'
        }
      });

      if (!response.ok) {
        throw new Error('Geocoding failed');
      }

      const data = await response.json();
      console.log('Geocoding result:', data);

      // Extract meaningful address
      const addr = data.address || {};
      const parts = [
        addr.neighbourhood || addr.suburb || addr.village || addr.hamlet,
        addr.city || addr.town || addr.municipality || addr.county,
        addr.state || addr.region
      ].filter(Boolean);

      let address = parts.join(', ');
      
      if (!address && data.display_name) {
        address = data.display_name.split(',').slice(0, 3).join(',');
      }
      
      if (!address) {
        address = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      }

      updateLocationText(address);
      showToast('Location detected', 'success');
    } catch (err) {
      console.error('Reverse geocoding error:', err);
      updateLocationText(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      showToast('Could not get address', 'error');
    }
  }, 600);
}

/**
 * Initialize search functionality
 */
function initSearch() {
  const input = document.getElementById('hub-search');
  const dropdown = document.getElementById('location-suggestions');
  const spinner = document.getElementById('search-spinner');

  if (!input || !dropdown) {
    console.error('Search elements not found');
    return;
  }

  console.log('Search initialized');

  // Search input handler
  input.addEventListener('input', () => {
    const query = input.value.trim();
    clearTimeout(searchTimer);

    if (!query) {
      dropdown.style.display = 'none';
      if (spinner) spinner.style.display = 'none';
      return;
    }

    if (spinner) spinner.style.display = 'block';

    searchTimer = setTimeout(async () => {
      try {
        console.log('Searching for:', query);
        
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=6&countrycodes=in&addressdetails=1`;
        const response = await fetch(url, {
          headers: {
            'Accept-Language': 'en',
            'User-Agent': 'ApnaMandi/1.0'
          }
        });

        if (spinner) spinner.style.display = 'none';

        if (!response.ok) {
          throw new Error('Search failed');
        }

        const results = await response.json();
        console.log('Search results:', results.length);

        if (!results.length) {
          dropdown.innerHTML = `
            <div style="padding:0.875rem 1rem;font-size:0.875rem;color:var(--text-muted);text-align:center">
              No results found
            </div>
          `;
          dropdown.style.display = 'block';
          return;
        }

        // Render results
        dropdown.innerHTML = results.map(result => {
          const displayName = result.display_name.split(',').slice(0, 3).join(', ');
          return `
            <div class="location-suggestion" 
                 data-lat="${result.lat}" 
                 data-lng="${result.lon}"
                 data-name="${displayName}"
                 style="padding:0.75rem 1rem;display:flex;align-items:center;gap:0.75rem;cursor:pointer;transition:background 0.15s ease;border-bottom:1px solid var(--border-light)">
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="flex-shrink:0;color:var(--text-muted)">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <span style="font-size:0.875rem;line-height:1.4;color:var(--text-primary)">${displayName}</span>
            </div>
          `;
        }).join('');

        dropdown.style.display = 'block';

        // Add click handlers to suggestions
        dropdown.querySelectorAll('.location-suggestion').forEach(el => {
          el.addEventListener('mouseenter', () => {
            el.style.background = 'var(--bg-soft)';
          });
          el.addEventListener('mouseleave', () => {
            el.style.background = 'transparent';
          });
          el.addEventListener('click', () => {
            const lat = parseFloat(el.dataset.lat);
            const lng = parseFloat(el.dataset.lng);
            const name = el.dataset.name;
            
            console.log('Suggestion selected:', name, lat, lng);
            
            input.value = name;
            dropdown.style.display = 'none';
            moveMarkerTo(lat, lng);
            updateLocationText(name);
            showToast('Location selected', 'success');
          });
        });
      } catch (err) {
        console.error('Search error:', err);
        if (spinner) spinner.style.display = 'none';
        dropdown.style.display = 'none';
        showToast('Search failed', 'error');
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

/**
 * Initialize GPS functionality
 */
function initGPS() {
  const gpsBtn = document.getElementById('use-gps-btn');
  
  if (!gpsBtn) {
    console.error('GPS button not found');
    return;
  }

  console.log('GPS initialized');

  gpsBtn.addEventListener('click', () => {
    console.log('GPS button clicked');
    getGPSLocation(true);
  });
}

/**
 * Get GPS location
 */
function getGPSLocation(showFeedback = false) {
  if (!('geolocation' in navigator)) {
    console.error('Geolocation not supported');
    if (showFeedback) {
      showToast('GPS not supported on this device', 'error');
    }
    return;
  }

  console.log('Getting GPS location...');
  
  if (showFeedback) {
    showToast('Getting your location…', 'info');
  }

  const options = {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 0
  };

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      console.log('GPS location obtained:', latitude, longitude);
      
      moveMarkerTo(latitude, longitude);
      reverseGeocode(latitude, longitude);
      
      if (showFeedback) {
        showToast('Location found!', 'success');
      }
    },
    (error) => {
      console.error('GPS error:', error);
      
      let message = 'Could not get location';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          message = 'Location permission denied. Please enable location access.';
          break;
        case error.POSITION_UNAVAILABLE:
          message = 'Location information unavailable. Try searching manually.';
          break;
        case error.TIMEOUT:
          message = 'Location request timed out. Try again.';
          break;
      }
      
      if (showFeedback) {
        showToast(message, 'error');
      }
    },
    options
  );
}

/**
 * Load saved location from localStorage
 */
function loadSavedLocation() {
  try {
    const saved = JSON.parse(localStorage.getItem('locationData') || '{}');
    
    if (saved.lat && saved.lng) {
      console.log('Loading saved location:', saved);
      moveMarkerTo(saved.lat, saved.lng);
      if (saved.location) {
        updateLocationText(saved.location);
      }
    } else {
      // Try GPS silently on first load
      console.log('No saved location, trying GPS...');
      getGPSLocation(false);
    }
  } catch (err) {
    console.error('Load saved location error:', err);
    getGPSLocation(false);
  }
}

/**
 * Initialize confirm button
 */
function initConfirm() {
  const confirmBtn = document.getElementById('confirm-btn');
  
  if (!confirmBtn) {
    console.error('Confirm button not found');
    return;
  }

  console.log('Confirm button initialized');

  confirmBtn.addEventListener('click', () => {
    try {
      const locationText = selectedAddress || document.getElementById('selected-loc-text')?.textContent || 'Mumbai, India';

      // Check if still detecting
      if (locationText === 'Detecting…' || locationText === 'Locating…') {
        showToast('Please wait, still detecting location…', 'error');
        return;
      }

      console.log('Confirming location:', locationText, selectedLat, selectedLng);

      // Show loading state
      confirmBtn.disabled = true;
      confirmBtn.innerHTML = `<span class="spinner"></span> Confirming…`;

      // Save to localStorage
      const locationData = {
        location: locationText,
        lat: selectedLat,
        lng: selectedLng,
        confirmed: true,
        timestamp: new Date().toISOString()
      };

      localStorage.setItem('locationData', JSON.stringify(locationData));
      console.log('Location saved:', locationData);

      showToast('Hub location confirmed!', 'success');

      // Redirect to homepage
      setTimeout(() => {
        window.location.href = '/pages/homepage';
      }, 800);
    } catch (err) {
      console.error('Confirm location error:', err);
      confirmBtn.disabled = false;
      confirmBtn.innerHTML = 'Confirm Hub Location';
      showToast('Failed to confirm location', 'error');
    }
  });
}
