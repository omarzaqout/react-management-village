import React, { useState, useEffect } from "react";
import InputField from "./InputField";
import { PopupProps } from "../../interfaces/Village";

const Popup: React.FC<PopupProps> = ({ title, inputs, isOpen, onClose, onSubmit }) => {
  const [inputValues, setInputValues] = useState<string[]>([]);

  // عند فتح الـ popup أو إضافة مدخلات جديدة، تأكد من أن القيم محدثة بشكل صحيح
  useEffect(() => {
    if (isOpen) {
      // إذا كانت هذه حالة "add"، نقوم بتهيئة القيم كقيم فارغة
      if (title === "Add New Village") {
        const emptyValues = inputs.map((input) => input.value || "");
        setInputValues(emptyValues);
      } else {
        // إذا كانت هذه حالة "update"، نقوم بتهيئة القيم بالقيم الأولية الموجودة
        const existingValues = inputs.map((input) => input.value || "");
        setInputValues(existingValues);
      }
    }
  }, [isOpen, inputs, title]); // تحديث القيم عند تغيير المدخلات أو فتح الـ popup

  const handleChange = (index: number, value: string) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = value;
    setInputValues(newInputValues);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const newInputValues = [...inputValues];
      newInputValues[index] = file.name; // يمكنك تخزين اسم الملف أو أي خاصية أخرى حسب الحاجة
      setInputValues(newInputValues);
    }
  };

  const handleSubmit = () => {
    onSubmit(inputValues);
    onClose();
  };

  if (!isOpen) return null;

  const allInputsFilled = inputs.every((input, index) => {
    if (input.type === "file") return true; 
    return inputValues[index] && inputValues[index] !== "undefined" && inputValues[index] !== ""; 
  });

  return (
    <div className="popup fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-gray-800 p-6 rounded-md w-full max-w-[90%] sm:max-w-[60%] lg:max-w-[40%]">
        <div className="flex justify-between">
        <h2 className="text-xl text-white mb-4">{title}</h2>
        <button
          onClick={onClose}
          className=" text-white  px-4 rounded-md  mt-2"
        >
          X
        </button>
        </div>
        {inputs.map((input, index) => {
          if (input.type === undefined) {
            return <div key={index} className="text-white mb-2">{input.label}</div>;
          }

          if (input.type === "file") {
            return (
              <div key={index} className="mb-4">
                <label className="text-white">{input.label}</label>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, index)}
                  disabled={input.disabled}
                />
              </div>
            );
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

          <button
            onClick={handleSubmit}
            className="bg-indigo-500 text-white py-2 px-4 rounded-md w-full mt-4 hover:bg-indigo-600"
            style={{ display: title === "View Village" ? "none" : "block" }}
            >
            {title}
          </button>
        
      </div>
    </div>
  );
};

export default Popup;
