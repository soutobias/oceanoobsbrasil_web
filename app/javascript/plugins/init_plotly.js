import Plotly from 'plotly.js-dist';
import { getDataStation } from '../plugins/get_data';

const initPlotly = () => {
  const chartElement = document.getElementById('plotdata');
  if (chartElement) {
    const loader = document.getElementById('loader');
    loader.classList.remove('inactive-tab');
		getDataStation().then(response => response.json())
    .then((dataApi) => {
			const station = JSON.parse(chartElement.dataset.station);
			let dataAll = {};
			dataApi.forEach(o => {
				Object.keys(o).forEach(k => {
				  dataAll[k] ||= [];
					if (k === 'visibility' && o[k]){
						dataAll[k].push(o[k]*(1.6));
					} else{
						dataAll[k].push(o[k]);
					}
				});
			});
			let vari = 'wspd'
			plotData(dataAll, vari, station.data_type);
			vari = 'gust'
			plotData(dataAll, vari, station.data_type);
			vari = 'wdir'
			plotData(dataAll, vari, station.data_type);
			plotDataDir(dataAll, vari, station.data_type);
			vari = 'pres'
			plotData(dataAll, vari, station.data_type);
			vari = 'atmp'
			plotData(dataAll, vari, station.data_type);
			vari = 'rh'
			plotData(dataAll, vari, station.data_type);
			vari = 'dewpt'
			plotData(dataAll, vari, station.data_type);
			vari = 'visibility'
			plotData(dataAll, vari, station.data_type);

			vari = 'swvht'
			plotData(dataAll, vari, station.data_type);
			vari = 'swvht_swell'
			plotData(dataAll, vari, station.data_type);
			vari = 'swvht_sea'
			plotData(dataAll, vari, station.data_type);
			vari = 'mxwvht'
			plotData(dataAll, vari, station.data_type);
			vari = 'wvdir'
			plotData(dataAll, vari, station.data_type);
			plotDataDir(dataAll, vari, station.data_type);
			vari = 'wvdir_swell'
			plotData(dataAll, vari, station.data_type);
			plotDataDir(dataAll, vari, station.data_type);
			vari = 'wvdir_sea'
			plotData(dataAll, vari, station.data_type);
			plotDataDir(dataAll, vari, station.data_type);
			vari = 'tp'
			plotData(dataAll, vari, station.data_type);
			vari = 'wvspread'
			plotData(dataAll, vari, station.data_type);

			vari = 'sst'
			plotData(dataAll, vari, station.data_type);
			vari = 'meteorological_tide'
			plotData(dataAll, vari, station.data_type);
		});
	}
};

const plotData = (dataApi, variable, dataType) => {

	let y
	let title
	let yLegend
	if (variable == 'wspd'){
		y = dataApi.wspd
		title = "VEL. VENTO"
		yLegend = "Veloc. Vento (nós)"
	} else if ( variable == 'gust'){
		y = dataApi.gust
		title = "VEL. VENTO RAJADA"
		yLegend = "Veloc. Vento (nós)"
	} else if ( variable == 'wdir'){
		y = dataApi.wdir
		title = "DIR. VENTO"
		yLegend = "Dir. Vento (°)"
	} else if ( variable == 'swvht'){
		y = dataApi.swvht
		title = "ALTURA SIG. ONDA"
		yLegend = "Altura Onda (m)"
	} else if ( variable == 'mxwvht'){
		y = dataApi.mxwvht
		title = "ALTURA MAX. ONDA"
		yLegend = "Altura Onda (m)"
	} else if ( variable == 'swvht_swell'){
		y = dataApi.swvht_swell
		title = "ALTURA SIG. ONDA SWELL"
		yLegend = "Altura Onda (m)"
	} else if ( variable == 'swvht_sea'){
		y = dataApi.swvht_sea
		title = "ALTURA SIG. ONDA MAR LOCAL"
		yLegend = "Altura Onda (m)"
	} else if ( variable == 'wvdir'){
		y = dataApi.wvdir
		title = "DIR. ONDA"
		yLegend = "Dir. Onda (°)"
	} else if ( variable == 'wvdir_swell'){
		y = dataApi.wvdir_swell
		title = "DIR. ONDA SWELL"
		yLegend = "Dir. Onda (°)"
	} else if ( variable == 'wvdir_sea'){
		y = dataApi.wvdir_sea
		title = "DIR. ONDA MAR LOCAL"
		yLegend = "Dir. Onda (°)"
	} else if ( variable == 'tp'){
		y = dataApi.tp
		title = "PER. ONDA"
		yLegend = "Período Onda (s)"
	} else if ( variable == 'wvspread'){
		y = dataApi.wvspread
		title = "ESPALHAMENTO ONDA"
		yLegend = "Espalhamento Onda (°)"
	} else if ( variable == 'sst'){
		y = dataApi.sst
		title = "TEMP. ÁGUA"
		yLegend = "Temperatura (°C)"
	} else if ( variable == 'atmp'){
		y = dataApi.atmp
		title = "TEMP. AR"
		yLegend = "Temperatura (°C)"
	} else if ( variable == 'pres'){
		y = dataApi.pres
		title = "PRESSÃO"
		yLegend = "Pressão Atmosférica (mb)"
	} else if ( variable == 'rh'){
		y = dataApi.rh
		title = "UMIDADE RELATIVA"
		yLegend = "Umidade Relativa (%)"
	} else if ( variable == 'dewpt'){
		y = dataApi.dewpt
		title = "TEMP. PONTO ORVALHO"
		yLegend = "Temp. Orvalho (°C)"
	} else if ( variable == 'visibility'){
		y = dataApi.visibility
		title = "VISIBILIDADE"
		yLegend = "Visibilidade (km)"
	} else if ( variable == 'meteorological_tide'){
		y = dataApi.meteorological_tide
		title = "MARÉ METEOROLÓGICA"
		yLegend = "Maré Meteorológica (m)"
	}
	if (y.every(element => element === null)) {
		let ok
	} else {
		const values = {
			x: dataApi.date_time,
			y: y,
			mode: 'lines+markers',
			name: dataType,
			line: {
				color: '#D49511',
				width: 2
			}
		};

		const data = [values];

		var layout = {
			title: {
				text: title,
				font: {
					family: 'Work Sans, sans-serif',
					size: 24
				},
			},
			plot_bgcolor:"rgba(0,0,0,0)",
			paper_bgcolor:"rgba(0,0,0,0)",
			xaxis: {
				showgrid: true,
				zeroline: false,
				tickformat: '%d/%m %Hh',
				gridcolor: 'rgba(0,0,0,0.2)'
			},
			yaxis: {
				title: yLegend,
				showgrid: true,
				showline: true,
				gridcolor: 'rgba(0,0,0,0.2)'
			},
			showlegend: false
		};
		var config = {responsive: true, displayModeBar: false }
		let plotName = `${variable}-plot`
		Plotly.newPlot(plotName, data, layout, config);
    const loader = document.getElementById('loader');
    loader.classList.add('inactive-tab');
	}
};

const plotDataDir = (dataApi, variable, dataType) => {

	let y
	let title
	let yLegend
	if ( variable == 'wdir'){
		y = dataApi.wdir
		title = "DIR. VENTO"
		yLegend = "Dir. Vento (°)"
	} else if ( variable == 'wvdir'){
		y = dataApi.wvdir
		title = "DIR. ONDA"
		yLegend = "Dir. Onda (m)"
	} else if ( variable == 'wvdir_swell'){
		y = dataApi.wvdir_swell
		title = "DIR. ONDA SWELL"
		yLegend = "Dir. Onda (m)"
	} else if ( variable == 'wvdir_sea'){
		y = dataApi.wvdir_sea
		title = "DIR. ONDA MAR LOCAL"
		yLegend = "Dir. Onda (m)"
	}
	if (y.every(element => element === null)) {
		let ok
	} else {
		const values = {
			theta: y,
			name: title,
			line: {
				color: '#D49511',
				width: 10
			},
			type: 'barpolar'
		};

		const data = [values];

		var layout = {
			title: {
				text: title,
				font: {
					family: 'Work Sans, sans-serif',
					size: 18
				},
			},
			plot_bgcolor:"rgba(0,0,0,0)",
			paper_bgcolor:"rgba(0,0,0,0)",
			polar: {
				radialaxis: {
					visible: false
				},
				angularaxis: {
					tickfont: {
						size: 8
					},
					rotation: 90,
					direction: "clockwise"
				}
			}
		};

		var config = {responsive: true, displayModeBar: false }
		let plotName = `${variable}g-plot`
		Plotly.newPlot(plotName, data, layout, config);
    const loader = document.getElementById('loader');
    loader.classList.add('inactive-tab');
	}
};

export { initPlotly };
