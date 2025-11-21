// ClickPay Types and Interfaces

export interface ClickPayConfig {
  profileId: string;
  serverKey: string;
  clientKey: string;
  baseUrl: string;
  currency: string;
  language: string;
}

export interface ClickPayPaymentRequest {
  profile_id: string;
  tran_type: "sale" | "auth" | "capture" | "void" | "refund";
  tran_class: "ecom" | "recurring" | "moto";
  cart_id: string;
  cart_currency: string;
  cart_amount: number;
  cart_description: string;
  paypage_lang: string;
  customer_details: {
    name: string;
    email: string;
    phone: string;
    street1: string;
    city: string;
    state: string;
    country: string;
    zip: string;
  };
  shipping_details?: {
    name: string;
    email: string;
    phone: string;
    street1: string;
    city: string;
    state: string;
    country: string;
    zip: string;
  };
  billing_details?: {
    name: string;
    email: string;
    phone: string;
    street1: string;
    city: string;
    state: string;
    country: string;
    zip: string;
  };
  hide_shipping?: boolean;
  frammed?: boolean;
  return?: string;
  callback?: string;
  redirect_url?: string;
}

export interface ClickPayPaymentResponse {
  result: string;
  response_code: string;
  response_message: string;
  transaction_id?: string;
  session_id?: string;
  redirect_url?: string;
  payment_url?: string;
}

export interface ClickPayTransactionStatus {
  result: string;
  response_code: string;
  response_message: string;
  transaction_id: string;
  transaction_status: string;
  transaction_type: string;
  transaction_class: string;
  cart_id: string;
  cart_currency: string;
  cart_amount: number;
  cart_description: string;
  customer_details: {
    name: string;
    email: string;
    phone: string;
    street1: string;
    city: string;
    state: string;
    country: string;
    zip: string;
  };
  payment_result: {
    response_status: string;
    response_code: string;
    response_message: string;
    acquirer_message: string;
    acquirer_rrn: string;
    transaction_time: string;
  };
}

export interface ClickPayRefundRequest {
  profile_id: string;
  transaction_id: string;
  amount: number;
  currency: string;
}

export interface ClickPayRefundResponse {
  result: string;
  response_code: string;
  response_message: string;
  transaction_id: string;
  refund_id: string;
  refund_amount: number;
  refund_currency: string;
}

export interface PaymentPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: string;
  features: string[];
  isPopular?: boolean;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  message: string;
  redirectUrl?: string;
}
