// script.js
window.addEventListener('DOMContentLoaded', () => {
  // 1) Initialize the map centered on California at zoom 6
  const map = L.map('map').setView([36.7784, -119.4179], 6);

  // 2a) Base OpenStreetMap layer
  const osmLayer = L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    { attribution: '&copy; OpenStreetMap contributors' }
  ).addTo(map);

  // 2b) Elevation contours overlay
  const contourLayer = L.tileLayer(
    'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    {
      maxZoom: 17,
      attribution:
        'Map data: &copy; OpenStreetMap contributors, SRTM | Contours: &copy; OpenTopoMap'
    }
  );

  // 2c) Layer control for base maps and overlays
  L.control.layers(
    { 'OSM Standard': osmLayer },
    { 'Elevation Contours': contourLayer }
  ).addTo(map);

  // 3) Fetch parks_data.json once: update timestamp then render markers
  fetch('../../parks_data.json')
    .then(res => {
      // Update the timestamp header
      const lm = res.headers.get('last-modified');
      if (lm) {
        const when = new Date(lm).toLocaleString('en-US', {
          dateStyle: 'short',
          timeStyle: 'medium',
          timeZoneName: 'short'
        });
        document.getElementById('last-updated-time').textContent =
          `Data last updated: ${when}`;
      }
      if (!res.ok) throw new Error('Failed to load parks_data.json');
      return res.json();
    })
    .then(data => {
      // Build markers for each park
      window.allMarkers = data.map(item => {
        const marker = L.marker([item.latitude, item.longitude])
          .bindPopup(
            `<strong>${item.name}</strong><br>` +
            `${item.temperature || ''}<br>` +
            `${item.wind        || ''}<br>` +
            `${item.forecast    || ''}`
          )
          .addTo(map);
        return { marker, data: item };
      });
    })
    .catch(err => console.error(err));

  // 4) Filtering logic remains the same
  function applyFilters() {
    const nameTerm     = document.getElementById('nameFilter').value.toLowerCase();
    const forecastTerm = document.getElementById('forecastFilter').value.toLowerCase();
    window.allMarkers.forEach(({ marker, data }) => {
      const okName     = data.name.toLowerCase().includes(nameTerm);
      const okForecast = !forecastTerm ||
                         (data.forecast && data.forecast.toLowerCase().includes(forecastTerm));
      if (okName && okForecast) {
        marker.addTo(map);
      } else {
        map.removeLayer(marker);
      }
    });
  }

  // 5) Wire up filter inputs
  document.getElementById('nameFilter')
    .addEventListener('input', applyFilters);
  document.getElementById('forecastFilter')
    .addEventListener('input', applyFilters);
});
