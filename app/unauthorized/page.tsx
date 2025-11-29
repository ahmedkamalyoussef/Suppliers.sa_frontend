"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function UnauthorizedPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/dashboard");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="py-12 sm:py-16">
        <div className="w-full px-4 sm:px-6 md:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center">
              {/* Error Icon */}
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full">
                  <i className="ri-shield-close-line text-4xl text-red-600"></i>
                </div>
              </div>

              {/* Error Title */}
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Access Denied
              </h1>

              {/* Error Description */}
              <p className="text-lg text-gray-600 mb-8">
                You don't have permission to access this page. This area is restricted to administrators only.
              </p>

              {/* Additional Info */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <div className="flex items-center justify-center space-x-2 text-gray-700">
                  <i className="ri-information-line text-xl"></i>
                  <span>You will be redirected to the dashboard in {countdown} seconds</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-medium transition-colors flex items-center justify-center"
                >
                  <i className="ri-dashboard-line mr-2"></i>
                  Go to Dashboard
                </button>
                
                <button
                  onClick={() => router.push("/")}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 font-medium transition-colors flex items-center justify-center"
                >
                  <i className="ri-home-line mr-2"></i>
                  Go Home
                </button>
              </div>

              {/* Help Section */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  If you believe this is an error, please contact your system administrator.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
