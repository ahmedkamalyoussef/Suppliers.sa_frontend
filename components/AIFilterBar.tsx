"use client";

import { useState, useEffect } from "react";
import type React from "react";
import { useAISearch } from "../contexts/AISearchContext";

type AISuggestions = {
  categories: string[];
  locations: string[];
  priceRange: string | null;
  rating: number | null;
  features: string[];
  specificProducts: string[];
  businessTypes: string[];
  distance: number | null;
};

type AIFilterBarProps = {
  onFilterChange: (payload: { query: string; filters: AISuggestions }) => void;
};

export default function AIFilterBar({ onFilterChange }: AIFilterBarProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { aiSearchQuery, setAISearchQuery } = useAISearch();

  // Clear AI search query when input field becomes empty
  useEffect(() => {
    if (!searchQuery.trim()) {
      setAISearchQuery("");
    }
  }, [searchQuery, setAISearchQuery]);

  // Handle AI search query from context (set by AIChatWidget)
  useEffect(() => {
    if (
      aiSearchQuery &&
      aiSearchQuery.trim() &&
      aiSearchQuery !== searchQuery
    ) {
      setSearchQuery(aiSearchQuery);
      setIsVisible(true);
      // Automatically trigger the search
      setTimeout(() => {
        handleAISearchWithQuery(aiSearchQuery);
      }, 100);
    }
  }, [aiSearchQuery]);

  const handleAISearch = async () => {
    if (!searchQuery.trim()) return;

    setIsProcessing(true);

    // Store the AI search query in context
    setAISearchQuery(searchQuery.trim());

    // Generate AI suggestions and apply filters
    const suggestions = generateAdvancedAISuggestions(searchQuery);

    // Call the onFilterChange prop to update the businesses list
    onFilterChange({
      query: searchQuery,
      filters: suggestions,
    });

    setIsProcessing(false);
  };

  const handleAISearchWithQuery = async (query: string) => {
    if (!query.trim()) return;

    setIsProcessing(true);

    // Generate AI suggestions and apply filters
    const suggestions = generateAdvancedAISuggestions(query);

    // Call the onFilterChange prop to update the businesses list
    onFilterChange({
      query: query,
      filters: suggestions,
    });

    setIsProcessing(false);
  };

  const generateAdvancedAISuggestions = (query: string): AISuggestions => {
    const lowerQuery = query.toLowerCase();

    const suggestions: AISuggestions = {
      categories: [],
      locations: [],
      priceRange: null,
      rating: null,
      features: [],
      specificProducts: [],
      businessTypes: [],
      distance: null,
    };

    // Enhanced product/service recognition
    const productKeywords: Record<string, string[]> = {
      glass: ["Window Glass", "Glass Supplies", "Glass Products"],
      window: ["Window Glass", "Windows", "Window Supplies"],
      door: ["Doors", "Door Supplies", "Door Manufacturing"],
      steel: ["Steel Supplies", "Steel Products", "Metal Works"],
      concrete: ["Concrete Supplies", "Construction Materials"],
      cement: ["Cement Supplies", "Building Materials"],
      marble: ["Marble Supplies", "Stone Products"],
      tile: ["Tiles", "Flooring Materials"],
      paint: ["Paint Supplies", "Coating Materials"],
      electrical: ["Electrical Supplies", "Electrical Components"],
      plumbing: ["Plumbing Supplies", "Pipe Fittings"],
      hvac: ["HVAC Equipment", "Air Conditioning"],
      lighting: ["Lighting Equipment", "Light Fixtures"],
      furniture: ["Furniture Supplies", "Office Furniture"],
      medical: ["Medical Equipment", "Healthcare Supplies"],
      food: ["Food Products", "Food Supplies"],
      textile: ["Textile Products", "Fabric Supplies"],
      chemical: ["Chemical Products", "Industrial Chemicals"],
      machinery: ["Industrial Machinery", "Equipment Supplies"],
      automotive: ["Auto Parts", "Vehicle Supplies"],
      electronics: ["Electronic Components", "Computer Hardware"],
    };

    // Check for specific products
    Object.keys(productKeywords).forEach((keyword) => {
      if (lowerQuery.includes(keyword)) {
        suggestions.specificProducts.push(...(productKeywords[keyword] || []));
      }
    });

    // Enhanced category mapping with more specific matching
    const categoryMappings: Record<string, string> = {
      "glass|window|door|construction|building|cement|concrete|marble|tile|paint":
        "Construction & Real Estate",
      "electronic|computer|tech|software|hardware|smartphone|laptop":
        "Electronics & Electrical Supplies",
      "food|restaurant|catering|grocery|beverage|drink": "Food & Beverage",
      "medical|healthcare|hospital|pharmaceutical|medicine|clinic":
        "Hospital & Medical Supplies",
      "auto|car|vehicle|automotive|spare parts|garage": "Automobile",
      "textile|fabric|clothing|apparel|fashion|garment": "Textiles & Fabrics",
      "chemical|industrial|manufacturing|factory|machinery":
        "Industrial Supplies",
      "furniture|office|home|decoration|interior": "Furniture",
      "oil|gas|petroleum|energy|fuel": "Oil and Gas",
      "agriculture|farming|crop|livestock|fertilizer": "Agriculture",
      "jewelry|gold|silver|diamond|accessories": "Jewelry & Gemstones",
      "leather|bag|shoe|belt|wallet": "Leather & Leather Products",
      "plastic|polymer|packaging|container": "Plastics & Products",
      "paper|printing|publishing|stationery": "Printing & Publishing",
      "security|protection|safety|surveillance": "Security & Protection",
      "sport|entertainment|game|toy|recreation": "Sports & Entertainment",
      "telecommunication|phone|internet|network": "Telecommunications",
      "hotel|hospitality|restaurant|catering": "Hotel Supplies & Equipment",
      "office|school|education|stationery|supplies": "Office & School Supplies",
    };

    Object.entries(categoryMappings).forEach(([keywords, category]) => {
      const keywordList = keywords.split("|");
      if (keywordList.some((keyword) => lowerQuery.includes(keyword))) {
        if (!suggestions.categories.includes(category)) {
          suggestions.categories.push(category);
        }
      }
    });

    // Enhanced location detection with Saudi cities and regions
    const locationMappings: Record<string, string> = {
      "riyadh|riyad|الرياض": "Riyadh",
      "jeddah|jidda|jedda|جدة": "Jeddah",
      "makkah|mecca|maka|مكة": "Makkah",
      "medina|madinah|المدينة": "Madinah",
      "dammam|الدمام": "Dammam",
      "khobar|خبر": "Khobar",
      "taif|الطائف": "Taif",
      "abha|أبها": "Abha",
      "tabuk|تبوك": "Tabuk",
      "buraidah|بريدة": "Buraidah",
      "khamis mushait|خميس": "Khamis Mushait",
      "hail|حائل": "Hail",
      "najran|نجران": "Najran",
      "jubail|الجبيل": "Jubail",
      "dhahran|الظهران": "Dhahran",
      "yanbu|ينبع": "Yanbu",
      "qassim|القصيم": "Qassim",
      "eastern province|المنطقة الشرقية": "Eastern Province",
      "western region|المنطقة الغربية": "Western Region",
      "central region|المنطقة الوسطى": "Central Region",
      "northern region|المنطقة الشمالية": "Northern Region",
      "southern region|المنطقة الجنوبية": "Southern Region",
      "near me|nearby|قريب": "Near Me",
    };

    Object.entries(locationMappings).forEach(([keywords, location]) => {
      const keywordList = keywords.split("|");
      if (keywordList.some((keyword) => lowerQuery.includes(keyword))) {
        if (!suggestions.locations.includes(location)) {
          suggestions.locations.push(location);
        }
      }
    });

    // Enhanced business type detection
    const businessTypeMappings: Record<string, string> = {
      "supplier|supply|supplying|distribute|distributor": "Supplier",
      "store|shop|retail|market|outlet": "Store",
      "office|company|corporate|business": "Office",
      "individual|freelance|personal|private": "Individual",
      "manufacturer|factory|production|producer": "Manufacturer",
      "wholesaler|wholesale|bulk|trader": "Wholesaler",
    };

    Object.entries(businessTypeMappings).forEach(([keywords, type]) => {
      const keywordList = keywords.split("|");
      if (keywordList.some((keyword) => lowerQuery.includes(keyword))) {
        if (!suggestions.businessTypes.includes(type)) {
          suggestions.businessTypes.push(type);
        }
      }
    });

    // Enhanced quality and service indicators
    const qualityIndicators: Record<string, number> = {
      "best|top|excellent|premium|high quality|superior": 5,
      "good|quality|reliable|trusted": 4,
      "average|decent|okay": 3,
      "budget|cheap|affordable|low cost": 2,
    };

    Object.entries(qualityIndicators).forEach(([keywords, rating]) => {
      const keywordList = keywords.split("|");
      if (keywordList.some((keyword) => lowerQuery.includes(keyword))) {
        suggestions.rating = Math.max(suggestions.rating || 0, rating);
      }
    });

    // Enhanced feature detection
    const featureMappings: Record<string, string> = {
      "delivery|shipping|transport|logistics": "Free Delivery",
      "24/7|24 hours|round the clock|always open": "24/7 Service",
      "warranty|guarantee|assurance|coverage": "Warranty",
      "installation|setup|fitting|mounting": "Installation Service",
      "maintenance|service|repair|support": "Maintenance Service",
      "credit|payment plan|installment|financing": "Credit Available",
      "bulk|wholesale|large quantity|mass order": "Bulk Orders",
      "custom|customized|bespoke|tailor made": "Custom Orders",
      "certified|licensed|accredited|approved": "Certified",
      "export|international|overseas|global": "Export Services",
    };

    Object.entries(featureMappings).forEach(([keywords, feature]) => {
      const keywordList = keywords.split("|");
      if (keywordList.some((keyword) => lowerQuery.includes(keyword))) {
        if (!suggestions.features.includes(feature)) {
          suggestions.features.push(feature);
        }
      }
    });

    // Price range detection
    const priceIndicators: Record<string, string> = {
      "cheap|budget|affordable|low cost|economical|inexpensive": "budget",
      "premium|expensive|high end|luxury|costly": "premium",
      "mid range|moderate|average price|reasonable": "medium",
    };

    Object.entries(priceIndicators).forEach(([keywords, range]) => {
      const keywordList = keywords.split("|");
      if (keywordList.some((keyword) => lowerQuery.includes(keyword))) {
        suggestions.priceRange = range;
      }
    });

    return suggestions;
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAISearch();
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <i className="ri-brain-line text-white text-sm"></i>
            </div>
            <div>
              <h3 className="font-bold text-gray-800">AI Smart Filter</h3>
              <p className="text-xs text-gray-600">
                Tell me exactly what you're looking for - product, location,
                requirements
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="text-gray-600 hover:text-gray-800 cursor-pointer"
          >
            <i
              className={`ri-${
                isVisible ? "arrow-up" : "arrow-down"
              }-s-line text-xl`}
            ></i>
          </button>
        </div>

        {isVisible && (
          <div className="space-y-4">
            {/* AI Search Input */}
            <div className="relative">
              <div className="flex space-x-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="e.g., 'Window Glass supplier in Jeddah with delivery service' or 'Electronics in Riyadh'"
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <i className="ri-magic-line text-blue-500"></i>
                  </div>
                </div>
                <button
                  onClick={handleAISearch}
                  disabled={!searchQuery.trim() || isProcessing}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 font-medium whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <i className="ri-loader-4-line animate-spin"></i>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <i className="ri-search-line"></i>
                      <span>AI Search</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
