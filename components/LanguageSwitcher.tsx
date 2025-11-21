"use client";

import { useLanguage } from "@/lib/LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
      <button
        onClick={() => setLanguage("en")}
        className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium transition-all ${
          language === "en"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        <span>EN</span>
      </button>
      <button
        onClick={() => setLanguage("ar")}
        className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium transition-all ${
          language === "ar"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        <span>AR</span>
      </button>
    </div>
  );
}
