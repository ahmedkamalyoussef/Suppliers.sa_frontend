// components/SubscriptionStatus.jsx
import { useSubscription } from "../hooks/useSubscription";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

export default function SubscriptionStatus() {
  const { subscription, isPremium, loading } = useSubscription();
  const router = useRouter();
  const { t, i18n } = useTranslation();

  if (loading) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-gray-300 rounded mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-3/4"></div>
      </div>
    );
  }

  if (!isPremium) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              {i18n.language === "ar"
                ? "ترقية إلى باقة بريميوم"
                : "Upgrade to Premium"}
            </h3>
            <p className="text-yellow-700 text-sm">
              {i18n.language === "ar"
                ? "احصل على مميزات متقدمة ووصول غير محدود"
                : "Get advanced features and unlimited access"}
            </p>
          </div>
          <button
            onClick={() => router.push("/subscription")}
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors font-medium"
          >
            {i18n.language === "ar" ? "ترقية الآن" : "Upgrade Now"}
          </button>
        </div>
      </div>
    );
  }

  const daysRemaining = subscription
    ? Math.ceil(
        (new Date(subscription.ends_at) - new Date()) / (1000 * 60 * 60 * 24),
      )
    : 0;
  const isExpiringSoon = daysRemaining <= 7;

  return (
    <div
      className={`rounded-lg p-6 ${isExpiringSoon ? "bg-orange-50 border border-orange-200" : "bg-green-50 border border-green-200"}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">🎯</span>
            <h3 className="text-lg font-semibold text-green-800">
              {(subscription?.subscription_plan?.name === 'premium_monthly' || subscription?.subscription_plan?.name === 'premium_yearly')
                ? (i18n.language === 'ar' ? 'مميزة' : 'Premium')
                : subscription?.subscription_plan?.display_name}{" "}
              {i18n.language === "ar" ? "نشط" : "Active"}
            </h3>
          </div>

          <div className="space-y-1 text-sm">
            <p className="text-green-700">
              {i18n.language === "ar" ? "ينتهي في:" : "Expires on:"}{" "}
              {subscription &&
                new Date(subscription.ends_at).toLocaleDateString(
                  i18n.language === "ar" ? "ar-SA" : "en-US",
                )}
            </p>

            {isExpiringSoon && (
              <p className="text-orange-700 font-medium">
                {i18n.language === "ar"
                  ? `ينتهي خلال ${daysRemaining} أيام`
                  : `Expires in ${daysRemaining} days`}
              </p>
            )}
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-green-800 mb-1">
            {subscription?.subscription_plan?.billing_cycle === "monthly"
              ? i18n.language === "ar"
                ? "شهري"
                : "Monthly"
              : i18n.language === "ar"
                ? "سنوي"
                : "Yearly"}
          </div>
          <div className="text-sm text-green-600">
            {subscription?.paid_amount} {subscription?.currency}
          </div>
        </div>
      </div>

      {isExpiringSoon && (
        <div className="mt-4 pt-4 border-t border-orange-200">
          <button
            onClick={() => router.push("/subscription")}
            className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium"
          >
            {i18n.language === "ar" ? "تجديد الاشتراك" : "Renew Subscription"}
          </button>
        </div>
      )}
    </div>
  );
}
