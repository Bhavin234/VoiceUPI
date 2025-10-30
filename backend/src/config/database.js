const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const { DEFAULTS } = require('../config/constants');

// In-memory database (for MVP)
class Database {
  constructor() {
    this.users = new Map();
    this.transactions = new Map();
    this.seedData();
  }

  // Seed initial demo data
  async seedData() {
    const demoUsers = [
      {
        id: uuidv4(),
        name: 'Rajesh Kumar',
        phone: '9876543210',
        upiId: 'rajesh@voicepay',
        pin: await bcrypt.hash('1234', 10),
        balance: 25000,
        language: 'en',
        createdAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Priya Sharma',
        phone: '9876543211',
        upiId: 'priya@voicepay',
        pin: await bcrypt.hash('1234', 10),
        balance: 15000,
        language: 'hi',
        createdAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Amit Patel',
        phone: '9876543212',
        upiId: 'amit@voicepay',
        pin: await bcrypt.hash('1234', 10),
        balance: 30000,
        language: 'en',
        createdAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Sunita Devi',
        phone: '9876543213',
        upiId: 'sunita@voicepay',
        pin: await bcrypt.hash('1234', 10),
        balance: 20000,
        language: 'hi',
        createdAt: new Date()
      }
    ];

    demoUsers.forEach(user => {
      this.users.set(user.id, user);
    });

    console.log('✅ Seeded demo users:', demoUsers.length);
  }

  // User operations
  async createUser(userData) {
    const id = uuidv4();
    const hashedPin = await bcrypt.hash(userData.pin, 10);
    
    const user = {
      id,
      name: userData.name,
      phone: userData.phone,
      upiId: userData.upiId || `${userData.phone}@voicepay`,
      pin: hashedPin,
      balance: DEFAULTS.INITIAL_BALANCE,
      language: userData.language || 'en',
      createdAt: new Date()
    };

    this.users.set(id, user);
    return user;
  }

  async findUserById(id) {
    return this.users.get(id);
  }

  async findUserByPhone(phone) {
    return Array.from(this.users.values()).find(user => user.phone === phone);
  }

  async findUserByUpiId(upiId) {
    return Array.from(this.users.values()).find(user => user.upiId === upiId);
  }

  async findUserByNameOrPhone(identifier) {
    const normalized = identifier.toLowerCase().trim();
    return Array.from(this.users.values()).find(user => 
      user.name.toLowerCase().includes(normalized) || 
      user.phone.includes(normalized) ||
      user.upiId.toLowerCase().includes(normalized)
    );
  }

  async updateUser(id, updates) {
    const user = this.users.get(id);
    if (!user) return null;

    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateBalance(userId, amount) {
    const user = this.users.get(userId);
    if (!user) return null;

    user.balance += amount;
    user.updatedAt = new Date();
    this.users.set(userId, user);
    return user;
  }

  // Transaction operations
  async createTransaction(transactionData) {
    const id = uuidv4();
    const transaction = {
      id,
      ...transactionData,
      createdAt: new Date()
    };

    this.transactions.set(id, transaction);
    return transaction;
  }

  async findTransactionById(id) {
    return this.transactions.get(id);
  }

  async findTransactionsByUserId(userId) {
    return Array.from(this.transactions.values())
      .filter(txn => txn.senderId === userId || txn.recipientId === userId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  async getAllTransactions() {
    return Array.from(this.transactions.values())
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  // Helper methods
  async getAllUsers() {
    return Array.from(this.users.values());
  }

  async verifyPin(userId, pin) {
    const user = this.users.get(userId);
    if (!user) return false;
    return await bcrypt.compare(pin, user.pin);
  }
}

// Singleton instance
const db = new Database();

module.exports = db;
