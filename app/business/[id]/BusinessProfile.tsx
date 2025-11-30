"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useLanguage } from "../../../lib/LanguageContext";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import Link from "next/link";
import { apiService } from "../../../lib/api";
import { BusinessProfile as BusinessProfileType } from "../../../lib/api";
import { useAuth } from "@/lib/UserContext";

type BusinessProfileProps = {};

export default function BusinessProfile() {
  const router = useRouter();
  const params = useParams();
  const businessId = params?.id as string;
  const [viewStartTime, setViewStartTime] = useState<number | null>(null);
  const [sessionId] = useState(
    () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  );

  // Immediate redirection check
  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("supplier_user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        // Check if the current profile ID matches the logged-in user's ID
        if (user.id && user.id.toString() === businessId) {
          // Redirect to the user's profile page immediately
          router.replace(`/profile/${user.id}`);
          return;
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, [businessId, router]);

  // Check if user is logged in
  const isLoggedIn = () => {
    const userData = localStorage.getItem("supplier_user");
    return userData !== null;
  };

  // Track view duration
  useEffect(() => {
    // Start timer when component mounts
    const startTime = Date.now();
    setViewStartTime(startTime);

    // Get current user data for location
    const userData = localStorage.getItem("supplier_user");
    let location = "Unknown";

    if (userData) {
      try {
        const user = JSON.parse(userData);
        location = user.profile?.address || "Unknown";
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    // Track view when component mounts
    // Get businessType from localStorage user data
    let customerType = "Supplier";
    if (userData) {
      try {
        const user = JSON.parse(userData);
        customerType =
          user.profile?.businessType || user.businessType || "Supplier";
      } catch (error) {
        console.error("Error parsing user data for business type:", error);
      }
    }

    const trackView = async () => {
      if (!businessId) return;

      const duration = Math.floor((Date.now() - startTime) / 1000);

      // Only track if duration is at least 1 second
      if (duration < 1) return;

      try {
        await apiService.trackView({
          supplier_id: parseInt(businessId),
          location: location,
          customer_type: customerType,
          duration: duration,
          session_id: sessionId,
        });
      } catch (error) {
        console.error("Error tracking view:", error);
      }
    };

    // Track view after 1 second to ensure minimum duration
    setTimeout(() => {
      trackView();
    }, 1000);

    // Cleanup function - track duration when component unmounts
    return () => {
      // Track final duration when user leaves
      const finalDuration = Math.floor((Date.now() - startTime) / 1000);
      if (finalDuration >= 1) {
        apiService
          .trackView({
            supplier_id: parseInt(businessId),
            location: location,
            customer_type: customerType,
            duration: finalDuration,
            session_id: sessionId,
          })
          .catch((error) => console.error("Error tracking final view:", error));
      }
    };
  }, [businessId, sessionId]);

  const { t } = useLanguage();
  const [businessProfile, setBusinessProfile] =
    useState<BusinessProfileType | null>(null);
  const [businessPreferences, setBusinessPreferences] = useState<any>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showContact, setShowContact] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);
  const [submitUrl, setSubmitUrl] = useState("");
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
  });
  const { user } = useAuth();

  // Check if the current user is viewing their own profile
  const isOwnProfile = user?.id?.toString() == businessId;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchBusinessProfile = async () => {
      try {
        const profile = await apiService.getBusinessProfile(businessId);

        // Also fetch from public businesses API to get preferences
        try {
          const businessesResponse = await apiService.getBusinesses({
            per_page: 100,
          });
          const businessWithPreferences = businessesResponse.data.find(
            (b) => b.id.toString() === businessId
          );

          if (
            businessWithPreferences?.preferences?.profile_visibility ===
            "limited"
          ) {
            // Check if user is logged in
            const userData = localStorage.getItem("supplier_user");
            if (!userData) {
              // Not logged in, redirect to businesses page
              router.replace("/businesses");
              return;
            }
            // Logged in - allow access to any profile
          }

          // Store preferences for use in UI
          if (businessWithPreferences?.preferences) {
            setBusinessPreferences(businessWithPreferences.preferences);
          }
        } catch (prefError) {
          console.error("Error fetching preferences:", prefError);
          // If we can't get preferences, allow access (fallback)
        }

        setBusinessProfile(profile);
      } catch (error) {
        console.error("Error fetching business profile:", error);
      }
    };

    fetchBusinessProfile();
  }, [businessId, router]);

  useEffect(() => {
    const fetchFormUrl = async () => {
      if (showReviewModal) {
        setSubmitUrl("https://readdy.ai/api/form/d31ehr49rh45124cnfh0");
      }
    };
    fetchFormUrl();
  }, [showReviewModal]);

  const handleStarClick = (rating: number) => {
    setSelectedRating(rating);
  };

  const getRatingText = (rating: number) => {
    const texts =
      (t("businessProfile.ratingTexts") as unknown as string[]) || [];
    return texts[rating] || "";
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRating || !reviewText.trim() || !businessProfile) return;

    try {
      await apiService.submitReview(
        businessProfile.id,
        selectedRating,
        reviewText
      );

      setShowThankYou(true);
      setTimeout(async () => {
        setShowReviewModal(false);
        setShowThankYou(false);
        setSelectedRating(0);
        setReviewText("");

        // Refresh the business profile to show the new review
        try {
          const profile = await apiService.getBusinessProfile(businessId);
          setBusinessProfile(profile);
        } catch (error) {
          console.error("Failed to refresh business profile:", error);
        }
      }, 4000);
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  // Extend the BusinessProfile type to include products at the root level
  type BusinessProfileWithProducts = BusinessProfileType & {
    products?: Array<{
      id: number;
      product_name: string;
      created_at: string;
      updated_at: string;
    }>;
  };

  // Business data from API
  const business = {
    id: businessProfile?.id || "",
    name: businessProfile?.name || "",
    category: businessProfile?.profile?.category || "",
    businessType: businessProfile?.profile?.business_type || "",
    targetCustomers: businessProfile?.profile?.target_market || [],
    serviceDistance: businessProfile?.profile?.service_distance || "",
    rating: businessProfile?.ratings?.average || 0,
    reviewCount: businessProfile?.ratings?.count || 0,
    description: businessProfile?.profile?.description || "",
    address: businessProfile?.profile?.business_address || "",
    phone: businessProfile?.profile?.main_phone || "",
    email: businessProfile?.profile?.contact_email || "",
    website: businessProfile?.profile?.website || "",
    coordinates: {
      lat: businessProfile?.profile?.latitude
        ? parseFloat(businessProfile.profile.latitude)
        : 24.7136,
      lng: businessProfile?.profile?.longitude
        ? parseFloat(businessProfile.profile.longitude)
        : 46.6753,
    },
    services: [
      "Wholesale Electronics",
      "Components Supply",
      "Repair Parts",
      "Custom Orders",
      "Bulk Orders",
      "Emergency Services",
      "Technical Support",
      "Installation",
    ],
    // Dynamic products from API with fallback to empty array
    productsAndServices: (() => {
      const products = (businessProfile as BusinessProfileWithProducts)
        ?.products;
      if (!products || !Array.isArray(products)) {
        return [];
      }
      return products.map((product) => product?.product_name).filter(Boolean);
    })(),
    // Product images from API
    galleryImages: (() => {
      const productImages = businessProfile?.product_images || [];

      // If there are no product images, return a default image
      if (productImages.length === 0) {
        return [
          {
            url: "/images/placeholder-product.jpg",
            caption: "No product images available",
          },
        ];
      }

      // Map the product images to the gallery format
      return productImages.map((img, index) => ({
        url: img.image_url,
        caption: img.name || `Product ${index + 1}`,
      }));
    })(),
    workingHours: (() => {
      // Default working hours in case the API doesn't return any
      const defaultWorkingHours = {
        monday: { open: "09:00", close: "18:00", closed: false },
        tuesday: { open: "09:00", close: "18:00", closed: false },
        wednesday: { open: "09:00", close: "18:00", closed: false },
        thursday: { open: "09:00", close: "18:00", closed: false },
        friday: { open: "14:00", close: "22:00", closed: false },
        saturday: { open: "10:00", close: "16:00", closed: true },
        sunday: { open: "10:00", close: "16:00", closed: true },
      };

      // If no working hours from API, return defaults
      if (!businessProfile?.profile?.working_hours) {
        return defaultWorkingHours;
      }

      // Map API working hours to the expected format
      const apiWorkingHours = businessProfile.profile.working_hours;

      // Convert API format to our format
      const mappedWorkingHours = {
        monday: apiWorkingHours.monday || defaultWorkingHours.monday,
        tuesday: apiWorkingHours.tuesday || defaultWorkingHours.tuesday,
        wednesday: apiWorkingHours.wednesday || defaultWorkingHours.wednesday,
        thursday: apiWorkingHours.thursday || defaultWorkingHours.thursday,
        friday: apiWorkingHours.friday || defaultWorkingHours.friday,
        saturday: apiWorkingHours.saturday || defaultWorkingHours.saturday,
        sunday: apiWorkingHours.sunday || defaultWorkingHours.sunday,
      };

      return mappedWorkingHours;
    })(),
    images: [
      "https://readdy.ai/api/search-image?query=Modern%20electronics%20supply%20store%20interior%20with%20organized%20shelves%2C%20professional%20lighting%2C%20clean%20white%20background%2C%20electronic%20components%20and%20devices%20displayed%20neatly%2C%20contemporary%20retail%20space%20design%2C%20wide%20angle%20view&width=800&height=600&seq=electronics-main&orientation=landscape",
      "https://readdy.ai/api/search-image?query=Electronic%20components%20warehouse%20with%20organized%20storage%20systems%2C%20shelves%20full%20of%20electronic%20parts%2C%20professional%20industrial%20interior%2C%20bright%20lighting%2C%20clean%20organized%20workspace&width=800&height=600&seq=electronics-warehouse&orientation=landscape",
      "https://readdy.ai/api/search-image?query=Electronics%20repair%20workshop%20with%20professional%20tools%2C%20workbenches%2C%20testing%20equipment%2C%20organized%20tool%20storage%2C%20clean%20technical%20workspace%20environment&width=800&height=600&seq=electronics-workshop&orientation=landscape",
      "https://readdy.ai/api/search-image?query=Customer%20service%20area%20in%20electronics%20store%2C%20professional%20consultation%20desk%2C%20product%20displays%2C%20modern%20interior%20design%2C%20welcoming%20business%20environment&width=800&height=600&seq=electronics-service&orientation=landscape",
    ],
    reviews:
      businessProfile?.ratings?.reviews?.map((review) => ({
        id: review.id,
        customerName: review.user?.name || t("businessProfile.anonymous"),
        rating: review.rating,
        date: review.created_at,
        comment: review.comment,
        avatar: review.user?.avatar,
        reply: review.reply,
      })) || [],
  };

  const getCurrentStatus = () => {
    const now = new Date();
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ] as const;
    type DayKey = (typeof days)[number];
    const currentDay = days[now.getDay()];
    const currentTime = now.getHours() * 100 + now.getMinutes();

    const todayHours = business.workingHours[currentDay as DayKey];

    if (todayHours.closed)
      return { status: t("businessProfile.closed"), color: "text-red-600" };

    const openTime = parseInt(todayHours.open.replace(":", ""));
    const closeTime = parseInt(todayHours.close.replace(":", ""));

    if (currentTime >= openTime && currentTime <= closeTime) {
      return { status: t("businessProfile.openNow"), color: "text-green-600" };
    }

    return { status: t("businessProfile.closed"), color: "text-red-600" };
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

  const getBusinessTypeColor = (type: string): string => {
    switch (type) {
      case "Supplier":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Store":
        return "bg-green-100 text-green-700 border-green-200";
      case "Office":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Individual":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const status = getCurrentStatus();

  const handleInquirySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (inquiryForm.message.length > 500) {
      alert(
        t("businessProfile.messageTooLong") ||
          "Message must be 500 characters or less"
      );
      return;
    }

    if (!businessProfile) {
      console.error("Business profile not loaded");
      alert(
        t("businessProfile.businessNotLoaded") ||
          "Business information not loaded. Please try again."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await apiService.sendInquiry({
        receiver_supplier_id: businessProfile.id,
        sender_name: inquiryForm.name,
        company: inquiryForm.company,
        email: inquiryForm.email,
        phone: inquiryForm.phone,
        subject: inquiryForm.subject || `Inquiry from ${inquiryForm.name}`,
        message: inquiryForm.message,
      });

      setIsSubmitted(true);
    } catch (error: any) {
      console.error("Inquiry submission error:", error);
      const errorMessage =
        error?.message ||
        t("businessProfile.submissionError") ||
        "There was an error sending your message. Please try again.";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetInquiryForm = () => {
    setInquiryForm({
      name: "",
      email: "",
      phone: "",
      company: "",
      subject: "",
      message: "",
    });
    setIsSubmitted(false);
    setIsSubmitting(false);
    setShowInquiryModal(false);
  };

  const resetReviewForm = () => {
    setSelectedRating(0);
    setReviewText("");
    setShowThankYou(false);
    setShowReviewModal(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${
                businessProfile?.profile?.business_image ||
                businessProfile?.profile_image ||
                ""
              })`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>

          <div className="absolute inset-0 flex items-end">
            <div className="w-full px-4 md:px-6 pb-6 md:pb-8">
              <div className="max-w-4xl">
                <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-3 md:mb-4">
                  <span className="bg-yellow-400 text-white px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium">
                    {business.category}
                  </span>
                  <div
                    className={`${getBusinessTypeColor(
                      business.businessType
                    )} px-3 py-1 md:px-4 md:py-2 rounded-full flex items-center space-x-1 md:space-x-2 border text-xs md:text-sm`}
                  >
                    <i
                      className={`${getBusinessTypeIcon(
                        business.businessType
                      )} text-xs md:text-sm`}
                    ></i>
                    <span className="font-medium">{business.businessType}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`text-sm md:text-lg ${
                          i < Math.floor(business.rating)
                            ? "ri-star-fill text-yellow-400"
                            : "ri-star-line text-white"
                        }`}
                      ></i>
                    ))}
                    <span className="text-white ml-1 md:ml-2 text-xs md:text-sm font-medium">
                      {business.rating} ({business.reviewCount}{" "}
                      {t("businessProfile.ratingReviewsSuffix")})
                    </span>
                  </div>
                </div>
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                  {business.name}
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center text-white space-y-1 sm:space-y-0 sm:space-x-4 text-sm md:text-base">
                  <span
                    className={`font-semibold ${status.color.replace(
                      "text-",
                      "text-"
                    )}`}
                    style={{
                      color: status.color.includes("green")
                        ? "#10b981"
                        : "#dc2626",
                    }}
                  >
                    {status.status}
                  </span>
                  <span className="hidden sm:block">•</span>
                  <span className="flex items-center">
                    <i className="ri-map-pin-line mr-1"></i>
                    <span className="truncate">{business.address}</span>
                  </span>
                </div>
              </div>
            </div>
            {!isOwnProfile && (
              <div className="flex gap-3 mt-4 px-4 md:px-6 pb-6 md:pb-8">
                {businessPreferences?.allow_direct_contact !== false &&
                  isLoggedIn() && (
                    <button
                      onClick={() => setShowInquiryModal(true)}
                      className="px-8 py-3 rounded-full font-semibold whitespace-nowrap cursor-pointer transition-colors bg-yellow-400 hover:bg-yellow-500 text-white"
                    >
                      <i className="ri-message-line mr-2"></i>
                      {t("publicProfile.buttons.message")}
                    </button>
                  )}

                <button
                  disabled={businessPreferences?.allow_direct_contact === false}
                  className={`px-8 py-3 rounded-full font-semibold whitespace-nowrap cursor-pointer transition-colors border ${
                    businessPreferences?.allow_direct_contact === false
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300"
                      : "bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-gray-300"
                  }`}
                >
                  <i className="ri-phone-line mr-2"></i>
                  {t("publicProfile.buttons.call")}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Business Info Bar */}
        <section className="py-4 md:py-6 bg-gray-50 border-b border-gray-200">
          <div className="w-full px-4 md:px-6">
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 lg:gap-8">
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="ri-group-line text-blue-600 text-sm md:text-base"></i>
                </div>
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-800">
                    {t("businessProfile.targetCustomers")}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600">
                    {business.targetCustomers.join(", ")}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="ri-map-pin-range-line text-green-600 text-sm md:text-base"></i>
                </div>
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-800">
                    {t("businessProfile.serviceArea")}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600">
                    {t("businessProfile.upToDistance").replace(
                      "{{distance}}",
                      business.serviceDistance
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <i
                    className={`${getBusinessTypeIcon(
                      business.businessType
                    )} text-purple-600 text-sm md:text-base`}
                  ></i>
                </div>
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-800">
                    {t("businessProfile.businessType")}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600">
                    {business.businessType}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8 md:py-12">
          <div className="w-full px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 max-w-7xl mx-auto">
              {/* Left Column - Main Info */}
              <div className="lg:col-span-2 space-y-8 md:space-y-12">
                {/* About Section */}
                <div>
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 md:mb-6">
                    {t("businessProfile.aboutThisBusiness")}
                  </h2>
                  <p
                    className="text-gray-600 leading-relaxed text-base md:text-lg mb-8 
               break-words whitespace-pre-line"
                  >
                    {business.description}
                  </p>
                </div>

                {/* Products & Services Section - Excel-like Grid */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-2">
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">
                      {t("businessProfile.productsServices")}
                    </h2>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium w-fit">
                      {t("businessProfile.itemsCount").replace(
                        "{{count}}",
                        String(business.productsAndServices.length)
                      )}
                    </span>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-gray-50 px-3 py-2 md:px-4 md:py-3 border-b border-gray-200">
                      <div className="flex items-center space-x-2 md:space-x-3">
                        <i className="ri-list-check-2 text-blue-600 text-base md:text-lg"></i>
                        <h3 className="font-semibold text-gray-800 text-sm md:text-base">
                          {t("businessProfile.catalogTitle")}
                        </h3>
                      </div>
                      <p className="text-xs md:text-sm text-gray-600 mt-1">
                        {t("businessProfile.catalogSubtitle")}
                      </p>
                    </div>

                    {/* Excel-like Grid */}
                    <div className="max-h-80 md:max-h-96 overflow-y-auto">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-gray-200">
                        {business.productsAndServices.map((item, index) => (
                          <div
                            key={index}
                            className="bg-white p-2 md:p-3 hover:bg-blue-50 transition-colors border-r border-b border-gray-100 last:border-r-0"
                          >
                            <div className="flex items-center space-x-1 md:space-x-2">
                              <span className="text-xs text-gray-400 font-mono w-4 md:w-6 text-right">
                                {(index + 1).toString().padStart(2, "0")}
                              </span>
                              <span
                                className="text-xs md:text-sm text-gray-800 font-medium truncate"
                                title={item}
                              >
                                {item}
                              </span>
                            </div>
                          </div>
                        ))}

                        {/* Fill remaining cells if needed for visual consistency */}
                        {Array(4 - (business.productsAndServices.length % 4))
                          .fill(0)
                          .map(
                            (_, index) =>
                              business.productsAndServices.length % 4 !== 0 && (
                                <div
                                  key={`filler-${index}`}
                                  className="bg-gray-50 p-2 md:p-3 border-r border-b border-gray-100 last:border-r-0"
                                >
                                  <div className="text-xs text-gray-300">—</div>
                                </div>
                              )
                          )}
                      </div>
                    </div>

                    <div className="bg-blue-50 px-3 py-2 md:px-4 md:py-3 border-t border-blue-200">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm text-blue-700">
                          <i className="ri-search-line"></i>
                          <span>{t("businessProfile.customersCanSearch")}</span>
                        </div>
                        <div className="text-xs md:text-sm text-blue-600 font-medium">
                          {t("businessProfile.totalProductsServices").replace(
                            "{{count}}",
                            String(business.productsAndServices.length)
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business Gallery Section */}
                <div>
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 md:mb-6">
                    {t("businessProfile.businessGallery")}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {business.galleryImages.map((image, index) => (
                      <div
                        key={index}
                        className="relative group overflow-hidden rounded-xl md:rounded-2xl bg-white shadow-lg border border-gray-100"
                      >
                        <div className="aspect-[4/3] overflow-hidden">
                          <img
                            src={image.url}
                            alt={image.caption || `Business photo ${index + 1}`}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                        <div className="absolute top-2 right-2 md:top-3 md:right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button className="w-8 h-8 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white cursor-pointer">
                            <i className="ri-eye-line text-gray-700 text-sm md:text-base"></i>
                          </button>
                        </div>
                        {image.caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 md:p-4">
                            <p className="text-white text-xs md:text-sm font-medium">
                              {image.caption}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 md:mt-6 text-center">
                    <p className="text-gray-600 text-xs md:text-sm">
                      <i className="ri-camera-line mr-1 md:mr-2"></i>
                      {t("businessProfile.showcasingPhotos").replace(
                        "{{count}}",
                        String(business.galleryImages.length)
                      )}
                    </p>
                  </div>
                </div>

                {/* Reviews Section */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3">
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">
                      {t("businessProfile.customerReviews")}
                    </h2>
                    {isLoggedIn() && (
                      <button
                        onClick={() => setShowReviewModal(true)}
                        className="bg-yellow-400 text-white px-4 py-2 md:px-6 md:py-3 rounded-full hover:bg-yellow-500 font-medium whitespace-nowrap cursor-pointer flex items-center space-x-1 md:space-x-2 text-sm md:text-base"
                      >
                        <i className="ri-edit-line"></i>
                        <span>{t("businessProfile.writeAReview")}</span>
                      </button>
                    )}
                  </div>

                  {/* Review Summary */}
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl md:rounded-2xl p-4 md:p-6 mb-6 md:mb-8 border border-yellow-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
                      <div className="flex items-center space-x-4 md:space-x-6">
                        <div className="text-center">
                          <div className="text-2xl md:text-4xl font-bold text-gray-800">
                            {business.rating}
                          </div>
                          <div className="flex items-center justify-center space-x-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <i
                                key={i}
                                className={`text-sm md:text-lg ${
                                  i < Math.floor(business.rating)
                                    ? "ri-star-fill text-yellow-400"
                                    : "ri-star-line text-gray-300"
                                }`}
                              ></i>
                            ))}
                          </div>
                          <div className="text-xs md:text-sm text-gray-600 mt-1">
                            Overall Rating
                          </div>
                        </div>
                        <div className="h-12 md:h-16 w-px bg-yellow-300 hidden md:block"></div>
                        <div>
                          <div className="text-xl md:text-2xl font-bold text-gray-800">
                            {business.reviewCount}
                          </div>
                          <div className="text-xs md:text-sm text-gray-600">
                            Total Reviews
                          </div>
                        </div>
                      </div>
                      <div className="text-center md:text-right">
                        <div className="text-xs md:text-sm text-gray-600 mb-2">
                          Recent Reviews
                        </div>
                        <div className="flex flex-col space-y-1 max-w-xs mx-auto md:mx-0">
                          {[5, 4, 3, 2, 1].map((star) => {
                            const count = business.reviews.filter(
                              (r) => r.rating === star
                            ).length;
                            const percentage =
                              business.reviewCount > 0
                                ? (count / business.reviewCount) * 100
                                : 0;
                            return (
                              <div
                                key={star}
                                className="flex items-center space-x-2 text-xs"
                              >
                                <span className="w-3 text-gray-600">
                                  {star}
                                </span>
                                <i className="ri-star-fill text-yellow-400 text-xs"></i>
                                <div className="w-16 md:w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                                <span className="text-gray-500 w-6 text-right">
                                  {count}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 md:space-y-6">
                    {business.reviews.map((review) => (
                      <div
                        key={review.id}
                        className="bg-gray-50 rounded-xl p-4 md:p-6 border border-gray-100"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 md:mb-4 gap-2">
                          <div>
                            <h4 className="font-semibold text-gray-800 text-sm md:text-base">
                              {review.customerName}
                            </h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <i
                                    key={i}
                                    className={`text-xs md:text-sm ${
                                      i < review.rating
                                        ? "ri-star-fill text-yellow-400"
                                        : "ri-star-line text-gray-300"
                                    }`}
                                  ></i>
                                ))}
                              </div>
                              <span className="text-gray-500 text-xs md:text-sm">
                                {new Date(review.date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 leading-relaxed text-sm md:text-base mb-3">
                          {review.comment}
                        </p>

                        {/* Reply Section */}
                        {review.reply && (
                          <div className="bg-blue-50 rounded-lg p-3 md:p-4 border border-blue-100">
                            <div className="flex items-start space-x-2">
                              <i className="ri-reply-fill text-blue-500 mt-1"></i>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-medium text-blue-700 text-sm">
                                    رد العمل
                                  </span>
                                  <span className="text-blue-500 text-xs">
                                    {new Date(
                                      review.reply.created_at
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-blue-600 text-sm leading-relaxed">
                                  {review.reply.reply}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Contact & Info */}
              <div className="space-y-6 md:space-y-8">
                {/* Contact Information */}
                {isLoggedIn() && (
                  <div className="bg-white rounded-xl md:rounded-2xl shadow-sm p-4 md:p-6 border border-gray-100">
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 md:mb-4">
                      {t("businessProfile.contactInformation")}
                    </h3>

                    <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                      {businessPreferences?.show_phone_publicly !== false && (
                        <div className="flex items-center space-x-2 md:space-x-3">
                          <div className="w-8 h-8 md:w-10 md:h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                            <i className="ri-phone-line text-yellow-600 text-sm md:text-base"></i>
                          </div>
                          <div>
                            <p className="text-xs md:text-sm text-gray-600">
                              {t("businessProfile.phone")}
                            </p>
                            <p className="font-medium text-gray-800 text-sm md:text-base">
                              {business.phone}
                            </p>
                          </div>
                        </div>
                      )}

                      {businessPreferences?.show_email_publicly !== false && (
                        <div className="flex items-center space-x-2 md:space-x-3">
                          <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <i className="ri-mail-line text-blue-600 text-sm md:text-base"></i>
                          </div>
                          <div>
                            <p className="text-xs md:text-sm text-gray-600">
                              {t("businessProfile.email")}
                            </p>
                            <p className="font-medium text-gray-800 text-sm md:text-base">
                              {business.email}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-2 md:space-x-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <i className="ri-global-line text-green-600 text-sm md:text-base"></i>
                        </div>
                        <div>
                          <p className="text-xs md:text-sm text-gray-600">
                            {t("businessProfile.website")}
                          </p>
                          <p className="font-medium text-gray-800 text-sm md:text-base">
                            {business.website}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 md:space-x-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <i className="ri-map-pin-line text-purple-600 text-sm md:text-base"></i>
                        </div>
                        <div>
                          <p className="text-xs md:text-sm text-gray-600">
                            {t("businessProfile.address")}
                          </p>
                          <p className="font-medium text-gray-800 text-sm md:text-base">
                            {business.address}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2 md:gap-3">
                      {businessPreferences?.allow_direct_contact !== false && (
                        <button
                          onClick={() => setShowInquiryModal(true)}
                          className="bg-yellow-400 text-white py-2 md:py-3 px-3 md:px-4 rounded-lg hover:bg-yellow-500 font-medium text-xs md:text-sm whitespace-nowrap cursor-pointer flex items-center justify-center space-x-1 md:space-x-2"
                        >
                          <i className="ri-message-line"></i>
                          <span>{t("businessProfile.messageRequest")}</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Working Hours */}
                <div className="bg-white rounded-xl md:rounded-2xl shadow-xl p-4 md:p-6 border border-gray-100">
                  <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6">
                    {t("businessProfile.workingHours")}
                  </h3>
                  <div className="space-y-2 md:space-y-3">
                    {Object.entries(business.workingHours).map(
                      ([day, hours]) => (
                        <div
                          key={day}
                          className="flex justify-between items-center"
                        >
                          <span className="text-gray-700 font-medium text-sm md:text-base capitalize">
                            {day}
                          </span>
                          <span
                            className={`text-xs md:text-sm ${
                              hours.closed ? "text-red-600" : "text-gray-600"
                            }`}
                          >
                            {hours.closed
                              ? t("businessProfile.closedLabel")
                              : `${hours.open} - ${hours.close}`}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Location Map */}
                <div className="bg-white rounded-xl md:rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                  <div className="p-3 md:p-4 border-b border-gray-100">
                    <h3 className="text-base md:text-lg font-bold text-gray-800">
                      {t("businessProfile.location")}
                    </h3>
                  </div>
                  <div className="h-48 md:h-64 relative">
                    <iframe
                      src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2!2d${business.coordinates.lng}!3d${business.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${business.coordinates.lat}%2C${business.coordinates.lng}!5e0!3m2!1sen!2sus!4v1645123456789!5m2!1sen!2sus&disableDefaultUI=true&gestureHandling=none&scrollwheel=false&disableDoubleClickZoom=true&clickableIcons=false`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Business Location"
                    ></iframe>
                  </div>
                  <div className="p-3 md:p-4">
                    <button
                      onClick={() =>
                        window.open(
                          `https://www.google.com/maps/dir/?api=1&destination=${business.coordinates.lat},${business.coordinates.lng}`,
                          "_blank"
                        )
                      }
                      className="w-full bg-yellow-400 text-white py-2 px-3 md:px-4 rounded-lg hover:bg-yellow-500 font-medium text-xs md:text-sm whitespace-nowrap cursor-pointer flex items-center justify-center space-x-1 md:space-x-2"
                    >
                      <i className="ri-directions-line"></i>
                      <span>{t("businessProfile.getDirections")}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Back to Map CTA */}
        <section className="py-8 md:py-12 bg-yellow-50">
          <div className="w-full px-4 md:px-6 text-center">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 md:mb-4">
              {t("businessProfile.exploreMore")}
            </h2>
            <p className="text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto text-sm md:text-base">
              {t("businessProfile.discoverOthers")}
            </p>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              <Link
                href="/"
                className="bg-yellow-400 text-white px-6 py-3 md:px-8 md:py-4 rounded-full hover:bg-yellow-500 font-semibold whitespace-nowrap cursor-pointer text-sm md:text-base"
              >
                <i className="ri-map-line mr-1 md:mr-2"></i>
                {t("businessProfile.backToMap")}
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Business Inquiry Email Modal */}
      {showInquiryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50">
          <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {!isSubmitted ? (
              <>
                {/* Email Header */}
                <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center space-x-2 md:space-x-4">
                    <div className="w-8 h-8 md:w-12 md:h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <i className="ri-mail-line text-yellow-600 text-lg md:text-xl"></i>
                    </div>
                    <div>
                      <h2 className="text-lg md:text-xl font-bold text-gray-800">
                        {t("businessProfile.newMessage")}
                      </h2>
                      <p className="text-xs md:text-sm text-gray-600">
                        {t("businessProfile.toBusiness").replace(
                          "{{name}}",
                          business.name
                        )}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={resetInquiryForm}
                    className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full cursor-pointer"
                  >
                    <i className="ri-close-line text-lg md:text-xl"></i>
                  </button>
                </div>

                {/* Email Form */}
                <form
                  onSubmit={handleInquirySubmit}
                  className="p-4 md:p-6 space-y-3 md:space-y-4"
                  data-readdy-form
                  id="business-inquiry"
                >
                  {/* From Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                        <i className="ri-user-line mr-1"></i>
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={inquiryForm.name}
                        onChange={(e) =>
                          setInquiryForm({
                            ...inquiryForm,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-xs md:text-sm"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                        <i className="ri-building-line mr-1"></i>
                        Company
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={inquiryForm.company}
                        onChange={(e) =>
                          setInquiryForm({
                            ...inquiryForm,
                            company: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-xs md:text-sm"
                        placeholder="Your company name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                        <i className="ri-mail-line mr-1"></i>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={inquiryForm.email}
                        onChange={(e) =>
                          setInquiryForm({
                            ...inquiryForm,
                            email: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-xs md:text-sm"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                        <i className="ri-phone-line mr-1"></i>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={inquiryForm.phone}
                        onChange={(e) =>
                          setInquiryForm({
                            ...inquiryForm,
                            phone: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-xs md:text-sm"
                        placeholder="+966 5X XXX XXXX"
                      />
                    </div>
                  </div>

                  {/* Subject Line */}
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                      <i className="ri-price-tag-3-line mr-1"></i>
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      required
                      value={inquiryForm.subject}
                      onChange={(e) =>
                        setInquiryForm({
                          ...inquiryForm,
                          subject: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-xs md:text-sm"
                      placeholder="e.g., Product Inquiry, Quote Request, Partnership Opportunity"
                    />
                  </div>

                  {/* Message Body */}
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                      <i className="ri-message-2-line mr-1"></i>
                      Message *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={6}
                      value={inquiryForm.message}
                      onChange={(e) =>
                        setInquiryForm({
                          ...inquiryForm,
                          message: e.target.value,
                        })
                      }
                      maxLength={500}
                      className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-xs md:text-sm resize-none"
                      placeholder="Dear Team,

I am interested in your products/services and would like to discuss...

Please provide information about:
- Product availability
- Pricing details
- Delivery options

Thank you for your time.

Best regards,"
                    ></textarea>
                    <div className="flex justify-between items-center mt-1 md:mt-2">
                      <p className="text-xs text-gray-500">
                        This message will be sent directly to {business.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {inquiryForm.message.length}/500 characters
                      </p>
                    </div>
                  </div>

                  {/* Email Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 md:pt-4 border-t border-gray-200 gap-3">
                    <div className="flex items-center space-x-2 md:space-x-4">
                      <div className="flex items-center space-x-1 md:space-x-2 text-xs text-gray-600">
                        <i className="ri-time-line"></i>
                        <span>{t("businessProfile.businessHoursInline")}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2 md:space-x-3">
                      <button
                        type="button"
                        onClick={resetInquiryForm}
                        className="px-4 py-2 md:px-6 md:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium cursor-pointer text-xs md:text-sm"
                      >
                        {t("businessProfile.cancel")}
                      </button>
                      <button
                        type="submit"
                        disabled={
                          isSubmitting || inquiryForm.message.length > 500
                        }
                        className={`px-4 py-2 md:px-8 md:py-2 font-medium rounded-lg cursor-pointer flex items-center space-x-1 md:space-x-2 text-xs md:text-sm ${
                          isSubmitting || inquiryForm.message.length > 500
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            : "bg-yellow-400 text-white hover:bg-yellow-500"
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <i className="ri-loader-4-line animate-spin"></i>
                            <span>{t("businessProfile.sending")}</span>
                          </>
                        ) : (
                          <>
                            <i className="ri-send-plane-line"></i>
                            <span>{t("businessProfile.sendMessage")}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </>
            ) : (
              /* Success State */
              <div className="p-4 md:p-8 text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <i className="ri-mail-check-line text-green-600 text-2xl md:text-3xl"></i>
                </div>
                <h3 className="text-lg md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">
                  {t("businessProfile.messageSentTitle")}
                </h3>
                <p className="text-gray-600 mb-2 text-sm md:text-base">
                  Your inquiry has been sent to <strong>{business.name}</strong>
                </p>
                <p className="text-xs md:text-sm text-gray-500 mb-4 md:mb-6">
                  They typically respond within 24 hours during business hours
                </p>
                <div className="bg-yellow-50 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
                  <div className="flex items-start space-x-2 md:space-x-3">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="ri-lightbulb-line text-yellow-600 text-sm md:text-base"></i>
                    </div>
                    <div className="text-left">
                      <h4 className="text-xs md:text-sm font-medium text-yellow-800 mb-1">
                        {t("businessProfile.whatHappensNext")}
                      </h4>
                      <ul className="text-xs text-yellow-700 space-y-1">
                        <li>{t("businessProfile.nextSteps1")}</li>
                        <li>{t("businessProfile.nextSteps2")}</li>
                        <li>{t("businessProfile.nextSteps3")}</li>
                        <li>{t("businessProfile.nextSteps4")}</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <button
                  onClick={resetInquiryForm}
                  className="bg-yellow-400 text-white px-6 py-2 md:px-8 md:py-3 rounded-lg hover:bg-yellow-500 font-medium cursor-pointer text-sm md:text-base"
                >
                  {t("businessProfile.close")}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Review Writing Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 md:p-4">
          <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 md:p-6 rounded-t-xl md:rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg md:text-2xl font-bold text-white">
                    {t("businessProfile.writeReviewTitle")}
                  </h3>
                  <p className="text-yellow-100 mt-1 text-xs md:text-sm">
                    {t("businessProfile.shareExperience").replace(
                      "{{name}}",
                      business.name
                    )}
                  </p>
                </div>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="w-8 h-8 md:w-10 md:h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-all cursor-pointer"
                >
                  <i className="ri-close-line text-lg md:text-xl"></i>
                </button>
              </div>
            </div>

            {showThankYou ? (
              <div className="p-4 md:p-8 text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <i className="ri-check-line text-3xl md:text-4xl text-green-600"></i>
                </div>
                <h4 className="text-lg md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">
                  {t("businessProfile.thankYou")}
                </h4>
                <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
                  {t("businessProfile.reviewSubmitted")}
                </p>

                <div className="bg-blue-50 rounded-lg p-3 md:p-4 mb-4 md:mb-6 text-left">
                  <div className="flex items-start space-x-2 md:space-x-3">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="ri-information-line text-blue-600 text-sm md:text-base"></i>
                    </div>
                    <div>
                      <h4 className="text-xs md:text-sm font-medium text-blue-800 mb-1 md:mb-2">
                        Review Process
                      </h4>
                      <ul className="text-xs text-blue-700 space-y-1">
                        <li>• Your review is now pending admin approval</li>
                        <li>
                          • Reviews are typically approved within 24-48 hours
                        </li>
                        <li>
                          • Once approved, it will appear on the business
                          profile
                        </li>
                        <li>
                          • The business owner will be notified of your review
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 md:p-4 text-left">
                  <h5 className="text-xs md:text-sm font-medium text-gray-800 mb-1 md:mb-2">
                    Your Submitted Review:
                  </h5>
                  <div className="flex items-center mb-1 md:mb-2">
                    <div className="flex text-yellow-400 mr-1 md:mr-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i
                          key={star}
                          className={`text-sm md:text-lg ${
                            star <= selectedRating
                              ? "ri-star-fill"
                              : "ri-star-line"
                          }`}
                        ></i>
                      ))}
                    </div>
                    <span className="text-xs md:text-sm text-gray-600">
                      ({getRatingText(selectedRating)})
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-700">
                    {reviewText}
                  </p>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleReviewSubmit}
                className="p-4 md:p-6 space-y-4 md:space-y-6"
                data-readdy-form
                id="business-review"
              >
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2 md:mb-3">
                    <i className="ri-star-line mr-1"></i>Rating *
                  </label>
                  <div className="flex items-center space-x-1 md:space-x-2 mb-1 md:mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleStarClick(star)}
                        className={`w-8 h-8 md:w-12 md:h-12 flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer ${
                          star <= selectedRating
                            ? "text-yellow-400 bg-yellow-50"
                            : "text-gray-300 hover:text-yellow-300 hover:bg-gray-50"
                        }`}
                      >
                        <i
                          className={`text-lg md:text-2xl ${
                            star <= selectedRating
                              ? "ri-star-fill"
                              : "ri-star-line"
                          }`}
                        ></i>
                      </button>
                    ))}
                    {selectedRating > 0 && (
                      <span className="ml-2 md:ml-3 text-xs md:text-sm font-medium text-gray-700">
                        {getRatingText(selectedRating)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Click on stars to rate your experience
                  </p>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    <i className="ri-message-2-line mr-1"></i>Your Review *
                  </label>
                  <textarea
                    name="review"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    required
                    rows={4}
                    maxLength={500}
                    className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-xs md:text-sm resize-none"
                    placeholder="Share your experience with this business. What did you like? How was their service? Would you recommend them to others? Please be honest and constructive in your feedback."
                  />
                  <div className="flex justify-between items-center mt-1 md:mt-2">
                    <p className="text-xs text-gray-500">
                      Your review will help others make informed decisions
                    </p>
                    <p className="text-xs text-gray-500">
                      {reviewText.length}/500 characters
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-3 md:p-4">
                  <div className="flex items-start space-x-2 md:space-x-3">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="ri-information-line text-blue-600 text-sm md:text-base"></i>
                    </div>
                    <div>
                      <h4 className="text-xs md:text-sm font-medium text-blue-800 mb-1 md:mb-2">
                        {t("businessProfile.reviewGuidelines")}
                      </h4>
                      <ul className="text-xs text-blue-700 space-y-1">
                        <li>{t("businessProfile.guidelines1")}</li>
                        <li>{t("businessProfile.guidelines2")}</li>
                        <li>{t("businessProfile.guidelines3")}</li>
                        <li>{t("businessProfile.guidelines4")}</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 md:pt-4 border-t border-gray-200 gap-3">
                  <div className="text-xs text-gray-500">
                    {t("businessProfile.moderationNotice")}
                  </div>
                  <div className="flex space-x-2 md:space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowReviewModal(false)}
                      className="px-4 py-2 md:px-6 md:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium cursor-pointer text-xs md:text-sm"
                    >
                      {t("businessProfile.cancel")}
                    </button>
                    <button
                      type="submit"
                      disabled={!selectedRating || !reviewText.trim()}
                      className={`px-4 py-2 md:px-8 md:py-2 font-medium rounded-lg cursor-pointer flex items-center space-x-1 md:space-x-2 text-xs md:text-sm ${
                        selectedRating && reviewText.trim()
                          ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                          : "bg-gray-400 text-white cursor-not-allowed"
                      }`}
                    >
                      <i className="ri-send-plane-line"></i>
                      <span>{t("businessProfile.submitReview")}</span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
