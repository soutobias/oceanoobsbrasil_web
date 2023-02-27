import { v2 as cloudinary } from 'cloudinary/lib/cloudinary'


const getImage = (startDate) => {

  const dataElement = document.getElementById('data');
  
  if (dataElement) {
    let url = `https://soutobias.xyz/images/synoptic_charts/${startDate}.png`
    return url
  }
};

const getImage2 = (startDate) => {

  const dataElement = document.getElementById('data');
  
  if (dataElement) {
    const cloudn = dataElement.dataset.cloudn;
    const clouds = dataElement.dataset.clouds;
    const clouda = dataElement.dataset.clouda;

    cloudinary.config({ 
      cloud_name: cloudn, 
      api_key: clouda, 
      api_secret: clouds
    });
    // cloudinary.config()['cloud_name'] = cloudn
    // cloudinary.config()['api_key'] = clouda
    // cloudinary.config()['api_secret'] = clouds


    return cloudinary.url(`${startDate}.png`)
  }
};

export { getImage };
