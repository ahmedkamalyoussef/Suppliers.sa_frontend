import { PaymentPlan } from "./types";

/**
 * Utility functions for ClickPay integration
 */

/**
 * Format currency for display
 */
export const formatCurrency = (
  amount: number,
  currency: string = "SAR"
): string => {
  return new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format currency for ClickPay API (in halalas)
 */
export const formatAmountForAPI = (amount: number): number => {
  return Math.round(amount * 100);
};

/**
 * Parse amount from ClickPay API (from halalas to SAR)
 */
export const parseAmountFromAPI = (amount: number): number => {
  return amount / 100;
};

/**
 * Generate unique transaction reference
 */
export const generateTransactionRef = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `TXN_${timestamp}_${random}`;
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate Saudi phone number
 */
export const isValidSaudiPhone = (phone: string): boolean => {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, "");

  // Check if it's a valid Saudi phone number
  // Saudi numbers can start with +966, 966, or 0
  const saudiRegex = /^(\+966|966|0)?[5-9][0-9]{8}$/;
  return saudiRegex.test(cleanPhone);
};

/**
 * Format Saudi phone number
 */
export const formatSaudiPhone = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, "");

  if (cleanPhone.startsWith("966")) {
    return `+${cleanPhone}`;
  } else if (cleanPhone.startsWith("0")) {
    return `+966${cleanPhone.substring(1)}`;
  } else if (cleanPhone.length === 9) {
    return `+966${cleanPhone}`;
  }

  return phone;
};

/**
 * Get payment plan by ID
 */
export const getPaymentPlanById = (
  plans: PaymentPlan[],
  planId: string
): PaymentPlan | undefined => {
  return plans.find((plan) => plan.id === planId);
};

/**
 * Calculate subscription total with VAT
 */
export const calculateTotalWithVAT = (
  amount: number,
  vatRate: number = 0.15
): number => {
  return amount + amount * vatRate;
};

/**
 * Generate payment description
 */
export const generatePaymentDescription = (
  plan: PaymentPlan,
  duration: string = "monthly"
): string => {
  return `Subscription to ${plan.name} - ${duration} plan`;
};

/**
 * Sanitize customer data for ClickPay
 */
export const sanitizeCustomerData = (customer: any) => {
  return {
    name: customer.name?.trim() || "",
    email: customer.email?.trim().toLowerCase() || "",
    phone: formatSaudiPhone(customer.phone || ""),
    street1: customer.street1?.trim() || "",
    city: customer.city?.trim() || "",
    state: customer.state?.trim() || "",
    country: customer.country?.trim() || "SA",
    zip: customer.zip?.trim() || "",
  };
};

/**
 * Check if payment is successful based on response
 */
export const isPaymentSuccessful = (response: any): boolean => {
  return (
    response?.result === "success" &&
    response?.response_code === "000" &&
    response?.transaction_status === "paid"
  );
};

/**
 * Get payment status message
 */
export const getPaymentStatusMessage = (status: string): string => {
  const statusMessages: { [key: string]: string } = {
    paid: "Payment completed successfully",
    pending: "Payment is pending",
    failed: "Payment failed",
    cancelled: "Payment was cancelled",
    refunded: "Payment was refunded",
    voided: "Payment was voided",
  };

  return statusMessages[status] || "Unknown payment status";
};

/**
 * Generate callback URL for ClickPay
 */
export const generateCallbackUrl = (
  baseUrl: string,
  transactionId: string
): string => {
  return `${baseUrl}/api/payment/callback?transaction_id=${transactionId}`;
};

/**
 * Generate return URL for ClickPay
 */
export const generateReturnUrl = (
  baseUrl: string,
  success: boolean = true
): string => {
  return `${baseUrl}/payment/${success ? "success" : "failure"}`;
};
