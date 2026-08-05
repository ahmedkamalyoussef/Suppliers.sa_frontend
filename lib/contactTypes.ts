/**
 * Centralized configuration for Additional Phone Number Contact Types.
 * Enables single-source-of-truth management for internal values, English labels, and Arabic labels.
 */

export interface ContactTypeConfig {
  value: string;
  key: string;
  en: string;
  ar: string;
}

export const CONTACT_TYPES: ContactTypeConfig[] = [
  {
    value: "Company Manager",
    key: "companyManager",
    en: "Company Manager",
    ar: "مسؤول الشركة",
  },
  {
    value: "Sales Representative",
    key: "sales",
    en: "Sales Representative",
    ar: "مبيعات",
  },
  {
    value: "Procurement",
    key: "procurement",
    en: "Procurement",
    ar: "مشتريات",
  },
  {
    value: "Technical Support",
    key: "technical",
    en: "Technical Support",
    ar: "دعم فني",
  },
  {
    value: "Customer Service",
    key: "customer",
    en: "Customer Service",
    ar: "خدمة العملاء",
  },
  {
    value: "General Inquiry",
    key: "general",
    en: "General Inquiry",
    ar: "استفسارات عامة",
  },
];

/**
 * Normalizes contact type strings for legacy data matching.
 */
function normalizeTypeString(str: string): string {
  return str.toLowerCase().trim().replace(/[\s_-]+/g, "");
}

/**
 * Get localized display label for a given contact type value.
 * Handles exact matches, legacy keys, and fallback values.
 */
export function getContactTypeLabel(
  typeValue?: string | null,
  language: string = "ar"
): string {
  if (!typeValue) return "";

  const norm = normalizeTypeString(typeValue);
  const found = CONTACT_TYPES.find(
    (t) =>
      normalizeTypeString(t.value) === norm ||
      normalizeTypeString(t.en) === norm ||
      normalizeTypeString(t.ar) === norm ||
      normalizeTypeString(t.key) === norm
  );

  if (found) {
    return language === "ar" ? found.ar : found.en;
  }

  // Handle legacy variants
  if (norm === "sales") return language === "ar" ? "مبيعات" : "Sales";
  if (norm === "manager" || norm === "management")
    return language === "ar" ? "الإدارة" : "Management";

  return typeValue;
}
