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
        <div className="md:flex-1  p-6 h-full">
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
