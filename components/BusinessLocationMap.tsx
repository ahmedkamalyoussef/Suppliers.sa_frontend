"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "../lib/LanguageContext"; // تأكد من المسار
import { validateSaudiLocation } from "../lib/saudiLocationValidation";
import { toast } from "react-toastify";

const GOOGLE_MAPS_SCRIPT_ID = "google-maps-js";

// Custom yellow marker with S - SVG data URI
const customMarkerSvg = `data:image/svg+xml,${encodeURIComponent(`
<svg width="28" height="38" viewBox="0 0 36 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M18 0C8.059 0 0 8.059 0 18c0 13.5 18 30 18 30s18-16.5 18-30C36 8.059 27.941 0 18 0z" fill="#FACC15"/>
  <circle cx="18" cy="18" r="10" fill="white"/>
  <text x="18" y="23" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#FACC15">S</text>
</svg>
`)}`;

function waitForGoogleMapsReady(
  timeoutMs = 10000,
  intervalMs = 50,
): Promise<void> {
  const startedAt = Date.now();

  return new Promise((resolve, reject) => {
    const tick = () => {
      const g = (window as any).google;
      if (g?.maps && typeof g.maps.Map === "function") {
        resolve();
        return;
      }

      if (Date.now() - startedAt > timeoutMs) {
        reject(new Error("Google Maps loaded but API is not ready"));
        return;
      }

      setTimeout(tick, intervalMs);
    };

    tick();
  });
}

function loadGoogleMapsScript(apiKey: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();

  const w = window as any;
  if (w.google?.maps && typeof w.google.maps.Map === "function") {
    return Promise.resolve();
  }

  const existing = document.getElementById(
    GOOGLE_MAPS_SCRIPT_ID,
  ) as HTMLScriptElement | null;

  if (existing) {
    return new Promise((resolve, reject) => {
      if (w.google?.maps && typeof w.google.maps.Map === "function") {
        resolve();
        return;
      }

      existing.addEventListener("load", () => {
        waitForGoogleMapsReady().then(resolve).catch(reject);
      });
      existing.addEventListener("error", () =>
        reject(new Error("Failed to load Google Maps script")),
      );
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = GOOGLE_MAPS_SCRIPT_ID;
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      apiKey,
    )}&v=weekly&loading=async`;
    script.onload = () => {
      waitForGoogleMapsReady().then(resolve).catch(reject);
    };
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
  });
}

function normalizeLocation(
  location: { lat: unknown; lng: unknown } | null | undefined,
): { lat: number; lng: number } | null {
  const lat = Number(location?.lat);
  const lng = Number(location?.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
}

// --- Types ---
interface City {
  name: string;
  lat: number;
  lng: number;
}

interface Location {
  lat: number;
  lng: number;
}
interface BusinessLocationMapProps {
  selectedLocation: Location;
  setSelectedLocation: (location: Location) => void;
  isEditing?: boolean; // Add isEditing prop
  alwaysEditable?: boolean;
}

type LocationMethod = "map" | "city" | "address";

const saudiCities: City[] = [
  { name: "Riyadh", lat: 24.7136, lng: 46.6753 },
  { name: "Jeddah", lat: 21.4858, lng: 39.1925 },
  { name: "Mecca", lat: 21.3891, lng: 39.8579 },
  { name: "Medina", lat: 24.5247, lng: 39.5692 },
  { name: "Dammam", lat: 26.4207, lng: 50.0888 },
  { name: "Al Khobar", lat: 26.2172, lng: 50.1971 },
  { name: "Tabuk", lat: 28.3998, lng: 36.566 },
  { name: "Abha", lat: 18.2164, lng: 42.5047 },
  { name: "Buraidah", lat: 26.326, lng: 43.975 },
  { name: "Khamis Mushait", lat: 18.3061, lng: 42.7326 },
  { name: "Hail", lat: 27.5114, lng: 41.69 },
  { name: "Najran", lat: 17.4924, lng: 44.1277 },
  { name: "Jazan", lat: 16.8892, lng: 42.5511 },
  { name: "Taif", lat: 21.2703, lng: 40.4158 },
  { name: "Al Jubail", lat: 27.0174, lng: 49.6584 },
  // Additional cities
  { name: "Al Ahsa", lat: 25.3833, lng: 49.5833 },
  { name: "Al Afalaj", lat: 22.2833, lng: 46.7333 },
  { name: "Al Jafr", lat: 28.4167, lng: 45.5333 },
  { name: "Al Khafji", lat: 28.4667, lng: 48.5167 },
  { name: "Al Kharj", lat: 24.1556, lng: 47.3342 },
  { name: "Al Qatif", lat: 26.5208, lng: 50.0247 },
  { name: "Al Qurayyat", lat: 31.3167, lng: 37.3667 },
  { name: "Al Quwayiyah", lat: 24.0667, lng: 45.2833 },
  { name: "Al Lith", lat: 20.15, lng: 40.2667 },
  { name: "Al Majmaah", lat: 25.9, lng: 45.35 },
  { name: "Al Mithnab", lat: 25.8667, lng: 44.2167 },
  { name: "Al Nairyah", lat: 28.0167, lng: 48.1667 },
  { name: "Al Zulfi", lat: 26.3, lng: 44.8 },
  { name: "Amlaj", lat: 25.0333, lng: 37.2667 },
  { name: "Arar", lat: 30.9833, lng: 41.0167 },
  { name: "Badr", lat: 23.7833, lng: 38.8 },
  { name: "Bahah", lat: 20.0167, lng: 41.4667 },
  { name: "Baqeeq", lat: 25.9333, lng: 49.6667 },
  { name: "Baljurashi", lat: 19.8667, lng: 41.5667 },
  { name: "Bisha", lat: 20.0167, lng: 42.6 },
  { name: "Duba", lat: 27.35, lng: 35.7 },
  { name: "Dhurma", lat: 24.6, lng: 46.2 },
  { name: "Dhahran", lat: 26.2361, lng: 50.0393 },
  { name: "Afif", lat: 23.9, lng: 42.9333 },
  { name: "Onaizah", lat: 26.0833, lng: 43.9667 },
  { name: "Rafha", lat: 29.6333, lng: 43.5 },
  { name: "Ras Tanura", lat: 26.7167, lng: 50.0667 },
  { name: "Rabigh", lat: 22.8, lng: 39.0333 },
  { name: "Al Rass", lat: 25.8667, lng: 43.5167 },
  { name: "Sarat Abidah", lat: 18.5667, lng: 42.15 },
  { name: "Sadir", lat: 24.25, lng: 46.7333 },
  { name: "Sakaka", lat: 29.9667, lng: 40.2 },
  { name: "Spark", lat: 27.5167, lng: 49.75 },
  { name: "Sharorah", lat: 17.4833, lng: 47.1167 },
  { name: "Shaqra", lat: 25.25, lng: 45.25 },
  { name: "Sabia", lat: 17.15, lng: 42.6333 },
  { name: "Thuwal", lat: 22.2833, lng: 39.1167 },
  { name: "Tumair", lat: 25.4, lng: 46.3167 },
  { name: "Dhahran Al Janub", lat: 17.6667, lng: 44.1333 },
  { name: "Wadi Al Dawasir", lat: 20.5, lng: 44.9167 },
  { name: "Yanbu", lat: 24.0891, lng: 38.0542 },
];

// City name translations (English -> Arabic)
const cityTranslations: Record<string, string> = {
  "Riyadh": "الرياض",
  "Jeddah": "جدة",
  "Mecca": "مكة المكرمة",
  "Medina": "المدينة المنورة",
  "Dammam": "الدمام",
  "Al Khobar": "الخبر",
  "Tabuk": "تبوك",
  "Abha": "أبها",
  "Buraidah": "بريدة",
  "Khamis Mushait": "خميس مشيط",
  "Hail": "حائل",
  "Najran": "نجران",
  "Jazan": "جازان",
  "Taif": "الطائف",
  "Al Jubail": "الجبيل",
  "Al Ahsa": "الأحساء",
  "Al Afalaj": "الأفلاج",
  "Al Jafr": "الجافورة",
  "Al Khafji": "الخفجي",
  "Al Kharj": "الخرج",
  "Al Qatif": "القطيف",
  "Al Qurayyat": "القريات",
  "Al Quwayiyah": "القويعية",
  "Al Lith": "الليث",
  "Al Majmaah": "المجمعة",
  "Al Mithnab": "المذنب",
  "Al Nairyah": "النعيرية",
  "Al Zulfi": "الزلفي",
  "Amlaj": "أملج",
  "Arar": "عرعر",
  "Badr": "بدر",
  "Bahah": "الباحة",
  "Baqeeq": "بقيق",
  "Baljurashi": "بلجرشي",
  "Bisha": "بيشة",
  "Duba": "ضباء",
  "Dhurma": "ثول",
  "Dhahran": "الظهران",
  "Afif": "عفيف",
  "Onaizah": "عنيزة",
  "Rafha": "رفحاء",
  "Ras Tanura": "رأس تنورة",
  "Rabigh": "رابغ",
  "Al Rass": "الرس",
  "Sarat Abidah": "سراة عبيدة",
  "Sadir": "سدير",
  "Sakaka": "سكاكا",
  "Spark": "سبارك",
  "Sharorah": "شرورة",
  "Shaqra": "شقراء",
  "Sabia": "صبيا",
  "Thuwal": "ثول",
  "Tumair": "تمير",
  "Dhahran Al Janub": "ظهران الجنوب",
  "Wadi Al Dawasir": "وادي الدواسر",
  "Yanbu": "ينبع",
};

// Helper function to get city name based on language
const getCityName = (cityName: string, language: string): string => {
  if (language === 'ar') {
    return cityTranslations[cityName] || cityName;
  }
  return cityName;
};

// Function to find the nearest city to given coordinates
export const findNearestCity = (lat: number, lng: number): City => {
  let nearestCity = saudiCities[0];
  let minDistance = Infinity;

  saudiCities.forEach((city) => {
    const distance = Math.sqrt(
      Math.pow(lat - city.lat, 2) + Math.pow(lng - city.lng, 2),
    );
    if (distance < minDistance) {
      minDistance = distance;
      nearestCity = city;
    }
  });

  return nearestCity;
};

export default function BusinessLocationMap({
  selectedLocation,
  setSelectedLocation,
  isEditing = false, // Default to false
  alwaysEditable = false,
}: BusinessLocationMapProps) {
  const { t, language } = useLanguage();
  const canEdit = alwaysEditable || isEditing;
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [customAddress, setCustomAddress] = useState<string>("");
  const [locationMethod, setLocationMethod] = useState<LocationMethod>("map");
  const [isValidating, setIsValidating] = useState(false); // Add loading state
  
  // Set default to Riyadh if no location provided or if location is invalid
  useEffect(() => {
    if (!selectedLocation || !selectedLocation.lat || !selectedLocation.lng) {
      setSelectedLocation({
        lat: 24.7136, // Riyadh coordinates
        lng: 46.6753
      });
    }
  }, [selectedLocation, setSelectedLocation]);

  // Wrapper function to validate Saudi boundaries before setting location (async)
  const setValidatedLocation = async (location: Location) => {
    setIsValidating(true);
    
    try {
      const validatedLocation = await validateSaudiLocation(location.lat, location.lng);
      
      if (!validatedLocation.isWithinSaudi) {
        // Show toast warning and automatically move marker to Riyadh
        toast.warning(
          language === 'ar' 
            ? 'الموقع يجب أن يكون داخل السعودية. سيتم تحريك الموقع تلقائياً إلى الرياض.'
            : 'Location must be within Saudi Arabia. The location will be automatically moved to Riyadh.',
          {
            position: "top-center",
            autoClose: 4000,
          }
        );
      }
      
      setSelectedLocation({
        lat: validatedLocation.lat,
        lng: validatedLocation.lng
      });
    } catch (error) {
      console.error("Error validating location:", error);
      // Fallback to Riyadh if validation fails
      setSelectedLocation({
        lat: 24.7136,
        lng: 46.6753
      });
    } finally {
      setIsValidating(false);
    }
  };

  // FIX: حالة للتأكد أننا في المتصفح وليس السيرفر
  const [isMounted, setIsMounted] = useState(false);
  const [isMapsReady, setIsMapsReady] = useState(false);
  const [mapsError, setMapsError] = useState<string | null>(null);
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const canEditRef = useRef<boolean>(canEdit);
  const mapClickListenerRef = useRef<any>(null);
  const markerDragListenerRef = useRef<any>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    canEditRef.current = canEdit;
  }, [canEdit]);

  useEffect(() => {
    if (!isMounted) return;

    const apiKey = "AIzaSyBcMJlGvV2VKLfIRmpjBV53pbwLDcfOS-Q";
    if (!apiKey) {
      setMapsError(
        "Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY. Please set it in your environment.",
      );
      return;
    }

    loadGoogleMapsScript(apiKey)
      .then(() => {
        setIsMapsReady(true);
        setMapsError(null);
      })
      .catch((err) => {
        setMapsError(err instanceof Error ? err.message : "Failed to load map");
      });
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted || !isMapsReady) return;
    if (!mapDivRef.current) return;
    if (mapRef.current) return;

    const g = (window as any).google;
    if (!g?.maps) return;
    if (typeof g.maps.Map !== "function") {
      setMapsError(
        "Google Maps API is not ready. If you see RefererNotAllowedMapError, allow https://supplier.sa/* in your API key referrers.",
      );
      return;
    }

    const initialLocation =
      normalizeLocation(selectedLocation) ?? normalizeLocation(saudiCities[0]);
    if (!initialLocation) return;

    mapRef.current = new g.maps.Map(mapDivRef.current, {
      center: { lat: initialLocation.lat, lng: initialLocation.lng },
      zoom: 13,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
    });

    markerRef.current = new g.maps.Marker({
      position: { lat: initialLocation.lat, lng: initialLocation.lng },
      map: mapRef.current,
      draggable: canEdit && !isValidating, // Disable dragging during validation
      title: t("map.yourBusiness") || "Your Business",
      icon: {
        url: customMarkerSvg,
        scaledSize: new g.maps.Size(28, 38),
        anchor: new g.maps.Point(14, 38),
      },
    });

    if (markerDragListenerRef.current) {
      g.maps.event.removeListener(markerDragListenerRef.current);
      markerDragListenerRef.current = null;
    }
    markerDragListenerRef.current = markerRef.current.addListener(
      "dragend",
      async (e: any) => {
        if (!e?.latLng || isValidating) return;
        await setValidatedLocation({
          lat: parseFloat(e.latLng.lat().toFixed(6)),
          lng: parseFloat(e.latLng.lng().toFixed(6)),
        });
      },
    );

    if (mapClickListenerRef.current) {
      g.maps.event.removeListener(mapClickListenerRef.current);
      mapClickListenerRef.current = null;
    }
    mapClickListenerRef.current = mapRef.current.addListener(
      "click",
      async (e: any) => {
        if (!canEditRef.current || isValidating) return;
        if (!e?.latLng) return;
        await setValidatedLocation({
          lat: parseFloat(e.latLng.lat().toFixed(6)),
          lng: parseFloat(e.latLng.lng().toFixed(6)),
        });
      },
    );

    return () => {
      try {
        if (markerDragListenerRef.current) {
          g.maps.event.removeListener(markerDragListenerRef.current);
          markerDragListenerRef.current = null;
        }
        if (mapClickListenerRef.current) {
          g.maps.event.removeListener(mapClickListenerRef.current);
          mapClickListenerRef.current = null;
        }
        if (markerRef.current) {
          markerRef.current.setMap(null);
          markerRef.current = null;
        }
        mapRef.current = null;
      } catch {
        // ignore cleanup errors
      }
    };
  }, [isMounted, isMapsReady]);

  useEffect(() => {
    if (!isMounted || !isMapsReady) return;
    if (!mapRef.current || !markerRef.current) return;

    markerRef.current.setDraggable(canEdit && !isValidating);
  }, [isMounted, isMapsReady, canEdit, isValidating]);

  useEffect(() => {
    if (!isMounted || !isMapsReady) return;
    if (!mapRef.current || !markerRef.current) return;

    const g = (window as any).google;
    if (!g?.maps) return;

    const nextLocation = normalizeLocation(selectedLocation);
    if (!nextLocation) return;

    const next = new g.maps.LatLng(nextLocation.lat, nextLocation.lng);
    mapRef.current.panTo(next);
    markerRef.current.setPosition(next);
  }, [isMounted, isMapsReady, selectedLocation.lat, selectedLocation.lng]);

  useEffect(() => {
    if (!isMounted || !isMapsReady) return;
    if (!markerRef.current) return;

    markerRef.current.setTitle(t("map.yourBusiness") || "Your Business");
  }, [isMounted, isMapsReady, t]);

  // وظيفة الزر: يجيب منتصف الخريطة الحالي ويحط الماركر فيه
  const handleMapClick = (): void => {
    if (isValidating) return; // Prevent changes during validation
    if (mapRef.current) {
      const center = mapRef.current.getCenter();
      if (!center) return;
      setValidatedLocation({
        lat: parseFloat(center.lat().toFixed(6)),
        lng: parseFloat(center.lng().toFixed(6)),
      });
    }
  };

  const handleCitySelect = (cityName: string): void => {
    if (isValidating) return; // Prevent changes during validation
    const city = saudiCities.find((c) => c.name === cityName);
    if (city) {
      // Skip validation for known Saudi cities from dropdown
      setSelectedLocation({
        lat: city.lat,
        lng: city.lng,
      });
      setSelectedCity(cityName);
    }
  };

  const handleAddressGeocode = async (): Promise<void> => {
    if (!customAddress.trim() || !isMapsReady || isValidating) return;
    const g = (window as any).google;
    if (!g?.maps?.Geocoder) return;

    try {
      const geocoder = new g.maps.Geocoder();
      const { results } = await geocoder.geocode({
        address: customAddress,
        region: "SA",
      });

      const first = results?.[0];
      const loc = first?.geometry?.location;
      if (!loc) {
        alert(t("map.cannotGetLocation"));
        return;
      }
      await setValidatedLocation({
        lat: parseFloat(loc.lat().toFixed(6)),
        lng: parseFloat(loc.lng().toFixed(6)),
      });
    } catch {
      alert(t("map.cannotGetLocation"));
    }
  };

  const getCurrentLocation = (): void => {
    if (isValidating) return; // Prevent changes during validation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          await setValidatedLocation({
            lat: parseFloat(lat.toFixed(6)),
            lng: parseFloat(lng.toFixed(6)),
          });
        },
        (error) => {
          alert(t("map.cannotGetLocation"));
        },
      );
    } else {
      alert(t("map.notSupported"));
    }
  };

  return (
    <div className="sticky top-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 bg-yellow-50 border-b border-yellow-100">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {t("map.setLocationTitle")}
          </h3>
          <p className="text-sm text-gray-600">{t("map.setLocationDesc")}</p>
          {!canEdit && (
            <div className="mt-3 p-3 bg-yellow-100 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <i className="ri-lock-line text-yellow-600"></i>
                <span className="text-sm text-yellow-800 font-medium">
                  {t("map.editModeRequired") ||
                    "Click 'Edit Profile' to modify location"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Location Method Selection */}
        <div className="p-4 bg-gray-50 border-b border-gray-100">
          <div className="flex space-x-2 mb-4">
            <button
              type="button"
              onClick={() => setLocationMethod("map")}
              disabled={!canEdit}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                locationMethod === "map"
                  ? "bg-yellow-400 text-white"
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
              } ${!canEdit ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <i className="ri-map-pin-line mr-2"></i>
              {t("map.methodPin")}
            </button>
            <button
              type="button"
              onClick={() => setLocationMethod("city")}
              disabled={!canEdit}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                locationMethod === "city"
                  ? "bg-yellow-400 text-white"
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
              } ${!canEdit ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <i className="ri-building-line mr-2"></i>
              {t("map.methodCity")}
            </button>
            <button
              type="button"
              onClick={() => setLocationMethod("address")}
              disabled={!canEdit}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                locationMethod === "address"
                  ? "bg-yellow-400 text-white"
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
              } ${!canEdit ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <i className="ri-road-map-line mr-2"></i>
              {t("map.methodAddress")}
            </button>
          </div>

          {locationMethod === "city" && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                {t("map.selectMajorCity")}
              </label>
              <select
                value={selectedCity}
                onChange={(e) => handleCitySelect(e.target.value)}
                disabled={!canEdit}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm pr-8 ${
                  !canEdit ? "opacity-50 cursor-not-allowed bg-gray-100" : ""
                }`}
              >
                <option value="">{t("map.chooseCityPlaceholder")}</option>
                {saudiCities.map((city) => (
                  <option key={city.name} value={city.name}>
                    {getCityName(city.name, language)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {locationMethod === "address" && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                {t("map.enterCompleteAddress")}
              </label>
              <input
                type="text"
                value={customAddress}
                onChange={(e) => setCustomAddress(e.target.value)}
                placeholder={t("map.addressPlaceholder")}
                disabled={!canEdit}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm ${
                  !canEdit ? "opacity-50 cursor-not-allowed bg-gray-100" : ""
                }`}
              />
              <button
                type="button"
                onClick={handleAddressGeocode}
                disabled={!customAddress.trim() || !canEdit}
                className="w-full bg-yellow-400 text-white py-2 px-4 rounded-lg hover:bg-yellow-500 font-medium text-sm whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="ri-search-line mr-2"></i>
                {t("map.findLocation")}
              </button>
            </div>
          )}

          {locationMethod === "map" && (
            <div className="text-center">
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={!canEdit}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-medium text-sm whitespace-nowrap cursor-pointer mr-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="ri-crosshair-line mr-2"></i>
                {t("map.useMyLocation")}
              </button>
              <span className="text-xs text-gray-500">
                {t("map.orClickOnMap")}
              </span>
            </div>
          )}
        </div>

        {/* Map Container Area */}
        <div className="relative h-96 w-full z-0 bg-gray-100">
          {/* هنا نقوم بفحص isMounted لمنع ظهور الخريطة على السيرفر */}
          {!isMounted ? (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <i className="ri-loader-4-line animate-spin text-2xl mr-2"></i>
              {t("map.loading") || "Loading Map..."}
            </div>
          ) : mapsError ? (
            <div className="w-full h-full flex items-center justify-center text-gray-500 p-6 text-center">
              {mapsError}
            </div>
          ) : !isMapsReady ? (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <i className="ri-loader-4-line animate-spin text-2xl mr-2"></i>
              {t("map.loading") || "Loading Map..."}
            </div>
          ) : (
            <div ref={mapDivRef} className="w-full h-full" />
          )}
        </div>

        <div className="p-4 bg-gray-50 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{t("map.latitude")}</span>
            <span className="font-mono text-gray-800">
              {selectedLocation.lat}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{t("map.longitude")}</span>
            <span className="font-mono text-gray-800">
              {selectedLocation.lng}
            </span>
          </div>

          {locationMethod === "map" && (
            <button
              type="button"
              onClick={handleMapClick}
              disabled={!canEdit}
              className="w-full bg-yellow-400 text-white py-2 px-4 rounded-lg hover:bg-yellow-500 font-medium text-sm whitespace-nowrap cursor-pointer transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="ri-crosshair-line mr-2"></i>
              {t("map.adjustPin")}
            </button>
          )}
        </div>

        <div className="p-4 bg-blue-50 border-t border-blue-100">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <i className="ri-information-line text-blue-600 text-sm"></i>
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-800 mb-1">
                {t("map.tipsTitle")}
              </h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>{t("map.tip1")}</li>
                <li>{t("map.tip2")}</li>
                <li>{t("map.tip3")}</li>
                <li>{t("map.tip4")}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
