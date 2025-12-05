"use client";

import { useState } from "react";
import type React from "react";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useLanguage } from "@/lib/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { apiService } from "@/lib/api";
import { LoginRequest } from "../../types/auth";

export default function LoginPage() {
  const { t, language } = useLanguage();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = t("login.errors.emailRequired");
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = t("login.errors.emailInvalid");
      }
    }

    if (!formData.password.trim()) {
      newErrors.password = t("login.errors.passwordRequired");
    } else if (formData.password.length < 6) {
      newErrors.password = t("login.errors.passwordTooShort");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;
    if (!validateForm()) return;

    setIsSubmitting(true);
    setLoginError("");

    try {
      const loginData: LoginRequest = {
        email: formData.email,
        password: formData.password,
      };

      const response = await apiService.login(loginData);

      // للـ suppliers - استخدم الـ hook
      if (response.userType === "supplier" && response.supplier) {
        login(response.supplier, response.accessToken, response.tokenType);
      }
      // للـ admins - استخدم الـ hook كمان
      else if (response.userType === "admin" && response.admin) {
        login(response.admin, response.accessToken, response.tokenType);
      }
      // للـ super admins
      else if (response.userType === "super_admin" && response.super_admin) {
        login(response.super_admin, response.accessToken, response.tokenType);
      }

      // انتظر شوية عشان الـ cookies تتحفظ
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Redirect بناءً على الـ user type
      if (
        response.userType === "admin" ||
        response.userType === "super_admin"
      ) {
        window.location.href = "/admin";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Handle specific error messages
      let errorMessage = "Login failed. Please try again.";
      
      if (error.message) {
        // Use Arabic messages if language is Arabic (RTL)
        const isRTL = language === "ar";
        
        // Check for rate limiting errors
        if (error.message.includes("Too many login attempts") || error.message.includes("Too Many Attempts")) {
          const match = error.message.match(/(\d+)/);
          const seconds = match ? match[1] : "60";
          if (isRTL) {
            errorMessage = `محاولات دخول كثيرة جداً. يرجى المحاولة مرة أخرى خلال ${seconds} ثانية.`;
          } else {
            errorMessage = `Too many login attempts. Please try again in ${seconds} seconds.`;
          }
        }
        // Check for max attempts reached
        else if (error.message.includes("max_attempts")) {
          const match = error.message.match(/(\d+)/);
          const maxAttempts = match ? match[1] : "3";
          if (isRTL) {
            errorMessage = `تم الوصول إلى الحد الأقصى لمحاولات الدخول (${maxAttempts}). يرجى المحاولة لاحقاً.`;
          } else {
            errorMessage = `Maximum login attempts (${maxAttempts}) reached. Please try again later.`;
          }
        }
        // Check for invalid credentials
        else if (error.message.includes("Invalid") || error.message.includes("credentials")) {
          if (isRTL) {
            errorMessage = "البريد الإلكتروني أو كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.";
          } else {
            errorMessage = "Invalid email or password. Please try again.";
          }
        }
        // Check for account locked
        else if (error.message.includes("locked") || error.message.includes("suspended")) {
          if (isRTL) {
            errorMessage = "الحساب مغلق مؤقتاً لأسباب أمنية. يرجى التواصل مع الدعم الفني.";
          } else {
            errorMessage = "Account temporarily locked due to security reasons. Please contact support.";
          }
        }
        // Use the original message if it's a known error
        else {
          errorMessage = error.message;
        }
      }
      
      setLoginError(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="py-12">
        <div className="w-full px-6">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-user-line text-yellow-600 text-2xl"></i>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {t("login.title")}
                </h1>
                <p className="text-gray-600">{t("login.subtitle")}</p>
              </div>

              {loginError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                  <i className="ri-error-warning-line text-red-500 text-xl mr-3 mt-0.5"></i>
                  <p className="text-red-700 text-sm flex-1">{loginError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("login.emailLabel")}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm transition-all ${
                      errors.email
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder={t("login.emailPlaceholder")}
                    required
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <i className="ri-error-warning-line mr-1"></i>
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("login.passwordLabel")}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm pr-12 transition-all ${
                        errors.password
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder={t("login.passwordPlaceholder")}
                      required
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      disabled={isSubmitting}
                      tabIndex={-1}
                    >
                      <i
                        className={`ri-${
                          showPassword ? "eye-off" : "eye"
                        }-line text-xl`}
                      ></i>
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <i className="ri-error-warning-line mr-1"></i>
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={(e) =>
                        handleInputChange("rememberMe", e.target.checked)
                      }
                      className="sr-only"
                      disabled={isSubmitting}
                    />
                    <div
                      className={`w-5 h-5 border-2 rounded flex items-center justify-center mr-3 transition-all ${
                        formData.rememberMe
                          ? "bg-yellow-400 border-yellow-400 scale-110"
                          : "border-gray-300 group-hover:border-yellow-300"
                      }`}
                    >
                      {formData.rememberMe && (
                        <i className="ri-check-line text-white text-sm"></i>
                      )}
                    </div>
                    <span className="text-sm text-gray-700">
                      {t("login.rememberMe")}
                    </span>
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-sm text-yellow-600 hover:text-yellow-700 font-medium transition-colors"
                  >
                    {t("login.forgotPassword")}
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-lg font-medium text-lg transition-all transform ${
                    isSubmitting
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-yellow-400 text-white hover:bg-yellow-500 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <i className="ri-loader-4-line animate-spin mr-2 text-xl"></i>
                      {t("login.signingIn")}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <i className="ri-login-circle-line mr-2 text-xl"></i>
                      {t("login.button")}
                    </span>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    {t("login.noAccount")}{" "}
                    <Link
                      href="/add-business"
                      className="text-yellow-600 hover:text-yellow-700 font-medium transition-colors"
                    >
                      {t("login.createAccountLink")}
                    </Link>
                  </p>
                  <p className="text-xs text-gray-500">
                    {t("login.agreementText")}{" "}
                    <Link
                      href="/terms"
                      className="text-yellow-600 hover:text-yellow-700 transition-colors"
                    >
                      {t("login.termsLink")}
                    </Link>{" "}
                    {t("login.and")}{" "}
                    <Link
                      href="/privacy"
                      className="text-yellow-600 hover:text-yellow-700 transition-colors"
                    >
                      {t("login.privacyLink")}
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
