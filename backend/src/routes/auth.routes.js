const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validateRegister, validateLogin } = require('../validators/auth.validator');
const { protect, admin } = require('../middleware/auth.middleware');

// Public authentication routes
router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);

// Protected routes to test auth middlewares
router.get('/me', protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User profile fetched',
    data: req.user
  });
});

router.get('/admin-only', protect, admin, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Admin access granted',
    data: null
  });
});

module.exports = router;
