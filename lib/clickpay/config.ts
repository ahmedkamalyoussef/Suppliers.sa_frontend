import { ClickPayConfig } from "./types";

// ClickPay Configuration
export const clickPayConfig: ClickPayConfig = {
  profileId: process.env.NEXT_PUBLIC_CLICKPAY_PROFILE_ID || "",
  serverKey: process.env.CLICKPAY_SERVER_KEY || "",
  clientKey: process.env.NEXT_PUBLIC_CLICKPAY_CLIENT_KEY || "",
  baseUrl:
    process.env.NEXT_PUBLIC_CLICKPAY_BASE_URL ||
    "https://secure.clickpay.com.sa",
  currency: "SAR",
  language: "ar",
};

// Payment Plans Configuration
export const paymentPlans = [
  {
    id: "basic",
    name: "Basic Plan",
    description: "Perfect for small businesses",
    price: 99,
    currency: "SAR",
    duration: "monthly",
    features: [
      "Up to 5 business listings",
      "Basic analytics",
      "Email support",
      "Standard verification",
    ],
  },
  {
    id: "professional",
    name: "Professional Plan",
    description: "Ideal for growing businesses",
    price: 199,
    currency: "SAR",
    duration: "monthly",
    features: [
      "Up to 20 business listings",
      "Advanced analytics",
      "Priority support",
      "Premium verification",
      "Featured listings",
    ],
    isPopular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise Plan",
    description: "For large organizations",
    price: 399,
    currency: "SAR",
    duration: "monthly",
    features: [
      "Unlimited business listings",
      "Custom analytics dashboard",
      "Dedicated account manager",
      "White-label options",
      "API access",
    ],
  },
];

// ClickPay API Endpoints
export const CLICKPAY_ENDPOINTS = {
  PAYMENT: "/payment/request",
  QUERY: "/payment/query",
  REFUND: "/payment/refund",
  CAPTURE: "/payment/capture",
  VOID: "/payment/void",
} as const;
