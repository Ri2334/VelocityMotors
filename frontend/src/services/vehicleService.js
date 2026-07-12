import api from './api';

const vehicleService = {
  getVehicles: async () => {
    const response = await api.get('/vehicles');
    return response.data;
  },

  searchVehicles: async (filters = {}) => {
    // Construct query parameters
    const params = new URLSearchParams();
    if (filters.make) params.append('make', filters.make);
    if (filters.model) params.append('model', filters.model);
    if (filters.category) params.append('category', filters.category);
    if (filters.minPrice !== undefined && filters.minPrice !== '') {
      params.append('minPrice', filters.minPrice);
    }
    if (filters.maxPrice !== undefined && filters.maxPrice !== '') {
      params.append('maxPrice', filters.maxPrice);
    }

    const response = await api.get(`/vehicles/search?${params.toString()}`);
    return response.data;
  },

  getVehicle: async (id) => {
    const response = await api.get(`/vehicles/${id}`);
    return response.data;
  },

  createVehicle: async (vehicleData) => {
    const response = await api.post('/vehicles', vehicleData);
    return response.data;
  },

  updateVehicle: async (id, vehicleData) => {
    const response = await api.put(`/vehicles/${id}`, vehicleData);
    return response.data;
  },

  deleteVehicle: async (id) => {
    const response = await api.delete(`/vehicles/${id}`);
    return response.data;
  },

  purchaseVehicle: async (id) => {
    const response = await api.post(`/vehicles/${id}/purchase`);
    return response.data;
  },

  restockVehicle: async (id, quantity) => {
    const response = await api.post(`/vehicles/${id}/restock`, { quantity });
    return response.data;
  }
};

export default vehicleService;
