"use client";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useLanguage } from "../../lib/LanguageContext";

export default function TermsPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="py-12">
        <div className="w-full px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                {t("terms.title")}
              </h1>
              <p className="text-gray-600 text-lg">{t("terms.updated")}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {t("terms.section1")}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {t("terms.section1Body")}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {t("terms.section2")}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {t("terms.section2Body")}
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>{t("terms.s2i1")}</li>
                  <li>{t("terms.s2i2")}</li>
                  <li>{t("terms.s2i3")}</li>
                  <li>{t("terms.s2i4")}</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {t("terms.section3")}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {t("terms.section3Lead")}
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>{t("terms.s3i1")}</li>
                  <li>{t("terms.s3i2")}</li>
                  <li>{t("terms.s3i3")}</li>
                  <li>{t("terms.s3i4")}</li>
                  <li>{t("terms.s3i5")}</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {t("terms.section4")}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {t("terms.section4Body")}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {t("terms.section5")}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {t("terms.section5Body")}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {t("terms.section6")}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {t("terms.section6Lead")}
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>{t("terms.s6i1")}</li>
                  <li>{t("terms.s6i2")}</li>
                  <li>{t("terms.s6i3")}</li>
                  <li>{t("terms.s6i4")}</li>
                  <li>{t("terms.s6i5")}</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {t("terms.section7")}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {t("terms.section7Body")}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {t("terms.section8")}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {t("terms.section8Body")}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {t("terms.section9")}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {t("terms.section9Body")}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {t("terms.section10")}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {t("terms.section10Body")}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {t("terms.contactTitle")}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {t("terms.contactBody")}
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <p className="text-gray-700">
                    <strong>{t("terms.email")}</strong>{" "}
                    Supplier.com.sa@gmail.com
                    <br />
                    <strong>{t("terms.phone")}</strong> +966 54 274 1977
                    <br />
                    <strong>{t("terms.address")}</strong> Riyadh, Saudi Arabia
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
