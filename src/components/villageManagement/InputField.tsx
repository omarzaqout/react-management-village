import React from "react";

interface InputFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
}

const InputField: React.FC<InputFieldProps> = ({ label, type, value, onChange }) => {
  return (
    <div className="mb-4">
      <label htmlFor={label} className="block text-sm font-medium text-white">
        {label}
      </label>
      <input
        type={type}
        id={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
      />
    </div>
  );
};

export default InputField;
