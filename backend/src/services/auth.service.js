const User = require('../models/User');
const jwt = require('jsonwebtoken');

/**
 * Generate a JWT token for the user
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'supersecretkey_dev',
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

/**
 * Registers a new user
 */
const registerUser = async ({ name, email, password, role }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('email is already registered');
    error.statusCode = 400;
    throw error;
  }

  const user = new User({ name, email, password, role });
  await user.save();

  const token = generateToken(user);
  
  // Convert mongoose model to object and remove password
  const userJson = user.toObject();
  delete userJson.password;

  return { user: userJson, token };
};

/**
 * Logins user and returns user info along with signed token
 */
const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user);

  const userJson = user.toObject();
  delete userJson.password;

  return { user: userJson, token };
};

module.exports = {
  registerUser,
  loginUser,
  generateToken
};
