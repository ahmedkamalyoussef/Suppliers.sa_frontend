"use client";

import { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import BusinessRegistrationForm from "../../components/BusinessRegistrationForm";
import { useLanguage } from "../../lib/LanguageContext";

export default function AddBusinessPage() {
  const { t } = useLanguage("business");

  // Auth guard - redirect authenticated users away
  useEffect(() => {
    const token = localStorage.getItem("supplier_token");
    const user = localStorage.getItem("supplier_user");
    
    if (token && user) {
      try {
        const userData = JSON.parse(user);
        // Redirect based on user type
        if (userData.userType === "admin") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/";
        }
        return;
      } catch (error) {
        // Invalid user data, continue to add-business
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <section className="py-16 bg-gradient-to-b from-yellow-50 to-white">
          <div className="w-full px-6">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-gray-800 mb-4">
                {t("business.registerBusinessTitle")}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t("business.registerBusinessSubtitle")}
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <BusinessRegistrationForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
