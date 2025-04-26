// script.js
window.addEventListener('DOMContentLoaded', () => {
  // 1) Initialize the map & layers immediately
  const map = L.map('map').setView([36.8, -119.4], 6);
  
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
  
  // 2) Prepare filtering (markers will be added later)
  window.allMarkers = [];
  setupFilters();

  // 3) Fetch data + timestamp + plot markers
fetch('../../parks_data.json')
  .then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    // grab the Last-Modified header
    const lm = res.headers.get('last-modified');
    if (lm) {
      // simple formatting only—no options object
      const when = new Date(lm).toLocaleString();
      document.getElementById('last-updated-time').textContent =
        `Data last updated: ${when}`;
    } else {
      console.warn('No Last-Modified header found.');
    }

    // now parse and plot
    return res.json();
  })
  .then(data => {
    data.forEach(item => {
      const marker = L.marker([item.latitude, item.longitude])
        .bindPopup(`
          <strong>${item.name}</strong><br>
          ${item.temperature || ''}<br>
          ${item.wind        || ''}<br>
          ${item.forecast    || ''}
        `)
        .addTo(map);
      window.allMarkers.push({ marker, data: item });
    });
  })
  .catch(err => {
    console.error('Error loading parks:', err);
    document.getElementById('last-updated-time').textContent =
      'Unable to load data.';
  });


/** Wires up the two filter inputs to show/hide markers */
function setupFilters() {
  const nameInput     = document.getElementById('nameFilter');
  const forecastInput = document.getElementById('forecastFilter');

  const apply = () => {
    const nameTerm     = nameInput.value.toLowerCase();
    const forecastTerm = forecastInput.value.toLowerCase();

    window.allMarkers.forEach(({ marker, data }) => {
      const okName     = data.name.toLowerCase().includes(nameTerm);
      const okForecast = !forecastTerm ||
                         (data.forecast && data.forecast.toLowerCase().includes(forecastTerm));
      if (okName && okForecast) marker.addTo(marker._map);
      else                       marker.remove();
    });
  };

  nameInput.addEventListener('input', apply);
  forecastInput.addEventListener('input', apply);
}


