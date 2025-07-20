import React, { useState } from "react";
import { createProperty } from "../../api/property/propertyApi";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react"; // Make sure this is installed

const CreateLand = () => {
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
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    setError(null);
    setSuccess(null);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      if (image) data.append("image", image);
      await createProperty(data);
      setSuccess("Property created successfully!");
      navigate("/my-properties");
    } catch (err) {
      setError(err.message);
    }
  };

  const inputStyle =
    "border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400";

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-xl p-6 mt-6 rounded-2xl">
      <h2 className="text-xl font-semibold mb-4">Create Property</h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      {success && <p className="text-green-600 mb-3">{success}</p>}
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

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl mt-2"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateLand;
