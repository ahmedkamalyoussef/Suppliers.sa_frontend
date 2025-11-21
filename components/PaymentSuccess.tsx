"use client";

import React from "react";

interface PaymentSuccessProps {
  transactionId: string;
  planName: string;
  amount: number;
  currency: string;
  onContinue: () => void;
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({
  transactionId,
  planName,
  amount,
  currency,
  onContinue,
}) => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
      <div className="mb-6">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h2>

        <p className="text-gray-600 mb-4">
          Your payment has been processed successfully.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="text-sm text-gray-600 mb-2">Transaction Details</div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Plan:</span>
            <span>{planName}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Amount:</span>
            <span className="font-bold">
              {new Intl.NumberFormat("ar-SA", {
                style: "currency",
                currency: currency,
                minimumFractionDigits: 2,
              }).format(amount)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Transaction ID:</span>
            <span className="font-mono text-sm">{transactionId}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={onContinue}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Continue to Dashboard
        </button>

        <p className="text-sm text-gray-500">
          You will receive a confirmation email shortly.
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
