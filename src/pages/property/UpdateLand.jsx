import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPropertyById, updateProperty } from "../../api/property/propertyApi";
import { Upload } from "lucide-react"; // Make sure this package is installed

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
  const [imagePreview, setImagePreview] = useState(null);
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
        if (data.image) {
          setImagePreview(data.image);
        }
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
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
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

  const inputStyle =
    "border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400";

  return (
    <div className="relative max-w-2xl mx-auto bg-white shadow-xl p-6 mt-6 rounded-2xl">
      {/* Top Right Close Button */}
      <button
        onClick={() => navigate("/my-properties")}
        className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl font-bold"
      >
        ×
      </button>

      <h2 className="text-xl font-semibold mb-4">Update Property</h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          className={inputStyle}
          value={formData.title}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          className={inputStyle}
          value={formData.description}
          onChange={handleChange}
        />
        <select
          name="typeOfProperty"
          className={inputStyle}
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
          className={inputStyle}
          value={formData.location}
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          className={inputStyle}
          value={formData.price}
          onChange={handleChange}
        />
        <input
          type="text"
          name="contactNumber"
          placeholder="Contact Number"
          className={inputStyle}
          value={formData.contactNumber}
          onChange={handleChange}
        />

        {/* Updated Image Upload UI */}
        <div className="relative">
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-xl p-4 cursor-pointer hover:border-blue-500 transition"
          >
            <Upload className="w-6 h-6 text-blue-600 mb-2" />
            <span className="text-sm text-gray-600">Click to upload an image</span>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-3 rounded-xl h-40 object-cover w-full border"
            />
          )}
        </div>

        <div className="flex justify-between mt-3">
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
