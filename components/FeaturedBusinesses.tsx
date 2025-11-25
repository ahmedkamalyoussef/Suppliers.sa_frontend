"use client";

import Link from "next/link";
import { useLanguage } from "../lib/LanguageContext";

interface Business {
  id: number;
  name: string;
  category: string;
  businessType: string;
  targetMarket: string[];
  serviceDistance: string;
  rating: number;
  reviews: number;
  distance: string;
  image: string;
  services: string[];
  businessImage: string;
  reviewsCount: number;
  status: string;
  
} 

interface FeaturedBusinessesProps {
  businesses: Business[];
}

export default function FeaturedBusinesses({ businesses }: FeaturedBusinessesProps) {
  const { t } = useLanguage();
  
  // Log the received businesses data
  console.log('Featured Businesses Data:', businesses);
  


  const getBusinessTypeIcon = (type: string) => {
    switch (type) {
      case "Supplier":
        return "ri-truck-line";
      case "Store":
        return "ri-store-line";
      case "Office":
        return "ri-building-line";
      case "Individual":
        return "ri-user-line";
      default:
        return "ri-building-line";
    }
  };

  const getBusinessTypeColor = (type: string) => {
    switch (type) {
      case "Supplier":
        return "bg-blue-100 text-blue-700";
      case "Store":
        return "bg-green-100 text-green-700";
      case "Office":
        return "bg-purple-100 text-purple-700";
      case "Individual":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <section className="py-8 sm:py-10 md:py-12 bg-white">
      <div className="w-full px-3 sm:px-4 md:px-6">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
            {t("featuredBusinessesTitle")}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            {t("featuredDescription")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {businesses.map((business) => (
            <div
              key={business.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer h-full flex flex-col"
            >
              <div className="relative h-40 sm:h-48 overflow-hidden">
                <img
                  src={business.businessImage}
                  alt={business.name}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white rounded-full px-2 sm:px-3 py-1 shadow-md">
                  <span className="text-xs sm:text-sm font-medium text-gray-700">
                    {business.serviceDistance} km
                  </span>
                </div>
                <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
                  <div
                    className={`${getBusinessTypeColor(
                      business.businessType
                    )} px-2 sm:px-3 py-1 rounded-full flex items-center space-x-1 shadow-md`}
                  >
                    <i
                      className={`${getBusinessTypeIcon(
                        business.businessType
                      )} text-xs sm:text-sm`}
                    ></i>
                    <span className="text-xs font-medium">
                      {business.businessType}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-5 md:p-6 flex-1 flex flex-col">
                <div className="mb-2 sm:mb-3">
                  <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1">
                    {business.name}
                  </h3>
                  <p className="text-yellow-600 font-medium text-xs sm:text-sm">
                    {business.category}
                  </p>
                </div>

                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`text-xs sm:text-sm ${
                          i < Math.floor(business.rating)
                            ? "ri-star-fill text-yellow-400"
                            : "ri-star-line text-gray-300"
                        }`}
                      ></i>
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600 ml-2">
                    {business.rating} ({business.reviewsCount})
                  </span>
                </div>

                {/* Service Information */}
                <div className="mb-3 sm:mb-4 space-y-1 sm:space-y-2">
                  <div className="flex items-center text-xs text-gray-600">
                    <i className="ri-group-line w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center mr-1 sm:mr-2"></i>
                    <span>
                      {t("featuredBusinesses.serves")}{" "}
                      {business.targetMarket.join(", ")}
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <i className="ri-map-pin-range-line w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center mr-1 sm:mr-2"></i>
                    <span>
                      {t("featuredBusinesses.serviceArea")}{" "}
                      {business.status}
                    </span>
                  </div>
                </div>

                <div className="mb-3 sm:mb-4 flex-1">
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {business.services.slice(0, 2).map((service, index) => (
                      <span
                        key={index}
                        className="bg-yellow-50 text-yellow-700 px-2 sm:px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {service}
                      </span>
                    ))}
                    {business.services.length > 2 && (
                      <span className="bg-gray-100 text-gray-600 px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
                        {t("featuredBusinesses.more").replace(
                          "{{count}}",
                          String(business.services.length - 2)
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {/* Buttons - Always at bottom */}
                <div className="flex space-x-1 sm:space-x-2 mt-auto">
                  <button className="flex-1 bg-yellow-400 text-white py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg hover:bg-yellow-500 font-medium text-xs whitespace-nowrap cursor-pointer">
                    <i className="ri-message-line mr-1 sm:mr-2"></i>
                    {t("sendMassege")}
                  </button>
                  <Link
                    href={`/business/${business.id}`}
                    className="flex-1 border border-yellow-400 text-yellow-600 py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg hover:bg-yellow-50 font-medium text-xs whitespace-nowrap cursor-pointer text-center"
                  >
                    {t("viewProfile")}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-10 md:mt-12">
          <button className="bg-yellow-400 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-yellow-500 font-semibold text-base sm:text-lg whitespace-nowrap cursor-pointer">
            {t("featuredBusinessesviewAll")}
          </button>
        </div>
      </div>
    </section>
  );
}
