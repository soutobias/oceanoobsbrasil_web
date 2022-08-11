// import L from 'leaflet.';
import 'leaflet/dist/leaflet';
import 'leaflet.markercluster';
import { getData } from '../plugins/get_data';
import { initColor, getColor } from '../plugins/init_color';
import { getImage } from '../plugins/get_image';

const imageExists = (img) => {

  var http = new XMLHttpRequest();

  http.open('HEAD', `https${img.slice(4,)}`, false);
  http.send();

  return http.status != 404;
}

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
};

const metareaStyle = {
    "color": "#5a5c5a",
    "weight": 4,
    "opacity": 0.4,
    "fillOpacity": 0
};


const initLeaflet = () => {

  const mapElement = document.getElementById('mapid');

  if (mapElement) {
    initColor();

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
    const first = document.getElementById('first-full-screen')
    first.classList.remove('inactive-tab');
  }
};


const refreshLeaflet = () => {

  const mapElement = document.getElementById('mapid');

  if (mapElement) {
    initColor();

    const mapDiv = document.getElementById('map');

    mapDiv.innerHTML = "<div id='mapid'></div>";

    const dataElement = document.getElementById('data');
    const token = dataElement.dataset.mapboxApiKey;
    const mymap = L.map('mapid', { zoomControl: false }).setView([-19.039108, -38.954733], 4);
    const synoLayers = document.querySelector('.btn-syno')
    const language = dataElement.dataset.language;

    if (synoLayers.classList.contains('active')){
      L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/satellite-v9',
        accessToken: token
      }).addTo(mymap);

      const rangeSlider = document.getElementById('rs-range-line')
      const now = new Date();
      const utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000 - 3600000*24*4);
      utc.setHours(utc.getHours() - utc.getHours() % 6)
      utc.setMinutes(0)
      utc.setSeconds(0)
      let updateUtc = new Date(utc.valueOf())
      updateUtc.setHours(updateUtc.getHours() + parseInt(rangeSlider.value))
      if (updateUtc.getHours() === 18){
        updateUtc.setHours(12)
      } else if (updateUtc.getHours() === 6){
        updateUtc.setHours(0)
      }

      let startDate = `${(updateUtc.getYear()-100).toString().padStart(2, '0')}${(updateUtc.getMonth()+1).toString().padStart(2, '0')}${updateUtc.getDate().toString().padStart(2, '0')}${updateUtc.getHours().toString().padStart(2,'0')}`

      const img = getImage(startDate);
      const imageBounds = [[20, -90], [-70, 0]];
      if (imageExists(img)){
        L.imageOverlay(img, imageBounds).addTo(mymap);
      } else {
        if (language === 'pt-br'){
          alert("Não há carta sinótica disponível!");
        } else if (language === 'en'){
          alert("No synoptic chart available!");
        }  
      }
      // L.tileLayer.wms('https://idem.dhn.mar.mil.br/geoserver/ows?', {
      //   layers: `carta_sinotica:C22061612`,
      //   format: 'image/png',
      //   transparent: true,
      //   version: '1.1.0'
      // }).addTo(mymap);
      
    } else {
      L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 18,
          id: 'mapbox/satellite-v9',
          accessToken: token
      }).addTo(mymap);
    }

    L.geoJSON(metarea, {
      style: metareaStyle
    }).addTo(mymap);

    const loader = document.getElementById('loader');
    loader.classList.remove('inactive-tab');

    mapData(mymap);
  }
};

const convertDir = (dir) => {
  let newDir
  if (dir < 180) {
    newDir = dir + 180;
  } else{
    newDir = dir - 180;
  }
  return newDir
};



const markerIcon = (text, limit, typeValue, value, maxValue) => {

  const colors = getColor(limit, maxValue, typeValue);
  let htmlText
  if (typeValue === 'normal'){

    let index = Math.round(text.toFixed(1)/maxValue*100)
    if (index < 0){
      index = index * (-1)
    }
    if (index === 100){
      index = index - 1;
    }

    htmlText = `<div class='all-icon'>
        <div class='circle-color'>
          <i class="fas fa-circle" style='z-index: 0; color: ${colors[index]};  font-size: 28px;'></i>
        </div>
        <p class='p-0 m-0 circle-text' style='z-index:10'>${text.toFixed(1).toString()}</p>
      </div>`;

    const icon = L.divIcon({
      html: htmlText,
      className: '',
    });

    return icon;
  } else if (typeValue === 'normal-pres'){
    let pressMin = 940;

    let index = Math.round((text.toFixed(1)-pressMin)/(maxValue-pressMin)*100)
    if (index < 0){
      index = index * (-1)
    }
    if (index === 100){
      index = index - 1;
    }

    htmlText = `<div class='all-icon'>
        <div class='circle-color'>
          <i class="fas fa-circle" style='z-index: 0; color: ${colors[index]};  font-size: 28px;'></i>
        </div>
        <p class='p-0 m-0 circle-text' style='z-index:10'>${text.toFixed(0).toString()}</p>
      </div>`;

    const icon = L.divIcon({
      html: htmlText,
      className: '',
    });

    return icon;
  
  } else{
    let index = Math.round(value/maxValue*100)
    htmlText = `<div class='all-icon' style='transform: rotate(${text}deg);color: ${colors[index]};  font-size: 20px;'>
      <i class="fas fa-arrow-up"></i>
      </div>`;
    const icon = L.divIcon({
      html: htmlText,
      className: '',
    });
    return icon;    
  }
};

const generateTipText = (mark) => {
  const dataElement = document.getElementById('data');
  const language = dataElement.dataset.language;

  let dataType
  let institution

  if (language === 'pt-br'){
    if (mark.region) {
      dataType = 'Aviso de Mau Tempo';
      institution = mark.institution.toUpperCase();
      mark.name = mark.warning_type
    } else if (mark.data_type === 'buoy'){
      dataType = 'Boia';
      institution = mark.institution.toUpperCase();
    } else if (mark.data_type === 'drifter') {
      dataType = 'Derivador';
      institution = mark.institution.toUpperCase();
    } else if (mark.data_type === 'float') {
      dataType = 'Flutuador';
      institution = mark.institution.toUpperCase();
    } else if (mark.data_type === 'meteorological_station') {
      dataType = 'Estação Meteorológica';
      institution = mark.institution.toUpperCase();
    } else if (mark.data_type === 'tide') {
      dataType = 'Estação Maregráfica';
      if (mark.institution === 'tide_table') {
        institution = 'TÁBUA DE MARÉS';
      } else{
        institution = mark.institution.toUpperCase();
      }
    } else if (mark.data_type === 'cleaning') {
      dataType = 'Balneabilidade';
      institution = mark.institution.toUpperCase();
    } else if (mark.data_type === 'visual') {
      dataType = 'Observação Visual';
      institution = mark.institution.toUpperCase();
    }
  } else if (language === 'en'){
    if (mark.region) {
      dataType = 'Weather Warning';
      institution = mark.institution.toUpperCase();
      mark.name = mark.warning_type
    } else if (mark.data_type === 'buoy'){
      dataType = 'Buoy';
      institution = mark.institution.toUpperCase();
    } else if (mark.data_type === 'drifter') {
      dataType = 'Drifter';
      institution = mark.institution.toUpperCase();
    } else if (mark.data_type === 'float') {
      dataType = 'Float';
      institution = mark.institution.toUpperCase();
    } else if (mark.data_type === 'meteorological_station') {
      dataType = 'Weather Station';
      institution = mark.institution.toUpperCase();
    } else if (mark.data_type === 'tide') {
      dataType = 'Tide Gauge';
      if (mark.institution === 'tide_table') {
        institution = 'TIDE TABLE';
      } else{
        institution = mark.institution.toUpperCase();
      }
    } else if (mark.data_type === 'cleaning') {
      dataType = 'Cleaning';
      institution = mark.institution.toUpperCase();
    } else if (mark.data_type === 'visual') {
      dataType = 'Visual Observations';
      institution = mark.institution.toUpperCase();
    }
  }

  return `${dataType} - ${institution}: ${mark.name.toUpperCase()}`
};

const generatePopupText = (mark) => {
  const dataElement = document.getElementById('data');

  const admin = dataElement.dataset.admin;
  const language = dataElement.dataset.language;

  let waveHeightText
  let waveMaxText
  let visibilityText
  let waveDirText
  let wavePerText
  let sstText
  let windDirText
  let windSpeedText
  let windGustText
  let unitWindText
  let airTempText
  let dateTime
  let dateTimeText
  let tideTableText
  let tideText
  let cleaningText
  let wwText
  let wwText1
  let wwText2
  let wwText3
  let wwText4
  let wwText5

  if (language === 'pt-br'){
    tideTableText = 'Tábua de Marés'
    wwText = 'Aviso de Mau Tempo'
    wwText1 = 'Aviso'
    wwText2 = 'Tipo'
    wwText3 = 'Início'
    wwText4 = 'Término'
    wwText5 = 'Descrição'
  } else if (language === 'en'){
    tideTableText = 'Tide Table'
    wwText = 'Weather Warning'
    wwText1 = 'Warning'
    wwText2 = 'Type'
    wwText3 = 'Start'
    wwText4 = 'End'
    wwText5 = 'Description'
  }

  if (mark.region) {
    let header = `<div class='pop-up'>
      <p class='m-0 p-0'><strong>${wwText}: ${mark.region}</strong></p>
      <p class='m-0 p-0'><strong>${wwText1}: ${mark.warning_number}</strong></p>
      <p class='m-0 p-0'>${wwText2}: ${mark.warning_type}</p>
      <p class='m-0 p-0'>${wwText3}: ${mark.start_date}</p>
      <p class='m-0 p-0'>${wwText4}: ${mark.end_date}</p>
      <p class='m-0 p-0'>${wwText5}: ${mark.description}</p>
    </div>`
    return `${header}`
  } else if (mark.institution === 'tide_table'){
    let header = `<div class='pop-up'>
      <p class='m-0 p-0'><strong>LAT:</strong> ${Math.round(parseFloat(mark.lat)*1000)/1000}, <strong>LON:</strong> ${Math.round(parseFloat(mark.lon)*1000)/1000}</p>
      <p class='m-0 p-0'><strong>${tideTableText}:</strong>
        <a class="btn m-0 p-0 collor-yellow" href="https://www.marinha.mil.br/chm/sites/www.marinha.mil.br.chm/files/dados_de_mare/${mark.url}" target="_blank">
          <i class="fas fa-chart-pie"></i>
        </a>
      </p>
    </div>`
    return `${header}`
  } else {
    if (language === 'pt-br'){
      tideTableText = 'Tábua de Marés'
      waveHeightText = 'Alt. Onda'
      waveMaxText = 'Max. Onda'
      visibilityText = 'Visibilidade'
      waveDirText = 'Dir. Onda'
      wavePerText = 'Per. Onda'
      sstText = 'Temp. Água'
      windDirText = 'Dir. Vento'
      windSpeedText = 'Vel. Vento'
      windGustText = 'Rajada'
      unitWindText = 'nós'
      airTempText = 'Temp. Ar'
      dateTime = `${mark.date_time.slice(8,10)}/${mark.date_time.slice(5,7)} ${mark.date_time.slice(11,16)}`
      dateTimeText = 'DATAHORA'
      tideText = 'Maré Meteorológica'
      cleaningText = 'Balneabilidade'
    } else if (language === 'en'){
      tideTableText = 'Tide Table'
      waveHeightText = 'Wave Height'
      waveMaxText = 'Max. Wave'
      visibilityText = 'Visibility'
      waveDirText = 'Wave Dir.'
      wavePerText = 'Wave Period'
      sstText = 'SST'
      windDirText = 'Wind Dir.'
      windSpeedText = 'Wind Speed'
      windGustText = 'Gust'
      unitWindText = 'knots'
      airTempText = 'Air Temp.'
      dateTime = `${mark.date_time.slice(5,7)}/${mark.date_time.slice(8,10)} ${mark.date_time.slice(11,16)}`
      dateTimeText = 'DATETIME'
      tideText = 'Meteorological Tide'
      cleaningText = 'Cleaning'
    }
    let header = `<div class='pop-up'>
            <p class='m-0 p-0'><strong>LAT:</strong> ${Math.round(parseFloat(mark.lat)*1000)/1000}, <strong>LON:</strong> ${Math.round(parseFloat(mark.lon)*1000)/1000}</p>
            <p class='m-0 p-0'><strong>${dateTimeText}:</strong> ${dateTime}</p>`
    let text
    if (mark.data_type === 'buoy'){
      text = `<p class='m-0 p-0'><strong>${waveHeightText}:</strong> ${parseFloat(mark.swvht)} m</p>
              <p class='m-0 p-0'><strong>${waveMaxText}:</strong> ${parseFloat(mark.mxwvht)} m</p>
              <p class='m-0 p-0'><strong>${waveDirText}:</strong> ${parseFloat(mark.wvdir)} °</p>
              <p class='m-0 p-0'><strong>${wavePerText}:</strong> ${parseFloat(mark.tp)} s</p>
              <p class='m-0 p-0'><strong>${sstText}:</strong> ${parseFloat(mark.sst)} °C</p>
              <p class='m-0 p-0'><strong>${windSpeedText}:</strong> ${Math.round(parseFloat(mark.wspd)*100)/100} ${unitWindText}</p>
              <p class='m-0 p-0'><strong>${windDirText}:</strong> ${parseFloat(mark.wdir)} °</p>
              <p class='m-0 p-0'><strong>${windGustText}:</strong> ${Math.round(parseFloat(mark.gust)*100)/100} ${unitWindText}</p>
              <p class='m-0 p-0'><strong>${airTempText}:</strong> ${parseFloat(mark.atmp)} °C</p>
              <p class='m-0 p-0'><strong>Pres:</strong> ${parseFloat(mark.pres)} mb</p>`
      } else if (mark.data_type === 'meteorological_station') {
      text = `<p class='m-0 p-0'><strong>${windSpeedText}:</strong> ${Math.round(parseFloat(mark.wspd)*100)/100} nós</p>
              <p class='m-0 p-0'><strong>${windDirText}:</strong> ${parseFloat(mark.wdir)} °</p>
              <p class='m-0 p-0'><strong>${windGustText}:</strong> ${Math.round(parseFloat(mark.gust)*100)/100} nós</p>
              <p class='m-0 p-0'><strong>${airTempText}:</strong> ${parseFloat(mark.atmp)} °C</p>
              <p class='m-0 p-0'><strong>Pres:</strong> ${parseFloat(mark.pres)} mb</p>
              <p class='m-0 p-0'><strong>${visibilityText}:</strong> ${Math.round(parseFloat(mark.visibility)*1.6*100)/100} km</p>`
    } else if (mark.data_type === 'tide') {
      text = `<p class='m-0 p-0'><strong>${tideText}:</strong> ${parseFloat(mark.meteorological_tide)} m</p>
              <p class='m-0 p-0'><strong>${sstText}:</strong> ${parseFloat(mark.sst)} °C</p>
              <p class='m-0 p-0'><strong>${windSpeedText}:</strong> ${Math.round(parseFloat(mark.wspd)*100)/100} ${unitWindText}</p>
              <p class='m-0 p-0'><strong>${windDirText}:</strong> ${parseFloat(mark.wdir)} °</p>
              <p class='m-0 p-0'><strong>${windGustText}:</strong> ${Math.round(parseFloat(mark.gust)*100)/100} ${unitWindText}</p>
              <p class='m-0 p-0'><strong>${airTempText}:</strong> ${parseFloat(mark.atmp)} °C</p>
              <p class='m-0 p-0'><strong>Pres:</strong> ${parseFloat(mark.pres)} mb</p>`
    } else if (mark.data_type === 'cleaning') {
      text = `<p class='m-0 p-0'><strong>${cleaningText}:</strong> ${mark.cleaning}</p>`
    } else if (mark.data_type === 'visual') {
      text = `<p class='m-0 p-0'><strong>${waveHeightText}:</strong> ${parseFloat(mark.swvht)} m</p>
              <p class='m-0 p-0'><strong>${waveDirText}:</strong> ${parseFloat(mark.wvdir)} °</p>
              <p class='m-0 p-0'><strong>${wavePerText}:</strong> ${parseFloat(mark.tp)} s</p>
              <p class='m-0 p-0'><strong>${sstText}:</strong> ${parseFloat(mark.sst)} °C</p>`
    }
    text = text.replaceAll("NaN", "--");
    let textStation
    if (admin==="1"){
      textStation = `<form action="/stations/${mark.station_id}" accept-charset="UTF-8" method="get">
        <input type="text" name="language" id="language" value=${language} class="inactive-tab">
        <button type="submit" class="btn m-0 p-0 collor-yellow" formtarget="_blank">
          <i class="fas fa-chart-pie"></i>
        </button>
      </form>`
    } else {
      textStation = `<form action="/graphs/${mark.station_id}" accept-charset="UTF-8" method="get">
        <input type="text" name="language" id="language" value=${language} class="inactive-tab">
        <button type="submit" class="btn m-0 p-0 collor-yellow" formtarget="_blank">
          <i class="fas fa-chart-pie"></i>
        </button>
      </form>`
    }
    return `${header}${text}${textStation}`
  }
};

const generateTipTextNo = (mark) => {
  const dataElement = document.getElementById('data');
  const language = dataElement.dataset.language;
  let dataType

  if (language === 'pt-br'){
    if (mark.data_type === 'gts'){
      dataType = 'GTS';
    } else if (mark.data_type === 'scatterometer') {
      dataType = 'ESCATERÔMETRO';
    } else if (mark.data_type === 'altimeter') {
      dataType = 'ALTIMETRIA';
    } else if (mark.data_type === 'drifter') {
      dataType = 'DERIVADOR';
    } else if (mark.data_type === 'float') {
      dataType = 'FLUTUADOR';
    }
  } else if (language === 'en'){
    if (mark.data_type === 'gts'){
      dataType = 'GTS';
    } else if (mark.data_type === 'scatterometer') {
      dataType = 'SCATTEROMETER';
    } else if (mark.data_type === 'altimeter') {
      dataType = 'ALTIMETER';
    } else if (mark.data_type === 'drifter') {
      dataType = 'DRIFTER';
    } else if (mark.data_type === 'float') {
      dataType = 'FLOAT';
    }
  }
  return `${dataType} - ${mark.institution.toUpperCase()}`
};

const generatePopupTextNo = (mark) => {
  const dataElement = document.getElementById('data');
  const language = dataElement.dataset.language;

  let text
  let waveHeightText
  let waveDirText
  let wavePerText
  let sstText
  let windDirText
  let windSpeedText
  let windGustText
  let unitWindText
  let airTempText
  let dateTime
  let header
  if (language === 'pt-br'){
    waveHeightText = 'Alt. Onda'
    waveDirText = 'Dir. Onda'
    wavePerText = 'Per. Onda'
    sstText = 'Temp. Água'
    windDirText = 'Dir. Vento'
    windSpeedText = 'Vel. Vento'
    windGustText = 'Rajada'
    unitWindText = 'nós'
    airTempText = 'Temp. Ar'
    dateTime = `${mark.date_time.slice(8,10)}/${mark.date_time.slice(5,7)} ${mark.date_time.slice(11,16)}`
    header = `<div class='pop-up'>
            <p class='m-0 p-0'><strong>LAT:</strong> ${Math.round(parseFloat(mark.lat)*1000)/1000}, <strong>LON:</strong> ${Math.round(parseFloat(mark.lon)*1000)/1000}</p>
            <p class='m-0 p-0'><strong>DATAHORA:</strong> ${dateTime}</p>`
  } else if (language === 'en'){
    waveHeightText = 'Wave Height'
    waveDirText = 'Wave Dir.'
    wavePerText = 'Wave Period'
    sstText = 'SST'
    windDirText = 'Wind Dir.'
    windSpeedText = 'Wind Speed'
    windGustText = 'Gust'
    unitWindText = 'knots'
    airTempText = 'Air Temp.'
    dateTime = `${mark.date_time.slice(5,7)}/${mark.date_time.slice(8,10)} ${mark.date_time.slice(11,16)}`
    header = `<div class='pop-up'>
            <p class='m-0 p-0'><strong>LAT:</strong> ${Math.round(parseFloat(mark.lat)*1000)/1000}, <strong>LON:</strong> ${Math.round(parseFloat(mark.lon)*1000)/1000}</p>
            <p class='m-0 p-0'><strong>DATETIME:</strong> ${dateTime}</p>`
  }

  if (mark.data_type === 'gts'){
    text = `<p class='m-0 p-0'><strong>${waveHeightText}:</strong> ${parseFloat(mark.swvht)} m</p>
            <p class='m-0 p-0'><strong>${waveHeightText} Swell:</strong> ${parseFloat(mark.swvht_swell)} m</p>
            <p class='m-0 p-0'><strong>${waveDirText}:</strong> ${parseFloat(mark.wvdir)} °</p>
            <p class='m-0 p-0'><strong>${waveDirText} Swell:</strong> ${parseFloat(mark.wvdir_swell)} °</p>
            <p class='m-0 p-0'><strong>${wavePerText}:</strong> ${parseFloat(mark.tp)} s</p>
            <p class='m-0 p-0'><strong>${sstText}:</strong> ${parseFloat(mark.sst)} °C</p>
            <p class='m-0 p-0'><strong>${windSpeedText}:</strong> ${parseFloat(mark.wspd)} ${unitWindText}</p>
            <p class='m-0 p-0'><strong>${windDirText}:</strong> ${parseFloat(mark.wdir)} °</p>
            <p class='m-0 p-0'><strong>${windGustText}:</strong> ${parseFloat(mark.gust)} ${unitWindText}</p>
            <p class='m-0 p-0'><strong>${airTempText}:</strong> ${parseFloat(mark.atmp)} °C</p>
            <p class='m-0 p-0'><strong>Pres:</strong> ${parseFloat(mark.pres)} mb</p></div>`
  } else if (mark.data_type === 'scatterometer') {
    text = `<p class='m-0 p-0'><strong>${windSpeedText}:</strong> ${parseFloat(mark.wspd)} ${unitWindText}</p>
            <p class='m-0 p-0'><strong>${windDirText}:</strong> ${parseFloat(mark.wdir)} °</p></div>`
  } else if (mark.data_type === 'altimeter') {
    text = `<p class='m-0 p-0'><strong>${waveHeightText}:</strong> ${parseFloat(mark.swvht)} m</p>
            <p class='m-0 p-0'><strong>${windSpeedText}:</strong> ${parseFloat(mark.wspd)} ${unitWindText}</p></div>`
  } else if (mark.data_type === 'drifter'){
    text = `<p class='m-0 p-0'><strong>${waveHeightText}:</strong> ${parseFloat(mark.swvht)} m</p>
            <p class='m-0 p-0'><strong>${waveDirText}:</strong> ${parseFloat(mark.wvdir)} °</p>
            <p class='m-0 p-0'><strong>${wavePerText}:</strong> ${parseFloat(mark.tp)} s</p>
            <p class='m-0 p-0'><strong>${sstText}:</strong> ${parseFloat(mark.sst)} °C</p>
            <p class='m-0 p-0'><strong>${windSpeedText}:</strong> ${parseFloat(mark.wspd)} ${unitWindText}</p>
            <p class='m-0 p-0'><strong>Pres:</strong> ${parseFloat(mark.pres)} mb</p></div>
            <p class='m-0 p-0'><strong>${windDirText}:</strong> ${parseFloat(mark.wdir)} °</p></div>`
  } else if (mark.data_type === 'float'){
    text = `<p class='m-0 p-0'><strong>${waveHeightText}:</strong> ${parseFloat(mark.swvht)} m</p>
            <p class='m-0 p-0'><strong>${waveDirText}:</strong> ${parseFloat(mark.wvdir)} °</p>
            <p class='m-0 p-0'><strong>${wavePerText}:</strong> ${parseFloat(mark.tp)} s</p>
            <p class='m-0 p-0'><strong>${sstText}:</strong> ${parseFloat(mark.sst)} °C</p>
            <p class='m-0 p-0'><strong>${windSpeedText}:</strong> ${parseFloat(mark.wspd)} ${unitWindText}</p>
            <p class='m-0 p-0'><strong>Pres:</strong> ${parseFloat(mark.pres)} mb</p></div>
            <p class='m-0 p-0'><strong>${windDirText}:</strong> ${parseFloat(mark.wdir)} °</p></div>`
  }
  text = text.replaceAll("NaN", "--");
  return `${header}${text}`
}

const mapData = (mymap) => {
  getData().then(response => response.json())
  .then((data) => {
    const activeStation = document.querySelector('.active-station')
    const activeData = document.querySelector('.active-data')
    const activeLayer = document.querySelector('.active-layer')

    const waveLimit = 2.4;
    const windLimit = 15;
    const sstLimit = 21;
    const atmpLimit = 25;
    const visibilityLimit = 7;
    const tideLimit = 0.3;
    const pressLimit = 1015;

    const waveMax = 8;
    const windMax = 60;
    const sstMax = 30;
    const atmpMax = 50;
    const visibilityMax = 10;
    const tideMax = 2;
    const pressMax = 1040;

    const waveRadio = document.getElementById('wave-radio')
    const windRadio = document.getElementById('wind-radio')

    if (activeData.id === 'weather-warning') {

      const markerSul = L.markerClusterGroup({
        iconCreateFunction: function(cluster) {
        return L.divIcon({ html: `<div class='all-icon'>
            <div class='circle-color'>
              <i class="fas fa-circle" style='z-index: 0; color: #0097ff;  font-size: 28px;'></i>
            </div>
            <p class='p-0 m-0 circle-text' style='z-index:10'>${cluster.getChildCount()}</p>
          </div>` });
        }
      });
      const markerNorte = L.markerClusterGroup({
        iconCreateFunction: function(cluster) {
        return L.divIcon({ html: `<div class='all-icon'>
            <div class='circle-color'>
              <i class="fas fa-circle" style='z-index: 0; color: #0097ff;  font-size: 28px;'></i>
            </div>
            <p class='p-0 m-0 circle-text' style='z-index:10'>${cluster.getChildCount()}</p>
          </div>` });
        }
      });
      const markerAlpha = L.markerClusterGroup({
        iconCreateFunction: function(cluster) {
        return L.divIcon({ html: `<div class='all-icon'>
            <div class='circle-color'>
              <i class="fas fa-circle" style='z-index: 0; color: #0097ff;  font-size: 28px;'></i>
            </div>
            <p class='p-0 m-0 circle-text' style='z-index:10'>${cluster.getChildCount()}</p>
          </div>` });
        }
      });
      const markerBravo = L.markerClusterGroup({
        iconCreateFunction: function(cluster) {
        return L.divIcon({ html: `<div class='all-icon'>
            <div class='circle-color'>
              <i class="fas fa-circle" style='z-index: 0; color: #0097ff;  font-size: 28px;'></i>
            </div>
            <p class='p-0 m-0 circle-text' style='z-index:10'>${cluster.getChildCount()}</p>
          </div>` });
        }
      });
      const markerCharlie = L.markerClusterGroup({
        iconCreateFunction: function(cluster) {
        return L.divIcon({ html: `<div class='all-icon'>
            <div class='circle-color'>
              <i class="fas fa-circle" style='z-index: 0; color: #0097ff;  font-size: 28px;'></i>
            </div>
            <p class='p-0 m-0 circle-text' style='z-index:10'>${cluster.getChildCount()}</p>
          </div>` });
        }
      });
      const markerDelta = L.markerClusterGroup({
        iconCreateFunction: function(cluster) {
        return L.divIcon({ html: `<div class='all-icon'>
            <div class='circle-color'>
              <i class="fas fa-circle" style='z-index: 0; color: #0097ff;  font-size: 28px;'></i>
            </div>
            <p class='p-0 m-0 circle-text' style='z-index:10'>${cluster.getChildCount()}</p>
          </div>` });
        }
      });
      const markerEcho = L.markerClusterGroup({
        iconCreateFunction: function(cluster) {
        return L.divIcon({ html: `<div class='all-icon'>
            <div class='circle-color'>
              <i class="fas fa-circle" style='z-index: 0; color: #0097ff;  font-size: 28px;'></i>
            </div>
            <p class='p-0 m-0 circle-text' style='z-index:10'>${cluster.getChildCount()}</p>
          </div>` });
        }
      });
      const markerFoxtrot = L.markerClusterGroup({
        iconCreateFunction: function(cluster) {
        return L.divIcon({ html: `<div class='all-icon'>
            <div class='circle-color'>
              <i class="fas fa-circle" style='z-index: 0; color: #0097ff;  font-size: 28px;'></i>
            </div>
            <p class='p-0 m-0 circle-text' style='z-index:10'>${cluster.getChildCount()}</p>
          </div>` });
        }
      });
      const markerGolf = L.markerClusterGroup({
        iconCreateFunction: function(cluster) {
        return L.divIcon({ html: `<div class='all-icon'>
            <div class='circle-color'>
              <i class="fas fa-circle" style='z-index: 0; color: #0097ff;  font-size: 28px;'></i>
            </div>
            <p class='p-0 m-0 circle-text' style='z-index:10'>${cluster.getChildCount()}</p>
          </div>` });
        }
      });
      const markerHotel = L.markerClusterGroup({
        iconCreateFunction: function(cluster) {
        return L.divIcon({ html: `<div class='all-icon'>
            <div class='circle-color'>
              <i class="fas fa-circle" style='z-index: 0; color: #0097ff;  font-size: 28px;'></i>
            </div>
            <p class='p-0 m-0 circle-text' style='z-index:10'>${cluster.getChildCount()}</p>
          </div>` });
        }
      });

      data.forEach((mark) => {
        
        let fontAwesome

        if (mark.warning_type.toUpperCase().includes('VENTO')){
          fontAwesome = 'fas fa-wind'
        } else if (mark.warning_type.toUpperCase().includes('MAR')){
          fontAwesome = 'fas fa-water'
        } else if (mark.warning_type.toUpperCase().includes('RESSACA')){
          fontAwesome = 'fas fa-tint'
        }

        const htmlText = `<div class='all-icon'>
            <div class='circle-color'>
              <i class="fas fa-circle" style='z-index: 0; color: #0097ff;  font-size: 28px;'></i>
            </div>
            <p class='p-0 m-0 circle-text' style='z-index:10'><i class="${fontAwesome}"></i></p>
          </div>`;
        const icon = L.divIcon({
          html: htmlText,
          className: '',
        });
        if (mark.region.toUpperCase().includes('ALFA')) {
          var marker = L.marker([-32.2344, -48.5512], {icon: icon, riseOnHover: true});
          markerAlpha.addLayer(marker)
          const tipText = generateTipText(mark);
          const popupText = generatePopupText(mark);
          marker.bindPopup(popupText);
          marker.bindTooltip(tipText).openTooltip();  
        } else if (mark.region.toUpperCase().includes('BRAVO')) {
          var marker = L.marker([-27.0642, -42.8664], {icon: icon, riseOnHover: true});
          markerBravo.addLayer(marker)
          const tipText = generateTipText(mark);
          const popupText = generatePopupText(mark);
          marker.bindPopup(popupText);
          marker.bindTooltip(tipText).openTooltip();  
        } else if (mark.region.toUpperCase().includes('CHARLIE')) {
          var marker = L.marker([-25.1182, -46.0735], {icon: icon, riseOnHover: true});
          markerCharlie.addLayer(marker)
          const tipText = generateTipText(mark);
          const popupText = generatePopupText(mark);
          marker.bindPopup(popupText);
          marker.bindTooltip(tipText).openTooltip();  
        } else if (mark.region.toUpperCase().includes('DELTA')) {
          var marker = L.marker([-21.7774, -37.9288], {icon: icon, riseOnHover: true});
          markerDelta.addLayer(marker)
          const tipText = generateTipText(mark);
          const popupText = generatePopupText(mark);
          marker.bindPopup(popupText);
          marker.bindTooltip(tipText).openTooltip();  
        } else if (mark.region.toUpperCase().includes('ECHO')) {
          var marker = L.marker([-16.6465, -36.1439], {icon: icon, riseOnHover: true});
          markerEcho.addLayer(marker)
          const tipText = generateTipText(mark);
          const popupText = generatePopupText(mark);
          marker.bindPopup(popupText);
          marker.bindTooltip(tipText).openTooltip();  
        } else if (mark.region.toUpperCase().includes('FOXTROT')) {
          var marker = L.marker([-9.3957, -32.8223], {icon: icon, riseOnHover: true});
          markerFoxtrot.addLayer(marker)
          const tipText = generateTipText(mark);
          const popupText = generatePopupText(mark);
          marker.bindPopup(popupText);
          marker.bindTooltip(tipText).openTooltip();  
        } else if (mark.region.toUpperCase().includes('GOLF')) {
          var marker = L.marker([-2.6287, -36.4547], {icon: icon, riseOnHover: true});
          markerGolf.addLayer(marker)
          const tipText = generateTipText(mark);
          const popupText = generatePopupText(mark);
          marker.bindPopup(popupText);
          marker.bindTooltip(tipText).openTooltip();  
        } else if (mark.region.toUpperCase().includes('HOTEL')) {
          var marker = L.marker([1.8586, -46.2611], {icon: icon, riseOnHover: true});
          markerHotel.addLayer(marker)
          const tipText = generateTipText(mark);
          const popupText = generatePopupText(mark);
          marker.bindPopup(popupText);
          marker.bindTooltip(tipText).openTooltip();  
        } else if (mark.region.toUpperCase().includes('SUL')) {
          var marker = L.marker([-28.7845, -30.2595], {icon: icon, riseOnHover: true});
          markerSul.addLayer(marker)
          const tipText = generateTipText(mark);
          const popupText = generatePopupText(mark);
          marker.bindPopup(popupText);
          marker.bindTooltip(tipText).openTooltip();  
        } else if (mark.region.toUpperCase().includes('NORTE')){
          var marker = L.marker([-3.1183, -25.5296], {icon: icon, riseOnHover: true});
          markerNorte.addLayer(marker)
          const tipText = generateTipText(mark);
          const popupText = generatePopupText(mark);
          marker.bindPopup(popupText);
          marker.bindTooltip(tipText).openTooltip();  
        }
        mymap.addLayer(markerAlpha);
        mymap.addLayer(markerBravo);
        mymap.addLayer(markerCharlie);
        mymap.addLayer(markerDelta);
        mymap.addLayer(markerEcho);
        mymap.addLayer(markerFoxtrot);
        mymap.addLayer(markerHotel);
        mymap.addLayer(markerSul);
        mymap.addLayer(markerNorte);
      });
    } else {
      if (activeStation.id === 'stations') {
        data.forEach((mark) => {
          let typeValue = 'normal'
          let value
          if (activeData.id === 'wave') {
            const layer = waveRadio.querySelector('.active');
            if (layer.id === 'heigth-wave'){
              value = parseFloat(mark.swvht);
              typeValue = 'normal'
            } else if (layer.id === 'direction-wave'){
              value = parseInt(mark.wvdir);
              value = convertDir(value)
              typeValue = 'no normal'
            }
            if (value) {
              const icon = markerIcon(value, waveLimit, typeValue, mark.swvht, waveMax);
              var marker = L.marker([parseFloat(mark.lat), parseFloat(mark.lon)], {icon: icon, riseOnHover: true});
              const tipText = generateTipText(mark);
              const popupText = generatePopupText(mark);
              marker.bindPopup(popupText);
              marker.bindTooltip(tipText).openTooltip();
              marker.addTo(mymap);
            }
          } else if (activeData.id === 'wind') {
            const layer = windRadio.querySelector('.active');
            if (layer.id === 'velocity-wind'){
              value = parseFloat(mark.wspd);
              typeValue = 'normal';
            } else if (layer.id === 'direction-wind'){
              value = parseInt(mark.wdir);
              value = convertDir(value);
              typeValue = 'no normal';
            }
            if (value) {
              const icon = markerIcon(value, windLimit, typeValue, mark.wspd, windMax);
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
              typeValue = 'normal'
              const icon = markerIcon(text, sstLimit, typeValue, mark.swvht, sstMax);
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
              typeValue = 'normal'
              const icon = markerIcon(text, atmpLimit, typeValue, mark.swvht, atmpMax);
              var marker = L.marker([parseFloat(mark.lat), parseFloat(mark.lon)], {icon: icon, riseOnHover: true});
              const tipText = generateTipText(mark);
              const popupText = generatePopupText(mark);
              marker.bindPopup(popupText);
              marker.bindTooltip(tipText).openTooltip();
              marker.addTo(mymap);
            }
          } else if (activeData.id === 'fog') {
            if (mark.visibility != null) {
              let text = parseFloat(mark.visibility) * 1.6
              typeValue = 'normal'
              const icon = markerIcon(text, visibilityLimit, typeValue, mark.swvht, visibilityMax);
              var marker = L.marker([parseFloat(mark.lat), parseFloat(mark.lon)], {icon: icon, riseOnHover: true});
              const tipText = generateTipText(mark);
              const popupText = generatePopupText(mark);
              marker.bindPopup(popupText);
              marker.bindTooltip(tipText).openTooltip();
              marker.addTo(mymap);
            }
          } else if (activeData.id === 'pressure') {
            if (mark.pres != null) {
              let text = parseFloat(mark.pres)
              typeValue = 'normal-pres'
              const icon = markerIcon(text, pressLimit, typeValue, mark.pres, pressMax);
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
              typeValue = 'normal'
              const icon = markerIcon(text, tideLimit, typeValue, mark.swvht, tideMax);
              var marker = L.marker([parseFloat(mark.lat), parseFloat(mark.lon)], {icon: icon, riseOnHover: true});
              const tipText = generateTipText(mark);
              const popupText = generatePopupText(mark);
              marker.bindPopup(popupText);
              marker.bindTooltip(tipText).openTooltip();
              marker.addTo(mymap);
            }
          } else if (activeData.id === 'moon') {
            if (mark.institution === 'tide_table'){
              const htmlText = `<div class='all-icon'>
                <div class='circle-color'>
                  <i class="fas fa-circle" style='z-index: 0; color: #0097ff;  font-size: 28px;'></i>
                </div>
                <p class='p-0 m-0 circle-text' style='z-index:10'><i class="fas fa-tint"></i></p>
              </div>`;
              const icon = L.divIcon({
                html: htmlText,
                className: '',
              });
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
          let typeValue = 'normal'
          let value
          if (activeData.id === 'wave') {
            const layer = waveRadio.querySelector('.active');
            if (layer.id === 'heigth-wave'){
              value = parseFloat(mark.swvht);
              typeValue = 'normal'
            } else if (layer.id === 'direction-wave'){
              value = parseInt(mark.wvdir);
              value = convertDir(value)
              typeValue = 'no normal'
            }
            if (value) {
              const icon = markerIcon(value, waveLimit, typeValue, mark.swvht, waveMax);
              var marker = L.marker([parseFloat(mark.lat), parseFloat(mark.lon)], {icon: icon, riseOnHover: true});
              const tipText = generateTipTextNo(mark);
              const popupText = generatePopupTextNo(mark);
              marker.bindPopup(popupText);
              marker.bindTooltip(tipText).openTooltip();
              marker.addTo(mymap);
            }
          } else if (activeData.id === 'wind') {
            const layer = windRadio.querySelector('.active');
            if (layer.id === 'velocity-wind'){
              value = parseFloat(mark.wspd);
              typeValue = 'normal'
            } else if (layer.id === 'direction-wind'){
              value = parseInt(mark.wdir);
              value = convertDir(value)
              typeValue = 'no normal'
            }
            if (value) {
              const icon = markerIcon(value, windLimit, typeValue, mark.wspd, windMax);
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
              typeValue = 'normal'
              const icon = markerIcon(text, sstLimit, typeValue, mark.swvht, sstMax);
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
              typeValue = 'normal'
              const icon = markerIcon(text, atmpLimit, typeValue, mark.swvht, atmpMax);
              var marker = L.marker([parseFloat(mark.lat), parseFloat(mark.lon)], {icon: icon, riseOnHover: true});
              const tipText = generateTipTextNo(mark);
              const popupText = generatePopupTextNo(mark);
              marker.bindPopup(popupText);
              marker.bindTooltip(tipText).openTooltip();
              marker.addTo(mymap);
            }
          } else if (activeData.id === 'pressure') {
            if (mark.pres != null) {
              let text = parseFloat(mark.pres)
              typeValue = 'normal-pres'
              const icon = markerIcon(text, pressLimit, typeValue, mark.swvht, pressMax);
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
    }
    const loader = document.getElementById('loader');
    loader.classList.add('inactive-tab');
    const dataElement = document.getElementById('data');
    const language = dataElement.dataset.language;
    if (data.length == 0){
      if (language === 'pt-br'){
        alert("Não há dados disponíveis!");
      } else if (language === 'en'){
        alert("No data available!");
      }
    }
  });
};

export { initLeaflet, refreshLeaflet };
