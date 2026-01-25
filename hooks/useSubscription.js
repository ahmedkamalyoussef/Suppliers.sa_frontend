// hooks/useSubscription.js
import { useState, useEffect } from "react";
import { SubscriptionAPI } from "../lib/subscription-api";

export function useSubscription() {
  const [subscription, setSubscription] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const data = await SubscriptionAPI.getCurrentSubscription(token);

      if (data.success && data.data) {
        setSubscription(data.data);
        setIsPremium(true);
      } else {
        setIsPremium(false);
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
      setIsPremium(false);
    } finally {
      setLoading(false);
    }
  };

  const refreshSubscription = () => {
    setLoading(true);
    checkSubscription();
  };

  return { subscription, isPremium, loading, refreshSubscription };
}
