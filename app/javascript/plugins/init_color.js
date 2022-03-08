import chroma from 'chroma-js';

const initColor = () => {

  const waveLimit = 2.4;
  const windLimit = 15;
  const sstLimit = 21;
  const atmpLimit = 25;
  const visibilityLimit = 7;
  const tideLimit = 0.3;

  const waveMax = 8;
  const windMax = 60;
  const sstMax = 30;
  const atmpMax = 50;
  const visibilityMax = 10;
  const tideMax = 2;


  const colorElement = document.getElementById('color-scale');
  if (colorElement) {
    const colorName = document.querySelector('.scale-name');
    const colorScale = document.querySelector('.scale-type');
    const scaleStart = document.querySelector('.scale-start');
    const scaleMiddle = document.querySelector('.scale-middle');
    const scaleEnd = document.querySelector('.scale-end');

    colorName.innerHTML = '';
    colorScale.innerHTML = '';
    scaleStart.innerHTML = '';
    scaleMiddle.innerHTML = '';
    scaleEnd.innerHTML = '';

    let limitValue
    let maxValue
    let variable
    const activeData = document.querySelector('.active-data')
    if (activeData.id === 'wave') {
      limitValue = waveLimit;
      maxValue = waveMax;
      variable = 'ALT. ONDAS (m)'
    } else if (activeData.id === 'wind'){
      limitValue = windLimit;
      maxValue = windMax;
      variable = 'VELOC. VENTO (nós)'
    } else if (activeData.id === 'water-temp'){
      limitValue = sstLimit;
      maxValue = sstMax;
      variable = 'TEMP. ÁGUA (°C)'
    } else if (activeData.id === 'air-temp'){
      limitValue =  atmpLimit;
      maxValue =  atmpMax;
      variable = 'TEMP. AR (°C)'
    } else if (activeData.id === 'fog'){
      limitValue = visibilityLimit;
      maxValue = visibilityMax;
      variable = 'VISIBILIDADE (km)'
    } else if (activeData.id === 'tide'){
      limitValue = tideLimit;
      maxValue = tideMax;
      variable = 'MARÉ METEOROLÓGICA (m)'
    }

    const scale = chroma.scale(['00eaff', '0033ff', 'ff7b57', '590007']).domain([0, limitValue-maxValue/10, limitValue, maxValue]);

    scale.colors(100).forEach((color, index) => {
      let title = Math.round(parseFloat(maxValue*index/100)*100)/100;
      let html = `<div class='color-span p-0 m-0' title='${title}' style='background-color: ${color};'></div>`
      colorScale.insertAdjacentHTML('beforeend', html)
      scaleStart.innerHTML = 0;
      scaleMiddle.innerHTML = limitValue;
      scaleEnd.innerHTML = maxValue;
    });
    colorName.innerHTML = variable;
    scaleMiddle.style.left = `${Math.round(100*limitValue/maxValue)-3}%`;
  }
};

const getColor = (limitValue, maxValue) => {
  const scale = chroma.scale(['00eaff', '0033ff', 'ff7b57', '590007']).domain([0, limitValue-maxValue/10, limitValue, maxValue]);
  return scale.colors(100)
};

export { initColor, getColor };