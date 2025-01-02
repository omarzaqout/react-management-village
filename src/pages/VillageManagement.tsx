import React, { useState } from "react";
import VillageItem from "../components/villageManagement/villageitem";
import { Village } from "../interfaces/Village";
import Popup from "../components/villageManagement/Popup";

const villages: Village[] = [
  {
    id: 1, name: "Jabalia", region: "Gaza Strip",
    landArea: "",
    latitude: "",
    longitude: "",
    tags: ""
  },
  {
    id: 2, name: "Beit Lahia", region: "Gaza Strip",
    landArea: "",
    latitude: "",
    longitude: "",
    tags: ""
  },
  {
    id: 3, name: "Quds", region: "West Bank",
    landArea: "",
    latitude: "",
    longitude: "",
    tags: ""
  },
  {
    id: 4, name: "Shejaiya", region: "Gaza Strip",
    landArea: "",
    latitude: "",
    longitude: "",
    tags: ""
  },
  {
    id: 5, name: "Hebron", region: "West Bank",
    landArea: "",
    latitude: "",
    longitude: "",
    tags: ""
  },
];

const VillageManagement: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupInputs, setPopupInputs] = useState<{ label: string; type?: string; value?: string;placeholder?:string,disabled?:boolean }[]>([]);

  const handlePopup = (action: string, villageId?: number) => {
    console.log("action :" + action);
    setIsPopupOpen(true);
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
      case "Update Village":
        setPopupTitle("Update Village");
        setPopupInputs([
          { label: "Village Name:", type: "text", value:villages.find(v => v.id === villageId)?.name  },
          { label: "Region/District:", type: "text", value: villages.find(v => v.id === villageId)?.region },
          { label: "Land Area (sq km)", type: "text", value:villages.find(v => v.id === villageId)?.landArea  },
          { label: "Latitude:", type: "text", value:villages.find(v => v.id === villageId)?.latitude },
          { label: "Longitude:", type: "text", value: villages.find(v => v.id === villageId)?.longitude },
          { label: "Upload Image:", type: "file", value: "" },
          { label: "Categories/Tags:", type: "text", value:villages.find(v => v.id === villageId)?.tags},
        ]);
        break;
        case "View":
          setPopupTitle("View Village");
          setPopupInputs([ 
            { label: "Village ID: " + villageId },
            { label: "Village Name: " + villages.find(v => v.id === villageId)?.name },
            { label: "Region/District:: " + villages.find(v => v.id === villageId)?.region },
            { label: "Land Area (sq km) " + villages.find(v => v.id === villageId)?.landArea },
            { label: "Latitude: " + villages.find(v => v.id === villageId)?.latitude },
            { label: "Longitude: " + villages.find(v => v.id === villageId)?.longitude },
            { label: "Tags: " + villages.find(v => v.id === villageId)?.tags },
          ]);
          break;

      case "Update Demographic Data":
        setPopupTitle("Add Demographic Data for {name}");
        setPopupInputs([
          { label: "Population Size:", type: "text", value: "" },
          { label: "Age Distribution:", type: "text", value: "", placeholder: "e.g., 0-14: 30%, 15-64: 60%, 65+: 10%" },
          { label: "Gender Ratios:", type: "text", value: "", placeholder: "e.g., Male: 51%, Female: 49%" },
          { label: "Population Growth Rate:", type: "text", value: "" },
        ]);
        break;
      default:
        setPopupInputs([]);
    }
  };
  

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const handleSubmit = (values: string[]) => {
    console.log("Submitted values:", values);
  };

  return (
   
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-900 text-white rounded-md">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <button
          onClick={() => handlePopup("add")}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md w-full sm:w-auto mb-4 sm:mb-0"
        >
          Add New Village
        </button>
      </div>

      <div className="bg-gray-800 rounded-md p-4">
        <div className="flex gap-2 items-center mb-4">
          <input
            type="text"
            placeholder="Search villages..."
            className="p-3 bg-gray-700 border border-gray-600 rounded-md text-sm w-full"
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <div className="flex items-center w-full sm:w-auto">
            <label htmlFor="select" className="mr-2 text-sm text-white">
              Sort by:
            </label>
            <select
              className="p-3 bg-gray-700 border border-gray-600 rounded-md text-sm w-full sm:w-auto"
              id="select"
            >
              <option>Default</option>
              <option>Name</option>
              <option>Region</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {villages.map((village) => (
            <VillageItem
              key={village.id}
              id={village.id}
              name={village.name}
              region={village.region}
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
