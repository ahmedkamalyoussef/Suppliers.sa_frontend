"use client";

import React from "react";

export type BidiType =
  | "phone"
  | "email"
  | "url"
  | "code"
  | "id"
  | "number"
  | "countryCode"
  | "text";

export interface BidiTextProps extends React.HTMLAttributes<HTMLElement> {
  value?: string | number | null;
  children?: React.ReactNode;
  dir?: "ltr" | "rtl" | "auto";
  type?: BidiType;
  countryCode?: string;
  as?: React.ElementType;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
}

/**
 * Format phone number string ensuring country code (+966) stays attached LTR.
 */
export function formatPhoneNumber(
  phone?: string | number | null,
  countryCode: string = "+966"
): string {
  if (!phone) return "";
  let str = String(phone).trim();
  if (!str) return "";

  // If already starts with '+', keep as is
  if (str.startsWith("+")) {
    return str;
  }

  // Handle Saudi local formats starting with '05' or '5'
  if (countryCode === "+966") {
    if (str.startsWith("05")) {
      return `${countryCode} ${str.substring(1)}`;
    } else if (str.length === 9 && str.startsWith("5")) {
      return `${countryCode} ${str}`;
    } else if (str.startsWith("966")) {
      return `+${str}`;
    }
  }

  // Fallback default attachment if numeric and doesn't have country code prefix
  if (/^\d+$/.test(str.replace(/\s+/g, ""))) {
    return `${countryCode} ${str}`;
  }

  return str;
}

/**
 * BidiText component isolates bidirectional text (phones, country codes, emails,
 * URLs, OTP codes, order numbers, invoice numbers, IDs) ensuring natural LTR ordering.
 */
export const BidiText: React.FC<BidiTextProps> = ({
  value,
  children,
  dir = "ltr",
  type = "text",
  countryCode = "+966",
  as: Component = "bdi",
  className = "",
  style,
  ...props
}) => {
  let content = children ?? value ?? "";

  if (type === "phone" && typeof content === "string") {
    content = formatPhoneNumber(content, countryCode);
  }

  const combinedStyle: React.CSSProperties = {
    direction: dir === "auto" ? undefined : dir,
    unicodeBidi: "isolate",
    ...(style || {}),
  };

  return (
    <Component
      dir={dir === "rtl" ? "rtl" : dir === "auto" ? "auto" : "ltr"}
      className={`bidi-isolate ${dir === "ltr" ? "bidi-ltr" : "bidi-rtl"} ${className}`}
      style={combinedStyle}
      {...props}
    >
      {content}
    </Component>
  );
};

/**
 * LtrValue forces Left-to-Right directional isolation on any value.
 */
export const LtrValue: React.FC<BidiTextProps> = (props) => (
  <BidiText dir="ltr" {...props} />
);

/**
 * PhoneNumber component specifically for phone numbers & country codes.
 */
export const PhoneNumber: React.FC<
  BidiTextProps & { phone?: string | number }
> = ({ phone, value, countryCode = "+966", ...props }) => (
  <BidiText
    dir="ltr"
    type="phone"
    countryCode={countryCode}
    value={phone ?? value}
    {...props}
  />
);

/**
 * EmailText component specifically for email addresses.
 */
export const EmailText: React.FC<BidiTextProps> = (props) => (
  <BidiText dir="ltr" type="email" {...props} />
);

/**
 * UrlText component specifically for web URLs.
 */
export const UrlText: React.FC<BidiTextProps> = (props) => (
  <BidiText dir="ltr" type="url" {...props} />
);

/**
 * CodeText component for OTP codes, order IDs, invoice numbers, CR/Tax numbers, tracking IDs.
 */
export const CodeText: React.FC<BidiTextProps> = (props) => (
  <BidiText dir="ltr" type="code" {...props} />
);

export default BidiText;
