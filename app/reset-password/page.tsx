"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useLanguage } from "@/lib/LanguageContext";
import { apiService, type ResetPasswordRequest } from "@/lib/api";
import { translations } from "@/lib/translations";

export default function ResetPasswordPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  // Translation function
  const t = (key: string, params?: { email?: string; errors?: string }) => {
    const translation = translations[language as keyof typeof translations].resetPassword[key as keyof typeof translations.en.resetPassword];
    if (!translation) return key;
    
    let result = translation;
    if (params?.email) {
      result = result.replace("{email}", params.email);
    }
    if (params?.errors) {
      result = result.replace("{errors}", params.errors);
    }
    return result;
  };

  const [formData, setFormData] = useState({
    otp: "",
    password: "",
    password_confirmation: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!formData.otp.trim()) {
      newErrors.push(t("otpRequired"));
    } else if (formData.otp.length !== 4) {
      newErrors.push(t("otpDigits"));
    }

    if (!formData.password.trim()) {
      newErrors.push(t("passwordRequired"));
    } else if (formData.password.length < 4) {
      newErrors.push(t("passwordMinLength"));
    }

    if (!formData.password_confirmation.trim()) {
      newErrors.push(t("confirmPasswordRequired"));
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.push(t("passwordsNotMatch"));
    }

    if (newErrors.length > 0) {
      setError(newErrors.join(". "));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!email) {
      setError(t("emailRequired"));
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const resetData: ResetPasswordRequest = {
        email,
        otp: formData.otp,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      };

      const response = await apiService.resetPassword(resetData);

      setIsSuccess(true);
    } catch (error: any) {
      
      // Show detailed validation errors if available
      if (error.errors && error.errors.password) {
        const passwordErrors = error.errors.password;
        setError(t("serverValidation", { errors: passwordErrors.join(", ") }));
      } else {
        setError(error.message || t("resetFailed"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="py-12">
          <div className="w-full px-6">
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="ri-lock-unlock-line text-green-600 text-3xl"></i>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {t("successTitle")}
                </h2>
                <p className="text-gray-600 mb-8">
                  {t("successMessage")}
                </p>

                <div className="space-y-3">
                  <Link
                    href="/login"
                    className="w-full bg-yellow-400 text-white py-3 px-6 rounded-lg hover:bg-yellow-500 font-medium text-center block whitespace-nowrap"
                  >
                    {t("goToLogin")}
                  </Link>
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
                  <i className="ri-lock-unlock-line text-blue-600 text-2xl"></i>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {t("title")}
                </h1>
                <p className="text-gray-600">
                  {t("subtitle", { email })}
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("otpLabel")}
                  </label>
                  <input
                    type="text"
                    value={formData.otp}
                    onChange={(e) => handleInputChange("otp", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm ${
                      error ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder={t("otpPlaceholder")}
                    maxLength={6}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("newPasswordLabel")}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm ${
                      error ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder={t("newPasswordPlaceholder")}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {t("passwordHint")}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("confirmPasswordLabel")}
                  </label>
                  <input
                    type="password"
                    value={formData.password_confirmation}
                    onChange={(e) =>
                      handleInputChange("password_confirmation", e.target.value)
                    }
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm ${
                      error ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder={t("confirmPasswordPlaceholder")}
                    required
                  />
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
                      {t("resetting")}
                    </>
                  ) : (
                    <>
                      <i className="ri-lock-unlock-line mr-2"></i>
                      {t("resetButton")}
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-600">
                  {t("rememberPassword")}{" "}
                  <Link
                    href="/login"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {t("backToLogin")}
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
