const { check, validationResult } = require('express-validator');

// Middleware to handle validation result and format responses
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({ field: err.path, message: err.msg }))
    });
  }
  next();
};

const validateCreateVehicle = [
  check('make', 'Make is required').not().isEmpty().trim(),
  check('model', 'Model is required').not().isEmpty().trim(),
  check('category', 'Category is required').not().isEmpty().trim(),
  check('price', 'Price must be a number greater than or equal to 0').isFloat({ min: 0 }),
  check('quantity', 'Quantity must be an integer greater than or equal to 0').isInt({ min: 0 }),
  handleValidationErrors
];

const validateUpdateVehicle = [
  check('make', 'Make cannot be empty').optional().not().isEmpty().trim(),
  check('model', 'Model cannot be empty').optional().not().isEmpty().trim(),
  check('category', 'Category cannot be empty').optional().not().isEmpty().trim(),
  check('price', 'Price must be a number greater than or equal to 0').optional().isFloat({ min: 0 }),
  check('quantity', 'Quantity must be an integer greater than or equal to 0').optional().isInt({ min: 0 }),
  handleValidationErrors
];

const validateRestock = [
  check('quantity', 'Quantity to restock must be an integer greater than 0').isInt({ min: 1 }),
  handleValidationErrors
];

module.exports = {
  validateCreateVehicle,
  validateUpdateVehicle,
  validateRestock
};
