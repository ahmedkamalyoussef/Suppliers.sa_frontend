"use client";

import React from "react";
import { useLanguage } from "../lib/LanguageContext";
import TimePickerInput from "./TimePickerInput";

export interface WorkingHourDay {
  closed: boolean;
  open: string;
  close: string;
}

export interface BusinessHoursConfigProps {
  workingHours: Record<string, WorkingHourDay>;
  onChange: (newHours: Record<string, WorkingHourDay>) => void;
  error?: string;
}

const DAY_NAMES: Record<string, { ar: string; en: string }> = {
  monday: { ar: "الإثنين", en: "Monday" },
  tuesday: { ar: "الثلاثاء", en: "Tuesday" },
  wednesday: { ar: "الأربعاء", en: "Wednesday" },
  thursday: { ar: "الخميس", en: "Thursday" },
  friday: { ar: "الجمعة", en: "Friday" },
  saturday: { ar: "السبت", en: "Saturday" },
  sunday: { ar: "الأحد", en: "Sunday" },
};

export default function BusinessHoursConfig({
  workingHours,
  onChange,
  error,
}: BusinessHoursConfigProps) {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  const dayKeys = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  // Helper to update a specific day field
  const updateDay = (dayKey: string, field: keyof WorkingHourDay, val: any) => {
    const current = workingHours[dayKey] || { closed: false, open: "09:00", close: "17:00" };
    const updatedDay = { ...current, [field]: val };
    onChange({
      ...workingHours,
      [dayKey]: updatedDay,
    });
  };

  // Quick Action: Copy Monday to all days
  const copyMondayToAll = () => {
    const mondayVal = workingHours.monday || { closed: false, open: "09:00", close: "17:00" };
    const next: Record<string, WorkingHourDay> = {};
    dayKeys.forEach((k) => {
      next[k] = { ...mondayVal };
    });
    onChange(next);
  };

  // Quick Action: Set all open days to 24 Hours
  const setAll24Hours = () => {
    const next: Record<string, WorkingHourDay> = {};
    dayKeys.forEach((k) => {
      next[k] = { closed: false, open: "00:00", close: "23:59" };
    });
    onChange(next);
  };

  // Quick Action: Close weekend (Friday & Saturday)
  const closeWeekend = () => {
    const next = { ...workingHours };
    if (next.friday) next.friday = { ...next.friday, closed: true };
    if (next.saturday) next.saturday = { ...next.saturday, closed: true };
    onChange(next);
  };

  return (
    <div className="space-y-4">
      {/* Productivity Toolbar */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
          <i className="ri-flashlight-line text-amber-600 text-sm"></i>
          <span>{isArabic ? "إجراءات سريعة للتسهيل:" : "Quick Actions:"}</span>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-1.5">
          <button
            type="button"
            onClick={copyMondayToAll}
            className="px-2.5 py-1.5 rounded-xl bg-white text-amber-900 border border-amber-300/80 hover:bg-amber-100 text-xs font-semibold transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1"
          >
            <i className="ri-file-copy-line text-amber-600"></i>
            <span>{isArabic ? "نسخ مواعيد الاثنين للكل" : "Copy Monday to All"}</span>
          </button>

          <button
            type="button"
            onClick={setAll24Hours}
            className="px-2.5 py-1.5 rounded-xl bg-white text-amber-900 border border-amber-300/80 hover:bg-amber-100 text-xs font-semibold transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1"
          >
            <i className="ri-time-line text-amber-600"></i>
            <span>{isArabic ? "مفتوح 24/7" : "Open 24/7"}</span>
          </button>

          <button
            type="button"
            onClick={closeWeekend}
            className="px-2.5 py-1.5 rounded-xl bg-white text-amber-900 border border-amber-300/80 hover:bg-amber-100 text-xs font-semibold transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1"
          >
            <i className="ri-calendar-close-line text-amber-600"></i>
            <span>{isArabic ? "إغلاق الجمعة والسبت" : "Close Fri/Sat"}</span>
          </button>
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-xs font-semibold flex items-center gap-1">
          <i className="ri-error-warning-line"></i>
          <span>{error}</span>
        </p>
      )}

      {/* Daily Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {dayKeys.map((dayKey) => {
          const dayData = workingHours[dayKey] || {
            closed: false,
            open: "09:00",
            close: "17:00",
          };
          const isClosed = dayData.closed;
          const dayName =
            DAY_NAMES[dayKey]?.[isArabic ? "ar" : "en"] || dayKey;

          return (
            <div
              key={dayKey}
              className={`p-3.5 rounded-2xl border transition-all shadow-sm ${
                isClosed
                  ? "bg-gray-50/90 border-gray-200 opacity-80"
                  : "bg-white border-blue-100 hover:border-amber-300 hover:shadow-md"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isClosed
                        ? "bg-gray-200 text-gray-600"
                        : "bg-amber-100 text-amber-900"
                    }`}
                  >
                    <i className={isClosed ? "ri-moon-line" : "ri-sun-line"}></i>
                  </div>
                  <span className="font-bold text-gray-900 text-sm">
                    {dayName}
                  </span>
                </div>

                {/* Open/Closed Switch Button */}
                <button
                  type="button"
                  onClick={() => updateDay(dayKey, "closed", !isClosed)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isClosed
                      ? "bg-red-100 text-red-700 border border-red-200 hover:bg-red-200"
                      : "bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-200"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isClosed ? "bg-red-500" : "bg-emerald-500 animate-pulse"
                    }`}
                  ></span>
                  <span>
                    {isClosed
                      ? isArabic
                        ? "مغلق"
                        : "Closed"
                      : isArabic
                      ? "مفتوح"
                      : "Open"}
                  </span>
                </button>
              </div>

              {/* Time Pickers (Visible only when day is OPEN) */}
              {!isClosed ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-2 border-t border-gray-100">
                  <TimePickerInput
                    label={isArabic ? "وقت الفتح" : "Opens at"}
                    value={dayData.open || "09:00"}
                    onChange={(newVal) => updateDay(dayKey, "open", newVal)}
                  />
                  <TimePickerInput
                    label={isArabic ? "وقت الإغلاق" : "Closes at"}
                    value={dayData.close || "17:00"}
                    onChange={(newVal) => updateDay(dayKey, "close", newVal)}
                  />
                </div>
              ) : (
                <div className="pt-2 text-center text-xs text-gray-400 font-medium italic border-t border-gray-100">
                  {isArabic ? "عطلة / مغلق طوال اليوم" : "Closed all day"}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
