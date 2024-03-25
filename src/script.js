var map = L.map('mapid', {
    minZoom: 0,
    maxZoom: 4,
    center: [0, 0],
    zoom: 1,
    crs: L.CRS.Simple,
    attributionControl: false
});

var w = 11520,
    h = 5514,
    url = './images/Eveeye-Regions-2.png';

// calculate the edges of the image, in coordinate space
var southWest = map.unproject([0, h], map.getMaxZoom()-1);
var northEast = map.unproject([w, 0], map.getMaxZoom()-1);
var bounds = new L.LatLngBounds(southWest, northEast);

var baseLayer = L.imageOverlay(url, bounds).addTo(map);

map.setMaxBounds(bounds);

map.fitBounds(bounds);

L.control.attribution({
    prefix: false
}).addAttribution('&copy; <a href="https://eveeye.com/?m=Regions&o=nodeout_sec,node_sec,sub_npcs,sector_none,tag_none,etag_sig,con_none,thera,dark">Eveeye Explorer</a>').addTo(map);

//map.on('click', function(e) {
    //console.log(e.latlng);
//});

// coordinates of systems
const subsystems = [
    {
        name: 'The Forge',
        coords: [[-220.25, 790.3808306093216], [-228.75, 797.8845263892459]],
        img: './images/Eveeye-The-Forge.png',
        width: 11520,
        height: 5514
    }
];

var subsystemRectangles = [];
subsystems.forEach((subsystem) => {
    const rectangle = L.rectangle(subsystem.coords, {color: "transparent", weight: 1}).addTo(map);
    subsystemRectangles.push(rectangle);

    rectangle.on('dblclick', function (e) {
        map.eachLayer(function (layer) {
            map.removeLayer(layer);
        });

        const subsystemSouthWest = map.unproject([0, subsystem.height], map.getMaxZoom()-1);
        const subsystemNorthEast = map.unproject([subsystem.width, 0], map.getMaxZoom()-1);
        const subsystemBounds = new L.LatLngBounds(subsystemSouthWest, subsystemNorthEast);

        const subsystemImage = L.imageOverlay(subsystem.img, subsystemBounds);
        subsystemImage.addTo(map);
        document.querySelector('.back-btn').style.display = 'block';
    });

    rectangle.on('contextmenu', function (e) {
        var popup = L.popup()
            .setLatLng(e.latlng)
            .setContent('<div class="my-popup"></div><a href="#">Show Info</a><br><a href="#">Resources</a></div>')
            .openOn(map);
    });
});

// back to the base button
var backBtn = L.control({position: 'topleft'});

backBtn.onAdd = function (map) {
    var container = L.DomUtil.create('div', 'back-btn');
    container.textContent = "Back to Base Map";
    container.style.display = "none";
    container.style.background = 'rgba(255,255,255,0.5)';
    container.style.padding = '10px';
    container.style.fontWeight = 'bold';
    container.style.cursor = 'pointer';
    container.onclick = function(){
        map.eachLayer(function (layer) {
            map.removeLayer(layer);
        });
        baseLayer.addTo(map);
        subsystemRectangles.forEach(rect => rect.addTo(map));
        container.style.display = 'none';
    };
    return container;
};

backBtn.addTo(map);

