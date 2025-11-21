"use client";

import { useState } from "react";
import { useLanguage } from "../lib/LanguageContext";

export default function BusinessManagement() {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [businessData, setBusinessData] = useState({
    name: "Metro Electronics Supply",
    category: "Electronics",
    businessType: "Supplier",
    description:
      "Metro Electronics Supply is your trusted partner for all electronic components and supplies. We specialize in wholesale electronics, repair parts, and custom solutions for businesses of all sizes.",
    productKeywords:
      "LED TV, Samsung electronics, iPhone repair, laptop wholesale, gaming computers, mobile accessories, warranty service, bulk orders, electronic components, circuit boards, cables, connectors, semiconductors",
    email: "info@metroelectronics.com",
    phone: "+966 50 123 4567",
    website: "https://metroelectronics.com",
    address: "1247 King Fahd Road, Al-Olaya District, Riyadh 12313",
    serviceDistance: "40 km",
    targetCustomers: ["Large Organizations", "Small Businesses"],
    services: [
      "Wholesale",
      "Repair Services",
      "Custom Orders",
      "Bulk Orders",
      "Emergency Services",
    ],
    workingHours: {
      monday: { open: "08:00", close: "18:00", closed: false },
      tuesday: { open: "08:00", close: "18:00", closed: false },
      wednesday: { open: "08:00", close: "18:00", closed: false },
      thursday: { open: "08:00", close: "18:00", closed: false },
      friday: { open: "08:00", close: "18:00", closed: false },
      saturday: { open: "09:00", close: "17:00", closed: false },
      sunday: { open: "10:00", close: "16:00", closed: false },
    },
  });

  const [businessImages, setBusinessImages] = useState([
    "https://readdy.ai/api/search-image?query=Modern%20electronics%20supply%20store%20interior%20with%20organized%20shelves%2C%20professional%20lighting%2C%20clean%20white%20background%2C%20electronic%20components%20and%20devices%20displayed%20neatly%2C%20contemporary%20retail%20space%20design%2C%20wide%20angle%20view&width=400&height=300&seq=electronics-main&orientation=landscape",
    "https://readdy.ai/api/search-image?query=Electronic%20components%20warehouse%20with%20organized%20storage%20systems%2C%20shelves%20full%20of%20electronic%20parts%2C%20professional%20industrial%20interior%2C%20bright%20lighting%2C%20clean%20organized%20workspace&width=400&height=300&seq=electronics-warehouse&orientation=landscape",
    "https://readdy.ai/api/search-image?query=Electronics%20repair%20workshop%20with%20professional%20tools%2C%20workbenches%2C%20testing%20equipment%2C%20organized%20tool%20storage%2C%20clean%20technical%20workspace%20environment&width=400&height=300&seq=electronics-workshop&orientation=landscape",
  ]);

  const sections = [
    {
      id: "profile",
      name: t("businessManagement.sections.profile"),
      icon: "ri-information-line",
    },
    {
      id: "products",
      name: t("businessManagement.sections.products"),
      icon: "ri-price-tag-3-line",
    },
    {
      id: "photos",
      name: t("businessManagement.sections.photos"),
      icon: "ri-image-line",
    },
    {
      id: "hours",
      name: t("businessManagement.sections.hours"),
      icon: "ri-time-line",
    },
  ];

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleImageUpload = (event: { target: { files: any } }) => {
    const files = event.target.files;
    if (files) {
      const newImageUrl = `https://readdy.ai/api/search-image?query=Business%20interior%20modern%20professional%20clean%20lighting%20organized%20workspace%20commercial%20space%20design&width=400&height=300&seq=new-upload-${Date.now()}&orientation=landscape`;
      setBusinessImages([...businessImages, newImageUrl]);
    }
  };

  const removeImage = (index: number) => {
    setBusinessImages(businessImages.filter((_, i) => i !== index));
  };

  const availableServices = [
    t("businessManagement.services.wholesale"),
    t("businessManagement.services.retail"),
    t("businessManagement.services.repair"),
    t("businessManagement.services.custom"),
    t("businessManagement.services.bulk"),
    t("businessManagement.services.emergency"),
    t("businessManagement.services.installation"),
    t("businessManagement.services.maintenance"),
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          {t("businessManagement.title")}
        </h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap cursor-pointer transition-all ${
            isEditing
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-yellow-400 text-white hover:bg-yellow-500"
          }`}
        >
          <i
            className={`${isEditing ? "ri-save-line" : "ri-edit-line"} mr-2`}
          ></i>
          {isEditing
            ? t("businessManagement.saveChanges")
            : t("businessManagement.editProfile")}
        </button>
      </div>

      {/* Section Navigation */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-6 px-6">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer transition-all ${
                  activeSection === section.id
                    ? "border-yellow-400 text-yellow-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <i className={`${section.icon} mr-2`}></i>
                {section.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Basic Info Section */}
          {activeSection === "profile" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("businessManagement.form.businessName")}
                  </label>
                  <input
                    type="text"
                    value={businessData.name}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setBusinessData({ ...businessData, name: e.target.value })
                    }
                    className={`w-full px-4 py-3 border rounded-lg text-sm ${
                      isEditing
                        ? "border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("businessManagement.form.category")}
                  </label>
                  <select
                    value={businessData.category}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setBusinessData({
                        ...businessData,
                        category: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-3 border rounded-lg text-sm pr-8 ${
                      isEditing
                        ? "border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Printing">Printing</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Technology">Technology</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("businessManagement.form.phone")}
                  </label>
                  <input
                    type="tel"
                    value={businessData.phone}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setBusinessData({
                        ...businessData,
                        phone: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-3 border rounded-lg text-sm ${
                      isEditing
                        ? "border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("businessManagement.form.email")}
                  </label>
                  <input
                    type="email"
                    value={businessData.email}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setBusinessData({
                        ...businessData,
                        email: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-3 border rounded-lg text-sm ${
                      isEditing
                        ? "border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("businessManagement.form.website")}
                  </label>
                  <input
                    type="url"
                    value={businessData.website}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setBusinessData({
                        ...businessData,
                        website: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-3 border rounded-lg text-sm ${
                      isEditing
                        ? "border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("businessManagement.form.serviceDistance")}
                  </label>
                  <select
                    value={businessData.serviceDistance}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setBusinessData({
                        ...businessData,
                        serviceDistance: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-3 border rounded-lg text-sm pr-8 ${
                      isEditing
                        ? "border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <option value="8 km">8 km</option>
                    <option value="16 km">16 km</option>
                    <option value="40 km">40 km</option>
                    <option value="80 km">80 km</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("businessManagement.form.address")}
                </label>
                <input
                  type="text"
                  value={businessData.address}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setBusinessData({
                      ...businessData,
                      address: e.target.value,
                    })
                  }
                  className={`w-full px-4 py-3 border rounded-lg text-sm ${
                    isEditing
                      ? "border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      : "border-gray-200 bg-gray-50"
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("businessManagement.form.description")}
                </label>
                <textarea
                  value={businessData.description}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setBusinessData({
                      ...businessData,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                  maxLength={500}
                  className={`w-full px-4 py-3 border rounded-lg text-sm resize-none ${
                    isEditing
                      ? "border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      : "border-gray-200 bg-gray-50"
                  }`}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {businessData.description.length}/500{" "}
                  {t("businessManagement.form.characters")}
                </p>
              </div>
            </div>
          )}

          {/* Products & Services Section */}
          {activeSection === "products" && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <div className="flex items-center space-x-3 mb-4">
                  <i className="ri-search-line text-blue-600 text-xl"></i>
                  <h3 className="text-lg font-semibold text-blue-800">
                    {t("businessManagement.products.searchKeywords")}
                  </h3>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("businessManagement.products.keywordsLabel")}
                  </label>
                  <textarea
                    value={businessData.productKeywords}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setBusinessData({
                        ...businessData,
                        productKeywords: e.target.value,
                      })
                    }
                    rows={5}
                    className={`w-full px-4 py-3 border rounded-lg text-sm resize-none ${
                      isEditing
                        ? "border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        : "border-gray-200 bg-gray-50"
                    }`}
                    placeholder={t(
                      "businessManagement.products.keywordsPlaceholder"
                    )}
                  />
                  <p className="text-xs text-blue-600 mt-2">
                    <i className="ri-information-line mr-1"></i>
                    {t("businessManagement.products.keywordsHelp")}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-gray-800 mb-3">
                    {t("businessManagement.products.currentKeywords")}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {businessData.productKeywords
                      .split(",")
                      .map((keyword, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {keyword.trim()}
                        </span>
                      ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t("businessManagement.products.servicesOffered")}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableServices.map((service) => (
                    <label
                      key={service}
                      className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={businessData.services.includes(service)}
                        disabled={!isEditing}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setBusinessData({
                              ...businessData,
                              services: [...businessData.services, service],
                            });
                          } else {
                            setBusinessData({
                              ...businessData,
                              services: businessData.services.filter(
                                (s) => s !== service
                              ),
                            });
                          }
                        }}
                        className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                      />
                      <span className="text-sm text-gray-700">{service}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Photos Section */}
          {activeSection === "photos" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  {t("businessManagement.photos.title")}
                </h3>
                {isEditing && (
                  <label className="bg-yellow-400 text-white px-4 py-2 rounded-lg hover:bg-yellow-500 cursor-pointer font-medium text-sm whitespace-nowrap">
                    <i className="ri-add-line mr-2"></i>
                    {t("businessManagement.photos.addPhotos")}
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businessImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Business photo ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                    />
                    {isEditing && (
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <i className="ri-close-line text-sm"></i>
                      </button>
                    )}
                  </div>
                ))}

                {isEditing && (
                  <label className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-yellow-400 hover:bg-yellow-50 transition-colors">
                    <i className="ri-camera-line text-gray-400 text-3xl mb-2"></i>
                    <span className="text-gray-500 text-sm">
                      {t("businessManagement.photos.addMore")}
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          )}

          {/* Working Hours Section */}
          {activeSection === "hours" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">
                {t("businessManagement.hours.title")}
              </h3>

              <div className="space-y-4">
                {Object.entries(businessData.workingHours).map(
                  ([day, hours]) => (
                    <div
                      key={day}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="w-24">
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {t(`businessManagement.days.${day}`)}
                        </span>
                      </div>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={hours.closed}
                          disabled={!isEditing}
                          onChange={(e) =>
                            setBusinessData({
                              ...businessData,
                              workingHours: {
                                ...businessData.workingHours,
                                [day]: { ...hours, closed: e.target.checked },
                              },
                            })
                          }
                          className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400 mr-2"
                        />
                        <span className="text-sm text-gray-600">
                          {t("businessManagement.hours.closed")}
                        </span>
                      </label>

                      {!hours.closed && (
                        <div className="flex items-center space-x-2">
                          <input
                            type="time"
                            value={hours.open}
                            disabled={!isEditing}
                            onChange={(e) =>
                              setBusinessData({
                                ...businessData,
                                workingHours: {
                                  ...businessData.workingHours,
                                  [day]: { ...hours, open: e.target.value },
                                },
                              })
                            }
                            className={`px-3 py-2 border rounded focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm ${
                              isEditing
                                ? "border-gray-300"
                                : "border-gray-200 bg-gray-100"
                            }`}
                          />
                          <span className="text-gray-500">
                            {t("businessManagement.hours.to")}
                          </span>
                          <input
                            type="time"
                            value={hours.close}
                            disabled={!isEditing}
                            onChange={(e) =>
                              setBusinessData({
                                ...businessData,
                                workingHours: {
                                  ...businessData.workingHours,
                                  [day]: { ...hours, close: e.target.value },
                                },
                              })
                            }
                            className={`px-3 py-2 border rounded focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm ${
                              isEditing
                                ? "border-gray-300"
                                : "border-gray-200 bg-gray-100"
                            }`}
                          />
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <i className="ri-information-line text-yellow-600"></i>
              <span className="text-yellow-800 font-medium">
                {t("businessManagement.unsaved.message")}
              </span>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm whitespace-nowrap cursor-pointer"
              >
                {t("businessManagement.unsaved.cancel")}
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium text-sm whitespace-nowrap cursor-pointer"
              >
                <i className="ri-save-line mr-2"></i>
                {t("businessManagement.unsaved.save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
