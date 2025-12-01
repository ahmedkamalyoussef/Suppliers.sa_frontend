"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MaintenancePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Prevent navigation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      window.history.pushState(null, "", window.location.pathname);
    };

    // Prevent back navigation
    window.history.pushState(null, "", window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-tools-line text-3xl text-orange-500"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            الموقع تحت الصيانة
          </h1>
          <p className="text-gray-600 mb-6">
            نعمل حالياً على تحسينات وتطويرات لخدمتكم بشكل أفضل. الموقع سيعود للعمل قريباً.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-2 text-blue-700">
              <i className="ri-time-line text-xl"></i>
              <span className="text-sm font-medium">
                وقت الصيانة المتوقع: بضع ساعات
              </span>
            </div>
          </div>

          {user && (
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-4">
                يمكنك تسجيل الخروج والعودة لاحقاً
              </p>
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <i className="ri-logout-box-line text-xl"></i>
                <span>تسجيل الخروج</span>
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            نشكرك لصبركم وتفهمكم
          </p>
        </div>
      </div>
    </div>
  );
}
