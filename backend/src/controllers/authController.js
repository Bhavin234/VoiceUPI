const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const config = require('../config/config');
const { SUCCESS, ERRORS } = require('../config/constants');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      phone: user.phone,
      upiId: user.upiId
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpire }
  );
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, phone, pin, language } = req.body;

    // Validation
    if (!name || !phone || !pin) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, phone, and pin'
      });
    }

    if (pin.length < 4) {
      return res.status(400).json({
        success: false,
        message: 'PIN must be at least 4 digits'
      });
    }

    // Check if user already exists
    const existingUser = await db.findUserByPhone(phone);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this phone number already exists'
      });
    }

    // Create user
    const user = await db.createUser({
      name,
      phone,
      pin,
      language: language || 'en'
    });

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: SUCCESS.USER_REGISTERED,
      data: {
        user: {
          id: user.id,
          name: user.name,
          phone: user.phone,
          upiId: user.upiId,
          balance: user.balance,
          language: user.language
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { phone, pin } = req.body;

    // Validation
    if (!phone || !pin) {
      return res.status(400).json({
        success: false,
        message: 'Please provide phone and pin'
      });
    }

    // Find user
    const user = await db.findUserByPhone(phone);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: ERRORS.INVALID_CREDENTIALS
      });
    }

    // Verify pin
    const isPinValid = await bcrypt.compare(pin, user.pin);
    if (!isPinValid) {
      return res.status(401).json({
        success: false,
        message: ERRORS.INVALID_CREDENTIALS
      });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      success: true,
      message: SUCCESS.LOGIN_SUCCESS,
      data: {
        user: {
          id: user.id,
          name: user.name,
          phone: user.phone,
          upiId: user.upiId,
          balance: user.balance,
          language: user.language
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP (mock)
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOtp = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;

    // Mock OTP verification (always accept 1234 for demo)
    if (otp === '1234') {
      const user = await db.findUserByPhone(phone);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: ERRORS.USER_NOT_FOUND
        });
      }

      const token = generateToken(user);

      return res.json({
        success: true,
        message: SUCCESS.VERIFICATION_SUCCESS,
        data: {
          user: {
            id: user.id,
            name: user.name,
            phone: user.phone,
            upiId: user.upiId,
            balance: user.balance,
            language: user.language
          },
          token
        }
      });
    }

    res.status(400).json({
      success: false,
      message: 'Invalid OTP'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify biometric (mock)
// @route   POST /api/auth/verify-biometric
// @access  Private
exports.verifyBiometric = async (req, res, next) => {
  try {
    // Mock biometric verification
    // In real app, this would verify fingerprint/face data
    const { userId, biometricData } = req.body;

    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock success (always true for demo)
    res.json({
      success: true,
      message: SUCCESS.VERIFICATION_SUCCESS,
      data: {
        verified: true
      }
    });
  } catch (error) {
    next(error);
  }
};
