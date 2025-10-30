const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/auth');

// All transaction routes require authentication
router.use(authMiddleware);

// @route   POST /api/transactions/send
router.post('/send', transactionController.sendMoney);

// @route   GET /api/transactions
router.get('/', transactionController.getTransactions);

// @route   GET /api/transactions/:id
router.get('/:id', transactionController.getTransaction);

// @route   POST /api/transactions/parse-command
router.post('/parse-command', transactionController.parseCommand);

module.exports = router;
