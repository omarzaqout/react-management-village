import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Use Routes instead of Switch
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './pages/Dashboard';
import VillageManagement from './pages/VillageManagement';
import Chat from './pages/Chat';
import Gallery from './pages/Gallery';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 bg-gray-100 p-6">
          <Routes> {/* Use Routes instead of Switch */}
            {/* Default Route */}
            <Route path="/" element={<Dashboard />} /> {/* Use element prop */}
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
