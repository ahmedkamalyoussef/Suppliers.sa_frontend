"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "../lib/LanguageContext";
import { apiService } from "../lib/api";
import { TopRatedSuppliersResponse } from "../lib/types/topRatedSuppliers";
import { toast } from "react-toastify";
import MessageModal from "./MessageModal";
import BusinessCard from "./BusinessCard";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function TopSuppliers() {
  const { t, language } = useLanguage();
  const [isRTL, setIsRTL] = useState(false);
  const [topSuppliers, setTopSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);

  // Fetch top-rated suppliers from API
  useEffect(() => {
    const fetchTopSuppliers = async () => {
      try {
        const response: TopRatedSuppliersResponse =
          await apiService.getTopRatedSuppliers();

        // Transform API data to match BusinessCard component structure
        const transformedSuppliers = response.suppliers.map((supplier: any) => ({
          id: supplier.id,
          name: supplier.name || supplier.business_name || "",
          category: supplier.category || "General",
          businessType: supplier.business_type || "Supplier",
          location: supplier.address || supplier.city || "",
          rating: Number(supplier.average_rating) || 5.0,
          reviews: Number(supplier.total_ratings) || 0,
          reviewsCount: Number(supplier.total_ratings) || 0,
          verified: supplier.status === "verified",
          openNow: false,
          lat: Number(supplier.latitude) || 0,
          lng: Number(supplier.longitude) || 0,
          image: supplier.business_image || supplier.image || "",
          businessImage: supplier.business_image || "",
          services: supplier.services || supplier.certifications || [],
          targetCustomers: supplier.target_customers || [],
          serviceDistance: supplier.service_distance,
          status: supplier.status,
          preferences: {
            profile_visibility: supplier.profile_visibility || "public",
            allow_direct_contact: supplier.allow_direct_contact ?? true,
          },
        }));

        setTopSuppliers(transformedSuppliers);
      } catch (error) {
        console.error("Failed to fetch top suppliers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopSuppliers();
  }, []);

  // Check if user is logged in
  const isLoggedIn = () => {
    const userData = localStorage.getItem("supplier_user");
    return userData !== null;
  };

  // Handle view profile click with visibility check
  const handleViewProfile = (e: React.MouseEvent, supplier: any) => {
    e.preventDefault();

    // Check if profile is limited and user is not the owner
    if (supplier.profile_visibility === "limited") {
      const userData = localStorage.getItem("supplier_user");
      if (userData) {
        try {
          const user = JSON.parse(userData);
          if (user.id.toString() !== supplier.id.toString()) {
            // Logged in but not the owner
            toast.error(t("businessCard.privateProfile"));
            return;
          }
          // Logged in and owner - allow access
        } catch (error) {
          toast.error(t("businessCard.privateProfile"));
          return;
        }
      } else {
        // Not logged in
        toast.error(t("businessCard.privateProfile"));
        return;
      }
    }

    // If we reach here, allow navigation
    if (typeof window !== "undefined") {
      window.location.href = `/business/${supplier.id}`;
    }
  };

  // Handle message button click
  const handleMessageClick = (supplier: any) => {
    if (supplier.allow_direct_contact) {
      setSelectedSupplier(supplier);
      setShowMessageModal(true);
    }
  };

  useEffect(() => {
    const dir = document.documentElement.dir || document.body.dir || "ltr";
    setIsRTL(dir === "rtl");

    // إضافة CSS مخصص لتصحيح اتجاه الأسهم وتحسين الباجينيشن
    const style = document.createElement("style");
    style.textContent = `
      .swiper-rtl .swiper-button-next:after {
        content: 'prev';
      }
      .swiper-rtl .swiper-button-prev:after {
        content: 'next';
      }
      .custom-swiper {
        padding: 0 10px 40px;
      }
      .custom-swiper .swiper-slide {
        height: auto;
      }
      
      /* تحسينات الباجينيشن */
      .custom-pagination {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 20px;
        gap: 8px;
      }
      
      .custom-pagination .swiper-pagination-bullet {
        width: 8px;
        height: 8px;
        background-color: #d1d5db;
        opacity: 0.7;
        transition: all 0.3s ease;
        border-radius: 50%;
      }
      
      .custom-pagination .swiper-pagination-bullet-active {
        width: 24px;
        background-color: #f59e0b;
        opacity: 1;
        border-radius: 12px;
      }
      
      .custom-pagination .swiper-pagination-bullet:hover {
        opacity: 1;
        background-color: #fbbf24;
      }
      
      @media (max-width: 640px) {
        .custom-swiper {
          padding: 0 5px 40px;
        }
        
        .custom-pagination .swiper-pagination-bullet {
          width: 6px;
          height: 6px;
        }
        
        .custom-pagination .swiper-pagination-bullet-active {
          width: 20px;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const getBadgeColor = (businessType?: string) => {
    const norm = (businessType || "supplier").toLowerCase().trim();
    switch (norm) {
      case "office":
      case "company":
        return "bg-purple-100 text-purple-700 border border-purple-200";
      case "store":
      case "retail":
        return "bg-amber-100 text-amber-800 border border-amber-200";
      case "individual":
        return "bg-orange-100 text-orange-700 border border-orange-200";
      case "supplier":
      default:
        return "bg-blue-100 text-blue-700 border border-blue-200";
    }
  };

  const getBadgeKey = (badge: string) => {
    switch (badge) {
      case "Premium Supplier":
        return "topSuppliers.badgePremium";
      case "Top Rated":
        return "topSuppliers.badgeTopRated";
      case "Gold Partner":
        return "topSuppliers.badgeGoldPartner";
      case "Certified Organic":
        return "topSuppliers.badgeCertifiedOrganic";
      default:
        return "";
    }
  };

  const getFormattedBusinessType = (type?: string) => {
    if (!type || type === "undefined" || type === "null" || type === "unspecified" || type.trim() === "") {
      return language === "ar" ? "مورد" : "Supplier";
    }
    const normalized = type.toLowerCase().trim();
    const key = `publicProfile.businessTypes.${normalized}`;
    const val = t(key);
    if (val && val !== key && !val.includes("publicProfile.")) {
      return val;
    }
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <>
      <section className="py-8 sm:py-10 md:py-12 lg:py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
              {t("topSuppliers.title")}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              {t("topSuppliers.subtitle")}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            </div>
          ) : (
            <div className="relative ltr">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={16}
                slidesPerView={1}
                navigation={{
                  nextEl: ".swiper-button-next",
                  prevEl: ".swiper-button-prev",
                }}
                pagination={{
                  clickable: true,
                  el: ".custom-pagination",
                  type: "bullets",
                }}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                loop={topSuppliers.length > 3}
                dir={isRTL ? "rtl" : "ltr"}
                className="custom-swiper"
                breakpoints={{
                  0: {
                    slidesPerView: 1,
                    spaceBetween: 16,
                  },
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 16,
                  },
                  1024: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                  },
                  1280: {
                    slidesPerView: 4,
                    spaceBetween: 24,
                  },
                }}
                key={isRTL ? "rtl" : "ltr"}
              >
                {topSuppliers.map((supplier) => (
                  <SwiperSlide key={supplier.id} className="h-auto pb-4">
                    <div className="h-full">
                      <BusinessCard business={supplier} viewMode="grid" />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom Navigation Arrows */}
              <div className="swiper-button-prev !text-yellow-500 !scale-75 sm:!scale-100 after:!text-xl"></div>
              <div className="swiper-button-next !text-yellow-500 !scale-75 sm:!scale-100 after:!text-xl"></div>

              {/* Custom Pagination */}
              <div className="custom-pagination !bottom-0 mt-4"></div>
            </div>
          )}
          <div className="text-center mt-8 sm:mt-10 md:mt-12">
            <Link
              href="/businesses"
              className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full hover:from-yellow-500 hover:to-orange-600 font-semibold text-base sm:text-lg whitespace-nowrap cursor-pointer shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              {t("topSuppliers.viewAll")}
            </Link>
          </div>
        </div>
      </section>

      <MessageModal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        businessId={selectedSupplier?.id}
        businessName={selectedSupplier?.name}
      />
    </>
  );
}
