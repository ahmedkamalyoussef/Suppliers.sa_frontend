"use client";

import React from "react";

interface CompactHelpBoxProps {
  title: string;
  text: string;
  exampleTitle?: string;
  exampleContent?: string;
  className?: string;
}

export default function CompactHelpBox({
  title,
  text,
  exampleTitle,
  exampleContent,
  className = "",
}: CompactHelpBoxProps) {
  return (
    <div
      className={`bg-amber-50/80 border border-amber-200/80 rounded-xl p-3.5 md:p-4 text-xs md:text-sm text-amber-900 shadow-xs flex items-start gap-3 transition-all ${className}`}
    >
      <div className="w-7 h-7 rounded-lg bg-amber-100/90 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">
        <i className="ri-lightbulb-line text-base"></i>
      </div>
      <div className="space-y-1 text-left rtl:text-right flex-1">
        <h5 className="font-bold text-amber-950 text-xs md:text-sm flex items-center gap-1.5">
          {title}
        </h5>
        <p className="text-amber-900/90 leading-relaxed text-xs">
          {text}
        </p>
        {exampleContent && (
          <div className="pt-1.5 border-t border-amber-200/60 mt-1.5 flex flex-wrap items-center gap-1 text-xs">
            {exampleTitle && (
              <span className="font-semibold text-amber-950">
                {exampleTitle}
              </span>
            )}
            <span className="text-amber-800/90 italic bg-amber-100/60 px-2 py-0.5 rounded-md font-mono text-[11px]">
              {exampleContent}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
