const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicle.controller');
const { validateCreateVehicle, validateUpdateVehicle, validateRestock } = require('../validators/vehicle.validator');
const { protect, admin } = require('../middleware/auth.middleware');

// Protect all vehicle routes
router.use(protect);

// Search endpoint (MUST be defined before /:id)
router.get('/search', vehicleController.searchVehicles);

// Vehicle CRUD routes
router.post('/', validateCreateVehicle, vehicleController.createVehicle);
router.get('/', vehicleController.getAllVehicles);
router.get('/:id', vehicleController.getVehicleById);
router.put('/:id', validateUpdateVehicle, vehicleController.updateVehicle);
router.delete('/:id', admin, vehicleController.deleteVehicle);

// Inventory transactions
router.post('/:id/purchase', vehicleController.purchaseVehicle);
router.post('/:id/restock', admin, validateRestock, vehicleController.restockVehicle);

module.exports = router;
