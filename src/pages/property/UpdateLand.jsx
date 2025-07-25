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
    mobileNum: "",
    landmark: ""
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
          carpetArea: data.carpetArea || "",
          buildUpArea: data.buildUpArea || "",
          mobileNum: data.mobileNum || "",
          landmark: data.landmark || ""
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

    const { title, description, typeOfProperty, listingType, location, price, mobileNum, landmark } = formData;
    if (!title || !description || !typeOfProperty || !listingType || !location || !price || !mobileNum || !landmark) {
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
      data.append("mobileNum", mobileNum);
      data.append("landmark", landmark);
      data.append("buildUpArea", formData.buildUpArea);
      // Conditionally append
      if (formData.bhk) data.append("bhk", formData.bhk);
      if (formData.area) data.append("area", formData.area);
      if (listingType === "Sell") {
        if (formData.carpetArea) data.append("carpetArea", formData.carpetArea);
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

  const inputStyle = "w-full border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition";


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
  {/* Property Type */}
  <div>
    <label className="block text-sm font-medium text-black mb-1">Property Type</label>
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
      <option value="office space">office space</option>
    </select>
  </div>

  {/* Listing Type */}
  <div>
    <label className="block text-sm font-medium text-black mb-1">Listing Type</label>
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
  </div>

  {/* BHK */}
   {formData.typeOfProperty !== "office space" && (
  <div>
    <label className="block text-sm font-medium text-black mb-1">BHK (Optional)</label>
    <input
      type="number"
      name="bhk"
      placeholder="Enter BHK"
      className={inputStyle}
      value={formData.bhk}
      onChange={handleChange}
    />
  </div>
   )}
  {/* Built-up Area */}
  <div>
    <label className="block text-sm font-medium text-black mb-1">Built-up Area (Optional)</label>
    <input
      type="text"
      name="buildUpArea"
      placeholder="Built-up Area"
      className={inputStyle}
      value={formData.buildUpArea}
      onChange={handleChange}
    />
  </div>

  {/* Carpet Area */}
  {formData.listingType === "Sell" && (
    <div>
      <label className="block text-sm font-medium text-black mb-1">Carpet Area (Optional)</label>
      <input
        type="text"
        name="carpetArea"
        placeholder="Carpet Area"
        className={inputStyle}
        value={formData.carpetArea}
        onChange={handleChange}
      />
    </div>
  )}

  {/* City */}
  <div>
    <label className="block text-sm font-medium text-black mb-1">City</label>
    <select
      name="location"
      className={inputStyle}
      value={formData.location}
      onChange={(e) => {
        handleChange(e);
        setFormData((prev) => ({ ...prev, landmark: "" })); // reset landmark on city change
      }}
    >
      <option value="">Select City</option>
      <option value="bhopal">Bhopal</option>
      <option value="indore">Indore</option>
    </select>
  </div>

  {/* Landmark */}
  {formData.location && (
    <div>
      <label className="block text-sm font-medium text-black mb-1">Landmark</label>
      <select
        name="landmark"
        className={inputStyle}
        value={formData.landmark}
        onChange={handleChange}
      >
        <option value="">Select Landmark</option>
        {(formData.location === "bhopal"
          ? [
              "Mp nagar",
              "Kolar",
              "Hoshangabad road",
              "Shahpura",
              "Chunabhatti",
              "Ashoka garden",
              "Rachna Nagar",
              "Shivaji nagar",
              "Saket nagar",
              "Bawadiya kalan",
              "Gulmohar",
              "Punjabi bagh",
              "Bittan market",
              "Gautam nagar",
              "Old subhash nagar",
              "Arera colony",
              "Indrapuri",
              "Rohit nagar",
            ]
          : [
              "Navlakha",
              "Pipaliya pala park",
              "Musakhedi",
              "Khajrana",
              "Kalani nagar",
              "Sangam nagar",
              "Vijaynagar",
              "Bhanwarkua",
              "Mahalakshmi nagar",
              "Rau",
              "Lal bagh palace",
              "Dhabli",
              "Niranjanpur",
              "Nipania",
              "Bicholi mardana",
              "Rajendra Nagar",
              "Chandan nagar",
              "Sukhaliya",
              "Palasiya",
              "Pardesipura",
              "Tilak Nagar",
              "Alok nagar",
              "South tukoganj",
              "Mari mata square",
              "Luv kush square",
              "Nanda nagar",
              "Super corridor",
              "Mhow",
              "Dewas Naka",
              "Scheme no 140",
              "Mr 10",
              "Mr 11",
              "Gandhi Nagar",
            ]
        ).map((landmark, idx) => (
          <option key={idx} value={landmark}>
            {landmark}
          </option>
        ))}
      </select>
    </div>
  )}

  {/* Price */}
  <div>
    <label className="block text-sm font-medium text-black mb-1">Price</label>
    <input
      type="number"
      name="price"
      placeholder="Enter Price"
      className={inputStyle}
      value={formData.price}
      onChange={handleChange}
    />
  </div>

  {/* Title */}
  <div>
    <label className="block text-sm font-medium text-black mb-1">Title</label>
    <input
      type="text"
      name="title"
      placeholder="Enter Title"
      className={inputStyle}
      value={formData.title}
      onChange={handleChange}
    />
  </div>

  {/* Description */}
  <div>
    <label className="block text-sm font-medium text-black mb-1">Description</label>
    <textarea
      name="description"
      placeholder="Enter Description"
      className={inputStyle}
      value={formData.description}
      onChange={handleChange}
    />
  </div>

  {/* Mobile Number */}
  <div>
    <label className="block text-sm font-medium text-black mb-1">Mobile Number</label>
    <input
      type="tel"
      name="mobileNum"
      placeholder="Enter Mobile Number"
      className={inputStyle}
      value={formData.mobileNum}
      onChange={handleChange}
    />
  </div>

  {/* Image Upload */}
  <div>
    <label className="block text-sm font-medium text-black mb-2">Upload Images</label>
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

  {/* Buttons */}
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
