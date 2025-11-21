"use client";

import { useLanguage } from "@/lib/LanguageContext";

export default function Page() {
  const { t } = useLanguage();

  return (
    <main className="w-full px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t("successStories.title")}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t("successStories.subtitle")}
          </p>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-xl p-6 hover:shadow-sm transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t("successStories.alNourTitle")}
            </h3>
            <p className="text-gray-600">{t("successStories.alNourDesc")}</p>
          </div>
          <div className="border rounded-xl p-6 hover:shadow-sm transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t("successStories.greenTechTitle")}
            </h3>
            <p className="text-gray-600">{t("successStories.greenTechDesc")}</p>
          </div>
          <div className="border rounded-xl p-6 hover:shadow-sm transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t("successStories.title")}
            </h3>
            <p className="text-gray-600">{t("successStories.desertDesc")}</p>
          </div>
        </section>
      </div>
    </main>
  );
}
