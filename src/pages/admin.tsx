import React from 'react';

const AdminPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="w-64 bg-gray-800 text-white p-6">
        <h2 className="text-2xl font-semibold mb-8">Admin Dashboard</h2>
        <ul>
          <li className="mb-4">
            <a href="#" className="hover:bg-gray-700 p-2 rounded-md">Dashboard</a>
          </li>
          <li className="mb-4">
            <a href="#" className="hover:bg-gray-700 p-2 rounded-md">Users</a>
          </li>
          <li className="mb-4">
            <a href="#" className="hover:bg-gray-700 p-2 rounded-md">Settings</a>
          </li>
          <li className="mb-4">
            <a href="#" className="hover:bg-gray-700 p-2 rounded-md">Reports</a>
          </li>
        </ul>
      </div>
      
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-semibold mb-6">Welcome to Admin Panel</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Total Users</h3>
            <p className="text-3xl font-bold">320</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Active Sessions</h3>
            <p className="text-3xl font-bold">25</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Pending Tasks</h3>
            <p className="text-3xl font-bold">10</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
