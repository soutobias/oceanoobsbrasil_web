import { v2 as cloudinary } from 'cloudinary/lib/cloudinary'


const getImage = (startDate) => {

  const dataElement = document.getElementById('data');
  
  if (dataElement) {

    const cloud = dataElement.dataset.cloudinary;
    cloudinary.config(cloud);
    return cloudinary.url(`${startDate}.png`)
  }
};

export { getImage };
