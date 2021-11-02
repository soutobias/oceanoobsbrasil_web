// import L from 'leaflet.';
import 'leaflet/dist/leaflet'
import { getData } from '../plugins/get_data';


const metarea = {
  "type": "FeatureCollection",
  "features": [
    { "type": "Feature", "properties": { }, "geometry": { "type": "Polygon", "coordinates": [
        [ [ -53.366666666666703, -33.733333333333299 ], [ -48.0, -36.0 ], [ -43.0, -31.0 ], [ -48.816666666666698, -28.6 ],
        [ -43.0, -31.0 ], [ -38.0, -26.0 ], [ -42.0, -23.016666666666701 ], [ -38.0, -26.0 ], [ -43.0, -31.0 ],
        [ -48.816666666666698, -28.6 ], [ -42.0, -23.016666666666701 ], [ -38.0, -26.0 ], [ -33.0, -21.0 ],
        [ -39.2, -17.766666666666701 ], [ -33.0, -21.0 ], [ -33.0, -15.0 ], [ -38.533333333333303, -13.016666666666699 ],
        [ -33.0, -15.0 ], [ -29.0, -10.0 ], [ -29.0, -3.0 ], [ -35.2, -5.75 ], [ -29.0, -3.0 ], [ -38.0, 2.0 ],
        [ -44.3, -2.48333333333333 ], [ -38.0, 2.0 ], [ -48.0, 7.0 ], [ -51.55, 4.43333333333333 ], [ -48.0, 7.0 ], [ -38.0, 2.0 ],
        [ -44.3, -2.48333333333333 ], [ -38.0, 2.0 ], [ -29.0, -3.0 ], [ -35.2, -5.75 ], [ -29.0, -3.0 ], [ -29.0, -10.0 ],
        [ -33.0, -15.0 ], [ -20.0, -15.0 ], [ -20.0, 7.0 ], [ -48.0, 7.0 ], [ -38.0, 2.0 ], [ -29.0, -3.0 ], [ -29.0, -10.0 ],
        [ -33.0, -15.0 ], [ -20.0, -15.0 ], [ -20.0, -36.0 ], [ -48.0, -36.0 ], [ -43.0, -31.0 ], [ -33.0, -21.0 ],
        [ -38.0, -26.0 ], [ -43.0, -31.0 ], [ -48.0, -36.0 ], [ -53.366666666666703, -33.733333333333299 ] ]
        ] }
    }
  ]
}

const metareaStyle = {
    "color": "#5a5c5a",
    "weight": 4,
    "opacity": 0.4,
    "fillOpacity": 0
};

const waveLimit = 2.5;
const windLimit = 10;
const sstLimit = 20;
const atmpLimit = 15;


const initLeaflet = () => {

  const mapElement = document.getElementById('mapid');

  if (mapElement) {

    const dataElement = document.getElementById('data');
    const token = dataElement.dataset.mapboxApiKey;
    const mymap = L.map('mapid', { zoomControl: false }).setView([-19.039108, -38.954733], 4);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/satellite-v9',
        accessToken: token
    }).addTo(mymap);

    L.geoJSON(metarea, {
      style: metareaStyle
    }).addTo(mymap);

    mapData(mymap);
  }
};


const refreshLeaflet = () => {

  const mapElement = document.getElementById('mapid');

  if (mapElement) {

    const mapDiv = document.getElementById('map');

    mapDiv.innerHTML = "<div id='mapid'></div>";

    const dataElement = document.getElementById('data');
    const token = dataElement.dataset.mapboxApiKey;
    const mymap = L.map('mapid', { zoomControl: false }).setView([-19.039108, -38.954733], 4);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/satellite-v9',
        accessToken: token
    }).addTo(mymap);

    L.geoJSON(metarea, {
      style: metareaStyle
    }).addTo(mymap);

    mapData(mymap);
  }
};


const markerIcon = (text, limit) => {
  let htmlText = text.toFixed(1).toString();

  if (text >= limit) {
    const icon = L.divIcon({
      html: htmlText,
      className: 'red-icon all-icon',
    });
    return icon;

  } else {
    const icon = L.divIcon({
      html: htmlText,
      className: 'white-icon all-icon',
    });
    return icon;
  }
};

const mapData = (mymap) => {
  getData().then(response => response.json())
  .then((data) => {
    console.log(data)
    const activeStation = document.querySelector('.active-station')
    const activeData = document.querySelector('.active-data')
    if (activeStation.id === 'stations') {
      data.forEach((marker) => {
        if (activeData.id === 'wave') {
          if (marker.swvht != null) {
            let text = parseFloat(marker.swvht)
            const icon = markerIcon(text, waveLimit);
            var marker = L.marker([parseFloat(marker.lat), parseFloat(marker.lon)], {icon: icon});
            marker.addTo(mymap);
          }
        } else if (activeData.id === 'wind') {
          if (marker.wspd != null) {
            let text = parseFloat(marker.wspd)
            const icon = markerIcon(text, windLimit);
            var marker = L.marker([parseFloat(marker.lat), parseFloat(marker.lon)], {icon: icon});
            marker.addTo(mymap);
          }
        } else if (activeData.id === 'water-temp') {
          if (marker.sst != null) {
            let text = parseFloat(marker.sst)
            const icon = markerIcon(text, sstLimit);
            var marker = L.marker([parseFloat(marker.lat), parseFloat(marker.lon)], {icon: icon});
            marker.addTo(mymap);
          }
        } else if (activeData.id === 'air-temp') {
          if (marker.atmp != null) {
            let text = parseFloat(marker.atmp)
            const icon = markerIcon(text, atmpLimit);
            var marker = L.marker([parseFloat(marker.lat), parseFloat(marker.lon)], {icon: icon});
            marker.addTo(mymap);
          }
        }
      });
    } else {
      data.forEach((marker) => {
        if (activeData.id === 'wave') {
          if (marker.swvht != null) {
            let text = parseFloat(marker.swvht)
            const icon = markerIcon(text, waveLimit);
            var marker = L.marker([parseFloat(marker.lat), parseFloat(marker.lon)], {icon: icon});
            marker.addTo(mymap);
          }
        } else if (activeData.id === 'wind') {
          if (marker.wspd != null) {
            let text = parseFloat(marker.wspd)
            const icon = markerIcon(text, windLimit);
            var marker = L.marker([parseFloat(marker.lat), parseFloat(marker.lon)], {icon: icon});
            marker.addTo(mymap);
          }
        } else if (activeData.id === 'water-temp') {
          if (marker.sst != null) {
            let text = parseFloat(marker.sst)
            const icon = markerIcon(text, sstLimit);
            var marker = L.marker([parseFloat(marker.lat), parseFloat(marker.lon)], {icon: icon});
            marker.addTo(mymap);
          }
        } else if (activeData.id === 'air-temp') {
          if (marker.atmp != null) {
            let text = parseFloat(marker.atmp)
            const icon = markerIcon(text, atmpLimit);
            var marker = L.marker([parseFloat(marker.lat), parseFloat(marker.lon)], {icon: icon});
            marker.addTo(mymap);
          }
        }
      });
    }
  });
};

export { initLeaflet, refreshLeaflet };
