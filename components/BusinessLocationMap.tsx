"use client";

import { useState } from "react";
import { useLanguage } from "../lib/LanguageContext";

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

export default function BusinessLocationMap({
  selectedLocation,
  setSelectedLocation,
}: BusinessLocationMapProps) {
  const { t } = useLanguage();
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [customAddress, setCustomAddress] = useState<string>("");
  const [locationMethod, setLocationMethod] = useState<LocationMethod>("map");

  const handleMapClick = (): void => {
    // In a real implementation, you would get coordinates from the map click event
    // For now, we'll simulate with a small random offset within Saudi Arabia bounds
    const newLat = 24.7136 + (Math.random() - 0.5) * 10; // Approximate Saudi Arabia lat range
    const newLng = 46.6753 + (Math.random() - 0.5) * 20; // Approximate Saudi Arabia lng range

    // Ensure coordinates stay within Saudi Arabia bounds
    const boundedLat = Math.max(16, Math.min(32, newLat));
    const boundedLng = Math.max(34, Math.min(55, newLng));

    setSelectedLocation({
      lat: parseFloat(boundedLat.toFixed(6)),
      lng: parseFloat(boundedLng.toFixed(6)),
    });
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

    // In a real implementation, you would use a geocoding service
    // For demo, we'll set a random location in Saudi Arabia
    const randomCity =
      saudiCities[Math.floor(Math.random() * saudiCities.length)];
    const offsetLat = randomCity.lat + (Math.random() - 0.5) * 0.1;
    const offsetLng = randomCity.lng + (Math.random() - 0.5) * 0.1;

    setSelectedLocation({
      lat: parseFloat(offsetLat.toFixed(6)),
      lng: parseFloat(offsetLng.toFixed(6)),
    });
  };

  const getCurrentLocation = (): void => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          // Check if location is within Saudi Arabia bounds (approximate)
          if (lat >= 16 && lat <= 32 && lng >= 34 && lng <= 55) {
            setSelectedLocation({
              lat: parseFloat(lat.toFixed(6)),
              lng: parseFloat(lng.toFixed(6)),
            });
          } else {
            // If outside Saudi Arabia, default to Riyadh
            setSelectedLocation({
              lat: 24.7136,
              lng: 46.6753,
            });
            alert(t("map.outsideSaudi"));
          }
        },
        (error) => {
          console.error("Error getting location:", error);
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
        </div>

        {/* Location Method Selection */}
        <div className="p-4 bg-gray-50 border-b border-gray-100">
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => setLocationMethod("map")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                locationMethod === "map"
                  ? "bg-yellow-400 text-white"
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              <i className="ri-map-pin-line mr-2"></i>
              {t("map.methodPin")}
            </button>
            <button
              onClick={() => setLocationMethod("city")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                locationMethod === "city"
                  ? "bg-yellow-400 text-white"
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              <i className="ri-building-line mr-2"></i>
              {t("map.methodCity")}
            </button>
            <button
              onClick={() => setLocationMethod("address")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                locationMethod === "address"
                  ? "bg-yellow-400 text-white"
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
              }`}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm pr-8"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
              />
              <button
                onClick={handleAddressGeocode}
                disabled={!customAddress.trim()}
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
                onClick={getCurrentLocation}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-medium text-sm whitespace-nowrap cursor-pointer mr-3"
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

        <div className="relative h-96">
          <iframe
            src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2!2d${selectedLocation.lng}!3d${selectedLocation.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${selectedLocation.lat}%2C${selectedLocation.lng}!5e0!3m2!1sen!2sus!4v1645123456789!5m2!1sen!2sus&disableDefaultUI=true&gestureHandling=none&scrollwheel=false&disableDoubleClickZoom=true&clickableIcons=false`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Business Location Map"
            className={locationMethod === "map" ? "cursor-crosshair" : ""}
          ></iframe>

          {/* Location Pin Overlay */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="relative">
              <div className="w-8 h-8 bg-red-500 rounded-full border-4 border-white shadow-lg animate-bounce">
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-500"></div>
              </div>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                {t("map.yourBusiness")}
              </div>
            </div>
          </div>

          {/* Saudi Arabia city markers */}
          <div className="absolute inset-0 pointer-events-none">
            {saudiCities.slice(0, 6).map((city) => {
              // Calculate approximate position based on map bounds
              const xPercent = ((city.lng - 34) / (55 - 34)) * 100;
              const yPercent = ((32 - city.lat) / (32 - 16)) * 100;

              return (
                <div
                  key={city.name}
                  className="absolute w-3 h-3 bg-blue-400 rounded-full border-2 border-white shadow-md"
                  style={{
                    left: `${Math.max(5, Math.min(95, xPercent))}%`,
                    top: `${Math.max(5, Math.min(95, yPercent))}%`,
                  }}
                  title={city.name}
                ></div>
              );
            })}
          </div>
        </div>

        <div className="p-4 bg-gray-50 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{t("map.latitude")}</span>
            <span className="font-mono text-gray-800">
              {selectedLocation.lat.toFixed(6)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{t("map.longitude")}</span>
            <span className="font-mono text-gray-800">
              {selectedLocation.lng.toFixed(6)}
            </span>
          </div>

          {locationMethod === "map" && (
            <button
              onClick={handleMapClick}
              className="w-full bg-yellow-400 text-white py-2 px-4 rounded-lg hover:bg-yellow-500 font-medium text-sm whitespace-nowrap cursor-pointer"
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
