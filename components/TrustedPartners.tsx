"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "../lib/LanguageContext";
import Link from "next/link";
import { apiService } from "../lib/api";
import type { Partnership } from "../lib/types/partnerships";

export default function TrustedPartners() {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<{
    verified_businesses: number;
    successful_connections: number;
    average_rating: number;
  } | null>(null);

  // Fetch partnerships and statistics from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [partnershipsResponse, statisticsResponse] = await Promise.all([
          apiService.getPartnerships(),
          apiService.getBusinessesStatistics(),
        ]);

        console.log("Partnerships:", partnershipsResponse);
        console.log("Statistics:", statisticsResponse);

        // The response is directly an array, not nested under partnerships
        setPartnerships(
          Array.isArray(partnershipsResponse) ? partnershipsResponse : []
        );
        setStatistics(statisticsResponse);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // Keep empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  // Split partnerships based on responsive settings
  const topRowPartners = partnerships.slice(0, partnersToShow.top);
  const bottomRowPartners = partnerships.slice(
    partnersToShow.top,
    partnersToShow.top + partnersToShow.bottom
  );

  // If we have fewer partnerships than grid can hold, center them using flex
  const shouldCenterTop = topRowPartners.length < partnersToShow.top;
  const shouldCenterBottom = bottomRowPartners.length < partnersToShow.bottom;

  // For centering, we need to wrap in flex container
  const TopRowContainer = shouldCenterTop ? "div" : "div";
  const BottomRowContainer = shouldCenterBottom ? "div" : "div";

  // Show loading state
  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-gradient-to-br from-gray-50 via-white to-yellow-50">
        <div className="w-full px-4 md:px-6">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">
              {t("trustedPartners.title")}
            </h2>
            <div className="animate-pulse">
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6 mb-6 md:mb-8 max-w-7xl mx-auto">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-200 rounded-2xl h-24 md:h-32 animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

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
                {statistics
                  ? `${statistics.verified_businesses.toLocaleString()}+`
                  : "1,500+"}
              </div>
              <div className="text-gray-600 text-sm md:text-base">
                {t("trustedPartners.statsVerified")}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-yellow-600 mb-2">
                {statistics
                  ? `${statistics.successful_connections.toLocaleString()}+`
                  : "50,000+"}
              </div>
              <div className="text-gray-600 text-sm md:text-base">
                {t("trustedPartners.statsConnections")}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-yellow-600 mb-2">
                {statistics ? `${statistics.average_rating}/5` : "4.9/5"}
              </div>
              <div className="text-gray-600 flex items-center justify-center space-x-1 text-sm md:text-base">
                <span>{t("trustedPartners.statsAverageRating")}</span>
                <i className="ri-star-fill text-yellow-400"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Top Row */}
        {shouldCenterTop ? (
          <div className="flex justify-center gap-3 md:gap-6 mb-6 md:mb-8 max-w-7xl mx-auto flex-wrap">
            {topRowPartners.map((partner, index) => (
              <div
                key={`top-${index}`}
                className="bg-white rounded-2xl border border-gray-100 p-3 md:p-6 hover:shadow-lg transition-all duration-300 cursor-pointer h-24 md:h-32 flex items-center justify-center group"
              >
                <div className="text-center">
                  <div className="h-12 md:h-16 flex items-center justify-center mb-2 md:mb-3">
                    <img
                      src={partner.image}
                      alt={partner.name}
                      className="h-full w-auto rounded-md object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300 max-w-full"
                    />
                  </div>
                  <p className="text-xs md:text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors duration-300 hidden sm:block">
                    {partner.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6 mb-6 md:mb-8 max-w-7xl mx-auto">
            {topRowPartners.map((partner, index) => (
              <div
                key={`top-${index}`}
                className="bg-white rounded-2xl border border-gray-100 p-3 md:p-6 hover:shadow-lg transition-all duration-300 cursor-pointer h-24 md:h-32 flex items-center justify-center group"
              >
                <div className="text-center">
                  <div className="h-12 md:h-16 flex items-center justify-center mb-2 md:mb-3">
                    <img
                      src={partner.image}
                      alt={partner.name}
                      className="h-full w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300 max-w-full"
                    />
                  </div>
                  <p className="text-xs md:text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors duration-300 hidden sm:block">
                    {partner.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Row */}
        {shouldCenterBottom ? (
          <div className="flex justify-center gap-3 md:gap-6 max-w-7xl mx-auto flex-wrap">
            {bottomRowPartners.map((partner, index) => (
              <div
                key={`bottom-${index}`}
                className="bg-white rounded-2xl border border-gray-100 p-3 md:p-6 hover:shadow-lg transition-all duration-300 cursor-pointer h-24 md:h-32 flex items-center justify-center group"
              >
                <div className="text-center">
                  <div className="h-12 md:h-16 flex items-center justify-center mb-2 md:mb-3">
                    <img
                      src={partner.image}
                      alt={partner.name}
                      className="h-full w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300 max-w-full"
                    />
                  </div>
                  <p className="text-xs md:text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors duration-300 hidden sm:block">
                    {partner.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6 max-w-7xl mx-auto">
            {bottomRowPartners.map((partner, index) => (
              <div
                key={`bottom-${index}`}
                className="bg-white rounded-2xl border border-gray-100 p-3 md:p-6 hover:shadow-lg transition-all duration-300 cursor-pointer h-24 md:h-32 flex items-center justify-center group"
              >
                <div className="text-center">
                  <div className="h-12 md:h-16 flex items-center justify-center mb-2 md:mb-3">
                    <img
                      src={partner.image}
                      alt={partner.name}
                      className="h-full w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300 max-w-full"
                    />
                  </div>
                  <p className="text-xs md:text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors duration-300 hidden sm:block">
                    {partner.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

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
                  window.dispatchEvent(new CustomEvent("openContactModal"));
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
