const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

// All user routes require authentication
router.use(authMiddleware);

// @route   GET /api/users/profile
router.get('/profile', userController.getProfile);

// @route   GET /api/users/balance
router.get('/balance', userController.getBalance);

// @route   PUT /api/users/settings
router.put('/settings', userController.updateSettings);

// @route   GET /api/users/search
router.get('/search', userController.searchUsers);

// @route   GET /api/users/contacts
router.get('/contacts', userController.getContacts);

module.exports = router;
