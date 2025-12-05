"use client";

import { useLanguage } from "@/lib/LanguageContext";

export default function Page() {
  const { t } = useLanguage();

  return (
    <main className="w-full px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t("help.title")}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">{t("help.intro")}</p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border rounded-xl p-6 hover:shadow-sm transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t("help.gettingStartedTitle")}
            </h3>
            <p className="text-gray-600 mb-4">{t("help.gettingStartedDesc")}</p>
            <a
              href="/add-business"
              className="text-yellow-600 hover:text-yellow-700 font-medium"
            >
              {t("help.createAccountCta")}
            </a>
          </div>

          <div className="border rounded-xl p-6 hover:shadow-sm transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t("help.managingBusinessTitle")}
            </h3>
            <p className="text-gray-600 mb-4">
              {t("help.managingBusinessDesc")}
            </p>
            <a
              href="/dashboard"
              className="text-yellow-600 hover:text-yellow-700 font-medium"
            >
              {t("help.openDashboardCta")}
            </a>
          </div>

          <div className="border rounded-xl p-6 hover:shadow-sm transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t("help.plansBillingTitle")}
            </h3>
            <p className="text-gray-600 mb-4">{t("help.plansBillingDesc")}</p>
            <a
              href="/subscription"
              className="text-yellow-600 hover:text-yellow-700 font-medium"
            >
              {t("help.viewPlansCta")}
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
