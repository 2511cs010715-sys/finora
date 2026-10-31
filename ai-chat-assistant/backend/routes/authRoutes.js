const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const DataStore = require('../config/store');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'ai_chat_assistant_super_secret_jwt_key_2026', {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', authLimiter, async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, and password.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    const existingUser = await DataStore.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    const user = await DataStore.createUser({ name, email, password });
    const token = generateToken(user._id || user.id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', authLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const user = await DataStore.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
      });
    }

    const token = generateToken(user._id || user.id);

    res.json({
      success: true,
      message: 'Logged in successfully!',
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/auth/profile or /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', protect, async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id || req.user.id,
      name: req.user.name,
      email: req.user.email,
      created_at: req.user.created_at,
    },
  });
});

router.get('/me', protect, async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id || req.user.id,
      name: req.user.name,
      email: req.user.email,
      created_at: req.user.created_at,
    },
  });
});

module.exports = router;
