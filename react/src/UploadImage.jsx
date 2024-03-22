import React, { useState } from 'react';
import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const UploadImage = ({ onUpload }) => {
  const [image, setImage] = useState("");

  const handleChange = e => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (image) {
      const storageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(storageRef, image);
      const imageUrl = await getDownloadURL(storageRef);
      onUpload(imageUrl); // Pass the uploaded image URL to the parent component
    }
  };

  return (
    <div>
      <input type="file" onChange={handleChange} />
      <button onClick={handleUpload}>Upload Image</button>
      {image && <img src={URL.createObjectURL(image)} alt="Selected Image" style={{ width: '100px' }} />}
    </div>
  );
};

export default UploadImage;
