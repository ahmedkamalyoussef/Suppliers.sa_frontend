// lib/keywordSuggestions.ts

export interface KeywordContext {
  businessName?: string;
  categories?: string[];
  description?: string;
  services?: string[];
  targetMarket?: string[];
  businessType?: string;
  language?: "ar" | "en";
}

// Domain-specific keyword mappings (bilingual)
const DOMAIN_KEYWORDS: Record<string, { ar: string[]; en: string[] }> = {
  Agriculture: {
    ar: [
      "مستلزمات زراعية",
      "أسمدة ومبيدات",
      "أنظمة ري حديثة",
      "معدات وآلات زراعية",
      "بذور عالية الجودة",
      "بيوت محمية",
      "منتجات عضوية",
      "أعلاف مواشي",
      "صيانة معدات زراعية",
      "شتلات وزهور",
    ],
    en: [
      "Agricultural Supplies",
      "Fertilizers & Pesticides",
      "Irrigation Systems",
      "Farming Machinery",
      "High Quality Seeds",
      "Greenhouse Supplies",
      "Organic Products",
      "Livestock Feed",
      "Farm Equipment Maintenance",
      "Seedlings & Plants",
    ],
  },
  "Apparel & Fashion": {
    ar: [
      "ملابس بالجملة",
      "أزياء رجالية ونسائية",
      "أحذية وحقائب",
      "إكسسوارات موضة",
      "ملابس أطفال",
      "تصميم وتصنيع أزياء",
      "أقمشة ومنسوجات",
      "ملابس رياضية",
      "عطور وساعات",
      "زي موحد",
    ],
    en: [
      "Wholesale Clothing",
      "Men & Women Fashion",
      "Shoes & Handbags",
      "Fashion Accessories",
      "Kids Apparel",
      "Fashion Design & Manufacturing",
      "Fabrics & Textiles",
      "Sportswear",
      "Perfumes & Watches",
      "Corporate Uniforms",
    ],
  },
  Automobile: {
    ar: [
      "قطع غيار سيارات",
      "إكسسوارات مركبات",
      "بطاريات وزيوت",
      "صيانة وإصلاح سيارات",
      "إطارات وجنوط",
      "كهرباء وميكانيكا سيارات",
      "تلميع وغسيل سيارات",
      "قطع غيار شاحنات",
      "معدات فحص المركبات",
      "عوازل وتظليل",
    ],
    en: [
      "Auto Spare Parts",
      "Vehicle Accessories",
      "Batteries & Engine Oil",
      "Auto Maintenance & Repair",
      "Tires & Rims",
      "Auto Electrics & Mechanics",
      "Car Detailing & Wash",
      "Truck Spare Parts",
      "Vehicle Diagnostic Equipment",
      "Window Tinting & Coating",
    ],
  },
  "Brass Hardware & Components": {
    ar: [
      "وصلات نحاسية",
      "مكونات هيدروليكية",
      "معدات ومسبوكات",
      "صمامات نحاسية",
      "قطع غيار صناعية",
      "تشكيل معادن",
      "خردوات ومثبتات",
      "أنظمة سباكة نحاسية",
    ],
    en: [
      "Brass Fittings",
      "Hydraulic Components",
      "Hardware & Castings",
      "Brass Valves",
      "Industrial Spare Parts",
      "Metal Fabrication",
      "Hardware Fasteners",
      "Brass Plumbing Systems",
    ],
  },
  "Chemicals & Allied Products": {
    ar: [
      "كيميائيات صناعية",
      "مواد تنظيف وتطهير",
      "دهانات ومذيبات",
      "بلاستيك ومبثوقات",
      "معالجة مياه",
      "زيوت وشحوم صناعية",
      "كيميائيات مختبرات",
    ],
    en: [
      "Industrial Chemicals",
      "Cleaning & Disinfectant Agents",
      "Paints & Solvents",
      "Plastics & Polymers",
      "Water Treatment Chemicals",
      "Industrial Oils & Lubricants",
      "Laboratory Chemicals",
    ],
  },
  "Computer Hardware & Software": {
    ar: [
      "أجهزة كمبيوتر ولابتوب",
      "شبكات وخوادم",
      "برمجيات وحلول سحابية",
      "أمن معلومات وسيبراني",
      "ملحقات كمبيوتر",
      "صيانة وحلول تقنية",
      "طابعات وأحبار",
      "أنظمة نقاط البيع",
    ],
    en: [
      "Computers & Laptops",
      "Networks & Servers",
      "Software & Cloud Solutions",
      "Cybersecurity Solutions",
      "Computer Accessories",
      "IT Support & Maintenance",
      "Printers & Ink",
      "POS Systems",
    ],
  },
  "Consumer Electronics": {
    ar: [
      "أجهزة منزلية ذكية",
      "شاشات وتلفزيونات",
      "هواتف وملحقاتها",
      "أنظمة صوتيات",
      "كاميرات ومعدات تصوير",
      "صيانة إلكترونيات",
      "أجهزة ترفيه وألعاب",
    ],
    en: [
      "Smart Home Appliances",
      "TVs & Displays",
      "Mobile Phones & Accessories",
      "Audio Systems",
      "Cameras & Photography Equipment",
      "Electronics Repair",
      "Gaming & Entertainment Devices",
    ],
  },
  "Construction & Real Estate": {
    ar: [
      "مواد بناء بالجملة",
      "مقاولات وإنشاءات",
      "معدات بناء ثقيلة",
      "تشطيبات وديكورات",
      "أدوات صحية وسباكة",
      "عزل مائي وحراري",
      "حديد وتكسية خارجية",
      "خدمات عقارية",
    ],
    en: [
      "Wholesale Building Materials",
      "General Contracting & Construction",
      "Heavy Machinery",
      "Finishing & Interior Decoration",
      "Sanitary Ware & Plumbing",
      "Waterproofing & Insulation",
      "Steel & Cladding",
      "Real Estate Services",
    ],
  },
  "Electronics & Electrical Supplies": {
    ar: [
      "قطع غيار إلكترونية",
      "مكونات لوحات كهربائية",
      "كابلات وأسلاك",
      "مفاتيح وقواطع كهربائية",
      "محولات وطاقة خضراء",
      "معدات إضاءة LED",
      "أدوات قياس واختبار",
    ],
    en: [
      "Electronic Components",
      "Electrical Panel Boards",
      "Cables & Wires",
      "Switches & Breakers",
      "Transformers & Power Supplies",
      "LED Lighting Fixtures",
      "Testing & Measuring Tools",
    ],
  },
  "Energy & Power": {
    ar: [
      "أنظمة طاقة شمسية",
      "مولدات كهربائية",
      "بطاريات أنظمة الطاقة",
      "لوحات توزيع طاقة",
      "حلول كفاءة الطاقة",
      "طاقة تجددة ومستدامة",
    ],
    en: [
      "Solar Power Systems",
      "Power Generators",
      "Energy Storage Batteries",
      "Power Distribution Panels",
      "Energy Efficiency Solutions",
      "Renewable Energy Systems",
    ],
  },
  "Food & Beverage": {
    ar: [
      "أغذية ومشروبات بالجملة",
      "منتجات طازجة ومجمدة",
      "حلول تموين ومطاعم",
      "معدات مطابخ ومخابز",
      "تغليف وتعليب الأغذية",
      "بهارات ومواد غذائية",
      "عصائر وحلويات",
    ],
    en: [
      "Wholesale Food & Beverage",
      "Fresh & Frozen Goods",
      "Catering & Restaurant Solutions",
      "Kitchen & Bakery Equipment",
      "Food Packaging & Canning",
      "Spices & Food Ingredients",
      "Juices & Confectionery",
    ],
  },
  Industrial: {
    ar: [
      "معدات وآلات صناعية",
      "قطع غيار مصانع",
      "أنظمة أتمتة صناعية",
      "مضخات وضواغط هواء",
      "أدوات وورش عمل",
      "سلامة وصحة مهنية",
    ],
    en: [
      "Industrial Machinery",
      "Factory Spare Parts",
      "Industrial Automation Systems",
      "Pumps & Air Compressors",
      "Workshop & Hand Tools",
      "Occupational Safety Equipment",
    ],
  },
  Medical: {
    ar: [
      "أجهزة ومعدات طبية",
      "مستلزمات مستشفيات",
      "أدوات جراحية",
      "مستلزمات عيادات أسنان",
      "منتجات عناية وصحة",
      "معدات مختبرات وتحاليل",
    ],
    en: [
      "Medical Devices & Equipment",
      "Hospital Supplies",
      "Surgical Instruments",
      "Dental Clinic Supplies",
      "Healthcare & Wellness Products",
      "Laboratory & Diagnostic Tools",
    ],
  },
  Logistics: {
    ar: [
      "خدمات شحن ونقل",
      "تخزين ولوجستيات",
      "تغليف وشحن سريع",
      "إدارة سلاسل الإمداد",
      "تخليص جمركي",
      "نقل مبرد وجاف",
    ],
    en: [
      "Freight & Transportation Services",
      "Warehousing & Logistics",
      "Packaging & Express Delivery",
      "Supply Chain Management",
      "Customs Clearance",
      "Refrigerated & Dry Transport",
    ],
  },
};

// Generic quality & business style keywords
const BASE_BUSINESS_KEYWORDS = {
  ar: [
    "مورد معتمد",
    "أسعار تنافسية",
    "جودة عالية",
    "توصيل سريع",
    "بيع بالجملة",
    "حلول مخصصة",
    "خدمة عملاء ممتازة",
    "ضمان وتأمين",
    "عقود توريد",
    "شريك موثوق",
  ],
  en: [
    "Certified Supplier",
    "Competitive Prices",
    "High Quality",
    "Fast Delivery",
    "Wholesale Supply",
    "Custom Solutions",
    "Excellent Support",
    "Warranty Guaranteed",
    "Supply Contracts",
    "Reliable Partner",
  ],
};

/**
 * Generate smart, dynamic, context-aware keyword suggestions.
 * Infers appropriate business-specific keywords from business details
 * instead of relying on a static hardcoded list.
 */
export function generateSmartKeywordSuggestions(
  context: KeywordContext,
  currentKeywords: string[] = []
): string[] {
  const lang = context.language || "ar";
  const suggestionsSet = new Set<string>();

  const currentNormalized = new Set(
    currentKeywords.map((k) => k.trim().toLowerCase())
  );

  // 1. Add domain-specific keywords based on categories
  const categories = context.categories || [];
  categories.forEach((cat) => {
    // Find matching domain key
    const domainKey = Object.keys(DOMAIN_KEYWORDS).find(
      (k) =>
        k.toLowerCase() === cat.toLowerCase() ||
        cat.toLowerCase().includes(k.toLowerCase())
    );

    if (domainKey && DOMAIN_KEYWORDS[domainKey]) {
      const keywordsList = DOMAIN_KEYWORDS[domainKey][lang] || DOMAIN_KEYWORDS[domainKey]["ar"];
      keywordsList.forEach((kw) => suggestionsSet.add(kw));
    }
  });

  // 2. Extract key terms from Business Name
  if (context.businessName && context.businessName.trim().length > 2) {
    const cleanName = context.businessName
      .replace(/(شركة|مؤسسة|محل|مركز|مجموعة|مورد|Company|Est|LLC|Group|Store|Co)/gi, "")
      .trim();

    if (cleanName.length > 2) {
      if (lang === "ar") {
        suggestionsSet.add(`خدمات ${cleanName}`);
        suggestionsSet.add(`منتجات ${cleanName}`);
      } else {
        suggestionsSet.add(`${cleanName} Products`);
        suggestionsSet.add(`${cleanName} Services`);
      }
    }
  }

  // 3. Include Services as keywords
  if (Array.isArray(context.services)) {
    context.services.forEach((service) => {
      if (typeof service === "string" && service.trim().length > 2) {
        suggestionsSet.add(service.trim());
      }
    });
  }

  // 4. Include Target Markets as context keywords
  if (Array.isArray(context.targetMarket)) {
    context.targetMarket.forEach((market) => {
      if (typeof market === "string" && market.trim().length > 2) {
        if (lang === "ar") {
          suggestionsSet.add(`توريد إلى ${market}`);
        } else {
          suggestionsSet.add(`Supply for ${market}`);
        }
      }
    });
  }

  // 5. Add general business quality suggestions if suggestions list is short
  if (suggestionsSet.size < 6) {
    const baseList = BASE_BUSINESS_KEYWORDS[lang] || BASE_BUSINESS_KEYWORDS["ar"];
    baseList.forEach((kw) => suggestionsSet.add(kw));
  }

  // Filter out any keyword already selected by the user
  const finalSuggestions = Array.from(suggestionsSet).filter(
    (kw) => !currentNormalized.has(kw.trim().toLowerCase())
  );

  return finalSuggestions.slice(0, 15);
}
