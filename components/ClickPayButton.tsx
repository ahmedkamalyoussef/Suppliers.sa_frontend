"use client";

import React, { useState } from "react";
import { PaymentPlan } from "../lib/clickpay/types";
import { useLanguage } from "../lib/LanguageContext";

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
  const { t } = useLanguage();

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
          {t("subscription.processing")}
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold flex items-center">
            {plan.price}
            <img
              src="/riyal.svg"
              alt="SAR"
              className="w-4 h-4 inline-block ml-1"
            />
          </span>
          <span className="text-sm opacity-90">
            {plan.duration === "monthly"
              ? t("subscription.perMonth")
              : t("subscription.perYear")}
          </span>
        </div>
      )}
    </button>
  );
};

export default ClickPayButton;
