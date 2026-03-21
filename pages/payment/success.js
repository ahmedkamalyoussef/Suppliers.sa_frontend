// pages/payment/success.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SubscriptionAPI } from "../../lib/subscription-api";
import { useLanguage } from "../../lib/LanguageContext";

export default function PaymentSuccess() {
  const router = useRouter();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t, language } = useLanguage();

  useEffect(() => {
    const { tap_id, transaction_id } = router.query;

    if (tap_id) {
      verifyPayment(tap_id);
    } else if (transaction_id) {
      checkTransactionStatus(transaction_id);
    } else {
      setError("Missing payment information");
      setLoading(false);
    }
  }, [router.query]);

  const verifyPayment = async (tapId) => {
    try {
      const data = await SubscriptionAPI.verifyPayment(tapId);

      if (data.success) {
        setSubscription(data.data.subscription);
        // Update subscription context if exists
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("subscription-updated"));
        }
      } else {
        setError(data.message || "Payment verification failed");
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  };

  const checkTransactionStatus = async (transactionId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tap/subscription/success?transaction_id=${transactionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (data.success) {
        if (data.data.status === "completed") {
          // Payment was successful, verify with tap_id if available
          const { tap_id } = router.query;
          if (tap_id) {
            verifyPayment(tap_id);
          } else {
            setSubscription(data.data);
          }
        } else {
          setError("Payment is still being processed");
        }
      } else {
        setError(data.message || "Transaction check failed");
      }
    } catch (error) {
      console.error("Error checking transaction:", error);
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {language === "ar"
              ? "جاري التحقق من الدفع..."
              : "Verifying payment..."}
          </h2>
          <p className="text-gray-600">
            {language === "ar"
              ? "يرجى الانتظار بينما نتحقق من حالة دفعتك"
              : "Please wait while we verify your payment status"}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {language === "ar" ? "حدث خطأ" : "Something went wrong"}
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => router.push("/subscription")}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {language === "ar" ? "العودة للباقات" : "Back to Plans"}
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              {language === "ar" ? "لوحة التحكم" : "Dashboard"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-green-600 text-6xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {language === "ar"
              ? "تم تفعيل اشتراكك بنجاح!"
              : "Your subscription has been activated!"}
          </h1>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {language === "ar"
                ? "تفاصيل الاشتراك:"
                : "Subscription Details:"}
            </h2>

            {subscription && (
              <div className="space-y-3 text-right lg:text-left">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    {language === "ar" ? "الباقة:" : "Plan:"}
                  </span>
                  <span className="font-semibold">
                    {subscription.subscription_plan?.display_name}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    {language === "ar" ? "تاريخ البدء:" : "Start Date:"}
                  </span>
                  <span className="font-semibold">
                    {new Date(subscription.starts_at).toLocaleDateString(
                      language === "ar" ? "ar-SA" : "en-US",
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    {language === "ar" ? "تاريخ الانتهاء:" : "End Date:"}
                  </span>
                  <span className="font-semibold">
                    {new Date(subscription.ends_at).toLocaleDateString(
                      language === "ar" ? "ar-SA" : "en-US",
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    {language === "ar"
                      ? "المبلغ المدفوع:"
                      : "Amount Paid:"}
                  </span>
                  <span className="font-semibold">
                    {subscription.paid_amount} {subscription.currency}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    {language === "ar" ? "الحالة:" : "Status:"}
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {language === "ar" ? "نشط" : "Active"}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              {language === "ar"
                ? "📧 تم إرسال تأكيد الاشتراك إلى بريدك الإلكتروني. يمكنك الآن الاستمتاع بجميع مميزات الباقة المميزة!"
                : "📧 A subscription confirmation has been sent to your email. You can now enjoy all premium features!"}
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              {language === "ar"
                ? "اذهب إلى لوحة التحكم"
                : "Go to Dashboard"}
            </button>

            <button
              onClick={() => router.push("/subscription")}
              className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              {language === "ar"
                ? "إدارة الاشتراك"
                : "Manage Subscription"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
