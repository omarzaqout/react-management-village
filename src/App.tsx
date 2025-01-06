import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./pages/Dashboard";
import VillageManagement from "./pages/VillageManagement";
import Chat from "./pages/Chat";
import Gallery from "./pages/Gallery";
import LoginPage from "./pages/LoginPage";
import SignUp from "./pages/SignUp";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";


const App: React.FC = () => {
  const location = useLocation();
  const hideSidebarRoutes = ["/login", "/signup"];

  return (
    <div className="flex">
      {!hideSidebarRoutes.includes(location.pathname) && <Sidebar />}{" "}
      <div className="flex-1 bg-gray-900 p-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/village-management" element={<VillageManagement />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Routes>
      </div>
    </div>
  );
};

const WrappedApp: React.FC = () => (
  <Router>
    <App />
  </Router>
);

export default WrappedApp;
