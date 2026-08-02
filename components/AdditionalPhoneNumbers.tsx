"use client";

import React from "react";
import { useLanguage } from "../lib/LanguageContext";
import PhoneInput from "./PhoneInput";
import { AdditionalPhone } from "../lib/types";

export interface AdditionalPhoneNumbersProps {
  phones: AdditionalPhone[];
  onChange: (phones: AdditionalPhone[]) => void;
  isEditing?: boolean;
  maxCount?: number;
}

const PHONE_TYPES = [
  { value: "Sales Representative", ar: "مبيعات", en: "Sales Representative" },
  { value: "Procurement", ar: "مشتريات", en: "Procurement" },
  { value: "Technical Support", ar: "دعم فني", en: "Technical Support" },
  { value: "Customer Service", ar: "خدمة العملاء", en: "Customer Service" },
  { value: "General Inquiry", ar: "استفسارات عامة", en: "General Inquiry" },
];

export default function AdditionalPhoneNumbers({
  phones = [],
  onChange,
  isEditing = true,
  maxCount = 4,
}: AdditionalPhoneNumbersProps) {
  const { language, isRTL } = useLanguage();
  const isArabic = language === "ar";

  const handleAddPhone = () => {
    if (!isEditing || phones.length >= maxCount) return;
    const newPhone: AdditionalPhone = {
      id: Date.now(),
      type: "Sales Representative",
      number: "",
      name: "",
    };
    onChange([...phones, newPhone]);
  };

  const handleRemovePhone = (id: number | string) => {
    if (!isEditing) return;
    onChange(phones.filter((p) => p.id !== id));
  };

  const handlePhoneChange = (
    id: number | string,
    field: keyof AdditionalPhone,
    val: string
  ) => {
    if (!isEditing) return;
    const updated = phones.map((p) =>
      p.id === id ? { ...p, [field]: val } : p
    );
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <label className="block text-sm font-semibold text-gray-800">
            {isArabic
              ? "أرقام هواتف إضافية (اختياري)"
              : "Additional Contact Numbers (Optional)"}
          </label>
          <p className="text-xs text-gray-500 mt-0.5">
            {isArabic
              ? "أضف أرقام هواتف إضافية لأقسام مختلفة في شركتك (مثل المبيعات، الدعم الفني، إلخ)"
              : "Add additional phone numbers for different departments in your company (e.g. Sales, Support, etc.)"}
          </p>
        </div>

        {isEditing && phones.length < maxCount && (
          <button
            type="button"
            onClick={handleAddPhone}
            className="self-start sm:self-auto text-amber-600 hover:text-amber-700 text-xs font-bold cursor-pointer transition-colors flex items-center gap-1 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200"
          >
            <i className="ri-add-line text-sm"></i>
            <span>{isArabic ? "إضافة رقم" : "Add Number"}</span>
          </button>
        )}
      </div>

      {/* Phones List */}
      {phones.length > 0 ? (
        <div className="space-y-3">
          {phones.map((phone) => (
            <div
              key={phone.id}
              className="grid grid-cols-1 md:grid-cols-3 gap-2.5 p-3 bg-gray-50/80 border border-gray-200 rounded-xl items-center"
            >
              {/* 1. Contact Type Dropdown */}
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">
                  {isArabic ? "نوع الاتصال" : "Contact Type"}
                </label>
                <select
                  value={phone.type}
                  disabled={!isEditing}
                  onChange={(e) =>
                    handlePhoneChange(phone.id, "type", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg text-xs font-medium bg-white focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none ${
                    !isEditing
                      ? "bg-gray-100/70 border-gray-200 opacity-70 cursor-not-allowed"
                      : "border-gray-300"
                  }`}
                >
                  {PHONE_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {isArabic ? t.ar : t.en}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Standard Phone Input */}
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">
                  {isArabic ? "رقم الهاتف" : "Phone Number"}
                </label>
                <PhoneInput
                  value={phone.number}
                  disabled={!isEditing}
                  onChange={(val) => handlePhoneChange(phone.id, "number", val)}
                  placeholder="50 123 4567"
                />
              </div>

              {/* 3. Contact Name & Delete Button */}
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">
                  {isArabic ? "اسم جهة الاتصال" : "Contact Name"}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={phone.name}
                    disabled={!isEditing}
                    onChange={(e) =>
                      handlePhoneChange(phone.id, "name", e.target.value)
                    }
                    placeholder={
                      isArabic ? "مثال: م. أحمد (المبيعات)" : "e.g. Sales Dept"
                    }
                    className={`flex-1 px-3 py-2 border rounded-lg text-xs bg-white outline-none focus:ring-2 focus:ring-amber-400 ${
                      !isEditing
                        ? "bg-gray-100/70 border-gray-200 opacity-70 cursor-not-allowed"
                        : "border-gray-300"
                    }`}
                  />

                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => handleRemovePhone(phone.id)}
                      className="w-8 h-8 flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-100 bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                      title={isArabic ? "حذف الرقم" : "Remove Number"}
                    >
                      <i className="ri-delete-bin-line text-sm"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <i className="ri-phone-line text-gray-400 text-2xl mb-1.5 block"></i>
          <p className="text-gray-500 text-xs font-medium mb-3">
            {isArabic
              ? "لم يتم إضافة أرقام هواتف إضافية بعد"
              : "No additional contact numbers added yet"}
          </p>
          {isEditing && (
            <button
              type="button"
              onClick={handleAddPhone}
              className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold px-4 py-2 rounded-lg text-xs transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
            >
              <i className="ri-add-line"></i>
              <span>{isArabic ? "إضافة رقم جديد" : "Add New Number"}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
