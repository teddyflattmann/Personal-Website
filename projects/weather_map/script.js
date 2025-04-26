// script.js

window.addEventListener('DOMContentLoaded', init);

function init() {
  // Kick things off: load data (and timestamp), then build the map
  fetchDataAndTimestamp()
    .then(parks => {
      const map = createMap();
      addBaseLayers(map);
      plotParks(map, parks);
      setupFilters(map);
    })
    .catch(err => {
      console.error('Something went wrong:', err);
      const stampEl = document.getElementById('last-updated-time');
      if (stampEl) stampEl.textContent = 'Unable to load data.';
    });
}

/**
 * Fetches parks_data.json via GET so we can read Last-Modified,
 * then returns parsed JSON.
 */
function fetchDataAndTimestamp() {
  const url = '../../parks_data.json';
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} – ${response.statusText}`);
      }

      // Stamp it
      const lm = response.headers.get('last-modified');
      if (lm) {
        const formatted = new Date(lm).toLocaleString('en-US', {
          dateStyle: 'short',
          timeStyle: 'medium',
          timeZoneName: 'short'
        });
        document.getElementById('last-updated-time').textContent =
          `Data last updated: ${formatted}`;
      } else {
        console.warn('No Last-Modified header found.');
      }

      // Hand off the JSON
      return response.json();
    });
}

/** Creates the Leaflet map centered on CA and returns it. */
function createMap() {
  const centerLatLng = [36.8, -119.4];
  const zoomLevel    = 6;
  const map = L.map('map').setView(centerLatLng, zoomLevel);

  console.log(`Map initialized at ${centerLatLng} @ zoom ${zoomLevel}`);
  return map;
}

/** Adds OSM and contour layers (contours off by default). */
function addBaseLayers(map) {
  const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const contours = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: 'Map data: &copy; OSM, SRTM | Contours: &copy; OpenTopoMap'
  });

  L.control.layers(
    { 'OSM Standard': osm },
    { 'Elevation Contours': contours }
  ).addTo(map);
}

/** Drops a marker for each park, storing them globally for filtering. */
function plotParks(map, parks) {
  window.allMarkers = parks.map(park => {
    const { latitude, longitude, name, temperature, wind, forecast } = park;
    const popupHtml = `
      <strong>${name}</strong><br>
      ${temperature || ''}<br>
      ${wind        || ''}<br>
      ${forecast    || ''}
    `.trim();

    const marker = L.marker([latitude, longitude])
      .bindPopup(popupHtml)
      .addTo(map);

    return { marker, data: park };
  });

  console.log(`Plotted ${parks.length} park markers.`);
}

/** Wire up the two text inputs to filter markers on the fly. */
function setupFilters(map) {
  const nameInput     = document.getElementById('nameFilter');
  const forecastInput = document.getElementById('forecastFilter');

  const apply = () => {
    const nameTerm     = nameInput.value.toLowerCase();
    const forecastTerm = forecastInput.value.toLowerCase();

    window.allMarkers.forEach(({ marker, data }) => {
      const nameOK     = data.name.toLowerCase().includes(nameTerm);
      const forecastOK = !forecastTerm ||
                         (data.forecast && data.forecast.toLowerCase().includes(forecastTerm));

      if (nameOK && forecastOK) marker.addTo(map);
      else                       map.removeLayer(marker);
    });
  };

  nameInput.addEventListener('input', apply);
  forecastInput.addEventListener('input', apply);
}

