import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Send, LogOut, Volume2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { transactionAPI } from '../services/api';
import voiceService from '../services/voiceService';
import VoiceInput from '../components/VoiceInput';
import BalanceDisplay from '../components/BalanceDisplay';
import VerificationModal from '../components/VerificationModal';
import { parseVoiceCommand, formatCurrency } from '../utils/helpers';

const Home = () => {
  const navigate = useNavigate();
  const { user, balance, logout, updateBalance, language } = useApp();
  const [showVerification, setShowVerification] = useState(false);
  const [pendingTransaction, setPendingTransaction] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  useEffect(() => {
    // Welcome message
    if (user) {
      voiceService.speak(`Welcome ${user.name}. Your balance is ${balance} rupees.`, language);
    }
  }, []);

  const handleVoiceCommand = async (transcript) => {
    setMessage('');
    const parsed = parseVoiceCommand(transcript);

    switch (parsed.action) {
      case 'check_balance':
        await voiceService.speak(`Your current balance is ${balance} rupees`, language);
        setMessage(`Balance: ${formatCurrency(balance)}`);
        setMessageType('success');
        break;

      case 'show_transactions':
        await voiceService.speak('Opening transaction history', language);
        navigate('/transactions');
        break;

      case 'send_money':
        if (parsed.amount && parsed.recipient) {
          setPendingTransaction({
            amount: parsed.amount,
            recipient: parsed.recipient
          });
          setShowVerification(true);
          await voiceService.speak(
            `Sending ${parsed.amount} rupees to ${parsed.recipient}. Please verify.`,
            language
          );
        }
        break;

      default:
        const errorMsg = 'Sorry, I did not understand. Please try again.';
        await voiceService.speak(errorMsg, language);
        setMessage(errorMsg);
        setMessageType('error');
    }
  };

  const handleVerification = async (method) => {
    setShowVerification(false);
    setIsProcessing(true);

    try {
      const response = await transactionAPI.sendMoney({
        recipientIdentifier: pendingTransaction.recipient,
        amount: pendingTransaction.amount,
        verificationMethod: method
      });

      const { transaction, newBalance } = response.data.data;
      updateBalance(newBalance);

      const successMsg = `Transaction successful. ${pendingTransaction.amount} rupees sent to ${pendingTransaction.recipient}. Your new balance is ${newBalance} rupees.`;
      await voiceService.speak(successMsg, language);
      
      setMessage(`✓ Payment of ${formatCurrency(pendingTransaction.amount)} sent successfully!`);
      setMessageType('success');
      
      setPendingTransaction(null);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Transaction failed. Please try again.';
      await voiceService.speak(errorMsg, language);
      setMessage(errorMsg);
      setMessageType('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLogout = async () => {
    await voiceService.speak('Logging out. Goodbye!', language);
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">VoicePay</h1>
            <p className="text-sm text-gray-600">{user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Balance Card */}
        <BalanceDisplay balance={balance} upiId={user?.upiId} />

        {/* Voice Input Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-6">
            <Volume2 className="w-12 h-12 text-primary-600 mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Voice Commands
            </h2>
            <p className="text-gray-600">
              Speak your command to make a payment, check balance, or view transactions
            </p>
          </div>

          <VoiceInput
            onCommand={handleVoiceCommand}
            language={language}
          />

          {message && (
            <div
              className={`mt-6 p-4 rounded-lg text-center ${
                messageType === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message}
            </div>
          )}
        </div>

        {/* Example Commands */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Try These Commands:
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              'Send 500 rupees to Rajesh',
              'Check my balance',
              'Show transaction history',
              'Pay 1000 to Priya'
            ].map((cmd, index) => (
              <div
                key={index}
                className="bg-gray-50 p-3 rounded-lg border border-gray-200"
              >
                <p className="text-sm text-gray-700">"{cmd}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/transactions')}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow flex items-center space-x-4"
          >
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <History className="w-6 h-6 text-primary-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Transaction History</h3>
              <p className="text-sm text-gray-600">View all transactions</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/send')}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow flex items-center space-x-4"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Send className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Send Money</h3>
              <p className="text-sm text-gray-600">Manual payment</p>
            </div>
          </button>
        </div>
      </main>

      {/* Verification Modal */}
      {showVerification && pendingTransaction && (
        <VerificationModal
          isOpen={showVerification}
          onClose={() => setShowVerification(false)}
          onVerify={handleVerification}
          amount={pendingTransaction.amount}
          recipient={pendingTransaction.recipient}
        />
      )}

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-700 font-medium">Processing transaction...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
