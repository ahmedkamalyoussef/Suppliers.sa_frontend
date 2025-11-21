"use client";

import { useLanguage } from "../../lib/LanguageContext";

export default function Page() {
  const { t } = useLanguage();
  return (
    <main className="w-full px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t("support.title")}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t("support.description")}
          </p>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t("support.openTicketTitle")}
            </h3>
            <p className="text-gray-600 mb-4">{t("support.openTicketDesc")}</p>
            <a
              href="/login"
              className="text-yellow-600 hover:text-yellow-700 font-medium"
            >
              {t("support.signInToCreate")}
            </a>
          </div>
          <div className="border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t("support.knowledgeBaseTitle")}
            </h3>
            <p className="text-gray-600 mb-4">
              {t("support.knowledgeBaseDesc")}
            </p>
            <a
              href="/help-center"
              className="text-yellow-600 hover:text-yellow-700 font-medium"
            >
              {t("support.browseArticles")}
            </a>
          </div>
          <div className="border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t("support.contactUsTitle")}
            </h3>
            <p className="text-gray-600 mb-4">{t("support.contactUsDesc")}</p>
            <a
              href="mailto:support@supplier.sa"
              className="text-yellow-600 hover:text-yellow-700 font-medium"
            >
              {t("support.emailSupport")}
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
