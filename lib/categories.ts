// Centralized category configuration for consistency across the application

export interface Category {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  icon: string;
  color: string;
}

export const categories: Category[] = [
  {
    id: "all",
    name: {
      en: "All Categories",
      ar: "جميع الفئات"
    },
    icon: "ri-apps-2-line",
    color: "from-purple-400 to-purple-600"
  },
  {
    id: "Agriculture",
    name: {
      en: "Agriculture",
      ar: "الزراعة"
    },
    icon: "ri-leaf-line",
    color: "from-green-400 to-green-600"
  },
  {
    id: "Apparel & Fashion",
    name: {
      en: "Apparel & Fashion",
      ar: "الملابس والموضة"
    },
    icon: "ri-t-shirt-line",
    color: "from-blue-400 to-blue-600"
  },
  {
    id: "Automobile",
    name: {
      en: "Automobile",
      ar: "السيارات"
    },
    icon: "ri-car-line",
    color: "from-red-400 to-red-600"
  },
  {
    id: "Brass Hardware & Components",
    name: {
      en: "Brass Hardware & Components",
      ar: "أدوات ومكونات النحاس"
    },
    icon: "ri-tools-line",
    color: "from-yellow-400 to-yellow-600"
  },
  {
    id: "Business Services",
    name: {
      en: "Business Services",
      ar: "الخدمات التجارية"
    },
    icon: "ri-briefcase-line",
    color: "from-purple-500 to-purple-700"
  },
  {
    id: "Chemicals",
    name: {
      en: "Chemicals",
      ar: "المواد الكيميائية"
    },
    icon: "ri-flask-line",
    color: "from-blue-300 to-blue-500"
  },
  {
    id: "Computer Hardware & Software",
    name: {
      en: "Computer Hardware & Software",
      ar: "أجهزة وبرامج الكمبيوتر"
    },
    icon: "ri-computer-line",
    color: "from-indigo-400 to-indigo-600"
  },
  {
    id: "Consumer Electronics",
    name: {
      en: "Consumer Electronics",
      ar: "الإلكترونيات الاستهلاكية"
    },
    icon: "ri-smartphone-line",
    color: "from-blue-400 to-blue-600"
  },
  {
    id: "Electronics & Electrical Supplies",
    name: {
      en: "Electronics & Electrical Supplies",
      ar: "الإلكترونيات والمستلزمات الكهربائية"
    },
    icon: "ri-plug-line",
    color: "from-yellow-400 to-yellow-600"
  },
  {
    id: "Energy & Power",
    name: {
      en: "Energy & Power",
      ar: "الطاقة والطاقة الكهربائية"
    },
    icon: "ri-flashlight-line",
    color: "from-yellow-400 to-yellow-600"
  },
  {
    id: "Environment & Pollution",
    name: {
      en: "Environment & Pollution",
      ar: "البيئة والتلوث"
    },
    icon: "ri-leaf-line",
    color: "from-green-500 to-green-700"
  },
  {
    id: "Food & Beverage",
    name: {
      en: "Food & Beverage",
      ar: "الطعام والمشروبات"
    },
    icon: "ri-restaurant-line",
    color: "from-orange-400 to-red-500"
  },
  {
    id: "Furniture",
    name: {
      en: "Furniture",
      ar: "الأثاث"
    },
    icon: "ri-sofa-line",
    color: "from-amber-400 to-orange-500"
  },
  {
    id: "Gifts & Crafts",
    name: {
      en: "Gifts & Crafts",
      ar: "الهدايا والحرف اليدوية"
    },
    icon: "ri-gift-line",
    color: "from-pink-400 to-rose-500"
  },
  {
    id: "Health & Beauty",
    name: {
      en: "Health & Beauty",
      ar: "الصحة والجمال"
    },
    icon: "ri-scissors-line",
    color: "from-fuchsia-400 to-pink-500"
  },
  {
    id: "Home Supplies",
    name: {
      en: "Home Supplies",
      ar: "مستلزمات المنزل"
    },
    icon: "ri-home-line",
    color: "from-amber-300 to-amber-500"
  },
  {
    id: "Home Textiles & Furnishings",
    name: {
      en: "Home Textiles & Furnishings",
      ar: "منسوجات وتجهيزات المنزل"
    },
    icon: "ri-store-line",
    color: "from-emerald-300 to-emerald-500"
  },
  {
    id: "Hospital & Medical Supplies",
    name: {
      en: "Hospital & Medical Supplies",
      ar: "المستشفيات والمستلزمات الطبية"
    },
    icon: "ri-hospital-line",
    color: "from-red-300 to-red-500"
  },
  {
    id: "Hotel Supplies & Equipment",
    name: {
      en: "Hotel Supplies & Equipment",
      ar: "مستلزمات ومعدات الفنادق"
    },
    icon: "ri-hotel-line",
    color: "from-blue-300 to-blue-500"
  },
  {
    id: "Industrial Supplies",
    name: {
      en: "Industrial Supplies",
      ar: "المستلزمات الصناعية"
    },
    icon: "ri-tools-line",
    color: "from-gray-400 to-gray-600"
  },
  {
    id: "Jewelry & Gemstones",
    name: {
      en: "Jewelry & Gemstones",
      ar: "المجوهرات والأحجار الكريمة"
    },
    icon: "ri-vip-diamond-line",
    color: "from-yellow-300 to-yellow-500"
  },
  {
    id: "Leather & Leather Products",
    name: {
      en: "Leather & Leather Products",
      ar: "الجلد والمنتجات الجلدية"
    },
    icon: "ri-suitcase-line",
    color: "from-amber-600 to-amber-800"
  },
  {
    id: "Machinery",
    name: {
      en: "Machinery",
      ar: "المعدات والآلات"
    },
    icon: "ri-tools-fill",
    color: "from-gray-500 to-gray-700"
  },
  {
    id: "Mineral & Metals",
    name: {
      en: "Mineral & Metals",
      ar: "المعادن والمعادن"
    },
    icon: "ri-copper-diamond-line",
    color: "from-gray-400 to-gray-600"
  },
  {
    id: "Office & School Supplies",
    name: {
      en: "Office & School Supplies",
      ar: "مستلزمات المكتب والمدرسة"
    },
    icon: "ri-book-line",
    color: "from-blue-300 to-blue-500"
  },
  {
    id: "Oil and Gas",
    name: {
      en: "Oil and Gas",
      ar: "النفط والغاز"
    },
    icon: "ri-oil-line",
    color: "from-gray-700 to-gray-900"
  },
  {
    id: "Packaging & Paper",
    name: {
      en: "Packaging & Paper",
      ar: "التغليف والورق"
    },
    icon: "ri-boxing-line",
    color: "from-amber-300 to-amber-500"
  },
  {
    id: "Pharmaceuticals",
    name: {
      en: "Pharmaceuticals",
      ar: "الأدوية"
    },
    icon: "ri-medicine-bottle-line",
    color: "from-blue-400 to-blue-600"
  },
  {
    id: "Pipes, Tubes & Fittings",
    name: {
      en: "Pipes, Tubes & Fittings",
      ar: "الأنابيب والوصلات"
    },
    icon: "ri-settings-3-line",
    color: "from-gray-500 to-gray-700"
  },
  {
    id: "Plastics & Products",
    name: {
      en: "Plastics & Products",
      ar: "اللدائن والمنتجات"
    },
    icon: "ri-bubble-chart-line",
    color: "from-blue-300 to-blue-500"
  },
  {
    id: "Printing & Publishing",
    name: {
      en: "Printing & Publishing",
      ar: "الطباعة والنشر"
    },
    icon: "ri-printer-line",
    color: "from-purple-400 to-purple-600"
  },
  {
    id: "Scientific & Laboratory Instruments",
    name: {
      en: "Scientific & Laboratory Instruments",
      ar: "الأدوات العلمية والمخبرية"
    },
    icon: "ri-microscope-line",
    color: "from-blue-400 to-blue-600"
  },
  {
    id: "Security & Protection",
    name: {
      en: "Security & Protection",
      ar: "الأمن والحماية"
    },
    icon: "ri-shield-line",
    color: "from-red-500 to-red-700"
  },
  {
    id: "Sports & Entertainment",
    name: {
      en: "Sports & Entertainment",
      ar: "الرياضة والترفيه"
    },
    icon: "ri-football-line",
    color: "from-green-500 to-green-700"
  },
  {
    id: "Telecommunications",
    name: {
      en: "Telecommunications",
      ar: "الاتصالات"
    },
    icon: "ri-phone-line",
    color: "from-blue-400 to-blue-600"
  },
  {
    id: "Textiles & Fabrics",
    name: {
      en: "Textiles & Fabrics",
      ar: "المنسوجات والأقمشة"
    },
    icon: "ri-scissors-line",
    color: "from-pink-400 to-pink-600"
  },
  {
    id: "Toys",
    name: {
      en: "Toys",
      ar: "الألعاب"
    },
    icon: "ri-gamepad-line",
    color: "from-red-400 to-red-600"
  },
  {
    id: "Transportation",
    name: {
      en: "Transportation",
      ar: "النقل"
    },
    icon: "ri-truck-line",
    color: "from-indigo-400 to-indigo-600"
  }
];

// Helper functions
export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(cat => cat.id === id);
};

export const getCategoryName = (id: string, language: 'en' | 'ar' = 'en'): string => {
  const category = getCategoryById(id);
  return category ? category.name[language] : id;
};

export const getCategoryIcon = (id: string): string => {
  const category = getCategoryById(id);
  return category ? category.icon : 'ri-building-line';
};

export const getCategoryColor = (id: string): string => {
  const category = getCategoryById(id);
  return category ? category.color : 'from-gray-400 to-gray-600';
};
