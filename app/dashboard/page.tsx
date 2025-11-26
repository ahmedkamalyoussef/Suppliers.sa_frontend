"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import DashboardStats from "../../components/DashboardStats";
import BusinessManagement from "../../components/BusinessManagement";
import DashboardAnalytics from "../../components/DashboardAnalytics";
import DashboardMessages from "../../components/DashboardMessages";
import DashboardSettings from "../../components/DashboardSettings";
import { apiService } from "../../lib/api";

interface User {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  businessId: string;
  memberSince: string;
  plan: string;
  avatar: string;
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(
    null
  );
  const [showProfileCustomization, setShowProfileCustomization] =
    useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>(
    "https://readdy.ai/api/search-image?query=Professional%20middle%20eastern%20businessman%20portrait%2C%20clean%20background%2C%20modern%20business%20attire%2C%20confident%20smile%2C%20professional%20headshot%20style&width=100&height=100&seq=user-avatar&orientation=squarish"
  );
  const [pendingAvatarPreview, setPendingAvatarPreview] = useState<
    string | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    phone: string;
    businessName: string;
    businessId: string;
    memberSince: string;
    plan: string;
    avatar: string;
  } | null>(null);

  useEffect(() => {
    // Fetch user data from localStorage or API
    const fetchUserData = async () => {
      try {
        const userData = localStorage.getItem("supplier_user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          
          // Fetch the latest profile picture
          let profileImage = parsedUser.profileImage || "/images/default-avatar.png";
          try {
            const { profile_image } = await apiService.getProfilePicture(parsedUser.id);
            if (profile_image) {
              profileImage = profile_image;
            }
          } catch (error) {
            console.error("Error fetching profile picture:", error);
            // Fallback to the existing image if there's an error
          }
          
          setUser({
            id: parsedUser.id?.toString() || "",
            name: parsedUser.name || "User",
            email: parsedUser.email || "",
            phone: parsedUser.phone || "",
            businessName: parsedUser.profile?.businessName || parsedUser.name || "Business",
            businessId: parsedUser.slug || parsedUser.id?.toString() || "",
            memberSince: parsedUser.emailVerifiedAt
              ? new Date(parsedUser.emailVerifiedAt).toLocaleDateString()
              : "N/A",
            plan: parsedUser.plan || "Basic",
            avatar: profileImage,
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const tab = searchParams?.get("tab");
    const messageId = searchParams?.get("messageId");

    if (tab) setActiveTab(tab);
    if (messageId) {
      const parsed = parseInt(messageId, 10);
      if (!isNaN(parsed)) setSelectedMessageId(parsed);
    }

    const savedTheme =
      typeof window !== "undefined"
        ? localStorage.getItem("dashboardTheme")
        : null;
    if (savedTheme) setSelectedTheme(savedTheme);

    const savedAvatar =
      typeof window !== "undefined"
        ? localStorage.getItem("dashboardAvatar")
        : null;
    if (savedAvatar) setAvatarUrl(savedAvatar);
  }, [searchParams]);

  const tabs = [
    { id: "overview", name: "Overview", icon: "ri-dashboard-line" },
    { id: "business", name: "Business Profile", icon: "ri-store-line" },
    { id: "analytics", name: "Analytics", icon: "ri-bar-chart-line" },
    { id: "messages", name: "Messages", icon: "ri-message-line" },
    { id: "settings", name: "Settings", icon: "ri-settings-line" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="py-6 flex-grow">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Profile Header */}
            <div
              className={`relative rounded-2xl shadow-sm p-6 sm:p-8 border border-gray-100 overflow-hidden ${
                selectedTheme === "Professional Blue"
                  ? "bg-gradient-to-r from-blue-50 to-blue-100"
                  : selectedTheme === "Golden Success"
                  ? "bg-gradient-to-r from-yellow-50 to-yellow-100"
                  : selectedTheme === "Tech Green"
                  ? "bg-gradient-to-r from-green-50 to-green-100"
                  : selectedTheme === "Royal Purple"
                  ? "bg-gradient-to-r from-purple-50 to-purple-100"
                  : "bg-white"
              }`}
            >
              {/* <div className="absolute inset-0 opacity-10">
                <img
                  src="https://readdy.ai/api/search-image?query=Professional%20business%20background%20pattern%20with%20geometric%20shapes%2C%20modern%20corporate%20design%2C%20subtle%20gradient%20overlay%2C%20clean%20minimalist%20style%2C%20blue%20and%20yellow%20color%20scheme&width=800&height=200&seq=profile-bg&orientation=landscape"
                  alt="Profile Background"
                  className="w-full h-full object-cover"
                />
              </div> */}

              {/* Customization Buttons */}
              <div className="absolute top-1 end-4 flex space-x-2 rtl:space-x-reverse">
                <button
                  onClick={() => setShowProfileCustomization(true)}
                  className="bg-white/90 backdrop-blur-sm text-gray-600 p-2 rounded-lg hover:bg-white shadow-sm cursor-pointer"
                  title="Customize Profile"
                >
                  <i className="ri-palette-line text-lg"></i>
                </button>
                <button
                  onClick={() => setShowPhotoUpload(true)}
                  className="bg-white/90 backdrop-blur-sm text-gray-600 p-2 rounded-lg hover:bg-white shadow-sm cursor-pointer"
                  title="Change Profile Photo"
                >
                  <i className="ri-camera-line text-lg"></i>
                </button>
              </div>

              <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-4 sm:space-y-0">
                  <div className="relative flex-shrink-0">
                    <img
                      alt={user?.name || "User"}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-yellow-100 shadow-lg"
                      src={user?.avatar||avatarUrl}
                    />
                    <button
                      onClick={() => setShowPhotoUpload(true)}
                      className="absolute bottom-0 right-0 bg-yellow-400 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-yellow-500 cursor-pointer"
                    >
                      <i className="ri-camera-line text-xs"></i>
                    </button>
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">
                      {user ? `Welcome back, ${user.name}` : "Loading..."}
                    </h1>
                    <p className="text-gray-600 mb-2">
                      {user?.businessName || "Loading..."}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <i className="ri-calendar-line mr-1"></i>
                        {user
                          ? `Member since ${user.memberSince}`
                          : "Loading..."}
                      </span>
                      <span className="flex items-center">
                        <i className="ri-vip-crown-line mr-1 text-yellow-500"></i>
                        {user ? `${user.plan} Plan` : "Loading..."}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-start md:justify-end">
                  <Link
                    href={user ? `/profile/${user.id}` : "#"}
                    className={`border border-gray-300 text-gray-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-gray-50 font-medium flex items-center ${
                      !user ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <i className="ri-eye-line mr-2"></i>
                    View Public Profile
                  </Link>
                </div>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="overflow-x-auto">
                <div className="flex space-x-4 md:space-x-8 px-2 md:px-6 border-b border-gray-200">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-3 px-2 md:px-4 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer transition-all ${
                        activeTab === tab.id
                          ? "border-yellow-400 text-yellow-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <i className={`${tab.icon} mr-2`}></i>
                      {tab.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-4 sm:p-6">
                {activeTab === "overview" && <DashboardStats />}
                {activeTab === "business" && <BusinessManagement />}
                {activeTab === "analytics" && <DashboardAnalytics />}
                {activeTab === "messages" && (
                  <DashboardMessages selectedMessageId={selectedMessageId} />
                )}
                {activeTab === "settings" && user && (
                  <DashboardSettings user={user} />
                )}
              </div>
            </div>

            {/* Profile Customization Modal */}
            {showProfileCustomization && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50">
                <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white">
                  <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Customize Your Profile
                    </h2>
                    <button
                      onClick={() => setShowProfileCustomization(false)}
                      className="text-gray-400 hover:text-gray-600 text-2xl cursor-pointer"
                    >
                      <i className="ri-close-line"></i>
                    </button>
                  </div>
                  <div className="p-6 space-y-8">
                    {/* Theme Selection */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Choose Theme
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                          {
                            name: "Professional Blue",
                            preview:
                              "https://readdy.ai/api/search-image?query=Professional%20business%20background%20with%20blue%20gradient%2C%20corporate%20design%2C%20clean%20modern%20style%2C%20geometric%20patterns%2C%20business%20theme&width=300&height=150&seq=theme-blue&orientation=landscape",
                          },
                          {
                            name: "Golden Success",
                            preview:
                              "https://readdy.ai/api/search-image?query=Elegant%20golden%20business%20background%2C%20luxury%20corporate%20design%2C%20warm%20professional%20atmosphere%2C%20success%20theme%2C%20modern%20gradient&width=300&height=150&seq=theme-gold&orientation=landscape",
                          },
                          {
                            name: "Tech Green",
                            preview:
                              "https://readdy.ai/api/search-image?query=Modern%20technology%20background%20with%20green%20theme%2C%20digital%20corporate%20design%2C%20innovation%20pattern%2C%20tech%20business%20style&width=300&height=150&seq=theme-green&orientation=landscape",
                          },
                          {
                            name: "Royal Purple",
                            preview:
                              "https://readdy.ai/api/search-image?query=Royal%20purple%20business%20background&width=300&height=150&seq=theme-purple&orientation=landscape",
                          },
                        ].map((theme) => (
                          <button
                            key={theme.name}
                            onClick={() => {
                              setSelectedTheme(theme.name);
                              if (typeof window !== "undefined") {
                                localStorage.setItem(
                                  "dashboardTheme",
                                  theme.name
                                );
                              }
                            }}
                            className={`border rounded-lg p-2 text-left hover:shadow-md ${
                              selectedTheme === theme.name
                                ? "border-yellow-500 ring-2 ring-yellow-200"
                                : "border-gray-200"
                            }`}
                          >
                            <img
                              src={theme.preview}
                              alt={theme.name}
                              className="w-full h-24 object-cover rounded mb-2"
                            />
                            <div className="font-medium">{theme.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Save Button */}
                    <div className="flex justify-end">
                      <button
                        onClick={() => setShowProfileCustomization(false)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Photo Upload Modal */}
            {showPhotoUpload && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50 ">
                <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white">
                  <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800">
                      Change Profile Photo
                    </h2>
                    <button
                      onClick={() => {
                        setShowPhotoUpload(false);
                        setPendingAvatarPreview(null);
                      }}
                      className="text-gray-400 hover:text-gray-600 text-2xl cursor-pointer"
                    >
                      <i className="ri-close-line"></i>
                    </button>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
                      <div className="relative">
                        <img
                          src={pendingAvatarPreview || user?.avatar || avatarUrl}
                          alt="Avatar Preview"
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-yellow-100 shadow"
                        />
                        
                      </div>
                      <div className="flex-1">
                        <label className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded cursor-pointer">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;

                              // Validate file type
                              if (!file.type.startsWith("image/")) {
                                alert("يُسمح بملفات الصور فقط");
                                return;
                              }

                              // Validate file size (5MB max)
                              if (file.size > 5 * 1024 * 1024) {
                                alert("حجم الملف يجب أن لا يتجاوز 5 ميجابايت");
                                return;
                              }

                              // Show preview immediately
                              const objectUrl = URL.createObjectURL(file);
                              setPendingAvatarPreview(objectUrl);
                              
                              // Also read as data URL for potential upload
                              const reader = new FileReader();
                              reader.onload = () => {
                                if (typeof reader.result === "string") {
                                  // Keep the object URL for preview, but we have the data URL if needed
                                }
                                // Clean up the object URL to avoid memory leaks
                                URL.revokeObjectURL(objectUrl);
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                          Choose Photo
                        </label>
                        <p className="text-xs text-gray-500 mt-1">
                          JPG or PNG, max ~5MB
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 pt-2">
                      <button
                        onClick={() => {
                          setShowPhotoUpload(false);
                          setPendingAvatarPreview(null);
                        }}
                        className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={async () => {
                          if (
                            !pendingAvatarPreview ||
                            !fileInputRef.current?.files?.[0]
                          ) {
                            alert("الرجاء اختيار صورة أولاً");
                            return;
                          }

                          const file = fileInputRef.current.files[0];

                          try {
                            setIsUploading(true);

                            // Update UI optimistically
                            const previewUrl = URL.createObjectURL(file);
                            setAvatarUrl(previewUrl);

                            // Upload the image
                            const result = await apiService.uploadProfileImage(
                              file
                            );

                            // If we get here, the upload was successful
                            if (typeof window !== "undefined") {
                              localStorage.setItem(
                                "dashboardAvatar",
                                previewUrl
                              );
                              
                              // Fetch the latest profile picture from the API
                              try {
                                const userData = localStorage.getItem("supplier_user");
                                if (userData) {
                                  const parsedUser = JSON.parse(userData);
                                  const { profile_image } = await apiService.getProfilePicture(parsedUser.id);
                                  if (profile_image) {
                                    setAvatarUrl(profile_image);
                                    localStorage.setItem("dashboardAvatar", profile_image);
                                    
                                    // Update user avatar in the UI
                                    setUser(prev => prev ? {
                                      ...prev,
                                      avatar: profile_image
                                    } : null);
                                  }
                                }
                              } catch (error) {
                                console.error("Error refreshing profile picture:", error);
                                // Continue with the preview URL if there's an error
                                setAvatarUrl(previewUrl);
                              }
                            }

                            // Don't show success message to avoid interrupting the user
                            // The UI is already updated with the new image
                          } catch (error: unknown) {
                            // Revert the UI on error
                            if (typeof window !== "undefined") {
                              const savedAvatar =
                                localStorage.getItem("dashboardAvatar");
                              if (savedAvatar) {
                                setAvatarUrl(savedAvatar);
                              }
                            }

                            // Show error message
                            const errorMessage =
                              error instanceof Error
                                ? error.message
                                : "حدث خطأ أثناء رفع الصورة";
                            alert(errorMessage);

                            console.error("Error uploading image:", error);
                          } finally {
                            setIsUploading(false);
                            setShowPhotoUpload(false);
                            setPendingAvatarPreview(null);

                            // Reset file input
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }
                          }
                        }}
                        className="px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!pendingAvatarPreview || isUploading}
                      >
                        {isUploading ? "جاري الحفظ..." : "حفظ"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default DashboardContent;
