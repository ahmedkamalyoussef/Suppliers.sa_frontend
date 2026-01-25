// components/SubscriptionPlans.jsx
import { useState, useEffect } from "react";
import { SubscriptionAPI } from "../lib/subscription-api";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

export default function SubscriptionPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const router = useRouter();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const data = await SubscriptionAPI.getPlans();
      if (data.success) {
        setPlans(data.data);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  const handleSubscribe = async (planId) => {
    setLoading(true);
    setSelectedPlan(planId);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        // Redirect to login if not authenticated
        router.push("/login?redirect=" + encodeURIComponent(router.asPath));
        return;
      }

      // Get user data from localStorage or state
      const userData = JSON.parse(localStorage.getItem("user") || "{}");

      const customerData = {
        first_name: userData.first_name || "User",
        last_name: userData.last_name || "Name",
        email: userData.email || "user@example.com",
        phone: {
          country_code: userData.phone_country_code || "966",
          number: userData.phone_number || "500000000",
        },
      };

      const data = await SubscriptionAPI.createPayment(
        planId,
        customerData,
        token,
      );

      if (data.success) {
        // Redirect to Tap payment page
        window.location.href = data.data.payment_url;
      } else {
        alert(
          i18n.language === "ar"
            ? "فشل إنشاء الدفع: " + data.message
            : "Payment creation failed: " + data.message,
        );
      }
    } catch (error) {
      alert(i18n.language === "ar" ? "خطأ في الاتصال" : "Connection error");
    } finally {
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  const getLocalizedFeatures = (features) => {
    if (typeof features === "object" && features[i18n.language]) {
      return features[i18n.language];
    }
    return Array.isArray(features) ? features : [];
  };

  const formatPrice = (plan) => {
    const currency = i18n.language === "ar" ? "ريال" : "SAR";
    const period =
      plan.billing_cycle === "monthly"
        ? i18n.language === "ar"
          ? "/شهرياً"
          : "/month"
        : i18n.language === "ar"
          ? "/سنوياً"
          : "/year";

    return `${plan.price} ${currency}${period}`;
  };

  const renderPlanCard = (plan) => {
    const isPopular = plan.name !== "basic";
    const features = getLocalizedFeatures(plan.features);

    return (
      <div
        key={plan.id}
        className={`relative bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl hover:scale-105 ${
          isPopular ? "ring-2 ring-blue-500" : ""
        }`}
      >
        {isPopular && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
              {i18n.language === "ar" ? "🚀 الأكثر شهرة" : "🚀 Most Popular"}
            </span>
          </div>
        )}

        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {plan.display_name}
          </h3>
          <p className="text-gray-600 mb-4">{plan.description}</p>
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {formatPrice(plan)}
          </div>
          {plan.billing_cycle === "yearly" && (
            <p className="text-green-600 text-sm font-medium">
              {i18n.language === "ar"
                ? "💡 وفر 25% مقارنة بالاشتراك الشهري"
                : "💡 Save 25% compared to monthly"}
            </p>
          )}
        </div>

        <div className="mb-8">
          <h4 className="font-semibold text-gray-900 mb-4">
            {i18n.language === "ar" ? "يشمل:" : "What's included:"}
          </h4>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start text-gray-700">
                <span className="text-green-500 ml-2 mt-1">✓</span>
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          {plan.price > 0 && (
            <div className="text-center text-sm text-gray-600">
              <span className="font-medium">
                {i18n.language === "ar"
                  ? "🛡️ ضمان استرداد 30 يوماً"
                  : "🛡️ 30-day money-back guarantee"}
              </span>
              <span className="mx-2">•</span>
              <span className="font-medium">
                {i18n.language === "ar"
                  ? "🎯 موثوق من +5000 نشاط سعودي"
                  : "🎯 Trusted by 5000+ Saudi businesses"}
              </span>
            </div>
          )}

          <button
            onClick={() => handleSubscribe(plan.id)}
            disabled={loading || selectedPlan === plan.id}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
              plan.price === 0
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
            } ${
              loading && selectedPlan === plan.id
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {loading && selectedPlan === plan.id
              ? i18n.language === "ar"
                ? "جاري المعالجة..."
                : "Processing..."
              : plan.price === 0
                ? i18n.language === "ar"
                  ? "ابدأ مجاناً"
                  : "Get Started"
                : i18n.language === "ar"
                  ? "اشترك الآن"
                  : "Subscribe Now"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {i18n.language === "ar"
              ? "اختر الباقة المناسبة لك"
              : "Choose the Perfect Plan for Your Business"}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {i18n.language === "ar"
              ? "ابدأ مجاناً، وقم بالترقية عندما تكون جاهزاً للنمو. لا توجد رسوم خفية."
              : "Start free, upgrade when you're ready to grow. No hidden fees."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map(renderPlanCard)}
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-600">
            {i18n.language === "ar" ? "هل لديك أسئلة؟ " : "Have questions? "}
            <a
              href="/contact"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {i18n.language === "ar"
                ? "تواصل مع فريق المبيعات"
                : "Contact our sales team"}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
