import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPropertyById, updateProperty } from "../../api/property/propertyApi";

const UpdateLand = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    typeOfProperty: "",
    location: "",
    price: "",
    contactNumber: ""
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPropertyById(id);
        setFormData({
          title: data.title || "",
          description: data.description || "",
          typeOfProperty: data.typeOfProperty || "",
          location: data.location || "",
          price: data.price || "",
          contactNumber: data.contactNumber || ""
        });
      } catch (err) {
        setError("Failed to load property");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      if (image) data.append("image", image);

      await updateProperty(id, data);
      navigate("/my-properties");
    } catch (err) {
      setError("Update failed. Please try again.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="relative max-w-2xl mx-auto bg-white shadow-xl p-6 mt-8 rounded-2xl">
      {/* Top Right Close Button */}
      <button
        onClick={() => navigate("/my-properties")}
        className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl font-bold"
      >
        ×
      </button>

      <h2 className="text-2xl font-semibold mb-4">Update Property</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          className="border border-gray-300 rounded-lg px-3 py-2"
          value={formData.title}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          className="border border-gray-300 rounded-lg px-3 py-2"
          value={formData.description}
          onChange={handleChange}
        />
        <select
  name="typeOfProperty"
  className="border border-gray-300 rounded-lg px-3 py-2"
  value={formData.typeOfProperty}
  onChange={handleChange}
>
  <option value="">Select Property Type</option>
  <option value="Flats">Flats</option>
  <option value="Builder Floors">Builder Floors</option>
  <option value="House Villas">House Villas</option>
  <option value="Plots">Plots</option>
  <option value="Farmhouses">Farmhouses</option>
  <option value="Hotels">Hotels</option>
  <option value="Lands">Lands</option>
  <option value="Office Spaces">Office Spaces</option>
  <option value="Hostels">Hostels</option>
  <option value="Shops Showrooms">Shops Showrooms</option>
</select>

        <input
          type="text"
          name="location"
          placeholder="Location"
          className="border border-gray-300 rounded-lg px-3 py-2"
          value={formData.location}
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          className="border border-gray-300 rounded-lg px-3 py-2"
          value={formData.price}
          onChange={handleChange}
        />
        <input
          type="text"
          name="contactNumber"
          placeholder="Contact Number"
          className="border border-gray-300 rounded-lg px-3 py-2"
          value={formData.contactNumber}
          onChange={handleChange}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="border border-gray-300 rounded-lg px-3 py-2"
        />

        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={() => navigate("/my-properties")}
            className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-xl"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateLand;
