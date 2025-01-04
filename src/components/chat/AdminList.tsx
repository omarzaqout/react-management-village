import React from "react";

type AdminListProps = {
  admins: string[];
  openChat: (adminName: string) => void;
  selectedAdmin: string | null;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
};

const AdminList: React.FC<AdminListProps> = ({
  admins,
  openChat,
  selectedAdmin,
  searchQuery,
  setSearchQuery,
}) => (
  <section className="bg-gray-800 p-4 rounded">
    <p className="text-lg font-semibold mb-4">Available Admins</p>

    {/* Search Input */}
    <input
      type="text"
      placeholder="Search for an admin..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="search-input w-full text-black p-2 rounded mb-4"
    />

    <div className="flex gap-4 overflow-x-auto">
      {admins
        .filter((admin) =>
          admin.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map((admin) => (
          <div
            key={admin}
            className={`flex flex-col items-center cursor-pointer ${
              selectedAdmin === admin ? "bg-gray-700 p-2 rounded" : ""
            }`}
            onClick={() => openChat(admin)}
          >
            <img
              src={
                admin === "Adham"
                  ? "https://th.bing.com/th/id/OIP.USP1T_5fjD1VcqeFBkbNDwHaHa?rs=1&pid=ImgDetMain"
                  : admin === "Omar"
                  ? "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png"
                  : "https://static.vecteezy.com/system/resources/previews/023/004/539/non_2x/a-man-with-black-glasses-avatar-art-free-vector.jpg"
              }
              alt={admin}
              className={`w-16 h-16 rounded-full border-2 ${
                selectedAdmin === admin ? "border-green-500" : "border-blue-500"
              } hover:border-blue-400`}
            />
            <span className="mt-2 text-sm text-center">{admin}</span>
          </div>
        ))}
    </div>
  </section>
);

export default AdminList;
