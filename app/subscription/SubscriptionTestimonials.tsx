"use client";

import { useLanguage } from "@/lib/LanguageContext"; // عدل المسار حسب مكانك

export default function SubscriptionTestimonials() {
  const { t } = useLanguage();

  const testimonials = [
    {
      name: "Sarah Johnson",
      business: "Johnson Construction Services",
      plan: "Professional",
      image:
        "https://readdy.ai/api/search-image?query=Professional%20businesswoman%20Sarah%20Johnson%20in%20construction%20industry%2C%20confident%20smile%2C%20hardhat%20and%20safety%20vest%2C%20construction%20site%20background%2C%20natural%20lighting%2C%20professional%20portrait%20style&width=300&height=300&seq=sarah-johnson&orientation=squarish",
      rating: 5,
      quote:
        "Since upgrading to the Professional plan, our inquiries have increased by 300%. The enhanced visibility and priority ranking have made all the difference for our construction business.",
      results: "+300% inquiries",
    },
    {
      name: "Ahmed Al-Rashid",
      business: "Al-Rashid Electronics",
      plan: "Enterprise",
      image:
        "https://readdy.ai/api/search-image?query=Middle%20Eastern%20businessman%20Ahmed%20Al-Rashid%20in%20electronics%20store%2C%20professional%20attire%2C%20surrounded%20by%20modern%20electronics%20and%20displays%2C%20confident%20pose%2C%20natural%20lighting%2C%20business%20portrait&width=300&height=300&seq=ahmed-rashid&orientation=squarish",
      rating: 5,
      quote:
        "The Enterprise plan's multi-location management and advanced analytics have transformed how we operate our 5 electronics stores. The ROI has been incredible.",
      results: "5x locations managed",
    },
    {
      name: "Maria Rodriguez",
      business: "Rodriguez Catering Co.",
      plan: "Professional",
      image:
        "https://readdy.ai/api/search-image?query=Hispanic%20businesswoman%20Maria%20Rodriguez%20in%20professional%20chef%20attire%2C%20warm%20smile%2C%20catering%20kitchen%20background%20with%20elegant%20food%20displays%2C%20professional%20lighting%2C%20business%20portrait&width=300&height=300&seq=maria-rodriguez&orientation=squarish",
      rating: 5,
      quote:
        "The lead management tools and customer analytics have helped us understand our clients better. We've booked 250% more events since switching to the Professional plan.",
      results: "+250% bookings",
    },
    {
      name: "David Chen",
      business: "Chen Digital Marketing",
      plan: "Enterprise",
      image:
        "https://readdy.ai/api/search-image?query=Asian%20businessman%20David%20Chen%20in%20modern%20office%20setting%2C%20professional%20attire%2C%20laptop%20and%20digital%20marketing%20materials%2C%20confident%20expression%2C%20contemporary%20workspace%2C%20professional%20portrait&width=300&height=300&seq=david-chen&orientation=squarish",
      rating: 5,
      quote:
        "The custom branding and API integration features have allowed us to offer white-label solutions to our clients. It's been a game-changer for our agency.",
      results: "White-label success",
    },
    {
      name: "Lisa Thompson",
      business: "Thompson Law Firm",
      plan: "Professional",
      image:
        "https://readdy.ai/api/search-image?query=Professional%20attorney%20Lisa%20Thompson%20in%20law%20office%2C%20business%20suit%2C%20law%20books%20and%20legal%20documents%20background%2C%20confident%20professional%20demeanor%2C%20elegant%20office%20setting&width=300&height=300&seq=lisa-thompson&orientation=squarish",
      rating: 5,
      quote:
        "The priority support and dedicated account manager have been invaluable. We've seen a 180% increase in client consultations within just 3 months.",
      results: "+180% consultations",
    },
    {
      name: "Michael Brown",
      business: "Brown HVAC Solutions",
      plan: "Professional",
      image:
        "https://readdy.ai/api/search-image?query=HVAC%20technician%20Michael%20Brown%20in%20work%20uniform%2C%20friendly%20professional%20smile%2C%20HVAC%20equipment%20and%20tools%20background%2C%20service%20truck%20visible%2C%20reliable%20contractor%20appearance&width=300&height=300&seq=michael-brown&orientation=squarish",
      rating: 5,
      quote:
        "The featured listing placement has put us ahead of our competitors. Our service calls have doubled, and we're now the go-to HVAC company in our area.",
      results: "2x service calls",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="w-full px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              {t("subscriptionTestimonials.title")}{" "}
              <span className="text-yellow-600">
                {t("subscriptionTestimonials.titleHighlight")}
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t("subscriptionTestimonials.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all"
              >
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover object-top mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-gray-800">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {testimonial.business}
                    </p>
                    <div className="flex items-center mt-1">
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                        {testimonial.plan}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <i key={i} className="ri-star-fill text-yellow-400"></i>
                  ))}
                </div>

                <blockquote className="text-gray-700 leading-relaxed mb-6">
                  "{testimonial.quote}"
                </blockquote>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <i className="ri-trophy-line text-green-600"></i>
                    <span className="font-semibold text-green-800">
                      {t("subscriptionTestimonials.resultLabel")}
                    </span>
                    <span className="text-green-700">
                      {testimonial.results}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
