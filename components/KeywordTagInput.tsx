"use client";

import React, { useState, KeyboardEvent, useMemo } from "react";
import { useLanguage } from "../lib/LanguageContext";
import {
  generateSmartKeywordSuggestions,
  KeywordContext,
} from "../lib/keywordSuggestions";

export interface KeywordTagInputProps {
  selectedKeywords: string[];
  onChange: (keywords: string[]) => void;
  context?: KeywordContext;
  placeholder?: string;
  error?: string;
  isEditing?: boolean;
  disabled?: boolean;
  maxKeywords?: number;
}

export default function KeywordTagInput({
  selectedKeywords = [],
  onChange,
  context = {},
  placeholder,
  error,
  isEditing = true,
  disabled = false,
  maxKeywords = 30,
}: KeywordTagInputProps) {
  const { language, isRTL } = useLanguage();
  const [inputValue, setInputValue] = useState("");

  // Normalize keywords for deduplication check
  const normalizedSet = useMemo(() => {
    return new Set(selectedKeywords.map((k) => k.trim().toLowerCase()));
  }, [selectedKeywords]);

  // Generate dynamic, context-aware smart keyword suggestions
  const dynamicSuggestions = useMemo(() => {
    return generateSmartKeywordSuggestions(
      { ...context, language: language as "ar" | "en" },
      selectedKeywords
    );
  }, [context, language, selectedKeywords]);

  // Helper to add a keyword tag
  const addKeyword = (rawKeyword: string) => {
    if (disabled || !isEditing) return;

    const trimmed = rawKeyword.trim().replace(/^[,،]+|[,،]+$/g, "");
    if (!trimmed) return;

    const lower = trimmed.toLowerCase();
    if (normalizedSet.has(lower)) {
      setInputValue("");
      return;
    }

    if (selectedKeywords.length >= maxKeywords) return;

    const nextKeywords = [...selectedKeywords, trimmed];
    onChange(nextKeywords);
    setInputValue("");
  };

  // Helper to remove a keyword tag
  const removeKeyword = (keywordToRemove: string) => {
    if (disabled || !isEditing) return;
    const nextKeywords = selectedKeywords.filter(
      (k) => k.toLowerCase() !== keywordToRemove.toLowerCase()
    );
    onChange(nextKeywords);
  };

  // Input key down handler (Enter, Tab, Comma, Backspace)
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      addKeyword(inputValue);
    } else if (e.key === "Backspace" && !inputValue && selectedKeywords.length > 0) {
      removeKeyword(selectedKeywords[selectedKeywords.length - 1]);
    }
  };

  // Input text change handler (triggers on comma or Arabic comma typing)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.includes(",") || val.includes("،")) {
      const parts = val.split(/[,،]/);
      parts.forEach((p) => {
        if (p.trim()) addKeyword(p);
      });
    } else {
      setInputValue(val);
    }
  };

  return (
    <div className="space-y-4">
      {/* Active Keyword Tags Container */}
      <div
        className={`w-full min-h-[52px] p-2.5 rounded-2xl border transition-all flex flex-wrap items-center gap-2 bg-white ${
          error
            ? "border-red-300 ring-2 ring-red-100"
            : "border-gray-300 hover:border-gray-400 focus-within:ring-2 focus-within:ring-amber-400 focus-within:border-amber-400"
        }`}
      >
        {selectedKeywords.map((keyword, idx) => (
          <span
            key={`${keyword}_${idx}`}
            className="bg-amber-50 text-amber-900 border border-amber-200/80 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm group hover:border-amber-300 transition-all"
          >
            <i className="ri-hashtag text-amber-500 text-xs"></i>
            <span>{keyword}</span>
            {isEditing && !disabled && (
              <button
                type="button"
                onClick={() => removeKeyword(keyword)}
                className="w-4 h-4 rounded-full bg-amber-200/60 hover:bg-red-500 hover:text-white flex items-center justify-center text-amber-800 transition-colors cursor-pointer text-xs ms-0.5"
                title={language === "ar" ? "إزالة" : "Remove"}
              >
                <i className="ri-close-line"></i>
              </button>
            )}
          </span>
        ))}

        {/* Tag Input Field */}
        {isEditing && !disabled && selectedKeywords.length < maxKeywords && (
          <div className="flex-1 min-w-[160px] flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onBlur={() => {
                if (inputValue.trim()) addKeyword(inputValue);
              }}
              placeholder={
                selectedKeywords.length === 0
                  ? placeholder ||
                    (language === "ar"
                      ? "اكتب كلمة مفتاحية ثم اضغط Enter..."
                      : "Type a keyword and press Enter...")
                  : language === "ar"
                  ? "أضف كلمة أخرى..."
                  : "Add another keyword..."
              }
              className="w-full text-xs font-medium text-gray-800 outline-none bg-transparent py-1 px-1 placeholder-gray-400"
            />
            {inputValue.trim() && (
              <button
                type="button"
                onClick={() => addKeyword(inputValue)}
                className="px-3 py-1 rounded-xl bg-amber-400 text-gray-900 font-bold text-xs hover:bg-amber-500 transition-all cursor-pointer flex items-center gap-1 flex-shrink-0"
              >
                <i className="ri-add-line"></i>
                <span>{language === "ar" ? "إضافة" : "Add"}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Counter & Validation Status */}
      <div className="flex items-center justify-between text-xs px-1">
        {error ? (
          <p className="text-red-500 font-medium flex items-center gap-1">
            <i className="ri-error-warning-line"></i>
            <span>{error}</span>
          </p>
        ) : (
          <p className="text-gray-500 font-medium">
            {language === "ar"
              ? "اضغط Enter أو Tab لإضافة الكلمة المفتاحية دون الحاجة لفواصل"
              : "Press Enter or Tab to add tags without using commas"}
          </p>
        )}
        <span className="font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full text-[11px]">
          {selectedKeywords.length} / {maxKeywords}{" "}
          {language === "ar" ? "كلمات" : "Keywords"}
        </span>
      </div>

      {/* Context-Aware Smart Suggestions */}
      {isEditing && !disabled && dynamicSuggestions.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50/60 to-indigo-50/60 border border-blue-100 rounded-2xl p-4 space-y-2.5">
          <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
            <div className="w-5 h-5 rounded-lg bg-blue-500 text-white flex items-center justify-center text-xs">
              <i className="ri-magic-line"></i>
            </div>
            <span>
              {language === "ar"
                ? "مقترحات كلمات مفتاحية تناسب نشاطك التجاري:"
                : "Suggested Keywords matching your business:"}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {dynamicSuggestions.map((suggestion, idx) => (
              <button
                key={`${suggestion}_${idx}`}
                type="button"
                onClick={() => addKeyword(suggestion)}
                className="bg-white hover:bg-blue-600 hover:text-white text-blue-800 border border-blue-200 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm flex items-center gap-1.5 group"
              >
                <i className="ri-add-line text-blue-500 group-hover:text-white"></i>
                <span>{suggestion}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
