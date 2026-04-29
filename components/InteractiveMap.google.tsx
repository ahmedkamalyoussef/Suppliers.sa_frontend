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
        "Google Maps API is not ready. If you see RefererNotAllowedMapError, allow https://supplier.sa/* in your API key referrers.",
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

    // Close any open info windows when clicking on the map
    mapRef.current.addListener("click", () => {
      markersRef.current.forEach(m => {
        if (m.infoWindow) m.infoWindow.close();
      });
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
      // Create yellow pin with S marker content
      const pinSvg = document.createElement("div");
      pinSvg.innerHTML = `
        <svg width="28" height="38" viewBox="0 0 36 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); cursor: pointer; transform: translate(-50%, -100%);">
          <path d="M18 0C8.059 0 0 8.059 0 18c0 13.5 18 30 18 30s18-16.5 18-30C36 8.059 27.941 0 18 0z" fill="#FACC15"/>
          <circle cx="18" cy="18" r="10" fill="white"/>
          <text x="18" y="23" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#FACC15">S</text>
        </svg>
      `;

      let marker: any;
      if (g.maps.marker?.AdvancedMarkerElement) {
        // AdvancedMarkerElement with custom SVG content
        marker = new g.maps.marker.AdvancedMarkerElement({
          position: { lat: business.lat, lng: business.lng },
          map: mapRef.current,
          title: business.name,
          content: pinSvg.firstElementChild,
        });
      } else {
        // Fallback to classic Marker with SVG icon
        marker = new g.maps.Marker({
          position: { lat: business.lat, lng: business.lng },
          map: mapRef.current,
          title: business.name,
          icon: {
            url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
              <svg width="28" height="38" viewBox="0 0 36 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 0C8.059 0 0 8.059 0 18c0 13.5 18 30 18 30s18-16.5 18-30C36 8.059 27.941 0 18 0z" fill="#FACC15"/>
                <circle cx="18" cy="18" r="10" fill="white"/>
                <text x="18" y="23" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#FACC15">S</text>
              </svg>
            `),
            scaledSize: new g.maps.Size(28, 38),
            anchor: new g.maps.Point(14, 38),
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
        <style>
          .gm-style-iw-button { display: none !important; }
          .gm-style-iw-c { padding: 0 !important; border-radius: 12px !important; }
          .gm-style-iw-d { overflow: hidden !important; padding: 0 !important; max-height: none !important; }
          .gm-style-iw-tc { display: none !important; }
          .gm-ui-hover-effect { display: none !important; }
          .gm-style .gm-style-iw-c { padding: 0 !important; }
          .gm-style .gm-style-iw-d { padding: 0 !important; margin: 0 !important; }
          .gm-style-iw-c { box-shadow: none !important; background: transparent !important; }
          
          /* Fully Responsive for InfoWindow across all devices */
          .gm-style-iw-c {
            max-width: 90vw !important;
            max-height: 90vh !important;
            padding: 0 !important;
          }
          .gm-style-iw-d {
            width: 320px !important;
            max-width: 100% !important;
            overflow: visible !important;
            max-height: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          @media (max-width: 768px) {
            .gm-style-iw-d {
              width: 260px !important;
            }
          }

          @media (max-width: 480px) {
            .gm-style-iw-d {
              width: 150px !important;
              max-width: 150px !important;
            }
            .map-tooltip-content {
              width: 150px !important;
              max-width: 150px !important;
            }
            .map-tooltip-content h3 {
              font-size: 10px !important;
            }
            .map-tooltip-content span {
              font-size: 7px !important;
            }
            .map-tooltip-content button {
              padding: 4px !important;
              font-size: 9px !important;
            }
          }
          
          /* Special fix for Google Maps internal wrapper width */
          .gm-style .gm-style-iw {
            max-width: 90vw !important;
          }
        </style>
        <div class="map-tooltip-content" dir="${
          isRtl ? "rtl" : "ltr"
        }" style="background:#fff;border-radius:12px;padding:0;width:100%;box-shadow:0 10px 25px rgba(0,0,0,0.15);overflow:hidden;${
          isRtl ? "direction:rtl;text-align:right;" : ""
        }">
          <div style="background:#FACC15;padding:10px 15px;display:flex;align-items:center;justify-content:space-between;${
            isRtl ? "flex-direction:row-reverse;" : ""
          }">
            <h3 style="font-weight:700;color:#000;font-size:15px;margin:0;">${
              business.name
            }</h3>
            <span style="padding:4px 8px;border-radius:20px;background:#10B981;color:#fff;font-size:10px;font-weight:700;box-shadow:0 2px 4px rgba(0,0,0,0.1);">
              ${t.verified || "Verified"}
            </span>
          </div>
          <div style="padding:15px;">
            <div style="display:flex;gap:12px;margin-bottom:12px;${
              isRtl ? "flex-direction:row-reverse;" : ""
            }">
               <div style="flex:1;">
                 <div style="display:flex;align-items:center;gap:4px;margin-bottom:8px;${
                   isRtl ? "flex-direction:row-reverse;" : ""
                 }">
                   <span style="color:#FACC15;font-size:12px;">⭐</span>
                   <span style="color:#111827;font-size:13px;font-weight:700;">${
                     businessData.rating
                   }</span>
                   <span style="color:#6B7280;font-size:11px;">(${
                     businessData.reviews
                   })</span>
                 </div>
                 <div style="display:flex;flex-wrap:wrap;gap:4px;${
                   isRtl ? "flex-direction:row-reverse;" : ""
                 }">
                   ${(business.categories || [business.category])
                     .slice(0, 2)
                     .map(
                       (category) => `
                     <span style="padding:2px 8px;border-radius:6px;background:#f3f4f6;color:#4b5563;font-size:10px;font-weight:600;">
                       ${category}
                     </span>
                   `,
                     )
                     .join("")}
                 </div>
               </div>
            </div>
            
            <div style="space-y:8px;">
              <div style="display:flex;align-items:center;gap:8px;${
                isRtl ? "flex-direction:row-reverse;" : ""
              }">
                <i class="ri-phone-fill" style="color:#FACC15;font-size:14px;"></i>
                <div style="color:#374151;font-size:12px;">${
                  businessData.phone
                }</div>
              </div>
            </div>

            <button onclick="window.location.href='/business/${business.id}'" style="width:100%;margin-top:15px;background:#FACC15;color:#000;border:none;padding:8px;border-radius:8px;font-weight:700;font-size:12px;cursor:pointer;transition:background 0.2s;">
              ${isRtl ? "عرض الملف الشخصي" : "View Profile"}
            </button>
          </div>
        </div>
      `;

      const infoWindow = new g.maps.InfoWindow({
        content: tooltipContent,
        disableAutoPan: false,
      });

      marker.addListener("click", () => {
        const isOpen = infoWindow.getMap();

        // Close all other info windows
        markersRef.current.forEach(m => {
          if (m.infoWindow) {
            m.infoWindow.close();
          }
        });

        if (!isOpen) {
          infoWindow.open(mapRef.current, marker);
          onBusinessClick(business);
        }
      });

      // Store infoWindow reference in marker to close it later if needed
      marker.infoWindow = infoWindow;

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
