// frontend/src/components/ImageUpload.js
import React, { useState } from "react";
import axios from "axios";

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!image) {
      alert("Please choose a file.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", name);

    try {
      const response = await axios.post(
        "http://localhost:5000/graphql",
        {
          query: `
            mutation {
              addImage(name: "${name}") {
                name
                src
              }
            }
          `,
          variables: { name },
        },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log(response.data);
    } catch (err) {
      console.error("Error uploading image", err);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter image name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Image</button>
    </div>
  );
};

export default ImageUpload;
