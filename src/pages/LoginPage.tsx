import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const togglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    
    navigate("/");
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-800">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-80 text-center">
        <h1 className="text-white text-2xl font-bold mb-4">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="text-left">
            <label htmlFor="username" className="text-white block mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              required
              className="w-full p-2 rounded border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="text-left">
            <label htmlFor="password" className="text-white block mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                required
                className="w-full p-2 rounded border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring focus:ring-blue-500"
              />
              <span
                onClick={togglePassword}
                className="absolute right-3 top-2/4 transform -translate-y-2/4 cursor-pointer text-gray-400 hover:text-gray-200"
              >
                {passwordVisible ? "🙈" : "👁️"}
              </span>
            </div>
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Login
          </button>
        </form>
        <p className="text-white mt-4">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-blue-400 hover:underline focus:outline-none"
          >
            Sign up
          </a>
        </p>
        <p className="text-white mt-2">
          Forgot your password?{" "}
          <button
            onClick={handleForgotPassword}
            className="text-blue-400 hover:underline focus:outline-none"
          >
            Reset it here
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
