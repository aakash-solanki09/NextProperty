import React, { useEffect, useState } from "react";
import { getAllPublicProperties } from "../../api/property/propertyApi";

const AllPublicProperties = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [listingTypeFilter, setListingTypeFilter] = useState("");
  const [imageIndexMap, setImageIndexMap] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [selectedProperty, setSelectedProperty] = useState(null); // For modal

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllPublicProperties();
        setProperties(data);
        setFilteredProperties(data);

        const indexMap = {};
        data.forEach((p) => (indexMap[p._id] = 0));
        setImageIndexMap(indexMap);
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

    if (priceRange) {
      const [min, max] = priceRange.split("-").map(Number);
      filtered = filtered.filter((p) => p.price >= min && p.price <= max);
    }

    if (listingTypeFilter) {
      filtered = filtered.filter(
        (p) =>
          (p.listingType || "").trim().toLowerCase() ===
          listingTypeFilter.toLowerCase()
      );
    }

    setFilteredProperties(filtered);
  }, [search, typeFilter, priceRange, listingTypeFilter, properties]);

  const handleNextImage = (id, imagesLength) => {
    setImageIndexMap((prev) => ({
      ...prev,
      [id]: (prev[id] + 1) % imagesLength,
    }));
  };

  const handlePrevImage = (id, imagesLength) => {
    setImageIndexMap((prev) => ({
      ...prev,
      [id]: (prev[id] - 1 + imagesLength) % imagesLength,
    }));
  };

  const showCustomAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  return (
    <div className="max-w-7xl mx-auto mt-6 px-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Explore All Properties</h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by title, location, price..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2 border border-gray-300 rounded-md px-3 py-2"
        />
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
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

          <select
            value={listingTypeFilter}
            onChange={(e) => setListingTypeFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">All Listing Types</option>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProperties.map((property) => {
          const images = property.images || [property.imageUrl];
          const currentIndex = imageIndexMap[property._id] || 0;
          const currentImage = images[currentIndex];

          return (
            <div
              key={property._id}
              onClick={() => setSelectedProperty(property)}
              className="bg-white shadow-md rounded-xl overflow-hidden text-sm cursor-pointer hover:shadow-lg transition"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={currentImage}
                  alt={property.title}
                  className="h-full w-full object-cover transition-all"
                />
                {images.length > 1 && (
                  <div className="absolute inset-0 flex justify-between items-center px-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevImage(property._id, images.length);
                      }}
                      className="bg-black bg-opacity-40 text-white text-sm rounded-full w-7 h-7"
                    >
                      ‹
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextImage(property._id, images.length);
                      }}
                      className="bg-black bg-opacity-40 text-white text-sm rounded-full w-7 h-7"
                    >
                      ›
                    </button>
                  </div>
                )}
              </div>

              <div className="p-3">
                <h3 className="text-lg font-semibold truncate">{property.title}</h3>
                <p className="text-gray-600 h-12 overflow-hidden text-ellipsis">
                  {property.description}
                </p>
                <p className="text-blue-500 font-bold mt-1">₹{property.price}</p>
                <p className="text-xs text-gray-400">{property.location}</p>
                <p className="text-xs text-gray-600 italic mt-1">
                  Listing Type:{" "}
                  <span className="font-semibold">
                    {(property.listingType || "N/A").charAt(0).toUpperCase() +
                      (property.listingType || "N/A").slice(1).toLowerCase()}
                  </span>
                </p>
                <div className="mt-3 flex justify-end space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      showCustomAlert("For more details, call us at: 1234567890");
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Call
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Alert */}
      {showAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white border border-blue-600 rounded-lg p-6 max-w-sm w-full shadow-xl text-center">
            <h2 className="text-lg font-semibold text-black mb-2">📞 Contact Info</h2>
            <p className="text-sm text-gray-700 mb-4">{alertMessage}</p>
            <button
              onClick={() => setShowAlert(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

     {selectedProperty && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div className="bg-white w-full max-w-5xl rounded-xl shadow-lg overflow-y-auto max-h-[90vh] relative flex flex-col lg:flex-row">
      <button
        className="absolute top-2 right-2 text-black text-2xl font-bold z-10"
        onClick={() => {
          setSelectedProperty(null);
          setModalImageIndex(0); // reset image index on close
        }}
      >
        &times;
      </button>

      {/* Image Section with Arrows */}
      <div className="w-full lg:w-[45%] h-64 lg:h-auto relative flex items-center justify-center">
        <img
          src={
            selectedProperty.images?.[modalImageIndex] ||
            selectedProperty.imageUrl
          }
          alt={selectedProperty.title}
          className="w-full h-full object-cover rounded-t-xl lg:rounded-l-xl lg:rounded-tr-none"
        />
        {/* Left arrow */}
        {selectedProperty.images?.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setModalImageIndex((prev) =>
                  (prev - 1 + selectedProperty.images.length) %
                  selectedProperty.images.length
                );
              }}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white text-lg rounded-full w-8 h-8 flex items-center justify-center"
            >
              ‹
            </button>

            {/* Right arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setModalImageIndex((prev) =>
                  (prev + 1) % selectedProperty.images.length
                );
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white text-lg rounded-full w-8 h-8 flex items-center justify-center"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Content Section */}
      <div className="w-full lg:w-[55%]  p-5">
        <h2 className="text-2xl font-semibold mb-2">{selectedProperty.title}</h2>
        <p className="text-gray-600 mb-2">{selectedProperty.description}</p>
        <p className="font-bold text-xl text-blue-600 mb-2">₹{selectedProperty.price}</p>
        <p className="text-gray-500 mb-1"> {selectedProperty.location}</p>
        <p className="text-sm text-gray-700">
          <strong>Type:</strong> {selectedProperty.typeOfProperty}
        </p>
        <p className="text-sm text-gray-700">
          <strong>Listing:</strong> {selectedProperty.listingType}
        </p>
      </div>
    </div>
  </div>
)}


    </div>
  );
};

export default AllPublicProperties;
