"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useLanguage } from "../lib/LanguageContext";
import { apiService } from "../lib/api";
import { type Branch } from "../lib/types";

import LocationPickerModal from "./LocationPickerModal";

const BusinessLocationMap = dynamic(() => import("./BusinessLocationMap"), {
  ssr: false,
});

export interface BranchManagementProps {
  supplierId?: string | number;
  branches?: Branch[];
  setBranches?: React.Dispatch<React.SetStateAction<Branch[]>> | ((branches: Branch[]) => void);
  initialBranches?: Branch[];
  onBranchesChange?: (branches: Branch[]) => void;
  isEditingProfile?: boolean;
  mainBusinessData?: any;
  onSaveBranch?: (branchData: Branch, editingBranch: Branch | null) => Promise<any> | void;
  onDeleteBranch?: (branchId: string) => Promise<any> | void;
  onToggleBranchStatus?: (branchId: string) => Promise<any> | void;
}

export default function BranchManagement({
  supplierId,
  branches: propBranches,
  setBranches: propSetBranches,
  initialBranches = [],
  onBranchesChange,
  isEditingProfile = false,
  onSaveBranch,
  onDeleteBranch,
  onToggleBranchStatus,
}: BranchManagementProps) {
  const { language, isRTL } = useLanguage();
  const [localBranches, setLocalBranches] = useState<Branch[]>(
    propBranches || initialBranches
  );

  const branches = propBranches || localBranches;

  const [hasBranchesAnswer, setHasBranchesAnswer] = useState<"yes" | "no" | null>(
    branches.length > 0 ? "yes" : null
  );

  const [showAddBranch, setShowAddBranch] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [isPickingMapLocation, setIsPickingMapLocation] = useState(false);

  // Form State
  const [branchName, setBranchName] = useState("");
  const [branchAddress, setBranchAddress] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number }>({
    lat: 24.7136,
    lng: 46.6753,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | number | null>(null);
  const [errors, setErrors] = useState<{ name?: string; address?: string }>({});

  useEffect(() => {
    if (propBranches) {
      setLocalBranches(propBranches);
      if (propBranches.length > 0) setHasBranchesAnswer("yes");
    } else if (initialBranches && initialBranches.length > 0) {
      setLocalBranches(initialBranches);
      setHasBranchesAnswer("yes");
    }
  }, [propBranches, initialBranches]);

  // Sync branches up to parent form
  const updateBranchesState = (newBranches: Branch[]) => {
    if (propSetBranches) {
      (propSetBranches as any)(newBranches);
    } else {
      setLocalBranches(newBranches);
    }
    if (onBranchesChange) {
      onBranchesChange(newBranches);
    }
  };

  const handleLocationSelect = (loc: { lat: number; lng: number }) => {
    setSelectedLocation(loc);
  };

  const resetForm = () => {
    setBranchName("");
    setBranchAddress("");
    setSelectedLocation({ lat: 24.7136, lng: 46.6753 });
    setEditingBranch(null);
    setShowAddBranch(false);
    setIsPickingMapLocation(false);
    setErrors({});
  };

  const handleCancelBranch = () => {
    resetForm();
    if (branches.length === 0) {
      setHasBranchesAnswer(null);
    }
  };

  const handleEditBranch = (branch: Branch, openMapDirectly = false) => {
    setEditingBranch(branch);
    setBranchName(branch.name || "");
    setBranchAddress(branch.address || "");
    if (branch.location && Number(branch.location.lat) && Number(branch.location.lng)) {
      setSelectedLocation({
        lat: Number(branch.location.lat),
        lng: Number(branch.location.lng),
      });
    }
    setShowAddBranch(true);
    setIsPickingMapLocation(openMapDirectly);
  };

  const handleSaveBranch = async () => {
    const newErrors: { name?: string; address?: string } = {};
    if (!branchName.trim()) {
      newErrors.name =
        language === "ar" ? "اسم الفرع مطلوب" : "Branch name is required";
    }
    if (!branchAddress.trim()) {
      newErrors.address =
        language === "ar" ? "عنوان الفرع مطلوب" : "Branch address is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    setErrors({});

    try {
      const branchPayload: any = {
        name: branchName.trim(),
        address: branchAddress.trim(),
        location: selectedLocation,
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
      };

      if (onSaveBranch) {
        const payloadToPass: Branch = {
          ...(editingBranch || {}),
          id: editingBranch?.id || "",
          name: branchName.trim(),
          address: branchAddress.trim(),
          location: selectedLocation,
        };
        await onSaveBranch(payloadToPass, editingBranch);
      } else if (!isEditingProfile && apiService.isAuthenticated()) {
        if (editingBranch && editingBranch.id && !String(editingBranch.id).startsWith("temp_")) {
          const res = await apiService.updateBranch(String(editingBranch.id), branchPayload);
          const updated = res.branch || (res as any).data || {
            ...editingBranch,
            name: branchName,
            address: branchAddress,
            location: selectedLocation,
          };
          const nextList = branches.map((b) => (b.id === editingBranch.id ? updated : b));
          updateBranchesState(nextList);
        } else {
          const res = await apiService.createBranch(branchPayload);
          const created = res.branch || (res as any).data || {
            id: `branch_${Date.now()}`,
            name: branchName,
            address: branchAddress,
            location: selectedLocation,
          };
          updateBranchesState([...branches, created]);
        }
      } else {
        // Local form state
        if (editingBranch) {
          const updatedList = branches.map((b) =>
            b.id === editingBranch.id
              ? { ...b, name: branchName, address: branchAddress, location: selectedLocation }
              : b
          );
          updateBranchesState(updatedList);
        } else {
          const newBranch: Branch = {
            id: `temp_${Date.now()}`,
            name: branchName,
            address: branchAddress,
            location: selectedLocation,
          };
          updateBranchesState([...branches, newBranch]);
        }
      }

      resetForm();
    } catch (err) {
      console.error("Failed to save branch:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBranch = async (id: string | number) => {
    try {
      if (onDeleteBranch) {
        await onDeleteBranch(String(id));
      } else if (!isEditingProfile && apiService.isAuthenticated() && !String(id).startsWith("temp_")) {
        await apiService.deleteBranch(String(id));
        const nextList = branches.filter((b) => b.id !== id);
        updateBranchesState(nextList);
      } else {
        const nextList = branches.filter((b) => b.id !== id);
        updateBranchesState(nextList);
      }
      if (branches.length <= 1) {
        setHasBranchesAnswer(null);
      }
    } catch (err) {
      console.error("Failed to delete branch:", err);
    } finally {
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm transition-all">
      {/* HEADER SECTION */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold shadow-sm">
          <i className="ri-git-branch-line text-2xl"></i>
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-bold text-gray-900">
            {language === "ar" ? "الفروع والفروع الإضافية" : "Additional Branches"}
          </h3>
          <p className="text-xs text-gray-500 font-medium">
            {language === "ar"
              ? "هل لديك فروع أخرى لنشاطك التجاري تريد عرضها للعملاء؟"
              : "Do you have additional branch locations for your business?"}
          </p>
        </div>
      </div>

      {/* STEP 1: YES / NO QUESTION */}
      {hasBranchesAnswer === null && (
        <div className="max-w-lg mx-auto text-center py-6">
          <h4 className="text-base font-bold text-gray-800 mb-6">
            {language === "ar"
              ? "هل لديك فروع أخرى؟"
              : "Do you have additional branches?"}
          </h4>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => {
                setHasBranchesAnswer("yes");
                setShowAddBranch(true);
              }}
              className="w-full sm:w-1/2 bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold py-4 px-6 rounded-2xl transition-all shadow-md shadow-amber-400/20 flex items-center justify-center gap-2 text-base cursor-pointer"
            >
              <i className="ri-check-line text-xl font-bold"></i>
              <span>{language === "ar" ? "نعم" : "Yes"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setHasBranchesAnswer("no");
                updateBranchesState([]);
              }}
              className="w-full sm:w-1/2 bg-white hover:bg-gray-100 text-gray-700 font-bold py-4 px-6 rounded-2xl transition-all border border-gray-200 shadow-sm flex items-center justify-center gap-2 text-base cursor-pointer"
            >
              <i className="ri-close-line text-xl font-bold"></i>
              <span>{language === "ar" ? "لا" : "No"}</span>
            </button>
          </div>
        </div>
      )}

      {/* NO BRANCHES SELECTED STATE */}
      {hasBranchesAnswer === "no" && (
        <div className="max-w-lg mx-auto text-center py-8 px-6 bg-gray-50/80 rounded-3xl border border-gray-200/80">
          <div className="w-14 h-14 bg-gray-200/70 text-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <i className="ri-store-2-line text-2xl"></i>
          </div>
          <h4 className="text-base font-bold text-gray-800 mb-1">
            {language === "ar" ? "لا توجد فروع إضافية" : "No Additional Branches"}
          </h4>
          <p className="text-xs text-gray-600 mb-5">
            {language === "ar"
              ? "سيتم الاعتماد على الموقع الرئيسي فقط. يمكنك إضافة فروع جديدة لاحقاً."
              : "Only your main business location will be displayed. You can add branches anytime."}
          </p>
          <button
            type="button"
            onClick={() => setHasBranchesAnswer(null)}
            className="inline-flex items-center gap-2 text-amber-900 font-bold text-xs bg-amber-100 hover:bg-amber-200 px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <i className={isRTL ? "ri-arrow-right-line" : "ri-arrow-left-line"}></i>
            <span>{language === "ar" ? "تغيير الإجابة" : "Change Choice"}</span>
          </button>
        </div>
      )}

      {/* YES BRANCHES STATE */}
      {hasBranchesAnswer === "yes" && (
        <div className="space-y-6">
          {/* BRANCH CARDS DIRECTORY */}
          {branches.length > 0 && !showAddBranch && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {branches.map((branch) => {
                  const hasLoc =
                    branch.location &&
                    Number(branch.location.lat) &&
                    Number(branch.location.lng);

                  return (
                    <div
                      key={branch.id}
                      className="bg-white border border-gray-200 hover:border-amber-300 rounded-2xl p-4 transition-all shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                              <i className="ri-map-pin-2-fill text-lg"></i>
                            </div>
                            <h4 className="font-bold text-gray-900 text-sm line-clamp-1">
                              {branch.name}
                            </h4>
                          </div>

                          {/* Location Status Badge */}
                          {hasLoc && (
                            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                              <i className="ri-checkbox-circle-fill text-emerald-600"></i>
                              <span>{language === "ar" ? "تم تحديد الموقع" : "Location Selected"}</span>
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-100 line-clamp-2 mb-3">
                          {branch.address}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={() => handleEditBranch(branch, false)}
                          className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <i className="ri-edit-line"></i>
                          <span>{language === "ar" ? "تعديل" : "Edit"}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleEditBranch(branch, true)}
                          className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <i className="ri-map-pin-line"></i>
                          <span>{language === "ar" ? "تغيير الموقع" : "Change Location"}</span>
                        </button>

                        {deleteConfirmId === branch.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleDeleteBranch(branch.id)}
                              className="px-3 py-1.5 rounded-xl bg-red-500 text-white text-xs font-bold cursor-pointer"
                            >
                              {language === "ar" ? "تأكيد" : "Confirm"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2 py-1.5 rounded-xl bg-gray-200 text-gray-700 text-xs font-bold cursor-pointer"
                            >
                              <i className="ri-close-line"></i>
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(branch.id)}
                            className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <i className="ri-delete-bin-line"></i>
                            <span>{language === "ar" ? "حذف" : "Delete"}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Branch Button */}
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowAddBranch(true);
                }}
                className="w-full py-3.5 bg-amber-50 hover:bg-amber-100 border-2 border-dashed border-amber-300 text-amber-900 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <i className="ri-add-line text-lg"></i>
                <span>{language === "ar" ? "إضافة فرع آخر" : "Add Another Branch"}</span>
              </button>
            </div>
          )}

          {/* BRANCH FORM CONTAINER (When Adding/Editing) */}
          {(showAddBranch || branches.length === 0) && (
            <div className="bg-gray-50/70 border border-gray-200 rounded-2xl p-5 md:p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <h4 className="font-bold text-gray-900 text-base flex items-center gap-2">
                  <i className={editingBranch ? "ri-edit-line text-amber-600" : "ri-add-circle-line text-amber-600"}></i>
                  <span>
                    {editingBranch
                      ? language === "ar"
                        ? "تعديل الفرع"
                        : "Edit Branch"
                      : language === "ar"
                      ? "إضافة فرع جديد"
                      : "Add New Branch"}
                  </span>
                </h4>

                <button
                  type="button"
                  onClick={handleCancelBranch}
                  className="text-xs font-bold text-gray-500 hover:text-gray-800 bg-white px-3 py-1.5 rounded-xl border border-gray-200 cursor-pointer flex items-center gap-1 transition-colors"
                >
                  <i className="ri-close-line text-sm"></i>
                  <span>{language === "ar" ? "إلغاء" : "Cancel"}</span>
                </button>
              </div>

              {/* 1. Branch Name Input */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  {language === "ar" ? "اسم الفرع *" : "Branch Name *"}
                </label>
                <input
                  type="text"
                  value={branchName}
                  onChange={(e) => {
                    setBranchName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                  }}
                  placeholder={
                    language === "ar"
                      ? "مثال: فرع العليا - الرياض"
                      : "e.g. Olaya Branch - Riyadh"
                  }
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs bg-white outline-none focus:ring-2 focus:ring-amber-400 ${
                    errors.name ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>
                )}
              </div>

              {/* 2. Branch Address Input */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  {language === "ar" ? "عنوان الفرع *" : "Branch Address *"}
                </label>
                <textarea
                  value={branchAddress}
                  onChange={(e) => {
                    setBranchAddress(e.target.value);
                    if (errors.address) setErrors((prev) => ({ ...prev, address: "" }));
                  }}
                  rows={2}
                  placeholder={
                    language === "ar"
                      ? "أدخل عنوان الفرع التفصيلي..."
                      : "Enter detailed branch address..."
                  }
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs bg-white resize-none outline-none focus:ring-2 focus:ring-amber-400 ${
                    errors.address ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1 font-medium">{errors.address}</p>
                )}
              </div>

              {/* 3. Location Picker Summary & Modal Launcher */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  {language === "ar" ? "موقع الفرع على الخريطة *" : "Branch Location on Map *"}
                </label>

                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-sm shrink-0">
                      <i className="ri-checkbox-circle-fill text-xl"></i>
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-emerald-900">
                        {language === "ar" ? "تم تحديد موقع الفرع" : "Branch Location Selected"}
                      </span>
                      <span className="text-xs font-mono text-emerald-700">
                        Lat {selectedLocation.lat.toFixed(5)}, Lng {selectedLocation.lng.toFixed(5)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsPickingMapLocation(true)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-100 text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-2"
                  >
                    <i className="ri-map-pin-2-line text-emerald-600 text-sm"></i>
                    <span>{language === "ar" ? "تحديد / تغيير الموقع على الخريطة" : "Select / Change Location on Map"}</span>
                  </button>
                </div>

                {/* Modal Location Picker */}
                <LocationPickerModal
                  isOpen={isPickingMapLocation}
                  onClose={() => setIsPickingMapLocation(false)}
                  onConfirm={handleLocationSelect}
                  initialLocation={selectedLocation}
                  title={
                    language === "ar"
                      ? `تحديد موقع ${branchName || "الفرع"}`
                      : `Select Location for ${branchName || "Branch"}`
                  }
                />
              </div>

              {/* Form Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancelBranch}
                  className="w-full sm:w-auto px-4 py-2.5 bg-white border border-gray-300 text-gray-700 text-xs font-bold rounded-xl cursor-pointer hover:bg-gray-100 transition-all flex items-center justify-center gap-1.5"
                >
                  <i className="ri-close-line text-sm"></i>
                  <span>{language === "ar" ? "إلغاء" : "Cancel"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveBranch}
                  disabled={isSaving}
                  className="w-full sm:w-auto px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isSaving ? (
                    <i className="ri-loader-4-line animate-spin"></i>
                  ) : (
                    <i className="ri-save-line"></i>
                  )}
                  <span>
                    {editingBranch
                      ? language === "ar"
                        ? "تحديث الفرع"
                        : "Update Branch"
                      : language === "ar"
                      ? "حفظ الفرع"
                      : "Save Branch"}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
