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
  const [selectedVillageId, setSelectedVillageId] = useState<number>();

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
        setVillages(data.data.getVillages);
      } catch (error) {
        console.error("Error fetching villages:", error);
      }
    };

    fetchVillages();
  }, [villages]);
  useEffect(() => {
    if (selectedVillageId !== undefined) {
      console.log("Selected Village ID:", selectedVillageId);
    }
  }, [selectedVillageId]); 

  const handlePopup = (action: string, villageId?: number) => {
    setSelectedVillageId(villageId);
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
              { label: "Village Name:", type: "text", value: village.VillageName.toString() },
              { label: "Region/District:", type: "text", value: village.RegionDistrict.toString() },
              { label: "Land Area (sq km)", type: "text", value: village.LandArea.toString() },
              { label: "Latitude:", type: "text", value: village.Latitude.toString() },
              { label: "Longitude:", type: "text", value: village.Longitude.toString() },
              { label: "Upload Image:", type: "file", value:"" },
              { label: "Categories/Tags:", type: "text", value: village.CategoriesTags.toString() },
            ]);
            
          }
          break;
        }
        case "View":
          { const viewVillage = villages.find((v) => v.id === villageId);
          if (viewVillage) {
            setPopupTitle("View Village");
            setPopupInputs([
              { label: ` Village Name: ${viewVillage.VillageName} ` },
              { label: ` Region/District: ${viewVillage.RegionDistrict}` },
              { label: ` Land Area (sq km): ${viewVillage.LandArea}` },
              { label: `Latitude: ${viewVillage.Latitude}` },
              { label: `Longitude: ${viewVillage.Longitude}` },
              { label: ` Tags: ${viewVillage.CategoriesTags.toString()}` },
            ]);
          }
          break; }
          case "Delete Village":
          { const viewVillage = villages.find((v) => v.id === villageId);
          if (viewVillage) {
            setPopupTitle("Delete Village");
            setPopupInputs([
              { label: ` Do you want delete Village: ${viewVillage.VillageName} ` },
            ]);
          }
          break; }
          case "Update Demographic Data": {
            const village = villages.find((v) => v.id === villageId);
            if (village) {
              setPopupTitle(`Add Demographic Data for ${village.VillageName}`);
              setPopupInputs([
                { label: "Population Size:", type: "text", value:"" },
                { label: "Age Distribution:", type: "text", placeholder: "e.g., 0-18: 30%, 19-35: 60%, 36-50:10% , 51-65:0%,66+:0%",value:"" },
                { label: "Gender Ratios:", type: "text",placeholder:"e.g., Male: 51%, Female: 49%" ,value:"" },
                { label: "Population Growth Rate:", type: "text", value:"" },
              ]);
              
            }
            break;
          }

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

  const handleSubmit = async (inputValues: string[], villageId?: number) => {
    const formData = {
      VillageName: inputValues[0],
      RegionDistrict: inputValues[1],
      LandArea: parseInt(inputValues[2]),
      Latitude: parseFloat(inputValues[3]),
      Longitude: parseFloat(inputValues[4]),
      CategoriesTags: inputValues[6],
      Image: inputValues[5] || "default_image_url",
    };
    
    console.log("Form Data:", formData);
  
    if (popupTitle === "Add New Village") {
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
        console.log("Response:", data);
  
        if (data.errors) {
          console.error("Error adding village:", data.errors);
        } else {
          console.log("Village added:", data);
        }
      } catch (error) {
        console.error("Error adding village:", error);
      }
    }
  
    if (popupTitle === "Update Village" && villageId) {
      const UPDATE_VILLAGE = `mutation {
        updateVillage(
          id: ${villageId},
          VillageName: "${formData.VillageName}",
          RegionDistrict: "${formData.RegionDistrict}",
          LandArea: ${formData.LandArea},
          Latitude: ${formData.Latitude},
          Longitude: ${formData.Longitude},
          Image: "${formData.Image}",
          CategoriesTags: "${formData.CategoriesTags}"
        ) {
          id
          VillageName
        }
      }`;
  
      try {
        const response = await fetch("http://localhost:5000/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: UPDATE_VILLAGE }),
        });
  
        const data = await response.json();
        console.log("Village updated:", data);
      } catch (error) {
        console.error("Error updating village:", error);
      }
    }
  
    // Handling demographic data submission:
    if (popupTitle.startsWith("Add Demographic Data for") && villageId) {
      
      const ageDistribution = inputValues[1];
      const ageGroups = ageDistribution
        .split(",")
        .map((group) => {
          const [range, percentage] = group.trim().split(":");
          return { range: range.trim(), percentage: parseFloat(percentage) };
        });
  
      const demographicData = {
        PopulationSize: parseInt(inputValues[0]),
        AgeDistribution: {
          pu18: ageGroups.find((group) => group.range === "0-18")?.percentage || 0,
          pu35: ageGroups.find((group) => group.range === "19-35")?.percentage || 0,
          pu50: ageGroups.find((group) => group.range === "36-50")?.percentage || 0,
          pu65: ageGroups.find((group) => group.range === "51-65")?.percentage || 0,
          p65: ageGroups.find((group) => group.range === "66+")?.percentage || 0,
        },
        GenderRatios: inputValues[2],
        PopulationGrowthRate: parseFloat(inputValues[3]),
      };
  
      const SAVE_DEMOGRAPHIC_DATA = `mutation {
        updateDemography(
          id: ${villageId},
          pu18: ${demographicData.AgeDistribution.pu18},
          pu35: ${demographicData.AgeDistribution.pu35},
          pu50: ${demographicData.AgeDistribution.pu50},
          pu65: ${demographicData.AgeDistribution.pu65},
          p65: ${demographicData.AgeDistribution.p65},
          malePercentage: ${parseFloat(demographicData.GenderRatios.split(",")[0]) || 0},
          femalePercentage: ${parseFloat(demographicData.GenderRatios.split(",")[1]) || 0},
          populationGrowthRate: ${demographicData.PopulationGrowthRate},
          population: ${demographicData.PopulationSize}
        ) {
          id
          pu18
          pu35
          pu50
          pu65
          p65
          malePercentage
          femalePercentage
          populationGrowthRate
          population
        }
      }`;
  
      console.log("GraphQL Mutation:", SAVE_DEMOGRAPHIC_DATA);
  
      try {
        const response = await fetch("http://localhost:5000/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: SAVE_DEMOGRAPHIC_DATA }),
        });
  
        const data = await response.json();
        console.log("Demographic data saved:", data);
  
        if (data.errors) {
          console.error("Error saving demographic data:", data.errors);
        }
      } catch (error) {
        console.error("Error saving demographic data:", error);
      }
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
  onSubmit={(inputValues) => handleSubmit(inputValues, selectedVillageId )} 
  id={selectedVillageId}
/>

    </div>
  );
};

export default VillageManagement;
