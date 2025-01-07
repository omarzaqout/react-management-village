import React, { useState } from "react";

type ImageItem = {
  id: number;
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

  // دالة لتحميل الصورة المختارة
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setNewImage((prevImage) => ({
            ...prevImage,
            src: reader.result as string,
          }));
        }
      };
      reader.readAsDataURL(file); // تحويل الصورة إلى base64
    }
  };

  const addImage = () => {
    setIsModalOpen(true); // فتح النافذة المنبثقة عند الضغط على "Add New Image"
  };

  const handleSubmit = () => {
    if (newImage.src && newImage.description && newImage.name) {
      const newImageItem = {
        id: gallery.length + 1,
        ...newImage,
      };
      setGallery([...gallery, newImageItem]);
      setIsModalOpen(false);
      setNewImage({ src: "", description: "", name: "" }); // إعادة تعيين القيم
    }
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

        {/* نافذة منبثقة لإضافة صورة جديدة */}
        {isModalOpen && (
          <div className="modal fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="modal-content bg-[#f5f5dc] p-6 rounded shadow-lg w-96">
              <h2 className="text-xl mb-4 text-[#4a4a4a]">Add New Image</h2>
              
              {/* إدخال لتحميل الصورة */}
              <div>
                <label className="block text-sm mb-2 text-[#4a4a4a]">Choose Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full p-2 border border-gray-300 rounded mb-4"
                  onChange={handleImageUpload}
                />
              </div>
              
              <div>
                <label className="block text-sm mb-2 text-[#4a4a4a]">Description</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded mb-4 text-black"
                  value={newImage.description}
                  onChange={(e) =>
                    setNewImage({ ...newImage, description: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-[#4a4a4a]">Image Name</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded mb-4 text-black"
                  value={newImage.name}
                  onChange={(e) =>
                    setNewImage({ ...newImage, name: e.target.value })
                  }
                />
              </div>
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
