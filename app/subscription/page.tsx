'use client';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PricingHero from './PricingHero';
import PricingPlans from './PricingPlans';
import SubscriptionTestimonials from './SubscriptionTestimonials';

export default function SubscriptionPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <PricingHero />
      <PricingPlans />
      <SubscriptionTestimonials />
      <Footer />
    </div>
  );
}
