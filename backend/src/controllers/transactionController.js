const db = require('../config/database');
const { 
  TRANSACTION_STATUS, 
  TRANSACTION_TYPES, 
  ERRORS, 
  SUCCESS,
  DEFAULTS 
} = require('../config/constants');

// @desc    Send money
// @route   POST /api/transactions/send
// @access  Private
exports.sendMoney = async (req, res, next) => {
  try {
    const { recipientIdentifier, amount, note, verificationMethod } = req.body;

    // Validation
    if (!recipientIdentifier || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide recipient and amount'
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: ERRORS.INVALID_AMOUNT
      });
    }

    if (amount > DEFAULTS.TRANSACTION_LIMIT) {
      return res.status(400).json({
        success: false,
        message: ERRORS.TRANSACTION_LIMIT_EXCEEDED
      });
    }

    // Get sender
    const sender = await db.findUserById(req.user.id);
    if (!sender) {
      return res.status(404).json({
        success: false,
        message: ERRORS.USER_NOT_FOUND
      });
    }

    // Check balance
    if (sender.balance < amount) {
      return res.status(400).json({
        success: false,
        message: ERRORS.INSUFFICIENT_BALANCE
      });
    }

    // Find recipient
    let recipient = await db.findUserByPhone(recipientIdentifier);
    if (!recipient) {
      recipient = await db.findUserByUpiId(recipientIdentifier);
    }
    if (!recipient) {
      recipient = await db.findUserByNameOrPhone(recipientIdentifier);
    }

    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: ERRORS.INVALID_RECIPIENT
      });
    }

    // Cannot send to self
    if (sender.id === recipient.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot send money to yourself'
      });
    }

    // Create transaction
    const transaction = await db.createTransaction({
      senderId: sender.id,
      senderName: sender.name,
      senderUpiId: sender.upiId,
      recipientId: recipient.id,
      recipientName: recipient.name,
      recipientUpiId: recipient.upiId,
      amount,
      note: note || '',
      type: TRANSACTION_TYPES.SEND,
      status: TRANSACTION_STATUS.SUCCESS,
      verificationMethod: verificationMethod || 'biometric'
    });

    // Update balances
    await db.updateBalance(sender.id, -amount);
    await db.updateBalance(recipient.id, amount);

    // Get updated sender info
    const updatedSender = await db.findUserById(sender.id);

    res.json({
      success: true,
      message: SUCCESS.TRANSACTION_COMPLETED,
      data: {
        transaction: {
          id: transaction.id,
          amount: transaction.amount,
          recipient: {
            name: recipient.name,
            upiId: recipient.upiId
          },
          status: transaction.status,
          note: transaction.note,
          createdAt: transaction.createdAt
        },
        newBalance: updatedSender.balance
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get transaction history
// @route   GET /api/transactions
// @access  Private
exports.getTransactions = async (req, res, next) => {
  try {
    const { limit = 10, offset = 0 } = req.query;

    const transactions = await db.findTransactionsByUserId(req.user.id);
    const paginatedTransactions = transactions.slice(
      parseInt(offset),
      parseInt(offset) + parseInt(limit)
    );

    const formattedTransactions = paginatedTransactions.map(txn => ({
      id: txn.id,
      type: txn.senderId === req.user.id ? 'sent' : 'received',
      amount: txn.amount,
      otherParty: {
        name: txn.senderId === req.user.id ? txn.recipientName : txn.senderName,
        upiId: txn.senderId === req.user.id ? txn.recipientUpiId : txn.senderUpiId
      },
      status: txn.status,
      note: txn.note,
      createdAt: txn.createdAt
    }));

    res.json({
      success: true,
      data: {
        transactions: formattedTransactions,
        total: transactions.length,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private
exports.getTransaction = async (req, res, next) => {
  try {
    const transaction = await db.findTransactionById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Check if user is part of transaction
    if (transaction.senderId !== req.user.id && transaction.recipientId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: ERRORS.UNAUTHORIZED
      });
    }

    res.json({
      success: true,
      data: {
        id: transaction.id,
        type: transaction.senderId === req.user.id ? 'sent' : 'received',
        sender: {
          name: transaction.senderName,
          upiId: transaction.senderUpiId
        },
        recipient: {
          name: transaction.recipientName,
          upiId: transaction.recipientUpiId
        },
        amount: transaction.amount,
        status: transaction.status,
        note: transaction.note,
        verificationMethod: transaction.verificationMethod,
        createdAt: transaction.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Parse voice command
// @route   POST /api/transactions/parse-command
// @access  Private
exports.parseCommand = async (req, res, next) => {
  try {
    const { command } = req.body;

    if (!command) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a voice command'
      });
    }

    const parsed = parseVoiceCommand(command);

    if (!parsed.action) {
      return res.status(400).json({
        success: false,
        message: 'Could not understand the command. Please try again.'
      });
    }

    res.json({
      success: true,
      data: parsed
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to parse voice commands
function parseVoiceCommand(command) {
  const lowerCommand = command.toLowerCase().trim();
  
  // Check balance
  if (lowerCommand.includes('balance') || lowerCommand.includes('बैलेंस')) {
    return {
      action: 'check_balance',
      confidence: 0.95
    };
  }

  // Show transactions
  if (lowerCommand.includes('transaction') || lowerCommand.includes('history') || 
      lowerCommand.includes('लेनदेन')) {
    return {
      action: 'show_transactions',
      confidence: 0.9
    };
  }

  // Send money patterns
  const sendPatterns = [
    /send\s+(?:rupees?\s+)?(\d+)\s+(?:rupees?\s+)?to\s+(.+)/i,
    /pay\s+(\d+)\s+(?:rupees?\s+)?to\s+(.+)/i,
    /transfer\s+(\d+)\s+(?:rupees?\s+)?to\s+(.+)/i,
    /(\d+)\s+(?:rupees?\s+)?(?:भेजो|भेजें)\s+(.+)/i
  ];

  for (const pattern of sendPatterns) {
    const match = lowerCommand.match(pattern);
    if (match) {
      return {
        action: 'send_money',
        amount: parseInt(match[1]),
        recipient: match[2].trim(),
        confidence: 0.85
      };
    }
  }

  return {
    action: null,
    message: 'Command not recognized'
  };
}
