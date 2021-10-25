const selectLayer = () => {

  const buttons = document.querySelectorAll('.type-station')
  const buttonsText = document.querySelectorAll('.stations')


  if (buttons) {
    buttons.forEach((button) => {
      button.addEventListener('click', (event) => {
        buttons.forEach((button_1) => {
          button_1.classList.remove('active-station');
        });
        event.currentTarget.classList.add('active-station');
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
      });
    });

  }
};

const selectDate = () => {

  const buttons = document.querySelectorAll('.data-station')
  const buttonsText = document.querySelectorAll('.stations-data')

  if (buttons) {
    buttons.forEach((button) => {
      button.addEventListener('click', (event) => {
        buttons.forEach((button_1) => {
          button_1.classList.remove('active-data');
        });
        event.currentTarget.classList.add('active-data');
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
      });
    });

  }
};

export { selectLayer, selectDate };
