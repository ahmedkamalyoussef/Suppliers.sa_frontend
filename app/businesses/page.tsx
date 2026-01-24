"use client";

import { useState, useEffect, Suspense, useCallback, useMemo } from "react";
import type React from "react";
import { useSearchParams } from "next/navigation";
import { useAISearch } from "../../contexts/AISearchContext";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useLanguage } from "../../lib/LanguageContext";
import { useRouter } from "next/navigation";
import InteractiveMapGoogle from "../../components/InteractiveMap.google";
import BusinessFilters from "../../components/BusinessFilters";
import BusinessCard from "../../components/BusinessCard";
import AIChatWidget from "../../components/AIChatWidget";
import AIFilterBar from "../../components/AIFilterBar";
import { apiService } from "../../lib/api";

export interface Business {
  id: number;
  name: string;
  category: string;
  businessType: string;
  location: string;
  address: string;
  distance: string;
  rating: number;
  reviewsCount: number;
  reviews: number; // For backward compatibility
  verified: boolean;
  openNow: boolean;
  lat: number;
  lng: number;
  latitude?: string | number;
  longitude?: string | number;
  image: string;
  businessImage?: string;
  profileImage?: string;
  services: string[];
  targetCustomers: string[];
  targetMarket?: string[];
  serviceDistance: string | number;
  categories?: string[];
  phone?: string;
  mainPhone?: string;
  status?: string;
  contactEmail?: string;
  type?: string;
  [key: string]: any; // For any additional properties
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
  const { aiSearchQuery } = useAISearch();
  const searchParams = useSearchParams();
  const [selectedDistance, setSelectedDistance] = useState<string>("");
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedRating, setSelectedRating] = useState<string>("");
  const [selectedBusinessType, setSelectedBusinessType] =
    useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [debouncedAddress, setDebouncedAddress] = useState<string>("");
  const [sortBy, setSortBy] = useState<
    "rating" | "distance" | "reviews" | "name"
  >("rating");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAllBusinesses, setShowAllBusinesses] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [businessLocations, setBusinessLocations] = useState<any[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [openNow, setOpenNow] = useState<boolean>(false);

  // Debounce search and address inputs
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedAddress(address);
    }, 500);
    return () => clearTimeout(timer);
  }, [address]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    // Handle search and address
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (debouncedAddress) params.set("address", debouncedAddress);

    // Handle category
    if (selectedCategory && selectedCategory !== "all") {
      params.set("category", selectedCategory);
    }

    // Handle business type
    if (selectedBusinessType && selectedBusinessType !== "all") {
      params.set("businessType", selectedBusinessType);
    }

    // Handle distance
    if (selectedDistance) {
      params.set("distance", selectedDistance);
    }

    // Handle verified filter
    if (verifiedOnly) {
      params.set("verified", "true");
    }

    // Handle open now filter
    if (openNow) {
      params.set("openNow", "true");
    }

    // Update URL without page reload
    const url = new URL(window.location.href);
    url.search = params.toString();
    window.history.pushState({}, "", url.toString());
  }, [
    debouncedSearch,
    debouncedAddress,
    selectedCategory,
    selectedBusinessType,
    selectedDistance,
    verifiedOnly,
    openNow,
  ]);

  // Log when selectedCategory changes
  useEffect(() => {}, [selectedCategory]);

  // Fetch businesses from API
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const params: any = {
          page: currentPage,
          per_page: showAllBusinesses ? Number.MAX_SAFE_INTEGER : itemsPerPage,
          sort: sortBy,
        };

        // Add category to params if selected (using 'category' as parameter name to match backend)
        if (selectedCategory && selectedCategory !== "all") {
          // Don't encode here - the API service will handle proper encoding
          params.category = selectedCategory;
        }

        // Add business type to params if selected
        if (
          selectedBusinessType &&
          selectedBusinessType.toLowerCase() !== "all"
        ) {
          params.businessType = selectedBusinessType;
        }

        // Add search and address to params if they exist
        if (debouncedSearch) {
          params.keyword = debouncedSearch;
        }
        if (debouncedAddress) {
          params.address = debouncedAddress;
        }

        // Add distance filter if selected
        if (selectedDistance) {
          // Convert the selected distance string to a number
          const distanceInKm = parseInt(selectedDistance);
          if (!isNaN(distanceInKm)) {
            params.serviceDistance = distanceInKm;
          }
        }

        // Add verified only filter if checked
        if (verifiedOnly) {
          params.isApproved = true;
        }

        // Add open now filter if checked
        if (openNow) {
          params.isOpenNow = true;
        }

        // Handle URL parameters if they exist
        const category = searchParams.get("category");
        const aiSearch = searchParams.get("search");

        if (category) {
          params.category = category;
          setSelectedCategory(category);
        }

        // Add AI search parameter if it exists
        if (aiSearch && aiSearch.trim()) {
          params.ai = aiSearch;
        }

        // Also check if we have an AI search query from context
        if (aiSearchQuery && aiSearchQuery.trim()) {
          params.ai = aiSearchQuery.trim();
        }

        const response = await apiService.getBusinesses(params);
        // Map API response to Business type
        const apiBusinesses: Business[] = response.data.map((business: any) => {
          const mappedBusiness: Business = {
            // First spread the original business data to keep all fields
            ...business,

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
              : [],
            services: Array.isArray(business.services) ? business.services : [],
            verified: business.verified || false,
            openNow: business.openNow || false,
          };

          return mappedBusiness;
        });

        setBusinesses(apiBusinesses);
        setFilteredBusinesses(apiBusinesses);

        // Transform for map locations - use the already mapped businesses
        const locations = apiBusinesses.map((business) => ({
          id: business.id,
          name: business.name,
          address: business.address,
          lat: business.lat,
          lng: business.lng,
          type: business.category,
          category:
            business.category?.toLowerCase().replace(/\s+/g, "-") || "other",
          businessType: business.businessType,
          businessImage: business.businessImage,
          serviceDistance: business.serviceDistance,
          rating: business.rating,
          reviewsCount: business.reviewsCount,
          reviews: business.reviewsCount, // For backward compatibility
          categories: business.categories,
          phone: business.phone,
          status: business.status,
          contactEmail: business.contactEmail,
          targetMarket: business.targetMarket,
          targetCustomers: business.targetCustomers,
          services: business.services,
          verified: business.verified,
          openNow: business.openNow,
          image: business.image,
        }));

        setBusinessLocations(locations);
      } catch (error) {}
    };

    fetchBusinesses();

    // Cleanup function
    return () => {};
  }, [
    currentPage,
    showAllBusinesses,
    sortBy,
    selectedCategory,
    selectedBusinessType,
    debouncedSearch,
    debouncedAddress,
    selectedDistance,
    verifiedOnly,
    openNow,
    searchParams,
    aiSearchQuery,
  ]);

  // Apply filters from URL parameters when component mounts
  useEffect(() => {
    const category = searchParams.get("category");
    const location = searchParams.get("location");
    const address = searchParams.get("address");
    const type = searchParams.get("type");
    const rating = searchParams.get("rating");
    const search = searchParams.get("search");
    const features = searchParams.get("features");
    const distance = searchParams.get("distance");

    if (category) setSelectedCategory(category);
    if (location) setSelectedLocation(location);
    if (address) setAddress(address);
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
    let filtered: Business[] = [...businesses];

    // Apply AI-generated filters
    if (filters.categories.length > 0) {
      filtered = filtered.filter((business) =>
        filters.categories.some((cat) => {
          const categoryMap: Record<string, string> = {
            // "construction-real-estate": "Construction & Real Estate",
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
            business.category === mappedCategory ||
            business.category === cat ||
            (business.categories &&
              (business.categories.includes(mappedCategory) ||
                business.categories.includes(cat)))
          );
        }),
      );
    }

    if (filters.locations.length > 0) {
      filtered = filtered.filter((business: Business) =>
        filters.locations.some((loc: string) =>
          business.location.toLowerCase().includes(loc.toLowerCase()),
        ),
      );
    }

    if (filters.rating) {
      filtered = filtered.filter(
        (business: Business) => business.rating >= (filters.rating as number),
      );
    }

    if (filters.features.length > 0) {
      filtered = filtered.filter((business: Business) =>
        filters.features.some(
          (feature: string) =>
            business.services &&
            business.services.some((service: string) =>
              service.toLowerCase().includes(feature.toLowerCase()),
            ),
        ),
      );
    }

    if (filters.businessTypes.length > 0) {
      filtered = filtered.filter((business: Business) =>
        filters.businessTypes.some(
          (type: string) =>
            business.businessType.toLowerCase() === type.toLowerCase(),
        ),
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
            service.toLowerCase().includes(query.toLowerCase()),
          ),
      );
    }

    setFilteredBusinesses(filtered);
    setCurrentPage(1);
  };

  // Apply regular filters
  useEffect(() => {
    let filtered: Business[] = [...businesses];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (business: Business) =>
          business.name.includes(searchQuery) ||
          business.category.includes(searchQuery) ||
          business.location.includes(searchQuery) ||
          (business.categories &&
            business.categories.some((cat: string) =>
              cat.includes(searchQuery),
            )) ||
          business.services.some((service: string) =>
            service.includes(searchQuery),
          ),
      );
    }

    // Categories list matching SearchSection.tsx
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
        name:
          t("cat.computerHardwareSoftware") || "Computer Hardware & Software",
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
    ];

    // Apply category filter
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter((business: Business) => {
        // Find the category object to get the display name
        const categoryObj = categories.find(
          (cat) => cat.id === selectedCategory,
        );
        const categoryName = categoryObj ? categoryObj.name : selectedCategory;

        // Check if business category matches either ID or display name
        return (
          business.category === selectedCategory ||
          business.category === categoryName ||
          (business.categories &&
            (business.categories.includes(selectedCategory) ||
              business.categories.some(
                (cat) =>
                  typeof cat === "string" &&
                  (cat === selectedCategory || cat === categoryName),
              )))
        );
      });
    }

    // Apply business type filter
    if (selectedBusinessType && selectedBusinessType.toLowerCase() !== "all") {
      filtered = filtered.filter(
        (business: Business) =>
          business.businessType &&
          business.businessType.toLowerCase() ===
            selectedBusinessType.toLowerCase(),
      );
    }

    // Apply location filter
    if (selectedLocation) {
      filtered = filtered.filter((business: Business) =>
        business.location
          .toLowerCase()
          .includes(selectedLocation.toLowerCase()),
      );
    }

    // Apply rating filter
    if (selectedRating) {
      filtered = filtered.filter(
        (business: Business) => business.rating >= parseFloat(selectedRating),
      );
    }

    // Apply distance filter
    if (selectedDistance && selectedDistance !== "all") {
      filtered = filtered.filter((business: Business) => {
        // Check if serviceDistance exists and is a valid number
        if (
          business.serviceDistance === undefined ||
          business.serviceDistance === null
        ) {
          return false; // or true depending on your requirements
        }

        const businessDistance =
          typeof business.serviceDistance === "string"
            ? parseFloat(business.serviceDistance.split(" ")[0])
            : Number(business.serviceDistance);

        const selectedDistanceValue = parseFloat(selectedDistance);
        return (
          !isNaN(businessDistance) && businessDistance <= selectedDistanceValue
        );
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
    },
  );

  // Handle business click on map
  const handleBusinessClick = useCallback((business: any) => {
    // You can implement navigation or other actions when a business is clicked
  }, []);

  // Transform businesses to match InteractiveMap's expected format
  const mapBusinesses = useMemo(() => {
    return filteredBusinesses.map((business) => {
      const serviceDistance =
        typeof business.serviceDistance === "string"
          ? parseFloat(business.serviceDistance)
          : business.serviceDistance || 0;

      return {
        id: business.id,
        name: business.name,
        address: business.location || "Address not available",
        lat:
          typeof business.lat === "string"
            ? parseFloat(business.lat)
            : business.lat || 0,
        lng:
          typeof business.lng === "string"
            ? parseFloat(business.lng)
            : business.lng || 0,
        type: business.businessType,
        category: business.category,
        categories: business.categories || [],
        businessType: business.businessType,
        profileImage: business.profileImage,
        serviceDistance: serviceDistance,
        rating: business.rating || 0,
        reviewsCount: business.reviewsCount || 0,
        status: business.status,
        phone: business.phone || "",
        contactEmail: business.contactEmail || "",
        description: business.description || "",
      };
    });
  }, [filteredBusinesses]);

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
                      String(filteredBusinesses.length),
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
                          | "name",
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
                    address={address}
                    setAddress={setAddress}
                    isRTL={false} // You can replace this with your actual RTL detection logic
                    verifiedOnly={verifiedOnly}
                    setVerifiedOnly={setVerifiedOnly}
                    openNow={openNow}
                    setOpenNow={setOpenNow}
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
                              String(sortedBusinesses.length),
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="h-[500px] w-full rounded-lg overflow-hidden">
                        <InteractiveMapGoogle
                          businesses={mapBusinesses}
                          onBusinessClick={handleBusinessClick}
                        />
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
                          // Reset all filter states
                          setSearchQuery("");
                          setSelectedCategory("all");
                          setSelectedBusinessType("all");
                          setSelectedLocation("");
                          setSelectedRating("");
                          setSelectedDistance("");
                          setVerifiedOnly(false);
                          setOpenNow(false);
                          setAddress("");
                          setDebouncedSearch("");
                          setDebouncedAddress("");
                          setSortBy("rating");
                          setViewMode("grid");
                          setCurrentPage(1);

                          // Update URL without any query parameters
                          const url = new URL(window.location.href);
                          const baseUrl = url.origin + url.pathname;
                          window.history.pushState({}, "", baseUrl);
                        }}
                        className="bg-yellow-400 text-white px-6 py-3 rounded-lg hover:bg-yellow-500 font-medium cursor-pointer transition-colors duration-200"
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
        {/* Load More / Show Less Section */}
        {sortedBusinesses.length > 0 && (
          <section className="py-8 text-center">
            <button
              onClick={() => {
                setShowAllBusinesses(!showAllBusinesses);
                // Reset to first page when toggling view
                setCurrentPage(1);
              }}
              className="bg-yellow-400 text-white px-8 py-4 rounded-full hover:bg-yellow-500 font-semibold whitespace-nowrap cursor-pointer transition-all duration-200"
            >
              {showAllBusinesses
                ? t("businessesPage.showLess")
                : t("businessesPage.loadMore")}
            </button>
          </section>
        )}
      </main>

      <Footer />
      <AIChatWidget />
    </div>
  );
}

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
