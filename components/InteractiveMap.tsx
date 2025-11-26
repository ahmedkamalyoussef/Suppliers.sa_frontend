// components/InteractiveMap.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";

// Define types
interface Business {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: string;
  category: string;
  categories?: string[]; // Array of categories
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
  mapStyle?: string; // إضافة prop للـ style
}

const InteractiveMap = ({
  businesses,
  onBusinessClick,
  mapStyle: propMapStyle,
}: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);
  const tileLayerRef = useRef<any>(null);
  const { language } = useLanguage();
  const [mapStyle, setMapStyle] = useState(propMapStyle || "streets"); // متغير للـ style
  // Debug log for language changes
  useEffect(() => {
    // Language change handler
  }, [language]);

  // Update map style when prop changes
  useEffect(() => {
    if (propMapStyle && propMapStyle !== mapStyle) {
      setMapStyle(propMapStyle);
    }
  }, [propMapStyle, mapStyle]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapRef.current || map) return;

    let isMounted = true;
    let mapInstance: any = null;
    let controller = new AbortController();

    // Dynamic import لـ Leaflet
    const initMap = async () => {
      try {
        const L = await import("leaflet");
        // Load MapTiler Leaflet SDK to augment L with maptilerLayer (for vector multilingual tiles)
        await import("@maptiler/leaflet-maptilersdk");

        if (!isMounted || !mapRef.current || controller.signal.aborted) return;

        // إصلاح مشكلة الـ default markers
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        });

        // Initialize map - نبدأ بمنطقة السعودية
        mapInstance = L.map(mapRef.current!).setView([23.8859, 45.0792], 6);

        if (!isMounted || controller.signal.aborted) {
          mapInstance.remove();
          return;
        }

        // Force low z-index for all map panes so it never overlaps other UI
        const panes = mapInstance.getPanes();
        if (panes?.mapPane) panes.mapPane.style.zIndex = "0";
        if (panes?.tilePane) panes.tilePane.style.zIndex = "0";
        if (panes?.overlayPane) panes.overlayPane.style.zIndex = "0";
        if (panes?.shadowPane) panes.shadowPane.style.zIndex = "0";
        if (panes?.markerPane) panes.markerPane.style.zIndex = "0";
        if (panes?.popupPane) panes.popupPane.style.zIndex = "0";
        if ((panes as any) && (panes as any).tooltipPane)
          (panes as any).tooltipPane.style.zIndex = "1";
        const controlContainer = mapInstance
          .getContainer()
          .querySelector(".leaflet-control-container") as HTMLElement | null;
        if (controlContainer) controlContainer.style.zIndex = "0";

        // Choose tile source. Prefer MapTiler SDK for language switching; fallback to OSM.
        const mapTilerKey = process.env.NEXT_PUBLIC_MAPTILER_KEY;

        if (mapTilerKey) {
          const { MaptilerLayer } = await import(
            "@maptiler/leaflet-maptilersdk"
          );
          const initialLanguage = language === "ar" ? "ar" : "en";

          const layer = new MaptilerLayer({
            apiKey: mapTilerKey,
            style: mapStyle,
            language: initialLanguage,
          });
          tileLayerRef.current = layer;
          if (isMounted) {
            layer.addTo(mapInstance);
          }
        } else {
          const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
          tileLayerRef.current = L.tileLayer(tileUrl, {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18,
            minZoom: 3, // نسمح بالـ zoom out أكثر
          }).addTo(mapInstance);
        }
        // Add custom control to reset to Saudi Arabia
        const ResetControl = L.Control.extend({
          onAdd: function () {
            const div = L.DomUtil.create("div", "reset-control");
            div.innerHTML = `
        <button style="
          background: white;
          border: 2px solid #3B82F6;
          border-radius: 5px;
          padding: 8px 16px;
          cursor: pointer;
          font-weight: bold;
          color: #3B82F6;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          transition: all 0.2s;
        "
        onmouseover="this.style.background='#f0f9ff'; this.style.transform='scale(1.05)'"
        onmouseout="this.style.background='white'; this.style.transform='scale(1)'"
        title="Back to Saudi Arabia">
          🇸🇦
        </button>
      `;
            div.onclick = () => {
              mapInstance.setView([23.8859, 45.0792], 6);
            };
            return div;
          },
          options: {
            position: "topright",
          },
        });
        const resetControl = new ResetControl();
        resetControl.addTo(mapInstance);

        if (isMounted) {
          setMap(mapInstance);
        }
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };

    initMap();

    return () => {
      isMounted = false;
      controller.abort();
      if (mapInstance) {
        try {
          mapInstance.remove();
        } catch (error) {
          console.error("Error removing map:", error);
        }
      }
    };
  }, [isClient]);

  // Update base tiles when language changes (for MapTiler). If no key, OSM remains unchanged.
  useEffect(() => {
    if (!map || !isClient) return;

    let isMounted = true;
    let controller = new AbortController();

    const updateTiles = async () => {
      try {
        const L = await import("leaflet");
        await import("@maptiler/leaflet-maptilersdk");
        const mapTilerKey = process.env.NEXT_PUBLIC_MAPTILER_KEY;

        if (!isMounted || !map || controller.signal.aborted) return;

        if (!mapTilerKey) {
          return; // OSM doesn't support language switching
        }

        // Safely remove old layer
        if (tileLayerRef.current && map && !controller.signal.aborted) {
          try {
            map.removeLayer(tileLayerRef.current);
            tileLayerRef.current = null;
            // Small delay to ensure layer is fully removed before adding new one
            await new Promise((resolve) => setTimeout(resolve, 50));
          } catch (error) {
            console.error("Error removing tile layer:", error);
          }
        }

        if (!isMounted || !map || controller.signal.aborted) return;

        const { MaptilerLayer } = await import("@maptiler/leaflet-maptilersdk");
        const targetLanguage = language === "ar" ? "ar" : "en";

        const layer = new MaptilerLayer({
          apiKey: mapTilerKey,
          style: mapStyle,
          language: targetLanguage,
        });

        if (isMounted && map && !controller.signal.aborted) {
          tileLayerRef.current = layer;
          layer.addTo(map);
        }
      } catch (error) {
        if (!(error instanceof Error && error.name === "AbortError")) {
          console.error("Error updating tiles:", error);
        }
      }
    };

    // Debounce tile updates to prevent rapid changes
    const timer = setTimeout(() => {
      updateTiles();
    }, 300);

    return () => {
      isMounted = false;
      controller.abort();
      clearTimeout(timer);
    };
  }, [language, map, isClient, mapStyle]);

  // Update markers when businesses change
  useEffect(() => {
    if (!map || !isClient) return;

    const updateMarkers = async () => {
      const L = await import("leaflet");

      // Remove existing markers
      markers.forEach((marker) => marker.removeFrom(map));
      const newMarkers: any[] = [];

      businesses.forEach((business) => {
        const markerColor = getBusinessMarkerColor(business.type);

        // Create custom marker
        const customIcon = L.divIcon({
          className: "custom-marker",
          html: `
            <div style="
              background-color: ${markerColor};
              width: 20px;
              height: 20px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: none;
              cursor: pointer;
            "></div>
          `,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        const marker = L.marker([business.lat, business.lng], {
          icon: customIcon,
          title: business.name,
        }).addTo(map);

        // Build hover tooltip content with translations
        const isRtl = language === "ar";

        // Translations object
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
            established: "Established",
            employees: "Employees",
            workingHours: "Working Hours",
            website: "Website",
            description: "Description",
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
            established: "تأسس في",
            employees: "الموظفين",
            workingHours: "ساعات العمل",
            website: "الموقع الإلكتروني",
            description: "الوصف",
          },
        };

        const t =
          translations[language as keyof typeof translations] ||
          translations.en;

        // Helper function to get translation or fallback
        const getTranslation = (key: string, fallback: string) => {
          return (t as any)[key] || fallback;
        };

        // Use actual business data with fallbacks
        const businessData = {
          phone: business.phone || getTranslation("notAvailable", "N/A"),
          email: business.contactEmail || getTranslation("notAvailable", "N/A"),
          rating: business.rating || 0,
          reviews: business.reviewsCount || 0,
          workingHours: getTranslation("notAvailable", "N/A"),
          status: business.status || "pending",
          description: business.description || "",
        };

        const tooltipContent = `
          <div dir="${
            isRtl ? "rtl" : "ltr"
          }" style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:10px 12px;min-width:400px;max-width:500px;box-shadow:0 8px 20px rgba(0,0,0,0.12);${
          isRtl ? "direction:rtl;text-align:right;" : ""
        }">
            <!-- Header Row -->
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;${
              isRtl ? "flex-direction:row-reverse;" : ""
            }">
              <h3 style="font-weight:700;color:#111827;font-size:14px;margin:0;">${
                business.name
              }</h3>
              <span style="padding:3px 6px;border-radius:12px;background:${
                businessData.status === "approved" ? "#10B981" : "#F59E0B"
              };color:#fff;font-size:9px;font-weight:600;">
                ${businessData.status === "approved" ? t.verified : t.pending}
              </span>
            </div>

            <!-- Main Content Row -->
            <div style="display:flex;gap:12px;align-items:flex-start;${
              isRtl ? "flex-direction:row-reverse;" : ""
            }">
              <!-- Left Column -->
              <div style="flex:1;min-width:0;">
                <!-- Business Type & Category -->
                <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:6px;${
                  isRtl ? "flex-direction:row-reverse;" : ""
                }">
                  ${(business.categories || [business.category])
                    .map(
                      (category) => `
                    <span style="padding:3px 6px;border-radius:8px;background:#6B7280;color:#fff;font-size:9px;font-weight:600;">
                      ${category}
                    </span>
                  `
                    )
                    .join("")}
                </div>

                <!-- Address -->
                <div style="margin-bottom:6px;">
                  <div style="color:#6B7280;font-size:9px;font-weight:600;margin-bottom:1px;">${
                    t.address
                  }</div>
                  <div style="color:#374151;font-size:10px;line-height:1.2;">${
                    business.address
                  }</div>
                </div>

                <!-- Contact Info -->
                <div style="margin-bottom:6px;">
                  <div style="color:#6B7280;font-size:9px;font-weight:600;margin-bottom:1px;">${
                    t.phone
                  }</div>
                  <div style="color:#374151;font-size:9px;">${
                    businessData.phone
                  }</div>
                </div>
              </div>

              <!-- Right Column -->
              <div style="flex:1;min-width:0;">
                <!-- Rating -->
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

                <!-- Email -->
                <div style="margin-bottom:6px;">
                  <div style="color:#6B7280;font-size:9px;font-weight:600;margin-bottom:1px;">${
                    t.email
                  }</div>
                  <div style="color:#374151;font-size:9px;">${
                    businessData.email
                  }</div>
                </div>

                <!-- Additional Info -->
                <div style="display:flex;gap:8px;${
                  isRtl ? "flex-direction:row-reverse;" : ""
                }">
                  </div>
                </div>
              </div>
            </div>

            <!-- Rating and Reviews -->
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
        marker.bindTooltip(tooltipContent, {
          direction: "top",
          offset: [0, -10], // موحد للغتين
          opacity: 1,
          permanent: false,
          sticky: true,
          interactive: true,
          className: "leaflet-business-tooltip",
        });

        // No button handlers needed since we removed the buttons

        // متغ��رات للتحكم في فتح وإغلاق الـ tooltip
        let isTooltipOpen = false;
        let closeTimeout: NodeJS.Timeout;
        let isHoveringTooltip = false;
        let isHoveringMarker = false;

        // Handle tooltip events
        marker.on("tooltipopen", (e) => {
          isTooltipOpen = true;
          const tooltip = e.tooltip;
          const tooltipElement = tooltip.getElement();

          if (tooltipElement) {
            // No button event listeners needed since we removed the buttons

            // منع إغلاق الـ tooltip عند hover عليه
            tooltipElement.addEventListener("mouseenter", () => {
              isHoveringTooltip = true;
              clearTimeout(closeTimeout);
            });

            tooltipElement.addEventListener("mouseleave", () => {
              isHoveringTooltip = false;
              // إغلاق الـ tooltip بعد مغادرة الماوس بفترة قصيرة فقط إذا لم نكن نhover على الـ marker
              closeTimeout = setTimeout(() => {
                if (!isHoveringTooltip && !isHoveringMarker && isTooltipOpen) {
                  marker.closeTooltip();
                  isTooltipOpen = false;
                }
              }, 100);
            });
          }
        });

        marker.on("tooltipclose", () => {
          isTooltipOpen = false;
          isHoveringTooltip = false;
          clearTimeout(closeTimeout);
        });

        // Hover behavior - منطق محسن لمنع الـ flickering
        marker.on("mouseover", () => {
          isHoveringMarker = true;
          clearTimeout(closeTimeout);
          if (!isTooltipOpen) {
            marker.openTooltip();
            onBusinessClick(business);
          }
        });

        marker.on("mouseout", () => {
          isHoveringMarker = false;
          // إغلاق الـ tooltip بعد مغادرة الماوس بفترة قصيرة فقط إذا لم نكن نhover على الـ tooltip
          closeTimeout = setTimeout(() => {
            if (!isHoveringTooltip && !isHoveringMarker && isTooltipOpen) {
              marker.closeTooltip();
              isTooltipOpen = false;
            }
          }, 100);
        });

        // Also handle click on marker
        marker.on("click", () => {
          onBusinessClick(business);
        });

        newMarkers.push(marker);
      });

      setMarkers(newMarkers);

      // Fit map to show all markers if there are any
      if (businesses.length > 0) {
        const group = L.featureGroup(newMarkers);
        map.fitBounds(group.getBounds(), { padding: [20, 20] });
      }
    };

    updateMarkers();
  }, [map, isClient, businesses, onBusinessClick, language]);

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

  return (
    <div
      className="bg-gray-100 rounded-2xl overflow-hidden shadow-xl h-64 sm:h-80 md:h-[28rem] relative z-0"
      style={{ zIndex: 0 }}
    >
      <div
        ref={mapRef}
        className="w-full h-full rounded-2xl z-0"
        style={{ zIndex: 0 }}
      />
    </div>
  );
};

export default InteractiveMap;
