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
        [ -33.0, -15.0 ], [ -20.0, -15.0 ], [ -20.0, -36.0 ], [ -48.0, -36.0 ], [ -43.0, -31.0 ], [ -38.0, -26.0 ], [ -33.0, -21.0 ],
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
const visibilityLimit = 5.2;
const tideLimit = 3;


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
    mymap.on('click', function(e) {
        alert("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng)
    });
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

    const loader = document.getElementById('loader');
    loader.classList.remove('inactive-tab');

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

const generateTipText = (mark) => {
  let dataType
  if (mark.data_type === 'buoy'){
    dataType = 'Boia';
  } else if (mark.data_type === 'meteorological_station') {
    dataType = 'Estação Meteorológica';
  } else if (mark.data_type === 'tide') {
    dataType = 'Estação Maregráfica';
  } else if (mark.data_type === 'cleaning') {
    dataType = 'Balneabilidade';
  } else if (mark.data_type === 'visual') {
    dataType = 'Observação Visual';
  }
  return `${dataType} - ${mark.institution.toUpperCase()}: ${mark.name.toUpperCase()}`
}

const generatePopupText = (mark) => {
  let dateTime = `${mark.date_time.slice(8,10)}/${mark.date_time.slice(5,7)} ${mark.date_time.slice(11,16)}`
  let header = `<div class='pop-up'>
          <p class='m-0 p-0'><strong>LAT:</strong> ${Math.round(parseFloat(mark.lat)*1000)/1000}, <strong>LON:</strong> ${Math.round(parseFloat(mark.lon)*1000)/1000}</p>
          <p class='m-0 p-0'><strong>DATAHORA:</strong> ${dateTime}</p>`
  let text
  if (mark.data_type === 'buoy'){
    text = `<p class='m-0 p-0'><strong>Alt. Onda:</strong> ${parseFloat(mark.swvht)} m</p>
            <p class='m-0 p-0'><strong>Max. Onda:</strong> ${parseFloat(mark.mxwvht)} m</p>
            <p class='m-0 p-0'><strong>Dir. Onda:</strong> ${parseFloat(mark.wvdir)} °</p>
            <p class='m-0 p-0'><strong>Per. Onda:</strong> ${parseFloat(mark.tp)} s</p>
            <p class='m-0 p-0'><strong>Temp. Água:</strong> ${parseFloat(mark.sst)} °C</p>
            <p class='m-0 p-0'><strong>Vel. Vento:</strong> ${parseFloat(mark.wspd)} nós</p>
            <p class='m-0 p-0'><strong>Dir. Vento:</strong> ${parseFloat(mark.wdir)} °</p>
            <p class='m-0 p-0'><strong>Rajada:</strong> ${parseFloat(mark.gust)} nós</p>
            <p class='m-0 p-0'><strong>Temp. Ar:</strong> ${parseFloat(mark.atmp)} °C</p>
            <p class='m-0 p-0'><strong>Pres:</strong> ${parseFloat(mark.pres)} mb</p></div>`
  } else if (mark.data_type === 'meteorological_station') {
    text = `<p class='m-0 p-0'><strong>Vel. Vento:</strong> ${parseFloat(mark.wspd)} nós</p>
            <p class='m-0 p-0'><strong>Dir. Vento:</strong> ${parseFloat(mark.wdir)} °</p>
            <p class='m-0 p-0'><strong>Rajada:</strong> ${parseFloat(mark.gust)} nós</p>
            <p class='m-0 p-0'><strong>Temp. Ar:</strong> ${parseFloat(mark.atmp)} °C</p>
            <p class='m-0 p-0'><strong>Pres:</strong> ${parseFloat(mark.pres)} mb</p>
            <p class='m-0 p-0'><strong>Visibility:</strong> ${parseFloat(mark.visibility)} mi</p></div>`
  } else if (mark.data_type === 'tide') {
    text = `<p class='m-0 p-0'><strong>Maré Meteorológica:</strong> ${parseFloat(mark.meteorological_tide)} m</p>
            <p class='m-0 p-0'><strong>Temp. Água:</strong> ${parseFloat(mark.sst)} °C</p>
            <p class='m-0 p-0'><strong>Vel. Vento:</strong> ${parseFloat(mark.wspd)} nós</p>
            <p class='m-0 p-0'><strong>Dir. Vento:</strong> ${parseFloat(mark.wdir)} °</p>
            <p class='m-0 p-0'><strong>Rajada:</strong> ${parseFloat(mark.gust)} nós</p>
            <p class='m-0 p-0'><strong>Temp. Ar:</strong> ${parseFloat(mark.atmp)} °C</p>
            <p class='m-0 p-0'><strong>Pres:</strong> ${parseFloat(mark.pres)} mb</p></div>`
  } else if (mark.data_type === 'cleaning') {
    text = `<p class='m-0 p-0'><strong>Balneabilidade:</strong> ${mark.cleaning}</p></div>`
  } else if (mark.data_type === 'visual') {
    text = `<p class='m-0 p-0'><strong>Alt. Onda:</strong> ${parseFloat(mark.swvht)} m</p>
            <p class='m-0 p-0'><strong>Dir. Onda:</strong> ${parseFloat(mark.wvdir)} °</p>
            <p class='m-0 p-0'><strong>Per. Onda:</strong> ${parseFloat(mark.tp)} s</p>
            <p class='m-0 p-0'><strong>Temp. Água:</strong> ${parseFloat(mark.sst)} °C</p></div>`
  }
  return `${header}${text}`
};


const generateTipTextNo = (mark) => {
  let dataType
  if (mark.data_type === 'gts'){
    dataType = 'GTS';
  } else if (mark.data_type === 'scatterometer') {
    dataType = 'ESCATERÔMETRO';
  } else if (mark.data_type === 'altimeter') {
    dataType = 'ALTIMETRIA';
  }
  return `${dataType} - ${mark.institution.toUpperCase()}`
}

const generatePopupTextNo = (mark) => {
  let dateTime = `${mark.date_time.slice(8,10)}/${mark.date_time.slice(5,7)} ${mark.date_time.slice(11,16)}`
  let header = `<div class='pop-up'>
          <p class='m-0 p-0'><strong>LAT:</strong> ${Math.round(parseFloat(mark.lat)*1000)/1000}, <strong>LON:</strong> ${Math.round(parseFloat(mark.lon)*1000)/1000}</p>
          <p class='m-0 p-0'><strong>DATAHORA:</strong> ${dateTime}</p>`
  let text
  if (mark.data_type === 'gts'){
    text = `<p class='m-0 p-0'><strong>Alt. Onda:</strong> ${parseFloat(mark.swvht)} m</p>
            <p class='m-0 p-0'><strong>Alt. Onda Swell:</strong> ${parseFloat(mark.swvht_swell)} m</p>
            <p class='m-0 p-0'><strong>Dir. Onda:</strong> ${parseFloat(mark.wvdir)} °</p>
            <p class='m-0 p-0'><strong>Dir. Onda Swell:</strong> ${parseFloat(mark.wvdir_swell)} °</p>
            <p class='m-0 p-0'><strong>Per. Onda:</strong> ${parseFloat(mark.tp)} s</p>
            <p class='m-0 p-0'><strong>Temp. Água:</strong> ${parseFloat(mark.sst)} °C</p>
            <p class='m-0 p-0'><strong>Vel. Vento:</strong> ${parseFloat(mark.wspd)} nós</p>
            <p class='m-0 p-0'><strong>Dir. Vento:</strong> ${parseFloat(mark.wdir)} °</p>
            <p class='m-0 p-0'><strong>Rajada:</strong> ${parseFloat(mark.gust)} nós</p>
            <p class='m-0 p-0'><strong>Temp. Ar:</strong> ${parseFloat(mark.atmp)} °C</p>
            <p class='m-0 p-0'><strong>Pres:</strong> ${parseFloat(mark.pres)} °C</p></div>`
  } else if (mark.data_type === 'scatterometer') {
    text = `<p class='m-0 p-0'><strong>Vel. Vento:</strong> ${parseFloat(mark.wspd)} nós</p>
            <p class='m-0 p-0'><strong>Dir. Vento:</strong> ${parseFloat(mark.wdir)} °</p></div>`
  } else if (mark.data_type === 'altimeter') {
    text = `<p class='m-0 p-0'><strong>Alt. Onda:</strong> ${parseFloat(mark.swvht)} m</p>
            <p class='m-0 p-0'><strong>Vel. Vento:</strong> ${parseFloat(mark.wspd)} nós</p></div>`
  }
  return `${header}${text}`
};



const mapData = (mymap) => {
  getData().then(response => response.json())
  .then((data) => {
    console.log(data)
    const activeStation = document.querySelector('.active-station')
    const activeData = document.querySelector('.active-data')

    if (activeStation.id === 'stations') {
      data.forEach((mark) => {
        if (activeData.id === 'wave') {
          if (mark.swvht != null) {
            let text = parseFloat(mark.swvht)
            const icon = markerIcon(text, waveLimit);
            var marker = L.marker([parseFloat(mark.lat), parseFloat(mark.lon)], {icon: icon, riseOnHover: true});
            const tipText = generateTipText(mark);
            const popupText = generatePopupText(mark);
            marker.bindPopup(popupText);
            marker.bindTooltip(tipText).openTooltip();
            marker.addTo(mymap);
          }
        } else if (activeData.id === 'wind') {
          if (mark.wspd != null) {
            let text = parseFloat(mark.wspd)
            const icon = markerIcon(text, windLimit);
            var marker = L.marker([parseFloat(mark.lat), parseFloat(mark.lon)], {icon: icon, riseOnHover: true});
            const tipText = generateTipText(mark);
            const popupText = generatePopupText(mark);
            marker.bindPopup(popupText);
            marker.bindTooltip(tipText).openTooltip();
            marker.addTo(mymap);
          }
        } else if (activeData.id === 'water-temp') {
          if (mark.sst != null) {
            let text = parseFloat(mark.sst)
            const icon = markerIcon(text, sstLimit);
            var marker = L.marker([parseFloat(mark.lat), parseFloat(mark.lon)], {icon: icon, riseOnHover: true});
            const tipText = generateTipText(mark);
            const popupText = generatePopupText(mark);
            marker.bindPopup(popupText);
            marker.bindTooltip(tipText).openTooltip();
            marker.addTo(mymap);
          }
        } else if (activeData.id === 'air-temp') {
          if (mark.atmp != null) {
            let text = parseFloat(mark.atmp)
            const icon = markerIcon(text, atmpLimit);
            var marker = L.marker([parseFloat(mark.lat), parseFloat(mark.lon)], {icon: icon, riseOnHover: true});
            const tipText = generateTipText(mark);
            const popupText = generatePopupText(mark);
            marker.bindPopup(popupText);
            marker.bindTooltip(tipText).openTooltip();
            marker.addTo(mymap);
          }
        } else if (activeData.id === 'fog') {
          if (mark.visibility != null) {
            let text = parseFloat(mark.visibility)
            const icon = markerIcon(text, visibilityLimit);
            var marker = L.marker([parseFloat(mark.lat), parseFloat(mark.lon)], {icon: icon, riseOnHover: true});
            const tipText = generateTipText(mark);
            const popupText = generatePopupText(mark);
            marker.bindPopup(popupText);
            marker.bindTooltip(tipText).openTooltip();
            marker.addTo(mymap);
          }
        } else if (activeData.id === 'tide') {
          if (mark.meteorological_tide != null) {
            let text = parseFloat(mark.meteorological_tide)
            const icon = markerIcon(text, tideLimit);
            var marker = L.marker([parseFloat(mark.lat), parseFloat(mark.lon)], {icon: icon, riseOnHover: true});
            const tipText = generateTipText(mark);
            const popupText = generatePopupText(mark);
            marker.bindPopup(popupText);
            marker.bindTooltip(tipText).openTooltip();
            marker.addTo(mymap);
          }
        }
      });
    } else {
      data.forEach((mark) => {
        if (activeData.id === 'wave') {
          if (mark.swvht != null) {
            let text = parseFloat(mark.swvht)
            const icon = markerIcon(text, waveLimit);
            var marker = L.marker([parseFloat(mark.lat), parseFloat(mark.lon)], {icon: icon, riseOnHover: true});
            const tipText = generateTipTextNo(mark);
            const popupText = generatePopupTextNo(mark);
            marker.bindPopup(popupText);
            marker.bindTooltip(tipText).openTooltip();
            marker.addTo(mymap);
          }
        } else if (activeData.id === 'wind') {
          if (mark.wspd != null) {
            let text = parseFloat(mark.wspd)
            const icon = markerIcon(text, windLimit);
            var marker = L.marker([parseFloat(mark.lat), parseFloat(mark.lon)], {icon: icon, riseOnHover: true});
            const tipText = generateTipTextNo(mark);
            const popupText = generatePopupTextNo(mark);
            marker.bindPopup(popupText);
            marker.bindTooltip(tipText).openTooltip();
            marker.addTo(mymap);
          }
        } else if (activeData.id === 'water-temp') {
          if (mark.sst != null) {
            let text = parseFloat(mark.sst)
            const icon = markerIcon(text, sstLimit);
            var marker = L.marker([parseFloat(mark.lat), parseFloat(mark.lon)], {icon: icon, riseOnHover: true});
            const tipText = generateTipTextNo(mark);
            const popupText = generatePopupTextNo(mark);
            marker.bindPopup(popupText);
            marker.bindTooltip(tipText).openTooltip();
            marker.addTo(mymap);
          }
        } else if (activeData.id === 'air-temp') {
          if (mark.atmp != null) {
            let text = parseFloat(mark.atmp)
            const icon = markerIcon(text, atmpLimit);
            var marker = L.marker([parseFloat(mark.lat), parseFloat(mark.lon)], {icon: icon, riseOnHover: true});
            const tipText = generateTipTextNo(mark);
            const popupText = generatePopupTextNo(mark);
            marker.bindPopup(popupText);
            marker.bindTooltip(tipText).openTooltip();
            marker.addTo(mymap);
          }
        }
      });
    }
    const loader = document.getElementById('loader');
    loader.classList.add('inactive-tab');

  });
};

export { initLeaflet, refreshLeaflet };
