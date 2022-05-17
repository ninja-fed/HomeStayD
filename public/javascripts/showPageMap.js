mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10', // stylesheet location
    center: homestay.geometry.coordinates,
    zoom: 10 // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(homestay.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
        .setHTML(
            `<h3>${homestay.title}</h3><p>${homestay.location}</p>`
        )
    )
    .addTo(map)