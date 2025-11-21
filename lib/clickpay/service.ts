import axios from "axios";
import {
  ClickPayConfig,
  ClickPayPaymentRequest,
  ClickPayPaymentResponse,
  ClickPayTransactionStatus,
  ClickPayRefundRequest,
  ClickPayRefundResponse,
  PaymentResult,
} from "./types";
import { clickPayConfig, CLICKPAY_ENDPOINTS } from "./config";

class ClickPayService {
  private config: ClickPayConfig;

  constructor(config: ClickPayConfig = clickPayConfig) {
    this.config = config;
  }

  /**
   * Create a payment request
   */
  async createPayment(
    paymentData: Partial<ClickPayPaymentRequest>
  ): Promise<PaymentResult> {
    try {
      const paymentRequest: ClickPayPaymentRequest = {
        profile_id: this.config.profileId,
        tran_type: "sale",
        tran_class: "ecom",
        cart_currency: this.config.currency,
        paypage_lang: this.config.language,
        ...paymentData,
      } as ClickPayPaymentRequest;

      const response = await axios.post(
        `${this.config.baseUrl}${CLICKPAY_ENDPOINTS.PAYMENT}`,
        paymentRequest,
        {
          headers: {
            Authorization: this.config.serverKey,
            "Content-Type": "application/json",
          },
        }
      );

      const result: ClickPayPaymentResponse = response.data;

      if (result.result === "success") {
        return {
          success: true,
          transactionId: result.transaction_id,
          message: result.response_message,
          redirectUrl: result.redirect_url || result.payment_url,
        };
      } else {
        return {
          success: false,
          message: result.response_message,
        };
      }
    } catch (error: any) {
      console.error("ClickPay payment creation error:", error);
      return {
        success: false,
        message:
          error.response?.data?.response_message || "Payment creation failed",
      };
    }
  }

  /**
   * Query transaction status
   */
  async queryTransaction(
    transactionId: string
  ): Promise<ClickPayTransactionStatus | null> {
    try {
      const response = await axios.post(
        `${this.config.baseUrl}${CLICKPAY_ENDPOINTS.QUERY}`,
        {
          profile_id: this.config.profileId,
          transaction_id: transactionId,
        },
        {
          headers: {
            Authorization: this.config.serverKey,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("ClickPay transaction query error:", error);
      return null;
    }
  }

  /**
   * Process refund
   */
  async processRefund(
    refundData: ClickPayRefundRequest
  ): Promise<PaymentResult> {
    try {
      // نتجنب تكرار profile_id
      const { profile_id, ...cleanRefundData } = refundData;

      const response = await axios.post(
        `${this.config.baseUrl}${CLICKPAY_ENDPOINTS.REFUND}`,
        {
          profile_id: this.config.profileId, // هذا الوحيد
          ...cleanRefundData,
        },
        {
          headers: {
            Authorization: this.config.serverKey,
            "Content-Type": "application/json",
          },
        }
      );

      const result: ClickPayRefundResponse = response.data;

      if (result.result === "success") {
        return {
          success: true,
          transactionId: result.transaction_id,
          message: result.response_message,
        };
      } else {
        return {
          success: false,
          message: result.response_message,
        };
      }
    } catch (error: any) {
      console.error("ClickPay refund error:", error);
      return {
        success: false,
        message: error.response?.data?.response_message || "Refund failed",
      };
    }
  }

  /**
   * Generate unique cart ID
   */
  generateCartId(): string {
    return `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Format amount for ClickPay (multiply by 100 for cents)
   */
  formatAmount(amount: number): number {
    return Math.round(amount * 100);
  }

  /**
   * Validate payment data
   */
  validatePaymentData(data: Partial<ClickPayPaymentRequest>): string[] {
    const errors: string[] = [];

    if (!data.cart_id) errors.push("Cart ID is required");
    if (!data.cart_amount || data.cart_amount <= 0)
      errors.push("Valid cart amount is required");
    if (!data.cart_description) errors.push("Cart description is required");
    if (!data.customer_details) errors.push("Customer details are required");
    if (data.customer_details && !data.customer_details.name)
      errors.push("Customer name is required");
    if (data.customer_details && !data.customer_details.email)
      errors.push("Customer email is required");
    if (data.customer_details && !data.customer_details.phone)
      errors.push("Customer phone is required");

    return errors;
  }
}

// Export singleton instance
export const clickPayService = new ClickPayService();

// Export class for custom instances
export { ClickPayService };
