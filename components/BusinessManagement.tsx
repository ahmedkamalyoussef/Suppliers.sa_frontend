"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import Link from "next/link";
import BranchManagement from "./BranchManagement";
import { useLanguage } from "./../lib/LanguageContext";
import { useAuth } from "./../hooks/useAuth";
import { apiService, type ProfileUpdateData } from "./../lib/api";
import {
  ProfileFormData,
  AdditionalPhone,
  Location,
  Errors,
  CompleteProfileFormProps,
  type Branch,
} from "./../lib/types";
import BusinessLocationMap, { findNearestCity } from "./BusinessLocationMap";

interface DayWorkingHours {
  open: string;
  close: string;
  closed: boolean;
}

interface WorkingHours {
  [key: string]: DayWorkingHours;
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
  additionalPhones: Array<{
    id: number;
    type: string;
    number: string;
    name: string;
  }>;
  location: { lat: number; lng: number };
  workingHours: {
    monday: DayWorkingHours;
    tuesday: DayWorkingHours;
    wednesday: DayWorkingHours;
    thursday: DayWorkingHours;
    friday: DayWorkingHours;
    saturday: DayWorkingHours;
    sunday: DayWorkingHours;
  };
}

interface ProductImage {
  id?: number;
  url?: string;
  image?: string;
}

// Business types with translations
const businessTypes = [
  { value: "supplier", en: "Supplier", ar: "مورد" },
  { value: "store", en: "Retail Shop", ar: "متجر" },
  { value: "office", en: "Company", ar: "مكتب" },
  { value: "individual", en: "Individual Establishment", ar: "فرد" },
];

// Target customer options with translations
const targetCustomerOptions = [
  { en: "Large Organizations", ar: "المنظمات الكبيرة" },
  { en: "Small Businesses", ar: "الشركات الصغيرة" },
  { en: "Individuals", ar: "الأفراد" },
];

// Service distance options with translations
const serviceDistanceOptions = [
  { en: "5 km", ar: "5 كم" },
  { en: "10 km", ar: "10 كم" },
  { en: "15 km", ar: "15 كم" },
  { en: "25 km", ar: "25 كم" },
  { en: "50 km", ar: "50 كم" },
  { en: "100+ km", ar: "100+ كم" },
];

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

interface BusinessManagementProps {
  locationData?: {
    lat: number;
    lng: number;
  } | null;
}

export default function BusinessManagement({
  locationData,
}: BusinessManagementProps = {}) {
  const { user } = useAuth();
  const { isRTL } = useLanguage();
  const [activeSection, setActiveSection] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);

  // File upload state
  const [verificationFile, setVerificationFile] = useState<File | null>(null);
  const [isUploadingVerification, setIsUploadingVerification] = useState(false);

  const workingHoursInputRefs = useRef<
    Record<
      string,
      { open?: HTMLInputElement | null; close?: HTMLInputElement | null }
    >
  >({});

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
    additionalPhones: [
      { id: 1, type: "Sales Representative", number: "", name: "" },
    ],
    location: { lat: 24.7136, lng: 46.6753 },
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

  // Helper functions
  const getTranslatedText = (
    items: Array<{ en: string; ar: string }>,
    value: string
  ): string => {
    const item = items.find((item) => item.en === value);
    return item ? item[isRTL ? "ar" : "en"] : value;
  };

  const getTranslatedTextWithValue = (
    items: Array<{ value: string; en: string; ar: string }>,
    value: string
  ): string => {
    const item = items.find((item) => item.value === value);
    if (!item) return value;
    return item[isRTL ? "ar" : "en"] as string;
  };

  // File upload handler
  const handleVerificationUpload = async () => {
    if (!verificationFile) return;

    setIsUploadingVerification(true);
    try {
      const formData = new FormData();
      formData.append("document", verificationFile);

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        }/api/supplier/documents`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("supplier_token")}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Verification uploaded successfully:", result);
        // Show success message
        alert(
          "Document uploaded successfully! It will be reviewed by our team."
        );
      } else {
        const error = await response.json();
        console.error("Upload failed:", error);
        alert(`Upload failed: ${error.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploadingVerification(false);
    }
  };

  // Business types with translations (like CompleteProfileForm)
  const businessTypes = [
    { value: "supplier", en: "Supplier", ar: "مورد" },
    { value: "store", en: "Retail Shop", ar: "متجر" },
    { value: "office", en: "Company", ar: "مكتب" },
    { value: "individual", en: "Individual Establishment", ar: "منشأة فردية" },
  ];

  const getBusinessTypeIcon = (type: string): string => {
    switch (type) {
      case "supplier":
        return "ri-truck-line";
      case "store":
        return "ri-store-2-line";
      case "office":
        return "ri-building-line";
      case "individual":
        return "ri-user-3-line";
      default:
        return "ri-briefcase-line";
    }
  };

  // Phone types with translations (like CompleteProfileForm)
  const phoneTypes = [
    "Sales Representative",
    "Procurement",
    "Technical Support",
    "Customer Service",
    "General Inquiry",
  ];

  const handleTargetCustomerToggle = (customer: string) => {
    console.log("Toggling customer:", customer);
    console.log("Current target customers:", businessData.targetCustomers);

    const englishCustomer =
      targetCustomerOptions.find(
        (opt) => opt.en === customer || opt.ar === customer
      )?.en || customer;

    const newCustomers = businessData.targetCustomers.includes(englishCustomer)
      ? businessData.targetCustomers.filter((c) => c !== englishCustomer)
      : [...businessData.targetCustomers, englishCustomer];

    console.log("New target customers:", newCustomers);

    setBusinessData({
      ...businessData,
      targetCustomers: newCustomers,
    });
  };

  const handleAddPhone = () => {
    if (businessData.additionalPhones.length < 4) {
      setBusinessData({
        ...businessData,
        additionalPhones: [
          ...businessData.additionalPhones,
          {
            id: Date.now(),
            type: "Sales Representative",
            number: "",
            name: "",
          },
        ],
      });
    }
  };

  const handleRemovePhone = (id: number) => {
    setBusinessData({
      ...businessData,
      additionalPhones: businessData.additionalPhones.filter(
        (phone) => phone.id !== id
      ),
    });
  };

  const handlePhoneChange = (
    id: number,
    field: "type" | "number" | "name",
    value: string
  ) => {
    const updatedPhones = businessData.additionalPhones.map((phone) =>
      phone.id === id ? { ...phone, [field]: value } : phone
    );

    setBusinessData({
      ...businessData,
      additionalPhones: updatedPhones,
    });
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const profileData = await apiService.getProfile();
        processUserData(profileData);
      } catch (error) {
        if (user) {
          processUserData(user);
        } else {
          setIsLoading(false);
        }
      }
    };

    fetchProfileData();

    const handleProfileUpdate = () => {
      fetchProfileData();
    };

    window.addEventListener("userProfileUpdated", handleProfileUpdate);

    return () => {
      window.removeEventListener("userProfileUpdated", handleProfileUpdate);
    };
  }, [user]);

  const processUserData = (parsedUser: any) => {
    console.log("Processing user data:", parsedUser);
    console.log("Services from parsedUser.services:", parsedUser.services);
    console.log(
      "Services from parsedUser.profile?.services:",
      parsedUser.profile?.services
    );
    console.log(
      "Services from parsedUser.profile?.services_offered:",
      parsedUser.profile?.services_offered
    );

    let keywordsFromData: string[] = [];
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

    const defaultWorkingHours = {
      monday: { open: "09:00", close: "17:00", closed: false },
      tuesday: { open: "09:00", close: "17:00", closed: false },
      wednesday: { open: "09:00", close: "17:00", closed: false },
      thursday: { open: "09:00", close: "17:00", closed: false },
      friday: { open: "09:00", close: "17:00", closed: true },
      saturday: { open: "10:00", close: "16:00", closed: true },
      sunday: { open: "10:00", close: "16:00", closed: true },
    };

    const apiWorkingHours =
      parsedUser.workingHours || parsedUser.profile?.workingHours || {};

    const workingHours = {
      ...defaultWorkingHours,
      ...apiWorkingHours,
    };

    // Fix: Handle targetCustomers properly - convert from string to array if needed
    let targetCustomersFromData: string[] = [];

    // Check multiple possible fields for target customers
    const targetCustomersRaw =
      parsedUser.targetCustomers ||
      parsedUser.profile?.targetCustomers ||
      parsedUser.whoDoYouServe ||
      parsedUser.profile?.whoDoYouServe ||
      [];

    console.log(
      "Raw target customers data:",
      targetCustomersRaw,
      typeof targetCustomersRaw
    );

    if (typeof targetCustomersRaw === "string") {
      // If it's a string, split by comma and clean
      targetCustomersFromData = targetCustomersRaw
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    } else if (Array.isArray(targetCustomersRaw)) {
      // If it's an array, check if it contains strings or mixed data
      if (
        targetCustomersRaw.length > 0 &&
        typeof targetCustomersRaw[0] === "string"
      ) {
        // Check if the first element contains commas (indicating it needs splitting)
        if (targetCustomersRaw[0].includes(",")) {
          // Split the first element by comma
          targetCustomersFromData = targetCustomersRaw[0]
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        } else {
          // Use the array as is
          targetCustomersFromData = targetCustomersRaw;
        }
      } else {
        // Use the array as is
        targetCustomersFromData = targetCustomersRaw;
      }
    }

    console.log("Processed target customers:", targetCustomersFromData);

    const businessDataToSet = {
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
      targetCustomers: targetCustomersFromData,
      services:
        parsedUser.services ||
        parsedUser.profile?.services ||
        parsedUser.profile?.services_offered ||
        [],
    };

    console.log("Final services being set:", businessDataToSet.services);

    const categories =
      parsedUser.categories || parsedUser.profile?.categories || [];
    const additionalPhones = parsedUser.additionalPhones ||
      parsedUser.profile?.additionalPhones || [
        { id: 1, type: "Sales Representative", number: "", name: "" },
      ];

    const location = locationData ||
      parsedUser.location ||
      parsedUser.profile?.location || { lat: 24.7136, lng: 46.6753 };

    const businessDataToSetFinal = {
      ...businessDataToSet,
      categories,
      additionalPhones,
      location,
      workingHours,
    };

    setBusinessData(businessDataToSetFinal);

    setProductKeywords(keywordsFromData);
    setKeywordInput(keywordsFromData.join(", "));

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
    { id: "profile", name: "Basic Info", icon: "ri-user-line" },
    { id: "details", name: "Business Details", icon: "ri-briefcase-line" },
    { id: "location", name: "Location", icon: "ri-map-pin-line" },
    { id: "photos", name: "Photos", icon: "ri-image-line" },
    { id: "hours", name: "Hours", icon: "ri-time-line" },
    {
      id: "verification",
      name: "Submit Verification",
      icon: "ri-shield-check-line",
    },
  ];

  const handleWorkingHoursChange = (
    day: keyof typeof businessData.workingHours,
    field: "open" | "close" | "closed",
    value: string | boolean
  ): void => {
    setBusinessData((prev) => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day],
          [field]: value,
        },
      },
    }));
  };

  const applyWorkingHoursToAllDays = (
    sourceDay: keyof typeof businessData.workingHours
  ) => {
    setBusinessData((prev) => {
      const source = prev.workingHours[sourceDay];
      return {
        ...prev,
        workingHours: Object.keys(prev.workingHours).reduce((acc, dayKey) => {
          const day = dayKey as keyof typeof prev.workingHours;
          acc[day] = { ...source };
          return acc;
        }, {} as typeof prev.workingHours),
      };
    });
  };

  const applyWorkingHoursToNextDays = (
    sourceDay: keyof typeof businessData.workingHours
  ) => {
    const dayOrder: Array<keyof typeof businessData.workingHours> = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    setBusinessData((prev) => {
      const source = prev.workingHours[sourceDay];
      const startIndex = dayOrder.indexOf(sourceDay);
      if (startIndex < 0) return prev;

      const next = { ...prev.workingHours };
      for (let i = startIndex + 1; i < dayOrder.length; i++) {
        const d = dayOrder[i];
        next[d] = { ...source };
      }

      return { ...prev, workingHours: next };
    });
  };

  const handleSave = async () => {
    try {
      const currentUser = JSON.parse(
        localStorage.getItem("supplier_user") || "{}"
      );

      const updateData: Record<string, any> = {};
      const originalProfile = currentUser.profile || {};

      console.log("Current business data:", businessData);
      console.log("Original profile:", originalProfile);

      // Fix: Check multiple possible fields for name and send as businessName
      const originalName =
        originalProfile.businessName ||
        originalProfile.name ||
        currentUser.name ||
        "";
      if (businessData.name !== originalName) {
        updateData.businessName = businessData.name;
      }

      if (businessData.category !== (originalProfile.category || "")) {
        updateData.category = businessData.category;
      }

      // Fix: Send businessType in lowercase like CompleteProfileForm
      if (businessData.businessType !== (originalProfile.businessType || "")) {
        updateData.businessType = businessData.businessType.toLowerCase();
      }

      if (businessData.description !== (originalProfile.description || "")) {
        updateData.description = businessData.description;
      }

      // Fix: Check multiple possible fields for phone
      const originalPhone =
        originalProfile.mainPhone ||
        originalProfile.contactPhone ||
        originalProfile.phone ||
        "";
      if (businessData.phone !== originalPhone) {
        updateData.mainPhone = businessData.phone;
      }

      if (businessData.website !== (originalProfile.website || "")) {
        updateData.website = businessData.website;
      }

      if (businessData.address !== (originalProfile.address || "")) {
        updateData.address = businessData.address;
      }

      // Fix: Send serviceDistance as string like CompleteProfileForm
      if (
        businessData.serviceDistance !== (originalProfile.serviceDistance || "")
      ) {
        updateData.serviceDistance = businessData.serviceDistance.toString();
      }

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

      if (
        JSON.stringify(businessData.services.sort()) !==
        JSON.stringify(
          (
            originalProfile.services ||
            originalProfile.services_offered ||
            []
          ).sort()
        )
      ) {
        updateData.services = businessData.services;
      }

      if (
        JSON.stringify(businessData.categories.sort()) !==
        JSON.stringify((originalProfile.categories || []).sort())
      ) {
        updateData.categories = businessData.categories;
      }

      if (
        JSON.stringify(businessData.workingHours) !==
        JSON.stringify(originalProfile.workingHours || {})
      ) {
        updateData.workingHours = businessData.workingHours;
      }

      // Fix: Better target customers comparison and send as string like CompleteProfileForm
      const currentTargetCustomers = Array.isArray(businessData.targetCustomers)
        ? businessData.targetCustomers
        : [];
      const originalTargetCustomers = Array.isArray(
        originalProfile.targetCustomers
      )
        ? originalProfile.targetCustomers
        : [];

      console.log("Current target customers:", currentTargetCustomers);
      console.log("Original target customers:", originalTargetCustomers);
      console.log(
        "Are they different?",
        JSON.stringify(currentTargetCustomers.sort()) !==
          JSON.stringify(originalTargetCustomers.sort())
      );

      // Send as string to match backend expectation (like CompleteProfileForm)
      if (
        JSON.stringify(currentTargetCustomers.sort()) !==
        JSON.stringify(originalTargetCustomers.sort())
      ) {
        updateData.whoDoYouServe = currentTargetCustomers.join(", ");
        console.log(
          "Adding whoDoYouServe to updateData:",
          currentTargetCustomers.join(", ")
        );
      }

      console.log("Services comparison:");
      console.log("Current services:", businessData.services);
      console.log(
        "Original services:",
        originalProfile.services || originalProfile.services_offered || []
      );

      if (
        JSON.stringify(businessData.additionalPhones) !==
        JSON.stringify(originalProfile.additionalPhones || [])
      ) {
        updateData.additionalPhones = businessData.additionalPhones;
      }

      // Fix: Better location comparison
      const currentLocation = {
        lat: parseFloat(String(businessData.location.lat)) || 24.7136,
        lng: parseFloat(String(businessData.location.lng)) || 46.6753,
      };
      const originalLocation = originalProfile.location || {
        lat: 24.7136,
        lng: 46.6753,
      };

      if (
        currentLocation.lat !== originalLocation.lat ||
        currentLocation.lng !== originalLocation.lng
      ) {
        updateData.location = currentLocation;
      }

      if (
        businessData.email !==
        (originalProfile.contactEmail || currentUser.email)
      ) {
        updateData.contactEmail = businessData.email;
      }

      console.log("Update data to send:", updateData);

      const { apiService } = await import("../lib/api");
      const response = await apiService.updateProfile(updateData);

      console.log("API response:", response);

      if (response.supplier) {
        // Update localStorage with the new data
        localStorage.setItem(
          "supplier_user",
          JSON.stringify(response.supplier)
        );

        // Process the updated data to refresh the component state
        console.log("Processing updated user data:", response.supplier);
        processUserData(response.supplier);
      } else {
        // If no structured response, fetch fresh data
        console.log("No structured response, fetching fresh data...");
        const freshData = await apiService.getProfile();
        processUserData(freshData);
      }

      setIsEditing(false);

      // Trigger dashboard refresh to show changes immediately
      window.dispatchEvent(
        new CustomEvent("userProfileUpdated", {
          detail: { message: "Profile updated successfully" },
        })
      );

      // Also trigger a general data refresh event
      window.dispatchEvent(
        new CustomEvent("dataRefresh", {
          detail: { section: "businessProfile" },
        })
      );
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files[0]) {
      try {
        const formData = new FormData();
        formData.append("image", files[0]);

        const response = await apiService.uploadProductImage(formData);

        const newImage: ProductImage = {
          id: response.id,
          url: response.image_url,
          image: response.name,
        };
        setBusinessImages([...businessImages, newImage]);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const removeImage = async (id: number | undefined) => {
    if (!id) return;

    try {
      await apiService.deleteProductImage(id);
      setBusinessImages(businessImages.filter((img) => img.id !== id));
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

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
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
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
                    className={`w-full px-4 py-3 border rounded-lg text-sm ${
                      isEditing
                        ? "border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <option value="">Select distance</option>
                    {serviceDistanceOptions.map((distance) => (
                      <option key={distance.en} value={distance.en}>
                        {getTranslatedText(serviceDistanceOptions, distance.en)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Who do you serve?
                </label>
                <div className="space-y-2">
                  {targetCustomerOptions.map((customer) => {
                    const isSelected = businessData.targetCustomers.includes(
                      customer.en
                    );
                    console.log(
                      `Checking ${customer.en}:`,
                      isSelected,
                      "in",
                      businessData.targetCustomers
                    );

                    return (
                      <label
                        key={customer.en}
                        className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all ${
                          isSelected
                            ? "border-yellow-400 bg-yellow-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() =>
                            handleTargetCustomerToggle(customer.en)
                          }
                          disabled={!isEditing}
                          className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                        />
                        <span className="text-sm text-gray-700">
                          {getTranslatedText(
                            targetCustomerOptions,
                            customer.en
                          )}
                        </span>
                      </label>
                    );
                  })}
                </div>
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

              {/* Additional Phone Numbers Section */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Additional Phone Numbers (Optional)
                  </label>
                  {isEditing && businessData.additionalPhones.length < 4 && (
                    <button
                      type="button"
                      onClick={handleAddPhone}
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                    >
                      <i className="ri-add-line mr-1"></i>
                      Add Phone
                    </button>
                  )}
                </div>

                <p className="text-xs text-gray-600 mb-3">
                  Add additional contact numbers for different departments or
                  services
                </p>

                <div className="space-y-2 md:space-y-3">
                  {businessData.additionalPhones.map((phone) => (
                    <div
                      key={phone.id}
                      className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <select
                          value={phone.type}
                          disabled={!isEditing}
                          onChange={(e) =>
                            handlePhoneChange(phone.id, "type", e.target.value)
                          }
                          className="w-full px-2 md:px-3 py-1 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm pr-8"
                        >
                          {phoneTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <input
                          type="tel"
                          value={phone.number}
                          disabled={!isEditing}
                          onChange={(e) =>
                            handlePhoneChange(
                              phone.id,
                              "number",
                              e.target.value
                            )
                          }
                          className="w-full px-2 md:px-3 py-1 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                          placeholder="+966 50 123 4567"
                        />
                      </div>

                      <div className="flex items-center space-x-1 md:space-x-2">
                        <input
                          type="text"
                          value={phone.name}
                          disabled={!isEditing}
                          onChange={(e) =>
                            handlePhoneChange(phone.id, "name", e.target.value)
                          }
                          className="flex-1 px-2 md:px-3 py-1 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                          placeholder="Contact Name"
                        />
                        {isEditing &&
                          businessData.additionalPhones.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemovePhone(phone.id)}
                              className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer"
                            >
                              <i className="ri-close-line text-sm md:text-base"></i>
                            </button>
                          )}
                      </div>
                    </div>
                  ))}
                </div>

                {businessData.additionalPhones.length === 0 && (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <i className="ri-phone-line text-gray-400 text-2xl mb-2"></i>
                    <p className="text-gray-600 text-sm mb-3">
                      No additional phone numbers added
                    </p>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={handleAddPhone}
                        className="bg-yellow-400 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg hover:bg-yellow-500 text-xs md:text-sm font-medium whitespace-nowrap cursor-pointer"
                      >
                        <i className="ri-add-line mr-1 md:mr-2"></i>
                        Add First Phone Number
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Business Details Section */}
          {activeSection === "details" && (
            <div className="space-y-6">
              <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                <div className="flex items-center space-x-3 mb-4">
                  <i className="ri-briefcase-line text-yellow-600 text-xl"></i>
                  <h3 className="text-lg font-semibold text-yellow-800">
                    Business Type
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                  {businessTypes.map((type) => (
                    <label
                      key={type.value}
                      className={`flex items-center space-x-2 md:space-x-3 p-3 md:p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        businessData.businessType === type.value
                          ? "border-yellow-400 bg-yellow-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="businessType"
                        value={type.value}
                        checked={businessData.businessType === type.value}
                        onChange={(e) =>
                          setBusinessData({
                            ...businessData,
                            businessType: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className="w-4 h-4 text-yellow-400 border-gray-300 focus:ring-yellow-400"
                      />
                      <i
                        className={`${getBusinessTypeIcon(
                          type.value
                        )} text-base md:text-lg text-gray-600`}
                      ></i>
                      <span className="text-sm md:text-base text-gray-700">
                        {getTranslatedTextWithValue(businessTypes, type.value)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <div className="flex items-center space-x-3 mb-4">
                  <i className="ri-search-line text-green-600 text-xl"></i>
                  <h3 className="text-lg font-semibold text-green-800">
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
                          if (!isEditing) return;
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
                        disabled={!isEditing}
                        className={`px-3 py-2 rounded-full text-xs font-medium transition-all ${
                          isEditing ? "cursor-pointer" : "cursor-not-allowed"
                        } ${
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

                <div className="bg-white p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium text-gray-800 mb-3">
                    Current Keywords
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {productKeywords.length > 0 ? (
                      productKeywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {keyword}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">
                        No keywords added yet
                      </span>
                    )}
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
                </div>

                <div className="bg-white p-4 rounded-lg border border-blue-200 mt-4">
                  <h4 className="font-medium text-gray-800 mb-3">
                    Selected Categories
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {businessData.categories.length > 0 ? (
                      businessData.categories.map((category, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {category}
                        </span>
                      ))
                    ) : (
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
                              services: [...businessData.services, service],
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

          {/* Location Section */}
          {activeSection === "location" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Location
                </label>
                <div
                  className={`rounded-lg overflow-hidden border ${
                    isEditing ? "border-gray-300" : "border-gray-200"
                  }`}
                >
                  <BusinessLocationMap
                    selectedLocation={businessData.location}
                    isEditing={isEditing}
                    setSelectedLocation={(location) => {
                      console.log("Location updated:", location);
                      // Update address automatically based on nearest city
                      const nearestCity = findNearestCity(
                        location.lat,
                        location.lng
                      );
                      console.log("Nearest city found:", nearestCity);
                      setBusinessData({
                        ...businessData,
                        location,
                        address: nearestCity.name,
                      });
                    }}
                  />
                  <div className="mt-2 p-2 bg-blue-50 rounded">
                    <p className="text-xs text-blue-600">
                      Debug: Current location from DB:{" "}
                      {businessData.location.lat}, {businessData.location.lng}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Click on the map to update your business location
                </p>

                {/* Display current coordinates */}
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Current Location:</strong>
                  </p>
                  <p className="text-xs text-gray-500">
                    Latitude: {businessData.location.lat}
                  </p>
                  <p className="text-xs text-gray-500">
                    Longitude: {businessData.location.lng}
                  </p>
                  <p className="text-xs text-gray-500">
                    Address: {businessData.address}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Products Section */}
          {activeSection === "products" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-200">
                <div className="flex items-center space-x-3 mb-4">
                  <i className="ri-shopping-bag-line text-purple-600 text-xl"></i>
                  <h3 className="text-lg font-semibold text-purple-800">
                    Product Information
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Manage your product keywords and categories to help customers
                  find your business.
                </p>
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

              {businessImages.length === 0 && !isEditing && (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <i className="ri-image-line text-gray-400 text-4xl mb-3"></i>
                  <p className="text-gray-600">No photos added yet</p>
                </div>
              )}
            </div>
          )}

          {/* Working Hours Section */}
          {activeSection === "hours" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Working Hours
                  </h3>
                  <p className="text-sm text-gray-600">
                    Set your business operating hours for each day
                  </p>
                </div>
                {!isEditing && (
                  <div className="p-3 bg-yellow-100 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <i className="ri-lock-line text-yellow-600"></i>
                      <span className="text-sm text-yellow-800 font-medium">
                        Click 'Edit Profile' to modify working hours
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1 md:space-y-2">
                {Object.keys(businessData.workingHours).map((day) => (
                  <div
                    key={day}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-2 bg-white rounded-lg border border-gray-200 gap-1 md:gap-2"
                  >
                    <div className="w-16">
                      <span className="text-xs font-medium text-gray-700 capitalize">
                        {day}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          applyWorkingHoursToNextDays(
                            day as keyof typeof businessData.workingHours
                          )
                        }
                        disabled={!isEditing}
                        className="text-[10px] md:text-xs px-1.5 py-0.5 rounded border border-gray-200 text-gray-700 hover:bg-gray-50 whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Copy to Next
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          applyWorkingHoursToAllDays(
                            day as keyof typeof businessData.workingHours
                          )
                        }
                        disabled={!isEditing}
                        className="text-[10px] md:text-xs px-1.5 py-0.5 rounded border border-gray-200 text-gray-700 hover:bg-gray-50 whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Apply to All
                      </button>
                    </div>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={
                          businessData.workingHours[
                            day as keyof typeof businessData.workingHours
                          ].closed
                        }
                        onChange={(e) =>
                          handleWorkingHoursChange(
                            day as keyof typeof businessData.workingHours,
                            "closed",
                            e.target.checked
                          )
                        }
                        disabled={!isEditing}
                        className="w-3 h-3 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400 mr-1 disabled:opacity-50"
                      />
                      <span className="text-xs text-gray-600">Closed</span>
                    </label>

                    {!businessData.workingHours[
                      day as keyof typeof businessData.workingHours
                    ].closed && (
                      <div className="flex items-center space-x-1 md:space-x-2">
                        <input
                          type="time"
                          ref={(el) => {
                            if (workingHoursInputRefs.current[day]) {
                              workingHoursInputRefs.current[day].open = el;
                            } else {
                              workingHoursInputRefs.current[day] = { open: el };
                            }
                          }}
                          value={
                            businessData.workingHours[
                              day as keyof typeof businessData.workingHours
                            ].open
                          }
                          onChange={(e) =>
                            handleWorkingHoursChange(
                              day as keyof typeof businessData.workingHours,
                              "open",
                              e.target.value
                            )
                          }
                          disabled={!isEditing}
                          onKeyDown={(e) => {
                            if (e.key === "ArrowRight") {
                              e.preventDefault();
                              workingHoursInputRefs.current[
                                day
                              ]?.close?.focus();
                              return;
                            }
                            if (e.key === "ArrowLeft") {
                              e.preventDefault();
                              const dayOrder: Array<
                                keyof typeof businessData.workingHours
                              > = [
                                "monday",
                                "tuesday",
                                "wednesday",
                                "thursday",
                                "friday",
                                "saturday",
                                "sunday",
                              ];
                              const currentIndex = dayOrder.indexOf(
                                day as keyof typeof businessData.workingHours
                              );
                              if (currentIndex > 0) {
                                const prevDay = dayOrder[currentIndex - 1];
                                workingHoursInputRefs.current[
                                  prevDay
                                ]?.close?.focus();
                              }
                              return;
                            }
                            if (e.key === "ArrowDown") {
                              e.preventDefault();
                              const dayOrder: Array<
                                keyof typeof businessData.workingHours
                              > = [
                                "monday",
                                "tuesday",
                                "wednesday",
                                "thursday",
                                "friday",
                                "saturday",
                                "sunday",
                              ];
                              const currentIndex = dayOrder.indexOf(
                                day as keyof typeof businessData.workingHours
                              );
                              if (currentIndex < dayOrder.length - 1) {
                                const nextDay = dayOrder[currentIndex + 1];
                                workingHoursInputRefs.current[
                                  nextDay
                                ]?.open?.focus();
                              }
                              return;
                            }
                            if (e.key === "ArrowUp") {
                              e.preventDefault();
                              const dayOrder: Array<
                                keyof typeof businessData.workingHours
                              > = [
                                "monday",
                                "tuesday",
                                "wednesday",
                                "thursday",
                                "friday",
                                "saturday",
                                "sunday",
                              ];
                              const currentIndex = dayOrder.indexOf(
                                day as keyof typeof businessData.workingHours
                              );
                              if (currentIndex > 0) {
                                const prevDay = dayOrder[currentIndex - 1];
                                workingHoursInputRefs.current[
                                  prevDay
                                ]?.open?.focus();
                              }
                              return;
                            }
                            if (e.key === "Enter") {
                              e.preventDefault();
                              workingHoursInputRefs.current[
                                day
                              ]?.close?.focus();
                              return;
                            }
                          }}
                          className={`px-2 py-1 border rounded text-xs focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${
                            isEditing
                              ? "border-gray-300"
                              : "border-gray-200 bg-gray-100"
                          } disabled:opacity-50`}
                        />
                        <span className="text-gray-500 text-xs">to</span>
                        <input
                          type="time"
                          ref={(el) => {
                            if (workingHoursInputRefs.current[day]) {
                              workingHoursInputRefs.current[day].close = el;
                            } else {
                              workingHoursInputRefs.current[day] = {
                                close: el,
                              };
                            }
                          }}
                          value={
                            businessData.workingHours[
                              day as keyof typeof businessData.workingHours
                            ].close
                          }
                          onChange={(e) =>
                            handleWorkingHoursChange(
                              day as keyof typeof businessData.workingHours,
                              "close",
                              e.target.value
                            )
                          }
                          disabled={!isEditing}
                          onKeyDown={(e) => {
                            if (e.key === "ArrowLeft") {
                              e.preventDefault();
                              workingHoursInputRefs.current[day]?.open?.focus();
                              return;
                            }
                            if (e.key === "ArrowRight") {
                              e.preventDefault();
                              const dayOrder: Array<
                                keyof typeof businessData.workingHours
                              > = [
                                "monday",
                                "tuesday",
                                "wednesday",
                                "thursday",
                                "friday",
                                "saturday",
                                "sunday",
                              ];
                              const currentIndex = dayOrder.indexOf(
                                day as keyof typeof businessData.workingHours
                              );
                              if (currentIndex < dayOrder.length - 1) {
                                const nextDay = dayOrder[currentIndex + 1];
                                workingHoursInputRefs.current[
                                  nextDay
                                ]?.open?.focus();
                              }
                              return;
                            }
                            if (e.key === "ArrowDown") {
                              e.preventDefault();
                              const dayOrder: Array<
                                keyof typeof businessData.workingHours
                              > = [
                                "monday",
                                "tuesday",
                                "wednesday",
                                "thursday",
                                "friday",
                                "saturday",
                                "sunday",
                              ];
                              const currentIndex = dayOrder.indexOf(
                                day as keyof typeof businessData.workingHours
                              );
                              if (currentIndex < dayOrder.length - 1) {
                                const nextDay = dayOrder[currentIndex + 1];
                                workingHoursInputRefs.current[
                                  nextDay
                                ]?.close?.focus();
                              }
                              return;
                            }
                            if (e.key === "ArrowUp") {
                              e.preventDefault();
                              const dayOrder: Array<
                                keyof typeof businessData.workingHours
                              > = [
                                "monday",
                                "tuesday",
                                "wednesday",
                                "thursday",
                                "friday",
                                "saturday",
                                "sunday",
                              ];
                              const currentIndex = dayOrder.indexOf(
                                day as keyof typeof businessData.workingHours
                              );
                              if (currentIndex > 0) {
                                const prevDay = dayOrder[currentIndex - 1];
                                workingHoursInputRefs.current[
                                  prevDay
                                ]?.close?.focus();
                              }
                              return;
                            }
                            if (e.key === "Enter") {
                              e.preventDefault();
                              const dayOrder: Array<
                                keyof typeof businessData.workingHours
                              > = [
                                "monday",
                                "tuesday",
                                "wednesday",
                                "thursday",
                                "friday",
                                "saturday",
                                "sunday",
                              ];
                              const currentIndex = dayOrder.indexOf(
                                day as keyof typeof businessData.workingHours
                              );
                              if (currentIndex < dayOrder.length - 1) {
                                const nextDay = dayOrder[currentIndex + 1];
                                workingHoursInputRefs.current[
                                  nextDay
                                ]?.open?.focus();
                              }
                              return;
                            }
                          }}
                          className={`px-2 py-1 border rounded text-xs focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${
                            isEditing
                              ? "border-gray-300"
                              : "border-gray-200 bg-gray-100"
                          } disabled:opacity-50`}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {isEditing && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="ri-information-line text-blue-600 text-xs"></i>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-blue-800 mb-1">
                        Working Hours Tips
                      </h4>
                      <ul className="text-xs text-blue-700 space-y-1">
                        <li>
                          • Use "Copy to Next" to apply hours to following days
                        </li>
                        <li>
                          • Use "Apply to All" to set same hours for all days
                        </li>
                        <li>
                          • Mark days as "Closed" when you're not available
                        </li>
                        <li>• Use arrow keys to navigate between fields</li>
                        <li>• Press Enter to move to the next field</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSection === "verification" && (
            <div className="space-y-6">
              <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                <div className="flex items-center space-x-3 mb-4">
                  <i className="ri-shield-check-line text-yellow-600 text-2xl"></i>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Business Verification Required
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Upload your Commercial Registration to verify your
                      business legitimacy
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <i className="ri-check-line text-green-600 mt-1"></i>
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            Why is this required?
                          </h4>
                          <p className="text-sm text-gray-600">
                            Ensures only legitimate businesses are listed on our
                            platform
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <i className="ri-check-line text-green-600 mt-1"></i>
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            Builds trust with customers
                          </h4>
                          <p className="text-sm text-gray-600">
                            Verified businesses get more customer inquiries
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-4">
                    Commercial Registration Document *
                  </h4>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <input
                      type="file"
                      ref={(el) => {
                        if (el && el.files && el.files[0]) {
                          setVerificationFile(el.files[0]);
                        }
                      }}
                      accept=".jpg,.jpeg,.png,.pdf"
                      className="hidden"
                      disabled={!isEditing}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setVerificationFile(e.target.files[0]);
                        }
                      }}
                    />
                    <p className="text-gray-600 mb-4">
                      Upload your Commercial Registration
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      Supported formats: JPG, PNG, PDF (Max 5MB)
                    </p>
                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={() => {
                          const fileInput = document.querySelector(
                            'input[type="file"]'
                          ) as HTMLInputElement;
                          fileInput?.click();
                        }}
                        disabled={!isEditing}
                        className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {verificationFile
                          ? `Selected: ${verificationFile.name}`
                          : "Choose File"}
                      </button>
                      <button
                        type="button"
                        onClick={handleVerificationUpload}
                        disabled={
                          !verificationFile ||
                          isUploadingVerification ||
                          !isEditing
                        }
                        className="w-full bg-yellow-400 text-white py-3 px-6 rounded-lg hover:bg-yellow-500 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isUploadingVerification
                          ? "Uploading..."
                          : "Upload Document"}
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <h4 className="font-semibold text-gray-800">
                      What happens next?
                    </h4>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                      <li>
                        Your document will be reviewed by our verification team
                      </li>
                      <li>
                        You'll receive a notification about verification status
                      </li>
                      <li>Once approved, your business profile will go live</li>
                    </ol>
                    <p className="text-xs text-gray-500 mt-4">
                      Verification typically takes 1-2 business days
                    </p>
                  </div>
                </div>
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
