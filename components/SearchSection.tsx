"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "../lib/LanguageContext";
import { useAuth } from "../hooks/useAuth";
import FeaturedBusinesses from "./FeaturedBusinesses";
import InteractiveMap from "./InteractiveMap";
import { apiService } from "../lib/api";
export default function SearchSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [location, setLocation] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");
  const [description, setDescription] = useState("");
  const [sentenceCount, setSentenceCount] = useState(0);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [businessLocations, setBusinessLocations] = useState<any[]>([]);
  const [showAllBusinesses, setShowAllBusinesses] = useState(false);
  const { t, isRTL } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Fetch businesses from API
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const params: any = {
          page: 1,
          per_page: 500, // Get more businesses to show on the map
          sort: "name",
        };

        // Only add categories param if a specific category is selected (not 'all')
        if (selectedCategory !== "all") {
          params.categories = selectedCategory;
        }

        const response = await apiService.getBusinesses(params);

        // Transform API data to match businessLocations format
        const locations = response.data.map((business: any) => ({
          ...business, // Spread all business properties
          id: business.id,
          name: business.name,
          address: business.address || "Address not available",
          lat: parseFloat(business.latitude) || 0,
          lng: parseFloat(business.longitude) || 0,
          type: business.category,
          category:
            business.category?.toLowerCase().replace(/\s+/g, "-") || "other",
          businessType: business.businessType,
          businessImage: business.profileImage,
          serviceDistance: business.serviceDistance,
          rating: business.rating || 0,
          reviewsCount: business.reviewsCount || 0,
          // Keep the original categories array if it exists
          categories: business.categories || [business.category],
          // Map mainPhone to phone for backward compatibility
          phone: business.mainPhone || business.phone,
          // Ensure all required fields have defaults
          status: business.status || "pending",
          contactEmail: business.contactEmail,
          targetMarket: business.targetMarket,
          services: business.services,
        }));

        setBusinessLocations(locations);
        setBusinesses(response.data);
      } catch (error) {}
    };

    fetchBusinesses();
  }, [selectedCategory]);

  // Use businessLocations directly since it's already populated from the API
  const enhancedBusinessLocations = businessLocations;

  // Filter businesses based on selected category
  const getFilteredBusinesses = () => {
    const filtered = enhancedBusinessLocations.filter((business) => {
      if (selectedCategory === "all") return true;
      // Check both the category and categories array if it exists
      return (
        business.category === selectedCategory ||
        (business.categories && business.categories.includes(selectedCategory))
      );
    });
    return filtered;
  };

  // Get filtered businesses
  const filteredBusinesses = getFilteredBusinesses();

  const categories = [
    {
      id: "all",
      name: t("filters.allCategories") || "All Categories",
      icon: "ri-apps-2-line",
      color: "from-purple-400 to-purple-600",
    },
    {
      id: "Agriculture",
      name: t("cat.agriculture") || "Agriculture",
      icon: "ri-leaf-line",
      color: "from-green-400 to-green-600",
    },
    {
      id: "Apparel & Fashion",
      name: t("cat.apparelFashion") || "Apparel & Fashion",
      icon: "ri-t-shirt-line",
      color: "from-blue-400 to-blue-600",
    },
    {
      id: "Automobile",
      name: t("cat.automobile") || "Automobile",
      icon: "ri-car-line",
      color: "from-red-400 to-red-600",
    },
    {
      id: "Brass Hardware & Components",
      name: t("cat.brassHardware") || "Brass Hardware & Components",
      icon: "ri-tools-line",
      color: "from-yellow-400 to-yellow-600",
    },
    {
      id: "Business Services",
      name: t("cat.businessServices") || "Business Services",
      icon: "ri-briefcase-line",
      color: "from-purple-500 to-purple-700",
    },
    {
      id: "Chemicals",
      name: t("cat.chemicals") || "Chemicals",
      icon: "ri-flask-line",
      color: "from-blue-300 to-blue-500",
    },
    {
      id: "Computer Hardware & Software",
      name: t("cat.computerHardwareSoftware") || "Computer Hardware & Software",
      icon: "ri-computer-line",
      color: "from-indigo-400 to-indigo-600",
    },
    // {
    //   id: "Construction & Real Estate",
    //   name: t("cat.constructionRealEstate") || "Construction & Real Estate",
    //   icon: "ri-building-line",
    //   color: "from-orange-400 to-orange-600",
    // },
    {
      id: "Consumer Electronics",
      name: t("cat.consumerElectronics") || "Consumer Electronics",
      icon: "ri-smartphone-line",
      color: "from-blue-400 to-blue-600",
    },
    {
      id: "Electronics & Electrical Supplies",
      name:
        t("cat.electronicsElectrical") || "Electronics & Electrical Supplies",
      icon: "ri-plug-line",
      color: "from-yellow-400 to-yellow-600",
    },
    {
      id: "Energy & Power",
      name: t("cat.energyPower") || "Energy & Power",
      icon: "ri-flashlight-line",
      color: "from-yellow-400 to-yellow-600",
    },
    {
      id: "Environment & Pollution",
      name: t("cat.environmentPollution") || "Environment & Pollution",
      icon: "ri-leaf-line",
      color: "from-green-500 to-green-700",
    },
    {
      id: "Food & Beverage",
      name: t("cat.foodBeverage") || "Food & Beverage",
      icon: "ri-restaurant-line",
      color: "from-orange-400 to-red-500",
    },
    {
      id: "Furniture",
      name: t("cat.furniture") || "Furniture",
      icon: "ri-sofa-line",
      color: "from-amber-400 to-orange-500",
    },
    {
      id: "Gifts & Crafts",
      name: t("cat.giftsCrafts") || "Gifts & Crafts",
      icon: "ri-gift-line",
      color: "from-pink-400 to-rose-500",
    },
    {
      id: "Health & Beauty",
      name: t("cat.healthBeauty") || "Health & Beauty",
      icon: "ri-scissors-line",
      color: "from-fuchsia-400 to-pink-500",
    },
    {
      id: "Home Supplies",
      name: t("cat.homeSupplies") || "Home Supplies",
      icon: "ri-home-line",
      color: "from-amber-300 to-amber-500",
    },
    {
      id: "Home Textiles & Furnishings",
      name: t("cat.homeTextiles") || "Home Textiles & Furnishings",
      icon: "ri-store-line",
      color: "from-emerald-300 to-emerald-500",
    },
    {
      id: "Hospital & Medical Supplies",
      name: t("cat.hospitalMedical") || "Hospital & Medical Supplies",
      icon: "ri-hospital-line",
      color: "from-red-300 to-red-500",
    },
    {
      id: "Hotel Supplies & Equipment",
      name: t("cat.hotelSupplies") || "Hotel Supplies & Equipment",
      icon: "ri-hotel-line",
      color: "from-blue-300 to-blue-500",
    },
    {
      id: "Industrial Supplies",
      name: t("cat.industrialSupplies") || "Industrial Supplies",
      icon: "ri-tools-line",
      color: "from-gray-400 to-gray-600",
    },
    {
      id: "Jewelry & Gemstones",
      name: t("cat.jewelryGemstones") || "Jewelry & Gemstones",
      icon: "ri-gem-line",
      color: "from-yellow-300 to-yellow-500",
    },
    {
      id: "Leather & Leather Products",
      name: t("cat.leatherProducts") || "Leather & Leather Products",
      icon: "ri-suitcase-line",
      color: "from-amber-600 to-amber-800",
    },
    {
      id: "Machinery",
      name: t("cat.machinery") || "Machinery",
      icon: "ri-tools-fill",
      color: "from-gray-500 to-gray-700",
    },
    {
      id: "Mineral & Metals",
      name: t("cat.mineralMetals") || "Mineral & Metals",
      icon: "ri-copper-diamond-line",
      color: "from-gray-400 to-gray-600",
    },
    {
      id: "Office & School Supplies",
      name: t("cat.officeSchool") || "Office & School Supplies",
      icon: "ri-book-line",
      color: "from-blue-300 to-blue-500",
    },
    {
      id: "Oil and Gas",
      name: t("cat.oilGas") || "Oil and Gas",
      icon: "ri-oil-line",
      color: "from-gray-700 to-gray-900",
    },
    {
      id: "Packaging & Paper",
      name: t("cat.packagingPaper") || "Packaging & Paper",
      icon: "ri-boxing-line",
      color: "from-amber-300 to-amber-500",
    },
    {
      id: "Pharmaceuticals",
      name: t("cat.pharmaceuticals") || "Pharmaceuticals",
      icon: "ri-medicine-bottle-line",
      color: "from-blue-400 to-blue-600",
    },
    {
      id: "Pipes, Tubes & Fittings",
      name: t("cat.pipesTubes") || "Pipes, Tubes & Fittings",
      icon: "ri-tube-line",
      color: "from-gray-500 to-gray-700",
    },
    {
      id: "Plastics & Products",
      name: t("cat.plasticsProducts") || "Plastics & Products",
      icon: "ri-bubble-chart-line",
      color: "from-blue-300 to-blue-500",
    },
    {
      id: "Printing & Publishing",
      name: t("cat.printingPublishing") || "Printing & Publishing",
      icon: "ri-printer-line",
      color: "from-purple-400 to-purple-600",
    },
    // {
    //   id: "Real Estate",
    //   name: t("cat.realEstate") || "Real Estate",
    //   icon: "ri-building-2-line",
    //   color: "from-orange-400 to-orange-600",
    // },
    {
      id: "Scientific & Laboratory Instruments",
      name:
        t("cat.scientificLaboratory") || "Scientific & Laboratory Instruments",
      icon: "ri-microscope-line",
      color: "from-blue-400 to-blue-600",
    },
    {
      id: "Security & Protection",
      name: t("cat.securityProtection") || "Security & Protection",
      icon: "ri-shield-line",
      color: "from-red-500 to-red-700",
    },
    {
      id: "Sports & Entertainment",
      name: t("cat.sportsEntertainment") || "Sports & Entertainment",
      icon: "ri-football-line",
      color: "from-green-500 to-green-700",
    },
    {
      id: "Telecommunications",
      name: t("cat.telecommunications") || "Telecommunications",
      icon: "ri-phone-line",
      color: "from-blue-400 to-blue-600",
    },
    {
      id: "Textiles & Fabrics",
      name: t("cat.textilesFabrics") || "Textiles & Fabrics",
      icon: "ri-scissors-line",
      color: "from-pink-400 to-pink-600",
    },
    {
      id: "Toys",
      name: t("cat.toys") || "Toys",
      icon: "ri-gamepad-line",
      color: "from-red-400 to-red-600",
    },
    {
      id: "Transportation",
      name: t("cat.transportation") || "Transportation",
      icon: "ri-truck-line",
      color: "from-indigo-400 to-indigo-600",
    },
  ];
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    }

    if (selectedCategory && selectedCategory !== "all") {
      params.set("category", selectedCategory);
    }

    if (location.trim()) {
      params.set("address", location.trim());
    }

    const queryString = params.toString();
    const url = queryString ? `/businesses?${queryString}` : "/businesses";

    // Navigate to the businesses page with the search parameters
    router.push(url);
  };
  const handleMarkerClick = (business: any) => {
    setSelectedBusiness(business);

    // Optional: Scroll to show the selected business details
    setTimeout(() => {
      const element = document.getElementById("selected-business-details");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 100);
  };
  const handleViewDetails = (business: any) => {
    // Navigate to business details page
    router.push(`/businesses/${business.id}`);
  };

  const handleGetDirections = (business: any) => {
    // Open Google Maps with directions
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${business.lat},${business.lng}`;
    window.open(mapsUrl, "_blank");
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    if (value.length <= 200) {
      setDescription(value);

      // Count sentences
      const sentences: string[] = value
        .trim()
        .split(/[.!?]+/)
        .filter((s: string) => s.trim().length > 0);
      const count = Math.min(sentences.length, 2);
      setSentenceCount(count);

      // Prevent more than 2 sentences
      if (sentences.length > 2) {
        const limitedText =
          sentences.slice(0, 2).join(". ") +
          (value.trim().endsWith(".") ? "" : ".");
        setDescription(limitedText);
        setSentenceCount(2);
      }
    }
  };

  // Check if form is valid
  const isFormValid = () => {
    const nameType = (
      document.querySelector(
        'select[name="nameType"]'
      ) as HTMLSelectElement | null
    )?.value;
    const category = (
      document.querySelector(
        'select[name="category"]'
      ) as HTMLSelectElement | null
    )?.value;
    const distance = (
      document.querySelector(
        'select[name="distance"]'
      ) as HTMLSelectElement | null
    )?.value;

    return (
      nameType &&
      category &&
      distance &&
      description.trim().length >= 10 &&
      sentenceCount <= 2
    );
  };

  const handleRequestSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if user has Premium or Enterprise plan
    if (authLoading) {
      setSubmitStatus("Loading user information...");
      return;
    }

    if (!user || (user.plan !== "Premium" && user.plan !== "Enterprise")) {
      setShowSubscriptionModal(true);
      return;
    }

    if (!isFormValid()) {
      setSubmitStatus("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("");

    try {
      const nameType = (
        document.querySelector('select[name="nameType"]') as HTMLSelectElement
      ).value;
      const category = (
        document.querySelector('select[name="category"]') as HTMLSelectElement
      ).value;
      const distance = (
        document.querySelector('select[name="distance"]') as HTMLSelectElement
      ).value;

      // Map category value to industry name
      const industryMap: { [key: string]: string } = {
        agriculture: "Agriculture",
        "apparel-fashion": "Apparel & Fashion",
        automobile: "Automobile",
        "brass-hardware": "Brass Hardware",
        "business-services": "Business Services",
        chemicals: "Chemicals",
        "computer-hardware-software": "Computer Hardware & Software",
        // "construction-real-estate": "Construction & Real Estate",
        "consumer-electronics": "Consumer Electronics",
        "electronics-electrical": "Electronics & Electrical",
        "energy-power": "Energy & Power",
        "environment-pollution": "Environment & Pollution",
        "food-beverage": "Food & Beverage",
        furniture: "Furniture",
        "gifts-crafts": "Gifts & Crafts",
        "health-beauty": "Health & Beauty",
        "home-supplies": "Home Supplies",
        "home-textiles": "Home Textiles",
        "hospital-medical": "Hospital & Medical",
        "hotel-supplies": "Hotel Supplies",
        "industrial-supplies": "Industrial Supplies",
        "jewelry-gemstones": "Jewelry & Gemstones",
        "leather-products": "Leather Products",
        machinery: "Machinery",
        "mineral-metals": "Mineral & Metals",
        "office-school": "Office & School",
        "oil-gas": "Oil & Gas",
        "packaging-paper": "Packaging & Paper",
        pharmaceuticals: "Pharmaceuticals",
        "pipes-tubes": "Pipes, Tubes & Fittings",
        "plastics-products": "Plastics & Products",
        "printing-publishing": "Printing & Publishing",
        // "real-estate": "Real Estate",
        "scientific-laboratory": "Scientific & Laboratory Instruments",
        "security-protection": "Security & Protection",
        "sports-entertainment": "Sports & Entertainment",
        telecommunications: "Telecommunications",
        "textiles-fabrics": "Textiles & Fabrics",
        toys: "Toys",
        transportation: "Transportation",
      };

      const industry = industryMap[category] || category;

      const businessRequest = {
        appearance: (nameType === "anonymous" ? "anonymous" : "showName") as
          | "showName"
          | "anonymous",
        industry,
        preferred_distance: distance === "anywhere" ? "anywhere" : distance,
        description: description,
      };

      const response = await apiService.createBusinessRequest(businessRequest);

      if (response.inquiries_sent > 0) {
        setSubmitStatus(
          `Request submitted successfully! Sent to ${response.inquiries_sent} supplier(s).`
        );
      } else {
        setSubmitStatus(
          response.note || "No suppliers found matching your criteria."
        );
      }

      // Reset form
      setDescription("");
      setSentenceCount(0);
      (
        document.querySelector('select[name="nameType"]') as HTMLSelectElement
      ).value = "profile";
      (
        document.querySelector('select[name="category"]') as HTMLSelectElement
      ).value = "";
      (
        document.querySelector('select[name="distance"]') as HTMLSelectElement
      ).value = "";
      setTimeout(() => setSubmitStatus(""), 5000);
    } catch (error) {
      console.error("Error submitting business request:", error);
      setSubmitStatus("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    // علشان الـ popups في الخريطة
    (window as any).handleMapBusinessClick = (businessId: number) => {
      const business = businessLocations.find((b) => b.id === businessId);
      if (business) {
        handleMarkerClick(business);
      }
    };
    (window as any).handleMapViewDetails = (businessId: number) => {
      const business = businessLocations.find((b) => b.id === businessId);
      if (business) {
        handleViewDetails(business);
      }
    };
    (window as any).handleMapGetDirections = (businessId: number) => {
      const business = businessLocations.find((b) => b.id === businessId);
      if (business) {
        handleGetDirections(business);
      }
    };
  }, []);
  return (
    <>
      <section className="py-4 sm:py-6 md:py-8 bg-gradient-to-b from-yellow-50 to-white">
        <div className="w-full px-3 sm:px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {/* Categories Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-xl p-3 sm:p-4 md:p-6">
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-3 sm:mb-4 text-gray-800">
                    {t("allCategories")}
                  </h3>
                  <div className="space-y-1 sm:space-y-2 max-h-[300px] sm:max-h-[400px] md:max-h-[600px] overflow-y-auto">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full flex items-center space-x-1 sm:space-x-2 md:space-x-3 p-1.5 sm:p-2 md:p-3 rounded-xl transition-all cursor-pointer ${
                          selectedCategory === category.id
                            ? "bg-yellow-400 text-white shadow-md"
                            : "hover:bg-gray-50 text-gray-700"
                        } ${
                          isRTL ? "space-x-reverse text-right" : "text-left"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-lg flex items-center justify-center ${
                            selectedCategory === category.id
                              ? "bg-white/20"
                              : `bg-gradient-to-r ${category.color}`
                          }`}
                        >
                          <i
                            className={`${
                              category.icon
                            } text-xs sm:text-sm md:text-base ${
                              selectedCategory === category.id
                                ? "text-white"
                                : "text-white"
                            }`}
                          ></i>
                        </div>
                        <span className="font-medium text-xs sm:text-xs md:text-sm">
                          {category.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Search and Map Section */}
              <div className="lg:col-span-3">
                {/* Search Form */}
                <div className="bg-white rounded-2xl shadow-xl p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
                  <div
                    className={`mb-3 sm:mb-4 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    <p className="text-xs sm:text-sm md:text-base font-bold text-gray-700">
                      <i
                        className={`ri-lightbulb-line text-yellow-500 ${
                          isRTL ? "ml-1 sm:ml-2" : "mr-1 sm:mr-2"
                        }`}
                      ></i>
                      {t("searchRequest.guideTitle")}
                    </p>
                  </div>

                  {/* رجعنا التصميم القديم:  inputs 2 بس في grid  */}
                  <form onSubmit={handleSearch} className="contents">
                    <div className="grid grid-cols-1 gap-3 sm:gap-4 mb-3 sm:mb-4 md:mb-6">
                      {/* Search Input */}
                      <div className="relative">
                        <input
                          type="text"
                          placeholder={t("searchPlaceholder")}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className={`w-full py-2.5 sm:py-3 md:py-4 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:outline-none text-xs sm:text-sm ${
                            isRTL
                              ? "pr-8 sm:pr-10 md:pr-12 pl-3 sm:pl-4 text-right"
                              : "pl-8 sm:pl-10 md:pl-12 pr-3 sm:pr-4"
                          }`}
                        />
                        <i
                          className={`ri-search-line absolute top-1/2 transform -translate-y-1/2 text-gray-400 text-xs sm:text-sm ${
                            isRTL ? "right-3 sm:right-4" : "left-3 sm:left-4"
                          }`}
                        ></i>
                      </div>

                      {/* Location Input */}
                    </div>

                    {/* Button تحت نفس القديم */}
                    <button
                      type="submit"
                      className="w-full bg-yellow-400 text-white py-2.5 sm:py-3 md:py-4 rounded-xl hover:bg-yellow-500 font-semibold text-sm sm:text-base md:text-lg whitespace-nowrap cursor-pointer flex items-center justify-center"
                    >
                      <i className="ri-search-line mr-1 sm:mr-2"></i>
                      {t("searchBusinesses")}
                    </button>
                  </form>
                </div>

                {/* Enhanced Interactive Map Section */}
                <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-xl relative h-64 sm:h-80 md:h-[28rem] mb-3 sm:mb-4 md:mb-6">
                  {/* Interactive Map Component */}
                  <InteractiveMap
                    key={`map-${selectedCategory}`} // Force re-render when category changes
                    businesses={filteredBusinesses}
                    onBusinessClick={handleMarkerClick}
                  />

                  {/* Selected Business Highlight */}
                  {selectedBusiness && (
                    <div className="absolute inset-0 border-2 border-yellow-400 rounded-xl pointer-events-none animate-pulse"></div>
                  )}

                  {/* Category Filter Info */}
                  {selectedCategory !== "all" && (
                    <div
                      className={`absolute top-2 sm:top-4 ${
                        isRTL ? "right-2 sm:right-4" : "left-2 sm:left-4"
                      } bg-white rounded-lg shadow-lg p-1.5 sm:p-2 md:p-3 z-10 ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <div
                          className={`w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 ${
                            categories
                              .find((cat) => cat.id === selectedCategory)
                              ?.color.includes("yellow")
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                          } rounded-full`}
                        ></div>
                        <span className="text-xs sm:text-xs md:text-sm font-medium text-gray-700">
                          {t("showing") || "Showing"}:{" "}
                          {
                            categories.find(
                              (cat) => cat.id === selectedCategory
                            )?.name
                          }
                        </span>
                        <span className="text-xs text-gray-500">
                          ({getFilteredBusinesses().length}{" "}
                          {t("locations") || "locations"})
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Map Controls Info */}
                  <div
                    className={`absolute bottom-2 sm:bottom-4 ${
                      isRTL ? "left-2 sm:left-4" : "right-2 sm:right-4"
                    } bg-white rounded-lg shadow-lg p-2 z-10`}
                  >
                    <p className="text-xs text-gray-600 flex items-center space-x-1">
                      <i className="ri-information-line text-blue-500"></i>
                      <span>
                        {t("clickMarkersInfo") ||
                          "Click on markers for details"}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Removed bottom details panel; details now shown in map tooltip */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Businesses Section */}
      <FeaturedBusinesses businesses={businesses} />

      {/* Request Section */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-8 md:mb-12">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg">
                <i className="ri-search-2-line text-2xl md:text-3xl text-white"></i>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {t("searchRequest.cantFindTitle")}
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t("searchRequest.submitRequestDesc")}
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
              {/* Form Section */}
              <div className="p-6 md:p-8 lg:p-12">
                <form
                  id="supplier-request-form"
                  data-readdy-form
                  onSubmit={handleRequestSubmit}
                  className="space-y-6 md:space-y-8"
                >
                  {/* Form Fields Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-800 mb-3">
                        {t("searchRequest.displayNameLabel")}
                      </label>
                      <select
                        name="nameType"
                        className="w-full py-3 md:py-4 px-4 md:px-5 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:outline-none transition-colors pr-8 md:pr-12 bg-gray-50 hover:bg-white"
                      >
                        <option value="profile">
                          {t("searchRequest.displayNameProfile")}
                        </option>
                        <option value="anonymous">
                          {t("searchRequest.displayNameAnonymous")}
                        </option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-800 mb-3">
                        {t("searchRequest.industryLabel")}
                      </label>
                      <select
                        name="category"
                        className="w-full py-3 md:py-4 px-4 md:px-5 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:outline-none transition-colors pr-8 md:pr-12 bg-gray-50 hover:bg-white"
                        required
                      >
                        <option value="">
                          {t("searchRequest.industryPlaceholder")}
                        </option>
                        <option value="agriculture">
                          {t("cat.agriculture")}
                        </option>
                        <option value="apparel-fashion">
                          {t("cat.apparelFashion")}
                        </option>
                        <option value="automobile">
                          {t("cat.automobile")}
                        </option>
                        <option value="brass-hardware">
                          {t("cat.brassHardware")}
                        </option>
                        <option value="business-services">
                          {t("cat.businessServices")}
                        </option>
                        <option value="chemicals">{t("cat.chemicals")}</option>
                        <option value="computer-hardware-software">
                          {t("cat.computerHardwareSoftware")}
                        </option>
                        <option value="construction-real-estate">
                          {t("cat.constructionRealEstate")}
                        </option>
                        <option value="consumer-electronics">
                          {t("cat.consumerElectronics")}
                        </option>
                        <option value="electronics-electrical">
                          {t("cat.electronicsElectrical")}
                        </option>
                        <option value="energy-power">
                          {t("cat.energyPower")}
                        </option>
                        <option value="environment-pollution">
                          {t("cat.environmentPollution")}
                        </option>
                        <option value="food-beverage">
                          {t("cat.foodBeverage")}
                        </option>
                        <option value="furniture">{t("cat.furniture")}</option>
                        <option value="gifts-crafts">
                          {t("cat.giftsCrafts")}
                        </option>
                        <option value="health-beauty">
                          {t("cat.healthBeauty")}
                        </option>
                        <option value="home-supplies">
                          {t("cat.homeSupplies")}
                        </option>
                        <option value="home-textiles">
                          {t("cat.homeTextiles")}
                        </option>
                        <option value="hospital-medical">
                          {t("cat.hospitalMedical")}
                        </option>
                        <option value="hotel-supplies">
                          {t("cat.hotelSupplies")}
                        </option>
                        <option value="industrial-supplies">
                          {t("cat.industrialSupplies")}
                        </option>
                        <option value="jewelry-gemstones">
                          {t("cat.jewelryGemstones")}
                        </option>
                        <option value="leather-products">
                          {t("cat.leatherProducts")}
                        </option>
                        <option value="machinery">{t("cat.machinery")}</option>
                        <option value="mineral-metals">
                          {t("cat.mineralMetals")}
                        </option>
                        <option value="office-school">
                          {t("cat.officeSchool")}
                        </option>
                        <option value="oil-gas">{t("cat.oilGas")}</option>
                        <option value="packaging-paper">
                          {t("cat.packagingPaper")}
                        </option>
                        <option value="pharmaceuticals">
                          {t("cat.pharmaceuticals")}
                        </option>
                        <option value="pipes-tubes">
                          {t("cat.pipesTubes")}
                        </option>
                        <option value="plastics-products">
                          {t("cat.plasticsProducts")}
                        </option>
                        <option value="printing-publishing">
                          {t("cat.printingPublishing")}
                        </option>
                        <option value="real-estate">
                          {t("cat.realEstate")}
                        </option>
                        <option value="scientific-laboratory">
                          {t("cat.scientificLaboratory")}
                        </option>
                        <option value="security-protection">
                          {t("cat.securityProtection")}
                        </option>
                        <option value="sports-entertainment">
                          {t("cat.sportsEntertainment")}
                        </option>
                        <option value="telecommunications">
                          {t("cat.telecommunications")}
                        </option>
                        <option value="textiles-fabrics">
                          {t("cat.textilesFabrics")}
                        </option>
                        <option value="toys">{t("cat.toys")}</option>
                        <option value="transportation">
                          {t("cat.transportation")}
                        </option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-800 mb-3">
                        {t("searchRequest.distanceLabel")}
                      </label>
                      <select
                        name="distance"
                        className="w-full py-3 md:py-4 px-4 md:px-5 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:outline-none transition-colors pr-8 md:pr-12 bg-gray-50 hover:bg-white"
                        required
                      >
                        <option value="">
                          {t("searchRequest.distancePlaceholder")}
                        </option>
                        <option value="5km">
                          {t("searchRequest.distance5")}
                        </option>
                        <option value="10km">
                          {t("searchRequest.distance10")}
                        </option>
                        <option value="25km">
                          {t("searchRequest.distance25")}
                        </option>
                        <option value="50km">
                          {t("searchRequest.distance50")}
                        </option>
                        <option value="100km">
                          {t("searchRequest.distance100")}
                        </option>
                        <option value="anywhere">
                          {t("searchRequest.distanceAnywhere")}
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Description Section */}
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-800">
                      {t("searchRequest.descLabel")}
                      <span className="text-yellow-600 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <textarea
                        name="description"
                        placeholder={t("searchRequest.descPlaceholder")}
                        rows={4}
                        maxLength={200}
                        value={description}
                        onChange={handleDescriptionChange}
                        className="w-full py-3 md:py-4 px-4 md:px-5 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:outline-none resize-none transition-colors bg-gray-50 hover:bg-white text-gray-800 placeholder:text-gray-500"
                        required
                      />
                      <div className="absolute bottom-3 right-4 flex items-center space-x-4 text-xs">
                        <span
                          className={`${
                            sentenceCount > 2 ? "text-red-500" : "text-gray-500"
                          }`}
                        >
                          {t("searchRequest.sentencesCounter").replace(
                            "{{count}}",
                            String(sentenceCount)
                          )}
                        </span>
                        <span
                          className={`${
                            description.length > 180
                              ? "text-orange-500"
                              : "text-gray-500"
                          }`}
                        >
                          {t("searchRequest.charsCounter").replace(
                            "{{count}}",
                            String(description.length)
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-start pt-2">
                      <button
                        type="submit"
                        disabled={!isFormValid() || isSubmitting}
                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white py-3 px-6 md:px-8 rounded-xl hover:from-yellow-500 hover:to-yellow-600 font-semibold text-sm md:text-base whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        {isSubmitting ? (
                          <>
                            <i className="ri-loader-4-line animate-spin mr-2"></i>
                            <span className="hidden sm:inline">
                              {t("searchRequest.submittingLong")}
                            </span>
                            <span className="sm:hidden">
                              {t("searchRequest.submitting")}
                            </span>
                          </>
                        ) : (
                          <>
                            <i className="ri-send-plane-line mr-2"></i>
                            <span className="hidden sm:inline">
                              {t("searchRequest.submit")}
                            </span>
                            <span className="sm:hidden">
                              {t("searchRequest.submitShort")}
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {submitStatus && (
                    <div
                      className={`p-4 rounded-xl text-sm font-medium ${
                        submitStatus.includes("success")
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      <div className="flex items-center">
                        <i
                          className={`${
                            submitStatus.includes("success")
                              ? "ri-check-line"
                              : "ri-error-warning-line"
                          } mr-2`}
                        ></i>
                        {submitStatus}
                      </div>
                    </div>
                  )}
                </form>
              </div>

              {/* How It Works Section */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 md:p-8 lg:p-12 border-t border-gray-100">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-start">
                  <div>
                    <div className="flex items-center mb-4 md:mb-6">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3 md:mr-4">
                        <i className="ri-lightbulb-line text-blue-600 text-lg md:text-xl"></i>
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-blue-900">
                        {t("searchRequest.howItWorks")}
                      </h3>
                    </div>
                    <div className="space-y-3 md:space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-5 h-5 md:w-6 md:h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs md:text-sm font-bold mt-0.5">
                          1
                        </div>
                        <p className="text-blue-800 font-medium text-sm md:text-base">
                          {t("searchRequest.step1")}
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-5 h-5 md:w-6 md:h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs md:text-sm font-bold mt-0.5">
                          2
                        </div>
                        <p className="text-blue-800 font-medium text-sm md:text-base">
                          {t("searchRequest.step2")}
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-5 h-5 md:w-6 md:h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs md:text-sm font-bold mt-0.5">
                          3
                        </div>
                        <p className="text-blue-800 font-medium text-sm md:text-base">
                          {t("searchRequest.step3")}
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-5 h-5 md:w-6 md:h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs md:text-sm font-bold mt-0.5">
                          4
                        </div>
                        <p className="text-blue-800 font-medium text-sm md:text-base">
                          {t("searchRequest.step4")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 md:p-8 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-star-line text-2xl text-white"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {t("subscription.requiredTitle") || "Premium Feature"}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {t("subscription.requiredMessage") ||
                  "This feature is only available for premium subscribers. Please upgrade your account to use the supplier request feature."}
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center space-x-2">
                  <i className="ri-check-line text-green-500 font-bold"></i>
                  <span>Submit custom supplier requests</span>
                </li>
                <li className="flex items-center space-x-2">
                  <i className="ri-check-line text-green-500 font-bold"></i>
                  <span>Get instant supplier responses</span>
                </li>
                <li className="flex items-center space-x-2">
                  <i className="ri-check-line text-green-500 font-bold"></i>
                  <span>Priority support</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSubscriptionModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer"
              >
                {t("subscription.cancel") || "Cancel"}
              </button>
              <button
                onClick={() => {
                  setShowSubscriptionModal(false);
                  router.push("/subscription");
                }}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-600 transition-colors cursor-pointer"
              >
                {t("subscription.upgrade") || "Upgrade Now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
