"use client";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useLanguage } from "../../lib/LanguageContext";

export default function PrivacyPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="py-12">
        <div className="w-full px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                {t("privacy.title")}
              </h1>
              <p className="text-gray-600 text-lg">{t("privacy.updated")}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {t("privacy.s1")}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {t("privacy.s1Body")}
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>{t("privacy.s1i1")}</li>
                  <li>{t("privacy.s1i2")}</li>
                  <li>{t("privacy.s1i3")}</li>
                  <li>{t("privacy.s1i4")}</li>
                  <li>{t("privacy.s1i5")}</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {t("privacy.s2")}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {t("privacy.s2Body")}
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>{t("privacy.s2i1")}</li>
                  <li>{t("privacy.s2i2")}</li>
                  <li>{t("privacy.s2i3")}</li>
                  <li>{t("privacy.s2i4")}</li>
                  <li>{t("privacy.s2i5")}</li>
                  <li>{t("privacy.s2i6")}</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {t("privacy.s3")}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {t("privacy.s3Body")}
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>{t("privacy.s3i1")}</li>
                  <li>{t("privacy.s3i2")}</li>
                  <li>{t("privacy.s3i3")}</li>
                  <li>{t("privacy.s3i4")}</li>
                  <li>{t("privacy.s3i5")}</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {t("privacy.s4")}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {t("privacy.s4Body")}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {t("privacy.s5")}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {t("privacy.s5Body")}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {t("privacy.s6")}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {t("privacy.s6Lead")}
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>{t("privacy.s6i1")}</li>
                  <li>{t("privacy.s6i2")}</li>
                  <li>{t("privacy.s6i3")}</li>
                  <li>{t("privacy.s6i4")}</li>
                  <li>{t("privacy.s6i5")}</li>
                  <li>{t("privacy.s6i6")}</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {t("privacy.s7")}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {t("privacy.s7Body")}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {t("privacy.s8")}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {t("privacy.s8Body")}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {t("privacy.s9")}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {t("privacy.s9Body")}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {t("privacy.s10")}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {t("privacy.s10Body")}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {t("privacy.s11")}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {t("privacy.s11Body")}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {t("privacy.contactTitle")}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {t("privacy.contactBody")}
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <p className="text-gray-700">
                    <strong>{t("privacy.email")}</strong> privacy@supplier.sa
                    <br />
                    <strong>{t("privacy.phone")}</strong> +966 11 123 4567
                    <br />
                    <strong>{t("privacy.address")}</strong> Riyadh, Saudi Arabia
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
