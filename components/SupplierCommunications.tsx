"use client";

import { useState, useEffect } from "react";
import { apiService } from "../lib/api";
import {
  CommunicationsResponse,
  CommunicationsSummaryResponse,
  SuppliersListResponse,
  Supplier,
} from "../lib/types";
import { useLanguage } from "../lib/LanguageContext";
import { toast } from "react-toastify";
import { getAvatarUrl } from "../lib/avatarHelper";
import defaultAvatar from "../lib/assets/default.png";

export default function SupplierCommunications() {
  const { language, t } = useLanguage();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier1, setSelectedSupplier1] = useState<number | null>(
    null
  );
  const [selectedSupplier2, setSelectedSupplier2] = useState<number | null>(
    null
  );
  const [communications, setCommunications] =
    useState<CommunicationsResponse | null>(null);
  const [summary, setSummary] = useState<CommunicationsSummaryResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCommunications, setShowCommunications] = useState(false);

  // Fetch suppliers from API
  const fetchSuppliers = async () => {
    try {
      setLoadingSuppliers(true);
      const response: SuppliersListResponse = await apiService.getSuppliers({
        page: 1,
        per_page: 1000, // Get all suppliers for selection
      });
      setSuppliers(response.users);
    } catch (error) {
      console.error("Failed to fetch suppliers:", error);
      toast.error(
        language === "ar"
          ? "فشل في جلب قائمة السبلايرين"
          : "Failed to fetch suppliers list"
      );
    } finally {
      setLoadingSuppliers(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.businessName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Suppliers available for selection in each column
  const suppliersForColumn1 = filteredSuppliers.filter(
    (s) => s.id !== selectedSupplier2
  );
  const suppliersForColumn2 = filteredSuppliers.filter(
    (s) => s.id !== selectedSupplier1
  );

  // Check if date is default Unix epoch (1970-01-01)
  const isDefaultDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.getFullYear() === 1970 &&
      date.getMonth() === 0 &&
      date.getDate() === 1
    );
  };

  // Get supplier avatar by image path
  const getSupplierAvatar = (imagePath: string | null | undefined) => {
    if (imagePath && imagePath !== "" && !imagePath.includes("default.png")) {
      return getAvatarUrl(imagePath, "");
    }
    return null;
  };

  const handleSearchCommunications = async () => {
    if (!selectedSupplier1 || !selectedSupplier2) {
      toast.error(
        language === "ar"
          ? "يرجى اختيار سبلايرين"
          : "Please select two suppliers"
      );
      return;
    }

    if (selectedSupplier1 === selectedSupplier2) {
      toast.error(
        language === "ar"
          ? "يرجى اختيار سبلايرين مختلفين"
          : "Please select different suppliers"
      );
      return;
    }

    setLoading(true);
    try {
      const [communicationsData, summaryData] = await Promise.all([
        apiService.getCommunications(selectedSupplier1, selectedSupplier2),
        apiService.getCommunicationsSummary(
          selectedSupplier1,
          selectedSupplier2
        ),
      ]);

      setCommunications(communicationsData);
      setSummary(summaryData);
      setShowCommunications(true);
    } catch (error) {
      console.error("Failed to fetch communications:", error);
      toast.error(
        language === "ar"
          ? "فشل في جلب بيانات التواصل"
          : "Failed to fetch communications data"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(language === "ar" ? "ar-SA" : "en-US");
  };

  const getTypeColor = (type: string) => {
    return type === "inquiry"
      ? "bg-blue-100 text-blue-800"
      : "bg-green-100 text-green-800";
  };

  const getStatusColor = (isRead: boolean) => {
    return isRead
      ? "bg-gray-100 text-gray-800"
      : "bg-yellow-100 text-yellow-800";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          {language === "ar"
            ? "تواصل بين السبلايرين"
            : "Supplier Communications"}
        </h2>
        <p className="text-gray-600">
          {language === "ar"
            ? "اختر سبلايرين لعرض جميع التواصل بينهم"
            : "Select two suppliers to view all communications between them"}
        </p>
      </div>

      {/* Supplier Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Supplier 1 Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === "ar" ? "السبلاير الأول" : "First Supplier"}
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder={
                  language === "ar"
                    ? "ابحث عن سبلاير..."
                    : "Search for supplier..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent"
              />
              <i className="ri-search-line absolute right-3 top-3 text-gray-400"></i>
            </div>
            <div className="mt-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
              {loadingSuppliers ? (
                <div className="p-4 text-center">
                  <i className="ri-loader-4-line animate-spin text-2xl text-red-500"></i>
                  <p className="text-gray-500 mt-2">
                    {language === "ar" ? "جاري التحميل..." : "Loading..."}
                  </p>
                </div>
              ) : (
                suppliersForColumn1.map((supplier) => (
                  <div
                    key={supplier.id}
                    onClick={() => {
                      setSelectedSupplier1(supplier.id);
                      setSearchTerm("");
                    }}
                    className={`p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                      selectedSupplier1 === supplier.id ? "bg-red-50" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {supplier.avatar ? (
                        <img
                          src={getAvatarUrl(supplier.avatar, supplier.name)}
                          alt={supplier.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <img
                          src={getAvatarUrl(null, supplier.name)}
                          alt={supplier.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">
                          {supplier.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {supplier.businessName}
                        </div>
                        <div className="text-xs text-gray-400">
                          {supplier.email}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {selectedSupplier1 && (
              <div className="mt-2 p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {suppliers.find((s) => s.id === selectedSupplier1)?.avatar ? (
                    <img
                      src={getAvatarUrl(
                        suppliers.find((s) => s.id === selectedSupplier1)
                          ?.avatar || null,
                        suppliers.find((s) => s.id === selectedSupplier1)
                          ?.name || ""
                      )}
                      alt={
                        suppliers.find((s) => s.id === selectedSupplier1)?.name
                      }
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <img
                      src={defaultAvatar.src}
                      alt={
                        suppliers.find((s) => s.id === selectedSupplier1)?.name
                      }
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <div className="font-medium text-gray-800">
                      {suppliers.find((s) => s.id === selectedSupplier1)?.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {
                        suppliers.find((s) => s.id === selectedSupplier1)
                          ?.businessName
                      }
                    </div>
                    <div className="text-xs text-gray-400">
                      {suppliers.find((s) => s.id === selectedSupplier1)?.email}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Supplier 2 Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === "ar" ? "السبلاير الثاني" : "Second Supplier"}
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder={
                  language === "ar"
                    ? "ابحث عن سبلاير..."
                    : "Search for supplier..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent"
              />
              <i className="ri-search-line absolute right-3 top-3 text-gray-400"></i>
            </div>
            <div className="mt-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
              {loadingSuppliers ? (
                <div className="p-4 text-center">
                  <i className="ri-loader-4-line animate-spin text-2xl text-red-500"></i>
                  <p className="text-gray-500 mt-2">
                    {language === "ar" ? "جاري التحميل..." : "Loading..."}
                  </p>
                </div>
              ) : (
                suppliersForColumn2.map((supplier) => (
                  <div
                    key={supplier.id}
                    onClick={() => {
                      setSelectedSupplier2(supplier.id);
                      setSearchTerm("");
                    }}
                    className={`p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                      selectedSupplier2 === supplier.id ? "bg-red-50" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {supplier.avatar ? (
                        <img
                          src={getAvatarUrl(supplier.avatar, supplier.name)}
                          alt={supplier.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <img
                          src={getAvatarUrl(null, supplier.name)}
                          alt={supplier.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">
                          {supplier.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {supplier.businessName}
                        </div>
                        <div className="text-xs text-gray-400">
                          {supplier.email}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {selectedSupplier2 && (
              <div className="mt-2 p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {suppliers.find((s) => s.id === selectedSupplier2)?.avatar ? (
                    <img
                      src={getAvatarUrl(
                        suppliers.find((s) => s.id === selectedSupplier2)
                          ?.avatar || null,
                        suppliers.find((s) => s.id === selectedSupplier2)
                          ?.name || ""
                      )}
                      alt={
                        suppliers.find((s) => s.id === selectedSupplier2)?.name
                      }
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <img
                      src={defaultAvatar.src}
                      alt={
                        suppliers.find((s) => s.id === selectedSupplier2)?.name
                      }
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <div className="font-medium text-gray-800">
                      {suppliers.find((s) => s.id === selectedSupplier2)?.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {
                        suppliers.find((s) => s.id === selectedSupplier2)
                          ?.businessName
                      }
                    </div>
                    <div className="text-xs text-gray-400">
                      {suppliers.find((s) => s.id === selectedSupplier2)?.email}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleSearchCommunications}
            disabled={!selectedSupplier1 || !selectedSupplier2 || loading}
            className={`px-6 py-3 rounded-lg font-medium cursor-pointer transition-all ${
              !selectedSupplier1 || !selectedSupplier2 || loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            {loading ? (
              <>
                <i className="ri-loader-4-line animate-spin mr-2"></i>
                {language === "ar" ? "جاري البحث..." : "Searching..."}
              </>
            ) : (
              <>
                <i className="ri-search-line mr-2"></i>
                {language === "ar" ? "عرض التواصل" : "View Communications"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Communications Results */}
      {showCommunications && communications && (
        <div className="space-y-6">
          {/* Summary Card */}
          {summary && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {language === "ar" ? "ملخص التواصل" : "Communication Summary"}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {summary.summary.total_inquiries}
                  </div>
                  <div className="text-sm text-gray-600">
                    {language === "ar" ? "استفسارات" : "Inquiries"}
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {summary.summary.total_messages}
                  </div>
                  <div className="text-sm text-gray-600">
                    {language === "ar" ? "رسائل" : "Messages"}
                  </div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {summary.summary.total_communications}
                  </div>
                  <div className="text-sm text-gray-600">
                    {language === "ar"
                      ? "إجمالي التواصل"
                      : "Total Communications"}
                  </div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-sm font-bold text-orange-600">
                    {isDefaultDate(summary.summary.last_communication_at)
                      ? language === "ar"
                        ? "لا يوجد تواصل"
                        : "No communications yet"
                      : formatDate(summary.summary.last_communication_at)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {language === "ar" ? "آخر تواصل" : "Last Communication"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Communications List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                {language === "ar" ? "سجل التواصل" : "Communication History"}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === "ar" ? "النوع" : "Type"}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === "ar" ? "المرسل" : "Sender"}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === "ar" ? "المستلم" : "Receiver"}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === "ar" ? "الموضوع" : "Subject"}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === "ar" ? "الحالة" : "Status"}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {language === "ar" ? "التاريخ" : "Date"}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {communications.communications.map((comm) => (
                    <tr key={comm.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getTypeColor(
                            comm.type
                          )}`}
                        >
                          {comm.type === "inquiry"
                            ? language === "ar"
                              ? "استفسار"
                              : "Inquiry"
                            : language === "ar"
                            ? "رسالة"
                            : "Message"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {getSupplierAvatar(comm.sender_image) ? (
                            <img
                              src={getSupplierAvatar(comm.sender_image)!}
                              alt={comm.sender_name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <img
                              src={defaultAvatar.src}
                              alt={comm.sender_name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {comm.sender_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {comm.sender_email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {getSupplierAvatar(comm.receiver_image) ? (
                            <img
                              src={getSupplierAvatar(comm.receiver_image)!}
                              alt={comm.receiver_name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <img
                              src={defaultAvatar.src}
                              alt={comm.receiver_name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {comm.receiver_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {comm.receiver_email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 font-medium">
                          {comm.subject}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {comm.message}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                            comm.is_read
                          )}`}
                        >
                          {comm.is_read
                            ? language === "ar"
                              ? "مقروء"
                              : "Read"
                            : language === "ar"
                            ? "غير مقروء"
                            : "Unread"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(comm.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
