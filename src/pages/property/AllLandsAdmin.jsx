
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPublicProperties, deleteProperty } from "../../api/property/propertyApi";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const AllLandsAdmin = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [listingFilter, setListingFilter] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [modalType, setModalType] = useState("");
  const [imageIndices, setImageIndices] = useState({});
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

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

    if (sortOrder === "newest") {
      filtered = filtered.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOrder === "oldest") {
      filtered = filtered.slice().sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    setFilteredProperties(filtered);
  }, [search, typeFilter, listingFilter, priceRange, sortOrder, properties]);

  const handleSubFilterChange = (type, value) => {
    if (type === "type") setTypeFilter(value);
    else if (type === "listing") setListingFilter(value);
    else if (type === "price") setPriceRange(value);
    else if (type === "sort") setSortOrder(value);

    if (!activeFilters.some((f) => f.type === type)) {
      setActiveFilters((prev) => [...prev, { type, value }]);
    } else {
      setActiveFilters((prev) => prev.map((f) => (f.type === type ? { type, value } : f)));
    }
  };

  const removeFilter = (type) => {
    if (type === "type") setTypeFilter("");
    if (type === "listing") setListingFilter("");
    if (type === "price") setPriceRange("");
    if (type === "sort") setSortOrder("");
    setActiveFilters((prev) => prev.filter((f) => f.type !== type));
  };

  const confirmDelete = async () => {
    if (!selectedProperty) return;
    try {
      await deleteProperty(selectedProperty._id);
      setProperties((prev) => prev.filter((p) => p._id !== selectedProperty._id));
      setFilteredProperties((prev) => prev.filter((p) => p._id !== selectedProperty._id));
      setSelectedProperty(null);
      setModalType("");
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

  const handleCardClick = (property) => {
    setSelectedProperty(property);
    setModalImageIndex(0);
    setModalType("view");
  };

  const handleModalImageChange = (step) => {
    if (!selectedProperty) return;
    const images = selectedProperty.images || [];
    setModalImageIndex((prev) => (prev + step + images.length) % images.length);
  };

  return (
    <div className="max-w-7xl mx-auto mt-6 px-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Manage All Properties</h2>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-[40%] border border-gray-300 rounded-md px-3 py-2"
        />

        <select
          value={sortOrder}
          onChange={(e) => handleSubFilterChange("sort", e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="">Sort By</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>

        <div className="relative">
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          >
            More Filters
          </button>
          {showAdvancedFilters && (
            <div className="absolute z-10 mt-2 bg-white border rounded-md p-4 w-64 shadow-md">
              <label className="block text-sm mb-2">
                Type:
                <select
                  value={typeFilter}
                  onChange={(e) => handleSubFilterChange("type", e.target.value)}
                  className="w-full mt-1 border px-2 py-1"
                >
                  <option value="">Select Type</option>
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
              </label>
              <label className="block text-sm mb-2">
                Listing:
                <select
                  value={listingFilter}
                  onChange={(e) => handleSubFilterChange("listing", e.target.value)}
                  className="w-full mt-1 border px-2 py-1"
                >
                  <option value="">Select Listing</option>
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </label>
              <label className="block text-sm">
                Price Range:
                <select
                  value={priceRange}
                  onChange={(e) => handleSubFilterChange("price", e.target.value)}
                  className="w-full mt-1 border px-2 py-1"
                >
                  <option value="">Select Price</option>
                  <option value="0-500000">Below ₹5L</option>
                  <option value="500001-1000000">₹5L–₹10L</option>
                  <option value="1000001-5000000">₹10L–₹50L</option>
                  <option value="5000001-10000000">₹50L–₹1Cr</option>
                  <option value="10000001-100000000">₹1Cr+</option>
                </select>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Render active filters and properties here */}
      {/* (Rest of the component remains unchanged) */}
        {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {activeFilters.map((f, idx) => (
            <div
              key={idx}
              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
            >
              {f.type.charAt(0).toUpperCase() + f.type.slice(1)}: {f.value}
              <button
                onClick={() => removeFilter(f.type)}
                className="text-blue-800 font-bold hover:text-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Property Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProperties.map((property) => {
          const currentImageIndex = imageIndices[property._id] || 0;
          const images = property.images || [];
          const currentImage = images[currentImageIndex];

          return (
            <div
              key={property._id}
              className="bg-white shadow-md rounded-xl overflow-hidden text-sm cursor-pointer"
              onClick={() => handleCardClick(property)}
            >
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevImage(property._id, images.length);
                      }}
                      className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 text-white px-2 py-1 rounded-full text-xs"
                    >
                      ‹
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextImage(property._id, images.length);
                      }}
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
                <p className="text-xs text-gray-500">
                  Posted {dayjs(property.createdAt).fromNow()}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Listing: <span className="capitalize font-medium">{property.listingType}</span>
                </p>

                <div className="mt-3 flex justify-end space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/update-property/${property._id}`);
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Update
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProperty(property);
                      setModalType("delete");
                    }}
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

      {/* View Modal */}
      {selectedProperty && modalType === "view" && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-4xl w-full rounded-xl shadow-lg overflow-auto max-h-[90vh] relative flex flex-col sm:flex-row">
            <button
              onClick={() => {
                setSelectedProperty(null);
                setModalType("");
              }}
              className="absolute top-3 right-4 text-gray-700 text-2xl font-bold"
            >
              ×
            </button>

            {/* Image */}
            <div className="sm:w-1/2 relative">
              {selectedProperty.images.length > 0 && (
                <img
                  src={selectedProperty.images[modalImageIndex]}
                  alt="Property"
                  className="w-full h-64 sm:h-full object-cover rounded-l-xl"
                />
              )}
              {selectedProperty.images.length > 1 && (
                <>
                  <button
                    onClick={() => handleModalImageChange(-1)}
                    className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-lg"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => handleModalImageChange(1)}
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-lg"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {/* Details */}
            <div className="p-5 sm:w-1/2 text-sm">
              <h2 className="text-xl font-semibold mb-2">{selectedProperty.title}</h2>
              <p className="mb-2">{selectedProperty.description}</p>
              <p><strong>Type:</strong> {selectedProperty.typeOfProperty}</p>
              <p><strong>Price:</strong> ₹{selectedProperty.price}</p>
              <p><strong>BHK:</strong> {selectedProperty.bhk}</p>
              <p><strong>Area:</strong> {selectedProperty.area} sq.ft</p>
              <p><strong>Location:</strong> {selectedProperty.location}</p>
              <p><strong>Listing Type:</strong> {selectedProperty.listingType}</p>
              <p className="text-xs text-gray-500 mt-2">
                Posted {dayjs(selectedProperty.createdAt).fromNow()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {selectedProperty && modalType === "delete" && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 relative">
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
              onClick={() => {
                setSelectedProperty(null);
                setModalType("");
              }}
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
                onClick={() => {
                  setSelectedProperty(null);
                  setModalType("");
                }}
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
