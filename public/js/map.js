// public/js/map.js
function initializeMap(token, lng, lat) {
  mapboxgl.accessToken = token;
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [lng, lat],
    zoom: 10
  });
  new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
}
