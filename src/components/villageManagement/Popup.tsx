// Popup.tsx
import React, { useState } from "react";
import InputField from "./InputField"; // استيراد مكون InputField

interface PopupProps {
  title: string;
  inputs: { label: string; type: string; value: string }[];
  isOpen: boolean; // إضافة isOpen هنا
  onClose: () => void;
  onSubmit: (values: string[]) => void;
}

const Popup: React.FC<PopupProps> = ({ title, inputs, isOpen, onClose, onSubmit }) => {
  const [inputValues, setInputValues] = useState<string[]>(
    inputs.map((input) => input.value)
  );

  const handleChange = (index: number, value: string) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = value;
    setInputValues(newInputValues);
  };

  const handleSubmit = () => {
    onSubmit(inputValues);
    onClose();
  };

  if (!isOpen) return null; // إذا كانت isOpen=false لا نعرض الـ Popup

  return (
    <div className="popup fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-gray-800 p-6 rounded-md w-full sm:w-1/3">
        <h2 className="text-xl text-white mb-4">{title}</h2>
        {inputs.map((input, index) => (
          <InputField
            key={index}
            label={input.label}
            type={input.type}
            value={inputValues[index]}
            onChange={(value) => handleChange(index, value)}
          />
        ))}
        <button
          onClick={handleSubmit}
          className="bg-indigo-500 text-white py-2 px-4 rounded-md w-full mt-4"
        >
          Submit
        </button>
        <button
          onClick={onClose}
          className="bg-red-500 text-white py-2 px-4 rounded-md w-full mt-2"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Popup;
