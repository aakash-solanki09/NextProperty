import { useEffect, useState } from "react";
import { getUserProfile } from "../../api/user/userApi";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getUserProfile();
        const userData = response.user ? response.user : response;
        setUser(userData);
        console.log("User profile fetched:", userData);
      } catch (err) {
        console.error("Failed to fetch profile", err);
        setError("Failed to load profile. Please try again.");
      }
    };

    fetchProfile();
  }, []);

  if (error) {
    return (
      <div className="p-6 text-red-500 text-center font-semibold">
        {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 text-gray-500 text-center">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-20 px-4 py-6 bg-white shadow-md rounded-lg font-urbanist">
      <h2 className="text-2xl font-bold mb-6 text-blue-900">User Profile</h2>

      <div className="space-y-4 text-gray-700">
        <div>
          <strong>Name:</strong> {user.name}
        </div>
        <div>
          <strong>Email:</strong> {user.email}
        </div>
        {/* Hide 'Created At' for admin */}
        {user.role !== "admin" && (
          <div>
            <strong>Created At:</strong>{" "}
            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
          </div>
        )}
        <div>
          <strong>Role :</strong> {user.role === "admin" ? "Admin" : "Buyer / Seller"}
        </div>
      </div>

      {/* Show created ads only if user is NOT admin */}
      {user.role !== "admin" && user.properties && user.properties.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4 text-blue-800">Your Created Ads</h3>
          <ul className="space-y-2 list-disc list-inside text-gray-600">
            {user.properties.map((property) => (
              <li key={property._id}>
                {property.title} – ₹{property.price.toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
