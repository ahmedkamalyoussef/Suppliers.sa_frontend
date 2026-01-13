"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { useLanguage } from "../lib/LanguageContext"; // تأكد من المسار
// استيراد المكونات ديناميكياً لتجنب مشاكل السيرفر
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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
];

// Function to find the nearest city to given coordinates
export const findNearestCity = (lat: number, lng: number): City => {
  let nearestCity = saudiCities[0];
  let minDistance = Infinity;

  saudiCities.forEach((city) => {
    const distance = Math.sqrt(
      Math.pow(lat - city.lat, 2) + Math.pow(lng - city.lng, 2)
    );
    if (distance < minDistance) {
      minDistance = distance;
      nearestCity = city;
    }
  });

  return nearestCity;
};

// مكون مساعد لتحديث موقع الخريطة عند تغيير الإحداثيات من الخارج
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function BusinessLocationMap({
  selectedLocation,
  setSelectedLocation,
  isEditing = false, // Default to false
}: BusinessLocationMapProps) {
  const { t } = useLanguage();
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [customAddress, setCustomAddress] = useState<string>("");
  const [locationMethod, setLocationMethod] = useState<LocationMethod>("map");

  // FIX: حالة للتأكد أننا في المتصفح وليس السيرفر
  const [isMounted, setIsMounted] = useState(false);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    setIsMounted(true);
    // حل مشكلة أيقونات Leaflet المختفية في Next.js
    // هذا الكود يضمن تحميل الصور الافتراضية بشكل صحيح
    /* eslint-disable global-require */
    /* eslint-disable @typescript-eslint/no-var-requires */
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;

    // Fix: Use dynamic imports for static export compatibility
    if (typeof window !== "undefined") {
      // Client-side only
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png")
          .default,
        iconUrl: require("leaflet/dist/images/marker-icon.png").default,
        shadowUrl: require("leaflet/dist/images/marker-shadow.png").default,
      });
    }
  }, []);

  // تعريف شكل العلامة الحمراء الخاصة بك (Custom Marker)
  const customIcon = useMemo(() => {
    if (!isMounted) return null; // لا تقم بإنشاء الأيقونة على السيرفر

    return L.divIcon({
      className: "custom-marker",
      html: `
        <div class="relative w-0 h-0">
          <div class="absolute -left-4 -top-4 w-8 h-8 bg-red-500 rounded-full border-4 border-white shadow-lg animate-bounce cursor-move">
            <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-500"></div>
          </div>
          <div class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap">
            ${t("map.yourBusiness") || "Your Business"}
          </div>
        </div>
      `,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });
  }, [t, isMounted]);

  // عند سحب الماركر وترك الماوس
  const onMarkerDragEnd = (event: L.DragEndEvent) => {
    const marker = event.target;
    const position = marker.getLatLng();
    setSelectedLocation({
      lat: parseFloat(position.lat.toFixed(6)),
      lng: parseFloat(position.lng.toFixed(6)),
    });
  };

  // وظيفة الزر: يجيب منتصف الخريطة الحالي ويحط الماركر فيه
  const handleMapClick = (): void => {
    if (mapRef.current) {
      const center = mapRef.current.getCenter();
      setSelectedLocation({
        lat: parseFloat(center.lat.toFixed(6)),
        lng: parseFloat(center.lng.toFixed(6)),
      });
    }
  };

  const handleCitySelect = (cityName: string): void => {
    const city = saudiCities.find((c) => c.name === cityName);
    if (city) {
      setSelectedLocation({
        lat: city.lat,
        lng: city.lng,
      });
      setSelectedCity(cityName);
    }
  };

  const handleAddressGeocode = async (): Promise<void> => {
    if (!customAddress.trim()) return;
    const randomCity =
      saudiCities[Math.floor(Math.random() * saudiCities.length)];
    setSelectedLocation({
      lat: randomCity.lat,
      lng: randomCity.lng,
    });
  };

  const getCurrentLocation = (): void => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setSelectedLocation({
            lat: parseFloat(lat.toFixed(6)),
            lng: parseFloat(lng.toFixed(6)),
          });
        },
        (error) => {
          alert(t("map.cannotGetLocation"));
        }
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
          {!isEditing && (
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
              disabled={!isEditing}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                locationMethod === "map"
                  ? "bg-yellow-400 text-white"
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
              } ${!isEditing ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <i className="ri-map-pin-line mr-2"></i>
              {t("map.methodPin")}
            </button>
            <button
              type="button"
              onClick={() => setLocationMethod("city")}
              disabled={!isEditing}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                locationMethod === "city"
                  ? "bg-yellow-400 text-white"
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
              } ${!isEditing ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <i className="ri-building-line mr-2"></i>
              {t("map.methodCity")}
            </button>
            <button
              type="button"
              onClick={() => setLocationMethod("address")}
              disabled={!isEditing}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                locationMethod === "address"
                  ? "bg-yellow-400 text-white"
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
              } ${!isEditing ? "opacity-50 cursor-not-allowed" : ""}`}
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
                disabled={!isEditing}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm pr-8 ${
                  !isEditing ? "opacity-50 cursor-not-allowed bg-gray-100" : ""
                }`}
              >
                <option value="">{t("map.chooseCityPlaceholder")}</option>
                {saudiCities.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
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
                disabled={!isEditing}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm ${
                  !isEditing ? "opacity-50 cursor-not-allowed bg-gray-100" : ""
                }`}
              />
              <button
                type="button"
                onClick={handleAddressGeocode}
                disabled={!customAddress.trim() || !isEditing}
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
                disabled={!isEditing}
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
          ) : (
            <MapContainer
              center={[selectedLocation.lat, selectedLocation.lng]}
              zoom={13}
              scrollWheelZoom={true}
              style={{ height: "100%", width: "100%" }}
              ref={mapRef}
              className="z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <MapUpdater
                center={[selectedLocation.lat, selectedLocation.lng]}
              />

              {/* التأكد من وجود الأيقونة قبل الرسم */}
              {customIcon && (
                <Marker
                  position={[selectedLocation.lat, selectedLocation.lng]}
                  icon={customIcon}
                  draggable={isEditing} // Only draggable if editing
                  eventHandlers={{
                    dragend: isEditing ? onMarkerDragEnd : undefined, // Only handle dragend if editing
                  }}
                />
              )}
            </MapContainer>
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
              disabled={!isEditing}
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
