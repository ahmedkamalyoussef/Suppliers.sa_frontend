"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "../lib/LanguageContext";
import { apiService } from "../lib/api";

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface BusinessType {
  id: string;
  name: string;
  icon: string;
}

interface BusinessFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedBusinessType: string;
  setSelectedBusinessType: (type: string) => void;
  selectedDistance: string;
  setSelectedDistance: (distance: string) => void;
  address: string;
  setAddress: (address: string) => void;
  isRTL: boolean;
  verifiedOnly: boolean;
  setVerifiedOnly: (value: boolean) => void;
  openNow: boolean;
  setOpenNow: (value: boolean) => void;
}

export default function BusinessFilters({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedBusinessType,
  setSelectedBusinessType,
  selectedDistance,
  setSelectedDistance,
  address,
  setAddress,
  isRTL,
  verifiedOnly,
  setVerifiedOnly,
  openNow,
  setOpenNow,
}: BusinessFiltersProps) {
  const [lastTrackedSearch, setLastTrackedSearch] = useState<string>("");
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Track search when user types (with 2-second debounce)
  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Set new timeout to track search after 2 seconds
    if (value && value !== lastTrackedSearch) {
      const timeout = setTimeout(async () => {
        try {
          // Get current user location
          const userData = localStorage.getItem("supplier_user");
          let location = "Unknown";
          
          if (userData) {
            try {
              const user = JSON.parse(userData);
              location = user.profile?.address || "Unknown";
            } catch (error) {
            }
          }

          await apiService.trackSearch({
            keyword: value,
            search_type: "supplier",
            location: location,
          });
          
          setLastTrackedSearch(value);
        } catch (error) {
        }
      }, 2000); // 2 seconds delay
      
      setSearchTimeout(timeout);
    }
  };
  // Fetch stats when component mounts
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await apiService.getStats();
        setStats(stats);
      } catch (error) {
      }
    };

    fetchStats();
  }, []);
  const { t } = useLanguage();
  const [stats, setStats] = useState<{
    total_businesses: number;
    total_suppliers: number;
    open_now: number;
    new_this_week: number;
  } | null>(null);

  // Using props for verifiedOnly and openNow instead of local state

  const categories: Category[] = [
    { id: "all", name: t("filters.allCategories"), icon: "ri-apps-2-line" },
    { id: "Agriculture", name: t("cat.agriculture"), icon: "ri-plant-line" },
    {
      id: "Apparel & Fashion",
      name: t("cat.apparelFashion"),
      icon: "ri-shirt-line",
    },
    { id: "Automobile", name: t("cat.automobile"), icon: "ri-car-line" },
    {
      id: "Brass & Hardware",
      name: t("cat.brassHardware"),
      icon: "ri-tools-line",
    },
    {
      id: "Business Services",
      name: t("cat.businessServices"),
      icon: "ri-briefcase-line",
    },
    { id: "Chemicals", name: t("cat.chemicals"), icon: "ri-flask-line" },
    {
      id: "Computer Hardware & Software",
      name: t("cat.computerHardware"),
      icon: "ri-computer-line",
    },
    {
      id: "Construction & Real Estate",
      name: t("cat.constructionRealEstate"),
      icon: "ri-hammer-line",
    },
    {
      id: "Consumer Electronics",
      name: t("cat.consumerElectronics"),
      icon: "ri-smartphone-line",
    },
    {
      id: "Electronics & Electrical Supplies",
      name: t("cat.electronicsElectrical"),
      icon: "ri-flashlight-line",
    },
    {
      id: "Energy & Power",
      name: t("cat.energyPower"),
      icon: "ri-lightning-line",
    },
    {
      id: "Environment & Pollution",
      name: t("cat.environmentPollution"),
      icon: "ri-leaf-line",
    },
    {
      id: "Food & Beverage",
      name: t("cat.foodBeverage"),
      icon: "ri-restaurant-line",
    },
    { id: "Furniture", name: t("cat.furniture"), icon: "ri-sofa-line" },
    { id: "Gifts & Crafts", name: t("cat.giftsCrafts"), icon: "ri-gift-line" },
    {
      id: "Health & Beauty",
      name: t("cat.healthBeauty"),
      icon: "ri-scissors-line",
    },
    { id: "Home Supplies", name: t("cat.homeSupplies"), icon: "ri-home-line" },
    { id: "Home Textiles", name: t("cat.homeTextiles"), icon: "ri-shirt-line" },
    {
      id: "Hospital & Medical",
      name: t("cat.hospitalMedical"),
      icon: "ri-health-book-line",
    },
    {
      id: "Hotel Supplies & Equipment",
      name: t("cat.hotelSupplies"),
      icon: "ri-hotel-line",
    },
    {
      id: "Industrial Supplies",
      name: t("cat.industrialSupplies"),
      icon: "ri-settings-line",
    },
    {
      id: "Jewelry & Gemstones",
      name: t("cat.jewelryGemstones"),
      icon: "ri-gem-line",
    },
    {
      id: "Leather Products",
      name: t("cat.leatherProducts"),
      icon: "ri-handbag-line",
    },
    { id: "Machinery", name: t("cat.machinery"), icon: "ri-settings-2-line" },
    {
      id: "Mineral & Metals",
      name: t("cat.mineralMetals"),
      icon: "ri-copper-diamond-line",
    },
    {
      id: "Office & School Supplies",
      name: t("cat.officeSchool"),
      icon: "ri-book-line",
    },
    { id: "Oil & Gas", name: t("cat.oilGas"), icon: "ri-oil-line" },
    {
      id: "Packaging & Paper",
      name: t("cat.packagingPaper"),
      icon: "ri-box-line",
    },
    {
      id: "Pharmaceuticals",
      name: t("cat.pharmaceuticals"),
      icon: "ri-capsule-line",
    },
    {
      id: "Pipes & Tubes",
      name: t("cat.pipesTubes"),
      icon: "ri-roadster-line",
    },
    {
      id: "Plastics & Products",
      name: t("cat.plasticsProducts"),
      icon: "ri-recycle-line",
    },
    {
      id: "Printing & Publishing",
      name: t("cat.printingPublishing"),
      icon: "ri-printer-line",
    },
    { id: "Real Estate", name: t("cat.realEstate"), icon: "ri-building-line" },
    {
      id: "Scientific & Laboratory",
      name: t("cat.scientificLaboratory"),
      icon: "ri-microscope-line",
    },
    {
      id: "Security & Protection",
      name: t("cat.securityProtection"),
      icon: "ri-shield-line",
    },
    {
      id: "Sports & Entertainment",
      name: t("cat.sportsEntertainment"),
      icon: "ri-football-line",
    },
    {
      id: "Telecommunications",
      name: t("cat.telecommunications"),
      icon: "ri-phone-line",
    },
    {
      id: "Textiles & Fabrics",
      name: t("cat.textilesFabrics"),
      icon: "ri-shirt-line",
    },
    { id: "Toys", name: t("cat.toys"), icon: "ri-gamepad-line" },
    {
      id: "Transportation",
      name: t("cat.transportation"),
      icon: "ri-truck-line",
    },
  ];

  const businessTypes: BusinessType[] = [
    { id: "all", name: t("filters.allTypes"), icon: "ri-building-line" },
    { id: "Supplier", name: "Supplier", icon: "ri-truck-line" },
    { id: "Store", name: "Store", icon: "ri-store-line" },
    { id: "Office", name: "Office", icon: "ri-building-line" },
    { id: "Individual", name: "Individual", icon: "ri-user-line" },
  ];

  const distanceOptions = [
    { value: "", label: t("filters.allDistances") },
    { value: "2", label: t("filters.within2km") },
    { value: "5", label: t("filters.within5km") },
    { value: "10", label: t("filters.within10km") },
    { value: "15", label: t("filters.within15km") },
    { value: "20", label: t("filters.within20km") },
    { value: "50", label: t("filters.within50km") },
  ];

  const clearAllFilters = (): void => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedBusinessType("all");
    setSelectedDistance("");
    setVerifiedOnly(false);
    setOpenNow(false);
  };

  return (
    <div className="space-y-6">
      {/* Search and Address Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {t("filters.searchTitle")}
        </h3>

        {/* Search Input */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 rtl:text-right">
            {t("filters.search")}
          </label>
          <div className="relative rounded-md">
            <div
              className={`absolute inset-y-0 ${
                isRTL ? "right-0 pr-3" : "left-0 pl-3"
              } flex items-center pointer-events-none`}
            >
              <i className="ri-search-line text-gray-500"></i>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={t("filters.searchPlaceholder")}
              className={`block w-full ${
                isRTL ? "pr-10" : "pl-10"
              } py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200`}
              dir={isRTL ? "rtl" : "ltr"}
            />
          </div>
        </div>

        {/* Address Input */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 rtl:text-right">
            {t("filters.address")}
          </label>
          <div className="relative rounded-md">
            <div
              className={`absolute inset-y-0 ${
                isRTL ? "right-0 pr-3" : "left-0 pl-3"
              } flex items-center pointer-events-none`}
            >
              <i className="ri-map-pin-line text-gray-500"></i>
            </div>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={t("filters.addressPlaceholder")}
              className={`block w-full ${
                isRTL ? "pr-10" : "pl-10"
              } py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200`}
              dir={isRTL ? "rtl" : "ltr"}
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          {t("filters.categoriesTitle")}
        </h3>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all cursor-pointer ${
                selectedCategory === category.id
                  ? "bg-yellow-400 text-white shadow-md"
                  : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              <i className={`${category.icon} text-sm`}></i>
              <span className="font-medium text-sm">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Business Types */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          {t("filters.businessTypeTitle")}
        </h3>
        <div className="space-y-2">
          {businessTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedBusinessType(type.id)}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all cursor-pointer ${
                selectedBusinessType === type.id
                  ? "bg-yellow-400 text-white shadow-md"
                  : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              <i className={`${type.icon} text-sm`}></i>
              <span className="font-medium text-sm">{type.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Additional Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          {t("filters.filtersTitle")}
        </h3>
        <div className="space-y-4">
          {/* Distance Filter */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              {t("filters.distanceTitle")}
            </label>
            <select
              value={selectedDistance}
              onChange={(e) => setSelectedDistance(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:border-yellow-400 focus:outline-none text-sm"
            >
              {distanceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Verified Filter */}
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
            />
            <div className="flex items-center space-x-2">
              <i className="ri-verified-badge-line text-green-500 text-sm"></i>
              <span className="text-sm text-gray-700">
                {t("filters.verifiedOnly")}
              </span>
            </div>
          </label>

          {/* Open Now Filter */}
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={openNow}
              onChange={(e) => setOpenNow(e.target.checked)}
              className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
            />
            <div className="flex items-center space-x-2">
              <i className="ri-time-line text-green-500 text-sm"></i>
              <span className="text-sm text-gray-700">
                {t("filters.openNow")}
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Clear Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <button
          onClick={clearAllFilters}
          className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-200 font-medium text-sm cursor-pointer"
        >
          <i className="ri-refresh-line mr-2"></i>
          {t("filters.clearAll")}
        </button>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          {t("filters.quickStats")}
        </h3>
        <div className="space-y-3"> 
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {t("filters.totalBusinesses")}
            </span>
            <span className="text-sm font-semibold text-gray-800">
              {stats ? stats.total_businesses.toLocaleString() : '...'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {t("filters.verified")}
            </span>
            <span className="text-sm font-semibold text-green-600">
              {stats ? stats.total_suppliers.toLocaleString() : '...'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {t("filters.openNow")}
            </span>
            <span className="text-sm font-semibold text-blue-600">
              {stats ? stats.open_now.toLocaleString() : '...'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {t("filters.newThisWeek")}
            </span>
            <span className="text-sm font-semibold text-yellow-600">
              {stats ? stats.new_this_week.toLocaleString() : '...'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
