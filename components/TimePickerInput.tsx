"use client";

import React, { useMemo } from "react";
import { useLanguage } from "../lib/LanguageContext";

export interface TimePickerInputProps {
  value: string; // "HH:mm" 24-hour format
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
}

export default function TimePickerInput({
  value = "09:00",
  onChange,
  label,
  disabled = false,
}: TimePickerInputProps) {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  // Parse 24-hour string into 12-hour format components
  const { hour12, minute, period } = useMemo(() => {
    if (!value || !value.includes(":")) {
      return { hour12: 9, minute: "00", period: "AM" as const };
    }
    const [hStr, mStr] = value.split(":");
    let h = parseInt(hStr, 10);
    if (isNaN(h)) h = 9;
    const m = mStr ? mStr.substring(0, 2) : "00";

    const periodVal = h >= 12 ? ("PM" as const) : ("AM" as const);
    let h12 = h % 12;
    if (h12 === 0) h12 = 12;

    return { hour12: h12, minute: m, period: periodVal };
  }, [value]);

  // Convert 12-hour components back to 24-hour HH:mm
  const emitChange = (h12: number, min: string, p: "AM" | "PM") => {
    let h24 = h12 % 12;
    if (p === "PM") h24 += 12;
    const h24Str = h24.toString().padStart(2, "0");
    onChange(`${h24Str}:${min}`);
  };

  const hoursList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const minutesList = ["00", "15", "30", "45"];

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <span className="text-xs font-semibold text-gray-700 ltr:text-left rtl:text-right">
          {label}
        </span>
      )}
      <div
        className={`flex items-center gap-1 bg-white border border-gray-200 hover:border-amber-400 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-100 rounded-xl p-1 shadow-sm transition-all bidi-ltr ${
          disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : ""
        }`}
        dir="ltr"
        style={{ direction: "ltr", unicodeBidi: "isolate" }}
      >
        {/* Hour Dropdown (Always Left) */}
        <select
          value={hour12}
          disabled={disabled}
          onChange={(e) =>
            emitChange(parseInt(e.target.value, 10), minute, period)
          }
          className="bg-transparent text-xs font-bold text-gray-800 py-1 px-1.5 outline-none cursor-pointer rounded-lg hover:bg-gray-100/80 transition-colors bidi-ltr"
          dir="ltr"
          style={{ direction: "ltr", unicodeBidi: "isolate" }}
        >
          {hoursList.map((h) => (
            <option key={h} value={h}>
              {h.toString().padStart(2, "0")}
            </option>
          ))}
        </select>

        <span
          className="text-gray-400 font-bold text-xs select-none bidi-isolate"
          dir="ltr"
          style={{ direction: "ltr", unicodeBidi: "isolate" }}
        >
          :
        </span>

        {/* Minute Dropdown (Always Middle Right) */}
        <select
          value={minute}
          disabled={disabled}
          onChange={(e) => emitChange(hour12, e.target.value, period)}
          className="bg-transparent text-xs font-bold text-gray-800 py-1 px-1.5 outline-none cursor-pointer rounded-lg hover:bg-gray-100/80 transition-colors bidi-ltr"
          dir="ltr"
          style={{ direction: "ltr", unicodeBidi: "isolate" }}
        >
          {minutesList.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        {/* AM / PM Toggle Pills (Always Far Right) */}
        <div
          className="flex items-center bg-gray-100 rounded-lg p-0.5 ms-1 bidi-ltr"
          dir="ltr"
          style={{ direction: "ltr", unicodeBidi: "isolate" }}
        >
          <button
            type="button"
            disabled={disabled}
            onClick={() => emitChange(hour12, minute, "AM")}
            className={`px-2 py-0.5 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
              period === "AM"
                ? "bg-amber-400 text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {isArabic ? "ص" : "AM"}
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => emitChange(hour12, minute, "PM")}
            className={`px-2 py-0.5 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
              period === "PM"
                ? "bg-amber-400 text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {isArabic ? "م" : "PM"}
          </button>
        </div>
      </div>
    </div>
  );
}
