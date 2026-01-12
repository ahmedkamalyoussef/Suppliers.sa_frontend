"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "../lib/LanguageContext";
import { referralSystem } from "../lib/referralSystem";
import ReferralNotification from "./ReferralNotification";
import { apiService, ValidationError, type RegistrationData } from "../lib/api";
import VerificationStep from "./VerificationStep";

interface LocalRegistrationData {
  businessName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  referralCode: string;
  acceptPolicies: boolean;
}

interface Errors {
  [key: string]: string;
}

type CurrentStep = "register" | "verify" | "success";
type VerificationMethod = "phone" | "email";

export default function BusinessRegistrationForm() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState<CurrentStep>("register");
  const [registrationData, setRegistrationData] =
    useState<LocalRegistrationData>({
      businessName: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      referralCode: "",
      acceptPolicies: false,
    });
  const [verificationCode, setVerificationCode] = useState<string[]>([
    "",
    "",
    "",
    "",
  ]);
  const [verificationMethod, setVerificationMethod] =
    useState<VerificationMethod>("phone");
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [generatedCode] = useState<string>(
    Math.floor(1000 + Math.random() * 9000).toString()
  );
  const [referrerNotification, setReferrerNotification] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const handleInputChange = (
    field: keyof LocalRegistrationData,
    value: string | boolean
  ): void => {
    setRegistrationData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateRegistration = (): boolean => {
    const newErrors: Errors = {};
    if (!registrationData.businessName.trim()) {
      newErrors.businessName = t("business.errors.businessNameRequired");
    }
    if (!registrationData.phone.trim()) {
      newErrors.phone = t("business.errors.phoneRequired");
    } else {
      const phoneRegex = /^[0-9]{9,}$/;
      if (!phoneRegex.test(registrationData.phone)) {
        newErrors.phone = t("business.errors.phoneInvalid");
      }
    }
    if (!registrationData.email.trim()) {
      newErrors.email = t("business.errors.emailRequired");
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(registrationData.email)) {
        newErrors.email = t("business.errors.emailInvalid");
      }
    }
    if (!registrationData.password.trim()) {
      newErrors.password = t("business.errors.passwordRequired");
    } else if (registrationData.password.length < 6) {
      newErrors.password = t("business.errors.passwordTooShort");
    }
    if (registrationData.password !== registrationData.confirmPassword) {
      newErrors.confirmPassword = t("business.errors.passwordMismatch");
    }
    if (!registrationData.acceptPolicies) {
      newErrors.acceptPolicies = t("business.errors.acceptPoliciesRequired");
    }
    if (registrationData.referralCode.trim()) {
      if (
        !referralSystem.isValidReferralCode(
          registrationData.referralCode.trim()
        )
      ) {
        newErrors.referralCode = t("business.errors.referralCodeInvalid");
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegistrationSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (!validateRegistration()) return;
    setIsSubmitting(true);
    setErrors({});

    try {
      const apiData: RegistrationData = {
        businessName: registrationData.businessName,
        email: registrationData.email,
        phone: registrationData.phone.startsWith("+")
          ? registrationData.phone
          : `+966${registrationData.phone}`,
        password: registrationData.password,
        password_confirmation: registrationData.confirmPassword,
        accept_policies: registrationData.acceptPolicies,
      };

      const response = await apiService.registerSupplier(apiData);

      // Handle successful registration
      let notificationMessage = "";
      if (registrationData.referralCode.trim()) {
        const result = referralSystem.registerUserWithReferral(
          registrationData.businessName,
          registrationData.phone,
          registrationData.email,
          registrationData.referralCode.trim() || undefined
        );

        if (result.referrerEmail) {
          const referrerInfo = referralSystem.getReferrerInfo(
            registrationData.referralCode.trim()
          );
          if (referrerInfo) {
            notificationMessage = `${t(
              "business.notifications.referralSuccessTitle"
            )} ${registrationData.businessName} ${t(
              "business.notifications.referralSuccessMessage"
            )}. ${t("business.notifications.referralDiscountAdded")} ${
              referrerInfo.discount
            }${t("business.notifications.percent")}`;
          }
        }
      }

      if (notificationMessage) {
        setReferrerNotification(notificationMessage);
      }

      setCurrentStep("verify");
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
  };

  const handleVerificationCodeChange = (index: number, value: string): void => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);
      if (value && index < 3) {
        const nextInput = document.querySelector<HTMLInputElement>(
          `input[name="code-${index + 1}"]`
        );
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleVerificationSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const enteredCode = verificationCode.join("");
    if (enteredCode.length !== 4) {
      setErrors({ verification: t("business.errors.verificationIncomplete") });
      return;
    }

    // For now, we'll simulate verification since there's no verification endpoint
    // In a real implementation, you would call an API endpoint to verify the code
    setIsSubmitting(true);

    try {
      // Simulate API call for verification
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // For demo purposes, accept any 4-digit code
      // In production, this should validate against a real API
      setCurrentStep("success");
    } catch (error) {
      setErrors({ verification: t("business.errors.verificationInvalid") });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendCode = (): void => {
    setVerificationCode(["", "", "", ""]);
    setErrors({});
  };

  // REGISTER STEP
  if (currentStep === "register") {
    return (
      <>
        <ReferralNotification
          message={referrerNotification}
          onClose={() => setReferrerNotification("")}
        />
        <div className="bg-white rounded-xl md:rounded-2xl shadow-xl p-4 md:p-6 lg:p-8 border border-gray-100 mx-2 md:mx-0">
          <div className="text-center mb-6 md:mb-8">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              <i className="ri-user-add-line text-yellow-600 text-xl md:text-2xl"></i>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
              {t("business.form.createAccountTitle")}
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              {t("business.form.enterInfoSubtitle")}
            </p>
          </div>

          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
              <p className="text-red-700 text-xs md:text-sm">
                <i className="ri-error-warning-line mr-1 md:mr-2"></i>
                {errors.general}
              </p>
            </div>
          )}

          <form
            onSubmit={handleRegistrationSubmit}
            className="space-y-4 md:space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("auth.signup.step1.businessNameLabel")}
              </label>
              <input
                type="text"
                value={registrationData.businessName}
                onChange={(e) =>
                  handleInputChange("businessName", e.target.value)
                }
                className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm ${
                  errors.businessName ? "border-red-300" : "border-gray-300"
                }`}
                required
              />
              {errors.businessName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.businessName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("auth.signup.step1.phoneLabel")}
              </label>
              <div className="flex items-center border rounded-lg focus-within:ring-2 focus-within:ring-yellow-400 focus-within:border-transparent overflow-hidden">
                <span className="px-3 md:px-4 py-2 md:py-3 bg-gray-100 text-gray-700 font-medium border-r border-gray-300 whitespace-nowrap">
                  +966
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={registrationData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    handleInputChange("phone", value);
                  }}
                  placeholder={t("business.form.phonePlaceholder")}
                  className={`flex-1 px-3 md:px-4 py-2 md:py-3 border-0 focus:ring-0 text-sm outline-none ${
                    errors.phone ? "bg-red-50" : ""
                  }`}
                  required
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("auth.signup.step1.emailLabel")}
              </label>
              <input
                type="email"
                value={registrationData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm ${
                  errors.email ? "border-red-300" : "border-gray-300"
                }`}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("auth.signup.step1.passwordLabel")}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={registrationData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm pr-10 ${
                    errors.password ? "border-red-300" : "border-gray-300"
                  }`}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i
                    className={`ri-${showPassword ? "eye-off" : "eye"}-line`}
                  ></i>
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("auth.signup.step1.confirmPasswordLabel")}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={registrationData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm pr-10 ${
                    errors.confirmPassword
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <i
                    className={`ri-${
                      showConfirmPassword ? "eye-off" : "eye"
                    }-line`}
                  ></i>
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("business.form.referralCodeLabel")}
              </label>
              <input
                type="text"
                value={registrationData.referralCode}
                onChange={(e) =>
                  handleInputChange("referralCode", e.target.value)
                }
                placeholder={t("business.form.referralCodePlaceholder")}
                className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm ${
                  errors.referralCode ? "border-red-300" : "border-gray-300"
                }`}
              />
              <p className="text-gray-500 text-xs mt-1">
                {t("business.form.referralCodeHint")}
              </p>
              {errors.referralCode && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.referralCode}
                </p>
              )}
            </div>

            {/* Policies Acceptance */}
            <div className="space-y-2">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={registrationData.acceptPolicies}
                  onChange={(e) =>
                    handleInputChange("acceptPolicies", e.target.checked)
                  }
                  className={`mt-1 w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400 focus:ring-2 ${
                    errors.acceptPolicies ? "border-red-300" : ""
                  }`}
                />
                <span className="text-sm text-gray-700 leading-relaxed">
                  {t("business.form.policiesAgreement")}
                  <Link
                    href="/policies"
                    className="text-yellow-600 hover:text-yellow-700 underline ml-1"
                    target="_blank"
                  >
                    {t("business.form.policiesLink")}
                  </Link>
                </span>
              </label>
              {errors.acceptPolicies && (
                <p className="text-red-500 text-xs">{errors.acceptPolicies}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 md:py-4 rounded-lg font-medium text-base md:text-lg whitespace-nowrap cursor-pointer transition-all ${
                isSubmitting
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-yellow-400 text-white hover:bg-yellow-500"
              }`}
            >
              {isSubmitting
                ? t("business.form.continueButtonSubmitting")
                : t("business.form.continueButton")}
            </button>
          </form>

          <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200 text-center">
            <p className="text-xs md:text-sm text-gray-600">
              {t("business.form.alreadyAccount")}{" "}
              <Link
                href="/login"
                className="text-yellow-600 hover:text-yellow-700 font-medium"
              >
                {t("business.form.signIn")}
              </Link>
            </p>
          </div>
        </div>
      </>
    );
  }

  // VERIFY STEP
  if (currentStep === "verify") {
    return (
      <VerificationStep
        phone={registrationData.phone}
        email={registrationData.email}
        onVerificationSuccess={() => setCurrentStep("success")}
        onBack={() => setCurrentStep("register")}
      />
    );
  }

  // SUCCESS STEP
  if (currentStep === "success") {
    const checklist = t("business.form.profileChecklist") as unknown;
    const checklistArray = Array.isArray(checklist) ? checklist : [];

    return (
      <div className="bg-white rounded-xl md:rounded-2xl shadow-xl p-4 md:p-6 lg:p-8 border border-gray-100 mx-2 md:mx-0">
        <div className="text-center mb-6 md:mb-8">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
            <i className="ri-check-line text-green-600 text-2xl md:text-3xl"></i>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 md:mb-4">
            {t("business.form.accountVerified")}
          </h2>
          <p className="text-gray-600 text-base md:text-lg mb-4 md:mb-6">
            {t("business.form.successMessage")}
          </p>
        </div>

        <div className="bg-yellow-50 p-4 md:p-6 rounded-lg md:rounded-xl mb-6 md:mb-8">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">
            <i className="ri-clipboard-line mr-2 text-yellow-600"></i>
            {t("business.form.completeProfileTitle")}
          </h3>
          <p className="text-gray-700 text-sm md:text-base mb-3 md:mb-4">
            {t("business.form.completeProfileSubtitle")}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm">
            {checklistArray.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <i className="ri-check-line text-green-500 text-xs md:text-sm"></i>
                <span className="text-gray-700">{String(item)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 md:space-y-4">
          <Link
            href="/complete-profile"
            className="w-full bg-yellow-400 text-white py-3 md:py-4 px-4 md:px-6 rounded-lg hover:bg-yellow-500 font-medium text-base md:text-lg text-center whitespace-nowrap cursor-pointer block"
          >
            <i className="ri-edit-line mr-1 md:mr-2"></i>
            {t("business.form.completeProfileButton")}
          </Link>

          <Link
            href="/"
            className="w-full border border-gray-300 text-gray-700 py-3 md:py-4 px-4 md:px-6 rounded-lg hover:bg-gray-50 font-medium text-base md:text-lg text-center whitespace-nowrap cursor-pointer block"
          >
            <i className="ri-home-line mr-1 md:mr-2"></i>
            {t("business.form.skipButton")}
          </Link>
        </div>
      </div>
    );
  }
}
