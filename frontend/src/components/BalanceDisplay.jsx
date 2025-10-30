import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Wallet } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

const BalanceDisplay = ({ balance, upiId }) => {
  const [showBalance, setShowBalance] = useState(true);
  const [animatedBalance, setAnimatedBalance] = useState(balance);

  useEffect(() => {
    // Animate balance changes
    const duration = 500;
    const steps = 20;
    const increment = (balance - animatedBalance) / steps;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      setAnimatedBalance((prev) => {
        const next = prev + increment;
        return step === steps ? balance : next;
      });

      if (step === steps) {
        clearInterval(interval);
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [balance]);

  return (
    <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl shadow-xl p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Wallet className="w-5 h-5" />
          <span className="text-sm font-medium opacity-90">Wallet Balance</span>
        </div>
        <button
          onClick={() => setShowBalance(!showBalance)}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
          aria-label={showBalance ? 'Hide balance' : 'Show balance'}
        >
          {showBalance ? (
            <Eye className="w-5 h-5" />
          ) : (
            <EyeOff className="w-5 h-5" />
          )}
        </button>
      </div>

      <div className="mb-4">
        {showBalance ? (
          <h2 className="text-4xl font-bold tracking-tight">
            {formatCurrency(Math.round(animatedBalance))}
          </h2>
        ) : (
          <h2 className="text-4xl font-bold tracking-tight">₹ ••••••</h2>
        )}
      </div>

      {upiId && (
        <div className="flex items-center space-x-2 text-sm opacity-90">
          <span>UPI ID:</span>
          <span className="font-mono">{upiId}</span>
        </div>
      )}
    </div>
  );
};

export default BalanceDisplay;
