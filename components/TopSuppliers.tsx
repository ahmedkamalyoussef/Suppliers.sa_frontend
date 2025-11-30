"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "../lib/LanguageContext";
import { apiService } from "../lib/api";
import { TopRatedSuppliersResponse } from "../lib/types/topRatedSuppliers";
import { toast } from "react-toastify";
import MessageModal from "./MessageModal";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function TopSuppliers() {
  const { t } = useLanguage();
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

        // Transform API data to match component structure
        const transformedSuppliers = response.suppliers.map((supplier) => ({
          id: supplier.id,
          name: supplier.name,
          category: supplier.category,
          businessType: supplier.business_type,
          rating: supplier.average_rating,
          reviews: supplier.total_ratings,
          specialization: supplier.business_name,
          image: supplier.business_image,
          badge: supplier.business_type,
          features: supplier.certifications.slice(0, 3),
          totalCertifications: supplier.total_certifications,
          hasMoreCertifications: supplier.total_certifications > 3,
          remainingCertifications: supplier.total_certifications - 3,
          profile_visibility: supplier.profile_visibility,
          allow_direct_contact: supplier.allow_direct_contact,
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
    window.location.href = `/business/${supplier.id}`;
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

  const getBadgeColor = (businessType: string) => {
    switch (businessType) {
      case "supplier":
        return "bg-gradient-to-r from-blue-500 to-blue-600";
      case "office":
        return "bg-gradient-to-r from-green-500 to-green-600";
      case "store":
        return "bg-gradient-to-r from-purple-500 to-purple-600";
      case "individual":
        return "bg-gradient-to-r from-orange-500 to-orange-600";
      case "service":
        return "bg-gradient-to-r from-pink-500 to-pink-600";
      case "retail":
        return "bg-gradient-to-r from-indigo-500 to-indigo-600";
      case "consultant":
        return "bg-gradient-to-r from-teal-500 to-teal-600";
      case "contractor":
        return "bg-gradient-to-r from-red-500 to-red-600";
      case "wholesale":
        return "bg-gradient-to-r from-yellow-500 to-yellow-600";
      case "freelancer":
        return "bg-gradient-to-r from-cyan-500 to-cyan-600";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-700";
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
      case "Heritage Brand":
        return "topSuppliers.badgeHeritageBrand";
      case "Innovation Leader":
        return "topSuppliers.badgeInnovationLeader";
      default:
        return "";
    }
  };

  return (
    <>
      <section className="py-8 sm:py-10 md:py-12 lg:py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="w-full px-3 sm:px-4 md:px-6">
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
                  pauseOnMouseEnter: true, // إضافة هذه الخاصية لتوقيف الأوتوبلاي عند التمرير بالفأرة
                }}
                loop
                dir={isRTL ? "rtl" : "ltr"}
                className="custom-swiper"
                breakpoints={{
                  0: {
                    slidesPerView: 1,
                    spaceBetween: 12,
                  },
                  640: {
                    slidesPerView: 1,
                    spaceBetween: 16,
                  },
                  768: {
                    slidesPerView: 2,
                    spaceBetween: 16,
                  },
                  1024: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                  },
                  1280: {
                    slidesPerView: 3,
                    spaceBetween: 24,
                  },
                }}
                // إضافة هذه الخاصية لضمان عمل السوايبر بشكل صحيح عند تغيير اللغة
                key={isRTL ? "rtl" : "ltr"}
              >
                {topSuppliers.map((supplier) => (
                  <SwiperSlide key={supplier.id}>
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer h-full flex flex-col">
                      <div className="relative h-32 sm:h-40 md:h-48 lg:h-56 overflow-hidden flex-shrink-0">
                        <img
                          src={supplier.image}
                          alt={supplier.name}
                          className="w-full h-full object-cover object-top"
                          onError={(e) => {
                            console.error(
                              "Image failed to load:",
                              supplier.image
                            );
                            e.currentTarget.src =
                              "https://via.placeholder.com/400x300/e5e7eb/6b7280?text=No+Image";
                          }}
                        />
                        <div className="absolute top-2 left-2">
                          <div
                            className={`${getBadgeColor(
                              supplier.businessType
                            )} text-white px-2 py-1 rounded-full shadow-lg`}
                          >
                            <span className="text-xs font-bold capitalize">
                              {supplier.businessType}
                            </span>
                          </div>
                        </div>
                        <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 shadow-md">
                          <div className="flex items-center space-x-1">
                            <i className="ri-star-fill text-yellow-400 text-xs"></i>
                            <span className="text-xs font-bold text-gray-800">
                              {supplier.rating}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="text-sm font-bold text-gray-800 mb-1">
                          {supplier.name}
                        </h3>
                        <p className="text-yellow-600 font-medium text-xs">
                          {supplier.category}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          {supplier.specialization}
                        </p>

                        <div className="flex items-center mt-2 text-xs">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={`text-xs ${
                                i < Math.floor(supplier.rating)
                                  ? "ri-star-fill text-yellow-400"
                                  : "ri-star-line text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="text-gray-600 ml-2">
                            {t("topSuppliers.reviews").replace(
                              "{{count}}",
                              String(supplier.reviews)
                            )}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1 mt-2">
                          {supplier.features.map(
                            (feature: string, index: number) => (
                              <span
                                key={index}
                                className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium"
                              >
                                {feature}
                              </span>
                            )
                          )}
                          {supplier.hasMoreCertifications && (
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                              +{supplier.remainingCertifications}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                          {supplier.allow_direct_contact && isLoggedIn() &&(
                            <button
                              onClick={() => handleMessageClick(supplier)}
                              className="flex-1 bg-yellow-400 text-white py-2 rounded-lg hover:bg-yellow-500 text-xs font-medium transition-colors"
                            >
                              <i className="ri-message-line mr-1"></i>{" "}
                              {t("topSuppliers.message")}
                            </button>
                          )}
                          <Link
                            href={`/business/${supplier.id}`}
                            onClick={(e) => handleViewProfile(e, supplier)}
                            className={`${
                              supplier.allow_direct_contact && isLoggedIn()
                                ? "flex-1"
                                : "w-full"
                            } border border-yellow-400 text-yellow-600 py-2 rounded-lg hover:bg-yellow-50 text-xs font-medium text-center transition-colors`}
                          >
                            {t("topSuppliers.viewDetails")}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom Navigation Arrows */}
              <div className="swiper-button-prev !text-yellow-500 !scale-75 sm:!scale-100 after:!text-xl"></div>
              <div className="swiper-button-next !text-yellow-500 !scale-75 sm:!scale-100 after:!text-xl"></div>

              {/* Custom Pagination - تم تحسينها */}
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
