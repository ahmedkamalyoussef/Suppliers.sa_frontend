/**
 * Phone number normalization, parsing, and formatting utilities.
 */

// List of supported country codes for prefix detection
export const SUPPORTED_COUNTRY_CODES = [
  "+966",
  "+971",
  "+965",
  "+973",
  "+968",
  "+974",
  "+20",
  "+1",
  "+44",
];

/**
 * Extract national phone number by stripping country code prefix and local leading zeros.
 *
 * Examples:
 * - "+966501234567" -> "501234567"
 * - "966501234567" -> "501234567"
 * - "00966501234567" -> "501234567"
 * - "+966 50 123 4567" -> "501234567"
 * - "0501234567" -> "501234567"
 * - "501234567" -> "501234567"
 */
export function extractNationalPhoneNumber(
  phone?: string | number | null,
  countryCode: string = "+966"
): string {
  if (phone === null || phone === undefined) return "";
  let str = String(phone).trim();
  if (!str) return "";

  // Remove whitespace and formatting characters except leading plus
  const hasPlus = str.startsWith("+");
  str = str.replace(/[^\d+]/g, "");

  const codeDigits = countryCode.replace(/\D/g, ""); // e.g. "966"

  if (hasPlus) {
    const digitsOnly = str.substring(1);
    if (digitsOnly.startsWith(codeDigits)) {
      str = digitsOnly.substring(codeDigits.length);
    } else {
      // Check against supported country codes
      for (const code of SUPPORTED_COUNTRY_CODES) {
        const cd = code.replace(/\D/g, "");
        if (digitsOnly.startsWith(cd)) {
          str = digitsOnly.substring(cd.length);
          break;
        }
      }
    }
  } else {
    // Check for 00966... or 966...
    if (str.startsWith(`00${codeDigits}`)) {
      str = str.substring(2 + codeDigits.length);
    } else if (
      str.startsWith(codeDigits) &&
      str.length >= codeDigits.length + 8
    ) {
      str = str.substring(codeDigits.length);
    }
  }

  // Strip local leading zeros (e.g. 0501234567 -> 501234567)
  if (str.startsWith("0")) {
    str = str.replace(/^0+/, "");
  }

  return str;
}

/**
 * Format full E.164 phone number from national number and country code.
 *
 * Examples:
 * - "501234567", "+966" -> "+966501234567"
 * - "+966501234567", "+966" -> "+966501234567"
 */
export function formatE164PhoneNumber(
  phone?: string | number | null,
  countryCode: string = "+966"
): string {
  if (phone === null || phone === undefined) return "";
  const national = extractNationalPhoneNumber(phone, countryCode);
  if (!national) return "";

  const cleanCode = countryCode.startsWith("+")
    ? countryCode
    : `+${countryCode}`;
  return `${cleanCode}${national}`;
}

/**
 * Detect country code from full international phone number string if present.
 */
export function detectCountryCode(
  phone?: string | number | null,
  defaultCode: string = "+966"
): string {
  if (!phone) return defaultCode;
  const str = String(phone).trim();
  if (str.startsWith("+")) {
    const digits = str.substring(1);
    for (const code of SUPPORTED_COUNTRY_CODES) {
      const codeDigits = code.replace(/\D/g, "");
      if (digits.startsWith(codeDigits)) {
        return code;
      }
    }
  }
  return defaultCode;
}
