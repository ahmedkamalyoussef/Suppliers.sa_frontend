"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "../../lib/LanguageContext";
import { useRouter } from "next/navigation";

export default function PricingPlans() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    localStorage.removeItem("temp_token");
    localStorage.removeItem("test_user");
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api"}/subscription/plans`,
      );
      const data = await response.json();
      if (data.success) {
        setPlans(data.data);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  const handleSubscribe = async (planId: number) => {
    setLoading(true);
    setSelectedPlan(planId);

    try {
      const token = localStorage.getItem("supplier_token");

      if (!token) {
        router.push("/login?redirect=" + encodeURIComponent("/subscription"));
        return;
      }

      const userData = JSON.parse(
        localStorage.getItem("supplier_user") || "{}",
      );

      const plan = plans.find(p => p.id === planId);
      if (!plan) {
        alert("Plan not found");
        return;
      }

      const customerData = {
        first_name: userData.name?.split(" ")[0] || "Test",
        last_name: userData.name?.split(" ")[1] || "User",
        email: userData.email || "test@example.com",
        phone_number: userData.phone?.replace("966", "") || "500000000",
        phone_country_code: "966",
        description: `Payment for ${plan.display_name} subscription`,
        order_id: `plan_${planId}_${Date.now()}`
      };

      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api"}/payment/create`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: parseFloat(plan.price),
          ...customerData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        window.location.href = data.data.transaction_url;
      } else {
        alert(
          language === "ar"
            ? "فشل إنشاء الدفع: " + data.message
            : "Payment creation failed: " + data.message,
        );
      }
    } catch (error) {
      alert(language === "ar" ? "خطأ في الاتصال" : "Connection error");
    } finally {
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  const getLocalizedFeatures = (features: any) => {
    if (typeof features === "object" && features[language]) {
      return features[language];
    }
    return Array.isArray(features) ? features : [];
  };

  const formatPrice = (plan: any) => {
    const currency = language === "ar" ? "ريال" : "SAR";
    const period =
      plan.billing_cycle === "monthly"
        ? language === "ar"
          ? "/شهرياً"
          : "/month"
        : language === "ar"
          ? "/سنوياً"
          : "/year";

    return `${plan.price} ${currency}${period}`;
  };

  const getPlanByCycle = (cycle: "monthly" | "yearly") => {
    return plans.find((plan) => plan.billing_cycle === cycle && parseFloat(plan.price) > 0);
  };

  const basicPlan = plans.find((plan) => parseFloat(plan.price) === 0);
  const monthlyPlan = getPlanByCycle("monthly");
  const yearlyPlan = getPlanByCycle("yearly");

  const renderPlanCard = (plan: any, isPopular: boolean = false) => {
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
              {language === "ar" ? "🚀 الأكثر شهرة" : "🚀 Most Popular"}
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
              {language === "ar"
                ? "💡 وفر 25% مقارنة بالاشتراك الشهري"
                : "💡 Save 25% compared to monthly"}
            </p>
          )}
        </div>

        <div className="mb-8">
          <h4 className="font-semibold text-gray-900 mb-4">
            {language === "ar" ? "يشمل:" : "What's included:"}
          </h4>
          <ul className="space-y-3">
            {features.map((feature: string, index: number) => (
              <li key={index} className="flex items-start text-gray-700">
                <span className="text-green-500 ml-2 mt-1">✓</span>
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          {parseFloat(plan.price) > 0 && (
            <div className="text-center text-sm text-gray-600">
              {/* <span className="font-medium">
                {language === "ar"
                  ? "🛡️ ضمان استرداد 30 يوماً"
                  : "🛡️ 30-day money-back guarantee"}
              </span> */}
              <span className="mx-2">•</span>
              <span className="font-medium">
                {language === "ar"
                  ? "🎯 موثوق من النشاطات التجارية السعودية"
                  : "🎯 Trusted by Saudi businesses"}
              </span>
            </div>
          )}

          <button
            onClick={() => handleSubscribe(plan.id)}
            disabled={loading || selectedPlan === plan.id}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
              parseFloat(plan.price) === 0
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
            } ${
              loading && selectedPlan === plan.id
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {loading && selectedPlan === plan.id
              ? language === "ar"
                ? "جاري المعالجة..."
                : "Processing..."
              : parseFloat(plan.price) === 0
                ? language === "ar"
                  ? "ابدأ مجاناً"
                  : "Get Started"
                : language === "ar"
                  ? "اشترك الآن"
                  : "Subscribe Now"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        <div className="flex justify-center mb-16">
          <div className="bg-gray-100 rounded-full p-1 flex">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === "monthly"
                  ? "bg-white text-blue-600 shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {language === "ar" ? "شهري" : "Monthly"}
            </button>

            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === "yearly"
                  ? "bg-white text-blue-600 shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {language === "ar" ? "سنوي" : "Yearly"}
              <span className="ml-2 text-green-600 font-semibold">
                25% {language === "ar" ? "وفر" : "off"}
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto ">
          {basicPlan && renderPlanCard(basicPlan, false)}
          {billingCycle === "monthly" &&
            monthlyPlan &&
            renderPlanCard(monthlyPlan, true)}
          {billingCycle === "yearly" &&
            yearlyPlan &&
            renderPlanCard(yearlyPlan, true)}
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-600">
            {language === "ar" ? "هل لديك أسئلة؟ " : "Have questions? "}
            <a
              href="/contact"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {language === "ar"
                ? "تواصل مع فريق المبيعات"
                : "Contact our sales team"}
            </a>
          </p>
        </div>

      </div>
    </section>
  );
}