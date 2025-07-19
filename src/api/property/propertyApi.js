const BASE_URL = 'http://localhost:8000/api';

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
    console.log("Creating property with token:", token);
    const response = await fetch(`${BASE_URL}/properties`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Token header
      },
      body: formData, // ✅ Must be FormData, don't set content-type manually
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create property");
    }

    return data;
  } catch (error) {
    throw error;
  }
};



// GET all properties for logged-in user
export const getAllProperties = async () => {
  try {
    const response = await fetch(`${BASE_URL}/properties`, {
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
      method: 'PUT',
      headers: {
        ...getAuthHeaders(),
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  } catch (error) {
    throw error;
  }
};

// DELETE property by ID
export const deleteProperty = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/properties/${id}`, {
      method: 'DELETE',
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
export const getAllPublicProperties = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/all-properties`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Backend error response:", errorText);
    throw new Error("Failed to fetch public properties");
  }

  return res.json();
};