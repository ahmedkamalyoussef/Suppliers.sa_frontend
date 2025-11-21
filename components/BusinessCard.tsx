"use client";

import Link from "next/link";
import { useLanguage } from "../lib/LanguageContext";
import type { Business } from "@/app/businesses/page";

interface BusinessCardProps {
  business: Business;
  viewMode?: "grid" | "list";
}

export default function BusinessCard({
  business,
  viewMode = "grid",
}: BusinessCardProps) {
  const { t } = useLanguage();

  const getBusinessTypeIcon = (type: string): string => {
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

  const getBusinessTypeColor = (type: string): string => {
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

  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Image */}
            <div className="md:w-48 h-32 md:h-auto relative overflow-hidden rounded-lg flex-shrink-0">
              <img
                src={business.image}
                alt={business.name}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 shadow-md">
                <span className="text-xs font-medium text-gray-700">
                  {business.distance}
                </span>
              </div>
              {business.verified && (
                <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-md">
                  {t("businessCard.verified")}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 flex-1">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-800">
                      {business.name}
                    </h3>
                    <div
                      className={`${getBusinessTypeColor(
                        business.businessType
                      )} px-2 py-1 rounded-full flex items-center space-x-1`}
                    >
                      <i
                        className={`${getBusinessTypeIcon(
                          business.businessType
                        )} text-xs`}
                      ></i>
                      <span className="text-xs font-medium">
                        {business.businessType}
                      </span>
                    </div>
                    {business.openNow && (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                        {t("businessCard.openNow")}
                      </span>
                    )}
                  </div>

                  <p className="text-yellow-600 font-medium text-sm mb-3">
                    {business.category}
                  </p>

                  <div className="flex items-center mb-3">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`text-sm ${
                            i < Math.floor(business.rating)
                              ? "ri-star-fill text-yellow-400"
                              : "ri-star-line text-gray-300"
                          }`}
                        ></i>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">
                      {business.rating} ({business.reviews}{" "}
                      {t("businessCard.reviews")})
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-xs text-gray-600">
                      <i className="ri-map-pin-line w-4 h-4 flex items-center justify-center mr-2"></i>
                      <span>{business.location}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-600">
                      <i className="ri-group-line w-4 h-4 flex items-center justify-center mr-2"></i>
                      <span>
                        {t("businessCard.serves")}:{" "}
                        {business.targetCustomers.join(", ")}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-gray-600">
                      <i className="ri-map-pin-range-line w-4 h-4 flex items-center justify-center mr-2"></i>
                      <span>
                        {t("businessCard.serviceArea")}:{" "}
                        {business.serviceDistance}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {business.services.slice(0, 3).map((service, index) => (
                      <span
                        key={index}
                        className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {service}
                      </span>
                    ))}
                    {business.services.length > 3 && (
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                        +{business.services.length - 3} {t("businessCard.more")}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions - Fixed positioning */}
                <div className="flex flex-row md:flex-col gap-2 md:w-32 md:self-end md:mt-auto">
                  <button className="flex-1 md:w-full bg-yellow-400 text-white py-2 px-3 rounded-lg hover:bg-yellow-500 font-medium text-xs whitespace-nowrap cursor-pointer">
                    <i className="ri-message-line mr-2"></i>
                    {t("businessCard.message")}
                  </button>
                  <Link
                    href={`/business/${business.id}`}
                    className="flex-1 md:w-full border border-yellow-400 text-yellow-600 py-2 px-3 rounded-lg hover:bg-yellow-50 font-medium text-xs whitespace-nowrap cursor-pointer text-center"
                  >
                    {t("businessCard.viewProfile")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img
          src={business.image}
          alt={business.name}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 shadow-md">
          <span className="text-sm font-medium text-gray-700">
            {business.distance}
          </span>
        </div>
        <div className="absolute top-4 left-4 flex items-center space-x-2">
          <div
            className={`${getBusinessTypeColor(
              business.businessType
            )} px-3 py-1 rounded-full flex items-center space-x-1 shadow-md`}
          >
            <i
              className={`${getBusinessTypeIcon(
                business.businessType
              )} text-sm`}
            ></i>
            <span className="text-xs font-medium">{business.businessType}</span>
          </div>
          {business.verified && (
            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-md">
              {t("businessCard.verified")}
            </div>
          )}
        </div>
        {business.openNow && (
          <div className="absolute bottom-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-md">
            {t("businessCard.openNow")}
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            {business.name}
          </h3>
          <p className="text-yellow-600 font-medium text-sm">
            {business.category}
          </p>
          <p className="text-gray-500 text-xs mt-1">{business.location}</p>
        </div>

        <div className="flex items-center mb-4">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <i
                key={i}
                className={`text-sm ${
                  i < Math.floor(business.rating)
                    ? "ri-star-fill text-yellow-400"
                    : "ri-star-line text-gray-300"
                }`}
              ></i>
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">
            {business.rating} ({business.reviews})
          </span>
        </div>

        <div className="mb-4 space-y-2">
          <div className="flex items-center text-xs text-gray-600">
            <i className="ri-group-line w-4 h-4 flex items-center justify-center mr-2"></i>
            <span>
              {t("businessCard.serves")}: {business.targetCustomers.join(", ")}
            </span>
          </div>
          <div className="flex items-center text-xs text-gray-600">
            <i className="ri-map-pin-range-line w-4 h-4 flex items-center justify-center mr-2"></i>
            <span>
              {t("businessCard.serviceArea")}: {business.serviceDistance}
            </span>
          </div>
        </div>

        <div className="mb-4 flex-1">
          <div className="flex flex-wrap gap-2">
            {business.services.slice(0, 2).map((service, index) => (
              <span
                key={index}
                className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium"
              >
                {service}
              </span>
            ))}
            {business.services.length > 2 && (
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                +{business.services.length - 2} {t("businessCard.more")}
              </span>
            )}
          </div>
        </div>

        {/* Buttons - Always at bottom */}
        <div className="flex space-x-2 mt-auto">
          <button className="flex-1 bg-yellow-400 text-white py-2 px-3 rounded-lg hover:bg-yellow-500 font-medium text-xs whitespace-nowrap cursor-pointer">
            <i className="ri-message-line mr-2"></i>
            {t("businessCard.message")}
          </button>
          <Link
            href={`/business/${business.id}`}
            className="flex-1 border border-yellow-400 text-yellow-600 py-2 px-3 rounded-lg hover:bg-yellow-50 font-medium text-xs whitespace-nowrap cursor-pointer text-center"
          >
            {t("businessCard.viewProfile")}
          </Link>
        </div>
      </div>
    </div>
  );
}
