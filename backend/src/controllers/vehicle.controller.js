const vehicleService = require('../services/vehicle.service');

/**
 * Create a new vehicle
 */
const createVehicle = async (req, res, next) => {
  try {
    const result = await vehicleService.createVehicle(req.body);
    res.status(201).json({
      success: true,
      message: 'Vehicle created successfully',
      data: result
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};

/**
 * List all vehicles
 */
const getAllVehicles = async (req, res, next) => {
  try {
    const result = await vehicleService.getAllVehicles();
    res.status(200).json({
      success: true,
      message: 'Vehicles retrieved successfully',
      data: result
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};

/**
 * Update vehicle details
 */
const updateVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await vehicleService.updateVehicle(id, req.body);
    res.status(200).json({
      success: true,
      message: 'Vehicle updated successfully',
      data: result
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};

/**
 * Delete a vehicle
 */
const deleteVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;
    await vehicleService.deleteVehicle(id);
    res.status(200).json({
      success: true,
      message: 'Vehicle deleted successfully',
      data: null
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};

/**
 * Get a single vehicle by id
 */
const getVehicleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await vehicleService.getVehicleById(id);
    res.status(200).json({
      success: true,
      message: 'Vehicle details retrieved successfully',
      data: result
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};

/**
 * Search vehicles based on query filters
 */
const searchVehicles = async (req, res, next) => {
  try {
    const result = await vehicleService.searchVehicles(req.query);
    res.status(200).json({
      success: true,
      message: 'Vehicles search completed successfully',
      data: result
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};

/**
 * Purchase a vehicle (decreases stock by 1)
 */
const purchaseVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await vehicleService.purchaseVehicle(id);
    res.status(200).json({
      success: true,
      message: 'Vehicle purchased successfully',
      data: result
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};

/**
 * Restock a vehicle (increases stock)
 */
const restockVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const result = await vehicleService.restockVehicle(id, quantity);
    res.status(200).json({
      success: true,
      message: 'Vehicle restocked successfully',
      data: result
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
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
