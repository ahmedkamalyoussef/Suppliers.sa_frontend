"use client";

import React, { useState } from "react";
import { PaymentPlan } from "../lib/clickpay/types";
import { formatCurrency } from "../lib/clickpay/utils";

interface ClickPayButtonProps {
  plan: PaymentPlan;
  onPaymentInitiate: (plan: PaymentPlan) => void;
  className?: string;
  disabled?: boolean;
}

const ClickPayButton: React.FC<ClickPayButtonProps> = ({
  plan,
  onPaymentInitiate,
  className = "",
  disabled = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (disabled || isLoading) return;

    setIsLoading(true);
    try {
      onPaymentInitiate(plan);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`
        w-full px-6 py-3 rounded-lg font-semibold text-white
        transition-all duration-200 transform hover:scale-105
        focus:outline-none focus:ring-4 focus:ring-blue-300
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${
          plan.isPopular
            ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            : "bg-blue-600 hover:bg-blue-700"
        }
        ${className}
      `}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          Processing...
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold">
            {formatCurrency(plan.price, plan.currency)}
          </span>
          <span className="text-sm opacity-90">
            {plan.duration === "monthly" ? "per month" : "one-time"}
          </span>
        </div>
      )}
    </button>
  );
};

export default ClickPayButton;
