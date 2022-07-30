import counterUp from 'counterup2'

const countStations = () => {
    const dataElement = document.getElementById('data');
    if (dataElement){
        const counterElement = document.getElementById('counter');
        counterUp( counterElement, {
            duration: 1000,
            delay: 16,
        } )
    }
};

export { countStations };
