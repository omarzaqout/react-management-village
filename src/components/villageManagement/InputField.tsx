import React from "react";
import { InputFieldProps } from "../../interfaces/Village";


const InputField: React.FC<InputFieldProps> = ({ label, type, value, onChange,placeholder,disabled}) => {
  return (
    <div className="mb-1">
      <label htmlFor={label} className="block text-sm font-medium text-white">
        {label}
      </label>
      <input
        type={type}
        id={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"

      />
    </div>
  );
};

export default InputField;
