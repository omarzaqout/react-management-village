import React from "react";
import { VillageItemProps } from "../../interfaces/Village";

const VillageItem: React.FC<VillageItemProps> = ({ id, name, region, onAction }) => {
  return (
    <div className="p-4 bg-gray-700 rounded-md  flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <span className="text-sm text-white mb-2 sm:mb-0">
        {name} - {region}
      </span>
      <div className="flex gap-2 flex-wrap sm:flex-nowrap">
        {["View", "Update Village", "Delete Village", "Update Demographic Data"].map((action) => (
          <button
            key={action}
            onClick={() => onAction(action, id)}
            className="px-3 py-2 rounded-md text-xs sm:text-sm bg-slate-500 hover:bg-slate-600 mb-2 sm:mb-0 w-full sm:w-auto"
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
};

export default VillageItem;