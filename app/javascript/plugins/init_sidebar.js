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
