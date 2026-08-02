"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { apiService } from "@/lib/api";
import PhoneInput from "./PhoneInput";

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface Errors {
  [key: string]: string;
}

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "Business Partnership",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.name.trim()) {
      newErrors.name = t("contactModal.errors.nameRequired");
    }

    if (!formData.email.trim()) {
      newErrors.email = t("contactModal.errors.emailRequired");
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = t("contactModal.errors.emailInvalid");
      }
    }

    if (!formData.message.trim()) {
      newErrors.message = t("contactModal.errors.messageRequired");
    } else if (formData.message.length > 500) {
      newErrors.message = t("contactModal.errors.messageTooLong");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await apiService.createInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error("Failed to submit inquiry:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = (): void => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "Business Partnership",
      message: "",
    });
    setErrors({});
    setIsSubmitted(false);
    setIsSubmitting(false);
  };

  const handleClose = (): void => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {!isSubmitted ? (
          <>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {t("contactModal.title")}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {t("contactModal.subtitle")}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-6"
              data-readdy-form
              id="contact-form"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("contactModal.form.nameLabel")}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm ${
                      errors.name ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder={t("contactModal.form.namePlaceholder")}
                    required
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("contactModal.form.emailLabel")}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm ${
                      errors.email ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder={t("contactModal.form.emailPlaceholder")}
                    required
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <PhoneInput
                label={t("contactModal.form.phoneLabel")}
                value={formData.phone}
                onChange={(val) => handleInputChange("phone", val)}
                placeholder={t("contactModal.form.phonePlaceholder")}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("contactModal.form.subjectLabel")}
                </label>
                <div className="relative">
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={(e) =>
                      handleInputChange("subject", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm appearance-none bg-white pr-8"
                  >
                    <option value="General Inquiry">
                      {t("contactModal.form.subjects.general")}
                    </option>
                    <option value="Business Partnership">
                      {t("contactModal.form.subjects.business")}
                    </option>
                    <option value="Technical Support">
                      {t("contactModal.form.subjects.support")}
                    </option>
                    <option value="Feedback">
                      {t("contactModal.form.subjects.feedback")}
                    </option>
                    <option value="Other">
                      {t("contactModal.form.subjects.other")}
                    </option>
                  </select>
                  <div className="absolute inset-y-0 ltr:right-0 ltr:pr-3 rtl:left-0 rtl:pl-3 flex items-center pointer-events-none">
                    <i className="ri-arrow-down-s-line text-gray-400"></i>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("contactModal.form.messageLabel")}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  maxLength={500}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm resize-none ${
                    errors.message ? "border-red-300" : "border-gray-300"
                  }`}
                  rows={4}
                  placeholder={t("contactModal.form.messagePlaceholder")}
                  required
                ></textarea>
                <div className="flex justify-between items-center mt-1">
                  {errors.message && (
                    <p className="text-red-500 text-xs">{errors.message}</p>
                  )}
                  <p className="text-xs text-gray-500 ml-auto">
                    {formData.message.length}/500{" "}
                    {t("contactModal.form.charactersLabel")}
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-yellow-400 text-white py-3.5 rounded-lg hover:bg-yellow-500 font-semibold text-base whitespace-nowrap cursor-pointer transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <i className="ri-loader-4-line animate-spin"></i>
                    <span>{t("contactModal.form.sendingButton")}</span>
                  </>
                ) : (
                  <>
                    <i className="ri-send-plane-line"></i>
                    <span>{t("contactModal.form.sendButton")}</span>
                  </>
                )}
              </button>
            </form>

            <div className="px-6 pb-6 border-t border-gray-200 pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  {t("contactModal.directContact.title")}
                </p>
                <div className="flex justify-center">
                  <div className="flex items-center gap-2">
                    <i className="ri-mail-line text-yellow-600"></i>
                    <span className="text-sm text-gray-700">
                      Supplier.com.sa@gmail.com
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-check-line text-green-600 text-3xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {t("contactModal.success.title")}
            </h3>
            <p className="text-gray-600 mb-6">
              {t("contactModal.success.message")}
            </p>
            <button
              onClick={handleClose}
              className="bg-yellow-400 text-white px-8 py-3 rounded-lg hover:bg-yellow-500 font-medium whitespace-nowrap cursor-pointer"
            >
              {t("contactModal.success.closeButton")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
