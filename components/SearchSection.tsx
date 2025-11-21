"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "../lib/LanguageContext";
import FeaturedBusinesses from "./FeaturedBusinesses";
import InteractiveMap from "./InteractiveMap";
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
  const { t, isRTL } = useLanguage();
  const router = useRouter();

  // Enhanced business locations with proper category mapping and real Saudi addresses
  const businessLocations = [
    // Agriculture category - Real locations in agricultural regions
    {
      id: 1,
      name: "Green Valley Agriculture",
      address: "Al Kharj Agricultural Area, Riyadh",
      lat: 24.1386,
      lng: 47.3056,
      type: "Agriculture",
      category: "agriculture",
    },
    {
      id: 2,
      name: "Date Palm Suppliers",
      address: "Al Ahsa Oasis, Eastern Province",
      lat: 25.3833,
      lng: 49.5833,
      type: "Agriculture",
      category: "agriculture",
    },
    {
      id: 3,
      name: "Northern Agriculture",
      address: "Al Jouf Agricultural Region",
      lat: 29.7855,
      lng: 40.1,
      type: "Agriculture",
      category: "agriculture",
    },
    {
      id: 4,
      name: "Central Grain Trading",
      address: "Qassim Agricultural Zone, Buraidah",
      lat: 26.3333,
      lng: 43.9667,
      type: "Agriculture",
      category: "agriculture",
    },
    {
      id: 5,
      name: "Hail Agricultural Equipment",
      address: "Hail Agricultural Center",
      lat: 27.5236,
      lng: 41.7,
      type: "Agriculture",
      category: "agriculture",
    },

    // Electronics category - Major commercial areas
    {
      id: 6,
      name: "Tech Solutions Center",
      address: "Olaya District, Riyadh",
      lat: 24.7136,
      lng: 46.6753,
      type: "Electronics",
      category: "consumer-electronics",
    },
    {
      id: 7,
      name: "Metro Electronics Supply",
      address: "Tahlia Street, Riyadh",
      lat: 24.7186,
      lng: 46.685,
      type: "Electronics",
      category: "consumer-electronics",
    },
    {
      id: 8,
      name: "Red Sea Electronics",
      address: "Tahlia Street, Jeddah",
      lat: 21.4858,
      lng: 39.1925,
      type: "Electronics",
      category: "consumer-electronics",
    },
    {
      id: 9,
      name: "Eastern Electronics Hub",
      address: "King Saud Street, Dammam",
      lat: 26.4207,
      lng: 50.0888,
      type: "Electronics",
      category: "consumer-electronics",
    },
    {
      id: 10,
      name: "Qassim Electronics",
      address: "King Abdulaziz Road, Buraidah",
      lat: 26.331,
      lng: 43.98,
      type: "Electronics",
      category: "consumer-electronics",
    },

    // Automotive category - Industrial and commercial zones
    {
      id: 11,
      name: "Riyadh Auto Parts",
      address: "Industrial City, Riyadh",
      lat: 24.7236,
      lng: 46.6853,
      type: "Automotive",
      category: "automobile",
    },
    {
      id: 12,
      name: "Eastern Auto Parts",
      address: "Industrial Area, Dammam",
      lat: 26.4157,
      lng: 50.0838,
      type: "Automotive",
      category: "automobile",
    },
    {
      id: 13,
      name: "Jeddah Automotive Center",
      address: "Industrial City, Jeddah",
      lat: 21.4908,
      lng: 39.1975,
      type: "Automotive",
      category: "automobile",
    },

    // Construction category - Major construction hubs
    {
      id: 14,
      name: "Capital Hardware",
      address: "Industrial Valley, Riyadh",
      lat: 24.7086,
      lng: 46.67,
      type: "Hardware",
      category: "construction-real-estate",
    },
    {
      id: 15,
      name: "Coastal Construction",
      address: "Corniche Road, Jeddah",
      lat: 21.4808,
      lng: 39.1875,
      type: "Construction",
      category: "construction-real-estate",
    },
    {
      id: 16,
      name: "Tabuk Construction Materials",
      address: "Industrial Area, Tabuk",
      lat: 28.4048,
      lng: 36.571,
      type: "Construction",
      category: "construction-real-estate",
    },
    {
      id: 17,
      name: "Mountain Construction",
      address: "Construction District, Abha",
      lat: 18.2164,
      lng: 42.5047,
      type: "Construction",
      category: "construction-real-estate",
    },

    // Industrial category - Industrial cities
    {
      id: 18,
      name: "Jeddah Industrial Supplies",
      address: "Industrial City, Jeddah",
      lat: 21.4908,
      lng: 39.1975,
      type: "Industrial",
      category: "industrial-supplies",
    },
    {
      id: 19,
      name: "Oil Services Company",
      address: "Industrial City, Jubail",
      lat: 27.0174,
      lng: 49.6584,
      type: "Oil&Gas",
      category: "oil-gas",
    },
    {
      id: 20,
      name: "Industrial Equipment Co.",
      address: "Industrial City, Yanbu",
      lat: 24.0875,
      lng: 38.0569,
      type: "Industrial",
      category: "industrial-supplies",
    },
    {
      id: 21,
      name: "Jubail Petrochemicals",
      address: "Industrial City, Al Jubail",
      lat: 27.0174,
      lng: 49.6584,
      type: "Petrochemical",
      category: "chemicals",
    },

    // Fashion & Textiles category - Commercial districts
    {
      id: 22,
      name: "Fashion District",
      address: "Al-Rawdah District, Jeddah",
      lat: 21.4758,
      lng: 39.1825,
      type: "Fashion",
      category: "apparel-fashion",
    },
    {
      id: 23,
      name: "Southern Textiles",
      address: "Textile Market, Abha",
      lat: 18.2164,
      lng: 42.5047,
      type: "Textiles",
      category: "textiles-fabrics",
    },
    {
      id: 24,
      name: "Riyadh Fashion Hub",
      address: "Batha Commercial Area, Riyadh",
      lat: 24.6333,
      lng: 46.7167,
      type: "Fashion",
      category: "apparel-fashion",
    },

    // Medical category - Near hospitals and medical areas
    {
      id: 25,
      name: "Medical Equipment Co.",
      address: "Al-Sharafeyah, Jeddah",
      lat: 21.4958,
      lng: 39.2025,
      type: "Medical",
      category: "hospital-medical",
    },
    {
      id: 26,
      name: "Riyadh Medical Supplies",
      address: "Medical City, Riyadh",
      lat: 24.6986,
      lng: 46.7236,
      type: "Medical",
      category: "hospital-medical",
    },

    // Food & Beverage category - Various regions
    {
      id: 26,
      name: "Mountain Fresh Foods",
      address: "King Khalid Street, Abha",
      lat: 18.2164,
      lng: 42.5047,
      type: "Food",
      category: "food-beverage",
    },
    {
      id: 27,
      name: "Mecca Food Distributors",
      address: "Al-Misfalah, Mecca",
      lat: 21.3941,
      lng: 39.8629,
      type: "Food",
      category: "food-beverage",
    },
    {
      id: 28,
      name: "Central Food Trading",
      address: "Food Market, Riyadh",
      lat: 24.65,
      lng: 46.71,
      type: "Food",
      category: "food-beverage",
    },

    // Technology category - Business districts
    {
      id: 29,
      name: "Khobar Tech Center",
      address: "Prince Faisal Street, Khobar",
      lat: 26.2172,
      lng: 50.1971,
      type: "Technology",
      category: "computer-hardware-software",
    },
    {
      id: 30,
      name: "Riyadh Tech Hub",
      address: "Digital City, Riyadh",
      lat: 24.7611,
      lng: 46.6822,
      type: "Technology",
      category: "computer-hardware-software",
    },

    // Office Supplies category - Commercial areas
    {
      id: 31,
      name: "Office Plus Supplies",
      address: "Business District, Riyadh",
      lat: 24.7286,
      lng: 46.6903,
      type: "Office",
      category: "office-school",
    },
    {
      id: 32,
      name: "Jeddah Office Solutions",
      address: "Commercial Center, Jeddah",
      lat: 21.5433,
      lng: 39.1728,
      type: "Office",
      category: "office-school",
    },

    // Services category - Various service locations
    {
      id: 33,
      name: "Highland Tourism Services",
      address: "Tourist District, Abha",
      lat: 18.2214,
      lng: 42.5097,
      type: "Tourism",
      category: "sports-entertainment",
    },
    {
      id: 34,
      name: "Mountain Tourism Equipment",
      address: "Tourist Area, Taif",
      lat: 21.2753,
      lng: 40.4208,
      type: "Tourism",
      category: "sports-entertainment",
    },
    {
      id: 35,
      name: "Pilgrimage Services",
      address: "Near Haram, Mecca",
      lat: 21.3841,
      lng: 39.8529,
      type: "Services",
      category: "business-services",
    },

    // Trading & Logistics category - Commercial hubs
    {
      id: 36,
      name: "Medina Trading",
      address: "Prophet Mosque Area, Medina",
      lat: 24.5247,
      lng: 39.5692,
      type: "Trading",
      category: "business-services",
    },
    {
      id: 37,
      name: "Northern Trading Post",
      address: "Commercial Street, Hail",
      lat: 27.5164,
      lng: 41.695,
      type: "Trading",
      category: "business-services",
    },
    {
      id: 38,
      name: "Border Trade Center",
      address: "Commercial District, Najran",
      lat: 17.4924,
      lng: 44.1277,
      type: "Trading",
      category: "business-services",
    },
    {
      id: 39,
      name: "Southern Logistics",
      address: "Transportation Hub, Jazan",
      lat: 16.8892,
      lng: 42.5511,
      type: "Logistics",
      category: "transportation",
    },

    // Marine & Port category - Coastal areas
    {
      id: 40,
      name: "Gulf Marine Supplies",
      address: "Corniche, Al Khobar",
      lat: 26.2122,
      lng: 50.1921,
      type: "Marine",
      category: "transportation",
    },
    {
      id: 41,
      name: "Port Jazan Services",
      address: "Port Area, Jazan",
      lat: 16.8892,
      lng: 42.5511,
      type: "Port",
      category: "transportation",
    },
    {
      id: 42,
      name: "Coastal Fishing Supplies",
      address: "Marina District, Dammam",
      lat: 26.4333,
      lng: 50.1,
      type: "Fishing",
      category: "food-beverage",
    },

    // Specialty products category
    {
      id: 43,
      name: "Rose City Perfumes",
      address: "Rose Garden Area, Taif",
      lat: 21.2703,
      lng: 40.4158,
      type: "Perfumes",
      category: "health-beauty",
    },
    {
      id: 44,
      name: "Islamic Books Store",
      address: "Old City, Medina",
      lat: 24.5197,
      lng: 39.5642,
      type: "Books",
      category: "office-school",
    },
    {
      id: 45,
      name: "Desert Mining Equipment",
      address: "Mining District, Tabuk",
      lat: 28.3948,
      lng: 36.561,
      type: "Mining",
      category: "machinery",
    },
    {
      id: 46,
      name: "Desert Equipment Rental",
      address: "Service Road, Qassim",
      lat: 26.321,
      lng: 43.97,
      type: "Equipment",
      category: "machinery",
    },

    // Military & Security category
    {
      id: 47,
      name: "Southern Military Supplies",
      address: "King Fahd Road, Khamis Mushait",
      lat: 18.3061,
      lng: 42.7326,
      type: "Military",
      category: "security-protection",
    },

    // General supplies category
    {
      id: 48,
      name: "Holy City Supplies",
      address: "Ajyad Street, Mecca",
      lat: 21.3891,
      lng: 39.8579,
      type: "Supplies",
      category: "home-supplies",
    },
  ];

  // Filter businesses based on selected category
  const getFilteredBusinesses = () => {
    if (selectedCategory === "all") {
      return businessLocations;
    }
    return businessLocations.filter(
      (business) => business.category === selectedCategory
    );
  };

  const categories = [
    {
      id: "all",
      name: t("allCategories"),
      icon: "ri-apps-2-line",
      color: "from-purple-400 to-purple-600",
    },
    {
      id: "agriculture",
      name: t("cat.agriculture"),
      icon: "ri-plant-line",
      color: "from-green-400 to-green-600",
    },
    {
      id: "apparel-fashion",
      name: t("cat.apparelFashion"),
      icon: "ri-shirt-line",
      color: "from-pink-400 to-pink-600",
    },
    {
      id: "automobile",
      name: t("cat.automobile"),
      icon: "ri-car-line",
      color: "from-red-400 to-red-600",
    },
    {
      id: "brass-hardware",
      name: t("cat.brassHardware"),
      icon: "ri-tools-line",
      color: "from-yellow-600 to-orange-600",
    },
    {
      id: "business-services",
      name: t("cat.businessServices"),
      icon: "ri-briefcase-line",
      color: "from-blue-400 to-blue-600",
    },
    {
      id: "chemicals",
      name: t("cat.chemicals"),
      icon: "ri-flask-line",
      color: "from-purple-500 to-purple-700",
    },
    {
      id: "computer-hardware-software",
      name: t("cat.computerHardwareSoftware"),
      icon: "ri-computer-line",
      color: "from-indigo-400 to-indigo-600",
    },
    {
      id: "construction-real-estate",
      name: t("cat.constructionRealEstate"),
      icon: "ri-hammer-line",
      color: "from-orange-500 to-red-500",
    },
    {
      id: "consumer-electronics",
      name: t("cat.consumerElectronics"),
      icon: "ri-smartphone-line",
      color: "from-blue-400 to-blue-600",
    },
    {
      id: "electronics-electrical",
      name: t("cat.electronicsElectrical"),
      icon: "ri-flashlight-line",
      color: "from-yellow-400 to-yellow-600",
    },
    {
      id: "energy-power",
      name: t("cat.energyPower"),
      icon: "ri-lightning-line",
      color: "from-yellow-500 to-orange-500",
    },
    {
      id: "environment-pollution",
      name: t("cat.environmentPollution"),
      icon: "ri-leaf-line",
      color: "from-green-500 to-green-700",
    },
    {
      id: "food-beverage",
      name: t("cat.foodBeverage"),
      icon: "ri-restaurant-line",
      color: "from-orange-400 to-red-500",
    },
    {
      id: "furniture",
      name: t("cat.furniture"),
      icon: "ri-sofa-line",
      color: "from-amber-400 to-orange-500",
    },
    {
      id: "gifts-crafts",
      name: t("cat.giftsCrafts"),
      icon: "ri-gift-line",
      color: "from-pink-400 to-rose-500",
    },
    {
      id: "health-beauty",
      name: t("cat.healthBeauty"),
      icon: "ri-scissors-line",
      color: "from-fuchsia-400 to-pink-500",
    },
    {
      id: "home-supplies",
      name: t("cat.homeSupplies"),
      icon: "ri-home-line",
      color: "from-teal-400 to-teal-600",
    },
    {
      id: "home-textiles",
      name: t("cat.homeTextiles"),
      icon: "ri-shirt-line",
      color: "from-purple-400 to-purple-600",
    },
    {
      id: "hospital-medical",
      name: t("cat.hospitalMedical"),
      icon: "ri-health-book-line",
      color: "from-green-400 to-emerald-500",
    },
    {
      id: "hotel-supplies",
      name: t("cat.hotelSupplies"),
      icon: "ri-hotel-line",
      color: "from-blue-500 to-blue-700",
    },
    {
      id: "industrial-supplies",
      name: t("cat.industrialSupplies"),
      icon: "ri-settings-line",
      color: "from-gray-500 to-gray-700",
    },
    {
      id: "jewelry-gemstones",
      name: t("cat.jewelryGemstones"),
      icon: "ri-gem-line",
      color: "from-yellow-400 to-yellow-600",
    },
    {
      id: "leather-products",
      name: t("cat.leatherProducts"),
      icon: "ri-handbag-line",
      color: "from-amber-600 to-amber-800",
    },
    {
      id: "machinery",
      name: t("cat.machinery"),
      icon: "ri-settings-2-line",
      color: "from-gray-600 to-gray-800",
    },
    {
      id: "mineral-metals",
      name: t("cat.mineralMetals"),
      icon: "ri-copper-diamond-line",
      color: "from-gray-400 to-gray-600",
    },
    {
      id: "office-school",
      name: t("cat.officeSchool"),
      icon: "ri-book-line",
      color: "from-blue-400 to-blue-600",
    },
    {
      id: "oil-gas",
      name: t("cat.oilGas"),
      icon: "ri-oil-line",
      color: "from-black to-gray-800",
    },
    {
      id: "packaging-paper",
      name: t("cat.packagingPaper"),
      icon: "ri-box-line",
      color: "from-brown-400 to-brown-600",
    },
    {
      id: "pharmaceuticals",
      name: t("cat.pharmaceuticals"),
      icon: "ri-capsule-line",
      color: "from-red-400 to-red-600",
    },
    {
      id: "pipes-tubes",
      name: t("cat.pipesTubes"),
      icon: "ri-roadster-line",
      color: "from-gray-500 to-gray-700",
    },
    {
      id: "plastics-products",
      name: t("cat.plasticsProducts"),
      icon: "ri-recycle-line",
      color: "from-green-400 to-green-600",
    },
    {
      id: "printing-publishing",
      name: t("cat.printingPublishing"),
      icon: "ri-printer-line",
      color: "from-gray-400 to-gray-600",
    },
    {
      id: "real-estate",
      name: t("cat.realEstate"),
      icon: "ri-building-line",
      color: "from-blue-500 to-blue-700",
    },
    {
      id: "scientific-laboratory",
      name: t("cat.scientificLaboratory"),
      icon: "ri-microscope-line",
      color: "from-purple-500 to-purple-700",
    },
    {
      id: "security-protection",
      name: t("cat.securityProtection"),
      icon: "ri-shield-line",
      color: "from-red-500 to-red-700",
    },
    {
      id: "sports-entertainment",
      name: t("cat.sportsEntertainment"),
      icon: "ri-football-line",
      color: "from-green-500 to-green-700",
    },
    {
      id: "telecommunications",
      name: t("cat.telecommunications"),
      icon: "ri-phone-line",
      color: "from-blue-500 to-blue-700",
    },
    {
      id: "textiles-fabrics",
      name: t("cat.textilesFabrics"),
      icon: "ri-shirt-line",
      color: "from-teal-400 to-cyan-500",
    },
    {
      id: "toys",
      name: t("cat.toys"),
      icon: "ri-gamepad-line",
      color: "from-pink-400 to-pink-600",
    },
    {
      id: "transportation",
      name: t("cat.transportation"),
      icon: "ri-truck-line",
      color: "from-blue-600 to-blue-800",
    },
  ];
  const handleSearch = () => {
    const params = new URLSearchParams();

    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    }

    if (selectedCategory && selectedCategory !== "all") {
      params.set("category", selectedCategory);
    }

    if (location.trim()) {
      params.set("location", location.trim());
    }

    const queryString = params.toString();
    const url = queryString ? `/businesses?${queryString}` : "/businesses";
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

    // Check if user is subscribed
    const isSubscribed = localStorage.getItem("isSubscribed") === "true";
    if (!isSubscribed) {
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
      const formData = new URLSearchParams();
      const nameType = (
        document.querySelector('select[name="nameType"]') as HTMLSelectElement
      ).value;
      const category = (
        document.querySelector('select[name="category"]') as HTMLSelectElement
      ).value;
      const distance = (
        document.querySelector('select[name="distance"]') as HTMLSelectElement
      ).value;

      formData.append("nameType", nameType);
      formData.append("category", category);
      formData.append("distance", distance);
      formData.append("description", description);

      const response = await fetch(
        "https://readdy.ai/api/form/d2rfvq7frndo9ftj12l0",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData,
        }
      );

      if (response.ok) {
        setSubmitStatus("Request submitted successfully!");
        setDescription("");
        setSentenceCount(0);
        // Reset form
        (
          document.querySelector('select[name="nameType"]') as HTMLSelectElement
        ).value = "profile";
        (
          document.querySelector('select[name="category"]') as HTMLSelectElement
        ).value = "";
        (
          document.querySelector('select[name="distance"]') as HTMLSelectElement
        ).value = "";
        setTimeout(() => setSubmitStatus(""), 3000);
      } else {
        setSubmitStatus("Failed to submit request. Please try again.");
      }
    } catch (error) {
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4 md:mb-6">
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

                    <div className="relative">
                      <input
                        type="text"
                        placeholder={t("locationPlaceholder")}
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className={`w-full py-2.5 sm:py-3 md:py-4 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:outline-none text-xs sm:text-sm ${
                          isRTL
                            ? "pr-8 sm:pr-10 md:pr-12 pl-3 sm:pl-4 text-right"
                            : "pl-8 sm:pl-10 md:pl-12 pr-3 sm:pr-4"
                        }`}
                      />
                      <i
                        className={`ri-map-pin-line absolute top-1/2 transform -translate-y-1/2 text-gray-400 text-xs sm:text-sm ${
                          isRTL ? "right-3 sm:right-4" : "left-3 sm:left-4"
                        }`}
                      ></i>
                    </div>
                  </div>

                  <Link
                    href="/businesses"
                    onClick={handleSearch}
                    className="w-full bg-yellow-400 text-white py-2.5 sm:py-3 md:py-4 rounded-xl hover:bg-yellow-500 font-semibold text-sm sm:text-base md:text-lg whitespace-nowrap cursor-pointer flex items-center justify-center"
                  >
                    <i className="ri-search-line mr-1 sm:mr-2"></i>
                    {t("searchBusinesses")}
                  </Link>
                </div>

                {/* Enhanced Interactive Map Section */}
                <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-xl relative h-64 sm:h-80 md:h-[28rem] mb-3 sm:mb-4 md:mb-6">
                  {/* Interactive Map Component */}
                  <InteractiveMap
                    businesses={getFilteredBusinesses()}
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
      <FeaturedBusinesses />

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
