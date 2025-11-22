"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useLanguage } from "@/lib/LanguageContext"; // عدل المسار حسب مكانك
import { apiService, type ForgotPasswordRequest } from "@/lib/api";

export default function ForgotPasswordPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!email.trim()) {
      setError(t("forgotPassword.errors.emailRequired"));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t("forgotPassword.errors.emailInvalid"));
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const forgotData: ForgotPasswordRequest = { email };
      console.log("Sending forgot password request:", forgotData);
      
      const response = await apiService.forgotPassword(forgotData);
      console.log("Forgot password response:", response);
      
      // Redirect to reset-password page with email
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      
      setIsSubmitted(true);
    } catch (error: any) {
      console.error("Forgot password failed:", error);
      setError(error.message || "Failed to send reset instructions. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="py-12">
          <div className="w-full px-6">
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="ri-mail-check-line text-green-600 text-3xl"></i>
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                  {t("forgotPassword.success.title")}
                </h1>
                <p className="text-gray-600 mb-6">
                  {t("forgotPassword.success.message")} <strong>{email}</strong>
                </p>

                <div className="bg-yellow-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-yellow-800">
                    <i className="ri-information-line mr-2"></i>
                    {t("forgotPassword.success.spamNotice")}
                  </p>
                </div>

                <div className="space-y-3">
                  <Link
                    href="/login"
                    className="w-full bg-yellow-400 text-white py-3 px-6 rounded-lg hover:bg-yellow-500 font-medium text-center block whitespace-nowrap cursor-pointer"
                  >
                    {t("forgotPassword.success.backToLogin")}
                  </Link>

                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setEmail("");
                    }}
                    className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 font-medium whitespace-nowrap cursor-pointer"
                  >
                    {t("forgotPassword.success.tryDifferentEmail")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="py-12">
        <div className="w-full px-6">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-lock-password-line text-blue-600 text-2xl"></i>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {t("forgotPassword.title")}
                </h1>
                <p className="text-gray-600">{t("forgotPassword.subtitle")}</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("forgotPassword.emailLabel")}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm ${
                      error ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder={t("forgotPassword.emailPlaceholder")}
                    required
                  />
                  {error && (
                    <p className="text-red-500 text-xs mt-1">{error}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-lg font-medium text-lg whitespace-nowrap cursor-pointer transition-all ${
                    isSubmitting
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      {t("forgotPassword.sendingButton")}
                    </>
                  ) : (
                    <>
                      <i className="ri-mail-send-line mr-2"></i>
                      {t("forgotPassword.sendButton")}
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-600">
                  {t("forgotPassword.rememberPassword")}{" "}
                  <Link
                    href="/login"
                    className="text-yellow-600 hover:text-yellow-700 font-medium"
                  >
                    {t("forgotPassword.backToLoginLink")}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
