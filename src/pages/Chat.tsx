import React, { useEffect, useState } from "react";

interface User {
  username: string;
  fullname: string;
  role: string;
}

interface Message {
  id: string;
  sender: string;
  receiver: string;
  message: string;
}

const Chat: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const role = localStorage.getItem("role");
  const currentUserString = localStorage.getItem("user");
  const currentUser = currentUserString ? JSON.parse(currentUserString) : null;
  const currentUsername = currentUser?.username || "";

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const query = `
        query {
          getUsers {
            username
            fullname
            role
          }
        }`;

        const response = await fetch("http://localhost:5000/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        });

        const result = await response.json();
        if (result.data) {
          const allUsers: User[] = result.data.getUsers;
          const filteredUsers =
            role === "admin"
              ? allUsers
              : allUsers.filter((user) => user.role === "admin");
          setUsers(filteredUsers);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [role]);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser || !currentUsername) return;

      try {
        const query = `
        query {
          getMessages(senderUsername: "${currentUsername}", receiverUsername: "${selectedUser.username}") {
            id
            sender
            receiver
            message
          }
        }`;

        const response = await fetch("http://localhost:5000/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        });

        const result = await response.json();
        if (result.data) {
          const messagesData: Message[] = result.data.getMessages;
          setMessages(messagesData.sort((a, b) => a.id.localeCompare(b.id)));
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [selectedUser, currentUsername]);

  // Send a new message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const mutation = `
      mutation {
        sendMessage(senderUsername: "${currentUsername}", receiverUsername: "${selectedUser.username}", message: "${newMessage}")
      }`;

      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: mutation }),
      });

      const result = await response.json();
      if (result.data) {
        setMessages([
          ...messages,
          {
            id: result.data.sendMessage,
            sender: currentUsername,
            receiver: selectedUser.username,
            message: newMessage,
          },
        ]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.fullname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Image URLs for admins and users
  const getUserImage = (role: string) => {
    if (role === "admin") {
      return "https://th.bing.com/th/id/OIP.USP1T_5fjD1VcqeFBkbNDwHaHa?rs=1&pid=ImgDetMain"; // Replace with the actual admin image URL
    } else {
      return "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png"; // Replace with the actual user image URL
    }
  };

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen p-4">
      <div className="container mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Chat with Users</h1>
        </header>

        {/* Search Section */}
        <input
          type="text"
          placeholder="Search for a user..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-black p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* User List */}
        <div className="bg-gray-800 p-4 rounded mb-4">
          <p className="text-lg font-semibold mb-4">Available Users</p>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide">
            {filteredUsers.map((user) => (
              <div
                key={user.username}
                className={`flex-shrink-0 flex flex-col items-center cursor-pointer p-2 rounded transition-all duration-300 ${
                  selectedUser?.username === user.username
                    ? "border-blue-500 bg-gray-700"
                    : "border-gray-600"
                }`}
                onClick={() => setSelectedUser(user)}
              >
                <img
                  src={getUserImage(user.role)}
                  alt={user.fullname}
                  className="bg-gray-500 rounded-full w-16 h-16 mb-2 object-cover"
                />
                <span className="text-center text-sm">{user.fullname}</span>
                <span className="text-center text-sm text-red-500">
                  "{user.role}"
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Section */}
        <div className="bg-gray-800 p-4 rounded">
          {selectedUser ? (
            <>
              <header className="mb-4">
                <h2 className="text-lg font-bold">
                  Chat with: {selectedUser.fullname}
                </h2>
              </header>
              <div className="max-h-60 overflow-y-auto rounded mb-4 border border-gray-600">
                {messages.map((msg) => (
                  <p
                    key={msg.id}
                    className={`m-2 mb-2 rounded ${
                      msg.sender === currentUsername
                        ? "text-green-500"
                        : "text-blue-500"
                    }`}
                  >
                    <strong className="text-gray-500">{msg.sender}: </strong>
                    {msg.message}
                  </p>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-grow p-2 rounded text-black h-20"
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-500 w-full sm:w-auto px-4 py-2 rounded text-white"
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-400">
              Select a user to start a chat.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
