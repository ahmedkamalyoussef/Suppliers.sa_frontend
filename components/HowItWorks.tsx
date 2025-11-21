"use client";

import { useLanguage } from "../lib/LanguageContext";

export default function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      id: 1,
      icon: "ri-search-line",
      title: t("howItWorks.steps.step1.title"),
      description: t("howItWorks.steps.step1.description"),
    },
    {
      id: 2,
      icon: "ri-notification-line",
      title: t("howItWorks.steps.step2.title"),
      description: t("howItWorks.steps.step2.description"),
    },
    {
      id: 3,
      icon: "ri-user-add-line",
      title: t("howItWorks.steps.step3.title"),
      description: t("howItWorks.steps.step3.description"),
    },
    {
      id: 4,
      icon: "ri-handshake-line",
      title: t("howItWorks.steps.step4.title"),
      description: t("howItWorks.steps.step4.description"),
    },
  ];

  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-b from-white to-yellow-50">
      <div className="w-full px-3 sm:px-4 md:px-6">
        <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
            {t("howItWorks.title")}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            {t("howItWorks.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.id} className="relative">
              <div className="text-center">
                <div className="relative mb-3 sm:mb-4 md:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <i
                      className={`${step.icon} text-white text-lg sm:text-xl md:text-2xl`}
                    ></i>
                  </div>
                  <div className="absolute -top-1 sm:-top-1 md:-top-2 -right-1 sm:-right-1 md:-right-2 w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 bg-white border-2 sm:border-3 md:border-4 border-yellow-400 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-yellow-600 font-bold text-xs sm:text-sm md:text-sm">
                      {step.id}
                    </span>
                  </div>
                </div>

                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm md:text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connection Line - Hidden on mobile, adjusted for tablet */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-6 sm:top-8 md:top-10 -right-3 md:-right-4 w-4 sm:w-6 md:w-8 h-0.5 bg-yellow-300"></div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-10 md:mt-12 lg:mt-16">
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 max-w-2xl mx-auto">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
              {t("howItWorks.cta.title")}
            </h3>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
              {t("howItWorks.cta.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center">
              <button className="bg-yellow-400 text-white px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-full hover:bg-yellow-500 font-semibold text-sm sm:text-base md:text-lg whitespace-nowrap cursor-pointer">
                {t("howItWorks.cta.createProfile")}
              </button>
              <button className="border-2 border-yellow-400 text-yellow-600 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-full hover:bg-yellow-50 font-semibold text-sm sm:text-base md:text-lg whitespace-nowrap cursor-pointer">
                {t("howItWorks.cta.startSearching")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
