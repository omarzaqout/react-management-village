import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message); // إظهار رسالة بنجاح إرسال البريد الإلكتروني
        navigate("/login");
      } else {
        setError(data.error || "Failed to send reset email.");
      }
    } catch (error) {
      setError("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-800">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-80 text-center">
        <h1 className="text-white text-2xl font-bold mb-4">Reset Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-left">
            <label htmlFor="email" className="text-white block mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full p-2 rounded border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        <p className="text-white mt-4">
          Remembered your password?{" "}
          <a
            href="/login"
            className="text-blue-400 hover:underline focus:outline-none"
          >
            Back to login
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
