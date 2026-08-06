/**
 * Formats a service distance/area value with appropriate distance unit (km / كم)
 * based on the selected language.
 *
 * @param distance - The distance value (e.g. 100, "100", "50", "100+")
 * @param language - Current language ("ar" | "en")
 * @param fallback - Fallback string if distance is null/undefined/0/empty
 */
export function formatServiceDistance(
  distance: string | number | null | undefined,
  language: string = "en",
  fallback: string = ""
): string {
  if (
    distance === null ||
    distance === undefined ||
    distance === "" ||
    distance === 0 ||
    distance === "0"
  ) {
    return fallback;
  }

  const strVal = String(distance).trim();
  if (!strVal || strVal === "0") {
    return fallback;
  }

  const unit = language === "ar" ? "كم" : "km";

  // Extract purely the numeric part if unit is already partially attached
  const cleanedNum = strVal.replace(/[^0-9.+]/g, "").trim();
  if (cleanedNum) {
    return `${cleanedNum} ${unit}`;
  }

  return `${strVal} ${unit}`;
}

/**
 * Formats full label + value for Service Area e.g.
 * Arabic: "منطقة الخدمة: 100 كم"
 * English: "Service Area: 100 km"
 */
export function formatServiceAreaLabel(
  distance: string | number | null | undefined,
  language: string = "en",
  labelPrefix?: string
): string {
  const formattedDist = formatServiceDistance(distance, language, "");
  if (!formattedDist) return "";

  const defaultPrefix =
    language === "ar" ? "منطقة الخدمة" : "Service Area";
  const prefix = labelPrefix || defaultPrefix;

  return `${prefix}: ${formattedDist}`;
}

const targetCustomerMap: Record<string, { en: string; ar: string }> = {
  "large organizations": { en: "Large Organizations", ar: "المنظمات الكبيرة" },
  "small businesses": { en: "Small Businesses", ar: "الشركات الصغيرة" },
  "smes": { en: "Small Businesses", ar: "الشركات الصغيرة" },
  "individuals": { en: "Individuals", ar: "الأفراد" },
  "government agencies": { en: "Government Agencies", ar: "الجهات الحكومية" },
  "wholesale buyers": { en: "Wholesale Buyers", ar: "تجار الجملة" },
};

/**
 * Translates Target Customer label based on current language
 */
export function formatTargetCustomer(customer: string, language: string = "en"): string {
  if (!customer) return "";
  const key = customer.toLowerCase().trim();
  if (targetCustomerMap[key]) {
    return language === "ar" ? targetCustomerMap[key].ar : targetCustomerMap[key].en;
  }
  return customer;
}

const offeredServicesMap: Record<string, { en: string; ar: string }> = {
  "wholesale": { en: "Wholesale", ar: "جملة" },
  "retail": { en: "Retail", ar: "تجزئة" },
  "repair services": { en: "Repair Services", ar: "خدمات الإصلاح" },
  "custom orders": { en: "Custom Orders", ar: "طلبات خاصة" },
  "bulk orders": { en: "Bulk Orders", ar: "طلبات بالجملة" },
  "emergency service": { en: "Emergency Service", ar: "خدمة الطوارئ" },
  "installation": { en: "Installation", ar: "التركيب والصيانة" },
  "maintenance": { en: "Maintenance", ar: "الصيانة" },
  "delivery": { en: "Delivery", ar: "التوصيل" },
  "consulting": { en: "Consulting", ar: "الاستشارات" },
};

/**
 * Translates Offered Services label (e.g. Wholesale -> جملة) based on current language
 */
export function formatOfferedService(service: string, language: string = "en"): string {
  if (!service) return "";
  const key = service.toLowerCase().trim();
  if (offeredServicesMap[key]) {
    return language === "ar" ? offeredServicesMap[key].ar : offeredServicesMap[key].en;
  }
  return service;
}

const dayNamesMap: Record<string, { en: string; ar: string }> = {
  monday: { en: "Monday", ar: "الإثنين" },
  tuesday: { en: "Tuesday", ar: "الثلاثاء" },
  wednesday: { en: "Wednesday", ar: "الأربعاء" },
  thursday: { en: "Thursday", ar: "الخميس" },
  friday: { en: "Friday", ar: "الجمعة" },
  saturday: { en: "Saturday", ar: "السبت" },
  sunday: { en: "Sunday", ar: "الأحد" },
};

/**
 * Translates Day Name (e.g. Monday -> الإثنين) based on current language
 */
export function formatDayName(day: string, language: string = "en"): string {
  if (!day) return "";
  const key = day.toLowerCase().trim();
  if (dayNamesMap[key]) {
    return language === "ar" ? dayNamesMap[key].ar : dayNamesMap[key].en;
  }
  return day;
}

/**
 * Converts a 24-hour time string (e.g. "09:00", "17:00", "17:00:00")
 * or time range to 12-hour format with AM/PM (en) or ص/م (ar).
 */
export function formatTime12h(
  timeStr: string | undefined | null,
  language: string = "en"
): string {
  if (!timeStr) return "";

  const formatSingleTime = (singleTime: string): string => {
    const trimmed = singleTime.trim();
    if (!trimmed) return "";

    // If it already has AM/PM or ص/م, return as is
    if (/[a-zA-Zصم]/.test(trimmed)) {
      return trimmed;
    }

    const match = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
    if (!match) return trimmed;

    let hours = parseInt(match[1], 10);
    const minutes = match[2];

    const isPM = hours >= 12;
    if (hours === 0) {
      hours = 12;
    } else if (hours > 12) {
      hours -= 12;
    }

    const padHours = hours.toString().padStart(2, "0");
    const period = language === "ar" ? (isPM ? "م" : "ص") : (isPM ? "PM" : "AM");

    return `${padHours}:${minutes} ${period}`;
  };

  if (timeStr.includes("-")) {
    const [start, end] = timeStr.split("-");
    return `${formatSingleTime(start)} - ${formatSingleTime(end)}`;
  }

  return formatSingleTime(timeStr);
}

const activityTextMap: Record<string, { en: string; ar: string }> = {
  "profile updated": { en: "Profile updated", ar: "تم تحديث الملف الشخصي" },
  "business information updated recently": { en: "Business information updated recently", ar: "تم تحديث معلومات النشاط التجاري مؤخراً" },
  "new inquiry": { en: "New inquiry", ar: "استفسار جديد" },
  "received a new business inquiry": { en: "Received a new business inquiry", ar: "تم استلام استفسار تجاري جديد" },
  "new review": { en: "New review", ar: "مراجعة جديدة" },
  "received a new customer review": { en: "Received a new customer review", ar: "تم استلام مراجعة جديدة من عميل" },
  "product added": { en: "Product added", ar: "تمت إضافة منتج" },
  "hours updated": { en: "Hours updated", ar: "تم تحديث ساعات العمل" },
};

/**
 * Translates recent activity titles/messages to Arabic when language is 'ar'
 */
export function formatActivityText(text: string, language: string = "en"): string {
  if (!text) return "";
  const key = text.toLowerCase().trim();
  if (activityTextMap[key]) {
    return language === "ar" ? activityTextMap[key].ar : activityTextMap[key].en;
  }
  return text;
}

/**
 * Translates relative time strings e.g. "6 seconds ago" -> "منذ ٦ ثوانٍ" or "منذ 6 ثوانٍ"
 */
export function formatRelativeTime(timeStr: string, language: string = "en"): string {
  if (!timeStr) return "";
  if (language !== "ar") return timeStr;

  const trimmed = timeStr.trim();

  // Match pattern e.g. "6 seconds ago" or "seconds ago 6"
  const secMatch = trimmed.match(/(\d+)\s*seconds?\s*ago/i) || trimmed.match(/seconds?\s*ago\s*(\d+)/i);
  if (secMatch) return `منذ ${secMatch[1]} ثوانٍ`;

  const minMatch = trimmed.match(/(\d+)\s*minutes?\s*ago/i) || trimmed.match(/minutes?\s*ago\s*(\d+)/i);
  if (minMatch) return `منذ ${minMatch[1]} دقائق`;

  const hrMatch = trimmed.match(/(\d+)\s*hours?\s*ago/i) || trimmed.match(/hours?\s*ago\s*(\d+)/i);
  if (hrMatch) return `منذ ${hrMatch[1]} ساعات`;

  const dayMatch = trimmed.match(/(\d+)\s*days?\s*ago/i) || trimmed.match(/days?\s*ago\s*(\d+)/i);
  if (dayMatch) return `منذ ${dayMatch[1]} أيام`;

  return trimmed;
}

const recommendationMap: Record<string, { en: string; ar: string }> = {
  "complete your profile to reach 100% - add missing business details": {
    en: "Complete your profile to reach 100% - add missing business details",
    ar: "أكمل ملفك الشخصي ليصل إلى 100% - أضف تفاصيل النشاط التجارية المفقودة",
  },
  "make your profile more attractive to get customer inquiries": {
    en: "Make your profile more attractive to get customer inquiries",
    ar: "اجعل ملفك الشخصي أكثر جاذبية للحصول على استفسارات العملاء",
  },
  "improve your service quality to get better customer ratings": {
    en: "Improve your service quality to get better customer ratings",
    ar: "حسّن جودة خدماتك للحصول على تقييمات أفضل من العملاء",
  },
  "add relevant keywords to appear in more search results": {
    en: "Add relevant keywords to appear in more search results",
    ar: "أضف الكلمات المفتاحية المناسبة للظهور في المزيد من نتائج البحث",
  },
  "upload more photos and detailed descriptions to attract more visitors": {
    en: "Upload more photos and detailed descriptions to attract more visitors",
    ar: "ارفع المزيد من الصور والشروحات التفصيلية لجذب المزيد من الزوار",
  },
};

/**
 * Translates analytics recommendation text to Arabic when language is 'ar'
 */
export function formatRecommendationText(item: string, language: string = "en"): string {
  if (!item) return "";
  const key = item.toLowerCase().trim();
  if (recommendationMap[key]) {
    return language === "ar" ? recommendationMap[key].ar : recommendationMap[key].en;
  }
  if (language === "ar") {
    let text = item;
    if (text.includes("Complete your profile")) text = text.replace("Complete your profile", "أكمل ملفك الشخصي");
    if (text.includes("add missing business details")) text = text.replace("add missing business details", "أضف التفاصيل المفقودة");
    if (text.includes("Make your profile more attractive")) text = text.replace("Make your profile more attractive", "اجعل ملفك الشخصي أكثر جاذبية");
    if (text.includes("get customer inquiries")) text = text.replace("get customer inquiries", "للحصول على استفسارات العملاء");
    if (text.includes("Improve your service quality")) text = text.replace("Improve your service quality", "حسّن جودة خدماتك");
    if (text.includes("get better customer ratings")) text = text.replace("get better customer ratings", "للحصول على تقييمات أفضل");
    if (text.includes("Add relevant keywords")) text = text.replace("Add relevant keywords", "أضف كلمات مفتاحية مناسبة");
    if (text.includes("appear in more search results")) text = text.replace("appear in more search results", "للظهور في نتائج البحث");
    if (text.includes("Upload more photos")) text = text.replace("Upload more photos", "ارفع المزيد من الصور");
    if (text.includes("attract more visitors")) text = text.replace("attract more visitors", "لجذب المزيد من الزوار");
    return text;
  }
  return item;
}

/**
 * Formats response time strings e.g. "0 seconds", "5 seconds", "10 minutes", "1 hour", "0h"
 * into Arabic when language is 'ar'
 */
export function formatResponseTime(
  timeStr: string | undefined | null,
  language: string = "en"
): string {
  if (!timeStr) return language === "ar" ? "0 ثانية" : "0s";
  const str = String(timeStr).trim();
  if (!str) return language === "ar" ? "0 ثانية" : "0s";

  if (language !== "ar") return str;

  // Handles strings like "0 seconds", "5 seconds", "seconds 0"
  const secMatch = str.match(/(\d+)\s*seconds?/i) || str.match(/seconds?\s*(\d+)/i);
  if (secMatch) {
    const num = parseInt(secMatch[1], 10);
    if (num === 0) return "0 ثانية";
    if (num === 1) return "ثانية واحدة";
    if (num === 2) return "ثانيتان";
    if (num >= 3 && num <= 10) return `${num} ثوانٍ`;
    return `${num} ثانية`;
  }

  const minMatch = str.match(/(\d+)\s*minutes?/i) || str.match(/minutes?\s*(\d+)/i);
  if (minMatch) {
    const num = parseInt(minMatch[1], 10);
    if (num === 0) return "0 دقيقة";
    if (num === 1) return "دقيقة واحدة";
    if (num === 2) return "دقيقتان";
    if (num >= 3 && num <= 10) return `${num} دقائق`;
    return `${num} دقيقة`;
  }

  const hrMatch = str.match(/(\d+)\s*(?:hours?|h)/i) || str.match(/(?:hours?|h)\s*(\d+)/i);
  if (hrMatch) {
    const num = parseInt(hrMatch[1], 10);
    if (num === 0) return "0 ساعة";
    if (num === 1) return "ساعة واحدة";
    if (num === 2) return "ساعتان";
    if (num >= 3 && num <= 10) return `${num} ساعات`;
    return `${num} ساعة`;
  }

  const dayMatch = str.match(/(\d+)\s*days?/i) || str.match(/days?\s*(\d+)/i);
  if (dayMatch) {
    const num = parseInt(dayMatch[1], 10);
    if (num === 0) return "0 يوم";
    if (num === 1) return "يوم واحد";
    if (num === 2) return "يومان";
    if (num >= 3 && num <= 10) return `${num} أيام`;
    return `${num} يوم`;
  }

  if (str === "0h" || str === "0s") return "0 ثانية";

  return str;
}

const cityTranslationsMap: Record<string, { en: string; ar: string }> = {
  riyadh: { en: "Riyadh", ar: "الرياض" },
  jeddah: { en: "Jeddah", ar: "جدة" },
  mecca: { en: "Mecca", ar: "مكة المكرمة" },
  makkah: { en: "Makkah", ar: "مكة المكرمة" },
  medina: { en: "Medina", ar: "المدينة المنورة" },
  madinah: { en: "Madinah", ar: "المدينة المنورة" },
  dammam: { en: "Dammam", ar: "الدمام" },
  khobar: { en: "Al Khobar", ar: "الخبر" },
  "al khobar": { en: "Al Khobar", ar: "الخبر" },
  dhahran: { en: "Dhahran", ar: "الظهران" },
  tabuk: { en: "Tabuk", ar: "تبوك" },
  abha: { en: "Abha", ar: "أبها" },
  buraidah: { en: "Buraidah", ar: "بريدة" },
  "khamis mushait": { en: "Khamis Mushait", ar: "خميس مشيط" },
  hail: { en: "Hail", ar: "حائل" },
  najran: { en: "Najran", ar: "نجران" },
  jazan: { en: "Jazan", ar: "جازان" },
  taif: { en: "Taif", ar: "الطائف" },
  jubail: { en: "Al Jubail", ar: "الجبيل" },
  "al jubail": { en: "Al Jubail", ar: "الجبيل" },
  ahsa: { en: "Al Ahsa", ar: "الأحساء" },
  "al ahsa": { en: "Al Ahsa", ar: "الأحساء" },
  hofuf: { en: "Hofuf", ar: "الهفوف" },
  kharj: { en: "Al Kharj", ar: "الخرج" },
  "al kharj": { en: "Al Kharj", ar: "الخرج" },
  qassim: { en: "Al Qassim", ar: "القصيم" },
  "al qassim": { en: "Al Qassim", ar: "القصيم" },
  yanbu: { en: "Yanbu", ar: "ينبع" },
};

/**
 * Translates city names to Arabic when language is 'ar'
 */
export function formatCityName(
  cityName: string | undefined | null,
  language: string = "en"
): string {
  if (!cityName) return "";
  const trimmed = cityName.trim();
  if (!trimmed) return "";

  const key = trimmed.toLowerCase();
  if (cityTranslationsMap[key]) {
    return language === "ar" ? cityTranslationsMap[key].ar : cityTranslationsMap[key].en;
  }

  // If already contains Arabic characters and language is ar, return as is
  if (language === "ar" && /[\u0600-\u06FF]/.test(trimmed)) {
    return trimmed;
  }

  return trimmed;
}
