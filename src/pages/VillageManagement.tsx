import React from "react";
import VillageItem from "../components/villageManagement/villageitem"
import {Village} from "../interfaces/Village"


const villages: Village[] = [
  { id: 1, name: "Jabalia", region: "Gaza Strip" },
  { id: 2, name: "Beit Lahia", region: "Gaza Strip" },
  { id: 3, name: "Quds", region: "West Bank" },
  { id: 4, name: "Shejaiya", region: "Gaza Strip" },
  { id: 5, name: "Hebron", region: "West Bank" },
];

const VillageManagement: React.FC = () => {
  const handleAction = (action: string, id: number) => {
    console.log(`${action} clicked for village ID: ${id}`);
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-md">
      <div className=" flex justify-between items-center mb-4">
        <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md">
          Add New Village
        </button>
        
        
      </div>
       
      <div className="bg-gray-800 rounded-md p-4">
      <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Search villages..."
            className="p-2 bg-gray-700 border border-gray-600 rounded-md text-sm w-full my-1"
          />
        </div>
<div className="flex justify-between items-center my-1">
  
  <div className="flex items-center">
    <label htmlFor="select" className="mr-2 text-sm text-white">Sort by:</label>
    <select
      className="p-1 bg-gray-700 border border-gray-600 rounded-md text-sm"
      id="select"
    >
      <option>Default</option>
      <option>Name</option>
      <option>Region</option>
    </select>
  </div>
  <div className="flex gap-2">
    <button className="bg-slate-500 hover:bg-gray-600 px-3 py-1 rounded-md text-sm">
      Prev
    </button>
    <button className="bg-slate-500 hover:bg-gray-600 px-3 py-1 rounded-md text-sm">
      Next
    </button>
  </div>
</div>
        {villages.map((village) => (
          <VillageItem
            key={village.id}
            id={village.id}
            name={village.name}
            region={village.region}
            onAction={handleAction}
          />
        ))}

        
      </div>
    </div>
  );
};

export default VillageManagement;
