"use client";

import { profile } from "console";
import { useState, useEffect } from "react";
import { useAuth } from "../lib/UserContext";
import { useLanguage } from "../lib/LanguageContext";
import { apiService } from "../lib/api";

interface WorkingHours {
  open: string;
  close: string;
  closed: boolean;
}

interface BusinessData {
  name: string;
  category: string;
  businessType: string;
  description: string;
  productKeywords: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  serviceDistance: string;
  targetCustomers: string[];
  services: string[];
  categories: string[];
  workingHours: {
    monday: WorkingHours;
    tuesday: WorkingHours;
    wednesday: WorkingHours;
    thursday: WorkingHours;
    friday: WorkingHours;
    saturday: WorkingHours;
    sunday: WorkingHours;
  };
}

interface Service {
  id?: number;
  name: string;
}

interface ProductImage {
  id?: number;
  url?: string;
  image?: string;
}

export default function BusinessManagement() {
  const { user, updateUser } = useAuth();
  const { isRTL } = useLanguage();
  const [activeSection, setActiveSection] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [businessData, setBusinessData] = useState<BusinessData>({
    name: "",
    category: "",
    businessType: "",
    description: "",
    productKeywords: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    serviceDistance: "",
    targetCustomers: [],
    services: [],
    categories: [],
    workingHours: {
      monday: { open: "08:00", close: "18:00", closed: false },
      tuesday: { open: "08:00", close: "18:00", closed: false },
      wednesday: { open: "08:00", close: "18:00", closed: false },
      thursday: { open: "08:00", close: "18:00", closed: false },
      friday: { open: "08:00", close: "18:00", closed: true },
      saturday: { open: "09:00", close: "17:00", closed: false },
      sunday: { open: "10:00", close: "16:00", closed: false },
    },
  });

  const [businessImages, setBusinessImages] = useState<ProductImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [productKeywords, setProductKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");

  useEffect(() => {
    // Fetch fresh profile data directly from API
    const fetchProfileData = async () => {
      try {
        const profileData = await apiService.getProfile();
        processUserData(profileData);
      } catch (error) {
        // Fallback to auth context user data
        if (user) {
          processUserData(user);
        } else {
          setIsLoading(false);
        }
      }
    };

    fetchProfileData();

    // Listen for profile updates
    const handleProfileUpdate = () => {
      fetchProfileData();
    };

    window.addEventListener("userProfileUpdated", handleProfileUpdate);

    return () => {
      window.removeEventListener("userProfileUpdated", handleProfileUpdate);
    };
  }, [user]);

  const processUserData = (parsedUser: any) => {
    // Process keywords from API data (array format)
    let keywordsFromData: string[] = [];
    // Handle both profile data structure and auth context structure
    const keywords =
      parsedUser.productKeywords || parsedUser.profile?.productKeywords;
    if (Array.isArray(keywords)) {
      keywordsFromData = keywords;
    } else if (typeof keywords === "string") {
      keywordsFromData = keywords
        .split(",")
        .map((k: string) => k.trim())
        .filter(Boolean);
    }

    // Debug: Log the entire parsedUser object to see its structure

    // Debug: Log the profile object

    // Debug: Log the working hours from API

    // Set default working hours structure
    const defaultWorkingHours = {
      monday: { open: "09:00", close: "17:00", closed: false },
      tuesday: { open: "09:00", close: "17:00", closed: false },
      wednesday: { open: "09:00", close: "17:00", closed: false },
      thursday: { open: "09:00", close: "17:00", closed: false },
      friday: { open: "09:00", close: "17:00", closed: true },
      saturday: { open: "10:00", close: "16:00", closed: true },
      sunday: { open: "10:00", close: "16:00", closed: true },
    };

    // Get working hours from API response or use defaults
    const apiWorkingHours =
      parsedUser.workingHours || parsedUser.profile?.workingHours || {};

    // Merge API working hours with defaults
    const workingHours = {
      ...defaultWorkingHours,
      ...apiWorkingHours,
    };

    // Update business data
    setBusinessData({
      name:
        parsedUser.businessName ||
        parsedUser.profile?.businessName ||
        parsedUser.name ||
        "",
      category: parsedUser.category || parsedUser.profile?.category || "",
      businessType:
        parsedUser.businessType || parsedUser.profile?.businessType || "",
      description:
        parsedUser.description || parsedUser.profile?.description || "",
      productKeywords: keywordsFromData.join(", "),
      email: parsedUser.contactEmail || parsedUser.profile?.contactEmail || "",
      phone:
        parsedUser.contactPhone ||
        parsedUser.profile?.mainPhone ||
        parsedUser.phone ||
        "",
      website: parsedUser.website || parsedUser.profile?.website || "",
      address: parsedUser.address || parsedUser.profile?.address || "",
      serviceDistance:
        parsedUser.serviceDistance || parsedUser.profile?.serviceDistance || "",
      targetCustomers:
        parsedUser.targetCustomers || parsedUser.profile?.targetCustomers || [],
      services: parsedUser.services || parsedUser.profile?.services || [],
      categories: parsedUser.categories || parsedUser.profile?.categories || [],
      workingHours,
    });

    // Set product keywords
    setProductKeywords(keywordsFromData);
    setKeywordInput(keywordsFromData.join(", "));

    // Set product images if available
    if (Array.isArray(parsedUser.product_images)) {
      setBusinessImages(
        parsedUser.product_images.map((img: any) => ({
          id: img.id,
          url: img.image_url,
          image: img.image_url,
        }))
      );
    }

    setIsLoading(false);
  };

  const sections = [
    { id: "profile", name: "Profile", icon: "ri-information-line" },
    { id: "products", name: "Products", icon: "ri-price-tag-3-line" },
    { id: "photos", name: "Photos", icon: "ri-image-line" },
    { id: "hours", name: "Hours", icon: "ri-time-line" },
  ];

  const handleSave = async () => {
    try {
      // Get current user data to compare changes
      const currentUser = JSON.parse(
        localStorage.getItem("supplier_user") || "{}"
      );

      // Create update data with only changed fields
      const updateData: Record<string, any> = {};

      // Compare each field with original data
      const originalProfile = currentUser.profile || {};

      if (
        businessData.name !== (originalProfile.businessName || currentUser.name)
      ) {
        updateData.businessName = businessData.name;
      }

      if (businessData.category !== (originalProfile.category || "")) {
        updateData.category = businessData.category;
      }

      if (businessData.businessType !== (originalProfile.businessType || "")) {
        updateData.businessType = businessData.businessType;
      }

      if (businessData.description !== (originalProfile.description || "")) {
        updateData.description = businessData.description;
      }

      if (businessData.phone !== (originalProfile.mainPhone || "")) {
        updateData.mainPhone = businessData.phone;
      }

      if (businessData.website !== (originalProfile.website || "")) {
        updateData.website = businessData.website;
      }

      if (businessData.address !== (originalProfile.address || "")) {
        updateData.address = businessData.address;
      }

      if (
        businessData.serviceDistance !== (originalProfile.serviceDistance || "")
      ) {
        updateData.serviceDistance = businessData.serviceDistance;
      }

      // Compare product keywords (convert to array for comparison)
      const currentKeywords = businessData.productKeywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);
      const originalKeywords = Array.isArray(originalProfile.productKeywords)
        ? originalProfile.productKeywords
        : [];

      if (
        JSON.stringify(currentKeywords.sort()) !==
        JSON.stringify(originalKeywords.sort())
      ) {
        updateData.productKeywords = currentKeywords;
      }

      // Compare services
      if (
        JSON.stringify(businessData.services.sort()) !==
        JSON.stringify((originalProfile.services || []).sort())
      ) {
        updateData.services = businessData.services;
      }

      // Compare categories
      if (
        JSON.stringify(businessData.categories.sort()) !==
        JSON.stringify((originalProfile.categories || []).sort())
      ) {
        updateData.categories = businessData.categories;
      }

      // Compare working hours
      if (
        JSON.stringify(businessData.workingHours) !==
        JSON.stringify(originalProfile.workingHours || {})
      ) {
        updateData.workingHours = businessData.workingHours;
      }

      // Only include email if it has changed
      if (
        businessData.email !==
        (originalProfile.contactEmail || currentUser.email)
      ) {
        updateData.contactEmail = businessData.email;
      }

      const { apiService } = await import("../lib/api");
      const response = await apiService.updateProfile(updateData);

      // Override localStorage with the updated data
      if (response.supplier) {
        localStorage.setItem(
          "supplier_user",
          JSON.stringify(response.supplier)
        );

        // Update the auth context user state
        updateUser(response.supplier);

        // Update the component state with the new data
        processUserData(response.supplier);
      }

      setIsEditing(false);
    } catch (error) {}
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files[0]) {
      try {
        // Create FormData for the file upload
        const formData = new FormData();
        formData.append("image", files[0]);

        // Upload the image using the API
        const { apiService } = await import("../lib/api");
        const response = await apiService.uploadProductImage(formData);

        // Add the uploaded image to the state
        const newImage: ProductImage = {
          id: response.id,
          url: response.image_url,
          image: response.name,
        };
        setBusinessImages([...businessImages, newImage]);
      } catch (error) {}
    }
  };

  const removeImage = async (id: number | undefined) => {
    if (!id) return;

    try {
      // Delete the image using the API
      const { apiService } = await import("../lib/api");
      await apiService.deleteProductImage(id);

      // Remove the image from the state
      setBusinessImages(businessImages.filter((img) => img.id !== id));
    } catch (error) {}
  };

  // Categories from CompleteProfileForm
  const categories = [
    { en: "Agriculture", ar: "الزراعة" },
    { en: "Apparel & Fashion", ar: "الملابس والموضة" },
    { en: "Automobile", ar: "السيارات" },
    { en: "Brass Hardware & Components", ar: "أدوات ومكونات النحاس" },
    { en: "Business Services", ar: "الخدمات التجارية" },
    { en: "Chemicals", ar: "المواد الكيميائية" },
    { en: "Computer Hardware & Software", ar: "أجهزة وبرامج الكمبيوتر" },
    { en: "Construction & Real Estate", ar: "البناء والعقارات" },
    { en: "Consumer Electronics", ar: "الإلكترونيات الاستهلاكية" },
    {
      en: "Electronics & Electrical Supplies",
      ar: "الإلكترونيات والمستلزمات الكهربائية",
    },
    { en: "Energy & Power", ar: "الطاقة والطاقة الكهربائية" },
    { en: "Environment & Pollution", ar: "البيئة والتلوث" },
    { en: "Food & Beverage", ar: "الطعام والمشروبات" },
    { en: "Furniture", ar: "الأثاث" },
    { en: "Gifts & Crafts", ar: "الهدايا والحرف اليدوية" },
    { en: "Health & Beauty", ar: "الصحة والجمال" },
    { en: "Home Supplies", ar: "مستلزمات المنزل" },
    { en: "Home Textiles & Furnishings", ar: "منسوجات وتجهيزات المنزل" },
    { en: "Hospital & Medical Supplies", ar: "المستشفيات والمستلزمات الطبية" },
    { en: "Hotel Supplies & Equipment", ar: "مستلزمات ومعدات الفنادق" },
    { en: "Industrial Supplies", ar: "المستلزمات الصناعية" },
    { en: "Jewelry & Gemstones", ar: "المجوهرات والأحجار الكريمة" },
    { en: "Leather & Leather Products", ar: "الجلد والمنتجات الجلدية" },
    { en: "Machinery", ar: "المعدات والآلات" },
    { en: "Mineral & Metals", ar: "المعادن والمعادن" },
    { en: "Office & School Supplies", ar: "مستلزمات المكتب والمدرسة" },
    { en: "Oil and Gas", ar: "النفط والغاز" },
    { en: "Packaging & Paper", ar: "التغليف والورق" },
    { en: "Pharmaceuticals", ar: "الأدوية" },
    { en: "Pipes, Tubes & Fittings", ar: "الأنابيب والوصلات" },
    { en: "Plastics & Products", ar: "اللدائن والمنتجات" },
    { en: "Printing & Publishing", ar: "الطباعة والنشر" },
    { en: "Real Estate", ar: "العقارات" },
    {
      en: "Scientific & Laboratory Instruments",
      ar: "الأدوات العلمية والمخبرية",
    },
    { en: "Security & Protection", ar: "الأمن والحماية" },
    { en: "Sports & Entertainment", ar: "الرياضة والترفيه" },
    { en: "Telecommunications", ar: "الاتصالات" },
    { en: "Textiles & Fabrics", ar: "المنسوجات والأقمشة" },
    { en: "Toys", ar: "الألعاب" },
    { en: "Transportation", ar: "النقل" },
  ];

  const availableServices = [
    "Wholesale",
    "Retail",
    "Repair Services",
    "Custom Orders",
    "Bulk Orders",
    "Emergency Service",
    "Installation",
    "Maintenance",
    "Delivery",
    "Consulting",
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Business Management
        </h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap cursor-pointer transition-all ${
            isEditing
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-yellow-400 text-white hover:bg-yellow-500"
          }`}
        >
          <i
            className={`${isEditing ? "ri-save-line" : "ri-edit-line"} mr-2`}
          ></i>
          {isEditing ? "Save Changes" : "Edit Profile"}
        </button>
      </div>

      {/* Section Navigation */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-6 px-6">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer transition-all ${
                  activeSection === section.id
                    ? "border-yellow-400 text-yellow-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <i className={`${section.icon} mr-2`}></i>
                {section.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Basic Info Section */}
          {activeSection === "profile" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={businessData.name}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setBusinessData({ ...businessData, name: e.target.value })
                    }
                    className={`w-full px-4 py-3 border rounded-lg text-sm ${
                      isEditing
                        ? "border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={businessData.phone}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setBusinessData({
                        ...businessData,
                        phone: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-3 border rounded-lg text-sm ${
                      isEditing
                        ? "border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={businessData.email}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setBusinessData({
                        ...businessData,
                        email: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-3 border rounded-lg text-sm ${
                      isEditing
                        ? "border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={businessData.website}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setBusinessData({
                        ...businessData,
                        website: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-3 border rounded-lg text-sm ${
                      isEditing
                        ? "border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Distance
                  </label>
                  <select
                    value={businessData.serviceDistance}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setBusinessData({
                        ...businessData,
                        serviceDistance: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-3 border rounded-lg text-sm pr-8 ${
                      isEditing
                        ? "border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <option value="5 km">5 km</option>
                    <option value="10 km">10 km</option>
                    <option value="15 km">15 km</option>
                    <option value="25 km">25 km</option>
                    <option value="50 km">50 km</option>
                    <option value="100+ km">100+ km</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={businessData.address}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setBusinessData({
                      ...businessData,
                      address: e.target.value,
                    })
                  }
                  className={`w-full px-4 py-3 border rounded-lg text-sm ${
                    isEditing
                      ? "border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      : "border-gray-200 bg-gray-50"
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={businessData.description}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setBusinessData({
                      ...businessData,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                  maxLength={500}
                  className={`w-full px-4 py-3 border rounded-lg text-sm resize-none ${
                    isEditing
                      ? "border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      : "border-gray-200 bg-gray-50"
                  }`}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {businessData.description.length}/500 characters
                </p>
              </div>
            </div>
          )}

          {/* Products & Services Section */}
          {activeSection === "products" && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <div className="flex items-center space-x-3 mb-4">
                  <i className="ri-search-line text-blue-600 text-xl"></i>
                  <h3 className="text-lg font-semibold text-blue-800">
                    Search Keywords
                  </h3>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keywords
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {[
                      "wholesale supplier",
                      "retail products",
                      "bulk orders",
                      "custom solutions",
                      "premium quality",
                      "fast delivery",
                      "competitive prices",
                      "professional service",
                      "reliable partner",
                      "expert consultation",
                    ].map((keyword, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          const newKeywords: string[] =
                            productKeywords.includes(keyword)
                              ? productKeywords.filter((k) => k !== keyword)
                              : [...productKeywords, keyword];
                          setProductKeywords(newKeywords);
                          setKeywordInput(newKeywords.join(", "));
                          setBusinessData((prev) => ({
                            ...prev,
                            productKeywords: newKeywords.join(", "),
                          }));
                        }}
                        className={`px-3 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                          productKeywords.includes(keyword)
                            ? "bg-green-100 text-green-800 border border-green-300"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-blue-50 hover:border-blue-300"
                        }`}
                      >
                        {productKeywords.includes(keyword) ? (
                          <>
                            <i className="ri-check-line mr-1"></i>
                            {keyword}
                          </>
                        ) : (
                          <>
                            <i className="ri-add-line mr-1"></i>
                            {keyword}
                          </>
                        )}
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={keywordInput}
                    disabled={!isEditing}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setKeywordInput(newValue);
                      const newKeywords = newValue
                        .split(",")
                        .map((k) => k.trim())
                        .filter(Boolean);
                      setProductKeywords(newKeywords);
                      setBusinessData((prev) => ({
                        ...prev,
                        productKeywords: newKeywords.join(", "),
                      }));
                    }}
                    rows={5}
                    className={`w-full px-4 py-3 border rounded-lg text-sm resize-none ${
                      isEditing
                        ? "border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        : "border-gray-200 bg-gray-50"
                    }`}
                    placeholder="Enter keywords separated by commas..."
                  />
                  <p className="text-xs text-blue-600 mt-2">
                    <i className="ri-information-line mr-1"></i>
                    These keywords help customers find your business
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-gray-800 mb-3">
                    Current Keywords
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {productKeywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <div className="flex items-center space-x-3 mb-4">
                  <i className="ri-price-tag-3-line text-blue-600 text-xl"></i>
                  <h3 className="text-lg font-semibold text-blue-800">
                    Business Categories
                  </h3>
                </div>

                <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-white">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map((category) => (
                      <label
                        key={category.en}
                        className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={businessData.categories.some(
                            (c) => c === category.en || c === category.ar
                          )}
                          disabled={!isEditing}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setBusinessData({
                                ...businessData,
                                categories: [
                                  ...businessData.categories,
                                  category.en,
                                ],
                              });
                            } else {
                              setBusinessData({
                                ...businessData,
                                categories: businessData.categories.filter(
                                  (c) => c !== category.en && c !== category.ar
                                ),
                              });
                            }
                          }}
                          className="w-4 h-4 text-blue-400 border-gray-300 rounded focus:ring-blue-400"
                        />
                        <span className="text-sm text-gray-700">
                          {isRTL ? category.ar : category.en}
                        </span>
                      </label>
                    ))}
                  </div>
                  {categories.length > 15 && (
                    <div className="text-center py-2 text-xs text-gray-500 border-t mt-2">
                      {isRTL
                        ? `${categories.length} فئة متاحة`
                        : `${categories.length} categories available`}
                    </div>
                  )}
                </div>

                <div className="bg-white p-4 rounded-lg border border-blue-200 mt-4">
                  <h4 className="font-medium text-gray-800 mb-3">
                    Selected Categories
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {businessData.categories.map((category, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {category}
                      </span>
                    ))}
                    {businessData.categories.length === 0 && (
                      <span className="text-gray-500 text-sm">
                        No categories selected
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Services Offered
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableServices.map((service) => (
                    <label
                      key={service}
                      className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={businessData.services.some(
                          (s) => s.toLowerCase() === service.toLowerCase()
                        )}
                        disabled={!isEditing}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setBusinessData({
                              ...businessData,
                              services: [...businessData.services, service].map(
                                (s) => s.trim()
                              ),
                            });
                          } else {
                            setBusinessData({
                              ...businessData,
                              services: businessData.services.filter(
                                (s) => s.toLowerCase() !== service.toLowerCase()
                              ),
                            });
                          }
                        }}
                        className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                      />
                      <span className="text-sm text-gray-700">{service}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Photos Section */}
          {activeSection === "photos" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  Business Photos
                </h3>
                {isEditing && (
                  <label className="bg-yellow-400 text-white px-4 py-2 rounded-lg hover:bg-yellow-500 cursor-pointer font-medium text-sm whitespace-nowrap">
                    <i className="ri-add-line mr-2"></i>
                    Add Photos
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businessImages.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url || image.image || ""}
                      alt="Business photo"
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                    />
                    {isEditing && (
                      <button
                        onClick={() => removeImage(image.id)}
                        className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <i className="ri-close-line text-sm"></i>
                      </button>
                    )}
                  </div>
                ))}

                {isEditing && (
                  <label className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-yellow-400 hover:bg-yellow-50 transition-colors">
                    <i className="ri-camera-line text-gray-400 text-3xl mb-2"></i>
                    <span className="text-gray-500 text-sm">
                      Add more photos
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          )}

          {/* Working Hours Section */}
          {activeSection === "hours" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Working Hours
              </h3>

              <div className="space-y-4">
                {Object.entries(businessData.workingHours).map(
                  ([day, hours]) => (
                    <div
                      key={day}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="w-24">
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {day}
                        </span>
                      </div>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={hours.closed}
                          disabled={!isEditing}
                          onChange={(e) =>
                            setBusinessData({
                              ...businessData,
                              workingHours: {
                                ...businessData.workingHours,
                                [day]: { ...hours, closed: e.target.checked },
                              },
                            })
                          }
                          className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400 mr-2"
                        />
                        <span className="text-sm text-gray-600">Closed</span>
                      </label>

                      {!hours.closed && (
                        <div className="flex items-center space-x-2">
                          <input
                            type="time"
                            value={hours.open}
                            disabled={!isEditing}
                            onChange={(e) =>
                              setBusinessData({
                                ...businessData,
                                workingHours: {
                                  ...businessData.workingHours,
                                  [day]: { ...hours, open: e.target.value },
                                },
                              })
                            }
                            className={`px-3 py-2 border rounded focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm ${
                              isEditing
                                ? "border-gray-300"
                                : "border-gray-200 bg-gray-100"
                            }`}
                          />
                          <span className="text-gray-500">to</span>
                          <input
                            type="time"
                            value={hours.close}
                            disabled={!isEditing}
                            onChange={(e) =>
                              setBusinessData({
                                ...businessData,
                                workingHours: {
                                  ...businessData.workingHours,
                                  [day]: { ...hours, close: e.target.value },
                                },
                              })
                            }
                            className={`px-3 py-2 border rounded focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm ${
                              isEditing
                                ? "border-gray-300"
                                : "border-gray-200 bg-gray-100"
                            }`}
                          />
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <i className="ri-information-line text-yellow-600"></i>
              <span className="text-yellow-800 font-medium">
                You have unsaved changes
              </span>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm whitespace-nowrap cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium text-sm whitespace-nowrap cursor-pointer"
              >
                <i className="ri-save-line mr-2"></i>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
