"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "../lib/LanguageContext";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function TopSuppliers() {
  const { t } = useLanguage();
  const [isRTL, setIsRTL] = useState(false);

  const topSuppliers = [
    {
      id: 101,
      name: "Saudi Steel Manufacturing Co.",
      category: "Steel & Metal",
      businessType: "Supplier",
      rating: 4.9,
      reviews: 428,
      yearsInBusiness: 15,
      clientsServed: "500+",
      specialization: "Industrial Steel Solutions",
      image:
        "https://readdy.ai/api/search-image?query=Modern%20steel%20manufacturing%20facility%20with%20organized%20metal%20sheets%20and%20beams%2C%20industrial%20workspace%20with%20bright%20lighting%2C%20professional%20steel%20production%20environment%2C%20clean%20factory%20floor%20with%20yellow%20safety%20elements&width=400&height=280&seq=steel-supplier&orientation=landscape",
      badge: "Premium Supplier",
      features: ["ISO Certified", "24/7 Support", "Custom Solutions"],
    },
    {
      id: 201,
      name: "Saudi Steel Manufacturing Co.",
      category: "Steel & Metal",
      businessType: "Supplier",
      rating: 4.9,
      reviews: 428,
      yearsInBusiness: 15,
      clientsServed: "500+",
      specialization: "Industrial Steel Solutions",
      image:
        "https://readdy.ai/api/search-image?query=Modern%20steel%20manufacturing%20facility%20with%20organized%20metal%20sheets%20and%20beams%2C%20industrial%20workspace%20with%20bright%20lighting%2C%20professional%20steel%20production%20environment%2C%20clean%20factory%20floor%20with%20yellow%20safety%20elements&width=400&height=280&seq=steel-supplier&orientation=landscape",
      badge: "Premium Supplier",
      features: ["ISO Certified", "24/7 Support", "Custom Solutions"],
    },
    {
      id: 221,
      name: "Saudi Steel Manufacturing Co.",
      category: "Steel & Metal",
      businessType: "Supplier",
      rating: 4.9,
      reviews: 428,
      yearsInBusiness: 15,
      clientsServed: "500+",
      specialization: "Industrial Steel Solutions",
      image:
        "https://readdy.ai/api/search-image?query=Modern%20steel%20manufacturing%20facility%20with%20organized%20metal%20sheets%20and%20beams%2C%20industrial%20workspace%20with%20bright%20lighting%2C%20professional%20steel%20production%20environment%2C%20clean%20factory%20floor%20with%20yellow%20safety%20elements&width=400&height=280&seq=steel-supplier&orientation=landscape",
      badge: "Premium Supplier",
      features: ["ISO Certified", "24/7 Support", "Custom Solutions"],
    },
    {
      id: 300,
      name: "Saudi Steel Manufacturing Co.",
      category: "Steel & Metal",
      businessType: "Supplier",
      rating: 4.9,
      reviews: 428,
      yearsInBusiness: 15,
      clientsServed: "500+",
      specialization: "Industrial Steel Solutions",
      image:
        "https://readdy.ai/api/search-image?query=Modern%20steel%20manufacturing%20facility%20with%20organized%20metal%20sheets%20and%20beams%2C%20industrial%20workspace%20with%20bright%20lighting%2C%20professional%20steel%20production%20environment%2C%20clean%20factory%20floor%20with%20yellow%20safety%20elements&width=400&height=280&seq=steel-supplier&orientation=landscape",
      badge: "Premium Supplier",
      features: ["ISO Certified", "24/7 Support", "Custom Solutions"],
    },
    {
      id: 102,
      name: "Al-Rajhi Electronics Wholesale",
      category: "Electronics",
      businessType: "Supplier",
      rating: 4.8,
      reviews: 356,
      yearsInBusiness: 12,
      clientsServed: "300+",
      specialization: "Consumer Electronics Distribution",
      image:
        "https://readdy.ai/api/search-image?query=Large%20electronics%20wholesale%20warehouse%20with%20organized%20shelves%20of%20electronic%20devices%2C%20modern%20distribution%20center%2C%20professional%20lighting%2C%20clean%20industrial%20space%20with%20electronic%20components%20neatly%20arranged&width=400&height=280&seq=electronics-wholesale&orientation=landscape",
      badge: "Top Rated",
      features: ["Bulk Discounts", "Fast Delivery", "Warranty Support"],
    },
    {
      id: 103,
      name: "Kingdom Construction Materials",
      category: "Construction",
      businessType: "Supplier",
      rating: 4.9,
      reviews: 521,
      yearsInBusiness: 20,
      clientsServed: "800+",
      specialization: "Premium Building Materials",
      image:
        "https://readdy.ai/api/search-image?query=Professional%20construction%20materials%20warehouse%20with%20organized%20cement%20bags%2C%20steel%20rods%2C%20building%20supplies%2C%20clean%20industrial%20environment%20with%20yellow%20safety%20markings%2C%20modern%20storage%20facility&width=400&height=280&seq=construction-materials&orientation=landscape",
      badge: "Gold Partner",
      features: ["Project Consulting", "Bulk Orders", "Quality Guarantee"],
    },
    {
      id: 104,
      name: "Fresh Valley Food Distributors",
      category: "Food & Beverage",
      businessType: "Supplier",
      rating: 4.7,
      reviews: 289,
      yearsInBusiness: 8,
      clientsServed: "200+",
      specialization: "Fresh Produce & Packaged Foods",
      image:
        "https://readdy.ai/api/search-image?query=Modern%20food%20distribution%20warehouse%20with%20organized%20fresh%20produce%2C%20refrigerated%20storage%20areas%2C%20clean%20food%20handling%20environment%2C%20professional%20packaging%20area%20with%20bright%20white%20interior&width=400&height=280&seq=food-distributor&orientation=landscape",
      badge: "Certified Organic",
      features: ["Cold Chain", "Daily Fresh", "Organic Options"],
    },
    {
      id: 105,
      name: "Arabian Textile Industries",
      category: "Textile",
      businessType: "Supplier",
      rating: 4.8,
      reviews: 445,
      yearsInBusiness: 18,
      clientsServed: "600+",
      specialization: "Premium Fabrics & Textiles",
      image:
        "https://readdy.ai/api/search-image?query=Large%20textile%20manufacturing%20facility%20with%20colorful%20fabric%20rolls%20organized%20on%20shelves%2C%20modern%20textile%20production%20equipment%2C%20bright%20industrial%20space%20with%20various%20textile%20materials%20displayed%20professionally&width=400&height=280&seq=textile-industry&orientation=landscape",
      badge: "Heritage Brand",
      features: ["Custom Designs", "Premium Quality", "Global Export"],
    },
    {
      id: 106,
      name: "Tech Solutions Arabia",
      category: "Technology",
      businessType: "Supplier",
      rating: 4.9,
      reviews: 312,
      yearsInBusiness: 10,
      clientsServed: "400+",
      specialization: "Enterprise IT Solutions",
      image:
        "https://readdy.ai/api/search-image?query=Modern%20technology%20office%20with%20server%20racks%2C%20computer%20equipment%2C%20professional%20IT%20workspace%2C%20clean%20tech%20environment%20with%20organized%20cables%20and%20networking%20equipment%2C%20contemporary%20design%20with%20yellow%20accents&width=400&height=280&seq=tech-solutions&orientation=landscape",
      badge: "Innovation Leader",
      features: ["Cloud Services", "AI Solutions", "24/7 Support"],
    },
  ];

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

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Premium Supplier":
        return "bg-gradient-to-r from-purple-500 to-purple-700";
      case "Top Rated":
        return "bg-gradient-to-r from-yellow-500 to-orange-500";
      case "Gold Partner":
        return "bg-gradient-to-r from-yellow-400 to-yellow-600";
      case "Certified Organic":
        return "bg-gradient-to-r from-green-500 to-emerald-600";
      case "Heritage Brand":
        return "bg-gradient-to-r from-blue-500 to-indigo-600";
      case "Innovation Leader":
        return "bg-gradient-to-r from-pink-500 to-red-500";
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
                    />
                    <div className="absolute top-2 left-2">
                      <div
                        className={`${getBadgeColor(
                          supplier.badge
                        )} text-white px-2 py-1 rounded-full shadow-lg`}
                      >
                        <span className="text-xs font-bold">
                          {getBadgeKey(supplier.badge)
                            ? t(getBadgeKey(supplier.badge))
                            : supplier.badge}
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

                    <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                      <div className="text-center bg-gray-50 rounded-lg p-2">
                        <div className="font-bold text-gray-800">
                          {supplier.yearsInBusiness}+
                        </div>
                        <div className="text-gray-600">
                          {t("topSuppliers.years")}
                        </div>
                      </div>
                      <div className="text-center bg-gray-50 rounded-lg p-2">
                        <div className="font-bold text-gray-800">
                          {supplier.clientsServed}
                        </div>
                        <div className="text-gray-600">
                          {t("topSuppliers.clients")}
                        </div>
                      </div>
                    </div>

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
                      {supplier.features.map((feature, index) => (
                        <span
                          key={index}
                          className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                      <button className="flex-1 bg-yellow-400 text-white py-2 rounded-lg hover:bg-yellow-500 text-xs font-medium transition-colors">
                        <i className="ri-message-line mr-1"></i>{" "}
                        {t("topSuppliers.message")}
                      </button>
                      <Link
                        href={`/business/${supplier.id}`}
                        className="flex-1 border border-yellow-400 text-yellow-600 py-2 rounded-lg hover:bg-yellow-50 text-xs font-medium text-center transition-colors"
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

        <div className="text-center mt-8 sm:mt-10 md:mt-12">
          <Link
            href="/suppliers"
            className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full hover:from-yellow-500 hover:to-orange-600 font-semibold text-base sm:text-lg whitespace-nowrap cursor-pointer shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            {t("topSuppliers.viewAll")}
          </Link>
        </div>
      </div>
    </section>
  );
}
