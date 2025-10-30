import React, { useState } from 'react';
import { X, Fingerprint, Loader2 } from 'lucide-react';

const VerificationModal = ({ isOpen, onClose, onVerify, amount, recipient }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState('biometric');

  if (!isOpen) return null;

  const handleVerify = async () => {
    setIsVerifying(true);
    
    // Simulate biometric verification delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    onVerify(verificationMethod);
    setIsVerifying(false);
  };

  const handleCancel = () => {
    if (!isVerifying) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        {!isVerifying && (
          <button
            onClick={handleCancel}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        )}

        <div className="text-center">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Fingerprint className="w-10 h-10 text-primary-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Verify Transaction
          </h2>

          <div className="bg-gray-50 rounded-lg p-4 my-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Recipient:</span>
              <span className="font-semibold text-gray-900">{recipient}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="text-gray-600">Amount:</span>
              <span className="font-bold text-primary-600">₹{amount}</span>
            </div>
          </div>

          {isVerifying ? (
            <div className="flex flex-col items-center space-y-4 py-6">
              <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
              <p className="text-gray-600">Verifying...</p>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-6">
                Place your finger on the sensor to verify and complete the transaction
              </p>

              <div className="space-y-3">
                <button
                  onClick={handleVerify}
                  className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  Verify with Biometric
                </button>

                <button
                  onClick={handleCancel}
                  className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;
