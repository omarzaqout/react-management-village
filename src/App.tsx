import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './pages/Dashboard';
import VillageManagement from './pages/VillageManagement';
import Chat from './pages/Chat';
import Gallery from './pages/Gallery';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex ">
        <Sidebar />
        <div className="flex-1 bg-gray-900 p-6">
          <Routes> 
            <Route path="/" element={<Dashboard />} /> 
            <Route path="/village-management" element={<VillageManagement />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/gallery" element={<Gallery />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
  
};


export default App;
