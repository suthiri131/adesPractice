import React, { useEffect, useState } from 'react';

const editPicture = ({ onImageChange }) => {
  const [image, setImage] = useState(null);

  const handleFile = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        onImageChange(reader.result); // Notify the parent component about the image change
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFile} />
      {image && <img src={image} alt="Profile" />}
    </div>
  );
};


export default editPicture;
