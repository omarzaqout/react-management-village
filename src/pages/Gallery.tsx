import React, { useState } from "react";

type ImageItem = {
  id: number;
  src: string;
  description: string;
};

const GalleryItem: React.FC<ImageItem> = ({ id, src, description }) => (
  <div className="gallery-item bg-gray-800 p-4 rounded shadow-md text-center">
    <img src={src} alt={`Image ${id}`} className="rounded mb-3 w-full h-auto" />
    <p className="description text-sm text-gray-400">{description}</p>
  </div>
);

const Dashboard: React.FC = () => {
  const [gallery, setGallery] = useState<ImageItem[]>([]);

  const addImage = () => {
    const newImage = {
      id: gallery.length + 1,
      src: `https://via.placeholder.com/150?text=Image+${gallery.length + 1}`,
      description: `Description ${gallery.length + 1}`,
    };
    setGallery([...gallery, newImage]);
  };

  return (
    <div className="dashboard flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <div className="main flex flex-col flex-1 p-5">
        <button
          id="addImageBtn"
          onClick={addImage}
          className="add-image-btn bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-5"
        >
          Add New Image
        </button>

        <div
          id="gallery"
          className="gallery grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
        >
          {gallery.map((item) => (
            <GalleryItem
              key={item.id}
              id={item.id}
              src={item.src}
              description={item.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
