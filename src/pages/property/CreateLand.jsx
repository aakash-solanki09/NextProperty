import React, { useState } from "react";
import { createProperty } from "../../api/property/propertyApi";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";

const CreateLand = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    typeOfProperty: "",
    listingType: "",
    location: "",
    price: "",
    bhk: "",
    area: "",
    carpetArea: "",
    buildUpArea: "",
    furnishedType: "" // Added furnishedType
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const combined = [...images, ...newFiles];

    if (combined.length > 5) {
      setError("You can upload a maximum of 5 images.");
      return;
    }

    setImages(combined);
    setImagePreviews(combined.map((file) => URL.createObjectURL(file)));
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    setImagePreviews(newImages.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const { title, description, typeOfProperty, listingType, location, price } = formData;
    if (!title || !description || !typeOfProperty || !listingType || !location || !price) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== "") data.append(key, value);
      });
      images.forEach((file) => data.append("images", file));

      await createProperty(data);
      setSuccess("Property created successfully!");
      navigate("/explore-properties");
    } catch (err) {
      setError(err.message || "Failed to create property");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition";
  return (
    <div className="max-w-2xl mx-auto bg-white shadow-xl p-6 mt-6 rounded-2xl">
      <h2 className="text-xl font-semibold mb-4">Add Property</h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      {success && <p className="text-green-600 mb-3">{success}</p>}
<form onSubmit={handleSubmit} className="space-y-5">

  {/* Property Type */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
    <select
      name="typeOfProperty"
      className={inputStyle}
      value={formData.typeOfProperty}
      onChange={handleChange}
    >
      <option value="">Select Property Type</option>
      <option value="Flat">Flat</option>
      <option value="House">House</option>
      <option value="Apartment">Apartment</option>
    </select>
  </div>

  {/* Listing Type */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Listing Type</label>
    <select
      name="listingType"
      className={inputStyle}
      value={formData.listingType}
      onChange={handleChange}
    >
      <option value="">Select Listing Type</option>
      <option value="sale">For Sale</option>
      <option value="rent">For Rent</option>
    </select>
  </div>

  {/* BHK */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">BHK</label>
    <input
      type="number"
      name="bhk"
      placeholder="e.g. 2"
      className={inputStyle}
      value={formData.bhk}
      onChange={handleChange}
    />
  </div>

  {/* Carpet Area - only if listingType is sale */}
  {formData.listingType === "sale" && (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Carpet Area (sq ft)</label>
      <input
        type="number"
        name="carpetArea"
        placeholder="Carpet Area"
        className={inputStyle}
        value={formData.carpetArea}
        onChange={handleChange}
      />
    </div>
  )}

  {/* Build-Up Area */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Build-Up Area (sq ft)</label>
    <input
      type="number"
      name="buildUpArea"
      placeholder="Build-Up Area"
      className={inputStyle}
      value={formData.buildUpArea}
      onChange={handleChange}
    />
  </div>

  {/* Furnished Type */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Furnishing</label>
    <select
      name="furnishedType"
      className={inputStyle}
      value={formData.furnishedType}
      onChange={handleChange}
    >
      <option value="">Select Furnishing</option>
      <option value="furnished">Furnished</option>
      <option value="semi-furnished">Semi-Furnished</option>
      <option value="unfurnished">Unfurnished</option>
    </select>
  </div>

 {/* Location */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
    <input
      type="text"
      name="location"
      placeholder="Enter location"
      className={inputStyle}
      value={formData.location}
      onChange={handleChange}
    />
  </div>

  {/* Price */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
    <input
      type="number"
      name="price"
      placeholder="Enter price"
      className={inputStyle}
      value={formData.price}
      onChange={handleChange}
    />
  </div>

  {/* Title */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
    <input
      type="text"
      name="title"
      placeholder="Enter title"
      className={inputStyle}
      value={formData.title}
      onChange={handleChange}
    />
  </div>

  {/* Description */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
    <textarea
      name="description"
      placeholder="Write a short description..."
      className={`${inputStyle} h-28 resize-none`}
      value={formData.description}
      onChange={handleChange}
    />
  </div>

 

  {/* Image Upload */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images</label>
    <label
      htmlFor="image-upload"
      className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-5 cursor-pointer hover:border-blue-500 transition"
    >
      <Upload className="w-6 h-6 text-blue-600 mb-2" />
      <span className="text-sm text-gray-600">Upload up to 5 images</span>
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        className="hidden"
      />
    </label>

    {/* Preview */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
      {imagePreviews.map((src, idx) => (
        <div key={idx} className="relative group">
          <img
            src={src}
            alt={`Preview ${idx}`}
            className="rounded-lg h-28 object-cover w-full border"
          />
          <button
            type="button"
            onClick={() => handleRemoveImage(idx)}
            className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full px-1 opacity-0 group-hover:opacity-100 transition"
            title="Remove image"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  </div>

  {/* Submit Button */}
  <div className="text-right">
    <button
      type="submit"
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-sm"
      disabled={loading}
    >
      {loading ? "Submitting..." : "Submit"}
    </button>
  </div>
</form>


    </div>
  );
};

export default CreateLand;
