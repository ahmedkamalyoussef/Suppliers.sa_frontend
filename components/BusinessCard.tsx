"use client";

import Link from "next/link";
import { useLanguage } from "../lib/LanguageContext";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import MessageModal from "./MessageModal";

interface Business {
  id: number;
  name: string;
  category: string;
  businessType: string;
  location: string;
  distance: string;
  rating: number;
  reviews: number;
  verified: boolean;
  openNow: boolean;
  lat: number;
  lng: number;
  image: string;
  services: string[];
  targetCustomers: string[];
  serviceDistance: string | number;
  businessImage?: string;
  reviewsCount?: number;
  status?: string;
  preferences?: {
    profile_visibility: "public" | "limited";
    show_phone_publicly?: boolean;
    show_email_publicly?: boolean;
    allow_direct_contact?: boolean;
  };
  [key: string]: any; // For any additional properties
}

interface BusinessCardProps {
  business: Business;
  viewMode?: "grid" | "list";
}

export default function BusinessCard({
  business,
  viewMode = "grid",
}: BusinessCardProps) {
  const { t } = useLanguage();

  const [showMessageModal, setShowMessageModal] = useState(false);

  // Check if user is logged in
  const isLoggedIn = () => {
    const userData = localStorage.getItem("supplier_user");
    return userData !== null;
  };

  // Handle view profile click with visibility check
  const handleViewProfile = (e: React.MouseEvent) => {
    e.preventDefault();

    // Check if profile is limited and user is not the owner
    if (business.preferences?.profile_visibility === "limited") {
      const userData = localStorage.getItem("supplier_user");
      if (userData) {
        try {
          const user = JSON.parse(userData);
          if (user.id.toString() !== business.id.toString()) {
            // Logged in but not the owner
            toast.error("البروفايل خاص ولا يمكن مشاهدته");
            return;
          }
          // Logged in and owner - allow access
        } catch (error) {
          toast.error("البروفايل خاص ولا يمكن مشاهدته");
          return;
        }
      } else {
        // Not logged in
        toast.error("البروفايل خاص ولا يمكن مشاهدته");
        return;
      }
    }

    // If we reach here, allow navigation
    window.location.href = `/business/${business.id}`;
  };

  // Log business data when it changes
  useEffect(() => {}, [business]);

  // Get the image URL with fallback
  const getImageUrl = (imgUrl?: string) => {
    if (!imgUrl) return "/images/placeholder-business.jpg";
    if (imgUrl.startsWith("http")) return imgUrl;
    return `${process.env.NEXT_PUBLIC_API_URL || ""}${imgUrl}`;
  };

  // Format the rating display
  const formatRating = (rating: number) => {
    return rating % 1 === 0 ? rating.toFixed(1) : rating;
  };

  const getBusinessTypeIcon = (type: string): string => {
    switch (type) {
      case "supplier":
        return "ri-truck-line";
      case "store":
        return "ri-store-line";
      case "office":
        return "ri-building-line";
      case "individual":
        return "ri-user-line";
      default:
        return "ri-building-line";
    }
  };

  const getBusinessTypeColor = (type: string): string => {
    switch (type) {
      case "supplier":
        return "bg-blue-100 text-blue-700";
      case "store":
        return "bg-green-100 text-green-700";
      case "office":
        return "bg-purple-100 text-purple-700";
      case "individual":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "inactive":
        return "bg-red-100 text-red-700";
      case "suspended":
        return "bg-red-100 text-red-700";
      case "unknown":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string): string => {
    switch (status?.toLowerCase()) {
      case "active":
        return "ri-check-line";
      case "pending":
        return "ri-time-line";
      case "inactive":
        return "ri-close-line";
      case "suspended":
        return "ri-pause-line";
      case "unknown":
        return "ri-information-line";
      default:
        return "ri-information-line";
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
                src={getImageUrl(business.profileImage || business.image)}
                alt={business.name}
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/placeholder-business.jpg";
                }}
              />
              <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 shadow-md">
                <div
                  className={`${getStatusColor(
                    business.status || "unknown"
                  )} px-2 py-1 rounded-full flex items-center space-x-1`}
                >
                  <i
                    className={`${getStatusIcon(
                      business.status || "unknown"
                    )} text-xs`}
                  ></i>
                  <span className="text-xs font-medium">
                    {(business.status || "unknown")?.charAt(0).toUpperCase() +
                      (business.status || "unknown")?.slice(1)}
                  </span>
                </div>
              </div>
              {business.status === "verified" && (
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
                        {business.businessType?.charAt(0).toUpperCase() +
                          business.businessType?.slice(1)}
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
                        {business.services.join(", ")}
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
                  {business.preferences?.allow_direct_contact !== false &&
                    isLoggedIn() && (
                      <button
                        onClick={() => setShowMessageModal(true)}
                        className={`flex-1 md:w-full py-2 px-3 rounded-lg font-medium text-xs whitespace-nowrap cursor-pointer bg-yellow-400 text-white hover:bg-yellow-500`}
                      >
                        <i className="ri-message-line mr-2"></i>
                        {t("businessCard.message")}
                      </button>
                    )}
                  <button
                    onClick={handleViewProfile}
                    className="flex-1 md:w-full border border-yellow-400 text-yellow-600 py-2 px-3 rounded-lg hover:bg-yellow-50 font-medium text-xs whitespace-nowrap cursor-pointer text-center"
                  >
                    {t("businessCard.viewProfile")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const businessCardElement = (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img
          src={business.image}
          alt={business.name}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute top-4 right-4  rounded-full shadow-md">
          <div
            className={`${getStatusColor(
              business.status || "unknown"
            )} px-3 py-1 rounded-full flex items-center space-x-1`}
          >
            <i
              className={`${getStatusIcon(
                business.status || "unknown"
              )} text-xs`}
            ></i>
            <span className="text-xs font-medium">
              {(business.status || "unknown")?.charAt(0).toUpperCase() +
                (business.status || "unknown")?.slice(1)}
            </span>
          </div>
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
            <span className="text-xs font-medium">
              {business.businessType?.charAt(0).toUpperCase() +
                business.businessType?.slice(1)}
            </span>
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
              {t("businessCard.serves")}: {business.services.join(", ")}
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
          {business.preferences?.allow_direct_contact !== false &&
            isLoggedIn() && (
              <button
                onClick={() => setShowMessageModal(true)}
                className={`flex-1 py-2 px-3 rounded-lg font-medium text-xs whitespace-nowrap cursor-pointer bg-yellow-400 text-white hover:bg-yellow-500`}
              >
                <i className="ri-message-line mr-2"></i>
                {t("businessCard.message")}
              </button>
            )}
          <button
            onClick={handleViewProfile}
            className={`${
              isLoggedIn() &&
              business.preferences?.allow_direct_contact !== false
                ? "flex-1"
                : "w-full"
            } border border-yellow-400 text-yellow-600 py-2 px-3 rounded-lg hover:bg-yellow-50 font-medium text-xs whitespace-nowrap cursor-pointer text-center`}
          >
            {t("businessCard.viewProfile")}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {businessCardElement}
      <MessageModal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        businessId={business.id}
        businessName={business.name}
      />
    </>
  );
}
