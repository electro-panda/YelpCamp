maptilersdk.config.apiKey = maptilerApiKey;

const map = new maptilersdk.Map({
    container: 'map',
    style: maptilersdk.MapStyle.BRIGHT,
    center: c.geometry.coordinates, // starting position [lng, lat]
    zoom: 3 // starting zoom
});

//We set the longitude and langitude
//We set the popup means whenever user click the marker it popups the data given
//and then finally add that to the map
new maptilersdk.Marker()
    .setLngLat(c.geometry.coordinates)
    .setPopup(
        new maptilersdk.Popup({ offset: 25 })
            .setHTML(
                `<h3>${c.title}</h3><p>${c.location}</p>`
            )
    )
    .addTo(map)