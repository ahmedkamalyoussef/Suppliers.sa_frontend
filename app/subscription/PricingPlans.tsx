"use client";

import { useState } from "react";
import { useLanguage } from "../../lib/LanguageContext";
import ClickPayButton from "../../components/ClickPayButton";
import PaymentModal from "../../components/PaymentModal";
import PaymentSuccess from "../../components/PaymentSuccess";
import PaymentError from "../../components/PaymentError";
import { PaymentPlan } from "../../lib/clickpay/types";
import { paymentPlans } from "../../lib/clickpay/config";

export default function PricingPlans() {
  const { t } = useLanguage();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );

  // Payment state
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [showPaymentError, setShowPaymentError] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [transactionId, setTransactionId] = useState("");

  const monthlyPrice = 199;
  const yearlyPrice = 1799;
  const yearlySavings = Math.round(
    ((monthlyPrice * 12 - yearlyPrice) / (monthlyPrice * 12)) * 100
  );

  // Payment handlers
  const handlePaymentInitiate = (plan: PaymentPlan) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (transactionId: string) => {
    setTransactionId(transactionId);
    setShowPaymentModal(false);
    setShowPaymentSuccess(true);
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
    setShowPaymentModal(false);
    setShowPaymentError(true);
  };

  const handleRetryPayment = () => {
    setShowPaymentError(false);
    setShowPaymentModal(true);
  };

  const handleCancelPayment = () => {
    setShowPaymentModal(false);
    setShowPaymentError(false);
    setSelectedPlan(null);
  };

  const handleContinueToDashboard = () => {
    setShowPaymentSuccess(false);
    setSelectedPlan(null);
    // Redirect to dashboard or handle success
    window.location.href = "/dashboard";
  };

  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            {t("subscription.plansTitle")}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-6 sm:mb-8">
            {t("subscription.plansDesc")}
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-gray-100 rounded-full p-1 mb-8 sm:mb-10 md:mb-12">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-all cursor-pointer text-sm sm:text-base ${
                billingCycle === "monthly"
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {t("subscription.monthly")}
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-all cursor-pointer text-sm sm:text-base ${
                billingCycle === "yearly"
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {t("subscription.yearly")}
              <span className="ml-1 sm:ml-2 bg-green-100 text-green-800 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs">
                {t("subscription.saveXPercent").replace(
                  "{{percent}}",
                  String(yearlySavings)
                )}
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-4 sm:p-6 md:p-8 relative shadow-lg">
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                {t("subscription.freeTitle")}
              </h3>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                {t("subscription.freeSubtitle")}
              </p>
              <div className="mb-4 sm:mb-6">
                <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
                  0
                </span>
                <img
                  src="/riyal.svg"
                  alt="SAR"
                  className="w-6 h-6 inline-block ml-1"
                />
                <span className="text-gray-600 text-base sm:text-lg">
                  {t("subscription.perMonth")}
                </span>
              </div>
              <button className="w-full bg-gray-800 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-semibold text-base sm:text-lg hover:bg-gray-700 transition-colors whitespace-nowrap cursor-pointer">
                <i className="ri-play-line mr-1 sm:mr-2"></i>
                {t("subscription.getStartedFree")}
              </button>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                {t("subscription.noCard")}
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">
                {t("subscription.whatsIncluded")}
              </h4>
              <div className="flex items-center">
                <i className="ri-check-line text-green-500 mr-2 sm:mr-3 text-base sm:text-lg"></i>
                <span className="text-gray-700 text-sm sm:text-base">
                  {t("subscription.incl1")}
                </span>
              </div>
              <div className="flex items-center">
                <i className="ri-check-line text-green-500 mr-2 sm:mr-3 text-base sm:text-lg"></i>
                <span className="text-gray-700 text-sm sm:text-base">
                  {t("subscription.incl2")}
                </span>
              </div>
              <div className="flex items-center">
                <i className="ri-check-line text-green-500 mr-2 sm:mr-3 text-base sm:text-lg"></i>
                <span className="text-gray-700 text-sm sm:text-base">
                  {t("subscription.incl3")}
                </span>
              </div>
              <div className="flex items-center">
                <i className="ri-check-line text-green-500 mr-2 sm:mr-3 text-base sm:text-lg"></i>
                <span className="text-gray-700 text-sm sm:text-base">
                  {t("subscription.incl4")}
                </span>
              </div>
              <div className="flex items-center">
                <i className="ri-check-line text-green-500 mr-2 sm:mr-3 text-base sm:text-lg"></i>
                <span className="text-gray-700 text-sm sm:text-base">
                  {t("subscription.incl5")}
                </span>
              </div>
              <div className="flex items-center">
                <i className="ri-check-line text-green-500 mr-2 sm:mr-3 text-base sm:text-lg"></i>
                <span className="text-gray-700 text-sm sm:text-base">
                  {t("subscription.incl6")}
                </span>
              </div>
              <div className="flex items-center">
                <i className="ri-check-line text-green-500 mr-2 sm:mr-3 text-base sm:text-lg"></i>
                <span className="text-gray-700 text-sm sm:text-base">
                  {t("subscription.incl7")}
                </span>
              </div>
              <div className="flex items-center">
                <i className="ri-check-line text-green-500 mr-2 sm:mr-3 text-base sm:text-lg"></i>
                <span className="text-gray-700 text-sm sm:text-base">
                  {t("subscription.incl8")}
                </span>
              </div>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-400 p-4 sm:p-6 md:p-8 relative shadow-xl">
            <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-yellow-400 text-gray-900 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                🚀 Most Popular Choice
              </span>
            </div>

            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                {t("subscription.premiumTitle")}
              </h3>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                {t("subscription.premiumSubtitle")}
              </p>

              {/* Pricing Display */}
              <div className="mb-4 sm:mb-6">
                {billingCycle === "monthly" ? (
                  <div>
                    <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
                      {monthlyPrice}
                    </span>
                    <img
                      src="/riyal.svg"
                      alt="SAR"
                      className="w-6 h-6 inline-block ml-1"
                    />
                    <span className="text-gray-600 text-base sm:text-lg">
                      {t("subscription.perMonth")}
                    </span>
                    <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-xs sm:text-sm text-green-800">
                        {t("subscription.saveWithYearly")}{" "}
                        <strong>
                          {yearlyPrice}
                          <img
                            src="/riyal.svg"
                            alt="SAR"
                            className="w-4 h-4 inline-block ml-1"
                          />
                          {t("subscription.perYear")}
                        </strong>
                        <span className="ml-1 font-bold text-green-700">
                          (
                          {t("subscription.saveXPercent").replace(
                            "{{percent}}",
                            String(yearlySavings)
                          )}
                          )
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
                      <span className="text-lg sm:text-2xl font-medium text-gray-500 line-through">
                        {monthlyPrice * 12}
                        <img
                          src="/riyal.svg"
                          alt="SAR"
                          className="w-4 h-4 inline-block ml-1"
                        />
                      </span>
                      <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
                        {yearlyPrice}
                        <img
                          src="/riyal.svg"
                          alt="SAR"
                          className="w-6 h-6 inline-block ml-1"
                        />
                      </span>
                    </div>
                    <span className="text-gray-600 text-base sm:text-lg">
                      {t("subscription.perYear")}
                    </span>
                    <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-green-50 rounded-lg border border-green-200">
                      <span className="bg-green-100 text-green-800 px-2 sm:px-3 py-1 rounded-full font-bold text-xs sm:text-sm">
                        {t("subscription.saveAmount")
                          .replace(
                            "{{amount}}",
                            String(monthlyPrice * 12 - yearlyPrice)
                          )
                          .replace("{{percent}}", String(yearlySavings))}
                      </span>
                      <div className="mt-2 text-xs sm:text-sm text-green-700">
                        {t("subscription.justPerMonth").replace(
                          "{{amount}}",
                          String(Math.round(yearlyPrice / 12))
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <ClickPayButton
                plan={
                  billingCycle === "monthly" ? paymentPlans[1] : paymentPlans[2]
                } // Professional monthly or yearly
                onPaymentInitiate={handlePaymentInitiate}
                className="w-full py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-bold text-base sm:text-lg shadow-lg"
              />
              <p className="text-xs sm:text-sm text-gray-600 mt-2">
                {t("subscription.guarantee")}
              </p>
            </div>

            <div className="mb-4 sm:mb-6">
              <p className="font-bold text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg flex items-center">
                <i className="ri-gift-line mr-1 sm:mr-2 text-yellow-600"></i>
                {t("subscription.premiumAllFreePlus")}
              </p>
            </div>

            {/* Core Business Features */}
            <div className="mb-4 sm:mb-6">
              <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                <i className="ri-building-line mr-1 sm:mr-2 text-yellow-600"></i>
                {t("subscription.coreFeatures")}
              </h4>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center">
                  <i className="ri-check-line text-green-500 mr-2 sm:mr-3 text-base sm:text-lg"></i>
                  <span className="text-gray-700 text-sm sm:text-base">
                    {t("subscription.fCore1")}
                  </span>
                </div>
                <div className="flex items-center">
                  <i className="ri-check-line text-green-500 mr-2 sm:mr-3 text-base sm:text-lg"></i>
                  <span className="text-gray-700 text-sm sm:text-base">
                    {t("subscription.fCore2")}
                  </span>
                </div>
                <div className="flex items-center">
                  <i className="ri-check-line text-green-500 mr-2 sm:mr-3 text-base sm:text-lg"></i>
                  <span className="text-gray-700 text-sm sm:text-base">
                    {t("subscription.fCore3")}
                  </span>
                </div>
              </div>
            </div>

            {/* Communication & Lead Generation */}
            <div className="mb-4 sm:mb-6">
              <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                <i className="ri-message-line mr-1 sm:mr-2 text-yellow-600"></i>
                {t("subscription.commLead")}
              </h4>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center">
                  <i className="ri-check-line text-green-500 mr-2 sm:mr-3 text-base sm:text-lg"></i>
                  <span className="text-gray-700 text-sm sm:text-base">
                    {t("subscription.fComm1")}
                  </span>
                </div>
                <div className="flex items-center">
                  <i className="ri-check-line text-green-500 mr-2 sm:mr-3 text-base sm:text-lg"></i>
                  <span className="text-gray-700 text-sm sm:text-base">
                    {t("subscription.fComm2")}
                  </span>
                </div>
                <div className="flex items-center">
                  <i className="ri-check-line text-green-500 mr-2 sm:mr-3 text-base sm:text-lg"></i>
                  <span className="text-gray-700 text-sm sm:text-base">
                    {t("subscription.fComm3")}
                  </span>
                </div>
                <div className="flex items-center">
                  <i className="ri-check-line text-green-500 mr-2 sm:mr-3 text-base sm:text-lg"></i>
                  <span className="text-gray-700 text-sm sm:text-base">
                    {t("subscription.fComm4")}
                  </span>
                </div>
                <div className="flex items-center">
                  <i className="ri-check-line text-green-500 mr-2 sm:mr-3 text-base sm:text-lg"></i>
                  <span className="text-gray-700 text-sm sm:text-base">
                    {t("subscription.fComm5")}
                  </span>
                </div>
              </div>
            </div>

            {/* Premium Marketing & Analytics */}
            <div className="mb-4 sm:mb-6">
              <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                <i className="ri-star-line mr-1 sm:mr-2 text-yellow-600"></i>
                {t("subscription.marketingAnalytics")}
              </h4>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center">
                  <i className="ri-check-line text-green-500 mr-2 sm:mr-3 text-base sm:text-lg"></i>
                  <span className="text-gray-700 text-sm sm:text-base">
                    {t("subscription.fMark1")}
                  </span>
                </div>
                <div className="flex items-center">
                  <i className="ri-check-line text-green-500 mr-2 sm:mr-3 text-base sm:text-lg"></i>
                  <span className="text-gray-700 text-sm sm:text-base">
                    {t("subscription.fMark2")}
                  </span>
                </div>
                <div className="flex items-center">
                  <i className="ri-check-line text-green-500 mr-2 sm:mr-3 text-base sm:text-lg"></i>
                  <span className="text-gray-700 text-sm sm:text-base">
                    {t("subscription.fMark3")}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 sm:pt-6 border-t border-yellow-200 bg-yellow-25 rounded-lg p-3 sm:p-4">
              <div className="text-center">
                <p className="text-xs sm:text-sm text-gray-700 font-medium">
                  🛡️ 30-day money-back guarantee • 🎯 Trusted by 5000+ Saudi
                  businesses
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        plan={selectedPlan}
        onClose={handleCancelPayment}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={handlePaymentError}
      />

      {/* Payment Success */}
      {showPaymentSuccess && selectedPlan && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"></div>
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <PaymentSuccess
                transactionId={transactionId}
                planName={selectedPlan.name}
                amount={selectedPlan.price}
                currency={selectedPlan.currency}
                onContinue={handleContinueToDashboard}
              />
            </div>
          </div>
        </div>
      )}

      {/* Payment Error */}
      {showPaymentError && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"></div>
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <PaymentError
                error={paymentError}
                onRetry={handleRetryPayment}
                onCancel={handleCancelPayment}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
