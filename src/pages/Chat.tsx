import React, { useState } from "react";
import { ChatSectionProps } from "../interfaces/chat";

type Admin = {
  name: string;
  img: string;
};

type Message = {
  sender: string;
  text: string;
};

const Chat: React.FC = () => {
  const [selectedAdmin, setSelectedAdmin] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const admins: Admin[] = [
    {
      name: "Adham",
      img: "https://th.bing.com/th/id/OIP.USP1T_5fjD1VcqeFBkbNDwHaHa?rs=1&pid=ImgDetMain",
    },
    {
      name: "Omar",
      img: "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
    },
    {
      name: "Mohammed",
      img: "https://static.vecteezy.com/system/resources/previews/023/004/539/non_2x/a-man-with-black-glasses-avatar-art-free-vector.jpg",
    },
  ];

  const filteredAdmins = admins.filter((admin) =>
    admin.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openChat = (adminName: string): void => {
    setSelectedAdmin(adminName);
    setMessages([]); // Reset messages when switching admins
  };

  const sendMessage = (): void => {
    if (message.trim()) {
      setMessages([...messages, { sender: "You", text: message }]);
      setMessage("");
    }
  };

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen p-4">
      <div className="container mx-auto">
        <Header />
        <div className="flex flex-col gap-4">
          {/* Search Section */}
          <section className="search">
            <input
              type="text"
              placeholder="Search for an admin..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input w-full text-black p-2 rounded"
            />
          </section>

          {/* Admin List */}
          <AdminList
            admins={filteredAdmins}
            openChat={openChat}
            selectedAdmin={selectedAdmin}
          />

          {/* Chat Section */}
          <div>
            {selectedAdmin ? (
              <ChatSection
                adminName={selectedAdmin}
                messages={messages}
                message={message}
                setMessage={setMessage}
                sendMessage={sendMessage}
                goBack={function (): void {
                  throw new Error("Function not implemented.");
                }}
              />
            ) : (
              <p className="text-center text-gray-400">
                Select an admin to start a chat.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Header: React.FC = () => (
  <header className="flex justify-between items-center mb-4">
    <h1 className="text-xl font-bold">Chat with Admins</h1>
  </header>
);

interface AdminListProps {
  admins: Admin[];
  openChat: (adminName: string) => void;
  selectedAdmin: string | null;
}

const AdminList: React.FC<AdminListProps> = ({
  admins,
  openChat,
  selectedAdmin,
}) => (
  <section className="bg-gray-800 p-4 rounded">
    <p className="text-lg font-semibold mb-4">Available Admins</p>
    <div className="flex gap-4 overflow-x-auto">
      {admins.map((admin) => (
        <div
          key={admin.name}
          className={`flex flex-col items-center cursor-pointer ${
            selectedAdmin === admin.name ? "bg-gray-700 p-2 rounded" : ""
          }`}
          onClick={() => openChat(admin.name)}
        >
          <img
            src={admin.img}
            alt={admin.name}
            className={`w-16 h-16 rounded-full border-2 ${
              selectedAdmin === admin.name
                ? "border-green-500"
                : "border-blue-500"
            } hover:border-blue-400`}
          />
          <span className="mt-2 text-sm text-center">{admin.name}</span>
        </div>
      ))}
    </div>
  </section>
);

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
          {msg.text}
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

export default Chat;
