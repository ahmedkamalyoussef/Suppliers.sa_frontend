"use client";

import { useState } from "react";
import type React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";
import { api } from "@/lib/api/service";
import { API_CONFIG } from "@/lib/api/config";

export default function AuthPage() {
  const { t, translations, language } = useLanguage();
  const [step, setStep] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [formData, setFormData] = useState({
    businessName: "",
    phone: "",
    email: "",
    password: "",
    rememberMe: false,
  });
  const [verificationMethod, setVerificationMethod] = useState<
    "phone" | "email" | ""
  >("");
  const [verificationCode, setVerificationCode] = useState(["", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };


  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const response: any = await api.post(API_CONFIG.auth.login, {
        email: formData.email,
        password: formData.password,
      });

      // Handle different response structures
      const token = response?.data?.token || response?.token || response?.access_token;
      const success = response?.success !== false && (token || response?.data);

      if (success && token) {
        api.setToken(token);
        if (formData.rememberMe) {
          localStorage.setItem("rememberMe", "true");
        }
        router.push("/dashboard");
      } else {
        setErrors({
          general: response?.message || response?.data?.message || t("auth.errors.loginFailed"),
        });
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        t("auth.errors.loginFailed");
      setErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    if (!formData.businessName.trim()) {
      setErrors({ businessName: t("auth.errors.businessNameRequired") });
      return;
    }
    if (!formData.email.trim()) {
      setErrors({ email: t("auth.errors.emailRequired") });
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setErrors({ password: t("auth.errors.passwordMinLength") });
      return;
    }

    setIsSubmitting(true);
    try {
      const response: any = await api.post(API_CONFIG.registration.supplierRegister, {
        businessName: formData.businessName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        password_confirmation: formData.password,
      });

      // Handle different response structures
      const success = response?.success !== false && !response?.error;
      
      if (success) {
        setStep(2);
      } else {
        const errorMsg = response?.message || 
                        response?.data?.message || 
                        response?.error?.message ||
                        (Array.isArray(response?.errors) ? response.errors.join(", ") : null) ||
                        t("auth.errors.registrationFailed");
        setErrors({ general: errorMsg });
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        t("auth.errors.registrationFailed");
      setErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerificationMethodSelect = async (method: "phone" | "email") => {
    setVerificationMethod(method);
    setIsVerifying(true);
    setErrors({});

    try {
      const response: any = await api.post(API_CONFIG.auth.sendOtp, {
        email: formData.email,
        ...(method === "phone" && { phone: formData.phone }),
      });

      // Handle different response structures
      const success = response?.success !== false && !response?.error;
      
      if (success) {
        setStep(3);
      } else {
        const errorMsg = response?.message || 
                        response?.data?.message || 
                        response?.error?.message ||
                        t("auth.errors.otpSendFailed");
        setErrors({ general: errorMsg });
        setIsVerifying(false);
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        t("auth.errors.otpSendFailed");
      setErrors({ general: errorMessage });
      setIsVerifying(false);
    }
  };


  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);

      if (value && index < 3) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleCodeKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyCode = async () => {
    const code = verificationCode.join("");
    if (code.length !== 4) {
      setErrors({ code: t("auth.errors.codeIncomplete") });
      return;
    }

    setIsVerifying(true);
    setErrors({});

    try {
      const response: any = await api.post(API_CONFIG.auth.verifyOtp, {
        email: formData.email,
        otp: code,
      });

      // Handle different response structures
      const token = response?.data?.token || response?.token || response?.access_token;
      const success = response?.success !== false && !response?.error;
      
      if (success) {
        if (token) {
          api.setToken(token);
        }
        setStep(4);
      } else {
        const errorMsg = response?.message || 
                        response?.data?.message || 
                        response?.error?.message ||
                        t("auth.errors.invalidCode");
        setErrors({ code: errorMsg });
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        t("auth.errors.invalidCode");
      setErrors({ code: errorMessage });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCompleteRegistration = () => {
    localStorage.setItem(
      "registrationData",
      JSON.stringify({
        ...formData,
        verificationMethod,
        verifiedAt: new Date().toISOString(),
      })
    );

    router.push("/complete-profile");
  };

  const renderSignInForm = () => (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-user-line text-yellow-600 text-2xl"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {t("auth.signin.title")}
          </h1>
          <p className="text-gray-600">{t("auth.signin.subtitle")}</p>
        </div>

        <div className="flex bg-gray-100 rounded-lg p-1 mb-8">
          <button
            type="button"
            onClick={() => setActiveTab("signin")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all cursor-pointer ${
              activeTab === "signin"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t("auth.tabs.signin")}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("signup")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all cursor-pointer ${
              activeTab === "signup"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t("auth.tabs.signup")}
          </button>
        </div>

        <form onSubmit={handleSignIn} className="space-y-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {errors.general}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("auth.signin.emailLabel")}
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm ${
                errors.email ? "border-red-300" : "border-gray-300"
              }`}
              placeholder={t("auth.signin.emailPlaceholder")}
              required
            />
            {errors.email && (
              <p className="text-red-600 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("auth.signin.passwordLabel")}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm pr-12 ${
                  errors.password ? "border-red-300" : "border-gray-300"
                }`}
                placeholder={t("auth.signin.passwordPlaceholder")}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i
                  className={`ri-${showPassword ? "eye-off" : "eye"}-line`}
                ></i>
              </button>
            </div>
            {errors.password && (
              <p className="text-red-600 text-xs mt-1">{errors.password}</p>
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
                {t("auth.signin.rememberMe")}
              </span>
            </label>

            <Link
              href="/forgot-password"
              className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"
            >
              {t("auth.signin.forgotPassword")}
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
                {t("auth.signin.signingIn")}
              </>
            ) : (
              <>
                <i className="ri-login-circle-line mr-2"></i>
                {t("auth.signin.button")}
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-xs text-gray-500">
              {t("auth.signin.agreementText")}{" "}
              <Link
                href="/terms"
                className="text-yellow-600 hover:text-yellow-700"
              >
                {t("auth.signin.termsLink")}
              </Link>{" "}
              {t("auth.signin.and")}{" "}
              <Link
                href="/privacy"
                className="text-yellow-600 hover:text-yellow-700"
              >
                {t("auth.signin.privacyLink")}
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-800 mb-2">
          <i className="ri-information-line mr-2"></i>
          <strong>{t("auth.demo.title")}</strong>
        </p>
        <p className="text-sm text-blue-700">
          {t("auth.demo.email")} demo@supplier.sa
          <br />
          {t("auth.demo.password")} demo123
        </p>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="ri-store-line text-white text-2xl"></i>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {t("auth.signup.step1.title")}
        </h1>
        <p className="text-gray-600">{t("auth.signup.step1.subtitle")}</p>
      </div>

      <div className="flex bg-gray-100 rounded-lg p-1 mb-8">
        <button
          type="button"
          onClick={() => setActiveTab("signin")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all cursor-pointer ${
            activeTab === "signin"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {t("auth.tabs.signin")}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("signup")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all cursor-pointer ${
            activeTab === "signup"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {t("auth.tabs.signup")}
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2">
          <i className="ri-information-line text-blue-600"></i>
          <span className="text-blue-800 font-medium text-sm">
            {t("auth.demoNotice.title")}
          </span>
        </div>
        <p className="text-blue-700 text-sm mt-1">
          {t("auth.demoNotice.message")}
        </p>
      </div>

      <form onSubmit={handleStep1Submit} className="space-y-6">
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {errors.general}
          </div>
        )}
        <div>
          <label
            htmlFor="businessName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("auth.signup.step1.businessNameLabel")}
          </label>
          <input
            type="text"
            id="businessName"
            value={formData.businessName}
            onChange={(e) => handleInputChange("businessName", e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 ${
              errors.businessName ? "border-red-300" : "border-gray-300"
            }`}
            placeholder={t("auth.signup.step1.businessNamePlaceholder")}
          />
          {errors.businessName && (
            <p className="text-red-600 text-xs mt-1">{errors.businessName}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("auth.signup.step1.phoneLabel")}
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
            placeholder={t("auth.signup.step1.phonePlaceholder")}
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("auth.signup.step1.emailLabel")}
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 ${
              errors.email ? "border-red-300" : "border-gray-300"
            }`}
            placeholder={t("auth.signup.step1.emailPlaceholder")}
          />
          {errors.email && (
            <p className="text-red-600 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("auth.signup.step1.passwordLabel")}
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 pr-12 ${
                errors.password ? "border-red-300" : "border-gray-300"
              }`}
              placeholder={t("auth.signup.step1.passwordPlaceholder")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <i className={`ri-${showPassword ? "eye-off" : "eye"}-line`}></i>
            </button>
          </div>
          {errors.password && (
            <p className="text-red-600 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-6 rounded-lg font-semibold whitespace-nowrap cursor-pointer transition-all ${
            isSubmitting
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-yellow-400 text-white hover:bg-yellow-500"
          }`}
        >
          {isSubmitting ? (
            <>
              <i className="ri-loader-4-line animate-spin mr-2"></i>
              {t("auth.signup.step1.submitting")}
            </>
          ) : (
            t("auth.signup.step1.button")
          )}
        </button>
      </form>

      <div className="text-center mt-6">
        <p className="text-gray-600">
          {t("auth.signup.step1.haveAccount")}{" "}
          <button
            onClick={() => setActiveTab("signin")}
            className="text-yellow-600 hover:text-yellow-700 font-medium cursor-pointer"
          >
            {t("auth.signup.step1.signinLink")}
          </button>
        </p>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="ri-shield-check-line text-white text-2xl"></i>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {t("auth.signup.step2.title")}
        </h1>
        <p className="text-gray-600">{t("auth.signup.step2.subtitle")}</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2">
          <i className="ri-information-line text-blue-600"></i>
          <span className="text-blue-800 font-medium text-sm">
            {t("auth.demoNotice.title")}
          </span>
        </div>
        <p className="text-blue-700 text-sm mt-1">
          {t("auth.signup.step2.demoMessage")}
        </p>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => handleVerificationMethodSelect("phone")}
          disabled={isVerifying}
          className="w-full p-6 border-2 border-gray-200 rounded-lg hover:border-yellow-400 hover:bg-yellow-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <i className="ri-phone-line text-green-600 text-xl"></i>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-800">
                {t("auth.signup.step2.phoneTitle")}
              </h3>
              <p className="text-gray-600 text-sm">
                {t("auth.signup.step2.phoneSubtitle")}
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => handleVerificationMethodSelect("email")}
          disabled={isVerifying}
          className="w-full p-6 border-2 border-gray-200 rounded-lg hover:border-yellow-400 hover:bg-yellow-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <i className="ri-mail-line text-blue-600 text-xl"></i>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-800">
                {t("auth.signup.step2.emailTitle")}
              </h3>
              <p className="text-gray-600 text-sm">
                {t("auth.signup.step2.emailSubtitle")}
              </p>
            </div>
          </div>
        </button>
      </div>

      {isVerifying && (
        <div className="text-center mt-8">
          <div className="w-8 h-8 bg-yellow-400 rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-gray-600">{t("auth.signup.step2.sending")}</p>
        </div>
      )}

      <div className="text-center mt-6">
        <button
          onClick={() => setStep(1)}
          className="text-gray-500 hover:text-gray-700 font-medium cursor-pointer"
        >
          ← {t("auth.signup.step2.backButton")}
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="ri-key-line text-white text-2xl"></i>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {t("auth.signup.step3.title")}
        </h1>
        <p className="text-gray-600">
          {t("auth.signup.step3.subtitle")}{" "}
          {verificationMethod === "phone"
            ? t("auth.signup.step3.phone")
            : t("auth.signup.step3.email")}
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2">
          <i className="ri-information-line text-blue-600"></i>
          <span className="text-blue-800 font-medium text-sm">
            {t("auth.demoNotice.title")}
          </span>
        </div>
        <p className="text-blue-700 text-sm mt-1">
          {t("auth.signup.step3.demoMessage")}
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex justify-center space-x-4">
          {verificationCode.map((digit, index) => (
            <input
              key={index}
              id={`code-${index}`}
              type="text"
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleCodeKeyDown(index, e)}
              className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              maxLength={1}
            />
          ))}
        </div>

        {errors.code && (
          <p className="text-red-600 text-sm text-center">{errors.code}</p>
        )}

        <div className="space-y-3">
          <button
            onClick={handleVerifyCode}
            disabled={isVerifying || verificationCode.join("").length !== 4}
            className={`w-full py-3 px-6 rounded-lg font-semibold whitespace-nowrap cursor-pointer transition-all ${
              isVerifying || verificationCode.join("").length !== 4
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-yellow-400 text-white hover:bg-yellow-500"
            }`}
          >
            {isVerifying ? (
              <>
                <i className="ri-loader-4-line animate-spin mr-2"></i>
                {t("auth.signup.step3.verifying")}
              </>
            ) : (
              <>
                <i className="ri-check-line mr-2"></i>
                {t("auth.signup.step3.verifyButton")}
              </>
            )}
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={() =>
              verificationMethod &&
              handleVerificationMethodSelect(
                verificationMethod as "phone" | "email"
              )
            }
            disabled={!verificationMethod}
            className="text-yellow-600 hover:text-yellow-700 font-medium text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("auth.signup.step3.resendCode")}
          </button>
        </div>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={() => setStep(2)}
          className="text-gray-500 hover:text-gray-700 font-medium cursor-pointer"
        >
          ← {t("auth.signup.step3.backButton")}
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="ri-check-line text-white text-2xl"></i>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {t("auth.signup.step4.title")}
        </h1>
        <p className="text-gray-600">{t("auth.signup.step4.subtitle")}</p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
        <h3 className="font-semibold text-gray-800 mb-4">
          {t("auth.signup.step4.completeTitle")}
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          {t("auth.signup.step4.completeSubtitle")}
        </p>
        <ul className="space-y-2 text-sm text-gray-600">
          {(
            ((translations as any)[language]?.auth?.signup?.step4
              ?.checklist as string[]) || []
          ).map((item: string, index: number) => (
            <li key={index} className="flex items-center space-x-2">
              <i className="ri-check-line text-green-600"></i>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        <button
          onClick={handleCompleteRegistration}
          className="w-full bg-yellow-400 text-white py-3 px-6 rounded-lg hover:bg-yellow-500 font-semibold whitespace-nowrap cursor-pointer"
        >
          {t("auth.signup.step4.completeButton")}
        </button>

        <button
          onClick={() => router.push("/")}
          className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 font-semibold whitespace-nowrap cursor-pointer"
        >
          {t("auth.signup.step4.skipButton")}
        </button>
      </div>

      <div className="text-center mt-6">
        <p className="text-xs text-gray-500">{t("auth.signup.step4.note")}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="py-12">
        <div className="w-full px-6">
          {activeTab === "signup" && step > 1 && (
            <div className="max-w-md mx-auto mb-12">
              <div className="flex items-center justify-between">
                {[1, 2, 3, 4].map((stepNumber) => (
                  <div key={stepNumber} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        step >= stepNumber
                          ? "bg-yellow-400 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {step > stepNumber ? (
                        <i className="ri-check-line"></i>
                      ) : (
                        stepNumber
                      )}
                    </div>
                    {stepNumber < 4 && (
                      <div
                        className={`w-16 h-1 mx-2 ${
                          step > stepNumber ? "bg-yellow-400" : "bg-gray-200"
                        }`}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>{t("auth.progress.register")}</span>
                <span>{t("auth.progress.verify")}</span>
                <span>{t("auth.progress.code")}</span>
                <span>{t("auth.progress.complete")}</span>
              </div>
            </div>
          )}

          {activeTab === "signin" && renderSignInForm()}
          {activeTab === "signup" && step === 1 && renderStep1()}
          {activeTab === "signup" && step === 2 && renderStep2()}
          {activeTab === "signup" && step === 3 && renderStep3()}
          {activeTab === "signup" && step === 4 && renderStep4()}
        </div>
      </main>

      <Footer />
    </div>
  );
}
