import $ from 'jquery';

import 'leaflet/dist/leaflet'


const initRange = () => {

    const rangeSlider = document.getElementById("rs-range-line");
    const rangeBullet = document.getElementById("rs-bullet");

    const now = new Date();
    const utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000 - 3600000*24*4);
    utc.setHours(utc.getHours() - utc.getHours() % 6)
    utc.setMinutes(0)
    utc.setSeconds(0)

    function showSliderValue() {
      let updateUtc = new Date(utc.valueOf())
      updateUtc.setHours(updateUtc.getHours() + parseInt(rangeSlider.value))
      let dateStr = `${updateUtc.toLocaleDateString('pt-BR').slice(0,5)} ${updateUtc.getHours()}h`
      rangeBullet.innerHTML = dateStr;
      var bulletPosition = (rangeSlider.value /rangeSlider.max);
      rangeBullet.style.left = (bulletPosition*98) + "%";
      var value = (this.value-this.min)/(this.max-this.min)*100
      rangeSlider.style.background = 'linear-gradient(to right, #82CFD0 0%, #82CFD0 ' + value + '%, #fff ' + value + '%, white 100%)'
       L.DomEvent.disableClickPropagation(this);
       // e.preventDefault();
    }

    if (rangeSlider) {
      var bulletPosition = (rangeSlider.value /rangeSlider.max);
      let updateUtc = new Date(utc.valueOf() + 3600000*24*4)
      let dateStr = `${updateUtc.toLocaleDateString('pt-BR').slice(0,5)} ${updateUtc.getHours()}h`
      rangeBullet.innerHTML = dateStr;
      rangeBullet.style.left = (bulletPosition*98) + "%";
      var value = (rangeSlider.value-rangeSlider.min)/(rangeSlider.max-rangeSlider.min)*100
      rangeSlider.style.background = 'linear-gradient(to right, #82CFD0 0%, #82CFD0 ' + value + '%, #fff ' + value + '%, white 100%)'
      rangeSlider.addEventListener("input", showSliderValue, false);
    }
};
export { initRange };


