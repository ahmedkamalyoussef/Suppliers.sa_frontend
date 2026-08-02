"use client";

import React from "react";

export interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  id?: string;
  name?: string;
  label?: string;
  className?: string;
  inputClassName?: string;
  countryCode?: string;
}

export default function PhoneInput({
  value = "",
  onChange,
  placeholder,
  disabled = false,
  error,
  required = false,
  id,
  name,
  label,
  className = "",
  inputClassName = "",
  countryCode = "+966",
}: PhoneInputProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    // Allow digits, spaces, hyphens and plus
    const cleanVal = rawVal.replace(/[^0-9]/g, "");
    onChange(cleanVal);
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1.5 ltr:text-left rtl:text-right"
        >
          {label}
          {required && <span className="text-red-500 ms-1">*</span>}
        </label>
      )}

      <div
        className={`flex items-center border rounded-lg focus-within:ring-2 focus-within:ring-yellow-400 focus-within:border-transparent overflow-hidden transition-all ${
          error
            ? "border-red-300 bg-red-50/50"
            : "border-gray-300 hover:border-gray-400"
        } ${disabled ? "bg-gray-100/70 opacity-70 cursor-not-allowed" : "bg-white"}`}
        dir="ltr"
      >
        <span
          className="px-3 md:px-4 py-2 md:py-2.5 bg-gray-100 text-gray-700 font-semibold text-xs md:text-sm border-r border-gray-300 whitespace-nowrap flex items-center gap-1 select-none shrink-0"
          dir="ltr"
        >
          {countryCode} ▾
        </span>

        <input
          type="tel"
          id={id}
          name={name}
          inputMode="numeric"
          value={value}
          disabled={disabled}
          onChange={handleInputChange}
          placeholder={placeholder || "50 123 4567"}
          required={required}
          className={`w-full px-3 md:px-4 py-2 md:py-2.5 border-0 focus:ring-0 text-xs md:text-sm outline-none text-gray-900 placeholder:text-gray-400 ltr:text-left rtl:text-right ${
            disabled ? "bg-transparent cursor-not-allowed" : ""
          } ${inputClassName}`}
        />
      </div>

      {error && (
        <p className="text-red-500 text-xs mt-1 font-medium ltr:text-left rtl:text-right">
          {error}
        </p>
      )}
    </div>
  );
}
