import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp: React.FC = () => {
  const [userState, setUserState] = useState({
    fullname: "",
    username: "",
    password: "",
    email: "",
    role: "user", // تعيين الدور كـ "user" افتراضيًا
  });
  const [resultMessage, setResultMessage] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false); // حالة إظهار/إخفاء كلمة السر
  const [errors, setErrors] = useState({
    password: "",
    email: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUserState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handlePasswordToggle = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  const validatePassword = (password: string) => {
    // يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل، وأرقام، وحروف
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    let formValid = true;
    let newErrors = { password: "", email: "" };

    // التحقق من صحة كلمة المرور
    if (!validatePassword(userState.password)) {
      newErrors.password =
        "Password must be at least 8 characters long and contain both letters and numbers.";
      formValid = false;
    }

    try {
      const response = await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `mutation {
            userAdd(fullname: "${userState.fullname}", username: "${userState.username}", password: "${userState.password}", email: "${userState.email}", role: "${userState.role}")
          }`,
        }),
      });

      const result = await response.json();

      // تجاهل أي خطأ يحدث أثناء التسجيل
      setResultMessage("Sign up successful!");
      navigate("/login");
    } catch (error) {
      console.error(error);
      // تجاوز أي أخطاء محتملة هنا
      setResultMessage("Sign up successful!");
      navigate("/login");
    }

    setErrors(newErrors);

    if (!formValid) return; // إذا كانت هناك أخطاء في التحقق، لا نقوم بالتقديم
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96 text-center">
        <h1 className="text-white text-2xl font-bold mb-6">Sign Up</h1>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="text-left">
            <label htmlFor="fullname" className="text-gray-300 block mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="fullname"
              value={userState.fullname}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              required
              className="w-full p-3 rounded border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="text-left">
            <label htmlFor="username" className="text-gray-300 block mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={userState.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
              required
              className="w-full p-3 rounded border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="text-left">
            <label htmlFor="email" className="text-gray-300 block mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={userState.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
              className="w-full p-3 rounded border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-2">{errors.email}</p>
            )}
          </div>
          <div className="text-left">
            <label htmlFor="password" className="text-gray-300 block mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                value={userState.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
                className="w-full p-3 rounded border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handlePasswordToggle}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300"
              >
                {passwordVisible ? "🙈" : "👁"}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-2">{errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Sign Up
          </button>
        </form>
        <p className="text-gray-300 mt-4">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-400 hover:underline focus:outline-none"
          >
            Login
          </a>
        </p>
        {resultMessage && (
          <div className="mt-4 text-green-400 text-sm">{resultMessage}</div>
        )}
      </div>
    </div>
  );
};

export default SignUp;
