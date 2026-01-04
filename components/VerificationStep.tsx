"use client";

import { useState } from "react";
import { useLanguage } from "../lib/LanguageContext";
import { useAuth } from "../lib/UserContext";
import {
  apiService,
  type SendOtpRequest,
  type VerifyOtpRequest,
} from "../lib/api";

interface VerificationStepProps {
  phone: string;
  email: string;
  onVerificationSuccess: () => void;
  onBack: () => void;
}

export default function VerificationStep({
  phone,
  email,
  onVerificationSuccess,
  onBack,
}: VerificationStepProps) {
  const { t } = useLanguage();
  const { login } = useAuth();
  const [currentStep, setCurrentStep] = useState<"method" | "code">("method");
  const CODE_LENGTH = 4; // عدد أرقام الكود
  const [verificationCode, setVerificationCode] = useState<string[]>(
    Array(CODE_LENGTH).fill("")
  );
  const [verificationMethod, setVerificationMethod] = useState<
    "phone" | "email"
  >("phone");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const phoneSubtitle = phone
    ? `${t("register.step2.phoneSubtitle").split("+")[0].trim()} +966 ${phone}`
    : t("register.step2.phoneSubtitle");
  const emailSubtitle = email
    ? `${t("register.step2.emailSubtitle").split("@")[0].trim()} ${email}`
    : t("register.step2.emailSubtitle");

  const handleVerificationMethodSelect = async (method: "phone" | "email") => {
    setVerificationMethod(method);
    setIsSubmitting(true);

    try {
      // Send OTP via email API
      await apiService.sendOtp({ email });
      setCurrentStep("code");
    } catch (error) {
      setErrors({
        general: "Failed to send verification code. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerificationCodeChange = (index: number, value: string) => {
    const digits = value.replace(/\D/g, "");
    if (!digits) return;

    const newCode = [...verificationCode];

    // إذا تم عمل paste كامل للكود
    if (digits.length > 1) {
      for (let i = 0; i < CODE_LENGTH; i++) {
        newCode[i] = digits[i] || "";
      }
      setVerificationCode(newCode);
      const lastIndex = Math.min(digits.length - 1, CODE_LENGTH - 1);
      const nextInput = document.getElementById(`code-${lastIndex}`);
      if (nextInput) (nextInput as HTMLInputElement).focus();
      return;
    }

    // كتابة رقم واحد فقط
    newCode[index] = digits;
    setVerificationCode(newCode);

    if (index < CODE_LENGTH - 1 && digits) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) (nextInput as HTMLInputElement).focus();
    }

    if (errors.code) {
      setErrors((prev) => ({ ...prev, code: "" }));
    }
  };

  const handleCodeKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      if (verificationCode[index]) {
        const newCode = [...verificationCode];
        newCode[index] = "";
        setVerificationCode(newCode);
      } else if (index > 0) {
        const prevInput = document.getElementById(`code-${index - 1}`);
        if (prevInput) (prevInput as HTMLInputElement).focus();
      }
    }
  };

  const handleVerifyCode = async () => {
    const enteredCode = verificationCode.join("");
    if (enteredCode.length !== CODE_LENGTH) {
      setErrors({
        code:
          t("register.errors.codeIncomplete") ||
          "Please enter a complete verification code",
      });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Verify OTP via API
      const response = await apiService.verifyOtp({
        email,
        otp: enteredCode,
      });

      // Check if verification was successful and token was stored
      if (
        response.accessToken ||
        (response.supplier &&
          response.message?.toLowerCase().includes("verified"))
      ) {
        // Use AuthContext login if user data is available
        if (response.supplier && response.accessToken) {
          login(
            response.supplier,
            response.accessToken,
            response.tokenType || "Bearer"
          );
        }

        // Store verification data in localStorage for complete profile page
        localStorage.setItem("verificationData", JSON.stringify(response));

        onVerificationSuccess();
      } else {
        setErrors({ code: response.message || "Invalid verification code" });
      }
    } catch (error: any) {
      // Check if the error response contains successful login data
      if (
        error.accessToken ||
        (error.supplier && error.message?.toLowerCase().includes("verified"))
      ) {
        // Use AuthContext login if user data is available
        if (error.supplier && error.accessToken) {
          login(error.supplier, error.accessToken, error.tokenType || "Bearer");
        }

        // Store verification data in localStorage for complete profile page
        localStorage.setItem("verificationData", JSON.stringify(error));

        onVerificationSuccess();
      } else {
        setErrors({
          code: error.message || "Invalid verification code. Please try again.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendCode = async () => {
    setVerificationCode(Array(CODE_LENGTH).fill(""));
    setErrors({});
    setIsSubmitting(true);

    try {
      await apiService.sendOtp({ email });
    } catch (error) {
      setErrors({
        general: "Failed to resend verification code. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {currentStep === "method" && (
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-shield-check-line text-white text-2xl"></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {t("register.step2.title")}
            </h1>
            <p className="text-gray-600">{t("register.step2.subtitle")}</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handleVerificationMethodSelect("phone")}
              disabled={true}
              className="w-full p-6 border-2 border-gray-200 rounded-lg hover:border-yellow-400 hover:bg-yellow-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="ri-phone-line text-green-600 text-xl"></i>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-800">
                    {t("register.step2.phoneTitle")}
                  </h3>
                  <p className="text-gray-600 text-sm">{phoneSubtitle}</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleVerificationMethodSelect("email")}
              disabled={isSubmitting}
              className="w-full p-6 border-2 border-gray-200 rounded-lg hover:border-yellow-400 hover:bg-yellow-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="ri-mail-line text-blue-600 text-xl"></i>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-800">
                    {t("register.step2.emailTitle")}
                  </h3>
                  <p className="text-gray-600 text-sm">{emailSubtitle}</p>
                </div>
              </div>
            </button>
          </div>

          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
              <div className="flex items-center space-x-2">
                <i className="ri-error-warning-line text-red-600"></i>
                <span className="text-red-700 text-sm">{errors.general}</span>
              </div>
            </div>
          )}

          <div className="text-center mt-6">
            <button
              onClick={onBack}
              className="text-gray-500 hover:text-gray-700 font-medium"
            >
              ← {t("register.step2.backButton")}
            </button>
          </div>
        </div>
      )}

      {currentStep === "code" && (
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-key-line text-white text-2xl"></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {t("register.step3.title")}
            </h1>
            <p className="text-gray-600">
              {t("register.step3.subtitle")}{" "}
              {verificationMethod === "phone"
                ? t("register.step3.phone")
                : t("register.step3.email")}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <i className="ri-information-line text-blue-600"></i>
              <span className="text-blue-800 font-medium text-sm">
                Verification Code Sent
              </span>
            </div>
            <p className="text-blue-700 text-sm mt-1">
              We've sent a verification code to your{" "}
              {verificationMethod === "phone"
                ? "phone number"
                : "email address"}
              : {verificationMethod === "phone" ? phone : email}
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex justify-center space-x-2">
              {verificationCode.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={CODE_LENGTH}
                  value={digit}
                  onChange={(e) =>
                    handleVerificationCodeChange(index, e.target.value)
                  }
                  onKeyDown={(e) => handleCodeKeyDown(index, e)}
                  className="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                />
              ))}
            </div>

            {errors.code && (
              <p className="text-red-600 text-sm text-center">{errors.code}</p>
            )}

            <div className="space-y-3">
              <button
                onClick={handleVerifyCode}
                disabled={isSubmitting}
                className="w-full bg-yellow-400 text-white py-3 px-6 rounded-lg hover:bg-yellow-500 font-semibold whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? "Verifying..."
                  : t("register.step3.verifyButton")}
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={resendCode}
                className="text-yellow-600 hover:text-yellow-700 font-medium text-sm"
              >
                {t("register.step3.resendCode")}
              </button>
            </div>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => setCurrentStep("method")}
              className="text-gray-500 hover:text-gray-700 font-medium"
            >
              ← {t("register.step3.backButton")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
