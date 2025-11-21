"use client";

import React, { useState } from "react";
import { PaymentPlan } from "../lib/clickpay/types";
import {
  formatCurrency,
  isValidEmail,
  isValidSaudiPhone,
  sanitizeCustomerData,
  generatePaymentDescription,
} from "../lib/clickpay/utils";

interface ClickPayPaymentFormProps {
  plan: PaymentPlan;
  onPaymentSuccess: (transactionId: string) => void;
  onPaymentError: (error: string) => void;
  onCancel: () => void;
}

interface CustomerData {
  name: string;
  email: string;
  phone: string;
  street1: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}

const ClickPayPaymentForm: React.FC<ClickPayPaymentFormProps> = ({
  plan,
  onPaymentSuccess,
  onPaymentError,
  onCancel,
}) => {
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: "",
    email: "",
    phone: "",
    street1: "",
    city: "",
    state: "",
    country: "SA",
    zip: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!customerData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!customerData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(customerData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!customerData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!isValidSaudiPhone(customerData.phone)) {
      newErrors.phone = "Please enter a valid Saudi phone number";
    }

    if (!customerData.street1.trim()) {
      newErrors.street1 = "Street address is required";
    }

    if (!customerData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!customerData.zip.trim()) {
      newErrors.zip = "ZIP code is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const cartId = `cart_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const sanitizedCustomer = sanitizeCustomerData(customerData);

      const paymentData = {
        cart_id: cartId,
        cart_amount: plan.price,
        cart_description: generatePaymentDescription(plan),
        customer_details: sanitizedCustomer,
        return: `${window.location.origin}/payment/success`,
        callback: `${window.location.origin}/api/payment/callback`,
      };

      const response = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();

      if (result.success && result.redirectUrl) {
        // Redirect to ClickPay payment page
        window.location.href = result.redirectUrl;
      } else {
        onPaymentError(result.message);
      }
    } catch (error: any) {
      onPaymentError(error.message || "Payment initialization failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof CustomerData, value: string) => {
    setCustomerData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Complete Payment
        </h2>
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900">{plan.name}</h3>
          <p className="text-blue-700 text-sm">{plan.description}</p>
          <p className="text-2xl font-bold text-blue-900 mt-2">
            {formatCurrency(plan.price, plan.currency)}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            value={customerData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your full name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            value={customerData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your email address"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            value={customerData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="05xxxxxxxx"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Street Address *
          </label>
          <input
            type="text"
            value={customerData.street1}
            onChange={(e) => handleInputChange("street1", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.street1 ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your street address"
          />
          {errors.street1 && (
            <p className="text-red-500 text-sm mt-1">{errors.street1}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <input
              type="text"
              value={customerData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.city ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="City"
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ZIP Code *
            </label>
            <input
              type="text"
              value={customerData.zip}
              onChange={(e) => handleInputChange("zip", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.zip ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="ZIP"
            />
            {errors.zip && (
              <p className="text-red-500 text-sm mt-1">{errors.zip}</p>
            )}
          </div>
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? "Processing..."
              : `Pay ${formatCurrency(plan.price, plan.currency)}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClickPayPaymentForm;
