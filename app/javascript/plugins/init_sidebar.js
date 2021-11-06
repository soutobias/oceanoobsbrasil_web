import { refreshLeaflet } from '../plugins/init_leaflet';


const selectStation = () => {

  const buttons = document.querySelectorAll('.type-station')
  const buttonsText = document.querySelectorAll('.stations')


  if (buttons) {
    buttons.forEach((button) => {
      button.addEventListener('click', (event) => {
        buttons.forEach((button_1) => {
          button_1.classList.remove('active-station');
        });
        event.currentTarget.classList.add('active-station');
        const activeStation = document.querySelector('.active-station')
        if (activeStation.id === 'no-stations') {
          document.getElementById('tide').classList.add('inactive-tab')
          document.getElementById('tide1').classList.add('inactive-tab')
          document.getElementById('fog').classList.add('inactive-tab')
          document.getElementById('fog1').classList.add('inactive-tab')
        } else {
          document.getElementById('tide').classList.remove('inactive-tab')
          document.getElementById('tide1').classList.remove('inactive-tab')
          document.getElementById('fog').classList.remove('inactive-tab')
          document.getElementById('fog1').classList.remove('inactive-tab')
        }
        refreshLeaflet();
      });
    });
    buttonsText.forEach((button1) => {
      button1.addEventListener('click', (event) => {
        buttons.forEach((button) => {
          button.classList.remove('active-station');
        });
        const idClick = event.currentTarget.id;
        const clicked = document.getElementById(idClick.slice(0,-1));
        clicked.classList.add('active-station');
        const activeStation = document.querySelector('.active-station')
        if (activeStation.id === 'no-stations') {
          document.getElementById('tide').classList.add('inactive-tab')
          document.getElementById('tide1').classList.add('inactive-tab')
          document.getElementById('fog').classList.add('inactive-tab')
          document.getElementById('fog1').classList.add('inactive-tab')
        } else {
          document.getElementById('tide').classList.remove('inactive-tab')
          document.getElementById('tide1').classList.remove('inactive-tab')
          document.getElementById('fog').classList.remove('inactive-tab')
          document.getElementById('fog1').classList.remove('inactive-tab')
        }
        refreshLeaflet();
      });
    });
  }

};

const selectType = () => {

  const buttons = document.querySelectorAll('.data-station')
  const buttonsText = document.querySelectorAll('.stations-data')

  if (buttons) {
    buttons.forEach((button) => {
      button.addEventListener('click', (event) => {
        buttons.forEach((button_1) => {
          button_1.classList.remove('active-data');
        });
        event.currentTarget.classList.add('active-data');
        refreshLeaflet();
      });
    });
    buttonsText.forEach((button1) => {
      button1.addEventListener('click', (event) => {
        buttons.forEach((button) => {
          button.classList.remove('active-data');
        });
        const idClick = event.currentTarget.id;
        const clicked = document.getElementById(idClick.slice(0,-1));
        clicked.classList.add('active-data');
        refreshLeaflet();
      });
    });

  }
};

export { selectStation, selectType };
