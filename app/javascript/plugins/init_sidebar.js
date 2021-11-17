import { refreshLeaflet } from '../plugins/init_leaflet';


const selectStation = () => {

  const buttons = document.querySelectorAll('.type-station')
  const buttonsText = document.querySelectorAll('.stations')
  const info = document.getElementById('info')
  const first = document.getElementById('first-full-screen')

  const moon = document.getElementById('moon')
  const moon1 = document.getElementById('moon1')

  const moonFull = document.getElementById('moon-full-screen')


  const showPop = document.getElementById('showPop')
  if (info) {
    moon.addEventListener('click', (event) => {
      moonFull.classList.remove('inactive-tab');
    });
    moon1.addEventListener('click', (event) => {
      moonFull.classList.remove('inactive-tab');
    });

    moonFull.addEventListener('click', (event) => {
      moonFull.classList.add('inactive-tab');
    });

    showPop.addEventListener('click', (event) => {
      first.classList.remove('inactive-tab');
    });

    first.addEventListener('click', (event) => {
      first.classList.add('inactive-tab');
    });
    info.addEventListener('click', (event) => {
      const activeStation = document.querySelector('.active-station')
      const activeData = document.querySelector('.active-data')
      const popup = document.getElementById('full-screen');
      let text
      if (activeData.id === 'wave') {
        text =`<div class='text-center'><h2>ONDAS</h2><p>Altura significativa</p><p>Unidade: metros</p><p>Fuso: ZULU</p>
              <i class="fas fa-times-circle"></i></div>`
      } else if (activeData.id === 'wind') {
        text =`<div class='text-center'><h2>VENTO</h2><p>Velocidade do vento em 10 metros</p><p>Unidade: metros/segundo</p><p>Fuso: ZULU</p>
              <i class="fas fa-times-circle"></i></div>`
      } else if (activeData.id === 'water-temp') {
        text =`<div class='text-center'><h2>TEMPERATURA DA ÁGUA</h2><p>Temperatura da água do mar</p><p>Unidade: °C</p><p>Fuso: ZULU</p>
              <i class="fas fa-times-circle"></i></div>`
      } else if (activeData.id === 'air-temp') {
        text =`<div class='text-center'><h2>TEMPERATURA DO AR</h2><p>Temperatura do ar</p><p>Unidade: °C</p><p>Fuso: ZULU</p>
              <i class="fas fa-times-circle"></i></div>`
      } else if (activeData.id === 'fog') {
        text =`<div class='text-center'><h2>VISIBILIDADE</h2><p>Visibilidade medida em aeroportos</p><p>Unidade: km</p><p>Fuso: ZULU</p>
              <i class="fas fa-times-circle"></i></div>`
      } else if (activeData.id === 'tide') {
        text =`<div class='text-center'><h2>MAŔÉ METEOROLÓGICA</h2><p>Diferença entre a maré medida e a maré prevista</p><p>Unidade: metros</p><p>Fuso: ZULU</p>
              <i class="fas fa-times-circle"></i></div>`
      }
      popup.innerHTML = text;
      popup.classList.remove('inactive-tab');
      popup.addEventListener('click', (event) => {
        popup.classList.add('inactive-tab');
      });
    });
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
          const activeData = document.querySelector('.active-data')
          if (activeData.id === 'fog') {
            document.getElementById('fog').classList.remove('active-data')
            document.getElementById('wave').classList.add('active-data')
          } else if (activeData.id === 'tide') {
            document.getElementById('tide').classList.remove('active-data')
            document.getElementById('wave').classList.add('active-data')
          }
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
          const activeData = document.querySelector('.active-data')
          if (activeData.id === 'fog') {
            document.getElementById('fog').classList.remove('active-data')
            document.getElementById('wave').classList.add('active-data')
          } else if (activeData.id === 'tide') {
            document.getElementById('tide').classList.remove('active-data')
            document.getElementById('wave').classList.add('active-data')
          }
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
