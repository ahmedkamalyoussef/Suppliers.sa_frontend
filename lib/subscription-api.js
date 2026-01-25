// lib/subscription-api.js
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export class SubscriptionAPI {
  static async getPlans() {
    try {
      const response = await fetch(`${API_BASE_URL}/tap/subscription/plans`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching plans:", error);
      throw error;
    }
  }

  static async createPayment(planId, customerData, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/tap/subscription/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          plan_id: planId,
          customer: customerData,
        }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating payment:", error);
      throw error;
    }
  }

  static async getCurrentSubscription(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/tap/subscription/current`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching current subscription:", error);
      throw error;
    }
  }

  static async getSubscriptionHistory(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/tap/subscription/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching subscription history:", error);
      throw error;
    }
  }

  static async verifyPayment(tapId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/tap/subscription/success?tap_id=${tapId}`,
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error verifying payment:", error);
      throw error;
    }
  }
}
