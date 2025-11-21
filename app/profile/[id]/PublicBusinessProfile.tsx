"use client";

import { useState } from "react";
import type React from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

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
};

type Review = {
  id: number;
  customerName: string;
  rating: number;
  date: string;
  comment: string;
};

type PublicBusinessProfileProps = {
  businessId?: string;
};

export default function PublicBusinessProfile({
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
  const { t } = useLanguage();

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

  // Sample business data based on businessId
  const businesses: Record<string, Business> = {
    "tech-solutions-co": {
      id: "tech-solutions-co",
      name: "TechSolutions Co.",
      logo: "https://readdy.ai/api/search-image?query=Modern%20technology%20company%20logo%20design%20with%20clean%20minimalist%20style%2C%20professional%20corporate%20branding%2C%20tech%20industry%20symbol%2C%20blue%20and%20white%20colors%2C%20simple%20geometric%20shapes%2C%20contemporary%20business%20logo&width=200&height=200&seq=tech-logo&orientation=squarish",
      category: "Technology Services",
      businessType: "Supplier",
      targetCustomers: ["Large Organizations", "Small Businesses"],
      serviceDistance: "50 km",
      rating: 4.9,
      reviewCount: 89,
      verified: true,
      openNow: true,
      description:
        "TechSolutions Co. is a leading technology services provider specializing in enterprise software solutions, cloud infrastructure, and digital transformation services. With over 10 years of experience, we help businesses modernize their operations and achieve digital excellence through cutting-edge technology solutions.",
      address: "King Fahd Road, Al Olaya District, Riyadh 12244, Saudi Arabia",
      phone: "+966 11 234 5678",
      salesPhone: "+966 50 987 6543",
      supportPhone: "+966 50 123 4567",
      email: "info@techsolutions.sa",
      website: "https://techsolutions.sa",
      workingHours: {
        sunday: { open: "08:00", close: "17:00", closed: false },
        monday: { open: "08:00", close: "17:00", closed: false },
        tuesday: { open: "08:00", close: "17:00", closed: false },
        wednesday: { open: "08:00", close: "17:00", closed: false },
        thursday: { open: "08:00", close: "17:00", closed: false },
        friday: { open: "", close: "", closed: true },
        saturday: { open: "09:00", close: "15:00", closed: false },
      },
      services: [
        "Cloud Migration",
        "Software Development",
        "IT Consulting",
        "System Integration",
        "Data Analytics",
        "Cybersecurity",
        "Digital Transformation",
        "Technical Support",
      ],
      images: [
        "https://readdy.ai/api/search-image?query=Modern%20technology%20office%20with%20professional%20workstations%2C%20large%20monitors%2C%20sleek%20glass%20conference%20rooms%2C%20contemporary%20interior%20design%2C%20bright%20lighting%2C%20clean%20minimalist%20workspace%2C%20team%20collaboration%20areas&width=800&height=500&seq=tech-office-main&orientation=landscape",
        "https://readdy.ai/api/search-image?query=High-tech%20server%20room%20with%20organized%20cable%20management%2C%20LED%20lighting%2C%20professional%20data%20center%20equipment%2C%20clean%20industrial%20design%2C%20blue%20accent%20lighting%2C%20modern%20infrastructure&width=800&height=500&seq=tech-server-room&orientation=landscape",
        "https://readdy.ai/api/search-image?query=Professional%20business%20meeting%20room%20with%20large%20presentation%20screen%2C%20modern%20furniture%2C%20technology%20equipment%2C%20corporate%20environment%2C%20professional%20lighting%2C%20contemporary%20design&width=800&height=500&seq=tech-meeting-room&orientation=landscape",
        "https://readdy.ai/api/search-image?query=Software%20development%20team%20working%20on%20computers%2C%20multiple%20monitors%2C%20modern%20coding%20environment%2C%20collaborative%20workspace%2C%20professional%20tech%20office%20setting%2C%20clean%20background&width=800&height=500&seq=tech-dev-team&orientation=landscape",
      ],
      productPhotos: [
        "https://readdy.ai/api/search-image?query=Enterprise%20server%20rack%20with%20organized%20cables%2C%20LED%20status%20lights%2C%20professional%20data%20center%20equipment%2C%20clean%20industrial%20design%2C%20modern%20technology%20infrastructure%2C%20professional%20lighting&width=400&height=300&seq=tech-product-1&orientation=landscape",
        "https://readdy.ai/api/search-image?query=Cloud%20computing%20dashboard%20interface%20on%20modern%20monitors%2C%20professional%20software%20interface%20design%2C%20clean%20UI%20elements%2C%20technology%20workspace%2C%20bright%20lighting%2C%20contemporary%20design&width=400&height=300&seq=tech-product-2&orientation=landscape",
        "https://readdy.ai/api/search-image?query=Network%20security%20equipment%20with%20blinking%20lights%2C%20professional%20cybersecurity%20hardware%2C%20modern%20tech%20equipment%2C%20clean%20background%2C%20organized%20cable%20management%2C%20professional%20setup&width=400&height=300&seq=tech-product-3&orientation=landscape",
        "https://readdy.ai/api/search-image?query=Professional%20IT%20consulting%20presentation%20setup%2C%20modern%20conference%20room%2C%20large%20display%20screens%2C%20technology%20equipment%2C%20corporate%20meeting%20environment%2C%20clean%20design&width=400&height=300&seq=tech-product-4&orientation=landscape",
        "https://readdy.ai/api/search-image?query=Data%20analytics%20visualization%20on%20multiple%20screens%2C%20professional%20monitoring%20setup%2C%20modern%20dashboard%20interfaces%2C%20technology%20workspace%2C%20organized%20desk%20setup%2C%20contemporary%20design&width=400&height=300&seq=tech-product-5&orientation=landscape",
        "https://readdy.ai/api/search-image?query=Modern%20software%20development%20workstation%20with%20multiple%20monitors%2C%20coding%20environment%2C%20professional%20programmer%20desk%20setup%2C%20clean%20workspace%2C%20contemporary%20office%20design%2C%20bright%20lighting&width=400&height=300&seq=tech-product-6&orientation=landscape",
      ],
      specialties: [
        "Enterprise Solutions",
        "Cloud Computing",
        "AI Implementation",
        "Digital Transformation",
      ],
      certifications: [
        "ISO 27001",
        "Microsoft Partner",
        "AWS Certified",
        "Google Cloud Partner",
      ],
      establishedYear: 2014,
      employeeCount: "50-100",
      languages: ["Arabic", "English"],
    },
  };

  const resolvedBusinessId =
    businessId && businesses[businessId] ? businessId : "tech-solutions-co";
  const business = businesses[resolvedBusinessId];

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

  const reviews: Review[] = [
    {
      id: 1,
      customerName: "Ahmed Al-Mansouri",
      rating: 5,
      date: "2024-01-20",
      comment:
        "Exceptional service and high-quality products. The team was very professional and delivered exactly what we needed for our office setup. Highly recommended!",
    },
    {
      id: 2,
      customerName: "Fatima Al-Zahra",
      rating: 5,
      date: "2024-01-18",
      comment:
        "Outstanding experience from start to finish. The consultation was thorough and the final result exceeded our expectations. Great attention to detail.",
    },
    {
      id: 3,
      customerName: "Mohammed Al-Rashid",
      rating: 4,
      date: "2024-01-15",
      comment:
        "Very satisfied with the service quality and professionalism. The project was completed on time and within budget. Will definitely work with them again.",
    },
    {
      id: 4,
      customerName: "Sarah Al-Otaibi",
      rating: 5,
      date: "2024-01-12",
      comment:
        "Excellent customer service and expertise. They understood our requirements perfectly and provided solutions that worked beautifully for our needs.",
    },
  ];

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
      console.error("Form submission error:", error);
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
              src={business.images[selectedImageIndex]}
              alt={business.name}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-yellow-100"></div>
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
                      <div
                        className={`${getBusinessTypeColor(
                          business.businessType
                        )} px-4 py-2 rounded-full flex items-center gap-2 border backdrop-blur-sm`}
                      >
                        <i
                          className={`${getBusinessTypeIcon(
                            business.businessType
                          )} text-sm`}
                        ></i>
                        <span className="text-sm font-medium">
                          {business.businessType}
                        </span>
                      </div>
                      {business.verified && (
                        <div className="bg-green-500 text-white px-4 py-2 rounded-full flex items-center gap-2">
                          <i className="ri-verified-badge-fill text-sm"></i>
                          <span className="text-sm font-medium">
                            {t("publicProfile.verified")}
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
                          Riyadh, Saudi Arabia
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

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
                <p className="text-gray-600 leading-relaxed text-lg mb-8">
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
                        {t("publicProfile.about.upTo")}{" "}
                        {business.serviceDistance}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="ri-map-pin-line text-blue-600"></i>
                      <span className="text-gray-700">
                        {t("publicProfile.about.riyadhArea")}
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

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <i className="ri-user-line text-blue-600"></i>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          {t("publicProfile.contact.salesTeam")}
                        </p>
                        <a
                          href={`tel:${business.salesPhone}`}
                          className="text-gray-800 font-medium hover:text-blue-600"
                        >
                          {business.salesPhone}
                        </a>
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
                        <a
                          href={`tel:${business.supportPhone}`}
                          className="text-gray-800 font-medium hover:text-green-600"
                        >
                          {business.supportPhone}
                        </a>
                      </div>
                    </div>

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

                  <div className="grid grid-cols-2 gap-3">
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
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3621.399!2d46.6753!3d24.7136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z24.7136%2C46.6753!5e0!3m2!1sen!2sus!4v1645123456789!5m2!1sen!2sus&disableDefaultUI=true&gestureHandling=none&scrollwheel=false&disableDoubleClickZoom=true&clickableIcons=false"
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

      <Footer />
    </div>
  );
}
