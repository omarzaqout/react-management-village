import React, { useState } from 'react';
import SidebarLink from './SidebarLink';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <div
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-gray-800 h-screen p-4 text-white duration-300 flex flex-col justify-between`}
    >
      <div>
        <button
          className="mb-6 text-xl focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? '←' : '☰'}
        </button>
        <div className="flex flex-col space-y-4">
          <SidebarLink icon="🏠" label="Overview" to="/overview" isOpen={isOpen} />
          <SidebarLink icon="📋" label="Village Management" to="/village-management" isOpen={isOpen} />
          <SidebarLink icon="💬" label="Chat" to="/chat" isOpen={isOpen} />
          <SidebarLink icon="🖼️" label="Gallery" to="/gallery" isOpen={isOpen} />
        </div>
      </div>
      <div className="flex items-center space-x-4 p-2 hover:bg-gray-700 rounded-md cursor-pointer">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">40x40</span>
          </div>
          {isOpen && <span className="ml-2">Admin Name</span>}
        </div>
        {isOpen && <button className="text-red-500">Logout</button>}
      </div>
    </div>
  );
};

export default Sidebar;
