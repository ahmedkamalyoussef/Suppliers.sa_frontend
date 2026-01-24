// components/InteractiveMap.google.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../lib/LanguageContext";

// Reuse the same loader from BusinessLocationMap to avoid duplicate script loads
const GOOGLE_MAPS_SCRIPT_ID = "google-maps-js";

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
      "AIzaSyBcMJlGvV2VKLfIRmpjBV53pbwLDcfOS-Q",
    )}&v=weekly&loading=async`;
    script.onload = () => {
      waitForGoogleMapsReady().then(resolve).catch(reject);
    };
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
  });
}

// Define types
interface Business {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: string;
  category: string;
  categories?: string[];
  businessType?: string;
  profileImage?: string;
  serviceDistance?: number;
  rating?: number;
  reviewsCount?: number;
  status?: string;
  phone?: string;
  contactEmail?: string;
  description?: string;
}

interface MapProps {
  businesses: Business[];
  onBusinessClick: (business: Business) => void;
  mapStyle?: string;
}

const InteractiveMapGoogle = ({
  businesses,
  onBusinessClick,
  mapStyle: propMapStyle,
}: MapProps) => {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isMapsReady, setIsMapsReady] = useState(false);
  const [mapsError, setMapsError] = useState<string | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

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
  }, [isClient]);

  useEffect(() => {
    if (!isClient || !isMapsReady) return;
    if (!mapDivRef.current) return;
    if (mapRef.current) return;

    const g = (window as any).google;
    if (!g?.maps) return;
    if (typeof g.maps.Map !== "function") {
      setMapsError(
        "Google Maps API is not ready. If you see RefererNotAllowedMapError, allow http://localhost:3000/* in your API key referrers.",
      );
      return;
    }

    mapRef.current = new g.maps.Map(mapDivRef.current, {
      center: { lat: 23.8859, lng: 45.0792 },
      zoom: 6,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
      zoomControl: true,
    });

    // Add reset to Saudi Arabia button
    const resetControlDiv = document.createElement("div");
    resetControlDiv.style.marginRight = "10px";
    resetControlDiv.style.marginTop = "10px";
    const resetButton = document.createElement("button");
    resetButton.innerHTML = "🇸🇦";
    resetButton.title = "Back to Saudi Arabia";
    resetButton.style.cssText = `
      background: white;
      border: 2px solid #3B82F6;
      border-radius: 5px;
      padding: 8px 16px;
      cursor: pointer;
      font-weight: bold;
      color: #3B82F6;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      transition: all 0.2s;
    `;
    resetButton.onmouseover = () => {
      resetButton.style.background = "#f0f9ff";
      resetButton.style.transform = "scale(1.05)";
    };
    resetButton.onmouseout = () => {
      resetButton.style.background = "white";
      resetButton.style.transform = "scale(1)";
    };
    resetButton.onclick = () => {
      mapRef.current.setCenter({ lat: 23.8859, lng: 45.0792 });
      mapRef.current.setZoom(6);
    };
    resetControlDiv.appendChild(resetButton);
    mapRef.current.controls[g.maps.ControlPosition.TOP_RIGHT].push(
      resetControlDiv,
    );

    return () => {
      try {
        mapRef.current = null;
      } catch {
        // ignore cleanup errors
      }
    };
  }, [isClient, isMapsReady]);

  // Update markers when businesses change
  useEffect(() => {
    if (!isClient || !isMapsReady) return;
    if (!mapRef.current) return;

    const g = (window as any).google;
    if (!g?.maps) return;

    // Remove existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    const bounds = new g.maps.LatLngBounds();

    businesses.forEach((business) => {
      const markerColor = getBusinessMarkerColor(business.type);

      // Create custom marker using Google Maps AdvancedMarkerElement if available, otherwise fallback to Marker
      let marker: any;
      if (g.maps.marker?.AdvancedMarkerElement) {
        // AdvancedMarkerElement (modern)
        const pin = new g.maps.marker.PinElement({
          background: markerColor,
          borderColor: "#fff",
          glyphColor: "#fff",
          scale: 1.2,
        });
        marker = new g.maps.marker.AdvancedMarkerElement({
          position: { lat: business.lat, lng: business.lng },
          map: mapRef.current,
          title: business.name,
          content: pin.element,
        });
      } else {
        // Fallback to classic Marker
        marker = new g.maps.Marker({
          position: { lat: business.lat, lng: business.lng },
          map: mapRef.current,
          title: business.name,
          icon: {
            path: g.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: markerColor,
            fillOpacity: 1,
            strokeColor: "#fff",
            strokeWeight: 2,
          },
        });
      }

      // Build tooltip content (same as original)
      const isRtl = language === "ar";
      const translations = {
        en: {
          businessType: "Business Type",
          address: "Address",
          phone: "Phone",
          email: "Email",
          category: "Category",
          status: "Status",
          verified: "Verified",
          pending: "Pending",
          rating: "Rating",
          reviews: "Reviews",
          notAvailable: "N/A",
        },
        ar: {
          businessType: "نوع النشاط",
          address: "العنوان",
          phone: "الهاتف",
          email: "البريد الإلكتروني",
          category: "الفئة",
          status: "الحالة",
          verified: "موثق",
          pending: "في الانتظار",
          rating: "التقييم",
          reviews: "المراجعات",
          notAvailable: "غير متوفر",
        },
      };

      const t =
        translations[language as keyof typeof translations] || translations.en;

      const getTranslation = (key: string, fallback: string) => {
        return (t as any)[key] || fallback;
      };

      const businessData = {
        phone: business.phone || getTranslation("notAvailable", "N/A"),
        email: business.contactEmail || getTranslation("notAvailable", "N/A"),
        rating: business.rating || 0,
        reviews: business.reviewsCount || 0,
        status: business.status || "pending",
        description: business.description || "",
      };

      const tooltipContent = `
        <div dir="${
          isRtl ? "rtl" : "ltr"
        }" style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:10px 12px;min-width:400px;max-width:500px;box-shadow:0 8px 20px rgba(0,0,0,0.12);${
          isRtl ? "direction:rtl;text-align:right;" : ""
        }">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;${
            isRtl ? "flex-direction:row-reverse;" : ""
          }">
            <h3 style="font-weight:700;color:#111827;font-size:14px;margin:0;">${
              business.name
            }</h3>
            <span style="padding:3px 6px;border-radius:12px;background:${
              businessData.status === "approved" ? "#10B981" : "#F59E0B"
            };color:#fff;font-size:9px;font-weight:600;">
              ${
                businessData.status === "approved"
                  ? t.verified || "Verified"
                  : t.pending || "Pending"
              }
            </span>
          </div>
          <div style="display:flex;gap:12px;align-items:flex-start;${
            isRtl ? "flex-direction:row-reverse;" : ""
          }">
            <div style="flex:1;min-width:0;">
              <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:6px;${
                isRtl ? "flex-direction:row-reverse;" : ""
              }">
                ${(business.categories || [business.category])
                  .map(
                    (category) => `
                  <span style="padding:3px 6px;border-radius:8px;background:#6B7280;color:#fff;font-size:9px;font-weight:600;">
                    ${category}
                  </span>
                `,
                  )
                  .join("")}
              </div>
              <div style="margin-bottom:6px;">
                <div style="color:#6B7280;font-size:9px;font-weight:600;margin-bottom:1px;">${
                  t.address
                }</div>
                <div style="color:#374151;font-size:10px;line-height:1.2;">${
                  business.address
                }</div>
              </div>
              <div style="margin-bottom:6px;">
                <div style="color:#6B7280;font-size:9px;font-weight:600;margin-bottom:1px;">${
                  t.phone
                }</div>
                <div style="color:#374151;font-size:9px;">${
                  businessData.phone
                }</div>
              </div>
            </div>
            <div style="flex:1;min-width:0;">
              <div style="display:flex;align-items:center;gap:4px;margin-bottom:6px;${
                isRtl ? "flex-direction:row-reverse;" : ""
              }">
                <span style="color:#F59E0B;font-size:10px;">⭐</span>
                <span style="color:#374151;font-size:10px;font-weight:600;">${
                  businessData.rating
                }</span>
                <span style="color:#6B7280;font-size:8px;">(${
                  businessData.reviews
                })</span>
              </div>
              <div style="margin-bottom:6px;">
                <div style="color:#6B7280;font-size:9px;font-weight:600;margin-bottom:1px;">${
                  t.email
                }</div>
                <div style="color:#374151;font-size:9px;">${
                  businessData.email
                }</div>
              </div>
            </div>
          </div>
          <div style="margin-top:6px;padding-top:6px;border-top:1px solid #f3f4f6;display:flex;justify-content:space-between;">
            <div>
              <div style="color:#6B7280;font-size:9px;font-weight:600;margin-bottom:2px;">
                ${t.rating || "Rating"}
              </div>
              <div style="color:#374151;font-size:10px;display:flex;align-items:center;gap:2px;">
                <span>${businessData.rating}</span>
                <i class="ri-star-fill" style="color:#F59E0B;font-size:12px;"></i>
                <span style="margin-left:4px;color:#6B7280;font-size:9px;">(${
                  businessData.reviews
                })</span>
              </div>
            </div>
            <div>
              <div style="color:#6B7280;font-size:9px;font-weight:600;margin-bottom:2px;">
                ${t.status || "Status"}
              </div>
              <div style="color:#374151;font-size:10px;display:flex;align-items:center;gap:2px;">
                <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background-color:${
                  businessData.status === "approved" ? "#10B981" : "#F59E0B"
                };"></span>
                <span>${
                  businessData.status === "approved"
                    ? t.verified || "Verified"
                    : t.pending || "Pending"
                }</span>
              </div>
            </div>
          </div>
        </div>
      `;

      const infoWindow = new g.maps.InfoWindow({
        content: tooltipContent,
      });

      marker.addListener("mouseover", () => {
        infoWindow.open(mapRef.current, marker);
        onBusinessClick(business);
      });

      marker.addListener("mouseout", () => {
        // Keep open on hover over infoWindow
        setTimeout(() => {
          if (!infoWindow.getMap()) return;
          // Check if mouse is still over the infoWindow
          infoWindow.close();
        }, 200);
      });

      marker.addListener("click", () => {
        onBusinessClick(business);
      });

      markersRef.current.push(marker);
      bounds.extend({ lat: business.lat, lng: business.lng });
    });

    // Fit map to show all markers if there are any
    if (businesses.length > 0) {
      mapRef.current.fitBounds(bounds, {
        top: 40,
        right: 40,
        bottom: 40,
        left: 40,
      });
    }
  }, [isClient, isMapsReady, businesses, onBusinessClick, language]);

  const getBusinessMarkerColor = (type: string) => {
    const colors: { [key: string]: string } = {
      Electronics: "#3B82F6",
      Automotive: "#EF4444",
      Agriculture: "#10B981",
      Industrial: "#F59E0B",
      Construction: "#EAB308",
      Fashion: "#EC4899",
      Medical: "#14B8A6",
      Food: "#F97316",
      Technology: "#8B5CF6",
      "Oil&Gas": "#000000",
      Marine: "#1D4ED8",
      Mining: "#78716C",
      Tourism: "#F43F5E",
      Textiles: "#D946EF",
      Equipment: "#475569",
      Military: "#166534",
      Logistics: "#1E40AF",
      Port: "#1E3A8A",
      Fishing: "#60A5FA",
      Perfumes: "#7C3AED",
      Petrochemical: "#374151",
    };
    return colors[type] || "#6B7280";
  };

  if (!isClient) {
    return (
      <div className="bg-gray-100 rounded-2xl h-64 sm:h-80 md:h-[28rem] flex items-center justify-center">
        <div className="text-center">
          <i className="ri-map-pin-line text-3xl text-yellow-500 mb-2 animate-pulse"></i>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  if (mapsError) {
    return (
      <div className="bg-gray-100 rounded-2xl h-64 sm:h-80 md:h-[28rem] flex items-center justify-center p-6">
        <div className="text-center text-red-600">{mapsError}</div>
      </div>
    );
  }

  if (!isMapsReady) {
    return (
      <div className="bg-gray-100 rounded-2xl h-64 sm:h-80 md:h-[28rem] flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line animate-spin text-3xl text-yellow-500 mb-2"></i>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-xl h-64 sm:h-80 md:h-[28rem] relative z-0">
      <div ref={mapDivRef} className="w-full h-full rounded-2xl z-0" />
    </div>
  );
};

export default InteractiveMapGoogle;
