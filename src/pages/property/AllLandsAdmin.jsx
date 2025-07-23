import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPublicProperties, deleteProperty } from "../../api/property/propertyApi";

const AllLandsAdmin = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [listingFilter, setListingFilter] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [imageIndices, setImageIndices] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllPublicProperties();
        setProperties(data);
        setFilteredProperties(data);
        const initialIndices = {};
        data.forEach((p) => {
          initialIndices[p._id] = 0;
        });
        setImageIndices(initialIndices);
      } catch (err) {
        console.error("Error fetching properties", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = properties;

    if (search.trim()) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(lowerSearch) ||
          p.description.toLowerCase().includes(lowerSearch) ||
          p.location.toLowerCase().includes(lowerSearch) ||
          p.price.toString().includes(lowerSearch)
      );
    }

    if (typeFilter) {
      filtered = filtered.filter((p) => p.typeOfProperty === typeFilter);
    }

    if (listingFilter) {
      filtered = filtered.filter(
        (p) => p.listingType?.toLowerCase() === listingFilter.toLowerCase()
      );
    }

    if (priceRange) {
      const [min, max] = priceRange.split("-").map(Number);
      filtered = filtered.filter((p) => p.price >= min && p.price <= max);
    }

    setFilteredProperties(filtered);
  }, [search, typeFilter, listingFilter, priceRange, properties]);

  const confirmDelete = async () => {
    if (!selectedProperty) return;

    try {
      await deleteProperty(selectedProperty._id);
      setProperties((prev) => prev.filter((p) => p._id !== selectedProperty._id));
      setFilteredProperties((prev) => prev.filter((p) => p._id !== selectedProperty._id));
      setSelectedProperty(null);
    } catch (error) {
      console.error("Failed to delete property:", error);
      alert("Failed to delete property.");
    }
  };

  const handlePrevImage = (id, imagesLength) => {
    setImageIndices((prev) => ({
      ...prev,
      [id]: (prev[id] - 1 + imagesLength) % imagesLength,
    }));
  };

  const handleNextImage = (id, imagesLength) => {
    setImageIndices((prev) => ({
      ...prev,
      [id]: (prev[id] + 1) % imagesLength,
    }));
  };

  return (
    <div className="max-w-7xl mx-auto mt-6 px-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Explore All Properties</h2>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        {/* Search bar on the left */}
        <input
          type="text"
          placeholder="Search by title, location, price..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-[40%] border border-gray-300 rounded-md px-3 py-2"
        />

        {/* Filters on the right */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">All Types</option>
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
            value={listingFilter}
            onChange={(e) => setListingFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">All Listings</option>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>

          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">Any Price</option>
            <option value="0-500000">Below ₹5 Lakh</option>
            <option value="500001-1000000">₹5L–₹10L</option>
            <option value="1000001-5000000">₹10L–₹50L</option>
            <option value="5000001-10000000">₹50L–₹1Cr</option>
            <option value="10000001-100000000">₹1Cr+</option>
          </select>
        </div>
      </div>

      {/* Property Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProperties.map((property) => {
          const currentImageIndex = imageIndices[property._id] || 0;
          const images = property.images || [];
          const currentImage = images[currentImageIndex];

          return (
            <div key={property._id} className="bg-white shadow-md rounded-xl overflow-hidden text-sm">
              <div className="relative">
                {images.length > 0 && (
                  <img
                    src={currentImage}
                    alt={`property-${currentImageIndex}`}
                    className="h-48 w-full object-cover"
                  />
                )}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => handlePrevImage(property._id, images.length)}
                      className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 text-white px-2 py-1 rounded-full text-xs"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => handleNextImage(property._id, images.length)}
                      className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 text-white px-2 py-1 rounded-full text-xs"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>

              <div className="p-3">
                <h3 className="text-lg font-semibold truncate">{property.title}</h3>
                <p className="text-gray-600 h-12 overflow-hidden text-ellipsis">
                  {property.description}
                </p>
                <p className="text-blue-500 font-bold mt-1">₹{property.price}</p>
                <p className="text-xs text-gray-400">{property.location}</p>
                <p className="text-xs text-gray-600 mt-1">
                  Listing: <span className="capitalize font-medium">{property.listingType}</span>
                </p>

                <div className="mt-3 flex justify-end space-x-2">
                  <button
                    onClick={() => navigate(`/update-property/${property._id}`)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => setSelectedProperty(property)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 relative">
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
              onClick={() => setSelectedProperty(null)}
            >
              ×
            </button>
            <h3 className="text-lg font-semibold mb-2">
              Delete "{selectedProperty.title}"?
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this property?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedProperty(null)}
                className="px-4 py-1 bg-gray-200 hover:bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllLandsAdmin;
