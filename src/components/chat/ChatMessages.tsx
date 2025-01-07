import React from "react";

interface Message {
  id: string;
  sender: string;
  receiver: string;
  message: string;
}

interface ChatMessagesProps {
  messages: Message[];
  currentUsername: string;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, currentUsername }) => {
  return (
    <div className="flex-grow p-4 h-96 overflow-y-auto bg-gray-800 border-2 border-gray-600 rounded-md mb-4">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`p-2 rounded-lg mb-3 ${
            msg.sender === currentUsername ? "bg-blue-500 ml-auto" : "bg-gray-600"
          }`}
        >
          <strong>{msg.sender}: </strong> {msg.message}
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
