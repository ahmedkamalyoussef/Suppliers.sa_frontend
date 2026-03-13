/**
 * مصفوفة حدود المملكة العربية السعودية عالية الدقة (High Resolution)
 * تم معالجة إزاحة البحر الأحمر والخليج العربي لضمان عدم قطع المياه الإقليمية
 * الإحداثيات بنظام [lat, lng]
 */
const saudiArabiaBorder = [
  // منطقة تبوك وخليج العقبة (بدقة عالية لمنع دخول البحر)
  [29.50, 34.95], [29.45, 34.88], [29.35, 34.82], [29.25, 34.81], [29.15, 34.85],
  [29.05, 34.88], [28.95, 34.89], [28.85, 34.85], [28.75, 34.80], [28.65, 34.75],
  [28.50, 34.70], [28.35, 34.68], [28.20, 34.65], [28.05, 34.68], [27.95, 34.75],
  [27.85, 34.85], [27.75, 34.95], [27.65, 35.05], [27.55, 35.15], [27.45, 35.25],
  
  // ساحل البحر الأحمر (الوجه، أملج، ينبع) - نقاط مكثفة لتتبع الشاطئ
  [27.30, 35.40], [27.15, 35.55], [27.00, 35.70], [26.85, 35.85], [26.70, 36.00],
  [26.55, 36.20], [26.40, 36.40], [26.25, 36.60], [26.10, 36.80], [25.95, 37.00],
  [25.80, 37.20], [25.65, 37.45], [25.50, 37.70], [25.35, 38.00], [25.20, 38.25],
  [25.05, 38.50], [24.90, 38.75], [24.75, 39.00], [24.55, 39.25], [24.40, 39.40],
  [24.25, 39.55], [24.10, 39.70], [23.95, 39.85], [23.80, 40.00], [23.60, 40.10],
  
  // منطقة جدة والشعيبة والقنفذة
  [23.40, 40.20], [23.20, 40.35], [23.00, 40.45], [22.80, 40.55], [22.60, 40.65],
  [22.40, 40.75], [22.20, 40.85], [22.00, 41.00], [21.80, 41.15], [21.60, 41.30],
  [21.40, 41.50], [21.20, 41.70], [21.00, 41.90], [20.80, 42.10], [20.60, 42.30],
  [20.40, 42.50], [20.20, 42.70], [20.00, 42.90], [19.80, 43.10], [19.60, 43.35],
  
  // جازان والحدود الجنوبية مع اليمن (الخضراء والحرث)
  [19.40, 43.60], [19.20, 43.90], [19.00, 44.20], [18.80, 44.50], [18.60, 44.80],
  [18.40, 45.10], [18.20, 45.50], [18.00, 45.80], [17.80, 46.10], [17.60, 46.40],
  [17.40, 46.70], [17.20, 47.00], [17.00, 47.30], [16.80, 47.60], [16.60, 47.90],
  [16.40, 48.20], [16.20, 48.50], [16.30, 48.80], [16.50, 49.10], [16.70, 49.40],
  
  // الربع الخالي والحدود مع عمان والإمارات (المنطقة الشرقية)
  [16.90, 49.70], [17.10, 50.00], [17.30, 50.30], [17.50, 50.60], [17.70, 50.90],
  [18.00, 51.20], [18.30, 51.50], [18.60, 51.80], [18.90, 52.10], [19.20, 52.40],
  [19.50, 52.70], [19.80, 53.00], [20.10, 53.30], [20.40, 53.60], [20.70, 53.90],
  [21.00, 54.20], [21.30, 54.50], [21.60, 54.80], [21.90, 55.10], [22.20, 55.40],
  [22.50, 55.70], [22.70, 55.50], [22.90, 55.20], [23.10, 54.80], [23.30, 54.40],
  [23.50, 54.00], [23.70, 53.60], [23.90, 53.20], [24.10, 52.80], [24.30, 52.50],
  [24.50, 52.20], [24.70, 51.90], [24.90, 51.70], [25.10, 51.55], [25.30, 51.45],
  
  // الخليج العربي (الخبر، الدمام، الجبيل، الخفجي)
  [25.50, 51.35], [25.70, 51.25], [25.90, 51.10], [26.10, 50.95], [26.30, 50.80],
  [26.50, 50.65], [26.70, 50.50], [26.90, 50.30], [27.10, 50.15], [27.30, 49.95],
  [27.50, 49.75], [27.70, 49.55], [27.90, 49.35], [28.10, 49.15], [28.30, 48.95],
  [28.50, 48.75], [28.70, 48.55], [28.90, 48.35], [29.10, 48.15], [29.30, 48.00],
  
  // الحدود الشمالية (الكويت، العراق، الأردن - عرعر وطريف والقريات)
  [29.50, 47.80], [29.70, 47.50], [29.90, 47.20], [30.10, 46.90], [30.30, 46.50],
  [30.50, 46.10], [30.70, 45.70], [30.90, 45.30], [31.10, 44.90], [31.30, 44.50],
  [31.50, 44.10], [31.70, 43.70], [31.90, 43.30], [32.10, 42.90], [32.15, 42.50],
  [32.10, 42.10], [31.90, 41.70], [31.70, 41.30], [31.50, 40.90], [31.30, 40.50],
  [31.10, 40.10], [30.90, 39.70], [30.70, 39.30], [30.50, 38.90], [30.30, 38.50],
  [30.10, 38.10], [29.90, 37.70], [29.70, 37.30], [29.60, 36.90], [29.55, 36.50],
  [29.52, 36.10], [29.50, 35.70], [29.50, 35.30], [29.50, 34.95]
];

// Google Maps Geocoding API for accurate Saudi Arabia detection
const GOOGLE_MAPS_API_KEY = "AIzaSyBcMJlGvV2VKLfIRmpjBV53pbwLDcfOS-Q";

// Google Maps Geocoding API response types
interface AddressComponent {
  types: string[];
  short_name: string;
  long_name: string;
}

interface GeocodeResult {
  address_components: AddressComponent[];
}

interface GeocodeResponse {
  status: string;
  results: GeocodeResult[];
}

/**
 * Check if coordinates are within Saudi Arabia using Google Maps Geocoding API
 * This is more accurate than polygon validation as it uses Google's own country data
 */
async function isInsideSaudi(lat: number, lng: number): Promise<boolean> {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
    );
    
    const data: GeocodeResponse = await response.json();
    
    if (data.status !== "OK" || !data.results || data.results.length === 0) {
      // Fallback to polygon validation if API fails
      return isPointInPolygon(lat, lng, saudiArabiaBorder);
    }
    
    const country = data.results
      .flatMap((r: GeocodeResult) => r.address_components)
      .find((c: AddressComponent) => c.types.includes("country"));
    
    return country?.short_name === "SA";
  } catch (error) {
    console.warn("Google Maps API failed, falling back to polygon validation:", error);
    // Fallback to polygon validation if API fails
    return isPointInPolygon(lat, lng, saudiArabiaBorder);
  }
}

// Function to check if a point is inside a polygon using ray casting algorithm
const isPointInPolygon = (lat: number, lng: number, polygon: number[][]): boolean => {
  let inside = false;
  const x = lng;
  const y = lat;
  
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][1];
    const yi = polygon[i][0];
    const xj = polygon[j][1];
    const yj = polygon[j][0];
    
    const intersect = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    
    if (intersect) inside = !inside;
  }
  
  return inside;
};

// Function to check if coordinates are within Saudi Arabia (async version)
export const isWithinSaudiArabia = async (lat: number, lng: number): Promise<boolean> => {
  return await isInsideSaudi(lat, lng);
};

// Function to get the nearest Saudi city if outside Saudi Arabia
export const getNearestSaudiCity = (lat: number, lng: number): { lat: number; lng: number; name: string } => {
  // Default to Riyadh as the center of Saudi Arabia
  return {
    lat: 24.7136,
    lng: 46.6753,
    name: "Riyadh"
  };
};

// Function to validate and correct location if needed (async version)
export const validateSaudiLocation = async (lat: number, lng: number): Promise<{
  lat: number;
  lng: number;
  isWithinSaudi: boolean;
  correctedTo?: string;
}> => {
  const isWithinSaudi = await isWithinSaudiArabia(lat, lng);
  
  if (!isWithinSaudi) {
    const nearestCity = getNearestSaudiCity(lat, lng);
    return {
      lat: nearestCity.lat,
      lng: nearestCity.lng,
      isWithinSaudi: false,
      correctedTo: nearestCity.name
    };
  }
  
  return {
    lat,
    lng,
    isWithinSaudi: true
  };
};
