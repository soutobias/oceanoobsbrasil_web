
const getData = () => {
  const dataElement = document.getElementById('data');
  const zeroPad = (num, places) => String(num).padStart(places, '0')
  if (dataElement) {
    const rangeSlider = document.getElementById('rs-range-line')
    const now = new Date();
    const utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000 - 3600000*24*4);
    utc.setHours(utc.getHours() - utc.getHours() % 6)
    utc.setMinutes(0)
    utc.setSeconds(0)
    let updateUtc = new Date(utc.valueOf())
    updateUtc.setHours(updateUtc.getHours() + parseInt(rangeSlider.value))
    let startDate = `${updateUtc.toLocaleDateString('zh-Hans-CN')}T${updateUtc.toLocaleTimeString().slice(0,-3)}`.replaceAll('/','-')
    updateUtc.setHours(updateUtc.getHours() + 6)
    let endDate = `${updateUtc.toLocaleDateString('zh-Hans-CN')}T${updateUtc.toLocaleTimeString().slice(0,-3)}`.replaceAll('/','-')

    const token = dataElement.dataset.oceanobsApiKey;

    const activeStation = document.querySelector('.active-station')
    if (activeStation.id === 'stations') {
      const url = `https://remobsapi.herokuapp.com/api/v1/data_stations/last?start_date=${startDate}&end_date=${endDate}&token=${token}`
      return fetch(url,{
           method: 'GET',
           mode: 'cors',
           headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*'},
        })
    } else {
      const url = `https://remobsapi.herokuapp.com/api/v1/data_no_stations?start_date=${startDate}&end_date=${endDate}&token=${token}`
      return fetch(url,{
           method: 'GET',
           mode: 'cors',
           headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*'},
        })
    }
  }
};

export { getData };

