import React, { useState } from 'react';

const SingleImageUpload = ({ onUpload }) => {
  const [image, setImage] = useState('');

  const handleFile = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/uploadSingleImage', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        console.log('Image uploaded successfully:', data);

        setImage(data.secure_url);

        // Callback to parent component with the Cloudinary URL
        onUpload(data.secure_url);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  return (
    <input
      type="file"
      onChange={handleFile}
      style={{ display: 'none' }}
      accept="image/*"
    />
  );
};

export default SingleImageUpload;
