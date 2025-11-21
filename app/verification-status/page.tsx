'use client';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import VerificationPendingStatus from '../../components/VerificationPendingStatus';

export default function VerificationStatusPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-16">
        <div className="w-full px-6">
          <VerificationPendingStatus />
        </div>
      </main>
      <Footer />
    </div>
  );
}