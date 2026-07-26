"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CompleteProfileForm from "../../components/CompleteProfileForm";
import { useLanguage } from "@/lib/LanguageContext";
import { apiService } from "@/lib/api";
import { ProfileFormData } from "@/lib/types";
import { initialFormData } from "@/lib/initialData";
import { useRouter } from "next/navigation";

// Step configuration
const TOTAL_STEPS = 6;
const STEP_TITLES = {
  1: "Business Information",
  2: "Categories & Keywords",
  3: "Contact Details",
  4: "Hours",
  5: "Location & Branches",
  6: "Documents",
};

export default function CompleteProfilePage() {
  const { t, language, isRTL } = useLanguage();
  const router = useRouter();

  const getStepTitle = useCallback(
    (step: number) => {
      const titlesAr: Record<number, string> = {
        1: "معلومات النشاط التجاري",
        2: "الفئات والكلمات المفتاحية",
        3: "بيانات التواصل",
        4: "ساعات العمل",
        5: "الموقع والفروع",
        6: "المستندات والتحقق",
      };
      const titlesEn: Record<number, string> = {
        1: "Business Information",
        2: "Categories & Keywords",
        3: "Contact Details",
        4: "Hours",
        5: "Location & Branches",
        6: "Documents & Verification",
      };

      if (isRTL || language === "ar") {
        return titlesAr[step] || titlesEn[step];
      }
      return titlesEn[step] || titlesAr[step];
    },
    [language, isRTL]
  );

  const getCompletedText = useCallback(() => {
    return (isRTL || language === "ar") ? "مكتمل" : "Completed";
  }, [language, isRTL]);

  // Optimized state management
  const [selectedLocation, setSelectedLocation] = useState({
    lat: 24.7136,
    lng: 46.6753,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ProfileFormData>({
    ...initialFormData,
    address: "Riyadh", // Ensure Riyadh is set as default city
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Memoized verification data loader
  const loadVerificationData = useCallback(async () => {
    try {
      // Try localStorage first (faster)
      const verificationData = localStorage.getItem("verificationData");
      if (verificationData) {
        const parsedData = JSON.parse(verificationData);

        setFormData((prev) => ({
          ...prev,
          businessName:
            parsedData.supplier?.name ||
            parsedData.supplier?.profile?.businessName ||
            prev.businessName,
          contactEmail:
            parsedData.supplier?.email ||
            parsedData.supplier?.profile?.contactEmail ||
            prev.contactEmail,
          contactPhone:
            parsedData.supplier?.phone ||
            parsedData.supplier?.profile?.mainPhone ||
            prev.contactPhone,
        }));

        return; // Exit early if we have data
      }

      // Fallback to API call only if needed
      const profileData = await apiService.getProfile();
      setFormData((prev) => ({
        ...prev,
        contactEmail:
          profileData.contactEmail || profileData.email || prev.contactEmail,
        contactPhone:
          profileData.contactPhone || profileData.phone || prev.contactPhone,
        businessName:
          profileData.businessName || profileData.name || prev.businessName,
      }));
    } catch (error) {
      // Continue with default data - don't block the user
    }
  }, []);

  // Handler for location updates
  const handleLocationUpdate = useCallback(
    (location: { lat: number; lng: number }) => {
      setSelectedLocation(location);
      setFormData((prev) => ({
        ...prev,
        location: location,
      }));
    },
    [],
  );

  // Sync initial location with formData
  useEffect(() => {
    if (
      formData.location.lat !== selectedLocation.lat ||
      formData.location.lng !== selectedLocation.lng
    ) {
      setFormData((prev) => ({
        ...prev,
        location: selectedLocation,
      }));
    }
  }, [selectedLocation]);

  // Initialize mainPhone with contactPhone if empty
  useEffect(() => {
    if (!formData.mainPhone && formData.contactPhone) {
      setFormData((prev) => ({
        ...prev,
        mainPhone: formData.contactPhone,
      }));
    }
  }, [formData.contactPhone, formData.mainPhone]);

  // Optimized authentication check
  useEffect(() => {
    const initializePage = async () => {
      if (!apiService.isAuthenticated()) {
        router.push("/add-business");
        return;
      }

      await loadVerificationData();
      setIsAuthenticated(true);
      setIsLoading(false);
    };

    initializePage();
  }, [router, loadVerificationData]);

  // Memoized step navigation handlers
  const nextStep = useCallback(() => {
    setCurrentStep((prev) => {
      const newStep = Math.min(prev + 1, TOTAL_STEPS);
      if (newStep > prev) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return newStep;
    });
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => {
      const newStep = Math.max(prev - 1, 1);
      if (newStep < prev) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return newStep;
    });
  }, []);

  const validateStepRef = useRef<((step?: number) => boolean) | null>(null);

  const goToStep = useCallback(
    (step: number) => {
      if (step > currentStep) {
        if (validateStepRef.current && !validateStepRef.current(currentStep)) {
          return;
        }
      }
      setCurrentStep(Math.min(Math.max(step, 1), TOTAL_STEPS));
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [currentStep]
  );

  // Memoized progress calculation
  const progressPercentage = useMemo(
    () => ((currentStep - 1) / (TOTAL_STEPS - 1)) * 100,
    [currentStep],
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-yellow-400 border-t-transparent mx-auto mb-3"></div>
          <p className="text-gray-600 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Redirect state (shouldn't show due to immediate redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="py-8 lg:py-12 bg-gradient-to-b from-yellow-50/50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-6 lg:mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              {t("completeProfile.title")}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("completeProfile.subtitle")}
            </p>
          </div>

          {/* Single Unified Progress Indicator */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 lg:p-7 mb-8">
            {/* Top row: Active step info & completion percentage */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 font-bold text-sm flex items-center justify-center shadow-xs">
                  {currentStep}/{TOTAL_STEPS}
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                    {getStepTitle(currentStep)}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                    {t("completeProfile.stepOf")
                      .replace("{current}", String(currentStep))
                      .replace("{total}", String(TOTAL_STEPS))}
                  </p>
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 font-semibold text-xs sm:text-sm self-start sm:self-auto border border-amber-200/60">
                <i className="ri-donut-chart-fill text-amber-500"></i>
                <span>{Math.round(progressPercentage)}% {getCompletedText()}</span>
              </div>
            </div>

            {/* Main Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-yellow-400 via-amber-400 to-amber-500 h-full rounded-full transition-all duration-500 ease-out shadow-xs"
                style={{ width: `${Math.max(progressPercentage, 5)}%` }}
              ></div>
            </div>

            {/* Interactive Step Navigation Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-6 pt-5 border-t border-gray-100">
              {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((step) => {
                const isCompleted = step < currentStep;
                const isCurrent = step === currentStep;
                const isAccessible = step <= currentStep + 1;
                const stepTitle = getStepTitle(step);

                return (
                  <button
                    key={step}
                    onClick={() => goToStep(step)}
                    disabled={!isAccessible}
                    className={`flex items-center justify-center sm:justify-start gap-2 p-2.5 rounded-xl text-xs transition-all duration-200 ${
                      isCurrent
                        ? "bg-amber-400 text-gray-900 font-bold shadow-sm ring-2 ring-amber-400/30"
                        : isCompleted
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100/70 font-medium"
                        : isAccessible
                        ? "bg-gray-50 text-gray-700 hover:bg-gray-100 font-medium"
                        : "bg-gray-50/50 text-gray-400 cursor-not-allowed opacity-60"
                    }`}
                    aria-label={`Go to step ${step}`}
                    title={
                      isAccessible
                        ? `Step ${step}: ${stepTitle}`
                        : `Complete step ${step - 1} first`
                    }
                  >
                    {isCompleted ? (
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shrink-0">
                        <i className="ri-check-line"></i>
                      </span>
                    ) : isCurrent ? (
                      <span className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {step}
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs font-medium shrink-0">
                        {step}
                      </span>
                    )}
                    <span className="truncate hidden sm:inline text-left rtl:text-right">
                      {stepTitle}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
            <CompleteProfileForm
              formData={formData}
              setFormData={setFormData}
              selectedLocation={selectedLocation}
              setSelectedLocation={handleLocationUpdate}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              nextStep={nextStep}
              prevStep={prevStep}
              goToStep={goToStep}
              validateStepRef={validateStepRef}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
