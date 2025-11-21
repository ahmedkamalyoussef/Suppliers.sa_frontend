"use client";

import Header from "../components/Header";
import SearchSection from "../components/SearchSection";
import FeaturedBusinesses from "../components/FeaturedBusinesses";
import TopSuppliers from "../components/TopSuppliers";
import TrustedPartners from "../components/TrustedPartners";
import HowItWorks from "../components/HowItWorks";
import Footer from "../components/Footer";
import AIChatWidget from "../components/AIChatWidget";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <SearchSection />
        <TopSuppliers />
        <TrustedPartners />
        <HowItWorks />
      </main>
      <Footer />
      <AIChatWidget />
    </div>
  );
}
