# VoicePay MVP - Source Code Package

## 📦 Project Structure

```
VoiceUPI/
├── backend/                  # Node.js + Express API Server
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   │   ├── config.js
│   │   │   ├── constants.js
│   │   │   └── database.js
│   │   ├── controllers/     # Request handlers
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   └── transactionController.js
│   │   ├── middleware/      # Auth & error handling
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── routes/          # API routes
│   │   │   ├── auth.js
│   │   │   ├── users.js
│   │   │   └── transactions.js
│   │   └── server.js        # Server entry point
│   ├── package.json
│   ├── .env.example
│   └── .env
│
├── frontend/                # React + Vite Web Application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── VoiceInput.jsx
│   │   │   ├── BalanceDisplay.jsx
│   │   │   ├── TransactionCard.jsx
│   │   │   └── VerificationModal.jsx
│   │   ├── pages/           # Main application pages
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Home.jsx
│   │   │   └── Transactions.jsx
│   │   ├── services/        # API & Voice services
│   │   │   ├── api.js
│   │   │   └── voiceService.js
│   │   ├── context/         # Global state management
│   │   │   └── AppContext.jsx
│   │   ├── utils/           # Helper functions
│   │   │   └── helpers.js
│   │   ├── App.jsx          # Main app component
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .env
│
└── README.md                # Project documentation
```

## 🚀 Technology Stack

### Backend
- **Runtime:** Node.js v18+
- **Framework:** Express.js
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Security:** Helmet, CORS, express-rate-limit
- **Database:** In-memory (for MVP demo)

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Voice:** Web Speech API
- **Icons:** Lucide React

## 📋 Prerequisites

- Node.js v18.0.0 or higher
- npm v9.0.0 or higher
- Modern web browser (Chrome/Edge recommended for voice features)

## 🔧 Installation & Setup

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Configure Backend Environment

Copy `.env.example` to `.env` (already configured for local development):

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=voicepay_dev_secret_key_2025
JWT_EXPIRE=7d
USE_MEMORY_DB=true
ALLOWED_ORIGINS=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 4. Configure Frontend Environment

The `.env` file is already configured:

```env
VITE_API_URL=http://localhost:5000
```

## ▶️ Running the Application

### Start Backend Server (Terminal 1)

```bash
cd backend
npm run dev
```

Expected output:
```
==================================================
🎙️  VoicePay Backend Server
==================================================
✅ Server running in development mode
🚀 Server started on port 5000
📡 API: http://localhost:5000
🏥 Health: http://localhost:5000/health
==================================================
✅ Seeded demo users: 4
```

### Start Frontend Server (Terminal 2)

```bash
cd frontend
npm run dev
```

Expected output:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

## 🧪 Testing the Application

### 1. Access Application
Open browser: `http://localhost:3000`

### 2. Login with Demo Account
- **Phone:** 9876543210
- **PIN:** 1234

### 3. Test Voice Commands

Click the microphone button and speak:

**Transaction Commands:**
- "Send 500 rupees to Priya"
- "Pay 1000 to Rajesh"
- "Transfer 200 to Amit"
- "Give 300 to Sunita"

**Info Commands:**
- "Check my balance"
- "Show transaction history"

### 4. Available Demo Users

| Name | Phone | PIN | Balance | UPI ID |
|------|-------|-----|---------|--------|
| Rajesh Kumar | 9876543210 | 1234 | ₹25,000 | rajesh@voicepay |
| Priya Sharma | 9876543211 | 1234 | ₹15,000 | priya@voicepay |
| Amit Patel | 9876543212 | 1234 | ₹30,000 | amit@voicepay |
| Sunita Devi | 9876543213 | 1234 | ₹20,000 | sunita@voicepay |

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify-otp` - Verify OTP (mock)
- `POST /api/auth/verify-biometric` - Biometric verification (mock)

### User Management
- `GET /api/users/profile` - Get user profile
- `GET /api/users/balance` - Get balance
- `PUT /api/users/settings` - Update settings
- `GET /api/users/search?q=query` - Search users
- `GET /api/users/contacts` - Get all contacts

### Transactions
- `POST /api/transactions/send` - Send money
- `GET /api/transactions?limit=10&offset=0` - Get transaction history
- `GET /api/transactions/:id` - Get single transaction
- `POST /api/transactions/parse-command` - Parse voice command

## 🎯 Key Features

### Implemented ✅
- Voice-first payment interface
- Speech-to-text command processing
- Text-to-speech audio feedback
- Multi-language support (English + Hindi)
- JWT authentication
- Transaction processing
- Balance management
- Transaction history
- Biometric verification (mock)
- Responsive design
- Accessibility-focused UI

### Core Voice Commands
- Send/Pay/Transfer money
- Check balance
- View transaction history
- Natural language processing
- Error handling with voice feedback

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Rate limiting
- Input validation
- XSS protection (Helmet)
- Secure headers

## 📱 Browser Compatibility

**Best Experience:**
- ✅ Google Chrome 90+
- ✅ Microsoft Edge 90+

**Limited Support:**
- ⚠️ Safari (partial voice support)
- ⚠️ Firefox (limited voice recognition)

**Note:** Voice features require microphone permissions and work on localhost or HTTPS.

## 🏗️ Architecture

### Backend Architecture
```
HTTP Request → Express Server → Routes → Middleware (Auth) → 
Controllers → Services → Database → Response
```

### Frontend Architecture
```
User Input → React Components → Context (State) → 
API Service → Backend → Update State → Re-render UI
```

### Voice Processing Flow
```
User Speech → Web Speech API (STT) → Command Parser → 
Action Handler → API Call → TTS Feedback
```

## 📊 Project Statistics

- **Total Files:** 35+
- **Lines of Code:** ~4,500+
- **Components:** 4 React components
- **API Endpoints:** 13 endpoints
- **Demo Users:** 4 pre-seeded users
- **Supported Languages:** 2 (English + Hindi)

## 🚢 Deployment

See `DEPLOYMENT.md` for detailed deployment instructions for:
- Backend: Railway, Heroku, or DigitalOcean
- Frontend: Vercel or Netlify

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Support

For issues or questions:
- Check browser console for errors
- Ensure microphone permissions are granted
- Verify both servers are running
- Test with demo credentials first

## 🌟 Future Enhancements

- Real UPI API integration
- Voice biometric authentication
- More regional languages
- Offline transaction queue
- QR code payments
- Bill payment integration
- AI-powered fraud detection

---

**Built with ❤️ for Financial Inclusion**

**VoicePay MVP v1.0.0**
