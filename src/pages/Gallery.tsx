import React, { useState, useEffect } from "react";

type ImageItem = {
  id: string;
  src: string;
  description: string;
  name: string;
};

const GalleryItem: React.FC<ImageItem> = ({ id, src, description, name }) => (
  <div className="gallery-item bg-gray-800 p-4 rounded shadow-md text-center">
    <img src={src} alt={`Image ${id}`} className="rounded mb-3 w-full h-auto" />
    <h3 className="text-lg font-semibold text-white">{name}</h3>
    <p className="description text-sm text-gray-400">{description}</p>
  </div>
);

const Dashboard: React.FC = () => {
  const [gallery, setGallery] = useState<ImageItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newImage, setNewImage] = useState<{
    src: string;
    description: string;
    name: string;
  }>({ src: "", description: "", name: "" });

  // Fetch images from the database when the component mounts
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("http://localhost:5000/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query {
                getImages {
                  id
                  src
                  description
                  name
                }
              }
            `,
          }),
        });

        const data = await response.json();
        if (data.errors) {
          console.error("Error fetching images:", data.errors);
        } else {
          setGallery(data.data.getImages);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchImages();
  }, []);

  const addImage = () => {
    setIsModalOpen(true); // Open modal for adding new image
  };

  const handleSubmit = async () => {
    if (newImage.src && newImage.description && newImage.name) {
      try {
        const response = await fetch("http://localhost:5000/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              mutation {
                addImageWithLink(link: "${newImage.src}", description: "${newImage.description}", name: "${newImage.name}") 
              }
            `,
          }),
        });

        const data = await response.json();
        if (data.errors) {
          console.error("Error adding image:", data.errors);
        } else {
          console.log("Image added:", data.data.addImageWithLink);
          setGallery([
            ...gallery,
            { ...newImage, id: (gallery.length + 1).toString() }, // Convert the id to string
          ]);
                    setIsModalOpen(false);
          setNewImage({ src: "", description: "", name: "" });
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <div className="dashboard flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <div className="main flex flex-col flex-1 p-5">
        <button
          id="addImageBtn"
          onClick={addImage}
          className="add-image-btn bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mb-5"
        >
          Add New Image
        </button>

        {/* Modal for adding new image */}
        {isModalOpen && (
          <div className="modal fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="modal-content bg-[#f5f5dc] p-6 rounded shadow-lg w-96">
              <h2 className="text-xl mb-4 text-[#4a4a4a]">Add New Image</h2>

              {/* Image URL input */}
              <div>
                <label className="block text-sm mb-2 text-[#4a4a4a]">

            <div className="modal-content bg-gray-700  p-6 rounded shadow-lg w-96">
              <h2 className="text-xl mb-4 text-white ">Add New Image</h2>

              {/* Image URL input */}
              <div>
                <label className="block text-sm mb-2 text-white ">
                  Image URL
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded mb-4 text-black"
                  className="w-full p-2 border border-gray-300 rounded mb-4  text-black"
                  value={newImage.src}
                  onChange={(e) =>
                    setNewImage({ ...newImage, src: e.target.value })
                  }
                />
              </div>

              {/* Description input */}
              <div>
                <label className="block text-sm mb-2 text-[#4a4a4a]">
                <label className="block text-sm mb-2 text-white ">
                  Description
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded mb-4 text-black"
                  value={newImage.description}
                  onChange={(e) =>
                    setNewImage({ ...newImage, description: e.target.value })
                  }
                />
              </div>

              {/* Image Name input */}
              <div>
                <label className="block text-sm mb-2 text-[#4a4a4a]">
                <label className="block text-sm mb-2 text-white ">
                  Image Name
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded mb-4 text-black"
                  value={newImage.name}
                  onChange={(e) =>
                    setNewImage({ ...newImage, name: e.target.value })
                  }
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end">
                <button
                  onClick={handleSubmit}
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                >
                  Add Image
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Gallery */}
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
              name={item.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;