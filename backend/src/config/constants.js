module.exports = {
  TRANSACTION_STATUS: {
    PENDING: 'pending',
    SUCCESS: 'success',
    FAILED: 'failed',
    CANCELLED: 'cancelled'
  },

  TRANSACTION_TYPES: {
    SEND: 'send',
    RECEIVE: 'receive',
    REQUEST: 'request'
  },

  VERIFICATION_METHODS: {
    BIOMETRIC: 'biometric',
    OTP: 'otp',
    PIN: 'pin'
  },

  DEFAULTS: {
    INITIAL_BALANCE: 10000,
    TRANSACTION_LIMIT: 100000,
    DAILY_LIMIT: 500000
  },

  ERRORS: {
    INSUFFICIENT_BALANCE: 'Insufficient balance',
    INVALID_RECIPIENT: 'Invalid recipient',
    TRANSACTION_LIMIT_EXCEEDED: 'Transaction limit exceeded',
    INVALID_AMOUNT: 'Invalid amount',
    USER_NOT_FOUND: 'User not found',
    INVALID_CREDENTIALS: 'Invalid credentials',
    UNAUTHORIZED: 'Unauthorized access',
    SERVER_ERROR: 'Internal server error'
  },

  SUCCESS: {
    TRANSACTION_COMPLETED: 'Transaction completed successfully',
    USER_REGISTERED: 'User registered successfully',
    LOGIN_SUCCESS: 'Login successful',
    VERIFICATION_SUCCESS: 'Verification successful'
  }
};
