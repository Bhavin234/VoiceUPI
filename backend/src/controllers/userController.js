const db = require('../config/database');
const { ERRORS } = require('../config/constants');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const user = await db.findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: ERRORS.USER_NOT_FOUND
      });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        upiId: user.upiId,
        balance: user.balance,
        language: user.language,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user balance
// @route   GET /api/users/balance
// @access  Private
exports.getBalance = async (req, res, next) => {
  try {
    const user = await db.findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: ERRORS.USER_NOT_FOUND
      });
    }

    res.json({
      success: true,
      data: {
        balance: user.balance,
        upiId: user.upiId
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user settings
// @route   PUT /api/users/settings
// @access  Private
exports.updateSettings = async (req, res, next) => {
  try {
    const { language, name } = req.body;
    const updates = {};

    if (language) updates.language = language;
    if (name) updates.name = name;

    const user = await db.updateUser(req.user.id, updates);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: ERRORS.USER_NOT_FOUND
      });
    }

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        upiId: user.upiId,
        language: user.language
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search users by name or phone
// @route   GET /api/users/search?q=query
// @access  Private
exports.searchUsers = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters'
      });
    }

    const users = await db.getAllUsers();
    const searchTerm = q.toLowerCase();

    const results = users
      .filter(user => 
        user.id !== req.user.id && // Exclude current user
        (user.name.toLowerCase().includes(searchTerm) ||
         user.phone.includes(searchTerm) ||
         user.upiId.toLowerCase().includes(searchTerm))
      )
      .map(user => ({
        id: user.id,
        name: user.name,
        phone: user.phone,
        upiId: user.upiId
      }));

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contacts (for demo)
// @route   GET /api/users/contacts
// @access  Private
exports.getContacts = async (req, res, next) => {
  try {
    const users = await db.getAllUsers();
    
    const contacts = users
      .filter(user => user.id !== req.user.id)
      .map(user => ({
        id: user.id,
        name: user.name,
        phone: user.phone,
        upiId: user.upiId
      }));

    res.json({
      success: true,
      data: contacts
    });
  } catch (error) {
    next(error);
  }
};
