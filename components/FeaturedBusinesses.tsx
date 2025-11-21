"use client";

import Link from "next/link";
import { useLanguage } from "../lib/LanguageContext";

export default function FeaturedBusinesses() {
  const { t } = useLanguage();
  const businesses = [
    {
      id: 1,
      name: "Metro Electronics Supply",
      category: "Electronics Supplier",
      businessType: "Supplier",
      targetCustomers: ["Large Organizations", "Small Businesses"],
      serviceDistance: "40 km",
      rating: 4.8,
      reviews: 124,
      distance: "0.5 km",
      image:
        "https://readdy.ai/api/search-image?query=Modern%20electronics%20supply%20store%20interior%20with%20organized%20shelves%2C%20professional%20lighting%2C%20clean%20white%20background%2C%20electronic%20components%20and%20devices%20displayed%20neatly%2C%20contemporary%20retail%20space%20design&width=400&height=300&seq=electronics-store&orientation=landscape",
      services: ["Wholesale Electronics", "Components", "Repair Parts"],
    },
    {
      id: 2,
      name: "Downtown Print Services",
      category: "Printing Services",
      businessType: "Store",
      targetCustomers: ["Small Businesses", "Individuals"],
      serviceDistance: "24 km",
      rating: 4.9,
      reviews: 89,
      distance: "0.8 km",
      image:
        "https://readdy.ai/api/search-image?query=Professional%20printing%20service%20shop%20with%20modern%20printing%20equipment%2C%20bright%20clean%20interior%2C%20organized%20workspace%2C%20commercial%20printers%20and%20paper%20supplies%2C%20white%20and%20yellow%20color%20scheme&width=400&height=300&seq=print-shop&orientation=landscape",
      services: ["Business Cards", "Banners", "Custom Printing"],
    },
    {
      id: 3,
      name: "City Office Furniture",
      category: "Furniture Supplier",
      businessType: "Office",
      targetCustomers: ["Large Organizations", "Small Businesses"],
      serviceDistance: "80 km",
      rating: 4.7,
      reviews: 156,
      distance: "1.3 km",
      image:
        "https://readdy.ai/api/search-image?query=Modern%20office%20furniture%20showroom%20with%20desks%2C%20chairs%2C%20and%20office%20equipment%2C%20clean%20professional%20layout%2C%20bright%20lighting%2C%20contemporary%20furniture%20displays%2C%20white%20background%20with%20yellow%20accents&width=400&height=300&seq=furniture-store&orientation=landscape",
      services: ["Office Desks", "Ergonomic Chairs", "Storage Solutions"],
    },
    {
      id: 4,
      name: "Fresh Food Wholesale",
      category: "Food & Beverage",
      businessType: "Individual",
      targetCustomers: ["Small Businesses", "Individuals"],
      serviceDistance: "16 km",
      rating: 4.6,
      reviews: 203,
      distance: "1.9 km",
      image:
        "https://readdy.ai/api/search-image?query=Clean%20modern%20food%20wholesale%20warehouse%20with%20organized%20food%20products%2C%20fresh%20produce%20displays%2C%20professional%20food%20storage%20areas%2C%20bright%20white%20interior%20with%20yellow%20signage%20elements&width=400&height=300&seq=food-wholesale&orientation=landscape",
      services: ["Fresh Produce", "Packaged Goods", "Bulk Orders"],
    },
    {
      id: 5,
      name: "Advanced Tech Solutions",
      category: "Technology",
      businessType: "Office",
      targetCustomers: ["Large Organizations", "Small Businesses"],
      serviceDistance: "48 km",
      rating: 4.9,
      reviews: 87,
      distance: "2.4 km",
      image:
        "https://readdy.ai/api/search-image?query=Modern%20technology%20office%20with%20computer%20equipment%2C%20server%20racks%2C%20clean%20workspace%2C%20professional%20tech%20environment%2C%20white%20and%20yellow%20branding%20elements%2C%20contemporary%20design&width=400&height=300&seq=tech-office&orientation=landscape",
      services: ["IT Support", "Software Development", "Cloud Services"],
    },
    {
      id: 6,
      name: "Royal Textile Manufacturing",
      category: "Textile",
      businessType: "Supplier",
      targetCustomers: ["Large Organizations", "Small Businesses"],
      serviceDistance: "120 km",
      rating: 4.5,
      reviews: 312,
      distance: "3.4 km",
      image:
        "https://readdy.ai/api/search-image?query=Modern%20textile%20manufacturing%20facility%20with%20organized%20fabric%20rolls%2C%20clean%20production%20floor%2C%20professional%20lighting%2C%20colorful%20textile%20materials%20arranged%20neatly%2C%20industrial%20setting%20with%20bright%20background&width=400&height=300&seq=textile-factory&orientation=landscape",
      services: ["Custom Fabrics", "Bulk Textiles", "Design Services"],
    },
    {
      id: 7,
      name: "Prime Auto Parts",
      category: "Automotive",
      businessType: "Store",
      targetCustomers: ["Small Businesses", "Individuals"],
      serviceDistance: "32 km",
      rating: 4.7,
      reviews: 145,
      distance: "1.4 km",
      image:
        "https://readdy.ai/api/search-image?query=Clean%20automotive%20parts%20store%20with%20organized%20shelves%20of%20car%20parts%2C%20professional%20garage%20environment%2C%20bright%20lighting%2C%20automotive%20components%20displayed%20systematically%2C%20white%20and%20yellow%20color%20scheme&width=400&height=300&seq=auto-parts&orientation=landscape",
      services: ["Engine Parts", "Brake Systems", "Electrical Components"],
    },
    {
      id: 8,
      name: "Elite Construction Supply",
      category: "Construction",
      businessType: "Supplier",
      targetCustomers: ["Large Organizations", "Small Businesses"],
      serviceDistance: "64 km",
      rating: 4.8,
      reviews: 198,
      distance: "2.9 km",
      image:
        "https://readdy.ai/api/search-image?query=Professional%20construction%20supply%20warehouse%20with%20organized%20building%20materials%2C%20cement%20bags%2C%20steel%20beams%2C%20construction%20tools%2C%20clean%20industrial%20space%20with%20bright%20lighting%20and%20yellow%20safety%20accents&width=400&height=300&seq=construction-supply&orientation=landscape",
      services: [
        "Building Materials",
        "Tools & Equipment",
        "Project Consulting",
      ],
    },
  ];

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
                  src={business.image}
                  alt={business.name}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white rounded-full px-2 sm:px-3 py-1 shadow-md">
                  <span className="text-xs sm:text-sm font-medium text-gray-700">
                    {business.distance}
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
                    {business.rating} ({business.reviews})
                  </span>
                </div>

                {/* Service Information */}
                <div className="mb-3 sm:mb-4 space-y-1 sm:space-y-2">
                  <div className="flex items-center text-xs text-gray-600">
                    <i className="ri-group-line w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center mr-1 sm:mr-2"></i>
                    <span>
                      {t("featuredBusinesses.serves")}{" "}
                      {business.targetCustomers.join(", ")}
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <i className="ri-map-pin-range-line w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center mr-1 sm:mr-2"></i>
                    <span>
                      {t("featuredBusinesses.serviceArea")}{" "}
                      {business.serviceDistance}
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
