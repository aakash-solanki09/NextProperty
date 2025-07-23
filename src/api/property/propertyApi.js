const BASE_URL = import.meta.env.VITE_API_BASE_URL;


// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const createProperty = async (formData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${BASE_URL}/properties`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData, 
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create property");
    }

    return data;
  } catch (error) {
    console.error("Property creation error:", error);
    throw error;
  }
};

// 🟡 GET single property by ID
export const getPropertyById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/properties/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });

    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  } catch (error) {
    throw error;
  }
};

// UPDATE property by ID (with image support)
export const updateProperty = async (id, formData) => {
  try {
    const response = await fetch(`${BASE_URL}/properties/${id}`, {
      method: "PUT",
      headers: {
        ...getAuthHeaders(),
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update property");
    }

    return data;
  } catch (error) {
    console.error("Error updating property:", error);
    throw error;
  }
};

// DELETE property by ID
// propertyApi.js

export const deleteProperty = async (id) => {
  const token = localStorage.getItem("token");
  console.log("Using token:", token); // Add this!

  try {
    const response = await fetch(`${BASE_URL}/properties/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Delete failed:", data);
      throw new Error(data.message || "Failed to delete property");
    }

    return data;
  } catch (error) {
    console.error("Error deleting property:", error);
    throw error;
  }
};

export const getAllPublicProperties = async () => {
  try {
    const response = await fetch(`${BASE_URL}/properties`, {
      method: "GET",
      // No Authorization needed if endpoint is truly public.
      // Remove headers unless your backend requires auth even for "public" properties.
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error fetching public properties:", data.message || data);
      throw new Error(data.message || "Failed to fetch public properties");
    }

    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};