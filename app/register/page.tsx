"use client";

import { useState } from "react";
import type React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";
import { apiService, ValidationError, type RegistrationData } from "@/lib/api";
import VerificationStep from "@/components/VerificationStep";

export default function RegisterPage() {
  const { t, translations, language } = useLanguage();
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<{
    businessName: string;
    phone: string;
    email: string;
    password: string;
    confirmPassword: string;
  }>({
    businessName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [verificationMethod, setVerificationMethod] = useState<
    "phone" | "email" | ""
  >("");
  const [verificationCode, setVerificationCode] = useState<string[]>([
    "",
    "",
    "",
    "",
  ]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const router = useRouter();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = t("business.errors.businessNameRequired");
    }
    if (!formData.phone.trim()) {
      newErrors.phone = t("business.errors.phoneRequired");
    }
    if (!formData.email.trim()) {
      newErrors.email = t("business.errors.emailRequired");
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = t("business.errors.emailInvalid");
      }
    }
    if (!formData.password.trim()) {
      newErrors.password = t("business.errors.passwordRequired");
    } else if (formData.password.length < 6) {
      newErrors.password = t("business.errors.passwordTooShort");
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t("business.errors.passwordMismatch");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateStep1()) {
      setIsSubmitting(true);
      setErrors({});

      try {
        const apiData: RegistrationData = {
          businessName: formData.businessName,
          email: formData.email,
          phone: formData.phone.startsWith("+")
            ? formData.phone
            : `+966${formData.phone}`,
          password: formData.password,
          password_confirmation: formData.confirmPassword,
        };

        const response = await apiService.registerSupplier(apiData);

        // Store registration data for later use
        localStorage.setItem(
          "registrationData",
          JSON.stringify({
            ...formData,
            supplier: response.supplier,
            registeredAt: new Date().toISOString(),
          })
        );

        setStep(2);
      } catch (error) {
        if (error instanceof ValidationError) {
          const validationError = error;
          const newErrors: Record<string, string> = {};
          Object.keys(validationError.errors).forEach((key) => {
            const errorArray = validationError.errors[key];
            if (errorArray && errorArray.length > 0) {
              newErrors[key] = errorArray[0];
            }
          });
          setErrors(newErrors);
        } else {
          setErrors({
            general:
              error instanceof Error
                ? error.message
                : "Registration failed. Please try again.",
          });
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleVerificationMethodSelect = (method: "phone" | "email") => {
    setVerificationMethod(method);
    setStep(3);
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
    if (code.length === 4) {
      setIsSubmitting(true);

      try {
        // Simulate verification API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setStep(4);
      } catch (error) {
        setErrors({ code: t("register.errors.verificationFailed") });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors({ code: t("register.errors.codeIncomplete") });
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

  const renderStep1 = () => (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="ri-store-line text-white text-2xl"></i>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {t("register.step1.title")}
        </h1>
        <p className="text-gray-600">{t("register.step1.subtitle")}</p>
      </div>

      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <i className="ri-error-warning-line text-red-600"></i>
            <span className="text-red-700 text-sm">{errors.general}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleStep1Submit} className="space-y-6">
        <div>
          <label
            htmlFor="businessName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("register.step1.businessNameLabel")}
          </label>
          <input
            type="text"
            id="businessName"
            value={formData.businessName}
            onChange={(e) => handleInputChange("businessName", e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${
              errors.businessName ? "border-red-300" : "border-gray-300"
            }`}
            placeholder={t("register.step1.businessNamePlaceholder")}
          />
          {errors.businessName && (
            <p className="text-red-500 text-xs mt-1">{errors.businessName}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("register.step1.phoneLabel")}
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${
              errors.phone ? "border-red-300" : "border-gray-300"
            }`}
            placeholder={t("register.step1.phonePlaceholder")}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("register.step1.emailLabel")}
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${
              errors.email ? "border-red-300" : "border-gray-300"
            }`}
            placeholder={t("register.step1.emailPlaceholder")}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("auth.signup.step1.passwordLabel") || "Password *"}
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent pr-10 ${
                errors.password ? "border-red-300" : "border-gray-300"
              }`}
              placeholder={
                t("auth.signup.step1.passwordPlaceholder") ||
                "Create a password"
              }
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              <i className={`ri-${showPassword ? "eye-off" : "eye"}-line`}></i>
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password Field */}

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("auth.signup.step1.confirmPasswordLabel") ||
              "Confirm Password *"}
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent pr-10 ${
                errors.confirmPassword ? "border-red-300" : "border-gray-300"
              }`}
              placeholder={
                t("auth.signup.step1.confirmPasswordPlaceholder") ||
                "Confirm your password"
              }
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <i
                className={`ri-${showConfirmPassword ? "eye-off" : "eye"}-line`}
              ></i>
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-yellow-400 text-white py-3 px-6 rounded-lg hover:bg-yellow-500 font-semibold whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Creating Account..." : t("register.step1.button")}
        </button>
      </form>

      <div className="text-center mt-6">
        <p className="text-gray-600">
          {t("register.step1.haveAccount")}{" "}
          <Link
            href="/login"
            className="text-yellow-600 hover:text-yellow-700 font-medium"
          >
            {t("register.step1.signinLink")}
          </Link>
        </p>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <VerificationStep
      phone={formData.phone}
      email={formData.email}
      onVerificationSuccess={() => setStep(3)}
      onBack={() => setStep(1)}
    />
  );

  const renderStep3 = () => (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="ri-check-line text-white text-2xl"></i>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {t("register.step4.title")}
        </h1>
        <p className="text-gray-600">{t("register.step4.subtitle")}</p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
        <h3 className="font-semibold text-gray-800 mb-4">
          {t("register.step4.completeTitle")}
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          {t("register.step4.completeSubtitle")}
        </p>
        <ul className="space-y-2 text-sm text-gray-600">
          {(
            ((translations as any)[language]?.register?.step4
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
          {t("register.step4.completeButton")}
        </button>

        <button
          onClick={() => router.push("/")}
          className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 font-semibold whitespace-nowrap cursor-pointer"
        >
          {t("register.step4.skipButton")}
        </button>
      </div>

      <div className="text-center mt-6">
        <p className="text-xs text-gray-500">{t("register.step4.note")}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="py-12">
        <div className="w-full px-6">
          <div className="max-w-md mx-auto mb-12">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((stepNumber) => (
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

                  {/* الخطوط بين الدواير */}
                  {stepNumber < 3 && (
                    <div
                      className={`w-20 h-1 lg:mx-12 md:mx-12 sm:mx-12 mx-8 max-[480px]:mx-4  max-sm:mx-8  ${
                        step > stepNumber ? "bg-yellow-400" : "bg-gray-200"
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>

            {/* النصوص تحت الاستيبز */}
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>{t("register.progress.register")}</span>
              <span>{t("register.progress.verify")}</span>
              <span>{t("register.progress.complete")}</span>
            </div>
          </div>

          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>
      </main>

      <Footer />
    </div>
  );
}
