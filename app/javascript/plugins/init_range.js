import $ from 'jquery';

import { refreshLeaflet } from '../plugins/init_leaflet';


const initRange = () => {

    const zeroPad = (num, places) => String(num).padStart(places, '0')

    const rangeSlider = document.getElementById("rs-range-line");
    const rangeBullet = document.getElementById("rs-bullet");

    const now = new Date();
    const utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000 - 3600000*24*4);
    utc.setHours(utc.getHours() - utc.getHours() % 6)
    utc.setMinutes(0)
    utc.setSeconds(0)

    const dataElement = document.getElementById('data');

    function showSliderValue() {
      const zeroPad = (num, places) => String(num).padStart(places, '0')
      const dataElement = document.getElementById('data');
      const language = dataElement.dataset.language;

      let updateUtc = new Date(utc.valueOf())
      let updateUtc2 = new Date(utc.valueOf())
      updateUtc.setHours(updateUtc.getHours() + parseInt(rangeSlider.value))
      updateUtc2.setHours(updateUtc2.getHours() + parseInt(rangeSlider.value) + 6)
      let dateStr
      if (language === 'pt-br'){
        dateStr = `${updateUtc.toLocaleDateString('pt-BR').slice(0,5)} ${updateUtc.getHours().toString().padStart(2, '0')}-${updateUtc2.getHours().toString().padStart(2, '0')}h`
      } else if (language === 'en'){
        dateStr = `${updateUtc.toLocaleDateString('en', {month: '2-digit', day: '2-digit'})} ${updateUtc.getHours().toString().padStart(2, '0')}-${updateUtc2.getHours().toString().padStart(2, '0')}h`
      }
      rangeBullet.innerHTML = dateStr;
      var bulletPosition = (rangeSlider.value /rangeSlider.max);
      rangeBullet.style.left = (bulletPosition*98) + "%";
      var value = (this.value-this.min)/(this.max-this.min)*100
      rangeSlider.style.background = 'linear-gradient(to right, #82CFD0 0%, #82CFD0 ' + value + '%, #fff ' + value + '%, white 100%)'
      L.DomEvent.disableClickPropagation(this);
      refreshLeaflet();
    }

    if (rangeSlider) {
      const language = dataElement.dataset.language;

      var bulletPosition = (rangeSlider.value /rangeSlider.max);
      let updateUtc = new Date(utc.valueOf() + 3600000*24*4)
      let updateUtc2 = new Date(utc.valueOf() + 3600000*24*4)
      updateUtc.setHours(updateUtc.getHours() + parseInt(rangeSlider.value))
      updateUtc2.setHours(updateUtc2.getHours() + parseInt(rangeSlider.value) + 6)
      let dateStr
      if (language === 'pt-br'){
        dateStr = `${updateUtc.toLocaleDateString('pt-BR').slice(0,5)} ${updateUtc.getHours().toString().padStart(2, '0')}-${updateUtc2.getHours().toString().padStart(2, '0')}h`
      } else if (language === 'en'){
        dateStr = `${updateUtc.toLocaleDateString('en', {month: '2-digit', day: '2-digit'})} ${updateUtc.getHours().toString().padStart(2, '0')}-${updateUtc2.getHours().toString().padStart(2, '0')}h`
      }
      rangeBullet.innerHTML = dateStr;
      rangeBullet.style.left = (bulletPosition*98) + "%";
      var value = (rangeSlider.value-rangeSlider.min)/(rangeSlider.max-rangeSlider.min)*100
      rangeSlider.style.background = 'linear-gradient(to right, #82CFD0 0%, #82CFD0 ' + value + '%, #fff ' + value + '%, white 100%)'
      rangeSlider.addEventListener("input", showSliderValue, false);
    }
};

export { initRange };


