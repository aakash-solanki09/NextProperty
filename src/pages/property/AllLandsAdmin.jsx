
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPublicProperties, deleteProperty } from "../../api/property/propertyApi";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Search } from "lucide-react";

dayjs.extend(relativeTime);

const AllLandsAdmin = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [listingFilter, setListingFilter] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [bhkFilter, setBhkFilter] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const [imageIndices, setImageIndices] = useState({});
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [modalType, setModalType] = useState("");
  const [modalImageIndex, setModalImageIndex] = useState(0);

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

    if (bhkFilter) {
      filtered = filtered.filter((p) => String(p.bhk) === String(bhkFilter));
    }

    if (sortOrder === "newest") {
      filtered = filtered.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOrder === "oldest") {
      filtered = filtered.slice().sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    setFilteredProperties(filtered);
  }, [
    search,
    typeFilter,
    listingFilter,
    priceRange,
    sortOrder,
    bhkFilter,
    properties,
  ]);

  const handleSubFilterChange = (type, value) => {
    if (type === "type") setTypeFilter(value);
    else if (type === "listing") setListingFilter(value);
    else if (type === "price") setPriceRange(value);
    else if (type === "sort") setSortOrder(value);
    else if (type === "bhk") setBhkFilter(value);

    if (!activeFilters.some((f) => f.type === type)) {
      setActiveFilters((prev) => [...prev, { type, value }]);
    } else {
      setActiveFilters((prev) =>
        prev.map((f) => (f.type === type ? { type, value } : f))
      );
    }
  };

  const removeFilter = (type) => {
    if (type === "type") setTypeFilter("");
    if (type === "listing") setListingFilter("");
    if (type === "price") setPriceRange("");
    if (type === "sort") setSortOrder("");
    if (type === "bhk") setBhkFilter("");
    setActiveFilters((prev) => prev.filter((f) => f.type !== type));
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

  return (
    <div className="max-w-7xl mx-auto mt-6 px-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Manage All Properties</h2>

      {/* Filters Section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4 flex-wrap">
        {/* Search Input with Icon */}
        <div className="relative w-full sm:w-[40%]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-md pl-9 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>

        {/* Group 1: Type, Price, BHK */}
        <div className="flex gap-4 flex-wrap">
          <select
            value={typeFilter}
            onChange={(e) => handleSubFilterChange("type", e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">Property Type</option>
                     <option value="Flat">Flat</option>
                      <option value="House">House</option>
                      <option value="Apartment">Apartment</option>
          {/*   <option value="Flats">Flats</option>
            <option value="Builder Floors">Builder Floors</option>
            <option value="House Villas">House Villas</option>
            <option value="Plots">Plots</option>
            <option value="Farmhouses">Farmhouses</option>
            <option value="Hotels">Hotels</option>
            <option value="Lands">Lands</option>
            <option value="Office Spaces">Office Spaces</option>
            <option value="Hostels">Hostels</option>
            <option value="Shops Showrooms">Shops Showrooms</option> */}
          </select>

          <select
            value={priceRange}
            onChange={(e) => handleSubFilterChange("price", e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">Price Range</option>
            <option value="0-5000">...below ₹5K</option>
             <option value="5001-10000">₹5K-₹10K</option>
            <option value="10001-20000">₹10K-₹20K</option>
            <option value="20001-50000">₹20K-₹50K</option>
            <option value="50001-100000">₹50K-₹1L</option>
            <option value="100001-200000">₹1L-₹2L</option>
            <option value="200001-300000">₹2L-₹3L</option>
            <option value="300001-500000">₹3L-₹5L</option>
            <option value="500001-1000000">₹5L–₹10L</option>
            <option value="1000001-5000000">₹10L–₹50L</option>
            <option value="5000001-10000000">₹50L–₹1Cr</option>
            <option value="10000001-100000000">₹1Cr+</option>
          </select>

          <select
            value={bhkFilter}
            onChange={(e) => handleSubFilterChange("bhk", e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">Select BHK</option>
            <option value="1">1 BHK</option>
            <option value="2">2 BHK</option>
            <option value="3">3 BHK</option>
            <option value="4">4 BHK</option>
            <option value="5">5+ BHK</option>
          </select>
        </div>

        {/* Group 2: Sort By and Listing */}
        <div className="flex gap-4 flex-wrap">
          <select
            value={sortOrder}
            onChange={(e) => handleSubFilterChange("sort", e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">Sort By</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>

          <select
            value={listingFilter}
            onChange={(e) => handleSubFilterChange("listing", e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">Listing</option>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
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

      {/* CARD SECTION STARTS HERE */}

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
              <div className="relative h-56 overflow-hidden">
                <img
                  src={currentImage}
                  alt={property.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {images.length > 1 && (
                  <div className="absolute inset-0 flex justify-between items-center px-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevImage(property._id, images.length);
                      }}
                      className="bg-white bg-opacity-70 text-gray-700 text-lg rounded-full w-8 h-8 flex items-center justify-center shadow hover:bg-opacity-100"
                    >
                      ‹
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextImage(property._id, images.length);
                      }}
                      className="bg-white bg-opacity-70 text-gray-700 text-lg rounded-full w-8 h-8 flex items-center justify-center shadow hover:bg-opacity-100"
                    >
                      ›
                    </button>
                  </div>
                )}
                {property.listingType && (
                  <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold shadow ${property.listingType.toLowerCase() === 'sale' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}
                  >
                    {property.listingType.charAt(0).toUpperCase() + property.listingType.slice(1)}
                  </span>
                )}
              </div>

              <div className="p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-bold truncate text-gray-900" title={property.title}>{property.title}</h3>
                  <span className="text-blue-600 font-extrabold text-lg">₹{property.price.toLocaleString()}</span>
                </div>
                <p className="text-gray-500 text-xs mb-1 truncate font-semibold" title={property.location}><span className="font-semibold">{property.location}</span></p>
                <div className="flex items-center gap-3 ">
                  <span className="inline-block bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-medium">{property.bhk} BHK</span>
                  <span className="inline-block bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-medium">{property.buildUpArea} Area sq.ft</span>
                  {property.listingType?.toLowerCase() === 'sale' && (
                    <div className="flex flex-wrap gap-3 ">
                      <span className="inline-block bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-medium">Carpet Area: {property.carpetArea} sq.ft</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-10">
                  <p className="text-xs text-gray-500">
                    {property.furnishedType}
                  </p>
                  <p className="text-xs text-gray-500">
                    Posted {dayjs(property.createdAt).fromNow()}
                  </p>

                </div>

                <p className="text-gray-700 text-sm overflow-y-auto h-24 max-h-24 pr-2 overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                  {property.description}
                </p>
                 <p className="text-xs text-gray-500">
                   Mobile No: {property.mobileNum}
                  </p>
                <div className="mt-3 flex justify-end space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/update-property/${property._id}`);
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Edit
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
      {selectedProperty && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white w-[80%] max-w-5xl rounded-2xl shadow-2xl overflow-y-auto max-h-[100vh] relative flex flex-col lg:flex-row">
            <button
              className="absolute top-2 right-2 text-black text-2xl font-bold z-10 hover:text-red-600"
              onClick={() => {
                setSelectedProperty(null);
                setModalImageIndex(0); // reset image index on close
              }}
            >
              &times;
            </button>

            {/* Image Section with Arrows */}
            <div className="w-full lg:w-[45%] h-72 lg:h-auto relative flex items-center justify-center bg-gray-50 rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none">
              <img
                src={
                  selectedProperty.images?.[modalImageIndex] ||
                  selectedProperty.imageUrl
                }
                alt={selectedProperty.title}
                className="w-full h-full object-cover rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none"
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
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 text-gray-700 text-lg rounded-full w-8 h-8 flex items-center justify-center shadow hover:bg-opacity-100"
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
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 text-gray-700 text-lg rounded-full w-8 h-8 flex items-center justify-center shadow hover:bg-opacity-100"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {/* Content Section */}
            <div className="w-full lg:w-[55%] p-6 flex flex-col gap-2">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-gray-900 mb-0">{selectedProperty.title}</h2>

                <span className="text-blue-600 font-extrabold text-xl">₹{selectedProperty.price?.toLocaleString()}</span>
              </div>
              <div className="flex ">
                <span className={` px-3 py-1 rounded text-xs font-semibold shadow w-fit mr-4 ${selectedProperty.listingType?.toLowerCase() === 'sale' ? 'bg-gray-100 text-gray-700' : 'bg-gray-100 text-gray-700'}`}>{selectedProperty.listingType}</span>
                <span className=" bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs font-medium w-fit">Type: {selectedProperty.typeOfProperty}</span>
              </div>
              <p className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs font-medium mb-1 w-fit">{selectedProperty.location}</p>

              <div className="flex flex-wrap gap-3 mb-2">
                <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs font-medium">BHK: {selectedProperty.bhk}</span>
                <span className="inline-block bg-gray-50 text-gray-800 px-3 py-1 rounded text-xs font-medium border">Area: {selectedProperty.buildUpArea} sq.ft</span>
                {selectedProperty.listingType?.toLowerCase() === 'sale' && (
                  <div className="flex flex-wrap gap-3 mb-2">
                    <span className="inline-block bg-gray-50 text-gray-800 px-3 py-1 rounded text-xs font-medium border">Carpet Area: {selectedProperty.carpetArea} sq.ft</span>
                  </div>
                )}
                <span className="font-medium text-gray-700"></span>

              </div>

              <div className="flex flex-wrap gap-3 mb-2">
                <p className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs font-medium">
                  {selectedProperty.furnishedType}
                </p>
                <p className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs font-medium">
                  Posted {dayjs(selectedProperty.createdAt).fromNow()}
                </p>
              </div>
              <p className="text-gray-700 text-sm overflow-y-auto overflow-x-hidden max-h-24 pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 border-2 border-gray-300 rounded-md p-2">
                {selectedProperty.description}
              </p>
              <p className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs font-medium">
                 Mobile No: {selectedProperty.mobileNum}
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
