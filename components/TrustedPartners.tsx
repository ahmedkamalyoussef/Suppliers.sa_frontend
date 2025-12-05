"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "../lib/LanguageContext";
import Link from "next/link";

export default function TrustedPartners() {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  const partners = [
    {
      name: "Saudi Aramco",
      logo: "https://readdy.ai/api/search-image?query=Saudi%20Aramco%20company%20logo%20design%2C%20clean%20corporate%20branding%2C%20professional%20oil%20and%20gas%20company%20identity%2C%20modern%20minimalist%20logo%20on%20white%20background&width=160&height=80&seq=aramco-logo&orientation=landscape",
    },
    {
      name: "SABIC",
      logo: "https://readdy.ai/api/search-image?query=SABIC%20company%20logo%20design%2C%20Saudi%20Basic%20Industries%20Corporation%20branding%2C%20clean%20corporate%20identity%2C%20professional%20chemical%20company%20logo%20on%20white%20background&width=160&height=80&seq=sabic-logo&orientation=landscape",
    },
    {
      name: "STC (Saudi Telecom)",
      logo: "https://readdy.ai/api/search-image?query=STC%20Saudi%20Telecom%20Company%20logo%20design%2C%20telecommunications%20corporate%20branding%2C%20professional%20telecom%20company%20identity%2C%20clean%20modern%20logo%20on%20white%20background&width=160&height=80&seq=stc-logo&orientation=landscape",
    },
    {
      name: "Al Rajhi Bank",
      logo: "https://readdy.ai/api/search-image?query=Al%20Rajhi%20Bank%20logo%20design%2C%20Saudi%20banking%20corporate%20branding%2C%20professional%20financial%20institution%20identity%2C%20clean%20Islamic%20banking%20logo%20on%20white%20background&width=160&height=80&seq=alrajhi-logo&orientation=landscape",
    },
    {
      name: "SAMBA Financial Group",
      logo: "https://readdy.ai/api/search-image?query=SAMBA%20Financial%20Group%20logo%20design%2C%20Saudi%20banking%20corporate%20branding%2C%20professional%20financial%20services%20identity%2C%20clean%20modern%20banking%20logo%20on%20white%20background&width=160&height=80&seq=samba-logo&orientation=landscape",
    },
    {
      name: "Mobily",
      logo: "https://readdy.ai/api/search-image?query=Mobily%20telecommunications%20logo%20design%2C%20Saudi%20mobile%20company%20branding%2C%20professional%20telecom%20corporate%20identity%2C%20clean%20modern%20logo%20on%20white%20background&width=160&height=80&seq=mobily-logo&orientation=landscape",
    },
    {
      name: "ACWA Power",
      logo: "https://readdy.ai/api/search-image?query=ACWA%20Power%20company%20logo%20design%2C%20Saudi%20energy%20company%20branding%2C%20professional%20power%20generation%20corporate%20identity%2C%20clean%20renewable%20energy%20logo%20on%20white%20background&width=160&height=80&seq=acwa-logo&orientation=landscape",
    },
    {
      name: "Ma'aden",
      logo: "https://readdy.ai/api/search-image?query=Maaden%20Saudi%20Arabian%20Mining%20Company%20logo%20design%2C%20mining%20corporate%20branding%2C%20professional%20industrial%20company%20identity%2C%20clean%20modern%20mining%20logo%20on%20white%20background&width=160&height=80&seq=maaden-logo&orientation=landscape",
    },
    {
      name: "Saudi Electricity Company",
      logo: "https://readdy.ai/api/search-image?query=Saudi%20Electricity%20Company%20SEC%20logo%20design%2C%20Saudi%20power%20utility%20branding%2C%20professional%20electrical%20company%20identity%2C%20clean%20energy%20sector%20logo%20on%20white%20background&width=160&height=80&seq=sec-logo&orientation=landscape",
    },
    {
      name: "NEOM",
      logo: "https://readdy.ai/api/search-image?query=NEOM%20project%20logo%20design%2C%20Saudi%20futuristic%20city%20branding%2C%20professional%20smart%20city%20corporate%20identity%2C%20clean%20modern%20development%20logo%20on%20white%20background&width=160&height=80&seq=neom-logo&orientation=landscape",
    },
    {
      name: "Red Sea Development",
      logo: "https://readdy.ai/api/search-image?query=Red%20Sea%20Development%20Company%20logo%20design%2C%20Saudi%20tourism%20development%20branding%2C%20professional%20real%20estate%20corporate%20identity%2C%20clean%20luxury%20resort%20logo%20on%20white%20background&width=160&height=80&seq=redsea-logo&orientation=landscape",
    },
    {
      name: "Saudi Airlines",
      logo: "https://readdy.ai/api/search-image?query=Saudi%20Arabian%20Airlines%20Saudia%20logo%20design%2C%20national%20carrier%20branding%2C%20professional%20aviation%20company%20identity%2C%20clean%20airline%20logo%20on%20white%20background&width=160&height=80&seq=saudia-logo&orientation=landscape",
    },
    {
      name: "Alinma Bank",
      logo: "https://readdy.ai/api/search-image?query=Alinma%20Bank%20logo%20design%2C%20Saudi%20Islamic%20banking%20branding%2C%20professional%20financial%20institution%20identity%2C%20clean%20modern%20banking%20logo%20on%20white%20background&width=160&height=80&seq=alinma-logo&orientation=landscape",
    },
    {
      name: "NCB Capital",
      logo: "https://readdy.ai/api/search-image?query=NCB%20Capital%20investment%20company%20logo%20design%2C%20Saudi%20financial%20services%20branding%2C%20professional%20investment%20banking%20identity%2C%20clean%20modern%20finance%20logo%20on%20white%20background&width=160&height=80&seq=ncb-logo&orientation=landscape",
    },
    {
      name: "Riyad Bank",
      logo: "https://readdy.ai/api/search-image?query=Riyad%20Bank%20logo%20design%2C%20Saudi%20banking%20corporate%20branding%2C%20professional%20financial%20institution%20identity%2C%20clean%20modern%20banking%20logo%20on%20white%20background&width=160&height=80&seq=riyad-logo&orientation=landscape",
    },
  ];

  // Mobile and tablet responsive display
  const getPartnersToShow = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) return { top: 3, bottom: 3 }; // Mobile
      if (window.innerWidth < 1024) return { top: 4, bottom: 4 }; // Tablet
      return { top: 6, bottom: 6 }; // Desktop
    }
    return { top: 6, bottom: 6 };
  };

  const [partnersToShow, setPartnersToShow] = useState(getPartnersToShow());

  useEffect(() => {
    const handleResize = () => {
      setPartnersToShow(getPartnersToShow());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Split partners based on responsive settings
  const topRowPartners = partners.slice(0, partnersToShow.top);
  const bottomRowPartners = partners.slice(
    partnersToShow.top,
    partnersToShow.top + partnersToShow.bottom
  );

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-gray-50 via-white to-yellow-50">
      <div className="w-full px-4 md:px-6">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">
            {t("trustedPartners.title")}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-6 md:mb-8">
            {t("trustedPartners.subtitle")}
          </p>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto mb-8 md:mb-12">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-yellow-600 mb-2">
                1,500+
              </div>
              <div className="text-gray-600 text-sm md:text-base">
                {t("trustedPartners.statsVerified")}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-yellow-600 mb-2">
                50,000+
              </div>
              <div className="text-gray-600 text-sm md:text-base">
                {t("trustedPartners.statsConnections")}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-yellow-600 mb-2">
                4.9/5
              </div>
              <div className="text-gray-600 flex items-center justify-center space-x-1 text-sm md:text-base">
                <span>{t("trustedPartners.statsAverageRating")}</span>
                <i className="ri-star-fill text-yellow-400"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Top Row */}
        <div
          className={`grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6 mb-6 md:mb-8 max-w-7xl mx-auto`}
        >
          {topRowPartners.map((partner, index) => (
            <div
              key={`top-${index}`}
              className="bg-white rounded-2xl border border-gray-100 p-3 md:p-6 hover:shadow-lg transition-all duration-300 cursor-pointer h-24 md:h-32 flex items-center justify-center group"
            >
              <div className="text-center">
                <div className="h-8 md:h-12 flex items-center justify-center mb-2 md:mb-3">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-full w-auto object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
                <p className="text-xs md:text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors duration-300 hidden sm:block">
                  {partner.name}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Row */}
        <div
          className={`grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6 max-w-7xl mx-auto`}
        >
          {bottomRowPartners.map((partner, index) => (
            <div
              key={`bottom-${index}`}
              className="bg-white rounded-2xl border border-gray-100 p-3 md:p-6 hover:shadow-lg transition-all duration-300 cursor-pointer h-24 md:h-32 flex items-center justify-center group"
            >
              <div className="text-center">
                <div className="h-8 md:h-12 flex items-center justify-center mb-2 md:mb-3">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-full w-auto object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
                <p className="text-xs md:text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors duration-300 hidden sm:block">
                  {partner.name}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-8 md:mt-12">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 md:p-8 max-w-3xl mx-auto shadow-xl">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
              {t("trustedPartners.ctaTitle")}
            </h3>
            <p className="text-yellow-100 mb-6 text-base md:text-lg">
              {t("trustedPartners.ctaDesc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  // Dispatch a custom event to open the contact modal in the header
                  window.dispatchEvent(new CustomEvent('openContactModal'));
                }}
                className="bg-white text-yellow-600 px-6 md:px-8 py-3 md:py-4 rounded-full hover:bg-gray-100 font-semibold text-base md:text-lg whitespace-nowrap cursor-pointer shadow-lg transition-colors duration-200"
              >
                {t("trustedPartners.ctaBecomePartner")}
              </button>
              <Link 
                href="/businesses"
                className="border-2 border-white text-white px-6 md:px-8 py-3 md:py-4 rounded-full hover:bg-white hover:text-yellow-600 font-semibold text-base md:text-lg whitespace-nowrap cursor-pointer text-center transition-colors duration-200"
              >
                {t("trustedPartners.ctaExploreNetwork")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
