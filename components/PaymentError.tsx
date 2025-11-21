"use client";

import React from "react";

interface PaymentErrorProps {
  error: string;
  onRetry: () => void;
  onCancel: () => void;
}

const PaymentError: React.FC<PaymentErrorProps> = ({
  error,
  onRetry,
  onCancel,
}) => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
      <div className="mb-6">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
          <svg
            className="h-8 w-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Failed
        </h2>

        <p className="text-gray-600 mb-4">
          {error || "An error occurred while processing your payment."}
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={onRetry}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Try Again
        </button>

        <button
          onClick={onCancel}
          className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Cancel
        </button>

        <p className="text-sm text-gray-500">
          If the problem persists, please contact our support team.
        </p>
      </div>
    </div>
  );
};

export default PaymentError;
