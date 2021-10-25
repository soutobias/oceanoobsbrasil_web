
const getData = () => {
  // const dataElement = document.getElementById('data');
  // const zeroPad = (num, places) => String(num).padStart(places, '0')
  // if (dataElement) {
  //   const token = dataElement.dataset.oceanobsApiKey;
  //   const dateSelect = document.getElementById("date_select").value
  //   const timeSelect = document.querySelector(".active-date").value

  //   const startDate = `${dateSelect}T${timeSelect}:00:00`
  //   const endDate = `${dateSelect}T${zeroPad((parseInt(timeSelect)+5).toString(),2)}:59:59`

  //   const url = `https://remobsapi.herokuapp.com/api/v1/data_stations/last?start_date=${startDate}&end_date=${endDate}&token=${token}`

  //   return fetch(url,{
  //        method: 'GET',
  //        mode: 'cors',
  //        headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*'},
  //     })
  // }
};

export { getData };

