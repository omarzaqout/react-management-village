import React from "react";

interface VillageItemProps {
  id: number;
  name: string;
  region: string;
  onAction: (action: string, id: number) => void;
}

const VillageItem: React.FC<VillageItemProps> = ({ id, name, region, onAction }) => {
  return (
    <div className="flex justify-between items-center p-3 bg-gray-700 rounded-md mb-2">
      <span>
        {name} - {region}
      </span>
      <div className="flex gap-2">
        {["View", "Update Village", "Delete Village", "Update Demographic Data"].map((action) => (
          <button
            key={action}
            onClick={() => onAction(action, id)}
            className={`px-3 py-1 rounded-md text-sm ${
              action === "Delete Village"
                ? "bg-red-500 hover:bg-red-600"
                : action === "Update Demographic Data"
                ? "bg-green-500 hover:bg-green-600"
                : action === "Update Village"
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
};

export default VillageItem;
