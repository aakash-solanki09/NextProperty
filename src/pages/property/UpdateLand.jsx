import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPropertyById, updateProperty } from "../../api/property/propertyApi";
import { Upload } from "lucide-react";

const UpdateLand = () => {
  const { id } = useParams();
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
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await getPropertyById(id);
        setFormData({
          title: data.title || "",
          description: data.description || "",
          typeOfProperty: data.typeOfProperty || "",
          listingType: data.listingType || "",
          location: data.location || "",
          price: data.price || "",
          bhk: data.bhk || "",
          area: data.area || "",
          carpetArea: data.carpetArea || "",
          buildUpArea: data.buildUpArea || "",
        });
        if (Array.isArray(data.images)) {
          setExistingImages(data.images);
        }
      } catch (err) {
        setError("Failed to load property.");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setNewImages(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleRemoveExistingImage = (url) => {
    setExistingImages((prev) => prev.filter((img) => img !== url));
    setImagesToRemove((prev) => [...prev, url]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const { title, description, typeOfProperty, listingType, location, price } = formData;
    if (!title || !description || !typeOfProperty || !listingType || !location || !price) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setSubmitting(true);
      const data = new FormData();

      // Always required
      data.append("title", title);
      data.append("description", description);
      data.append("typeOfProperty", typeOfProperty);
      data.append("listingType", listingType);
      data.append("location", location);
      data.append("price", price);

      // Conditionally append
      if (formData.bhk) data.append("bhk", formData.bhk);
      if (formData.area) data.append("area", formData.area);
      if (listingType === "Sell") {
        if (formData.carpetArea) data.append("carpetArea", formData.carpetArea);
        if (formData.buildUpArea) data.append("buildUpArea", formData.buildUpArea);
      }

      newImages.forEach((file) => data.append("images", file));
      imagesToRemove.forEach((url) => data.append("imagesToRemove", url));
      existingImages.forEach((url) => data.append("existingImages", url));

      await updateProperty(id, data);
      navigate("/explore-properties");
    } catch (err) {
      setError("Update failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  const inputStyle =
    "border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400";

  return (
    <div className="relative max-w-2xl mx-auto bg-white shadow-xl p-6 mt-6 rounded-2xl">
      <button
        onClick={() => navigate("/explore-properties")}
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

        <select
          name="listingType"
          className={inputStyle}
          value={formData.listingType}
          onChange={handleChange}
        >
          <option value="">Select Listing Type</option>
          <option value="Sell">Sell</option>
          <option value="Rent">Rent</option>
        </select>

        {(formData.listingType === "Rent" || formData.listingType === "Sell") && (
          <>
            <input
              type="number"
              name="bhk"
              placeholder="BHK (optional)"
              className={inputStyle}
              value={formData.bhk}
              onChange={handleChange}
            />
            <input
              type="text"
              name="area"
              placeholder="Area (e.g. 1200 sqft)"
              className={inputStyle}
              value={formData.area}
              onChange={handleChange}
            />
          </>
        )}

        {formData.listingType === "Sell" && (
          <>
            <input
              type="text"
              name="carpetArea"
              placeholder="Carpet Area (optional)"
              className={inputStyle}
              value={formData.carpetArea}
              onChange={handleChange}
            />
            <input
              type="text"
              name="buildUpArea"
              placeholder="Built-up Area (optional)"
              className={inputStyle}
              value={formData.buildUpArea}
              onChange={handleChange}
            />
          </>
        )}

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

        <div className="relative">
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-xl p-4 cursor-pointer hover:border-blue-500 transition"
          >
            <Upload className="w-6 h-6 text-blue-600 mb-2" />
            <span className="text-sm text-gray-600">
              Upload up to 5 new images (optional)
            </span>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mt-3">
              {imagePreviews.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`New Preview ${idx}`}
                  className="rounded-xl h-32 object-cover w-full border"
                />
              ))}
            </div>
          )}

          {imagePreviews.length === 0 && existingImages.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mt-3">
              {existingImages.map((url, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={url}
                    alt={`Existing ${idx}`}
                    className="rounded-xl h-32 object-cover w-full border"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(url)}
                    className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full px-1 opacity-0 group-hover:opacity-100 transition"
                    title="Remove image"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-between mt-3">
          <button
            type="button"
            onClick={() => navigate("/explore-properties")}
            className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-xl"
            disabled={submitting}
          >
            {submitting ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateLand;
