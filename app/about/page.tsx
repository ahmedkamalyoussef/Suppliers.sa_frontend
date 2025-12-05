"use client";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useLanguage } from "../../lib/LanguageContext";

export default function AboutPage() {
  const { t } = useLanguage("aboutPage");
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 to-yellow-50 py-20">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage: `url('https://readdy.ai/api/search-image?query=Modern%20Saudi%20Arabian%20business%20meeting%20with%20diverse%20professionals%20in%20traditional%20and%20modern%20attire%20collaborating%20in%20a%20bright%20conference%20room%20with%20Saudi%20Arabia%20flag%20elements%2C%20handshakes%20and%20partnership%20symbols%2C%20professional%20corporate%20environment%20with%20clean%20white%20background%20and%20green%20and%20golden%20accents%20representing%20business%20success%20and%20Vision%202030&width=1920&height=800&seq=about-hero-saudi&orientation=landscape')`,
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Saudi Made Section */}
          <div className="flex justify-center items-center mb-6">
            <div className="text-lg font-bold text-green-600">
              {t("aboutPage.saudiMade")}
            </div>
          </div>

          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {t("aboutPage.heroTitle")}
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
            {t("aboutPage.heroDesc")}
          </p>

          {/* Saudi Pride Statement */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto border border-green-100">
            <div className="flex items-center justify-center mb-4">
              <i className="ri-heart-fill text-3xl text-red-500 mr-3"></i>
              <h2 className="text-2xl font-bold text-green-600">
                {t("aboutPage.proudSaudi")}
              </h2>
              <i className="ri-heart-fill text-3xl text-red-500 ml-3"></i>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              {t("aboutPage.proudBody")}
            </p>
          </div>
        </div>
      </section>

      {/* Vision 2030 Support Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-yellow-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white mb-16">
            <div className="flex items-center justify-center mb-6">
              <h2 className="text-4xl font-bold">
                {t("aboutPage.supporting2030")}
              </h2>
            </div>
            <p className="text-xl text-green-100 max-w-4xl mx-auto leading-relaxed">
              {t("aboutPage.supporting2030Body")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-building-2-line text-3xl text-white"></i>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {t("aboutPage.econDiversification")}
              </h3>
              <p className="text-green-100 leading-relaxed">
                {t("aboutPage.econDiversificationBody")}
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-rocket-2-line text-3xl text-white"></i>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {t("aboutPage.digitalTransformation")}
              </h3>
              <p className="text-green-100 leading-relaxed">
                {t("aboutPage.digitalTransformationBody")}
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-team-line text-3xl text-white"></i>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {t("aboutPage.localEmpowerment")}
              </h3>
              <p className="text-green-100 leading-relaxed">
                {t("aboutPage.localEmpowermentBody")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <h2 className="text-4xl font-bold text-gray-900">
                  {t("aboutPage.missionTitle")}
                </h2>
              </div>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                {t("aboutPage.missionBody")}
              </p>

              {/* Local Impact Stats */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    5000+
                  </div>
                  <div className="text-gray-600">
                    {t("aboutPage.saudiBusinesses")}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    13
                  </div>
                  <div className="text-gray-600">
                    {t("aboutPage.saudiRegions")}
                  </div>
                </div>
              </div>

              {/* Community Support */}
              <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                <div className="flex items-center mb-4">
                  <i className="ri-community-line text-2xl text-green-600 mr-3"></i>
                  <h3 className="text-xl font-bold text-gray-900">
                    {t("aboutPage.communitySupport")}
                  </h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {t("aboutPage.communitySupportBody")}
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://readdy.ai/api/search-image?query=Professional%20Saudi%20Arabian%20business%20people%20in%20traditional%20thobe%20and%20modern%20business%20attire%20working%20together%20in%20a%20modern%20office%20space%20with%20Saudi%20Arabia%20flag%20in%20background%2C%20diverse%20team%20collaboration%20showing%20national%20pride%2C%20bright%20and%20professional%20environment%20with%20green%20and%20golden%20lighting%20representing%20Vision%202030%20success&width=600&height=400&seq=saudi-mission-image&orientation=landscape"
                alt="Our Saudi Mission"
                className="w-full h-96 object-cover object-top rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}

      <Footer />
    </div>
  );
}
