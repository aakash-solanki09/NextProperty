import React, { useState } from "react";
import { createProperty } from "../../api/property/propertyApi";
import { useNavigate } from "react-router-dom";

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
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
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
    <div className="max-w-2xl mx-auto bg-white shadow-xl p-6 mt-8 rounded-2xl">
      <h2 className="text-2xl font-semibold mb-4">Create Property</h2>
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
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-1"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateLand;
