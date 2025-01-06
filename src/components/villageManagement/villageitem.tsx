import React from "react";
import { VillageItemProps } from "../../interfaces/Village";

const VillageItem: React.FC<VillageItemProps> = ({
  id,
  name,
  region,
  onAction,
}) => {
  return (
    <div className="flex justify-between items-center p-3 bg-gray-700 rounded-md mb-2">
      <span>
        {name} - {region}
      </span>
      <div className="flex gap-2">
        {[
          "View",
          "Update Village",
          "Delete Village",
          "Update Demographic Data",
        ].map((action) => (
          <button
            key={action}
            onClick={() => onAction(action, id)}
            className={`px-3 py-1 rounded-md text-sm bg-slate-500`}
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
};


export default VillageItem;
