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

const validateRegister = [
  check('name', 'Name is required').not().isEmpty().trim(),
  check('email', 'Please enter a valid email').isEmail().normalizeEmail(),
  check('password', 'Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, and one special character').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/),
  check('role', 'Role must be either user or admin').optional().isIn(['user', 'admin']),
  handleValidationErrors
];

const validateLogin = [
  check('email', 'Please enter a valid email').isEmail().normalizeEmail(),
  check('password', 'Password is required').not().isEmpty(),
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin
};
