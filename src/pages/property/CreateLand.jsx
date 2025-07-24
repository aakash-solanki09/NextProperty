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
    buildUpArea: ""
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
    "border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400";

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-xl p-6 mt-6 rounded-2xl">
      <h2 className="text-xl font-semibold mb-4">Add Property</h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      {success && <p className="text-green-600 mb-3">{success}</p>}

      <form onSubmit={handleSubmit} className="grid gap-4">
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


      
            <input
              type="number"
              name="bhk"
              placeholder="BHK"
              className={inputStyle}
              value={formData.bhk}
              onChange={handleChange}
            />


        {formData.listingType === "sale" && (
          <>
            <input
              type="number"
              name="carpetArea"
              placeholder="Carpet Area (sq ft)"
              className={inputStyle}
              value={formData.carpetArea}
              onChange={handleChange}
            />

          </>
        )}
        <input
          type="number"
          name="buildUpArea"
          placeholder="Build-Up Area (sq ft)"
          className={inputStyle}
          value={formData.buildUpArea}
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
        <input
          type="text"
          name="location"
          placeholder="Location"
          className={inputStyle}
          value={formData.location}
          onChange={handleChange}
        />


        {/* Image Upload */}
        <div className="relative">
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-xl p-4 cursor-pointer hover:border-blue-500 transition"
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

          <div className="grid grid-cols-2 gap-2 mt-3">
            {imagePreviews.map((src, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={src}
                  alt={`Preview ${idx}`}
                  className="rounded-xl h-32 object-cover w-full border"
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

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl mt-2"
          disabled={loading}
        >
          {loading ? "Creating..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default CreateLand;
