"use client";

import { useLanguage } from "@/lib/LanguageContext"; // عدل المسار حسب مكانك
import {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
  AwaitedReactNode,
  Key,
} from "react";

export default function SubscriptionFeatures() {
  const { t } = useLanguage();

  // @ts-ignore: The translation function may not support the second argument in its type definition
  const features = t("subscriptionFeatures.features", {
    returnObjects: true,
  }) as any;

  return (
    <section className="py-20 bg-white">
      <div className="w-full px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              {t("subscriptionFeatures.title")}{" "}
              <span className="text-yellow-600">
                {t("subscriptionFeatures.titleHighlight")}
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t("subscriptionFeatures.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {Array.isArray(features) &&
              features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all group hover:bg-white"
                >
                  <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-yellow-200 transition-colors">
                    <i
                      className={`${feature.icon} text-yellow-600 text-2xl`}
                    ></i>
                  </div>

                  <h3 className="text-lg font-bold text-gray-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                    {feature.description}
                  </p>

                  <div className="space-y-2">
                    {Array.isArray(feature.benefits) &&
                      feature.benefits.map(
                        (
                          benefit:
                            | string
                            | number
                            | bigint
                            | boolean
                            | ReactElement<
                                any,
                                string | JSXElementConstructor<any>
                              >
                            | Iterable<ReactNode>
                            | ReactPortal
                            | Promise<AwaitedReactNode>
                            | null
                            | undefined,
                          idx: Key | null | undefined
                        ) => (
                          <div
                            key={idx}
                            className="flex items-center space-x-2"
                          >
                            <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full flex-shrink-0"></div>
                            <span className="text-gray-700 text-xs">
                              {benefit}
                            </span>
                          </div>
                        )
                      )}
                  </div>
                </div>
              ))}
          </div>

          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl p-12 text-center text-white">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                {t("subscriptionFeatures.cta.title")}
              </h3>
              <p className="text-xl mb-8 opacity-90">
                {t("subscriptionFeatures.cta.subtitle")}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-2xl font-bold mb-1">
                    {t("subscriptionFeatures.stats.businesses")}
                  </div>
                  <div className="text-sm opacity-90">
                    {t("subscriptionFeatures.stats.businessesLabel")}
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-2xl font-bold mb-1">
                    {t("subscriptionFeatures.stats.leads")}
                  </div>
                  <div className="text-sm opacity-90">
                    {t("subscriptionFeatures.stats.leadsLabel")}
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-2xl font-bold mb-1">
                    {t("subscriptionFeatures.stats.satisfaction")}
                  </div>
                  <div className="text-sm opacity-90">
                    {t("subscriptionFeatures.stats.satisfactionLabel")}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <button className="bg-white text-gray-800 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all whitespace-nowrap cursor-pointer">
                  <i className="ri-rocket-line mr-2"></i>
                  {t("subscriptionFeatures.cta.trialButton")}
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-gray-800 transition-all whitespace-nowrap cursor-pointer">
                  <i className="ri-phone-line mr-2"></i>
                  {t("subscriptionFeatures.cta.demoButton")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
