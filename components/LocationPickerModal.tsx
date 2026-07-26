"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useLanguage } from "../lib/LanguageContext";

const BusinessLocationMap = dynamic(() => import("./BusinessLocationMap"), {
  ssr: false,
});

export interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (location: { lat: number; lng: number }) => void;
  initialLocation?: { lat: number; lng: number };
  title?: string;
}

const POPULAR_SAUDI_CITIES = [
  { nameAr: "الرياض", nameEn: "Riyadh", lat: 24.7136, lng: 46.6753 },
  { nameAr: "جدة", nameEn: "Jeddah", lat: 21.5433, lng: 39.1728 },
  { nameAr: "الدمام", nameEn: "Dammam", lat: 26.4207, lng: 50.0888 },
  { nameAr: "مكة المكرمة", nameEn: "Makkah", lat: 21.3891, lng: 39.8579 },
  { nameAr: "المدينة المنورة", nameEn: "Madinah", lat: 24.5247, lng: 39.5692 },
  { nameAr: "الخبر", nameEn: "Khobar", lat: 26.2172, lng: 50.1971 },
];

export default function LocationPickerModal({
  isOpen,
  onClose,
  onConfirm,
  initialLocation = { lat: 24.7136, lng: 46.6753 },
  title,
}: LocationPickerModalProps) {
  const { language, isRTL } = useLanguage();
  const isArabic = language === "ar";

  const [tempLocation, setTempLocation] = useState<{ lat: number; lng: number }>(initialLocation);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (isOpen && initialLocation) {
      setTempLocation(initialLocation);
    }
  }, [isOpen, initialLocation]);

  if (!isOpen) return null;

  // Browser Geolocation
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert(isArabic ? "خدمة تحديد الموقع غير مدعومة في متصفحك" : "Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setTempLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLocating(false);
      },
      (err) => {
        console.error("Geolocation error:", err);
        setIsLocating(false);
        alert(
          isArabic
            ? "تعذر الحصول على موقعك الحالي. يرجى التأكد من التراخيص."
            : "Unable to retrieve your current location."
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleConfirm = () => {
    onConfirm(tempLocation);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 md:p-6 transition-all animate-fade-in">
      <div className="bg-white w-full h-full sm:h-[90vh] sm:max-w-5xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold shadow-xs">
              <i className="ri-map-pin-2-fill text-xl"></i>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base md:text-lg">
                {title || (isArabic ? "تحديد الموقع على الخريطة" : "Select Location on Map")}
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                {isArabic
                  ? "انقر على الخريطة أو حدد المدينة لتثبيت النقطة المطلوبة"
                  : "Click on map or choose city to place location marker"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center cursor-pointer transition-colors"
            title={isArabic ? "إغلاق" : "Close"}
          >
            <i className="ri-close-line text-xl font-bold"></i>
          </button>
        </div>

        {/* QUICK SEARCH & CITY CHIPS TOOLBAR */}
        <div className="px-5 py-3 bg-amber-50/60 border-b border-amber-200/60 flex flex-wrap items-center justify-between gap-2.5 z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-gray-700 flex items-center gap-1">
              <i className="ri-building-line text-amber-600"></i>
              <span>{isArabic ? "مدن سريعة:" : "Quick Cities:"}</span>
            </span>

            {POPULAR_SAUDI_CITIES.map((city) => (
              <button
                key={city.nameEn}
                type="button"
                onClick={() => setTempLocation({ lat: city.lat, lng: city.lng })}
                className="px-2.5 py-1 rounded-xl bg-white hover:bg-amber-100 text-gray-800 text-xs font-semibold border border-amber-200/80 transition-all cursor-pointer shadow-2xs"
              >
                {isArabic ? city.nameAr : city.nameEn}
              </button>
            ))}
          </div>

          {/* Current Location Button */}
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm flex items-center gap-1.5 disabled:opacity-50"
          >
            <i className={isLocating ? "ri-loader-4-line animate-spin" : "ri-navigation-fill"}></i>
            <span>
              {isLocating
                ? isArabic
                  ? "جاري التحديد..."
                  : "Locating..."
                : isArabic
                ? "موقعي الحالي"
                : "My Location"}
            </span>
          </button>
        </div>

        {/* MAP CANVAS CONTAINER */}
        <div className="flex-1 min-h-0 w-full relative bg-gray-100">
          <BusinessLocationMap
            selectedLocation={tempLocation}
            setSelectedLocation={setTempLocation}
            alwaysEditable
          />
        </div>

        {/* MODAL FOOTER */}
        <div className="px-5 py-3.5 bg-white border-t border-gray-200 flex flex-wrap items-center justify-between gap-3 z-10">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
            <i className="ri-map-pin-user-fill text-emerald-600 text-base"></i>
            <span>{isArabic ? "الإحداثيات المحددة:" : "Selected Location:"}</span>
            <span className="font-mono font-bold bg-emerald-50 text-emerald-900 px-2.5 py-0.5 rounded-lg border border-emerald-200">
              {tempLocation.lat.toFixed(5)}, {tempLocation.lng.toFixed(5)}
            </span>
          </div>

          <div className="flex items-center gap-2.5 ms-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 font-bold text-xs rounded-2xl transition-all cursor-pointer"
            >
              {isArabic ? "إلغاء" : "Cancel"}
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-2xl transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <i className="ri-check-double-line text-sm"></i>
              <span>{isArabic ? "تأكيد الموقع" : "Confirm Location"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
