"use client";

import { useState } from "react";
import type React from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { SupplierProfile, apiService } from "@/lib/api";
import { useAuth } from "@/lib/UserContext";

type WorkingDay = {
  open: string;
  close: string;
  closed: boolean;
};

type WorkingHoursRecord = {
  sunday: WorkingDay;
  monday: WorkingDay;
  tuesday: WorkingDay;
  wednesday: WorkingDay;
  thursday: WorkingDay;
  friday: WorkingDay;
  saturday: WorkingDay;
};

type Business = {
  id: string;
  name: string;
  logo: string;
  category: string;
  business_image: string;
  businessType: "Supplier" | "Store" | "Office" | "Individual";
  targetCustomers: string[];
  serviceDistance: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  openNow: boolean;
  description: string;
  address: string;
  phone: string;
  salesPhone: string;
  supportPhone: string;
  email: string;
  website: string;
  workingHours: WorkingHoursRecord;
  services: string[];
  images: string[];
  productPhotos: string[];
  specialties: string[];
  certifications: string[];
  establishedYear: number;
  employeeCount: string;
  languages: string[];
  latitude: number;
  longitude: number;
};

type Review = {
  id: number;
  customerName: string;
  rating: number;
  date: string;
  comment: string;
};

type PublicBusinessProfileProps = {
  supplier?: SupplierProfile;
  businessId?: string;
};

export default function PublicBusinessProfile({
  supplier,
  businessId,
}: PublicBusinessProfileProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [replyForm, setReplyForm] = useState({
    reply: "",
  });
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [replyError, setReplyError] = useState("");
  const { t } = useLanguage();
  const { user } = useAuth();

  // Check if the current user is viewing their own profile
  const isOwnProfile = user?.id?.toString() == businessId;
  // Helper function to safely handle translations
  const safeT = (
    key: string,
    replacements: Record<string, string> = {}
  ): string => {
    const raw = t(key) as unknown as any;
    const initial: string =
      typeof raw === "object" && raw !== null
        ? String(raw.title ?? raw.text ?? raw.value ?? "")
        : String(raw);
    let result = initial;
    Object.keys(replacements).forEach((placeholder) => {
      result = result.replace(`{{${placeholder}}}`, replacements[placeholder]);
    });
    return result;
  };

  // Helper function to safely get nested translation object
  const getNestedTranslation = (key: string): Record<string, string> => {
    try {
      const translation = t(key) as unknown;
      if (translation && typeof translation === "object") {
        return translation as Record<string, string>;
      }
      return {};
    } catch (e) {
      return {};
    }
  };

  // Helper function to get translated business type
  const getTranslatedBusinessType = (type: string): string => {
    if (!type) return type;
    const businessTypes = getNestedTranslation("publicProfile.businessTypes");
    return businessTypes[type.toLowerCase()] || type;
  };

  // Helper function to get translated status
  const getTranslatedStatus = (status: string): string => {
    if (!status) return status;
    const statuses = getNestedTranslation("publicProfile.status");
    return statuses[status.toLowerCase()] || status;
  };

  // Helper function to get translated phone type
  const getTranslatedPhoneType = (type: string): string => {
    if (!type) return type;
    const phoneTypes = getNestedTranslation("publicProfile.phoneTypes");
    return phoneTypes[type.toLowerCase()] || type;
  };

  // Map API data to business object
  const business: Business = {
    id: supplier?.id?.toString() || businessId || "1",
    name: supplier?.name || "",
    logo: supplier?.profile_image || "/images/business-logo.png",
    category: supplier?.profile?.category || "",
    business_image:
      supplier?.profile?.business_image || supplier?.profile_image || "",
    businessType: "Supplier",
    targetCustomers: supplier?.profile?.target_market || [],
    serviceDistance: supplier?.profile?.service_distance || "",
    rating: supplier?.ratings?.average || 0,
    reviewCount: supplier?.ratings?.count || 0,
    verified: true,
    openNow: true, // You might want to calculate this based on working hours
    description: supplier?.profile?.description || "",
    address: supplier?.profile?.business_address || "",
    phone: supplier?.profile?.main_phone || "",
    latitude: supplier?.profile?.latitude
      ? parseFloat(supplier.profile.latitude)
      : 24.7136,
    longitude: supplier?.profile?.longitude
      ? parseFloat(supplier.profile.longitude)
      : 46.6753,
    salesPhone:
      supplier?.profile?.additional_phones?.find((p) => p.type === "sales")
        ?.number || "",
    supportPhone:
      supplier?.profile?.additional_phones?.find((p) => p.type === "support")
        ?.number || "",
    email: supplier?.profile?.contact_email || "",
    website: supplier?.profile?.website || "",
    workingHours: {
      sunday: supplier?.profile?.working_hours?.sunday || {
        open: "",
        close: "",
        closed: true,
      },
      monday: supplier?.profile?.working_hours?.monday || {
        open: "",
        close: "",
        closed: true,
      },
      tuesday: supplier?.profile?.working_hours?.tuesday || {
        open: "",
        close: "",
        closed: true,
      },
      wednesday: supplier?.profile?.working_hours?.wednesday || {
        open: "",
        close: "",
        closed: true,
      },
      thursday: supplier?.profile?.working_hours?.thursday || {
        open: "",
        close: "",
        closed: true,
      },
      friday: supplier?.profile?.working_hours?.friday || {
        open: "",
        close: "",
        closed: true,
      },
      saturday: supplier?.profile?.working_hours?.saturday || {
        open: "",
        close: "",
        closed: true,
      },
    },
    services: supplier?.services?.map((s) => s.service_name) || [],
    images: supplier?.product_images?.map((img) => img.image_url) || [],
    productPhotos: supplier?.product_images?.map((img) => img.image_url) || [],
    specialties: supplier?.profile?.services_offered || [],
    certifications:
      supplier?.certifications?.map((c) => c.certification_name) || [],
    establishedYear: new Date().getFullYear(), // Default to current year
    employeeCount: "", // Not provided in the API
    languages: ["Arabic", "English"], // Default languages
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
    const currentDay = days[now.getDay()] as keyof WorkingHoursRecord;
    const currentTime = now.getHours() * 100 + now.getMinutes();

    const todayHours = business.workingHours[currentDay];

    if (todayHours.closed)
      return { status: "Closed Today", color: "text-red-600" };

    const openTime = parseInt(todayHours.open.replace(":", ""));
    const closeTime = parseInt(todayHours.close.replace(":", ""));

    if (currentTime >= openTime && currentTime <= closeTime) {
      return { status: "Open Now", color: "text-green-600" };
    }

    return { status: "Closed", color: "text-red-600" };
  };

  const getBusinessTypeIcon = (type: Business["businessType"]) => {
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

  const getBusinessTypeColor = (type: Business["businessType"]) => {
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

  // Get reviews from API response or use empty array if not available
  const reviews: Review[] =
    supplier?.ratings?.reviews?.map((review) => ({
      id: review.id,
      customerName: review.user?.name || t("businessProfile.anonymous"),
      rating: review.rating,
      date: new Date(review.created_at).toISOString().split("T")[0], // Format date as YYYY-MM-DD
      comment: review.comment || t("businessProfile.noComment"),
    })) || [];

  const handleInquirySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (inquiryForm.message.length > 500) {
      alert("Message must be 500 characters or less");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", inquiryForm.name);
      formData.append("email", inquiryForm.email);
      formData.append("phone", inquiryForm.phone);
      formData.append("company", inquiryForm.company);
      formData.append("subject", inquiryForm.subject);
      formData.append("message", inquiryForm.message);
      formData.append("business_name", business.name);
      formData.append("business_id", business.id);

      const response = await fetch(
        "https://readdy.ai/api/form/d30bvun348pq0eno6930",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      alert("There was an error sending your message. Please try again.");
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

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative">
          <div className="h-80 relative overflow-hidden">
            <img
              src={business.business_image}
              alt={business.name}
              className="w-full h-full object-cover object-top"
            />
            <div
              className="absolute inset-0 bg-yellow-100"
              style={{
                backgroundImage: `url(${business.business_image || ""})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            ></div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div className="flex items-end gap-6">
                  <div className="w-32 h-32 bg-yellow-100 rounded-2xl shadow-lg border-4 border-white overflow-hidden flex-shrink-0 flex items-center justify-center">
                    <img
                      src={business.logo}
                      alt={`${business.name} Logo`}
                      className="w-80 h-80 object-contain"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-yellow-400 text-white px-4 py-2 rounded-full text-sm font-semibold">
                        {business.category}
                      </span>
                      <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full flex items-center gap-2 border border-yellow-200 backdrop-blur-sm">
                        <i className="ri-store-3-line text-sm"></i>
                        <span className="text-sm font-medium">
                          {getTranslatedBusinessType(
                            supplier?.profile?.business_type ||
                              business.businessType
                          )}
                        </span>
                      </div>
                      {supplier?.status && (
                        <div
                          className={`${
                            supplier.status.toLowerCase() === "pending"
                              ? "bg-yellow-500"
                              : supplier.status.toLowerCase() === "verified"
                              ? "bg-green-500"
                              : "bg-gray-500"
                          } text-white px-4 py-2 rounded-full flex items-center gap-2`}
                        >
                          <i
                            className={`ri-${
                              supplier.status.toLowerCase() === "verified"
                                ? "verified-badge-fill"
                                : "time-line"
                            } text-sm`}
                          ></i>
                          <span className="text-sm font-medium capitalize">
                            {getTranslatedStatus(supplier.status)}
                          </span>
                        </div>
                      )}
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
                      {business.name}
                    </h1>

                    <div className="flex items-center gap-6 text-gray-700">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={`text-lg ${
                                i < Math.floor(business.rating)
                                  ? "ri-star-fill text-yellow-400"
                                  : "ri-star-line text-gray-400"
                              }`}
                            ></i>
                          ))}
                        </div>
                        <span className="font-semibold">{business.rating}</span>
                        <span className="text-gray-600">
                          ({business.reviewCount} {t("publicProfile.reviews")})
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <i className="ri-time-line"></i>
                        <span
                          className={`font-medium ${status.color.replace(
                            "text-",
                            ""
                          )}`}
                          style={{
                            color: status.color.includes("green")
                              ? "#10b981"
                              : "#dc2626",
                          }}
                        >
                          {status.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <i className="ri-map-pin-line"></i>
                        <span className="text-gray-600">
                          {supplier?.profile?.business_address ||
                            t("publicProfile.defaultAddress")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {!isOwnProfile && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowInquiryModal(true)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-8 py-3 rounded-full font-semibold whitespace-nowrap cursor-pointer transition-colors"
                    >
                      <i className="ri-message-line mr-2"></i>
                      {t("publicProfile.buttons.message")}
                    </button>
                    <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-gray-700 px-8 py-3 rounded-full font-semibold whitespace-nowrap cursor-pointer transition-colors border border-gray-300">
                      <i className="ri-phone-line mr-2"></i>
                      {t("publicProfile.buttons.callNow")}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="space-y-16">
              {/* About Section */}
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  {safeT("publicProfile.about.title", { name: business.name })}
                </h2>
                <p
                  className="text-gray-600 leading-relaxed text-base md:text-lg mb-8 
               break-words whitespace-pre-line"
                >
                  {business.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-yellow-50 rounded-2xl p-6">
                    <h3 className="font-bold text-gray-800 mb-3">
                      {t("publicProfile.about.targetCustomers")}
                    </h3>
                    <div className="space-y-2">
                      {business.targetCustomers.map(
                        (customer: string, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <i className="ri-check-line text-yellow-600"></i>
                            <span className="text-gray-700">{customer}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-2xl p-6">
                    <h3 className="font-bold text-gray-800 mb-3">
                      {t("publicProfile.about.serviceCoverage")}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <i className="ri-map-pin-range-line text-blue-600"></i>
                      <span className="text-gray-700">
                        {supplier?.profile?.service_distance ||
                          business.serviceDistance}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="ri-map-pin-line text-blue-600"></i>
                      <span className="text-gray-700">
                        {supplier?.profile?.business_address ||
                          t("publicProfile.about.riyadhArea")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact, Hours, Location Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Contact Information */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">
                    {t("publicProfile.contact.title")}
                  </h3>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <i className="ri-phone-line text-yellow-600"></i>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          {t("publicProfile.contact.mainPhone")}
                        </p>
                        <a
                          href={`tel:${business.phone}`}
                          className="text-gray-800 font-medium hover:text-yellow-600"
                        >
                          {business.phone}
                        </a>
                      </div>
                    </div>

                    {supplier?.profile?.additional_phones?.map(
                      (phone, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 ${
                              phone.type === "sales"
                                ? "bg-blue-100"
                                : "bg-green-100"
                            } rounded-full flex items-center justify-center`}
                          >
                            <i
                              className={`${
                                phone.type === "sales"
                                  ? "ri-user-line text-blue-600"
                                  : "ri-customer-service-2-line text-green-600"
                              }`}
                            ></i>
                          </div>
                          <div>
                            <div>
                              <p className="text-sm text-gray-500">
                                {getTranslatedPhoneType(phone.type)}
                              </p>
                              <a
                                href={`tel:${phone.number}`}
                                className="text-gray-800 font-medium hover:text-blue-600 block"
                              >
                                {phone.number}
                              </a>
                              {phone.name && (
                                <span className="text-xs text-gray-500 block">
                                  {phone.name}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    )}

                    {(!supplier?.profile?.additional_phones ||
                      supplier.profile.additional_phones.length === 0) && (
                      <>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <i className="ri-user-line text-blue-600"></i>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              {t("publicProfile.contact.salesTeam")}
                            </p>
                            <span className="text-gray-800 font-medium">
                              {t("publicProfile.contact.notAvailable")}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <i className="ri-customer-service-2-line text-green-600"></i>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              {t("publicProfile.contact.supportTeam")}
                            </p>
                            <span className="text-gray-800 font-medium">
                              {t("publicProfile.contact.notAvailable")}
                            </span>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <i className="ri-mail-line text-yellow-600"></i>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          {t("publicProfile.contact.email")}
                        </p>
                        <a
                          href={`mailto:${business.email}`}
                          className="text-gray-800 font-medium hover:text-yellow-600"
                        >
                          {business.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <i className="ri-global-line text-yellow-600"></i>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          {t("publicProfile.contact.website")}
                        </p>
                        <a
                          href={business.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-800 font-medium hover:text-yellow-600"
                        >
                          {t("publicProfile.contact.visitWebsite")}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <i className="ri-map-pin-line text-yellow-600"></i>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          {t("publicProfile.contact.address")}
                        </p>
                        <p className="text-gray-800 font-medium">
                          {business.address}
                        </p>
                      </div>
                    </div>
                  </div>

                  {!isOwnProfile && (
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <button
                        onClick={() => setShowInquiryModal(true)}
                        className="bg-yellow-400 text-white py-3 px-4 rounded-lg hover:bg-yellow-500 font-medium text-sm whitespace-nowrap cursor-pointer"
                      >
                        <i className="ri-message-line mr-2"></i>
                        {t("publicProfile.buttons.message")}
                      </button>
                      <button className="border border-yellow-400 text-yellow-600 py-3 px-4 rounded-lg hover:bg-yellow-50 font-medium text-sm whitespace-nowrap cursor-pointer">
                        <i className="ri-phone-line mr-2"></i>
                        {t("publicProfile.buttons.call")}
                      </button>
                    </div>
                  )}
                </div>

                {/* Working Hours */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">
                    {t("publicProfile.workingHours.title")}
                  </h3>
                  <div className="space-y-3">
                    {(
                      Object.entries(business.workingHours) as [
                        keyof WorkingHoursRecord,
                        WorkingDay
                      ][]
                    ).map(([day, hours]) => (
                      <div
                        key={day}
                        className="flex justify-between items-center"
                      >
                        <span className="text-gray-700 font-medium capitalize">
                          {t(`publicProfile.workingHours.days.${day}`)}
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            hours.closed ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          {hours.closed
                            ? t("publicProfile.workingHours.closed")
                            : `${hours.open} - ${hours.close}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Location Map */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800">
                      {t("publicProfile.location.title")}
                    </h3>
                  </div>
                  <div className="h-64">
                    <iframe
                      src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2!2d${business.longitude}!3d${business.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${business.latitude}%2C${business.longitude}!5e0!3m2!1sen!2sus!4v1645123456789!5m2!1sen!2sus&disableDefaultUI=true&gestureHandling=none&scrollwheel=false&disableDoubleClickZoom=true&clickableIcons=false`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Business Location"
                    ></iframe>
                  </div>
                  <div className="p-4">
                    <button className="w-full bg-yellow-400 text-white py-2 px-4 rounded-lg hover:bg-yellow-500 font-medium text-sm whitespace-nowrap cursor-pointer">
                      <i className="ri-directions-line mr-2"></i>
                      {t("publicProfile.location.getDirections")}
                    </button>
                  </div>
                </div>
              </div>

              {/* Photos Section */}
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  {t("publicProfile.photos.title")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {business.productPhotos.map(
                    (photo: string, index: number) => (
                      <div
                        key={index}
                        className="relative group overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-100"
                      >
                        <div className="aspect-[4/3] overflow-hidden">
                          <img
                            src={photo}
                            alt={`${t("publicProfile.photos.productAlt")} ${
                              index + 1
                            }`}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white cursor-pointer"
                            aria-label="Preview photo"
                          >
                            <i className="ri-eye-line text-gray-700"></i>
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
                <div className="mt-6 text-center">
                  <p className="text-gray-600 text-sm">
                    <i className="ri-camera-line mr-2"></i>
                    {t("publicProfile.photos.description")}
                  </p>
                </div>
              </div>

              {/* Services Section */}
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  {t("publicProfile.services.title")}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {business.services.map((service: string, index: number) => (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 rounded-xl p-4 hover:border-yellow-400 hover:shadow-md transition-all"
                    >
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
                        <i className="ri-check-line text-yellow-600 text-lg"></i>
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-1">
                        {service}
                      </h3>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specialties & Certifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    {t("publicProfile.specialties.title")}
                  </h2>
                  <div className="space-y-3">
                    {business.specialties.map(
                      (specialty: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 bg-blue-50 rounded-lg p-3"
                        >
                          <i className="ri-star-line text-blue-600"></i>
                          <span className="font-medium text-gray-800">
                            {specialty}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    {t("publicProfile.certifications.title")}
                  </h2>
                  <div className="space-y-3">
                    {business.certifications.map(
                      (cert: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 bg-green-50 rounded-lg p-3"
                        >
                          <i className="ri-shield-check-line text-green-600"></i>
                          <span className="font-medium text-gray-800">
                            {cert}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Customer Reviews */}
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  {t("publicProfile.reviews.title")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-gray-50 rounded-2xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-bold text-gray-800">
                            {review.customerName}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <i
                                  key={i}
                                  className={`text-sm ${
                                    i < review.rating
                                      ? "ri-star-fill text-yellow-400"
                                      : "ri-star-line text-gray-300"
                                  }`}
                                ></i>
                              ))}
                            </div>
                            <span className="text-gray-500 text-sm">
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedReview(review);
                            setShowReplyModal(true);
                          }}
                          className="text-yellow-600 hover:text-yellow-700 px-3 py-1 rounded-lg border border-yellow-300 hover:bg-yellow-50 text-sm font-medium cursor-pointer transition-colors"
                        >
                          <i className="ri-reply-line mr-1"></i>
                          Reply
                        </button>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-yellow-400 to-yellow-500">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {t("publicProfile.cta.title")}
            </h2>
            <p className="text-white/90 text-lg mb-8">
              {safeT("publicProfile.cta.subtitle", { name: business.name })}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setShowInquiryModal(true)}
                className="bg-white text-yellow-600 px-8 py-4 rounded-full hover:bg-gray-50 font-semibold whitespace-nowrap cursor-pointer"
              >
                <i className="ri-message-line mr-2"></i>
                {t("publicProfile.buttons.message")}
              </button>
              <Link
                href="/businesses"
                className="border-2 border-white text-white px-8 py-4 rounded-full hover:bg-white hover:text-yellow-600 font-semibold whitespace-nowrap cursor-pointer"
              >
                <i className="ri-arrow-left-line mr-2"></i>
                {t("publicProfile.cta.browseMore")}
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Business Inquiry Modal */}
      {showInquiryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {!isSubmitted ? (
              <>
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <i className="ri-mail-line text-yellow-600 text-xl"></i>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        {t("publicProfile.inquiry.newMessage")}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {t("publicProfile.inquiry.to")}: {business.name}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={resetInquiryForm}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full cursor-pointer"
                  >
                    <i className="ri-close-line text-xl"></i>
                  </button>
                </div>

                <form
                  onSubmit={handleInquirySubmit}
                  className="p-6 space-y-4"
                  data-readdy-form
                  id="business-inquiry"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <i className="ri-user-line mr-1"></i>
                        {t("publicProfile.inquiry.form.name")}
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                        placeholder={t(
                          "publicProfile.inquiry.form.namePlaceholder"
                        )}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <i className="ri-building-line mr-1"></i>
                        {t("publicProfile.inquiry.form.company")}
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                        placeholder={t(
                          "publicProfile.inquiry.form.companyPlaceholder"
                        )}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <i className="ri-mail-line mr-1"></i>
                        {t("publicProfile.inquiry.form.email")}
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                        placeholder={t(
                          "publicProfile.inquiry.form.emailPlaceholder"
                        )}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <i className="ri-phone-line mr-1"></i>
                        {t("publicProfile.inquiry.form.phone")}
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                        placeholder={t(
                          "publicProfile.inquiry.form.phonePlaceholder"
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <i className="ri-price-tag-3-line mr-1"></i>
                      {t("publicProfile.inquiry.form.subject")}
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                      placeholder={t(
                        "publicProfile.inquiry.form.subjectPlaceholder"
                      )}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <i className="ri-message-2-line mr-1"></i>
                      {t("publicProfile.inquiry.form.message")}
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={8}
                      value={inquiryForm.message}
                      onChange={(e) =>
                        setInquiryForm({
                          ...inquiryForm,
                          message: e.target.value,
                        })
                      }
                      maxLength={500}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm resize-none"
                      placeholder={t(
                        "publicProfile.inquiry.form.messagePlaceholder"
                      )}
                    ></textarea>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-gray-500">
                        {safeT("publicProfile.inquiry.form.messageSentTo", {
                          name: business.name,
                        })}
                      </p>
                      <p className="text-xs text-gray-500">
                        {inquiryForm.message.length}/500{" "}
                        {t("publicProfile.inquiry.form.characters")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <i className="ri-time-line"></i>
                        <span>
                          {t("publicProfile.inquiry.form.businessHours")}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={resetInquiryForm}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium cursor-pointer"
                      >
                        {t("publicProfile.inquiry.form.cancel")}
                      </button>
                      <button
                        type="submit"
                        disabled={
                          isSubmitting || inquiryForm.message.length > 500
                        }
                        className={`px-8 py-2 font-medium rounded-lg cursor-pointer flex items-center space-x-2 ${
                          isSubmitting || inquiryForm.message.length > 500
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            : "bg-yellow-400 text-white hover:bg-yellow-500"
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <i className="ri-loader-4-line animate-spin"></i>
                            <span>
                              {t("publicProfile.inquiry.form.sending")}
                            </span>
                          </>
                        ) : (
                          <>
                            <i className="ri-send-plane-line"></i>
                            <span>{t("publicProfile.inquiry.form.send")}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </>
            ) : (
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="ri-mail-check-line text-green-600 text-3xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {t("publicProfile.inquiry.success.title")}
                </h3>
                <p className="text-gray-600 mb-2">
                  {t("publicProfile.inquiry.success.sent")}{" "}
                  <strong>{business.name}</strong>
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  {t("publicProfile.inquiry.success.response")}
                </p>
                <div className="bg-yellow-50 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="ri-lightbulb-line text-yellow-600"></i>
                    </div>
                    <div className="text-left">
                      <h4 className="text-sm font-medium text-yellow-800 mb-1">
                        {t("publicProfile.inquiry.success.whatNext")}
                      </h4>
                      <ul className="text-xs text-yellow-700 space-y-1">
                        <li>• {t("publicProfile.inquiry.success.step1")}</li>
                        <li>• {t("publicProfile.inquiry.success.step2")}</li>
                        <li>• {t("publicProfile.inquiry.success.step3")}</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <button
                  onClick={resetInquiryForm}
                  className="bg-yellow-400 text-white px-8 py-3 rounded-lg hover:bg-yellow-500 font-medium cursor-pointer"
                >
                  {t("publicProfile.inquiry.success.close")}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <i className="ri-reply-line text-yellow-600 text-xl"></i>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Reply to Review
                  </h2>
                  <p className="text-sm text-gray-600">
                    From: {selectedReview.customerName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowReplyModal(false);
                  setSelectedReview(null);
                  setReplyForm({ reply: "" });
                }}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full cursor-pointer"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="p-6">
              {/* Original Review */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-bold text-gray-800">
                    {selectedReview.customerName}
                  </h4>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`text-sm ${
                          i < selectedReview.rating
                            ? "ri-star-fill text-yellow-400"
                            : "ri-star-line text-gray-300"
                        }`}
                      ></i>
                    ))}
                  </div>
                  <span className="text-gray-500 text-sm">
                    {new Date(selectedReview.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-600">
                  {selectedReview.comment}
                </p>
              </div>

              {/* Reply Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="ri-message-2-line mr-1"></i>
                    Your Reply
                  </label>
                  <textarea
                    value={replyForm.reply}
                    onChange={(e) =>
                      setReplyForm({ reply: e.target.value })
                    }
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm resize-none"
                    placeholder="Write your reply to this review..."
                  ></textarea>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <i className="ri-information-line"></i>
                      <span>Your reply will be publicly visible</span>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowReplyModal(false);
                        setSelectedReview(null);
                        setReplyForm({ reply: "" });
                      }}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        if (!replyForm.reply.trim()) return;
                        
                        setIsSendingReply(true);
                        setReplyError("");
                        
                        try {
                          await apiService.replyToInboxItem({
                            type: "supplier_rating",
                            id: selectedReview.id,
                            reply: replyForm.reply,
                          });
                          
                          // Success - close modal and reset form
                          setShowReplyModal(false);
                          setSelectedReview(null);
                          setReplyForm({ reply: "" });
                          setReplyError("");
                        } catch (error) {
                          setReplyError(error instanceof Error ? error.message : "Failed to send reply");
                        } finally {
                          setIsSendingReply(false);
                        }
                      }}
                      disabled={!replyForm.reply.trim() || isSendingReply}
                      className="px-8 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 font-medium cursor-pointer flex items-center space-x-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {isSendingReply ? (
                        <>
                          <i className="ri-loader-4-line animate-spin"></i>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <i className="ri-send-plane-line"></i>
                          <span>Send Reply</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Error Message */}
              {replyError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                  <div className="flex items-center space-x-2">
                    <i className="ri-error-warning-line text-red-600"></i>
                    <span className="text-red-700 text-sm">{replyError}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
