window.addEventListener('DOMContentLoaded', () => {
  // 1) Initialize the map centered on the U.S.
  const map = L.map('map').setView([39.5, -98.35], 4);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // 2) Fetch your JSON from the site root
  fetch('/parks_data.json')
    .then(res => {
      if (!res.ok) throw new Error('Failed to load parks_data.json');
      return res.json();
    })
    .then(data => {
      window.allMarkers = data.map(item => {
        const marker = L.marker([item.latitude, item.longitude])
          .bindPopup(`
            <strong>${item.name}</strong><br>
            ${item.temperature || ''}<br>
            ${item.wind        || ''}<br>
            ${item.forecast    || ''}
          `)
          .addTo(map);
        return { marker, data: item };
      });
    })
    .catch(err => console.error(err));

  // 3) Filtering logic
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

  // 4) Wire up filter inputs
  document.getElementById('nameFilter')
    .addEventListener('input', applyFilters);
  document.getElementById('forecastFilter')
    .addEventListener('input', applyFilters);
});
