import React from "react";

interface User {
  id: string;
  username: string;
  fullname: string;
  role: string;
}

interface UserListProps {
  users: User[];
  selectedUser: User | null;
  onSelect: (user: User) => void;
}

const UserList: React.FC<UserListProps> = ({ users, selectedUser, onSelect }) => {
  return (
    <div className="bg-gray-700 rounded-lg p-4 mb-6">
      <h2 className="text-xl font-bold text-white mb-4">Available Users</h2>
      <div className="flex flex-wrap gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className={`p-3 rounded-lg cursor-pointer ${
              selectedUser?.username === user.username
                ? "bg-blue-500 scale-105"
                : "bg-gray-600"
            }`}
            onClick={() => onSelect(user)}
          >
            <span className="text-white">{user.fullname}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
