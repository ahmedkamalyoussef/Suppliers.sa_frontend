"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext"; // عدل المسار حسب مكانك

export default function SubscriptionFAQ() {
  const { t } = useLanguage();
  const [openFAQ, setOpenFAQ] = useState(0);

  const faqs = t("subscriptionFAQ.faqs");

  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="w-full px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              {t("subscriptionFAQ.title")}
            </h2>
            <p className="text-xl text-gray-600">
              {t("subscriptionFAQ.subtitle")}
            </p>
          </div>

          <div className="space-y-4">
            {Array.isArray(faqs) &&
              faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFAQ(openFAQ === index ? -1 : index)}
                    className="w-full text-left p-6 focus:outline-none hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-800 pr-8">
                        {faq.question}
                      </h3>
                      <div
                        className={`transform transition-transform duration-200 ${
                          openFAQ === index ? "rotate-180" : ""
                        }`}
                      >
                        <i className="ri-arrow-down-s-line text-xl text-gray-500"></i>
                      </div>
                    </div>
                  </button>

                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      openFAQ === index
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    } overflow-hidden`}
                  >
                    <div className="px-6 pb-6">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="mt-16 bg-white rounded-2xl p-8 text-center shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {t("subscriptionFAQ.contact.title")}
            </h3>
            <p className="text-gray-600 mb-6">
              {t("subscriptionFAQ.contact.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button className="bg-yellow-400 text-white px-8 py-3 rounded-full font-semibold hover:bg-yellow-500 transition-all whitespace-nowrap cursor-pointer">
                <i className="ri-chat-3-line mr-2"></i>
                {t("subscriptionFAQ.contact.chatButton")}
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition-all whitespace-nowrap cursor-pointer">
                <i className="ri-phone-line mr-2"></i>
                {t("subscriptionFAQ.contact.callButton")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
