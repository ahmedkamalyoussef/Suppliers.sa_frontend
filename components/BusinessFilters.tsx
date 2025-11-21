"use client";

import { useState } from "react";
import { useLanguage } from "../lib/LanguageContext";

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
}: BusinessFiltersProps) {
  const { t } = useLanguage();
  const [showVerified, setShowVerified] = useState<boolean>(false);
  const [showOpenNow, setShowOpenNow] = useState<boolean>(false);

  const categories: Category[] = [
    { id: "all", name: t("filters.allCategories"), icon: "ri-apps-2-line" },
    { id: "agriculture", name: t("cat.agriculture"), icon: "ri-plant-line" },
    {
      id: "apparel-fashion",
      name: t("cat.apparelFashion"),
      icon: "ri-shirt-line",
    },
    { id: "automobile", name: t("cat.automobile"), icon: "ri-car-line" },
    {
      id: "brass-hardware",
      name: t("cat.brassHardware"),
      icon: "ri-tools-line",
    },
    {
      id: "business-services",
      name: t("cat.businessServices"),
      icon: "ri-briefcase-line",
    },
    { id: "chemicals", name: t("cat.chemicals"), icon: "ri-flask-line" },
    {
      id: "computer-hardware-software",
      name: t("cat.computerHardware"),
      icon: "ri-computer-line",
    },
    {
      id: "construction-real-estate",
      name: t("cat.constructionRealEstate"),
      icon: "ri-hammer-line",
    },
    {
      id: "consumer-electronics",
      name: t("cat.consumerElectronics"),
      icon: "ri-smartphone-line",
    },
    {
      id: "electronics-electrical",
      name: t("cat.electronicsElectrical"),
      icon: "ri-flashlight-line",
    },
    {
      id: "energy-power",
      name: t("cat.energyPower"),
      icon: "ri-lightning-line",
    },
    {
      id: "environment-pollution",
      name: t("cat.environmentPollution"),
      icon: "ri-leaf-line",
    },
    {
      id: "food-beverage",
      name: t("cat.foodBeverage"),
      icon: "ri-restaurant-line",
    },
    { id: "furniture", name: t("cat.furniture"), icon: "ri-sofa-line" },
    { id: "gifts-crafts", name: t("cat.giftsCrafts"), icon: "ri-gift-line" },
    {
      id: "health-beauty",
      name: t("cat.healthBeauty"),
      icon: "ri-scissors-line",
    },
    { id: "home-supplies", name: t("cat.homeSupplies"), icon: "ri-home-line" },
    { id: "home-textiles", name: t("cat.homeTextiles"), icon: "ri-shirt-line" },
    {
      id: "hospital-medical",
      name: t("cat.hospitalMedical"),
      icon: "ri-health-book-line",
    },
    {
      id: "hotel-supplies",
      name: t("cat.hotelSupplies"),
      icon: "ri-hotel-line",
    },
    {
      id: "industrial-supplies",
      name: t("cat.industrialSupplies"),
      icon: "ri-settings-line",
    },
    {
      id: "jewelry-gemstones",
      name: t("cat.jewelryGemstones"),
      icon: "ri-gem-line",
    },
    {
      id: "leather-products",
      name: t("cat.leatherProducts"),
      icon: "ri-handbag-line",
    },
    { id: "machinery", name: t("cat.machinery"), icon: "ri-settings-2-line" },
    {
      id: "mineral-metals",
      name: t("cat.mineralMetals"),
      icon: "ri-copper-diamond-line",
    },
    { id: "office-school", name: t("cat.officeSchool"), icon: "ri-book-line" },
    { id: "oil-gas", name: t("cat.oilGas"), icon: "ri-oil-line" },
    {
      id: "packaging-paper",
      name: t("cat.packagingPaper"),
      icon: "ri-box-line",
    },
    {
      id: "pharmaceuticals",
      name: t("cat.pharmaceuticals"),
      icon: "ri-capsule-line",
    },
    { id: "pipes-tubes", name: t("cat.pipesTubes"), icon: "ri-roadster-line" },
    {
      id: "plastics-products",
      name: t("cat.plasticsProducts"),
      icon: "ri-recycle-line",
    },
    {
      id: "printing-publishing",
      name: t("cat.printingPublishing"),
      icon: "ri-printer-line",
    },
    { id: "real-estate", name: t("cat.realEstate"), icon: "ri-building-line" },
    {
      id: "scientific-laboratory",
      name: t("cat.scientificLaboratory"),
      icon: "ri-microscope-line",
    },
    {
      id: "security-protection",
      name: t("cat.securityProtection"),
      icon: "ri-shield-line",
    },
    {
      id: "sports-entertainment",
      name: t("cat.sportsEntertainment"),
      icon: "ri-football-line",
    },
    {
      id: "telecommunications",
      name: t("cat.telecommunications"),
      icon: "ri-phone-line",
    },
    {
      id: "textiles-fabrics",
      name: t("cat.textilesFabrics"),
      icon: "ri-shirt-line",
    },
    { id: "toys", name: t("cat.toys"), icon: "ri-gamepad-line" },
    {
      id: "transportation",
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
    setShowVerified(false);
    setShowOpenNow(false);
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          {t("filters.searchTitle")}
        </h3>
        <div className="relative">
          <input
            type="text"
            placeholder={t("filters.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-3 pl-10 pr-4 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:outline-none text-sm"
          />
          <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
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
              checked={showVerified}
              onChange={(e) => setShowVerified(e.target.checked)}
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
              checked={showOpenNow}
              onChange={(e) => setShowOpenNow(e.target.checked)}
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
            <span className="text-sm font-semibold text-gray-800">1,247</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {t("filters.verified")}
            </span>
            <span className="text-sm font-semibold text-green-600">892</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {t("filters.openNow")}
            </span>
            <span className="text-sm font-semibold text-blue-600">634</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {t("filters.newThisWeek")}
            </span>
            <span className="text-sm font-semibold text-yellow-600">23</span>
          </div>
        </div>
      </div>
    </div>
  );
}
