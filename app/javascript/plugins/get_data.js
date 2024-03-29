
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

    let startDate = `${updateUtc.getFullYear()}-${(updateUtc.getMonth() + 1).toString().padStart(2, '0')}-${updateUtc.getDate().toString().padStart(2, '0')}T${updateUtc.toLocaleTimeString('pt-BR')}`
    updateUtc.setHours(updateUtc.getHours() + 6)
    let endDate = `${updateUtc.getFullYear()}-${(updateUtc.getMonth() + 1).toString().padStart(2, '0')}-${updateUtc.getDate().toString().padStart(2, '0')}T${updateUtc.toLocaleTimeString('pt-BR')}`

    const token = dataElement.dataset.oceanobsApiKey;

    const activeStation = document.querySelector('.active-station')
    const activeData = document.querySelector('.active-data')
    if (activeStation.id === 'stations') {
      if (activeData.id === 'moon'){
        const url = `https://remobsapi.herokuapp.com/api/v1/stations?token=${token}`
        return fetch(url,{
            method: 'GET',
            mode: 'cors',
            headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*'},
          })
      } else if (activeData.id === 'weather-warning') {
        const url = `https://remobsapi.herokuapp.com/api/v1/weather_warnings?start_date=${startDate}&end_date=${endDate}&token=${token}`
        return fetch(url,{
            method: 'GET',
            mode: 'cors',
            headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*'},
          })
      } else {
        const url = `https://remobsapi.herokuapp.com/api/v1/data_stations/last?start_date=${startDate}&end_date=${endDate}&token=${token}`
        return fetch(url,{
            method: 'GET',
            mode: 'cors',
            headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*'},
          })
      }
    } else {
      if (activeData.id === 'weather-warning') {
        const url = `https://remobsapi.herokuapp.com/api/v1/weather_warnings?start_date=${startDate}&end_date=${endDate}&token=${token}`
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
  }
};

const getDataStation = () => {
  const chartElement = document.getElementById('plotdata');
  const station = JSON.parse(chartElement.dataset.station);
  const token = chartElement.dataset.oceanobsApiKey;

  const now = new Date();
  const utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000 - 3600000*24*4);
  let startDate = `${utc.getFullYear()}-${(utc.getMonth() + 1).toString().padStart(2, '0')}-${utc.getDate().toString().padStart(2, '0')}T${utc.toLocaleTimeString('pt-BR')}`
  const url = `https://remobsapi.herokuapp.com/api/v1/data_stations/station?station_id=${station.id}start_date=${startDate}&token=${token}`
  return fetch(url,{
        method: 'GET',
        mode: 'cors',
        headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*'},
    })
};

export { getData, getDataStation };
