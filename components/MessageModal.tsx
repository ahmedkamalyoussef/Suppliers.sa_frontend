"use client";

import { useState } from "react";
import { useLanguage } from "../lib/LanguageContext";
import { apiService } from "../lib/api";

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessId: number;
  businessName: string;
}

export default function MessageModal({ isOpen, onClose, businessId, businessName }: MessageModalProps) {
  const { t } = useLanguage();
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle message submission
  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (inquiryForm.message.length > 500) {
      alert(
        t("businessProfile.messageTooLong") ||
          "Message must be 500 characters or less"
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await apiService.sendInquiry({
        receiver_supplier_id: businessId,
        sender_name: inquiryForm.name,
        company: inquiryForm.company,
        email: inquiryForm.email,
        phone: inquiryForm.phone,
        subject: inquiryForm.subject || `Inquiry from ${inquiryForm.name}`,
        message: inquiryForm.message,
      });

      setIsSubmitted(true);
    } catch (error: any) {
      console.error("Inquiry submission error:", error);
      const errorMessage =
        error?.message ||
        t("businessProfile.submissionError") ||
        "There was an error sending your message. Please try again.";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setInquiryForm({
      name: "",
      email: "",
      phone: "",
      company: "",
      subject: "",
      message: "",
    });
    setIsSubmitted(false);
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-check-line text-green-600 text-2xl"></i>
              </div>
              <h3 className="text-lg md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">
                {t("businessProfile.messageSentTitle")}
              </h3>
              <p className="text-gray-600 mb-2 text-sm md:text-base">
                Your inquiry has been sent to <strong>{businessName}</strong>
              </p>
              <p className="text-xs md:text-sm text-gray-500 mb-4 md:mb-6">
                We'll notify you once they respond.
              </p>
              <button
                onClick={resetForm}
                className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-3 rounded-full font-semibold text-sm md:text-base transition-colors"
              >
                {t("businessProfile.close")}
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-800">
                  {t("businessProfile.newMessage")}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>

              <form onSubmit={handleMessageSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                      <i className="ri-user-line mr-1"></i>
                      {t("businessProfile.name")} *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={inquiryForm.name}
                      onChange={(e) =>
                        setInquiryForm({
                          ...inquiryForm,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-xs md:text-sm"
                      placeholder={t("businessProfile.namePlaceholder")}
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                      <i className="ri-building-line mr-1"></i>
                      {t("businessProfile.company")}
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={inquiryForm.company}
                      onChange={(e) =>
                        setInquiryForm({
                          ...inquiryForm,
                          company: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-xs md:text-sm"
                      placeholder={t("businessProfile.companyPlaceholder")}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                      <i className="ri-mail-line mr-1"></i>
                      {t("businessProfile.email")} *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={inquiryForm.email}
                      onChange={(e) =>
                        setInquiryForm({
                          ...inquiryForm,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-xs md:text-sm"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                      <i className="ri-phone-line mr-1"></i>
                      {t("businessProfile.phone")}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={inquiryForm.phone}
                      onChange={(e) =>
                        setInquiryForm({
                          ...inquiryForm,
                          phone: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-xs md:text-sm"
                      placeholder="+966 50 123 4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    <i className="ri-message-2-line mr-1"></i>
                    {t("businessProfile.subject")}
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={inquiryForm.subject}
                    onChange={(e) =>
                      setInquiryForm({
                        ...inquiryForm,
                        subject: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-xs md:text-sm"
                    placeholder={t("businessProfile.subjectPlaceholder")}
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    <i className="ri-message-2-line mr-1"></i>
                    Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    value={inquiryForm.message}
                    onChange={(e) =>
                      setInquiryForm({
                        ...inquiryForm,
                        message: e.target.value,
                      })
                    }
                    maxLength={500}
                    className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-xs md:text-sm resize-none"
                    placeholder="Dear Team, I'm interested in your services and would like to learn more about..."
                  />
                  <div className="flex justify-between items-center mt-1 md:mt-2">
                    <p className="text-xs text-gray-500">
                      This message will be sent directly to {businessName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {inquiryForm.message.length}/500 characters
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
                  >
                    {t("businessProfile.cancel")}
                  </button>
                  <button
                    type="submit"
                    disabled={
                      isSubmitting || inquiryForm.message.length > 500
                    }
                    className={`px-4 py-2 md:px-8 md:py-2 font-medium rounded-lg cursor-pointer flex items-center space-x-1 md:space-x-2 text-xs md:text-sm ${
                      isSubmitting || inquiryForm.message.length > 500
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-yellow-400 text-white hover:bg-yellow-500"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <i className="ri-loader-4-line animate-spin"></i>
                        <span>{t("businessProfile.sending")}</span>
                      </>
                    ) : (
                      <>
                        <i className="ri-send-plane-line"></i>
                        <span>{t("businessProfile.sendMessage")}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
