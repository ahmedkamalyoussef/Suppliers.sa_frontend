"use client";

import { SetStateAction, useEffect, useState, useRef } from "react";
import Link from "next/link";
import BranchManagement from "./BranchManagement";
import { useLanguage } from "./../lib/LanguageContext";
import { apiService, type ProfileUpdateData } from "./../lib/api";
import {
  ProfileFormData,
  AdditionalPhone,
  Location,
  Errors,
  CompleteProfileFormProps,
  type Branch,
} from "./../lib/types";
import BusinessLocationMap from "./BusinessLocationMap";

// Specific category options for the dropdown
const categoryOptions = [
  { en: "Electronics", ar: "إلكترونيات" },
  { en: "Printing", ar: "طباعة" },
  { en: "Furniture", ar: "أثاث" },
  { en: "Technology", ar: "تكنولوجيا" },
];

// Categories with translations
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

// Business types with translations
const businessTypes = [
  { en: "Supplier", ar: "مورد" },
  { en: "Store", ar: "متجر" },
  { en: "Office", ar: "مكتب" },
  { en: "Individual", ar: "فرد" },
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

// Service options with translations
const serviceOptions = [
  { en: "Wholesale", ar: "البيع بالجملة" },
  { en: "Retail", ar: "التجزئة" },
  { en: "Repair Services", ar: "خدمات الإصلاح" },
  { en: "Consulting", ar: "الاستشارات" },
  { en: "Installation", ar: "التثبيت" },
  { en: "Maintenance", ar: "الصيانة" },
  { en: "Custom Orders", ar: "طلبات مخصصة" },
  { en: "Bulk Orders", ar: "طلبات بالجملة" },
  { en: "Emergency Services", ar: "خدمات الطوارئ" },
  { en: "Delivery", ar: "التوصيل" },
];

export default function CompleteProfileForm({
  formData,
  setFormData,
  selectedLocation,
  setSelectedLocation,
  currentStep,
  setCurrentStep,
  nextStep,
  prevStep,
  goToStep,
}: CompleteProfileFormProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedTargetCustomers, setSelectedTargetCustomers] = useState<
    string[]
  >([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [productKeywords, setProductKeywords] = useState<string[]>(
    formData.productKeywords || []
  );
  const [keywordInput, setKeywordInput] = useState<string>(
    formData.productKeywords?.join(", ") || ""
  );

  const [keywordSuggestions, setKeywordSuggestions] = useState<string[]>([]);

  const [showKeywordGuide, setShowKeywordGuide] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitStatus, setSubmitStatus] = useState<string>("");
  const [crFile, setCrFile] = useState<File | null>(null);
  const [crPreview, setCrPreview] = useState<string>("");
  const [showVerificationModal, setShowVerificationModal] =
    useState<boolean>(false);
  const { t, language, isRTL } = useLanguage();

  // Track if form should allow submission
  const allowSubmissionRef = useRef<boolean>(false);

  const [additionalPhones, setAdditionalPhones] = useState<AdditionalPhone[]>([
    { id: 1, type: "Sales Representative", number: "", name: "" },
  ]);

  const [branches, setBranches] = useState<Branch[]>([]);
  const [showBranchManagement, setShowBranchManagement] =
    useState<boolean>(false);

  // Helper function to get translated text
  const getTranslatedText = (
    items: Array<{ en: string; ar: string }>,
    value: string
  ): string => {
    const item = items.find((item) => item.en === value);
    return item ? item[language as keyof typeof item] : value;
  };

  // Helper function to get English value from translated text
  const getEnglishValue = (
    items: Array<{ en: string; ar: string }>,
    translatedValue: string
  ): string => {
    const item = items.find(
      (item) => item.en === translatedValue || item.ar === translatedValue
    );
    return item ? item.en : translatedValue;
  };
  const saveKeywords = (): void => {
    if (keywordInput.trim()) {
      const keywordsArray = keywordInput
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0);

      const uniqueKeywords = [...new Set(keywordsArray)];

      setProductKeywords(uniqueKeywords);
      setFormData((prev) => ({
        ...prev,
        productKeywords: uniqueKeywords,
      }));
    } else {
      setProductKeywords([]);
      setFormData((prev) => ({
        ...prev,
        productKeywords: [],
      }));
    }
  };

  const getCategorySuggestions = (categories: string[]): string[] => {
    const suggestions: Record<string, string[]> = {
      Agriculture: [
        "seeds",
        "fertilizers",
        "pesticides",
        "farming equipment",
        "irrigation systems",
        "livestock feed",
        "greenhouse supplies",
        "tractors",
        "harvesting tools",
        "organic products",
      ],
      "Apparel & Fashion": [
        "clothing",
        "fashion accessories",
        "footwear",
        "handbags",
        "jewelry",
        "watches",
        "sunglasses",
        "belts",
        "scarves",
        "fashion design",
      ],
      Automobile: [
        "car parts",
        "automotive accessories",
        "tires",
        "batteries",
        "engine oil",
        "brake pads",
        "car electronics",
        "vehicle maintenance",
        "auto repair",
        "car detailing",
      ],
      "Brass Hardware & Components": [
        "brass fittings",
        "hardware components",
        "metal fabrication",
        "brass valves",
        "connectors",
        "fasteners",
        "brass pipes",
        "industrial hardware",
        "custom brass parts",
        "marine hardware",
      ],
      "Business Services": [
        "consulting",
        "accounting",
        "legal services",
        "marketing services",
        "HR services",
        "business development",
        "financial planning",
        "project management",
        "training",
        "outsourcing",
      ],
      Chemicals: [
        "industrial chemicals",
        "laboratory chemicals",
        "cleaning chemicals",
        "specialty chemicals",
        "chemical raw materials",
        "petrochemicals",
        "pharmaceutical chemicals",
        "agricultural chemicals",
        "water treatment",
        "adhesives",
      ],
      "Computer Hardware & Software": [
        "computers",
        "laptops",
        "software",
        "servers",
        "networking equipment",
        "storage devices",
        "monitors",
        "keyboards",
        "IT support",
        "system integration",
      ],
      "Construction & Real Estate": [
        "building materials",
        "construction equipment",
        "real estate",
        "property management",
        "cement",
        "steel",
        "concrete",
        "roofing materials",
        "electrical supplies",
        "plumbing",
      ],
      "Consumer Electronics": [
        "smartphones",
        "tablets",
        "laptops",
        "televisions",
        "audio systems",
        "cameras",
        "gaming consoles",
        "wearables",
        "home appliances",
        "electronic accessories",
      ],
      "Electronics & Electrical Supplies": [
        "electrical components",
        "wiring",
        "switches",
        "outlets",
        "circuit breakers",
        "electrical panels",
        "transformers",
        "cables",
        "lighting",
        "power supplies",
      ],
      "Energy & Power": [
        "solar panels",
        "generators",
        "batteries",
        "renewable energy",
        "power systems",
        "electrical equipment",
        "energy storage",
        "inverters",
        "wind turbines",
        "power distribution",
      ],
      "Environment & Pollution": [
        "waste management",
        "recycling",
        "environmental consulting",
        "pollution control",
        "water treatment",
        "air purification",
        "environmental monitoring",
        "sustainable solutions",
        "green technology",
        "hazardous waste",
      ],
      "Food & Beverage": [
        "catering",
        "fresh vegetables",
        "bakery items",
        "beverages",
        "frozen food",
        "spices",
        "dairy products",
        "meat",
        "seafood",
        "organic food",
      ],
      Furniture: [
        "office chairs",
        "desks",
        "sofas",
        "beds",
        "dining tables",
        "wardrobes",
        "kitchen cabinets",
        "outdoor furniture",
        "custom furniture",
        "office furniture",
      ],
      "Gifts & Crafts": [
        "handmade crafts",
        "gift items",
        "decorative items",
        "art supplies",
        "personalized gifts",
        "party supplies",
        "seasonal decorations",
        "hobby materials",
        "collectibles",
        "souvenirs",
      ],
      "Health & Beauty": [
        "cosmetics",
        "skincare products",
        "hair care",
        "health supplements",
        "medical devices",
        "beauty equipment",
        "spa services",
        "wellness products",
        "fitness equipment",
        "personal care",
      ],
      "Home Supplies": [
        "household items",
        "cleaning supplies",
        "home decor",
        "kitchen utensils",
        "storage solutions",
        "garden supplies",
        "home improvement",
        "appliances",
        "bedding",
        "bathroom accessories",
      ],
      "Home Textiles & Furnishings": [
        "curtains",
        "bed sheets",
        "towels",
        "carpets",
        "upholstery",
        "table linens",
        "cushions",
        "blankets",
        "rugs",
        "home fabrics",
      ],
      "Hospital & Medical Supplies": [
        "medical equipment",
        "surgical instruments",
        "hospital furniture",
        "medical disposables",
        "diagnostic equipment",
        "patient care",
        "laboratory supplies",
        "medical devices",
        "healthcare products",
        "pharmaceuticals",
      ],
      "Hotel Supplies & Equipment": [
        "hotel furniture",
        "hospitality supplies",
        "restaurant equipment",
        "hotel linens",
        "catering equipment",
        "hotel amenities",
        "commercial kitchen",
        "housekeeping supplies",
        "hotel technology",
        "guest room supplies",
      ],
      "Industrial Supplies": [
        "industrial equipment",
        "safety equipment",
        "tools",
        "machinery parts",
        "industrial chemicals",
        "manufacturing supplies",
        "maintenance supplies",
        "protective gear",
        "industrial automation",
        "quality control",
      ],
      "Jewelry & Gemstones": [
        "gold jewelry",
        "silver jewelry",
        "diamonds",
        "gemstones",
        "watches",
        "custom jewelry",
        "precious metals",
        "jewelry repair",
        "wedding rings",
        "fashion jewelry",
      ],
      "Leather & Leather Products": [
        "leather goods",
        "handbags",
        "wallets",
        "belts",
        "shoes",
        "leather jackets",
        "luggage",
        "leather furniture",
        "custom leather",
        "leather accessories",
      ],
      Machinery: [
        "industrial machinery",
        "manufacturing equipment",
        "construction machinery",
        "agricultural machinery",
        "packaging machinery",
        "printing machinery",
        "textile machinery",
        "food processing",
        "automation equipment",
        "heavy machinery",
      ],
      "Mineral & Metals": [
        "steel",
        "aluminum",
        "copper",
        "iron ore",
        "precious metals",
        "metal alloys",
        "mining equipment",
        "metal processing",
        "scrap metal",
        "industrial metals",
      ],
      "Office & School Supplies": [
        "office supplies",
        "stationery",
        "paper",
        "pens",
        "notebooks",
        "office furniture",
        "school supplies",
        "educational materials",
        "printing supplies",
        "office equipment",
      ],
      "Oil and Gas": [
        "petroleum products",
        "oil drilling",
        "gas equipment",
        "refinery supplies",
        "pipeline equipment",
        "petrochemicals",
        "fuel",
        "oil field services",
        "gas processing",
        "energy services",
      ],
      "Packaging & Paper": [
        "packaging materials",
        "paper products",
        "boxes",
        "labels",
        "plastic packaging",
        "printing paper",
        "corrugated boxes",
        "packaging design",
        "industrial packaging",
        "eco packaging",
      ],
      Pharmaceuticals: [
        "medicines",
        "pharmaceutical raw materials",
        "medical supplies",
        "drug manufacturing",
        "healthcare products",
        "pharmaceutical equipment",
        "clinical supplies",
        "biotechnology",
        "research chemicals",
        "medical devices",
      ],
      "Pipes, Tubes & Fittings": [
        "steel pipes",
        "PVC pipes",
        "pipe fittings",
        "valves",
        "plumbing supplies",
        "industrial pipes",
        "tube fittings",
        "pipeline systems",
        "hydraulic fittings",
        "gas pipes",
      ],
      "Plastics & Products": [
        "plastic products",
        "plastic raw materials",
        "injection molding",
        "plastic packaging",
        "plastic containers",
        "PVC products",
        "plastic sheets",
        "custom plastics",
        "recycled plastics",
        "polymer products",
      ],
      "Printing & Publishing": [
        "printing services",
        "digital printing",
        "offset printing",
        "publishing",
        "graphic design",
        "promotional materials",
        "business cards",
        "brochures",
        "books",
        "magazines",
      ],
      "Real Estate": [
        "property sales",
        "property management",
        "real estate development",
        "commercial property",
        "residential property",
        "property investment",
        "real estate consulting",
        "property valuation",
        "leasing",
        "construction",
      ],
      "Scientific & Laboratory Instruments": [
        "laboratory equipment",
        "scientific instruments",
        "research equipment",
        "analytical instruments",
        "microscopes",
        "testing equipment",
        "laboratory supplies",
        "measuring instruments",
        "lab furniture",
        "calibration services",
      ],
      "Security & Protection": [
        "security systems",
        "surveillance cameras",
        "access control",
        "alarm systems",
        "security services",
        "protective equipment",
        "fire safety",
        "security guards",
        "cybersecurity",
        "safety equipment",
      ],
      "Sports & Entertainment": [
        "sports equipment",
        "fitness equipment",
        "recreational facilities",
        "entertainment systems",
        "sports accessories",
        "outdoor gear",
        "exercise machines",
        "sports apparel",
        "gaming equipment",
        "leisure products",
      ],
      Telecommunications: [
        "telecom equipment",
        "networking solutions",
        "communication systems",
        "mobile accessories",
        "internet services",
        "telephone systems",
        "wireless technology",
        "data communication",
        "telecom infrastructure",
        "VoIP systems",
      ],
      "Textiles & Fabrics": [
        "fabrics",
        "textiles",
        "yarns",
        "clothing materials",
        "industrial textiles",
        "home textiles",
        "textile machinery",
        "fabric printing",
        "textile chemicals",
        "fiber products",
      ],
      Toys: [
        "children toys",
        "educational toys",
        "outdoor toys",
        "electronic toys",
        "board games",
        "action figures",
        "dolls",
        "toy vehicles",
        "learning toys",
        "baby toys",
      ],
      Transportation: [
        "logistics",
        "freight services",
        "shipping",
        "cargo handling",
        "transportation equipment",
        "fleet management",
        "warehousing",
        "delivery services",
        "supply chain",
        "vehicle rental",
      ],
    };

    let allSuggestions: string[] = [];
    categories.forEach((category) => {
      if (suggestions[category]) {
        allSuggestions = [...allSuggestions, ...suggestions[category]];
      }
    });

    return [...new Set(allSuggestions)].slice(0, 15);
  };

  // Track step changes to prevent auto-submission
  useEffect(() => {
    if (currentStep === 6) {
      allowSubmissionRef.current = false;
    } else {
      allowSubmissionRef.current = false;
    }
  }, [currentStep]);

  // Sync crFile with formData.document
  useEffect(() => {
    if (crFile) {
      setFormData((prev) => ({
        ...prev,
        document: crFile,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        document: null,
      }));
    }
  }, [crFile]);

  // Function to manually allow submission
  const allowSubmission = () => {
    allowSubmissionRef.current = true;
  };

  const handleInputChange = (
    field: keyof ProfileFormData,
    value: string
  ): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleProductKeywordsChange = (value: string): void => {
    setKeywordInput(value);

    const keywordsArray = value
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    setProductKeywords(keywordsArray);
    setFormData((prev) => ({
      ...prev,
      productKeywords: keywordsArray,
    }));

    if (errors.productKeywords) {
      setErrors((prev) => ({ ...prev, productKeywords: "" }));
    }
  };

  const addSuggestedKeyword = (keyword: string): void => {
    const newKeywords = [...new Set([...productKeywords, keyword])];

    setProductKeywords(newKeywords);
    setKeywordInput(newKeywords.join(", "));
    setFormData((prev) => ({
      ...prev,
      productKeywords: newKeywords,
    }));
  };

  const handleServiceToggle = (service: string): void => {
    const englishService = getEnglishValue(serviceOptions, service);
    const newServices = selectedServices.includes(englishService)
      ? selectedServices.filter((s) => s !== englishService)
      : [...selectedServices, englishService];

    setSelectedServices(newServices);
    setFormData((prev) => ({
      ...prev,
      services: newServices,
    }));
  };

  const handleTargetCustomerToggle = (customer: string): void => {
    const englishCustomer = getEnglishValue(targetCustomerOptions, customer);
    const newCustomers = selectedTargetCustomers.includes(englishCustomer)
      ? selectedTargetCustomers.filter((c) => c !== englishCustomer)
      : [...selectedTargetCustomers, englishCustomer];

    setSelectedTargetCustomers(newCustomers);
    setFormData((prev) => ({
      ...prev,
      targetCustomers: newCustomers,
    }));
  };

  const handleWorkingHoursChange = (
    day: keyof typeof formData.workingHours,
    field: "open" | "close" | "closed",
    value: string | boolean
  ): void => {
    setFormData((prev) => ({
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

  const handleCRFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];

    if (file) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/pdf",
      ];
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          crFile: "Please upload a valid file (JPG, PNG, or PDF)",
        }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          crFile: "File size must be less than 5MB",
        }));
        return;
      }

      setCrFile(file);

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result;
          if (typeof result === "string") {
            setCrPreview(result);
          } else {
            setCrPreview("");
          }
        };
        reader.readAsDataURL(file);
      } else {
        setCrPreview("");
      }

      if (errors.crFile) {
        setErrors((prev) => ({ ...prev, crFile: "" }));
      }
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Errors = {};

    switch (step) {
      case 1:
        if (!formData.businessName || formData.businessName.trim() === "") {
          newErrors.businessName = "Business name is required";
        }

        if (!formData.businessType) {
          newErrors.businessType = "Business type is required";
        }

        if (!formData.category) {
          newErrors.category = "Category is required";
        }
        break;

      case 2:
        if (!formData.categories || formData.categories.length === 0) {
          newErrors.categories = "At least one category is required";
        }
        if (
          !formData.productKeywords ||
          formData.productKeywords.length === 0
        ) {
          newErrors.productKeywords = "At least one keyword is required";
        }
        break;

      case 3:
        if (!formData.mainPhone || formData.mainPhone.trim() === "") {
          newErrors.mainPhone = "Main phone is required";
        }
        if (!formData.address || formData.address.trim() === "") {
          newErrors.address = "Address is required";
        }
        break;

      case 4:
        // Location validation if needed
        break;

      case 5:
        // Branches validation (optional)
        break;

      case 6:
        // Documents validation (optional)
        break;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Only allow submission on the final step AND if manually triggered
    if (currentStep < 6 || !allowSubmissionRef.current) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("Saving profile information...");

    try {
      // Upload document first if exists
      let documentResponse = null;
      if (formData.document) {
        try {
          documentResponse = await apiService.uploadDocument(formData.document);
        } catch (uploadError: any) {
          setSubmitStatus(`Document upload failed: ${uploadError.message}`);
          setIsSubmitting(false);
          return;
        }
      }

      // Client-side validation for required fields
      if (!formData.businessName || formData.businessName.trim() === "") {
        setSubmitStatus("Business name is required");
        setIsSubmitting(false);
        return;
      }

      // Ensure mainPhone has a value
      const mainPhoneValue = formData.mainPhone || formData.contactPhone;
      if (!mainPhoneValue || mainPhoneValue.trim() === "") {
        setSubmitStatus("Main phone is required");
        setIsSubmitting(false);
        return;
      }

      if (!formData.businessType || formData.businessType.trim() === "") {
        setSubmitStatus("Business type is required");
        setIsSubmitting(false);
        return;
      }

      if (!formData.categories || formData.categories.length === 0) {
        setSubmitStatus("At least one business category is required");
        setIsSubmitting(false);
        return;
      }

      if (!formData.services || formData.services.length === 0) {
        setSubmitStatus("At least one service is required");
        setIsSubmitting(false);
        return;
      }

      if (!formData.targetCustomers || formData.targetCustomers.length === 0) {
        setSubmitStatus("Target customers information is required");
        setIsSubmitting(false);
        return;
      }

      // Skip contactEmail and contactPhone validation since backend doesn't use them
      // Only validate if they are provided
      if (formData.contactEmail && formData.contactEmail.trim() !== "") {
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.contactEmail)) {
          setSubmitStatus("Please enter a valid email address");
          setIsSubmitting(false);
          return;
        }
      }

      // Prepare profile data (document already uploaded)
      const profileData: ProfileUpdateData = {
        businessName: formData.businessName,
        businessType: formData.businessType.toLowerCase(), // Convert to lowercase
        category: formData.category, // Add the selected category
        categories: formData.categories,
        productKeywords: formData.productKeywords,
        whoDoYouServe: formData.targetCustomers.join(", "), // Convert array to string for backend
        serviceDistance: formData.serviceDistance.toString(),
        services: formData.services,
        website: formData.website,
        mainPhone: mainPhoneValue, // Use validated main phone value
        additionalPhones: formData.additionalPhones,
        address: formData.address,
        location: formData.location,
        description: formData.description,
        // Always send workingHours with proper structure
        workingHours: {
          monday: {
            open: formData.workingHours.monday.open || "09:00",
            close: formData.workingHours.monday.close || "17:00",
            closed: formData.workingHours.monday.closed,
          },
          tuesday: {
            open: formData.workingHours.tuesday.open || "09:00",
            close: formData.workingHours.tuesday.close || "17:00",
            closed: formData.workingHours.tuesday.closed,
          },
          wednesday: {
            open: formData.workingHours.wednesday.open || "09:00",
            close: formData.workingHours.wednesday.close || "17:00",
            closed: formData.workingHours.wednesday.closed,
          },
          thursday: {
            open: formData.workingHours.thursday.open || "09:00",
            close: formData.workingHours.thursday.close || "17:00",
            closed: formData.workingHours.thursday.closed,
          },
          friday: {
            open: formData.workingHours.friday.open || "09:00",
            close: formData.workingHours.friday.close || "17:00",
            closed: formData.workingHours.friday.closed,
          },
          saturday: {
            open: formData.workingHours.saturday.open || "09:00",
            close: formData.workingHours.saturday.close || "17:00",
            closed: formData.workingHours.saturday.closed,
          },
          sunday: {
            open: formData.workingHours.sunday.open || "09:00",
            close: formData.workingHours.sunday.close || "17:00",
            closed: formData.workingHours.sunday.closed,
          },
        },
        hasBranches: branches && branches.length > 0,
        branches: branches || [], // Use branches state instead of formData.branches
        contactEmail: formData.contactEmail, // Add from verification/login
        contactPhone: formData.contactPhone, // Add from verification/login
        // Document already uploaded separately, don't include here
      };

      // Update profile with data (document already uploaded)
      let profileResponse;
      // Always use regular JSON request since document is uploaded separately
      profileResponse = await apiService.updateProfile(profileData);

      setSubmitStatus("Profile submitted successfully!");
      setShowVerificationModal(true);
    } catch (error: any) {
      console.error("Failed to update profile:", error);

      // Handle validation errors more specifically
      if (error.name === "ValidationError" && error.errors) {
        console.error("Detailed validation errors:", error.errors);

        // Format validation errors for user display with specific field messages
        const errorMessages = Object.entries(error.errors)
          .map(([field, messages]) => {
            const fieldMessages = Array.isArray(messages)
              ? messages
              : [messages];
            const messageText = fieldMessages.join(", ");

            // Map field names to user-friendly labels
            const fieldLabels: Record<string, string> = {
              businessType: "Business type",
              whoDoYouServe: "Target customers",
              businessName: "Business name",
              categories: "Business categories",
              services: "Services",
              // Removed contactEmail and contactPhone since backend doesn't use them
            };

            const fieldLabel = fieldLabels[field] || field;
            return `${fieldLabel}: ${messageText}`;
          })
          .join("; ");

        setSubmitStatus(`Validation failed: ${errorMessages}`);
      } else {
        setSubmitStatus(
          error.message || "Failed to save profile. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBusinessTypeIcon = (type: string): string => {
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

  const getStepTitle = (step: number): string => {
    switch (step) {
      case 1:
        return t("completeProfile.steps.businessInfo");
      case 2:
        return t("completeProfile.steps.targetMarket");
      case 3:
        return t("completeProfile.steps.locationContact");
      case 4:
        return t("completeProfile.steps.hoursBranches");
      case 5:
        return t("completeProfile.steps.locationMap"); // الخريطة هنا
      case 6:
        return t("completeProfile.steps.verification"); // التحقق هنا
      default:
        return "";
    }
  };

  const getKeywordCount = (): number => {
    return productKeywords.length;
  };

  const phoneTypes = [
    t("completeProfile.phoneTypes.sales"),
    t("completeProfile.phoneTypes.procurement"),
    t("completeProfile.phoneTypes.technical"),
    t("completeProfile.phoneTypes.customer"),
    t("completeProfile.phoneTypes.manager"),
    t("completeProfile.phoneTypes.general"),
  ];

  const handleCategoryToggle = (category: string): void => {
    const englishCategory = getEnglishValue(categories, category);
    const newCategories = selectedCategories.includes(englishCategory)
      ? selectedCategories.filter((c) => c !== englishCategory)
      : [...selectedCategories, englishCategory];

    setSelectedCategories(newCategories);
    setFormData((prev) => ({
      ...prev,
      categories: newCategories,
    }));

    // تحديث الاقتراحات فوراً
    const newSuggestions =
      newCategories.length > 0 ? getCategorySuggestions(newCategories) : [];
    setKeywordSuggestions(newSuggestions);
  };

  const handleAddPhone = (): void => {
    if (additionalPhones.length < 4) {
      setAdditionalPhones((prev) =>
        prev.concat({
          id: Date.now(),
          type:
            phoneTypes.find(
              (type) => !prev.some((phone) => phone.type === type)
            ) || "General Inquiry",
          number: "",
          name: "",
        })
      );
    }
  };

  const handleRemovePhone = (id: number): void => {
    setAdditionalPhones((prev) => prev.filter((phone) => phone.id !== id));
  };

  const handlePhoneChange = (
    id: number,
    field: keyof AdditionalPhone,
    value: string
  ): void => {
    const updatedPhones = additionalPhones.map((phone) =>
      phone.id === id ? { ...phone, [field]: value } : phone
    );

    setAdditionalPhones(updatedPhones);
    setFormData((prev) => ({
      ...prev,
      additionalPhones: updatedPhones,
    }));
  };
  const clearAllKeywords = (): void => {
    setProductKeywords([]);
    setKeywordInput("");
    setFormData((prev) => ({
      ...prev,
      productKeywords: [],
    }));
  };
  const removeKeyword = (keywordToRemove: string): void => {
    const newKeywords = productKeywords.filter((k) => k !== keywordToRemove);
    const newKeywordInput = newKeywords.join(", ");

    setProductKeywords(newKeywords);
    setKeywordInput(newKeywordInput);
    setFormData((prev) => ({
      ...prev,
      productKeywords: newKeywords,
    }));
  };
  useEffect(() => {
    if (formData.productKeywords && formData.productKeywords.length > 0) {
      setProductKeywords(formData.productKeywords);
      setKeywordInput(formData.productKeywords.join(", "));
    }
  }, [formData.productKeywords]);

  // ⭐ التعديل الرابع: useEffect لتحديث الاقتراحات تلقائياً
  useEffect(() => {
    if (selectedCategories.length > 0) {
      const newSuggestions = getCategorySuggestions(selectedCategories);
      setKeywordSuggestions(newSuggestions);
    } else {
      setKeywordSuggestions([]);
    }
  }, [selectedCategories]);

  useEffect(() => {
    if (Number(currentStep) === 5) {
      return;
    }
  }, [currentStep]);

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
  };

  return (
    <div className="bg-white rounded-xl md:rounded-2xl shadow-xl p-4 md:p-6 lg:p-8 mx-2 md:mx-0">
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 md:mb-4 gap-2">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            {t("completeProfile.title")}
          </h2>
          <span className="text-xs md:text-sm text-gray-500">
            {t("completeProfile.stepOf")
              .replace("{current}", String(currentStep))
              .replace("{total}", "6")}{" "}
            {/* غير من 5 ل 6 */}
          </span>
        </div>

        <div className="flex space-x-1 md:space-x-2 mb-3 md:mb-4">
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <div
              key={step}
              className={`h-1.5 md:h-2 flex-1 rounded-full transition-all duration-300 ${
                step <= currentStep ? "bg-yellow-400" : "bg-gray-200"
              }`}
            ></div>
          ))}
        </div>

        <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-1 md:mb-2">
          {getStepTitle(currentStep)}
        </h3>
        <div className="w-full bg-gray-100 rounded-full h-1">
          <div
            className="bg-yellow-400 h-1 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 6) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Pre-filled Account Info */}
      <div className="bg-green-50 p-3 md:p-4 rounded-lg mb-4 md:mb-6 border border-green-200">
        <div className="flex items-center space-x-2 mb-2 md:mb-3">
          <i className="ri-check-line text-green-600 text-sm md:text-base"></i>
          <h4 className="text-green-800 font-medium text-sm md:text-base">
            {t("completeProfile.accountVerified")}
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 text-xs md:text-sm">
          <div>
            <span className="text-green-700 font-medium">
              {t("completeProfile.business")}:
            </span>
            <p className="text-green-800 truncate">{formData.businessName}</p>
          </div>
          <div>
            <span className="text-green-700 font-medium">
              {t("completeProfile.phone")}:
            </span>
            <p className="text-green-800">{formData.contactPhone}</p>
          </div>
          <div>
            <span className="text-green-700 font-medium">
              {t("completeProfile.email")}:
            </span>
            <p className="text-green-800 truncate">{formData.contactEmail}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        {currentStep === 1 && (
          <div className="space-y-4 md:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 md:mb-3">
                {t("completeProfile.step1.businessTypeLabel")} *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                {businessTypes.map((type) => (
                  <label
                    key={type.en}
                    className={`flex items-center space-x-2 md:space-x-3 p-3 md:p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.businessType === type.en
                        ? "border-yellow-400 bg-yellow-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="businessType"
                      value={type.en}
                      checked={formData.businessType === type.en}
                      onChange={(e) =>
                        handleInputChange("businessType", e.target.value)
                      }
                      className="w-4 h-4 text-yellow-400 border-gray-300 focus:ring-yellow-400"
                      required
                    />
                    <i
                      className={`${getBusinessTypeIcon(
                        type.en
                      )} text-base md:text-lg text-gray-600`}
                    ></i>
                    <span className="text-sm font-medium text-gray-700">
                      {type[language as keyof typeof type]}
                    </span>
                  </label>
                ))}
              </div>
              {errors.businessType && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.businessType}
                </p>
              )}

              {/* Category Dropdown */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category || ""}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categoryOptions.map((option) => (
                    <option key={option.en} value={option.en}>
                      {language === "ar" ? option.ar : option.en}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-xs mt-1">{errors.category}</p>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("completeProfile.step1.descriptionLabel")} *
                </label>
                <textarea
                  name="description"
                  value={formData.description || ""}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={4}
                  className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm ${
                    errors.description ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder={t(
                    "completeProfile.step1.descriptionPlaceholder"
                  )}
                  required
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {t("completeProfile.step1.descriptionHelp")}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 md:mb-3">
                {t("completeProfile.step1.categoriesLabel")} *
              </label>
              <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">
                {t("completeProfile.step1.categoriesDesc")}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 max-h-60 md:max-h-80 overflow-y-auto border border-gray-200 rounded-lg p-3 md:p-4">
                {categories.map((category) => (
                  <label
                    key={category.en}
                    className={`flex items-center space-x-2 md:space-x-3 p-2 md:p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedCategories.includes(category.en)
                        ? "border-yellow-400 bg-yellow-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.en)}
                      onChange={() =>
                        handleCategoryToggle(
                          category[language as keyof typeof category]
                        )
                      }
                      className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                    />
                    <span className="text-xs md:text-sm text-gray-700">
                      {category[language as keyof typeof category]}
                    </span>
                  </label>
                ))}
              </div>

              <div className="mt-2 md:mt-3 flex items-center justify-between">
                <span className="text-xs md:text-sm text-gray-500">
                  {selectedCategories.length}{" "}
                  {t("completeProfile.step1.categoriesSelected")}
                </span>
                {selectedCategories.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategories([]);
                      setFormData((prev) => ({ ...prev, categories: [] }));
                    }}
                    className="text-xs md:text-sm text-red-600 hover:text-red-700"
                  >
                    {t("completeProfile.step1.clearAll")}
                  </button>
                )}
              </div>

              {errors.categories && (
                <p className="text-red-500 text-xs mt-1">{errors.categories}</p>
              )}

              {selectedCategories.length > 0 && (
                <div className="mt-3 md:mt-4 p-2 md:p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-xs md:text-sm font-medium text-green-800 mb-1 md:mb-2">
                    {t("completeProfile.step1.selectedCategories")}
                  </p>
                  <div className="flex flex-wrap gap-1 md:gap-2">
                    {selectedCategories.map((category) => {
                      const categoryObj = categories.find(
                        (c) => c.en === category
                      );
                      return (
                        <span
                          key={category}
                          className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs"
                        >
                          {categoryObj
                            ? categoryObj[language as keyof typeof categoryObj]
                            : category}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Products/Services Keywords Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg md:rounded-xl p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 md:mb-4 gap-2">
                <div className="flex items-center space-x-2">
                  <i className="ri-search-line text-blue-600 text-lg md:text-xl"></i>
                  <h4 className="text-base md:text-lg font-semibold text-blue-800">
                    {t("completeProfile.step1.keywordsTitle")} *
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setShowKeywordGuide(!showKeywordGuide)}
                  className="text-blue-600 hover:text-blue-700 text-xs md:text-sm font-medium"
                >
                  <i className="ri-question-line mr-1"></i>
                  {t("completeProfile.step1.howToOptimize")}
                </button>
              </div>

              {showKeywordGuide && (
                <div className="bg-white p-3 md:p-4 rounded-lg mb-3 md:mb-4 border border-blue-200">
                  <h5 className="font-medium text-gray-800 mb-2 md:mb-3 text-sm md:text-base">
                    <i className="ri-lightbulb-line text-yellow-500 mr-2"></i>
                    {t("completeProfile.step1.searchMatching")}
                  </h5>
                  <div className="space-y-2 md:space-y-3 text-xs md:text-sm text-gray-700">
                    <div className="flex items-start space-x-2 md:space-x-3">
                      <i className="ri-search-2-line text-green-500 mt-0.5 text-sm md:text-base"></i>
                      <div>
                        <p className="font-medium">
                          {t("completeProfile.step1.searchMatching")}
                        </p>
                        <p>{t("completeProfile.step1.searchMatchingDesc")}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2 md:space-x-3">
                      <i className="ri-price-tag-3-line text-blue-500 mt-0.5 text-sm md:text-base"></i>
                      <div>
                        <p className="font-medium">
                          {t("completeProfile.step1.beSpecific")}
                        </p>
                        <p>{t("completeProfile.step1.beSpecificDesc")}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2 md:space-x-3">
                      <i className="ri-group-line text-purple-500 mt-0.5 text-sm md:text-base"></i>
                      <div>
                        <p className="font-medium">
                          {t("completeProfile.step1.thinkLikeCustomers")}
                        </p>
                        <p>
                          {t("completeProfile.step1.thinkLikeCustomersDesc")}
                        </p>
                      </div>
                    </div>
                    <div className="bg-yellow-50 p-2 md:p-3 rounded border border-yellow-200">
                      <p className="text-yellow-800 font-medium text-xs">
                        <i className="ri-star-line mr-1"></i>
                        {t("completeProfile.step1.proTip")}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ⭐⭐ الكلمات المفتاحية الجاهزة ⭐⭐ */}
              <div className="mb-3 md:mb-4">
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
                        if (!productKeywords.includes(keyword)) {
                          const newKeywords = [...productKeywords, keyword];
                          setProductKeywords(newKeywords);
                          setKeywordInput(newKeywords.join(", "));
                          setFormData((prev) => ({
                            ...prev,
                            productKeywords: newKeywords,
                          }));
                        }
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
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onBlur={saveKeywords}
                  rows={3}
                  className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm resize-none ${
                    errors.productKeywords
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  placeholder={t("completeProfile.step1.keywordsPlaceholder")}
                />
                <div className="flex justify-between items-center mt-1 md:mt-2">
                  <span
                    className={`text-xs ${
                      errors.productKeywords ? "text-red-500" : "text-gray-600"
                    }`}
                  >
                    {errors.productKeywords ||
                      `${productKeywords.length} ${t(
                        "completeProfile.step1.keywordsCount"
                      )}`}
                  </span>
                  <span
                    className={`text-xs ${
                      productKeywords.length >= 3
                        ? "text-green-500"
                        : "text-yellow-500"
                    }`}
                  >
                    {productKeywords.length >= 3
                      ? `${t("completeProfile.step1.goodLength")}`
                      : `${t("completeProfile.step1.addMinChars")} ${
                          3 - productKeywords.length
                        } ${t("completeProfile.step1.minChars")}`}
                  </span>
                </div>
              </div>

              {/* Keyword Suggestions */}
              {selectedCategories.length > 0 &&
                keywordSuggestions.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs md:text-sm font-medium text-blue-700 mb-2 md:mb-3">
                      <i className="ri-magic-line mr-1"></i>
                      {t("completeProfile.step1.quickSuggestions")}
                    </p>
                    <div className="flex flex-wrap gap-1 md:gap-2">
                      {keywordSuggestions
                        .filter((keyword) => !productKeywords.includes(keyword))
                        .map((keyword, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => addSuggestedKeyword(keyword)}
                            className="bg-white border border-blue-300 text-blue-700 px-2 md:px-3 py-1 rounded-full text-xs hover:bg-blue-50 transition-colors cursor-pointer flex items-center"
                          >
                            <i className="ri-add-line mr-1"></i>
                            {keyword}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}
        {productKeywords.length > 0 && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-sm font-semibold text-green-800 flex items-center">
                <i className="ri-price-tag-3-line mr-2"></i>
                {t("completeProfile.step1.keywordsAdded")} (
                {productKeywords.length})
              </h5>
              <button
                type="button"
                onClick={() => {
                  setProductKeywords([]);
                  setKeywordInput("");
                  setFormData((prev) => ({ ...prev, productKeywords: [] }));
                }}
                className="text-xs text-red-600 hover:text-red-700 flex items-center"
              >
                <i className="ri-delete-bin-line mr-1"></i>
                {t("completeProfile.step1.clearAll")}
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {productKeywords.map((keyword, index) => (
                <span
                  key={index}
                  className="bg-white border border-green-300 text-green-800 px-3 py-2 rounded-lg text-sm flex items-center shadow-sm"
                >
                  <i className="ri-check-line text-green-500 mr-2"></i>
                  {keyword}
                  <button
                    type="button"
                    onClick={() => {
                      const newKeywords = productKeywords.filter(
                        (k) => k !== keyword
                      );
                      setProductKeywords(newKeywords);
                      setKeywordInput(newKeywords.join(", "));
                      setFormData((prev) => ({
                        ...prev,
                        productKeywords: newKeywords,
                      }));
                    }}
                    className="mr-1 text-red-500 hover:text-red-700 transition-colors"
                  >
                    <i className="ri-close-line text-sm"></i>
                  </button>
                </span>
              ))}
            </div>

            <p className="text-xs text-green-600 mt-2">
              {t("completeProfile.step1.keywordsDesc")}
            </p>
          </div>
        )}
        {productKeywords.length === 0 && keywordInput.trim() === "" && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
            <i className="ri-search-line text-gray-400 text-2xl mb-2"></i>
            <p className="text-sm text-gray-600">
              {t("completeProfile.step1.keywordsDesc")}
            </p>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4 md:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 md:mb-3">
                {t("completeProfile.step2.whoServeLabel")} *
              </label>
              <div className="space-y-2 md:space-y-3">
                {targetCustomerOptions.map((customer) => (
                  <label
                    key={customer.en}
                    className={`flex items-center space-x-2 md:space-x-3 p-2 md:p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedTargetCustomers.includes(customer.en)
                        ? "border-yellow-400 bg-yellow-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedTargetCustomers.includes(customer.en)}
                      onChange={() =>
                        handleTargetCustomerToggle(
                          customer[language as keyof typeof customer]
                        )
                      }
                      className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                    />
                    <span className="text-sm text-gray-700">
                      {customer[language as keyof typeof customer]}
                    </span>
                  </label>
                ))}
              </div>
              {errors.targetCustomers && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.targetCustomers}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("completeProfile.step2.serviceDistanceLabel")} *
              </label>
              <select
                name="serviceDistance"
                value={formData.serviceDistance}
                onChange={(e) =>
                  handleInputChange("serviceDistance", e.target.value)
                }
                className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm pr-8 ${
                  errors.serviceDistance ? "border-red-300" : "border-gray-300"
                }`}
                required
              >
                <option value="">
                  {t("completeProfile.step2.serviceDistancePlaceholder")}
                </option>
                {serviceDistanceOptions.map((distance) => (
                  <option key={distance.en} value={distance.en}>
                    {distance[language as keyof typeof distance]}
                  </option>
                ))}
              </select>
              {errors.serviceDistance && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.serviceDistance}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 md:mb-3">
                {t("completeProfile.step2.servicesLabel")} (
                {t("completeProfile.optional")})
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                {serviceOptions.map((service) => (
                  <label
                    key={service.en}
                    className={`flex items-center space-x-2 md:space-x-3 p-2 md:p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedServices.includes(service.en)
                        ? "border-yellow-400 bg-yellow-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(service.en)}
                      onChange={() =>
                        handleServiceToggle(
                          service[language as keyof typeof service]
                        )
                      }
                      className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                    />
                    <span className="text-sm text-gray-700">
                      {service[language as keyof typeof service]}
                    </span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1 md:mt-2">
                {t("completeProfile.step2.servicesDesc")}
              </p>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4 md:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("completeProfile.step3.websiteLabel")} (
                {t("completeProfile.optional")})
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                placeholder="https://yourwebsite.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("completeProfile.step3.mainPhoneLabel")} *
              </label>
              <input
                type="tel"
                name="mainPhone"
                value={formData.mainPhone || formData.contactPhone || ""}
                onChange={(e) => handleInputChange("mainPhone", e.target.value)}
                className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                placeholder="+966 11 234 5678"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {t("completeProfile.step3.mainPhoneDesc")}
              </p>
            </div>

            {/* Additional Phone Numbers Section - Simplified */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 md:mb-3 gap-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t("completeProfile.step3.additionalPhones")} (
                  {t("completeProfile.optional")})
                </label>
                {additionalPhones.length < 4 && (
                  <button
                    type="button"
                    onClick={handleAddPhone}
                    className="text-yellow-600 hover:text-yellow-700 text-xs md:text-sm font-medium cursor-pointer"
                  >
                    <i className="ri-add-line mr-1"></i>
                    {t("completeProfile.step3.addNumber")}
                  </button>
                )}
              </div>

              <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">
                {t("completeProfile.step3.additionalPhonesDesc")}
              </p>

              <div className="space-y-2 md:space-y-3">
                {additionalPhones.map((phone, index) => (
                  <div
                    key={phone.id}
                    className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <select
                        value={phone.type}
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
                        onChange={(e) =>
                          handlePhoneChange(phone.id, "number", e.target.value)
                        }
                        className="w-full px-2 md:px-3 py-1 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                        placeholder="+966 50 123 4567"
                      />
                    </div>

                    <div className="flex items-center space-x-1 md:space-x-2">
                      <input
                        type="text"
                        value={phone.name}
                        onChange={(e) =>
                          handlePhoneChange(phone.id, "name", e.target.value)
                        }
                        className="flex-1 px-2 md:px-3 py-1 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                        placeholder={t(
                          "completeProfile.step3.contactNamePlaceholder"
                        )}
                      />
                      {additionalPhones.length > 1 && (
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

              {additionalPhones.length === 0 && (
                <div className="text-center py-4 md:py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <i className="ri-phone-line text-gray-400 text-xl md:text-2xl mb-1 md:mb-2"></i>
                  <p className="text-gray-600 text-xs md:text-sm mb-2 md:mb-3">
                    {t("completeProfile.step3.noAdditionalNumbers")}
                  </p>
                  <button
                    type="button"
                    onClick={handleAddPhone}
                    className="bg-yellow-400 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg hover:bg-yellow-500 text-xs md:text-sm font-medium whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-add-line mr-1 md:mr-2"></i>
                    {t("completeProfile.step3.addNumber")}
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("completeProfile.businessAddress")}
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm ${
                  errors.address ? "border-red-300" : "border-gray-300"
                }`}
                placeholder={t("completeProfile.addressPlaceholder")}
                required
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
              )}
            </div>

            <div className="bg-yellow-50 p-3 md:p-4 rounded-lg">
              <p className="text-xs md:text-sm text-yellow-800 mb-1 md:mb-2">
                <i className="ri-map-pin-line mr-1 md:mr-2"></i>
                {t("completeProfile.selectedLocation")}: Lat{" "}
                {selectedLocation.lat.toFixed(6)}, Lng{" "}
                {selectedLocation.lng.toFixed(6)}
              </p>
              <p className="text-xs text-yellow-700">
                {t("completeProfile.locationInstructions")}
              </p>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4 md:space-y-6">
            {/* Working Hours Section - Compact */}
            <div className="bg-blue-50 p-3 md:p-4 rounded-lg md:rounded-xl border border-blue-200">
              <div className="flex items-center space-x-2 mb-2 md:mb-3">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="ri-time-line text-blue-600 text-sm md:text-lg"></i>
                </div>
                <div>
                  <h4 className="text-sm md:text-base font-semibold text-blue-800">
                    {t("completeProfile.step4.workingHours")}
                  </h4>
                  <p className="text-blue-700 text-xs">
                    {t("completeProfile.step4.workingHoursDesc")}
                  </p>
                </div>
              </div>

              <div className="space-y-1 md:space-y-2">
                {Object.keys(formData.workingHours).map((day) => (
                  <div
                    key={day}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-2 bg-white rounded-lg border border-blue-200 gap-1 md:gap-2"
                  >
                    <div className="w-16">
                      <span className="text-xs font-medium text-gray-700 capitalize">
                        {day}
                      </span>
                    </div>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={
                          formData.workingHours[
                            day as keyof typeof formData.workingHours
                          ].closed
                        }
                        onChange={(e) =>
                          handleWorkingHoursChange(
                            day as keyof typeof formData.workingHours,
                            "closed",
                            e.target.checked
                          )
                        }
                        className="w-3 h-3 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400 mr-1"
                      />
                      <span className="text-xs text-gray-600">
                        {t("completeProfile.step4.dayClosed")}
                      </span>
                    </label>

                    {!formData.workingHours[
                      day as keyof typeof formData.workingHours
                    ].closed && (
                      <div className="flex items-center space-x-1 md:space-x-2">
                        <input
                          type="time"
                          value={
                            formData.workingHours[
                              day as keyof typeof formData.workingHours
                            ].open
                          }
                          onChange={(e) =>
                            handleWorkingHoursChange(
                              day as keyof typeof formData.workingHours,
                              "open",
                              e.target.value
                            )
                          }
                          className="px-1 md:px-2 py-0.5 md:py-1 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-xs"
                        />
                        <span className="text-gray-500 text-xs">
                          {t("completeProfile.step4.timeTo")}
                        </span>
                        <input
                          type="time"
                          value={
                            formData.workingHours[
                              day as keyof typeof formData.workingHours
                            ].close
                          }
                          onChange={(e) =>
                            handleWorkingHoursChange(
                              day as keyof typeof formData.workingHours,
                              "close",
                              e.target.value
                            )
                          }
                          className="px-1 md:px-2 py-0.5 md:py-1 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-xs"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Branch Management Section - Compact */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg md:rounded-xl p-3 md:p-4">
              <div className="flex items-center space-x-2 mb-2 md:mb-3">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="ri-building-line text-green-600 text-sm md:text-lg"></i>
                </div>
                <div>
                  <h4 className="text-sm md:text-base font-semibold text-green-800">
                    {t("completeProfile.step4.multipleBranches")}
                  </h4>
                  <p className="text-green-700 text-xs">
                    {t("completeProfile.step4.multipleBranchesDesc")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3 mb-3 md:mb-4">
                <div className="bg-white p-2 md:p-3 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-1 mb-1">
                    <i className="ri-map-pin-line text-green-500 text-xs md:text-sm"></i>
                    <span className="font-medium text-gray-700 text-xs md:text-sm">
                      {t("completeProfile.step4.multipleLocations")}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {t("completeProfile.step4.serveCustomers")}
                  </p>
                </div>
                <div className="bg-white p-2 md:p-3 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-1 mb-1">
                    <i className="ri-time-line text-blue-500 text-xs md:text-sm"></i>
                    <span className="font-medium text-gray-700 text-xs md:text-sm">
                      {t("completeProfile.step4.flexibleHours")}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {t("completeProfile.step4.differentHours")}
                  </p>
                </div>
                <div className="bg-white p-2 md:p-3 rounded-lg border border-purple-200">
                  <div className="flex items-center space-x-1 mb-1">
                    <i className="ri-team-line text-purple-500 text-xs md:text-sm"></i>
                    <span className="font-medium text-gray-700 text-xs md:text-sm">
                      {t("completeProfile.step4.betterManagement")}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {t("completeProfile.step4.trackPerformance")}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="text-green-800 font-medium text-xs md:text-sm">
                    {t("completeProfile.step4.readyToAddBranches")}
                  </p>
                  <p className="text-green-600 text-xs">
                    {t("completeProfile.step4.skipStep")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBranchManagement(true)}
                  className="bg-green-500 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg hover:bg-green-600 font-medium text-xs md:text-sm whitespace-nowrap cursor-pointer transition-all"
                >
                  <i className="ri-add-line mr-1"></i>
                  {t("completeProfile.step4.addBranches")}
                </button>
              </div>
            </div>

            {/* Current Branches Summary - Compact */}
            {branches.length > 0 && (
              <div className="bg-blue-50 p-3 md:p-4 rounded-lg md:rounded-xl border border-blue-200">
                <h4 className="text-sm md:text-base font-semibold text-blue-800 mb-2 md:mb-3">
                  <i className="ri-building-line mr-1"></i>
                  {t("completeProfile.step4.yourBranches")} ({branches.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                  {branches.slice(0, 4).map((branch) => (
                    <div
                      key={branch.id}
                      className="bg-white p-2 md:p-3 rounded-lg border border-blue-200"
                    >
                      <div className="flex items-center space-x-1 md:space-x-2 mb-1">
                        <h5 className="font-medium text-gray-800 text-xs md:text-sm">
                          {branch.name}
                        </h5>
                        <span
                          className={`px-1.5 md:px-2 py-0.5 rounded-full text-xs font-medium ${
                            branch.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {branch.status}
                        </span>
                      </div>
                      <div className="space-y-0.5 text-xs text-gray-600">
                        <div className="flex items-center space-x-1">
                          <i className="ri-map-pin-line text-gray-400"></i>
                          <span className="truncate">{branch.address}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <i className="ri-phone-line text-gray-400"></i>
                          <span>{branch.phone}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {branches.length > 4 && (
                    <div className="bg-gray-100 p-2 md:p-3 rounded-lg border border-gray-200 flex items-center justify-center">
                      <span className="text-gray-600 font-medium text-xs md:text-sm">
                        +{branches.length - 4}{" "}
                        {t("completeProfile.step4.moreBranches")}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setShowBranchManagement(true)}
                  className="mt-2 md:mt-3 bg-blue-500 text-white px-2 md:px-3 py-1 md:py-1.5 rounded-lg hover:bg-blue-600 text-xs font-medium whitespace-nowrap cursor-pointer transition-all"
                >
                  <i className="ri-edit-line mr-1"></i>
                  {t("completeProfile.step4.manageBranches")}
                </button>
              </div>
            )}

            <div className="bg-yellow-50 p-2 md:p-3 rounded-lg border border-yellow-200">
              <div className="flex items-start space-x-1 md:space-x-2">
                <i className="ri-information-line text-yellow-600 text-base md:text-lg mt-0.5"></i>
                <div>
                  <h4 className="text-yellow-800 font-semibold mb-1 text-xs md:text-sm">
                    {t("completeProfile.step4.branchBenefits")}
                  </h4>
                  <ul className="text-xs text-gray-700 space-y-0.5">
                    <li>{t("completeProfile.step4.benefit1")}</li>
                    <li>{t("completeProfile.step4.benefit2")}</li>
                    <li>{t("completeProfile.step4.benefit3")}</li>
                    <li>{t("completeProfile.step4.benefit4")}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        {currentStep === 5 && (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg md:rounded-xl p-4 md:p-6">
              <div className="flex items-center space-x-2 mb-3 md:mb-4">
                <i className="ri-map-pin-line text-blue-600 text-lg md:text-xl"></i>
                <h4 className="text-base md:text-lg font-semibold text-blue-800">
                  {t("completeProfile.step5.mapTitle")}
                </h4>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {t("completeProfile.step5.mapDescription")}
              </p>

              {/* الخريطة بحجم أكبر */}
              <div className="h-[800px] rounded-lg overflow-hidden border border-gray-300 shadow-lg">
                <BusinessLocationMap
                  selectedLocation={selectedLocation}
                  setSelectedLocation={setSelectedLocation}
                />
              </div>

              <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-xs md:text-sm text-yellow-800 mb-1">
                  <i className="ri-map-pin-line mr-1 md:mr-2"></i>
                  {t("completeProfile.selectedLocation")}: Lat{" "}
                  {selectedLocation.lat.toFixed(6)}, Lng{" "}
                  {selectedLocation.lng.toFixed(6)}
                </p>
                <p className="text-xs text-yellow-700">
                  {t("completeProfile.locationInstructions")}
                </p>
              </div>
            </div>
          </div>
        )}

        {submitStatus && (
          <div
            className={`p-3 md:p-4 rounded-lg ${
              submitStatus.includes("Failed")
                ? "bg-red-50 text-red-700"
                : "bg-blue-50 text-blue-700"
            }`}
          >
            <p className="text-xs md:text-sm">{submitStatus}</p>
          </div>
        )}

        {currentStep === 6 && (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg md:rounded-xl p-4 md:p-6">
              <div className="flex items-center space-x-2 md:space-x-3 mb-3 md:mb-4">
                <div className="w-8 h-8 md:w-12 md:h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <i className="ri-shield-check-line text-red-600 text-lg md:text-xl"></i>
                </div>
                <div>
                  <h4 className="text-base md:text-lg font-semibold text-red-800">
                    {t("completeProfile.step6.verificationRequired")}
                  </h4>
                  <p className="text-red-700 text-xs md:text-sm">
                    {t("completeProfile.step6.verificationDesc")}
                  </p>
                </div>
              </div>

              <div className="bg-white p-3 md:p-4 rounded-lg border border-red-200">
                <h5 className="font-medium text-gray-800 mb-2 md:mb-3 text-sm md:text-base">
                  {t("completeProfile.step6.whyRequired")}
                </h5>
                <ul className="text-xs md:text-sm text-gray-700 space-y-1 md:space-y-2">
                  <li className="flex items-start space-x-1 md:space-x-2">
                    <i className="ri-check-line text-green-500 mt-0.5 text-sm md:text-base"></i>
                    <span>{t("completeProfile.step6.reason1")}</span>
                  </li>
                  <li className="flex items-start space-x-1 md:space-x-2">
                    <i className="ri-check-line text-green-500 mt-0.5 text-sm md:text-base"></i>
                    <span>{t("completeProfile.step6.reason2")}</span>
                  </li>
                  <li className="flex items-start space-x-1 md:space-x-2">
                    <i className="ri-check-line text-green-500 mt-0.5 text-sm md:text-base"></i>
                    <span>{t("completeProfile.step6.reason3")}</span>
                  </li>
                  <li className="flex items-start space-x-1 md:space-x-2">
                    <i className="ri-check-line text-green-500 mt-0.5 text-sm md:text-base"></i>
                    <span>{t("completeProfile.step6.reason4")}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("completeProfile.step6.crDocument")}
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-4 md:p-6 text-center transition-all ${
                  errors.crFile
                    ? "border-red-300 bg-red-50"
                    : crFile
                    ? "border-green-300 bg-green-50"
                    : "border-gray-300 hover:border-yellow-400 hover:bg-yellow-50"
                }`}
              >
                <input
                  type="file"
                  id="cr-upload"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleCRFileChange}
                  className="hidden"
                />

                {!crFile ? (
                  <label htmlFor="cr-upload" className="cursor-pointer">
                    <div className="space-y-2 md:space-y-3">
                      <i className="ri-upload-cloud-2-line text-2xl md:text-4xl text-gray-400"></i>
                      <div>
                        <p className="text-base md:text-lg font-medium text-gray-700">
                          {t("completeProfile.step6.uploadCR")}
                        </p>
                        <p className="text-xs md:text-sm text-gray-500">
                          {t("completeProfile.step6.uploadDesc")}
                        </p>
                        <p className="text-xs text-gray-400 mt-1 md:mt-2">
                          {t("completeProfile.step6.supportedFormats")}
                        </p>
                      </div>
                    </div>
                  </label>
                ) : (
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-center justify-center space-x-2 md:space-x-3">
                      <i className="ri-file-check-line text-xl md:text-3xl text-green-600"></i>
                      <div className="text-left">
                        <p className="font-medium text-gray-800 text-sm md:text-base">
                          {crFile.name}
                        </p>
                        <p className="text-xs md:text-sm text-gray-500">
                          {(crFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    {crPreview && (
                      <div className="max-w-xs md:max-w-sm mx-auto">
                        <img
                          src={crPreview}
                          alt="CR Preview"
                          className="w-full h-auto rounded-lg shadow-md"
                        />
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-2 md:space-x-3">
                      <label
                        htmlFor="cr-upload"
                        className="bg-blue-500 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg hover:bg-blue-600 text-xs md:text-sm cursor-pointer text-center"
                      >
                        <i className="ri-refresh-line mr-1 md:mr-2"></i>
                        {t("completeProfile.step6.replaceFile")}
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setCrFile(null);
                          setCrPreview("");
                        }}
                        className="bg-red-500 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg hover:bg-red-600 text-xs md:text-sm cursor-pointer text-center"
                      >
                        <i className="ri-delete-bin-line mr-1 md:mr-2"></i>
                        {t("completeProfile.step6.removeFile")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {errors.crFile && (
                <p className="text-red-500 text-xs mt-1">{errors.crFile}</p>
              )}
            </div>

            <div className="bg-blue-50 p-3 md:p-4 rounded-lg">
              <h5 className="font-medium text-blue-800 mb-1 md:mb-2 text-sm md:text-base">
                <i className="ri-information-line mr-1 md:mr-2"></i>
                {t("completeProfile.step6.whatHappensNext")}
              </h5>
              <ol className="text-xs md:text-sm text-blue-700 space-y-1 md:space-y-2">
                <li className="flex items-start space-x-1 md:space-x-2">
                  <span className="bg-blue-200 text-blue-800 rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center text-xs font-bold mt-0.5">
                    1
                  </span>
                  <span>{t("completeProfile.step6.nextStep1")}</span>
                </li>
                <li className="flex items-start space-x-1 md:space-x-2">
                  <span className="bg-blue-200 text-blue-800 rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center text-xs font-bold mt-0.5">
                    2
                  </span>
                  <span>{t("completeProfile.step6.nextStep2")}</span>
                </li>
                <li className="flex items-start space-x-1 md:space-x-2">
                  <span className="bg-blue-200 text-blue-800 rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center text-xs font-bold mt-0.5">
                    3
                  </span>
                  <span>{t("completeProfile.step6.nextStep3")}</span>
                </li>
              </ol>
              <p className="text-xs text-blue-600 mt-2 md:mt-3">
                {t("completeProfile.step6.verificationTime")}
              </p>
            </div>

            {/* Profile Summary */}
            <div className="bg-green-50 p-4 md:p-6 rounded-lg mt-4 md:mt-6">
              <h4 className="text-base md:text-lg font-semibold text-green-800 mb-3 md:mb-4">
                {t("completeProfile.step6.profileSummary")}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm">
                <div>
                  <p>
                    <span className="font-medium">
                      {t("completeProfile.step6.business")}:
                    </span>{" "}
                    {formData.businessName}
                  </p>
                  <p>
                    <span className="font-medium">
                      {t("completeProfile.step6.category")}:
                    </span>{" "}
                    {formData.category}
                  </p>
                  <p>
                    <span className="font-medium">
                      {t("completeProfile.step6.type")}:
                    </span>{" "}
                    {getTranslatedText(businessTypes, formData.businessType)}
                  </p>
                  <p>
                    <span className="font-medium">
                      {t("completeProfile.step6.services")}:
                    </span>{" "}
                    {selectedServices.length}{" "}
                    {t("completeProfile.step6.selected")}
                  </p>
                </div>
                <div>
                  <p>
                    <span className="font-medium">
                      {t("completeProfile.step6.email")}:
                    </span>{" "}
                    {formData.contactEmail}
                  </p>
                  <p>
                    <span className="font-medium">
                      {t("completeProfile.step6.phone")}:
                    </span>{" "}
                    {formData.contactPhone}
                  </p>
                  <p>
                    <span className="font-medium">
                      {t("completeProfile.step6.targetCustomers")}:
                    </span>{" "}
                    {selectedTargetCustomers.length}{" "}
                    {t("completeProfile.step6.types")}
                  </p>
                  <p>
                    <span className="font-medium">
                      {t("completeProfile.step6.keywords")}:
                    </span>{" "}
                    {getKeywordCount()} {t("completeProfile.step6.added")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {submitStatus && (
          <div
            className={`p-3 md:p-4 rounded-lg ${
              submitStatus.includes("Failed")
                ? "bg-red-50 text-red-700"
                : "bg-blue-50 text-blue-700"
            }`}
          >
            <p className="text-xs md:text-sm">{submitStatus}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between pt-4 md:pt-6 border-t border-gray-200 gap-3">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium whitespace-nowrap cursor-pointer transition-all text-sm md:text-base ${
              currentStep === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <i
              className={`${
                isRTL
                  ? "ri-arrow-right-line ml-1 md:ml-2"
                  : "ri-arrow-left-line mr-1 md:mr-2"
              }`}
            ></i>
            {t("completeProfile.buttons.previous")}
          </button>

          {currentStep < 6 ? (
            <button
              type="button"
              onClick={() => {
                if (validateStep(currentStep)) {
                  nextStep();
                }
              }}
              className="bg-yellow-400 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-yellow-500 font-medium whitespace-nowrap cursor-pointer transition-all text-sm md:text-base"
            >
              {t("completeProfile.buttons.nextStep")}
              <i
                className={`${
                  isRTL
                    ? "ri-arrow-left-line mr-1 md:mr-2"
                    : "ri-arrow-right-line ml-1 md:ml-2"
                }`}
              ></i>
            </button>
          ) : (
            <button
              type="submit"
              onClick={() => {
                allowSubmission();
              }}
              disabled={isSubmitting}
              className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium whitespace-nowrap cursor-pointer transition-all text-sm md:text-base ${
                isSubmitting
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              {isSubmitting ? (
                <>
                  <i className="ri-loader-4-line animate-spin mr-1 md:mr-2"></i>
                  {t("completeProfile.buttons.submittingProfile")}
                </>
              ) : (
                <>
                  <i className="ri-send-plane-line mr-1 md:mr-2"></i>
                  {t("completeProfile.buttons.submitVerification")}
                </>
              )}
            </button>
          )}
        </div>
      </form>

      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl md:rounded-2xl p-6 md:p-8 max-w-md w-full mx-2 text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              <i className="ri-check-line text-green-600 text-xl md:text-2xl"></i>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
              {t("completeProfile.success.profileCompleted")}
            </h3>
            <p className="text-gray-600 text-sm md:text-base mb-4 md:mb-6">
              {t("completeProfile.success.successMessage")}
            </p>
            <div className="space-y-2 md:space-y-3">
              <Link
                href="/"
                className="block bg-yellow-400 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-yellow-500 font-medium whitespace-nowrap cursor-pointer w-full text-sm md:text-base"
              >
                {t("completeProfile.buttons.viewListing")}
              </Link>
              <button
                onClick={() => setShowSuccess(false)}
                className="block border border-gray-300 text-gray-600 px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-gray-50 font-medium whitespace-nowrap cursor-pointer w-full text-sm md:text-base"
              >
                {t("completeProfile.buttons.continueEditing")}
              </button>
            </div>
          </div>
        </div>
      )}

      {showVerificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl md:rounded-2xl p-6 md:p-8 max-w-lg w-full mx-2 text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
              <i className="ri-time-line text-yellow-600 text-2xl md:text-3xl"></i>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">
              {t("completeProfile.success.profileSubmitted")}
            </h3>
            <p className="text-gray-600 text-sm md:text-base mb-4 md:mb-6">
              {t("completeProfile.success.submittedMessage")}
            </p>

            <div className="bg-blue-50 p-3 md:p-4 rounded-lg mb-4 md:mb-6 text-left">
              <h4 className="font-semibold text-blue-800 mb-1 md:mb-2 text-sm md:text-base">
                {t("completeProfile.success.whatHappensNext")}
              </h4>
              <ul className="text-xs md:text-sm text-blue-700 space-y-1">
                <li>{t("completeProfile.success.documentVerification")}</li>
                <li>{t("completeProfile.success.infoValidation")}</li>
                <li>{t("completeProfile.success.emailNotification")}</li>
                <li>{t("completeProfile.success.profileLive")}</li>
              </ul>
            </div>

            <div className="space-y-2 md:space-y-3">
              <Link
                href="/dashboard"
                className="block bg-yellow-400 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-yellow-500 font-medium whitespace-nowrap cursor-pointer w-full text-sm md:text-base"
              >
                <i className="ri-user-line mr-1 md:mr-2"></i>
                {t("completeProfile.buttons.viewProfile")}
              </Link>
              <Link
                href="/"
                className="block border border-gray-300 text-gray-600 px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-gray-50 font-medium whitespace-nowrap cursor-pointer w-full text-sm md:text-base"
              >
                {t("completeProfile.buttons.close")}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Branch Management Modal */}
      {showBranchManagement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 md:p-4">
          <div className="bg-white rounded-xl md:rounded-2xl max-w-7xl w-full max-h-screen overflow-y-auto">
            <div className="p-4 md:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                  {t("completeProfile.step4.manageBranches")}
                </h3>
                <button
                  onClick={() => setShowBranchManagement(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl md:text-2xl"
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
            </div>
            <div className="p-4 md:p-6">
              <BranchManagement
                branches={branches}
                setBranches={setBranches}
                mainBusinessData={formData}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
