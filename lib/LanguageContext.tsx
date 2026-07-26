"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "./translations";

// Define message translations
const SESSION_TIMEOUT_MSGS = {
  en: "Session timed out.",
  ar: "انتهت مهلة الجلسة.",
};

type Language = "en" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translations: typeof translations;
  isRTL: boolean;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key: string) => key,
  translations: translations,
  isRTL: false,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("language") as Language;

      if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ar")) {
        setLanguage(savedLanguage);
      } else {
        setLanguage("en");
      }
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      localStorage.setItem("language", language);
      document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = language;
    }
  }, [language, mounted]);

  const t = (key: string): string => {
    if (!key) return "";

    // Prevent displaying raw keys containing .undefined or .null
    if (key.endsWith(".undefined") || key.endsWith(".null") || key.endsWith(".unspecified")) {
      if (key.includes("businessTypes")) {
        return language === "ar" ? "مورد" : "Supplier";
      }
      const unspecifiedKey = key.replace(/\.(undefined|null|unspecified)$/, ".supplier");
      const unspecifiedVal = t(unspecifiedKey);
      if (unspecifiedVal && unspecifiedVal !== unspecifiedKey) {
        return unspecifiedVal;
      }
      return language === "ar" ? "مورد" : "Supplier";
    }

    // Special handling for session timeout messages
    if (key === "auth.session_timeout") {
      return SESSION_TIMEOUT_MSGS[language];
    }

    const keys = key.split(".");
    let value: any = translations[language];

    for (const k of keys) {
      value = value?.[k];
    }

    if (value === undefined || value === null) return key;
    if (typeof value === "object") {
      const candidate = value.title ?? value.text ?? value.value;
      return candidate !== undefined && candidate !== null
        ? String(candidate)
        : key;
    }
    return String(value);
  };

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
  };

  const isRTL = language === "ar";

  if (!mounted) {
    return <div className="min-h-screen bg-white"></div>;
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: changeLanguage,
        t,
        translations,
        isRTL,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(prefix?: string) {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  if (prefix) {
    return {
      ...context,
      t: (key: string) => {
        const prefixedKey = `${prefix}.${key}`;
        const prefixedTranslation = context.t(prefixedKey);
        if (prefixedTranslation !== prefixedKey) {
          return prefixedTranslation;
        }
        return context.t(key);
      },
    };
  }
  return context;
}
