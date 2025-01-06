import React from "react";

type Message = {
  sender: string;
  text: string;
  timestamp: string;
};

type ChatSectionProps = {
  adminName: string;
  messages: Message[];
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: () => void;
};

const ChatSection: React.FC<ChatSectionProps> = ({
  adminName,
  messages,
  message,
  setMessage,
  sendMessage,
}) => (
  <section className="bg-gray-800 p-4 rounded">
    <header className="mb-4">
      <h2 className="text-lg font-bold">Chat with: {adminName}</h2>
    </header>
    <div className="chatMessages max-h-60 overflow-y-auto bg-gray-700 p-4 rounded mb-4">
      {messages.map((msg, index) => (
        <p key={index}>
          <strong>{msg.sender}: </strong>
          {msg.text} ({new Date(msg.timestamp).toLocaleTimeString()})
        </p>
      ))}
    </div>
    <footer className="flex flex-col">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="resize-none p-2 rounded bg-gray-100 text-gray-800 mb-2"
      ></textarea>
      <button
        onClick={sendMessage}
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
      >
        Send
      </button>
    </footer>
  </section>
);

export default ChatSection;
