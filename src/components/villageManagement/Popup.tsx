import React, { useState, useEffect } from "react";
import InputField from "./InputField"; 
import { PopupProps } from "../../interfaces/Village";



const Popup: React.FC<PopupProps> = ({ title, inputs, isOpen, onClose, onSubmit }) => {
  const [inputValues, setInputValues] = useState<string[]>([]);

  useEffect(() => {
    setInputValues(inputs.map((input) => input.value || ""));
  }, [inputs]);

  const handleChange = (index: number, value: string) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = value;
    setInputValues(newInputValues);
  };

  const handleSubmit = () => {
    onSubmit(inputValues);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="popup fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-gray-800 p-6 rounded-md w-full max-w-[90%] sm:max-w-[60%] lg:max-w-[40%]">
        <h2 className="text-xl text-white mb-4">{title}</h2>
        <button
          onClick={onClose}
          className="bg-red-500 text-white py-2 px-4 rounded-md w-full mt-2 hover:bg-red-600"
        >
          X
        </button>

        {inputs.map((input, index) => {
          if (input.type === undefined) {
            return <div key={index} className="text-white mb-2">{input.label}</div>;
          }

          return (
            <InputField
              key={index}
              label={input.label}
              type={input.type || "text"}
              value={inputValues[index]}
              placeholder={input.placeholder}
              onChange={(value) => handleChange(index, value)}
              disabled={input.disabled}
            />
          );
        })}

        {inputs.length > 0 && inputs[0].type !== undefined && (
          <button
            onClick={handleSubmit}
            className="bg-indigo-500 text-white py-2 px-4 rounded-md w-full mt-4 hover:bg-indigo-600"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default Popup;
