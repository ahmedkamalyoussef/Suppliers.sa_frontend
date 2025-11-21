"use client";

import { useLanguage } from "@/lib/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <h1 className="text-5xl md:text-5xl font-semibold text-gray-100">404</h1>
      <h1 className="text-2xl md:text-3xl font-semibold mt-6">
        {t("notFound.title")}
      </h1>
      <p className="mt-4 text-xl md:text-2xl text-gray-500">
        {t("notFound.message")}
      </p>
    </div>
  );
}
