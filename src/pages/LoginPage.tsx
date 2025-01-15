import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  const togglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      setLoginError("Please enter both username and password.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/graphql", {
        query: `
          query {
            userLogin(username: "${username}", password: "${password}") {
              success
              user {
                username
                role
              }
              message
            }

          }
        `,
      });

      const { success, message, user, role } = response.data.data.userLogin;

      if (success) {
        localStorage.setItem("user", JSON.stringify(user)); // Store entire user object
        localStorage.setItem("role", user.role);

        // Redirect based on user role
        // if (user.role === "admin") {
        //   navigate("/signup"); // Redirect to admin dashboard /// عدلها ل الادمن
        // } else {
        //   navigate("/user-dashboard"); // Redirect to user dashboard
        // }
        navigate("/Overview");
      } else {
        setLoginError(message); // Show error message if login fails
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("An error occurred while logging in. Please try again.");
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password"); // Navigate to a password reset page
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-800">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-80 text-center">
        <h1 className="text-white text-2xl font-bold mb-4">Login</h1>
        {loginError && <p className="text-red-500">{loginError}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="text-left">
            <label htmlFor="username" className="text-white block mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          <button
            onClick={handleForgotPassword}
            className="text-blue-400 hover:underline focus:outline-none"
          >
            Forgot Password?
          </button>
        </p>
        <p className="text-white mt-4">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-blue-400 hover:underline focus:outline-none"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
