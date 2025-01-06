import React, { useState, useEffect } from "react";
import VillageItem from "../components/villageManagement/villageitem";
import { Village } from "../interfaces/Village";
import Popup from "../components/villageManagement/Popup";

const GET_VILLAGES = `query {
    getVillages {
      id
      VillageName
      RegionDistrict
      LandArea
      Latitude
      Longitude
      Image
      CategoriesTags
    }
  }`;
const VillageManagement: React.FC = () => {
  const [villages, setVillages] = useState<Village[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupInputs, setPopupInputs] = useState<
    {
      label: string;
      type?: string;
      value?: string;
      placeholder?: string;
      disabled?: boolean;
    }[]
  >([]);

  const isAdmin = localStorage.getItem("role") === "admin";
  const isUser = localStorage.getItem("role") === "user";

  useEffect(() => {
    const fetchVillages = async () => {
      try {
        const response = await fetch("http://localhost:5000/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: GET_VILLAGES,
          }),
        });
        const data = await response.json();
        setVillages(data.data.getVillages); // تعيين البيانات في حالة القرية
      } catch (error) {
        console.error("Error fetching villages:", error);
      }
    };

    fetchVillages();
  }, []);

  const handlePopup = (action: string, villageId?: number) => {
    setIsPopupOpen(true);
    if (isAdmin) {
      switch (action) {
        case "add":
          setPopupTitle("Add New Village");
          setPopupInputs([
            { label: "Village Name:", type: "text", value: "" },
            { label: "Region/District:", type: "text", value: "" },
            { label: "Land Area (sq km)", type: "text", value: "" },
            { label: "Latitude:", type: "text", value: "" },
            { label: "Longitude:", type: "text", value: "" },
            { label: "Upload Image:", type: "file", value: "" },
            { label: "Categories/Tags:", type: "text", value: "" },
          ]);
          break;
        case "Update Village": {
          const village = villages.find((v) => v.id === villageId);
          if (village) {
            setPopupTitle("Update Village");
            setPopupInputs([
              {
                label: "Village Name:",
                type: "text",
                value: village.VillageName.toString(),
              },
              {
                label: "Region/District:",
                type: "text",
                value: village.RegionDistrict.toString(),
              },
              {
                label: "Land Area (sq km)",
                type: "text",
                value: village.LandArea.toString(),
              },
              {
                label: "Latitude:",
                type: "text",
                value: village.Latitude.toString(),
              },
              {
                label: "Longitude:",
                type: "text",
                value: village.Longitude.toString(),
              },
              { label: "Upload Image:", type: "file", value: "" },
              {
                label: "Categories/Tags:",
                type: "text",
                value: village.CategoriesTags.toString(),
              },
            ]);
          }
          break;
        }
        case "View":
        { const viewVillage = villages.find((v) => v.id === villageId);
        if (viewVillage) {
          console.log(viewVillage);
          setPopupTitle("View Village");
          setPopupInputs([
            { label:` Village Name: ${viewVillage.VillageName} `},
            { label:` Region/District: ${viewVillage.RegionDistrict}` },
            { label:` Land Area (sq km): ${viewVillage.LandArea}` },
            { label: `Latitude: ${viewVillage.Latitude}` },
            { label:` Longitude: ${viewVillage.Longitude} `},
            { label:` Tags: ${viewVillage.CategoriesTags}` },
          ]);
        }
        break; }
        default:
          setPopupInputs([]);
      }
    } else if (isUser && action === "View") {
      const viewVillage = villages.find((v) => v.id === villageId);
      if (viewVillage) {
        setPopupTitle("View Village");
        setPopupInputs([
          { label: ` Village Name: ${viewVillage.VillageName} ` },
          { label: ` Region/District: ${viewVillage.RegionDistrict} ` },
          { label: ` Land Area (sq km): ${viewVillage.LandArea} ` },
          { label: `Latitude: ${viewVillage.Latitude} ` },
          { label: `Longitude: ${viewVillage.Longitude}` },
          { label: ` Tags: ${viewVillage.CategoriesTags}` },
        ]);
      }
    }
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const handleSubmit = async (inputValues: string[]) => {
    const formData = {
      VillageName: inputValues[0],
      RegionDistrict: inputValues[1],
      LandArea: parseFloat(inputValues[2]),
      Latitude: parseFloat(inputValues[3]),
      Longitude: parseFloat(inputValues[4]),
      CategoriesTags: inputValues[5],
      Image: inputValues[6] || "default_image_url",
    };

    const CREATE_VILLAGE = `mutation {
        addVillage(
          VillageName: "${formData.VillageName}",
          RegionDistrict: "${formData.RegionDistrict}",
          LandArea: ${formData.LandArea},
          Latitude: ${formData.Latitude},
          Longitude: ${formData.Longitude},
          Image: "${formData.Image}",
          CategoriesTags: "${formData.CategoriesTags}"
        )
      }`;
    try {
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: CREATE_VILLAGE }),
      });

      const data = await response.json();
      console.log("Village added:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-900 text-white rounded-md">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        {isAdmin && (
          <button
            onClick={() => handlePopup("add")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md w-full sm:w-auto mb-4 sm:mb-0"
          >
            Add New Village
          </button>
        )}
      </div>

      <div className="bg-gray-800 rounded-md p-4">
        <div className="flex gap-2 items-center mb-4">
          <input
            type="text"
            placeholder="Search villages..."
            className="p-3 bg-gray-700 border border-gray-600 rounded-md text-sm w-full"
          />
        </div>
        <div className="grid grid-cols-1 gap-4">
          {villages.map((village) => (
            <VillageItem
              id={village.id}
              key={village.VillageName}
              name={village.VillageName.toString()}
              region={village.RegionDistrict.toString()}
              onAction={(action) => handlePopup(action, village.id)}
            />
          ))}
        </div>
      </div>

      <Popup
        title={popupTitle}
        inputs={popupInputs}
        isOpen={isPopupOpen}
        onClose={closePopup}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default VillageManagement;
