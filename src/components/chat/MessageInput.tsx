import React from "react";

interface MessageInputProps {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ message, setMessage, sendMessage }) => {
  return (
    <div className="flex mt-4">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-grow bg-gray-600 text-gray-200 rounded-md py-3 px-4"
      />
      <button
        onClick={sendMessage}
        className="bg-blue-600 text-white font-bold py-3 px-6 rounded ml-4"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
