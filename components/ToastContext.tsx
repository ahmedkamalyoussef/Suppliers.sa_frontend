"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "../lib/LanguageContext";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: Toast["type"], duration?: number) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(
  undefined
);

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const { t, isRTL } = useLanguage();

  const showToast = (
    message: string,
    type: Toast["type"] = "success",
    duration = 3000
  ) => {
    const id = Date.now().toString();
    const newToast: Toast = { id, message, type, duration };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const getToastIcon = (type: Toast["type"]) => {
    switch (type) {
      case "success":
        return "ri-checkbox-circle-fill text-green-500";
      case "error":
        return "ri-error-warning-fill text-red-500";
      case "warning":
        return "ri-alert-fill text-yellow-500";
      case "info":
        return "ri-information-fill text-blue-500";
      default:
        return "ri-information-fill text-blue-500";
    }
  };

  const getToastStyles = (type: Toast["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800";
      default:
        return "bg-blue-50 border-blue-200 text-blue-800";
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container */}
      <div
        className={`fixed top-4 ${isRTL ? "left-4" : "right-4"} z-50 space-y-2`}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg min-w-[300px] max-w-md transform transition-all duration-300 animate-in slide-in-from-top ${getToastStyles(
              toast.type
            )}`}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <i className={`${getToastIcon(toast.type)} text-xl`}></i>
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i className="ri-close-line text-lg"></i>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
