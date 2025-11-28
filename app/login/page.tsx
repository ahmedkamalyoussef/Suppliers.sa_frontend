"use client";

import { useState } from "react";
import type React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useLanguage } from "@/lib/LanguageContext"; // عدل المسار حسب مكانك
import { useAuth } from "@/lib/UserContext";
import { apiService, type LoginRequest } from "@/lib/api";

export default function LoginPage() {
  const { t } = useLanguage();
  const { login } = useAuth();
  const router = useRouter();
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

    if (!validateForm()) return;

    setIsSubmitting(true);
    setLoginError("");

    try {
      const loginData: LoginRequest = {
        email: formData.email,
        password: formData.password,
      };

      const response = await apiService.login(loginData);

      // Check if user is a supplier
      if (response.userType !== "supplier") {
        setLoginError("This account is not a supplier account");
        setIsSubmitting(false);
        return;
      }

      // Use AuthContext login
      login(response.supplier, response.accessToken, response.tokenType);

      // Always redirect to homepage after login
      router.push("/");
    } catch (error: any) {
      setLoginError(error.message || "Login failed. Please try again.");
    } finally {
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
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{loginError}</p>
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
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm ${
                      errors.email ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder={t("login.emailPlaceholder")}
                    required
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
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
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm pr-12 ${
                        errors.password ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder={t("login.passwordPlaceholder")}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      <i
                        className={`ri-${
                          showPassword ? "eye-off" : "eye"
                        }-line`}
                      ></i>
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={(e) =>
                        handleInputChange("rememberMe", e.target.checked)
                      }
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 border-2 rounded flex items-center justify-center mr-3 ${
                        formData.rememberMe
                          ? "bg-yellow-400 border-yellow-400"
                          : "border-gray-300"
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
                    className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"
                  >
                    {t("login.forgotPassword")}
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-lg font-medium text-lg whitespace-nowrap cursor-pointer transition-all ${
                    isSubmitting
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-yellow-400 text-white hover:bg-yellow-500"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      {t("login.signingIn")}
                    </>
                  ) : (
                    <>
                      <i className="ri-login-circle-line mr-2"></i>
                      {t("login.button")}
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    {t("login.noAccount")}{" "}
                    <Link
                      href="/register"
                      className="text-yellow-600 hover:text-yellow-700 font-medium"
                    >
                      {t("login.createAccountLink")}
                    </Link>
                  </p>
                  <p className="text-xs text-gray-500">
                    {t("login.agreementText")}{" "}
                    <Link
                      href="/terms"
                      className="text-yellow-600 hover:text-yellow-700"
                    >
                      {t("login.termsLink")}
                    </Link>{" "}
                    {t("login.and")}{" "}
                    <Link
                      href="/privacy"
                      className="text-yellow-600 hover:text-yellow-700"
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
