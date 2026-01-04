"use client";

import { useRef, useState } from "react";
import type React from "react";
import { useLanguage } from "../lib/LanguageContext";
import type { Branch } from "../lib/types";
type BranchWorkingHoursDay = {
  open: string;
  close: string;
  closed: boolean;
};

type WorkingHours = {
  monday: BranchWorkingHoursDay;
  tuesday: BranchWorkingHoursDay;
  wednesday: BranchWorkingHoursDay;
  thursday: BranchWorkingHoursDay;
  friday: BranchWorkingHoursDay;
  saturday: BranchWorkingHoursDay;
  sunday: BranchWorkingHoursDay;
};

type BranchManagementProps = {
  branches: Branch[];
  setBranches: (branches: Branch[]) => void;
  mainBusinessData: {
    businessName: string;
    category: string;
    businessType?: string;
  };
};

export default function BranchManagement({
  branches,
  setBranches,
  mainBusinessData,
}: BranchManagementProps) {
  const { t } = useLanguage();
  const workingHoursInputRefs = useRef<
    Record<
      string,
      { open?: HTMLInputElement | null; close?: HTMLInputElement | null }
    >
  >({});

  const [showAddBranch, setShowAddBranch] = useState<boolean>(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [newBranch, setNewBranch] = useState<Branch>({
    id: "",
    name: "",
    address: "",
    phone: "",
    email: "",
    manager: "",
    location: { lat: 24.7136, lng: 46.6753 },
    workingHours: {
      monday: { open: "09:00", close: "17:00", closed: false },
      tuesday: { open: "09:00", close: "17:00", closed: false },
      wednesday: { open: "09:00", close: "17:00", closed: false },
      thursday: { open: "09:00", close: "17:00", closed: false },
      friday: { open: "09:00", close: "17:00", closed: false },
      saturday: { open: "10:00", close: "16:00", closed: false },
      sunday: { open: "10:00", close: "16:00", closed: true },
    },
    status: "active",
    specialServices: [],
    isMainBranch: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: 24.7136,
    lng: 46.6753,
  });

  const saudiCities = [
    { name: "Riyadh", lat: 24.7136, lng: 46.6753 },
    { name: "Jeddah", lat: 21.4858, lng: 39.1925 },
    { name: "Mecca", lat: 21.3891, lng: 39.8579 },
    { name: "Medina", lat: 24.5247, lng: 39.5692 },
    { name: "Dammam", lat: 26.4207, lng: 50.0888 },
    { name: "Khobar", lat: 26.2172, lng: 50.1971 },
  ];

  const specialServices = [
    t("branchManagement.services.expressDelivery"),
    t("branchManagement.services.installation"),
    t("branchManagement.services.technicalSupport"),
    t("branchManagement.services.bulkOrders"),
    t("branchManagement.services.emergency"),
    t("branchManagement.services.consultation"),
    t("branchManagement.services.training"),
    t("branchManagement.services.maintenance"),
  ];

  const handleInputChange = (field: keyof Branch, value: any) => {
    setNewBranch((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleLocationSelect = (city: string) => {
    const selectedCity = saudiCities.find((c) => c.name === city);
    if (selectedCity) {
      setSelectedLocation(selectedCity);
      setNewBranch((prev) => ({
        ...prev,
        location: selectedCity,
      }));
    }
  };

  const handleWorkingHoursChange = (
    day: keyof WorkingHours,
    field: keyof BranchWorkingHoursDay,
    value: string | boolean
  ) => {
    setNewBranch((prev) => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day],
          [field]: value,
        },
      },
    }));
  };

  const applyWorkingHoursToAllDays = (sourceDay: keyof WorkingHours) => {
    setNewBranch((prev) => {
      const source = prev.workingHours[sourceDay];
      return {
        ...prev,
        workingHours: (
          Object.keys(prev.workingHours) as Array<keyof WorkingHours>
        ).reduce((acc, day) => {
          acc[day] = { ...source };
          return acc;
        }, {} as WorkingHours),
      };
    });
  };

  const applyWorkingHoursToNextDays = (sourceDay: keyof WorkingHours) => {
    const dayOrder: Array<keyof WorkingHours> = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    setNewBranch((prev) => {
      const source = prev.workingHours[sourceDay];
      const startIndex = dayOrder.indexOf(sourceDay);
      if (startIndex < 0) return prev;

      const next = { ...prev.workingHours };
      for (let i = startIndex + 1; i < dayOrder.length; i++) {
        const d = dayOrder[i];
        next[d] = { ...source };
      }

      return { ...prev, workingHours: next };
    });
  };

  const handleServiceToggle = (service: string) => {
    setNewBranch((prev) => ({
      ...prev,
      specialServices: prev.specialServices.includes(service)
        ? prev.specialServices.filter((s) => s !== service)
        : [...prev.specialServices, service],
    }));
  };

  const validateBranch = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!newBranch.name.trim())
      newErrors.name = t("branchManagement.errors.nameRequired");
    if (!newBranch.address.trim())
      newErrors.address = t("branchManagement.errors.addressRequired");
    if (!newBranch.phone.trim())
      newErrors.phone = t("branchManagement.errors.phoneRequired");
    if (!newBranch.manager.trim())
      newErrors.manager = t("branchManagement.errors.managerRequired");

    const existingBranch = branches.find(
      (b) =>
        b.name.toLowerCase() === newBranch.name.toLowerCase() &&
        b.id !== newBranch.id
    );
    if (existingBranch) {
      newErrors.name = t("branchManagement.errors.nameExists");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveBranch = () => {
    if (!validateBranch()) return;

    const branchData = {
      ...newBranch,
      id: editingBranch ? editingBranch.id : Date.now().toString(),
      location: selectedLocation,
    } as Branch;

    if (editingBranch) {
      const updated = branches.map((b) =>
        b.id === editingBranch.id ? branchData : b
      );
      setBranches(updated);
    } else {
      const updated = [...branches, branchData];
      setBranches(updated);
    }

    handleCancelAdd();
  };

  const handleEditBranch = (branch: Branch) => {
    setEditingBranch(branch);
    setNewBranch({ ...branch });
    setSelectedLocation(branch.location);
    setShowAddBranch(true);
  };

  const handleDeleteBranch = (branchId: string) => {
    if (window.confirm(t("branchManagement.deleteConfirm"))) {
      const updated = branches.filter((b) => b.id !== branchId);
      setBranches(updated);
    }
  };

  const handleCancelAdd = () => {
    setShowAddBranch(false);
    setEditingBranch(null);
    setNewBranch({
      id: "",
      name: "",
      address: "",
      phone: "",
      email: "",
      manager: "",
      location: { lat: 24.7136, lng: 46.6753 },
      workingHours: {
        monday: { open: "09:00", close: "17:00", closed: false },
        tuesday: { open: "09:00", close: "17:00", closed: false },
        wednesday: { open: "09:00", close: "17:00", closed: false },
        thursday: { open: "09:00", close: "17:00", closed: false },
        friday: { open: "09:00", close: "17:00", closed: false },
        saturday: { open: "10:00", close: "16:00", closed: false },
        sunday: { open: "10:00", close: "16:00", closed: true },
      },
      status: "active",
      specialServices: [],
      isMainBranch: false,
    });
    setSelectedLocation({ lat: 24.7136, lng: 46.6753 });
    setErrors({});
  };

  const toggleBranchStatus = (branchId: string) => {
    const updated = branches.map((b) =>
      b.id === branchId
        ? { ...b, status: b.status === "active" ? "inactive" : "active" }
        : b
    );
    setBranches(updated);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {t("branchManagement.title")}
          </h2>
          <p className="text-gray-600">
            {t("branchManagement.subtitle")} {mainBusinessData.businessName}
          </p>
        </div>
        <button
          onClick={() => setShowAddBranch(true)}
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 font-medium whitespace-nowrap cursor-pointer transition-all"
        >
          <i className="ri-add-line mr-2"></i>
          {t("branchManagement.addNewBranch")}
        </button>
      </div>

      {/* Business Overview */}
      <div className="bg-blue-50 p-6 rounded-xl mb-8 border border-blue-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <i className="ri-building-line text-blue-600 text-xl"></i>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-800">
              {mainBusinessData.businessName}
            </h3>
            <p className="text-blue-600 text-sm">
              {mainBusinessData.category} • {mainBusinessData.businessType}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <i className="ri-map-pin-line text-green-500"></i>
              <span className="font-medium text-gray-700">
                {t("branchManagement.totalBranches")}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {branches.length}
            </p>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <i className="ri-check-line text-green-500"></i>
              <span className="font-medium text-gray-700">
                {t("branchManagement.activeBranches")}
              </span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {branches.filter((b) => b.status === "active").length}
            </p>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <i className="ri-pause-line text-orange-500"></i>
              <span className="font-medium text-gray-700">
                {t("branchManagement.inactiveBranches")}
              </span>
            </div>
            <p className="text-2xl font-bold text-orange-600">
              {branches.filter((b) => b.status === "inactive").length}
            </p>
          </div>
        </div>
      </div>

      {/* Branches List */}
      {branches.length > 0 ? (
        <div className="space-y-4 mb-8">
          {branches.map((branch) => (
            <div
              key={branch.id}
              className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      branch.status === "active"
                        ? "bg-green-100"
                        : "bg-gray-100"
                    }`}
                  >
                    <i
                      className={`ri-store-line text-xl ${
                        branch.status === "active"
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    ></i>
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {branch.name}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          branch.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {branch.status === "active"
                          ? t("branchManagement.active")
                          : t("branchManagement.inactive")}
                      </span>
                      {branch.isMainBranch && (
                        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
                          {t("branchManagement.mainBranch")}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <i className="ri-map-pin-line text-gray-400"></i>
                        <span>{branch.address}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <i className="ri-phone-line text-gray-400"></i>
                        <span>{branch.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <i className="ri-user-line text-gray-400"></i>
                        <span>
                          {t("branchManagement.manager")}: {branch.manager}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleBranchStatus(branch.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap cursor-pointer transition-all ${
                      branch.status === "active"
                        ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    <i
                      className={`${
                        branch.status === "active"
                          ? "ri-pause-line"
                          : "ri-play-line"
                      } mr-1`}
                    ></i>
                    {branch.status === "active"
                      ? t("branchManagement.deactivate")
                      : t("branchManagement.activate")}
                  </button>
                  <button
                    onClick={() => handleEditBranch(branch)}
                    className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 text-sm font-medium whitespace-nowrap cursor-pointer transition-all"
                  >
                    <i className="ri-edit-line mr-1"></i>
                    {t("branchManagement.edit")}
                  </button>
                  <button
                    onClick={() => handleDeleteBranch(branch.id)}
                    className="bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 text-sm font-medium whitespace-nowrap cursor-pointer transition-all"
                  >
                    <i className="ri-delete-bin-line mr-1"></i>
                    {t("branchManagement.delete")}
                  </button>
                </div>
              </div>

              {/* Branch Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">
                    {t("branchManagement.workingHours")}
                  </h4>
                  <div className="space-y-1 text-sm">
                    {Object.entries(branch.workingHours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between">
                        <span className="capitalize text-gray-600">
                          {t(`branchManagement.days.${day}`)}:
                        </span>
                        <span className="text-gray-800">
                          {hours.closed
                            ? t("branchManagement.closed")
                            : `${hours.open} - ${hours.close}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {branch.specialServices.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">
                      {t("branchManagement.specialServices")}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {branch.specialServices.map((service) => (
                        <span
                          key={service}
                          className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-store-line text-gray-400 text-2xl"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            {t("branchManagement.noBranches")}
          </h3>
          <p className="text-gray-500 mb-6">
            {t("branchManagement.noBranchesDesc")}
          </p>
          <button
            onClick={() => setShowAddBranch(true)}
            className="bg-yellow-400 text-white px-6 py-3 rounded-lg hover:bg-yellow-500 font-medium whitespace-nowrap cursor-pointer transition-all"
          >
            <i className="ri-add-line mr-2"></i>
            {t("branchManagement.addFirstBranch")}
          </button>
        </div>
      )}

      {/* Add/Edit Branch Modal */}
      {showAddBranch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                {editingBranch
                  ? t("branchManagement.editBranch")
                  : t("branchManagement.addNewBranch")}
              </h3>
              <button
                onClick={handleCancelAdd}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                <i className="ri-close-line"></i>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("branchManagement.form.branchName")} *
                </label>
                <input
                  type="text"
                  value={newBranch.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm ${
                    errors.name ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder={t("branchManagement.form.branchNamePlaceholder")}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("branchManagement.form.branchAddress")} *
                </label>
                <textarea
                  value={newBranch.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm resize-none ${
                    errors.address ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder={t("branchManagement.form.addressPlaceholder")}
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("branchManagement.form.branchPhone")} *
                  </label>
                  <input
                    type="tel"
                    value={newBranch.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm ${
                      errors.phone ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="+966 50 123 4567"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("branchManagement.form.branchEmail")}
                  </label>
                  <input
                    type="email"
                    value={newBranch.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                    placeholder="branch@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("branchManagement.form.branchManager")} *
                </label>
                <input
                  type="text"
                  value={newBranch.manager}
                  onChange={(e) => handleInputChange("manager", e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm ${
                    errors.manager ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder={t("branchManagement.form.managerPlaceholder")}
                />
                {errors.manager && (
                  <p className="text-red-500 text-xs mt-1">{errors.manager}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("branchManagement.form.location")}
                </label>
                <select
                  value={
                    saudiCities.find(
                      (c) =>
                        c.lat === selectedLocation.lat &&
                        c.lng === selectedLocation.lng
                    )?.name || ""
                  }
                  onChange={(e) => handleLocationSelect(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm pr-8"
                >
                  <option value="">
                    {t("branchManagement.form.selectCity")}
                  </option>
                  {saudiCities.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t("branchManagement.form.specialServices")}
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {specialServices.map((service) => (
                    <label
                      key={service}
                      className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all ${
                        newBranch.specialServices.includes(service)
                          ? "border-yellow-400 bg-yellow-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={newBranch.specialServices.includes(service)}
                        onChange={() => handleServiceToggle(service)}
                        className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                      />
                      <span className="text-sm text-gray-700">{service}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location Map Preview */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-3">
                  {t("branchManagement.branchLocation")}
                </h4>
                <div className="relative h-64 bg-gray-200 rounded-lg overflow-hidden">
                  <iframe
                    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2!2d${selectedLocation.lng}!3d${selectedLocation.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${selectedLocation.lat}%2C${selectedLocation.lng}!5e0!3m2!1sen!2sus!4v1645123456789!5m2!1sen!2sus&disableDefaultUI=true&gestureHandling=none&scrollwheel=false&disableDoubleClickZoom=true&clickableIcons=false`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Branch Location Map"
                  ></iframe>

                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Lat: {selectedLocation.lat.toFixed(6)}, Lng:{" "}
                  {selectedLocation.lng.toFixed(6)}
                </p>
              </div>

              {/* Working Hours */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  {t("branchManagement.workingHours")}
                </h4>
                <div className="space-y-4">
                  {Object.keys(newBranch.workingHours).map((day) => {
                    const typedDay = day as keyof WorkingHours;
                    return (
                      <div
                        key={typedDay}
                        className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="w-20">
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {t(`branchManagement.days.${typedDay}`)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              applyWorkingHoursToNextDays(typedDay)
                            }
                            className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-700 hover:bg-white whitespace-nowrap cursor-pointer"
                          >
                            {t("branchManagement.copyToNext")}
                          </button>
                          <button
                            type="button"
                            onClick={() => applyWorkingHoursToAllDays(typedDay)}
                            className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-700 hover:bg-white whitespace-nowrap cursor-pointer"
                          >
                            {t("branchManagement.applyAll")}
                          </button>
                        </div>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={newBranch.workingHours[typedDay].closed}
                            onChange={(e) =>
                              handleWorkingHoursChange(
                                typedDay,
                                "closed",
                                e.target.checked
                              )
                            }
                            className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400 mr-2"
                          />
                          <span className="text-sm text-gray-600">
                            {t("branchManagement.closed")}
                          </span>
                        </label>

                        {!newBranch.workingHours[typedDay].closed && (
                          <div className="flex items-center space-x-2 flex-1">
                            <input
                              type="time"
                              value={newBranch.workingHours[typedDay].open}
                              onChange={(e) =>
                                handleWorkingHoursChange(
                                  typedDay,
                                  "open",
                                  e.target.value
                                )
                              }
                              onKeyDown={(e) => {
                                if (e.key === "ArrowRight") {
                                  e.preventDefault();
                                  workingHoursInputRefs.current[
                                    typedDay
                                  ]?.close?.focus();
                                  return;
                                }
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  const dayOrder: Array<keyof WorkingHours> = [
                                    "monday",
                                    "tuesday",
                                    "wednesday",
                                    "thursday",
                                    "friday",
                                    "saturday",
                                    "sunday",
                                  ];
                                  const idx = dayOrder.indexOf(typedDay);
                                  const nextDay =
                                    idx >= 0 ? dayOrder[idx + 1] : undefined;
                                  if (nextDay) {
                                    workingHoursInputRefs.current[
                                      nextDay
                                    ]?.open?.focus();
                                  }
                                }
                              }}
                              ref={(el) => {
                                workingHoursInputRefs.current[typedDay] = {
                                  ...(workingHoursInputRefs.current[typedDay] ||
                                    {}),
                                  open: el,
                                };
                              }}
                              className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                            />
                            <span className="text-gray-500">
                              {t("branchManagement.to")}
                            </span>
                            <input
                              type="time"
                              value={newBranch.workingHours[typedDay].close}
                              onChange={(e) =>
                                handleWorkingHoursChange(
                                  typedDay,
                                  "close",
                                  e.target.value
                                )
                              }
                              onKeyDown={(e) => {
                                if (e.key === "ArrowLeft") {
                                  e.preventDefault();
                                  workingHoursInputRefs.current[
                                    typedDay
                                  ]?.open?.focus();
                                  return;
                                }
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  const dayOrder: Array<keyof WorkingHours> = [
                                    "monday",
                                    "tuesday",
                                    "wednesday",
                                    "thursday",
                                    "friday",
                                    "saturday",
                                    "sunday",
                                  ];
                                  const idx = dayOrder.indexOf(typedDay);
                                  const nextDay =
                                    idx >= 0 ? dayOrder[idx + 1] : undefined;
                                  if (nextDay) {
                                    workingHoursInputRefs.current[
                                      nextDay
                                    ]?.open?.focus();
                                  }
                                }
                              }}
                              ref={(el) => {
                                workingHoursInputRefs.current[typedDay] = {
                                  ...(workingHoursInputRefs.current[typedDay] ||
                                    {}),
                                  close: el,
                                };
                              }}
                              className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleCancelAdd}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium whitespace-nowrap cursor-pointer transition-all"
              >
                {t("branchManagement.cancel")}
              </button>
              <button
                onClick={handleSaveBranch}
                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 font-medium whitespace-nowrap cursor-pointer transition-all"
              >
                <i className="ri-save-line mr-2"></i>
                {editingBranch
                  ? t("branchManagement.updateBranch")
                  : t("branchManagement.addBranch")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
