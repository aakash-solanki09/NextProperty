import { useState } from "react";
import { loginUser } from "../../api/user/userApi";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginUser(formData);
      setShowAlert(true); // show custom alert
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  const handleAlertClose = () => {
    setShowAlert(false);
    navigate("/explore-properties");
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-4 font-urbanist">
      <div className="bg-gray-100 shadow-xl p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-3 rounded border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 rounded border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            Login
          </button>
        </form>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </div>

      {/* ✅ Custom Alert Modal */}
      {showAlert && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white border border-blue-500 text-black rounded-lg shadow-xl p-6 w-80 text-center">
            <h2 className="text-xl font-semibold text-blue-600 mb-4">Login Successful!</h2>
            <button
              onClick={handleAlertClose}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
