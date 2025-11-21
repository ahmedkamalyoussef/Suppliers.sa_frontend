"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "./translations";

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
      console.log(
        "LanguageContext: Saved language from localStorage:",
        savedLanguage
      );

      if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ar")) {
        setLanguage(savedLanguage);
        console.log("LanguageContext: Setting language to:", savedLanguage);
      } else {
        console.log("LanguageContext: No saved language, using default: en");
      }
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      console.log(
        "LanguageContext: Saving language to localStorage:",
        language
      );
      localStorage.setItem("language", language);
      document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = language;
    }
  }, [language, mounted]);

  const t = (key: string): string => {
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

export function useLanguage(_unused?: string) {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
