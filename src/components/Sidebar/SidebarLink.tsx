import React from 'react';
import { Link, NavLink } from 'react-router-dom';

type SidebarProps = {
  icon: string;
  label: string;
  to: string;
  isOpen: boolean;
};

const SidebarLink: React.FC<SidebarProps> = ({ icon, label, to, isOpen }) => {
  return (
    <NavLink
      to={to}
      className="flex items-center space-x-4 cursor-pointer hover:bg-gray-700 p-2 rounded-md "
    >
      <span className="text-xl">{icon}</span>
      {isOpen && <span>{label}</span>}
    </NavLink>
  );
};

export default SidebarLink;
