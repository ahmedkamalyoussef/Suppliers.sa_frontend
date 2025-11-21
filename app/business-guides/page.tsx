"use client";

import { useLanguage } from "@/lib/LanguageContext"; // عدل المسار حسب مكان الملف عندك

export default function Page() {
  const { t } = useLanguage();

  return (
    <main className="w-full px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t("businessGuides.title")}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t("businessGuides.subtitle")}
          </p>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <article className="border rounded-xl p-6 hover:shadow-sm transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t("businessGuides.guides.optimizeProfile.title")}
            </h3>
            <p className="text-gray-600">
              {t("businessGuides.guides.optimizeProfile.description")}
            </p>
          </article>
          <article className="border rounded-xl p-6 hover:shadow-sm transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t("businessGuides.guides.reviews.title")}
            </h3>
            <p className="text-gray-600">
              {t("businessGuides.guides.reviews.description")}
            </p>
          </article>
          <article className="border rounded-xl p-6 hover:shadow-sm transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t("businessGuides.guides.branchManagement.title")}
            </h3>
            <p className="text-gray-600">
              {t("businessGuides.guides.branchManagement.description")}
            </p>
          </article>
          <article className="border rounded-xl p-6 hover:shadow-sm transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t("businessGuides.guides.premium.title")}
            </h3>
            <p className="text-gray-600">
              {t("businessGuides.guides.premium.description")}
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}
