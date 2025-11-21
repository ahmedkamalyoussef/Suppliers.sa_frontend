"use client";

import { useState, useEffect, Suspense } from "react";
import type React from "react";
import { useSearchParams } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useLanguage } from "../../lib/LanguageContext";
import BusinessFilters from "../../components/BusinessFilters";
import BusinessCard from "../../components/BusinessCard";
import AIChatWidget from "../../components/AIChatWidget";
import AIFilterBar from "../../components/AIFilterBar";

export interface Business {
  id: number;
  name: string;
  category: string;
  businessType:
    | "Supplier"
    | "Store"
    | "Office"
    | "Manufacturer"
    | "Individual"
    | string;
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
  serviceDistance: string;
}

type AISuggestions = {
  categories: string[];
  locations: string[];
  rating: number | null;
  features: string[];
  businessTypes: string[];
  distance: number | null;
};

type AIFilterPayload = {
  query: string;
  filters: AISuggestions;
};

// Suspense wrapper for useSearchParams
function BusinessesContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [selectedDistance, setSelectedDistance] = useState<string>("");
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>(
    allBusinesses as Business[]
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedRating, setSelectedRating] = useState<string>("");
  const [selectedBusinessType, setSelectedBusinessType] =
    useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<
    "rating" | "distance" | "reviews" | "name"
  >("rating");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  // Apply filters from URL parameters when component mounts
  useEffect(() => {
    const category = searchParams.get("category");
    const location = searchParams.get("location");
    const type = searchParams.get("type");
    const rating = searchParams.get("rating");
    const search = searchParams.get("search");
    const features = searchParams.get("features");
    const distance = searchParams.get("distance");

    if (category) setSelectedCategory(category);
    if (location) setSelectedLocation(location);
    if (type) setSelectedBusinessType(type);
    if (rating) setSelectedRating(rating);
    if (search) setSearchQuery(search);
    if (distance) setSelectedDistance(distance);

    // Apply AI-generated filters
    const aiPayload = {
      query: search || "",
      filters: {
        categories: category ? [category] : [],
        locations: location ? location.split(",") : [],
        rating: rating ? parseInt(rating) : null,
        features: features ? features.split(",") : [],
        businessTypes: type ? [type] : [],
        distance: distance ? parseInt(distance) : null,
      },
    };

    if (
      category ||
      location ||
      type ||
      rating ||
      search ||
      features ||
      distance
    ) {
      handleAIFilter(aiPayload);
    }
  }, [searchParams]);

  const handleAIFilter = (payload: AIFilterPayload) => {
    const { query, filters } = payload;
    let filtered: Business[] = [...(allBusinesses as Business[])];

    // Apply AI-generated filters
    if (filters.categories.length > 0) {
      filtered = filtered.filter((business) =>
        filters.categories.some((cat) => {
          const categoryMap: Record<string, string> = {
            "construction-real-estate": "Construction & Real Estate",
            "consumer-electronics": "Consumer Electronics",
            "food-beverage": "Food & Beverage",
            "hospital-medical": "Hospital & Medical Supplies",
            automobile: "Automobile",
            "textiles-fabrics": "Textiles & Fabrics",
            "industrial-supplies": "Industrial Supplies",
            furniture: "Furniture",
            "oil-gas": "Oil and Gas",
            agriculture: "Agriculture",
            "jewelry-gemstones": "Jewelry & Gemstones",
            "leather-products": "Leather & Leather Products",
            "plastics-products": "Plastics & Products",
            "printing-publishing": "Printing & Publishing",
            "security-protection": "Security & Protection",
            "sports-entertainment": "Sports & Entertainment",
            telecommunications: "Telecommunications",
            "hotel-supplies": "Hotel Supplies & Equipment",
            "office-school": "Office & School Supplies",
          };

          const mappedCategory = categoryMap[cat] || cat;
          return (
            business.category
              .toLowerCase()
              .includes(mappedCategory.toLowerCase()) ||
            business.category.toLowerCase().includes(cat.toLowerCase())
          );
        })
      );
    }

    if (filters.locations.length > 0) {
      filtered = filtered.filter((business: Business) =>
        filters.locations.some((loc: string) =>
          business.location.toLowerCase().includes(loc.toLowerCase())
        )
      );
    }

    if (filters.rating) {
      filtered = filtered.filter(
        (business: Business) => business.rating >= (filters.rating as number)
      );
    }

    if (filters.features.length > 0) {
      filtered = filtered.filter((business: Business) =>
        filters.features.some(
          (feature: string) =>
            business.services &&
            business.services.some((service: string) =>
              service.toLowerCase().includes(feature.toLowerCase())
            )
        )
      );
    }

    if (filters.businessTypes.length > 0) {
      filtered = filtered.filter((business: Business) =>
        filters.businessTypes.some(
          (type: string) =>
            business.businessType.toLowerCase() === type.toLowerCase()
        )
      );
    }

    // Apply distance filter from AI suggestions
    if (filters.distance) {
      filtered = filtered.filter((business: Business) => {
        const businessDistance = parseFloat(business.distance.split(" ")[0]);
        return businessDistance <= (filters.distance as number);
      });
    }

    // Apply search query if provided
    if (query) {
      filtered = filtered.filter(
        (business: Business) =>
          business.name.toLowerCase().includes(query.toLowerCase()) ||
          business.category.toLowerCase().includes(query.toLowerCase()) ||
          business.location.toLowerCase().includes(query.toLowerCase()) ||
          business.services.some((service: string) =>
            service.toLowerCase().includes(query.toLowerCase())
          )
      );
    }

    setFilteredBusinesses(filtered);
    setCurrentPage(1);
  };

  // Apply regular filters
  useEffect(() => {
    let filtered: Business[] = [...(allBusinesses as Business[])];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (business: Business) =>
          business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          business.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          business.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          business.services.some((service: string) =>
            service.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Apply category filter
    if (selectedCategory && selectedCategory !== "all") {
      const categoryMap: Record<string, string> = {
        "construction-real-estate": "Construction & Real Estate",
        "consumer-electronics": "Consumer Electronics",
        "food-beverage": "Food & Beverage",
        "hospital-medical": "Hospital & Medical Supplies",
        automobile: "Automobile",
        "textiles-fabrics": "Textiles & Fabrics",
        "industrial-supplies": "Industrial Supplies",
        furniture: "Furniture",
        "oil-gas": "Oil and Gas",
        agriculture: "Agriculture",
        "jewelry-gemstones": "Jewelry & Gemstones",
        "leather-products": "Leather & Leather Products",
        "plastics-products": "Plastics & Products",
        "printing-publishing": "Printing & Publishing",
        "security-protection": "Security & Protection",
        "sports-entertainment": "Sports & Entertainment",
        telecommunications: "Telecommunications",
        "hotel-supplies": "Hotel Supplies & Equipment",
        "office-school": "Office & School Supplies",
      };

      const mappedCategory = categoryMap[selectedCategory] || selectedCategory;
      filtered = filtered.filter((business: Business) =>
        business.category.toLowerCase().includes(mappedCategory.toLowerCase())
      );
    }

    // Apply business type filter
    if (selectedBusinessType && selectedBusinessType !== "all") {
      filtered = filtered.filter(
        (business: Business) => business.businessType === selectedBusinessType
      );
    }

    // Apply location filter
    if (selectedLocation) {
      filtered = filtered.filter((business: Business) =>
        business.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    // Apply rating filter
    if (selectedRating) {
      filtered = filtered.filter(
        (business: Business) => business.rating >= parseFloat(selectedRating)
      );
    }

    // Apply distance filter
    if (selectedDistance) {
      filtered = filtered.filter((business: Business) => {
        const businessDistance = parseFloat(business.distance.split(" ")[0]);
        const selectedDistanceValue = parseFloat(selectedDistance);
        return businessDistance <= selectedDistanceValue;
      });
    }

    setFilteredBusinesses(filtered);
  }, [
    searchQuery,
    selectedCategory,
    selectedBusinessType,
    selectedLocation,
    selectedRating,
    selectedDistance,
  ]);

  const sortedBusinesses = [...filteredBusinesses].sort(
    (a: Business, b: Business) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "distance":
          return parseFloat(a.distance) - parseFloat(b.distance);
        case "reviews":
          return b.reviews - a.reviews;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    }
  );

  // Function to get map position based on coordinates
  const getMapPosition = (lat: number, lng: number) => {
    // Saudi Arabia bounds for Google Maps embed view
    // These bounds are adjusted for the specific Google Maps embed viewport
    const mapBounds = {
      north: 32.5,
      south: 16.0,
      east: 55.5,
      west: 34.0,
    };

    // Calculate percentage position within the map bounds
    const latPercent =
      ((mapBounds.north - lat) / (mapBounds.north - mapBounds.south)) * 100;
    const lngPercent =
      ((lng - mapBounds.west) / (mapBounds.east - mapBounds.west)) * 100;

    // Ensure positions stay strictly within visible map area with padding
    const safeTop = Math.max(5, Math.min(95, latPercent));
    const safeLeft = Math.max(5, Math.min(95, lngPercent));

    return {
      top: `${safeTop}%`,
      left: `${safeLeft}%`,
    };
  };

  // Function to get business type color for map markers
  const getBusinessTypeColor = (type: Business["businessType"]) => {
    switch (type) {
      case "Supplier":
        return "bg-blue-500";
      case "Store":
        return "bg-green-500";
      case "Office":
        return "bg-purple-500";
      case "Manufacturer":
        return "bg-orange-500";
      case "Individual":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <AIFilterBar onFilterChange={handleAIFilter} />

      <main className="py-8">
        {/* Header Section */}
        <section className="py-8 bg-white border-b border-gray-200">
          <div className="w-full px-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">
                    {t("businessesPage.headerTitle")}
                  </h1>
                  <p className="text-gray-600 text-lg">
                    {t("businessesPage.headerSub").replace(
                      "{{count}}",
                      String(filteredBusinesses.length)
                    )}
                  </p>
                  {searchParams.get("search") && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <i className="ri-brain-line text-yellow-600"></i>
                        <span className="text-sm text-yellow-800">
                          <strong>{t("businessesPage.aiSearch")}</strong> "
                          {searchParams.get("search")}"
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-md cursor-pointer ${
                        viewMode === "grid"
                          ? "bg-white shadow-sm text-yellow-600"
                          : "text-gray-600"
                      }`}
                    >
                      <i className="ri-grid-line"></i>
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-md cursor-pointer ${
                        viewMode === "list"
                          ? "bg-white shadow-sm text-yellow-600"
                          : "text-gray-600"
                      }`}
                    >
                      <i className="ri-list-unordered"></i>
                    </button>
                  </div>

                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(
                        e.target.value as
                          | "rating"
                          | "distance"
                          | "reviews"
                          | "name"
                      )
                    }
                    className="border border-gray-300 rounded-lg px-4 py-2 bg-white focus:border-yellow-400 focus:outline-none pr-8"
                  >
                    <option value="rating">
                      {t("businessesPage.sortByRating")}
                    </option>
                    <option value="distance">
                      {t("businessesPage.sortByDistance")}
                    </option>
                    <option value="reviews">
                      {t("businessesPage.sortByReviews")}
                    </option>
                    <option value="name">
                      {t("businessesPage.sortByName")}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="w-full px-6">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Filters Sidebar */}
                <div className="lg:col-span-1">
                  <BusinessFilters
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    selectedBusinessType={selectedBusinessType}
                    setSelectedBusinessType={setSelectedBusinessType}
                    selectedDistance={selectedDistance}
                    setSelectedDistance={setSelectedDistance}
                  />
                </div>

                {/* Business Content */}
                <div className="lg:col-span-3">
                  {/* Map Section - Only show when there are filtered results */}
                  {sortedBusinesses.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                      <div className="p-4 bg-yellow-50 border-b border-yellow-100">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {t("businessesPage.mapTitle")}
                          </h3>
                          <span className="text-sm text-gray-600">
                            {t("businessesPage.showingLocations").replace(
                              "{{count}}",
                              String(sortedBusinesses.length)
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="relative h-[420px]">
                        <iframe
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7476794.374816895!2d39.857910156249994!3d23.885837699999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15e7b33fe7952a41%3A0x5960504bc21ab69b!2sSaudi%20Arabia!5e0!3m2!1sen!2sus!4v1647890123456!5m2!1sen!2sus&disableDefaultUI=true&gestureHandling=none&scrollwheel=false&disableDoubleClickZoom=true&clickableIcons=false"
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          className="w-full h-full"
                        ></iframe>

                        <div className="absolute inset-0 pointer-events-none">
                          {/* Filtered Business Location Dots */}
                          {sortedBusinesses.map((business, index) => {
                            const position = getMapPosition(
                              business.lat,
                              business.lng
                            );
                            const colorClass = getBusinessTypeColor(
                              business.businessType
                            );

                            return (
                              <div
                                key={business.id}
                                className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-10"
                                style={position}
                                title={`${business.name} - ${business.location}`}
                              >
                                {/* Main Business Dot with pulse animation */}
                                <div
                                  className={`relative w-4 h-4 ${colorClass} rounded-full border-2 border-white shadow-lg animate-pulse`}
                                >
                                  <div
                                    className={`absolute inset-0 ${colorClass} rounded-full animate-ping opacity-75`}
                                  ></div>
                                </div>

                                {/* Business Info Tooltip */}
                                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl border border-gray-200 p-3 min-w-64 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-auto z-20 scale-95 group-hover:scale-100">
                                  <div className="text-xs">
                                    <h4 className="font-semibold text-gray-800 mb-1">
                                      {business.name}
                                    </h4>
                                    <p className="text-yellow-600 font-medium mb-1">
                                      {business.category}
                                    </p>
                                    <p className="text-gray-600 mb-2">
                                      {business.location}
                                    </p>
                                    <div className="flex items-center mb-2">
                                      <div className="flex items-center space-x-1">
                                        {[...Array(5)].map((_, i) => (
                                          <i
                                            key={i}
                                            className={`text-xs ${
                                              i < Math.floor(business.rating)
                                                ? "ri-star-fill text-yellow-400"
                                                : "ri-star-line text-gray-300"
                                            }`}
                                          ></i>
                                        ))}
                                      </div>
                                      <span className="text-xs text-gray-600 ml-1">
                                        {business.rating} ({business.reviews})
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span
                                        className={`inline-block px-2 py-1 rounded-full text-white text-xs ${colorClass}`}
                                      >
                                        {business.businessType}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {business.distance}
                                      </span>
                                    </div>
                                  </div>
                                  {/* Tooltip Arrow */}
                                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Legend */}
                        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-10">
                          <h4 className="text-xs font-semibold text-gray-800 mb-2">
                            {t("businessesPage.legendTitle")}
                          </h4>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                              <span className="text-xs text-gray-600">
                                {t("businessesPage.supplier")}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <span className="text-xs text-gray-600">
                                {t("businessesPage.store")}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                              <span className="text-xs text-gray-600">
                                {t("businessesPage.office")}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                              <span className="text-xs text-gray-600">
                                {t("businessesPage.manufacturer")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Business Cards Grid */}
                  {sortedBusinesses.length > 0 ? (
                    <div
                      className={`grid gap-6 ${
                        viewMode === "grid"
                          ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                          : "grid-cols-1"
                      }`}
                    >
                      {sortedBusinesses.map((business) => (
                        <BusinessCard
                          key={business.id}
                          business={business}
                          viewMode={viewMode}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <i className="ri-search-line text-3xl text-gray-400"></i>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {t("businessesPage.noFoundTitle")}
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {t("businessesPage.noFoundBody")}
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedCategory("all");
                          setSelectedBusinessType("all");
                          setSelectedLocation("");
                          setSelectedRating("");
                          setSelectedDistance("");
                        }}
                        className="bg-yellow-400 text-white px-6 py-3 rounded-lg hover:bg-yellow-500 font-medium cursor-pointer"
                      >
                        {t("businessesPage.clearFilters")}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Load More Section */}
        {sortedBusinesses.length > 0 && (
          <section className="py-8 text-center">
            <button className="bg-yellow-400 text-white px-8 py-4 rounded-full hover:bg-yellow-500 font-semibold whitespace-nowrap cursor-pointer">
              {t("businessesPage.loadMore")}
            </button>
          </section>
        )}
      </main>

      <Footer />
      <AIChatWidget />
    </div>
  );
}

// Add mock businesses data with coordinates
const allBusinesses = [
  {
    id: 1,
    name: "Premium Glass Solutions",
    category: "Construction & Real Estate",
    businessType: "Supplier",
    location: "Jeddah, Saudi Arabia",
    distance: "2.1 km",
    rating: 4.8,
    reviews: 156,
    verified: true,
    openNow: true,
    lat: 21.4858,
    lng: 39.1925,
    image:
      "https://readdy.ai/api/search-image?query=modern%20glass%20manufacturing%20facility%20with%20clear%20windows%20and%20professional%20workers%20handling%20glass%20panels%20in%20industrial%20setting%20with%20blue%20sky%20background&width=400&height=300&seq=1&orientation=landscape",
    services: [
      "Window Glass",
      "Tempered Glass",
      "Laminated Glass",
      "Free Delivery",
      "Installation Service",
    ],
    targetCustomers: ["Contractors", "Homeowners", "Architects"],
    serviceDistance: "50 km radius",
  },
  {
    id: 2,
    name: "Al-Riyadh Electronics Hub",
    category: "Consumer Electronics",
    businessType: "Store",
    location: "Riyadh, Saudi Arabia",
    distance: "1.5 km",
    rating: 4.6,
    reviews: 289,
    verified: true,
    openNow: true,
    lat: 24.7136,
    lng: 46.6753,
    image:
      "https://readdy.ai/api/search-image?query=modern%20electronics%20store%20interior%20with%20smartphones%20tablets%20computers%20and%20LED%20displays%20showcasing%20latest%20technology%20products%20with%20clean%20white%20background&width=400&height=300&seq=2&orientation=landscape",
    services: [
      "Smartphones",
      "Laptops",
      "Home Appliances",
      "24/7 Service",
      "Warranty",
    ],
    targetCustomers: ["Individuals", "Businesses", "Students"],
    serviceDistance: "City-wide",
  },
  {
    id: 3,
    name: "Makkah Medical Supplies",
    category: "Hospital & Medical Supplies",
    businessType: "Supplier",
    location: "Makkah, Saudi Arabia",
    distance: "3.2 km",
    rating: 4.9,
    reviews: 98,
    verified: true,
    openNow: false,
    lat: 21.3891,
    lng: 39.8579,
    image:
      "https://readdy.ai/api/search-image?query=medical%20equipment%20warehouse%20with%20hospital%20supplies%20surgical%20instruments%20and%20healthcare%20devices%20organized%20on%20shelves%20with%20clean%20sterile%20environment&width=400&height=300&seq=3&orientation=landscape",
    services: [
      "Medical Equipment",
      "Surgical Instruments",
      "Hospital Furniture",
      "Bulk Orders",
      "Credit Available",
    ],
    targetCustomers: ["Hospitals", "Clinics", "Medical Centers"],
    serviceDistance: "Regional",
  },
  {
    id: 4,
    name: "Saudi Steel Works",
    category: "Construction & Real Estate",
    businessType: "Manufacturer",
    location: "Dammam, Saudi Arabia",
    distance: "5.8 km",
    rating: 4.7,
    reviews: 203,
    verified: true,
    openNow: true,
    lat: 26.4207,
    lng: 50.0888,
    image:
      "https://readdy.ai/api/search-image?query=steel%20manufacturing%20facility%20with%20metal%20beams%20pipes%20and%20construction%20materials%20stacked%20in%20organized%20warehouse%20with%20industrial%20cranes%20and%20workers&width=400&height=300&seq=4&orientation=landscape",
    services: [
      "Steel Beams",
      "Metal Pipes",
      "Construction Steel",
      "Custom Orders",
      "Export Services",
    ],
    targetCustomers: ["Construction Companies", "Engineers", "Developers"],
    serviceDistance: "Nationwide",
  },
  {
    id: 5,
    name: "Fresh Food Distributors",
    category: "Food & Beverage",
    businessType: "Supplier",
    location: "Jeddah, Saudi Arabia",
    distance: "4.1 km",
    rating: 4.5,
    reviews: 167,
    verified: true,
    openNow: true,
    lat: 21.4908,
    lng: 39.1975,
    image:
      "https://readdy.ai/api/search-image?query=fresh%20food%20distribution%20center%20with%20fruits%20vegetables%20and%20packaged%20goods%20in%20refrigerated%20warehouse%20with%20delivery%20trucks%20and%20food%20safety%20standards&width=400&height=300&seq=5&orientation=landscape",
    services: [
      "Fresh Produce",
      "Packaged Goods",
      "Frozen Foods",
      "Free Delivery",
      "Bulk Orders",
    ],
    targetCustomers: ["Restaurants", "Hotels", "Supermarkets"],
    serviceDistance: "Western Region",
  },
  {
    id: 6,
    name: "Tech Solutions Center",
    category: "Consumer Electronics",
    businessType: "Store",
    location: "Al Khobar, Saudi Arabia",
    distance: "3.7 km",
    rating: 4.4,
    reviews: 142,
    verified: true,
    openNow: true,
    lat: 26.2172,
    lng: 50.1971,
    image:
      "https://readdy.ai/api/search-image?query=modern%20technology%20center%20with%20computers%20servers%20networking%20equipment%20and%20IT%20professionals%20working%20in%20clean%20organized%20environment&width=400&height=300&seq=6&orientation=landscape",
    services: [
      "IT Support",
      "Networking",
      "Server Solutions",
      "Cloud Services",
      "Technical Training",
    ],
    targetCustomers: ["Businesses", "Government", "Educational Institutions"],
    serviceDistance: "Eastern Province",
  },
  {
    id: 7,
    name: "Medina Trading Post",
    category: "Office & School Supplies",
    businessType: "Store",
    location: "Medina, Saudi Arabia",
    distance: "6.2 km",
    rating: 4.3,
    reviews: 87,
    verified: false,
    openNow: true,
    lat: 24.5247,
    lng: 39.5692,
    image:
      "https://readdy.ai/api/search-image?query=office%20supplies%20store%20with%20stationery%20books%20furniture%20and%20school%20materials%20organized%20on%20shelves%20in%20bright%20retail%20environment&width=400&height=300&seq=7&orientation=landscape",
    services: [
      "Office Furniture",
      "Stationery",
      "School Supplies",
      "Printing Services",
      "Bulk Orders",
    ],
    targetCustomers: ["Schools", "Offices", "Students"],
    serviceDistance: "City-wide",
  },
  {
    id: 8,
    name: "Abha Mountain Equipment",
    category: "Sports & Entertainment",
    businessType: "Store",
    location: "Abha, Saudi Arabia",
    distance: "12.5 km",
    rating: 4.6,
    reviews: 73,
    verified: true,
    openNow: false,
    lat: 18.2164,
    lng: 42.5047,
    image:
      "https://readdy.ai/api/search-image?query=mountain%20sports%20equipment%20store%20with%20hiking%20gear%20camping%20supplies%20and%20outdoor%20adventure%20equipment%20displayed%20in%20rustic%20mountain%20setting&width=400&height=300&seq=8&orientation=landscape",
    services: [
      "Hiking Gear",
      "Camping Equipment",
      "Mountain Bikes",
      "Adventure Tours",
      "Equipment Rental",
    ],
    targetCustomers: ["Adventure Enthusiasts", "Tourists", "Sports Clubs"],
    serviceDistance: "Southern Region",
  },
];

export default function BusinessesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading businesses...</p>
          </div>
        </div>
      }
    >
      <BusinessesContent />
    </Suspense>
  );
}
