"use client";

import { useLanguage } from "../lib/LanguageContext";
import BusinessCard from "./BusinessCard";

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
  preferences?: {
    profile_visibility: "public" | "limited";
  };
  [key: string]: any; // For any additional properties
}

interface FeaturedBusinessesProps {
  businesses: Business[];
}

export default function FeaturedBusinesses({
  businesses,
}: FeaturedBusinessesProps) {
  const { t } = useLanguage();

  // Transform businesses data to match BusinessCard interface
  const transformedBusinesses = businesses.map((business) => ({
    ...business, // First spread the original business data to keep all fields
    // Then override with our mapped fields
    id: business.id,
    name: business.name,
    address: business.address || "Address not available",
    location: business.address || "Address not available",
    lat: parseFloat(business.latitude) || 0,
    lng: parseFloat(business.longitude) || 0,
    latitude: business.latitude,
    longitude: business.longitude,
    type: business.category,
    category: business.category || "Other",
    businessType: business.businessType || "Supplier",
    // Use businessImage directly from the API response
    businessImage: business.businessImage,
    // For backward compatibility
    image: business.businessImage || "",
    profileImage: business.businessImage,

    serviceDistance: business.serviceDistance || "",
    rating: business.rating || 0,
    reviewsCount: business.reviewsCount || 0,
    reviews: business.reviewsCount || 0,
    categories: Array.isArray(business.categories)
      ? business.categories
      : [business.category || "Other"],
    phone: business.mainPhone || business.phone || "",
    status: business.status || "pending",
    contactEmail: business.contactEmail || "",
    targetMarket: Array.isArray(business.targetMarket)
      ? business.targetMarket
      : [],
    targetCustomers: Array.isArray(business.targetCustomers)
      ? business.targetCustomers
      : Array.isArray(business.targetMarket)
      ? business.targetMarket
      : [],
    services: Array.isArray(business.services) ? business.services : [],
    verified: business.verified || false,
    openNow: business.openNow || false,
    preferences: business.preferences,
    // Additional fields for FeaturedBusinesses compatibility
    business_name: business.name,
    business_type: business.businessType,
    target_market: business.targetMarket,
    service_distance: business.serviceDistance,
    reviews_count: business.reviewsCount,
    profile_image: business.businessImage,
    distance: business.serviceDistance,
  }));

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
          {transformedBusinesses.map((business) => (
            <BusinessCard
              key={business.id}
              business={business}
              viewMode="grid"
            />
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
