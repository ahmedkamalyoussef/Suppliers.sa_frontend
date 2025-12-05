"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
  4: "Location & Hours",
  5: "Branches",
  6: "Documents",
};

export default function CompleteProfilePage() {
  const { t } = useLanguage();
  const router = useRouter();

  // Optimized state management
  const [selectedLocation, setSelectedLocation] = useState({
    lat: 24.7136,
    lng: 46.6753,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ProfileFormData>(initialFormData);
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
    []
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

  const goToStep = useCallback(
    (step: number) => {
      // Can only jump to completed steps, current step, or next step
      if (step <= currentStep + 1) {
        setCurrentStep(Math.min(Math.max(step, 1), TOTAL_STEPS));
      }
    },
    [currentStep]
  );

  // Memoized progress calculation
  const progressPercentage = useMemo(
    () => ((currentStep - 1) / (TOTAL_STEPS - 1)) * 100,
    [currentStep]
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
          <div className="text-center mb-8 lg:mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              {t("completeProfile.title")}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("completeProfile.subtitle")}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8 lg:mb-12">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">
                  Step {currentStep} of {TOTAL_STEPS}
                </span>
                <span className="text-sm text-gray-500">
                  {STEP_TITLES[currentStep as keyof typeof STEP_TITLES]}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {Math.round(progressPercentage)}% Complete
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center mb-8 lg:mb-12">
            <div className="flex space-x-2 lg:space-x-4">
              {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map(
                (step) => {
                  const isAccessible = step <= currentStep + 1;
                  return (
                    <button
                      key={step}
                      onClick={() => goToStep(step)}
                      disabled={!isAccessible}
                      className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                        step === currentStep
                          ? "bg-yellow-400 text-white"
                          : step < currentStep
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : isAccessible
                          ? "bg-gray-200 text-gray-500 hover:bg-gray-300"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                      aria-label={`Go to step ${step}`}
                      title={
                        isAccessible
                          ? `Go to step ${step}`
                          : `Complete step ${step - 1} first`
                      }
                    >
                      {step < currentStep ? (
                        <i className="ri-check-line text-sm"></i>
                      ) : (
                        step
                      )}
                    </button>
                  );
                }
              )}
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
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
