import React from 'react';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';

const TransactionCard = ({ transaction, onClick }) => {
  const isSent = transaction.type === 'sent';

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isSent ? 'bg-red-100' : 'bg-green-100'
            }`}
          >
            {isSent ? (
              <ArrowUpRight className="w-6 h-6 text-red-600" />
            ) : (
              <ArrowDownLeft className="w-6 h-6 text-green-600" />
            )}
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">
              {transaction.otherParty.name}
            </h3>
            <p className="text-sm text-gray-500">{transaction.otherParty.upiId}</p>
            <p className="text-xs text-gray-400 mt-1">
              {formatDate(transaction.createdAt)}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p
            className={`text-lg font-bold ${
              isSent ? 'text-red-600' : 'text-green-600'
            }`}
          >
            {isSent ? '- ' : '+ '}
            {formatCurrency(transaction.amount)}
          </p>
          <span
            className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
              transaction.status === 'success'
                ? 'bg-green-100 text-green-700'
                : transaction.status === 'pending'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {transaction.status}
          </span>
        </div>
      </div>

      {transaction.note && (
        <p className="text-sm text-gray-600 mt-2 pl-15">
          Note: {transaction.note}
        </p>
      )}
    </div>
  );
};

export default TransactionCard;
