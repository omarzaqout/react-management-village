import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarLink from "./SidebarLink";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [userName, setUserName] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false); // حالة للتحقق من الدور
  const navigate = useNavigate();

  const currentUserString = localStorage.getItem("user");
  const currentUser = currentUserString ? JSON.parse(currentUserString) : null;
  const storedUserName = currentUser?.username || "";
  const storedRole = currentUser?.role || "user"; // دور المستخدم (افتراضي: user)

  // استخدام useEffect لجلب بيانات المستخدم عند تحميل الصفحة
  useEffect(() => {
    if (storedUserName) {
      setUserName(storedUserName);
    }
    if (storedRole === "admin") {
      setIsAdmin(true); // تحديث حالة الدور
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user"); // إزالة بيانات المستخدم عند تسجيل الخروج
    navigate("./login");
  };

  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-20"
      } bg-gray-800 h-screen p-4 text-white duration-300 flex flex-col justify-between`}
    >
      <div>
        <button
          className="mb-6 text-xl focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "←" : "☰"}
        </button>
        <div className="flex flex-col space-y-4">
          <SidebarLink icon="🏠" label="Overview" to="/" isOpen={isOpen} />
          <SidebarLink
            icon="📋"
            label="Village Management"
            to="/village-management"
            isOpen={isOpen}
          />
          <SidebarLink icon="💬" label="Chat" to="/chat" isOpen={isOpen} />
          <SidebarLink
            icon="🖼️"
            label="Gallery"
            to="/gallery"
            isOpen={isOpen}
          />
        </div>
      </div>
      <div className="flex items-center space-x-4 p-2 hover:bg-gray-700 rounded-md cursor-pointer">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center">
            <img
              src={
                isAdmin
                  ? "https://th.bing.com/th/id/OIP.USP1T_5fjD1VcqeFBkbNDwHaHa?rs=1&pid=ImgDetMain"
                  : "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png"
              }
              alt={isAdmin ? "Admin Avatar" : "User Avatar"}
              className="w-10 h-10 rounded-full"
            />
          </div>
          {isOpen && <span className="ml-2">{userName || "User"}</span>}
        </div>
        {isOpen && (
          <button className="text-red-500" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
