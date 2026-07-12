const Vehicle = require('../models/Vehicle');

/**
 * Creates a new vehicle
 */
const createVehicle = async (vehicleData) => {
  const vehicle = new Vehicle(vehicleData);
  return await vehicle.save();
};

/**
 * Lists all vehicles
 */
const getAllVehicles = async () => {
  return await Vehicle.find({});
};

/**
 * Resolves a vehicle by id
 */
const getVehicleById = async (id) => {
  const vehicle = await Vehicle.findById(id);
  if (!vehicle) {
    const error = new Error('Vehicle not found');
    error.statusCode = 404;
    throw error;
  }
  return vehicle;
};

/**
 * Updates vehicle fields
 */
const updateVehicle = async (id, vehicleData) => {
  const vehicle = await Vehicle.findByIdAndUpdate(
    id,
    vehicleData,
    { new: true, runValidators: true }
  );
  if (!vehicle) {
    const error = new Error('Vehicle not found');
    error.statusCode = 404;
    throw error;
  }
  return vehicle;
};

/**
 * Deletes a vehicle by id
 */
const deleteVehicle = async (id) => {
  const vehicle = await Vehicle.findByIdAndDelete(id);
  if (!vehicle) {
    const error = new Error('Vehicle not found');
    error.statusCode = 404;
    throw error;
  }
  return vehicle;
};

/**
 * Search vehicles based on filters (make, model, category, minPrice, maxPrice)
 */
const searchVehicles = async (filters) => {
  const query = {};

  if (filters.make) {
    query.make = { $regex: new RegExp(filters.make, 'i') };
  }
  if (filters.model) {
    query.model = { $regex: new RegExp(filters.model, 'i') };
  }
  if (filters.category) {
    query.category = { $regex: new RegExp(filters.category, 'i') };
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    query.price = {};
    if (filters.minPrice !== undefined) {
      query.price.$gte = Number(filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
      query.price.$lte = Number(filters.maxPrice);
    }
  }

  return await Vehicle.find(query);
};

/**
 * Purchases a vehicle (decrements quantity by 1)
 */
const purchaseVehicle = async (id) => {
  const vehicle = await Vehicle.findById(id);
  if (!vehicle) {
    const error = new Error('Vehicle not found');
    error.statusCode = 404;
    throw error;
  }

  if (vehicle.quantity <= 0) {
    const error = new Error('Vehicle is out of stock');
    error.statusCode = 400;
    throw error;
  }

  vehicle.quantity -= 1;
  return await vehicle.save();
};

/**
 * Restocks a vehicle (adds quantity)
 */
const restockVehicle = async (id, quantityToIncrease) => {
  const vehicle = await Vehicle.findById(id);
  if (!vehicle) {
    const error = new Error('Vehicle not found');
    error.statusCode = 404;
    throw error;
  }

  vehicle.quantity += Number(quantityToIncrease);
  return await vehicle.save();
};

module.exports = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  searchVehicles,
  purchaseVehicle,
  restockVehicle
};
