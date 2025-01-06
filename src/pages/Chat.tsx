import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminList from "../components/chat/AdminList";
import ChatSection from "../components/chat/ChatSection";

type Message = {
  sender: string;
  text: string;
  adminName: string;
  timestamp: string;
};

const Chat: React.FC = () => {
  const [selectedAdmin, setSelectedAdmin] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    if (selectedAdmin) {
      axios
        .post("http://localhost:5000/graphql", {
          query: `
            query {
              getMessages(adminName: "${selectedAdmin}") {
                sender
                text
                timestamp
              }
            }
          `,
        })
        .then((response) => setMessages(response.data.data.getMessages))
        .catch((error) => console.error("Error fetching messages:", error));
    }
  }, [selectedAdmin]);

  const sendMessage = () => {
    if (message.trim() && selectedAdmin) {
      axios
        .post("http://localhost:5000/graphql", {
          query: `
            mutation {
              addMessage(sender: "You", text: "${message}", adminName: "${selectedAdmin}") {
                sender
                text
                timestamp
              }
            }
          `,
        })
        .then((response) => {
          setMessages([...messages, response.data.data.addMessage]);
          setMessage("");
        })
        .catch((error) => console.error("Error sending message:", error));
    }
  };

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen p-4">
      <div className="container mx-auto">
        <Header />
        <div className="flex flex-col gap-4">
        

          {/* Admin List */}
          <AdminList
            admins={["Adham", "Omar", "Mohammed"]} // Replace with actual admin data
            openChat={setSelectedAdmin}
            selectedAdmin={selectedAdmin}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
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

export default Chat;
