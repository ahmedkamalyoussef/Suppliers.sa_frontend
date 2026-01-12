"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { apiService } from "@/lib/api";
import { toast } from "react-toastify";

interface User {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  plan: string;
}

interface DashboardSettingsProps {
  user: User;
}

export default function DashboardSettings({ user }: DashboardSettingsProps) {
  const { t, language } = useLanguage();
  const [activeSection, setActiveSection] = useState("profile");
  const [settings, setSettings] = useState({
    profile: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      businessName: user.businessName,
      language: "en",
      timezone: "Asia/Riyadh",
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: true,
      newInquiries: true,
      profileViews: false,
      marketingEmails: true,
      weeklyReports: true,
      instantAlerts: true,
    },
    privacy: {
      profileVisibility: "public",
      showEmail: true,
      showPhone: true,
      allowDirectContact: true,
      searchEngineIndexing: true,
    },
    subscription: {
      plan: user.plan,
      billingCycle: "monthly",
      autoRenew: true,
      paymentMethod: "**** 4532",
    },
  });

  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Fetch and set preferences data
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const preferences = await apiService.getPreferences();

        // Update settings with API data
        if (preferences) {
          setSettings((prev) => ({
            ...prev,
            profile: {
              ...prev.profile,
              name: preferences.supplierName || prev.profile.name,
              email: preferences.email || prev.profile.email,
              phone: preferences.phone || prev.profile.phone,
              businessName:
                preferences.businessName || prev.profile.businessName,
            },
            notifications: {
              emailNotifications:
                preferences.preferences?.emailNotifications ??
                prev.notifications.emailNotifications,
              smsNotifications:
                preferences.preferences?.smsNotifications ??
                prev.notifications.smsNotifications,
              newInquiries:
                preferences.preferences?.newInquiriesNotifications ??
                prev.notifications.newInquiries,
              profileViews:
                preferences.preferences?.profileViewsNotifications ??
                prev.notifications.profileViews,
              marketingEmails:
                preferences.preferences?.marketingEmails ??
                prev.notifications.marketingEmails,
              weeklyReports:
                preferences.preferences?.weeklyReports ??
                prev.notifications.weeklyReports,
              instantAlerts: prev.notifications.instantAlerts,
            },
            privacy: {
              profileVisibility:
                preferences.preferences?.profileVisibility ??
                prev.privacy.profileVisibility,
              showEmail:
                preferences.preferences?.showEmailPublicly ??
                prev.privacy.showEmail,
              showPhone:
                preferences.preferences?.showPhonePublicly ??
                prev.privacy.showPhone,
              allowDirectContact:
                preferences.preferences?.allowDirectContact ??
                prev.privacy.allowDirectContact,
              searchEngineIndexing:
                preferences.preferences?.allowSearchEngineIndexing ??
                prev.privacy.searchEngineIndexing,
            },
          }));
        }
      } catch (error) {}
    };

    fetchPreferences();
  }, []);

  const sections = [
    {
      id: "profile",
      name: t("settings.tabs.profile"),
      icon: "ri-user-settings-line",
    },
    {
      id: "notifications",
      name: t("settings.tabs.notifications"),
      icon: "ri-notification-3-line",
    },
    {
      id: "privacy",
      name: t("settings.tabs.privacy"),
      icon: "ri-shield-user-line",
    },
    {
      id: "subscription",
      name: t("settings.tabs.subscription"),
      icon: "ri-vip-crown-line",
    },
  ];

  const plans = [
    // Only show Basic plan if user doesn't have Premium
    ...(user.plan !== "Premium"
      ? [
          {
            name: t("settings.plans.basic.name"),
            price: t("settings.plans.basic.price"),
            features: t("settings.plans.basic.features") || [],
            current: user.plan === "Basic",
          },
        ]
      : []),
    {
      name: t("settings.plans.premium.name"),
      price: (
        <div className="flex items-center justify-center">
          <span>49</span>
          <img
            src="/riyal.svg"
            alt="SAR"
            className="w-4 h-4 inline-block mx-1"
          />
          <span>{language === "ar" ? "/شهرياً" : "/month"}</span>
        </div>
      ),
      features: t("settings.plans.premium.features") || [],
      current: user.plan === "Premium",
    },
    {
      name:
        t("settings.plans.premium.name") +
        " " +
        (language === "ar" ? "(سنوي)" : "(Yearly)"),
      price: (
        <div className="flex items-center justify-center">
          <span>1799</span>
          <img
            src="/riyal.svg"
            alt="SAR"
            className="w-4 h-4 inline-block mx-1"
          />
          <span>{language === "ar" ? "/سنوياً" : "/year"}</span>
        </div>
      ),
      features: t("settings.plans.premium.features") || [],
      current: user.plan === "Premium",
    },
  ];

  const handleSettingChange = (section: string, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value,
      },
    }));
  };

  const handleSaveSettings = async () => {
    try {
      // Prepare the data for the API
      const preferencesData = {
        name: settings.profile.name,
        email: settings.profile.email,
        phone: settings.profile.phone,
        businessName: settings.profile.businessName,
        emailNotifications: settings.notifications.emailNotifications,
        smsNotifications: settings.notifications.smsNotifications,
        newInquiriesNotifications: settings.notifications.newInquiries,
        profileViewsNotifications: settings.notifications.profileViews,
        weeklyReports: settings.notifications.weeklyReports,
        marketingEmails: settings.notifications.marketingEmails,
        profileVisibility: settings.privacy.profileVisibility,
        showEmailPublicly: settings.privacy.showEmail,
        showPhonePublicly: settings.privacy.showPhone,
        allowDirectContact: settings.privacy.allowDirectContact,
        allowSearchEngineIndexing: settings.privacy.searchEngineIndexing,
      };

      // Call the updatePreferences API
      const response = await apiService.updatePreferences(preferencesData);

      // Show success message
      const isArabic = document.documentElement.dir === "rtl";
      toast.success(
        isArabic ? "تم حفظ الإعدادات بنجاح" : "Settings saved successfully"
      );
    } catch (error) {
      // Show error message
      const isArabic = document.documentElement.dir === "rtl";
      toast.error(isArabic ? "فشل حفظ الإعدادات" : "Failed to save settings");
    }
  };

  const handlePasswordChange = async () => {
    const isArabic = document.documentElement.dir === "rtl";

    // Validate passwords match
    if (passwordData.new !== passwordData.confirm) {
      toast.error(
        isArabic ? "كلمة المرور غير متطابقة" : "Passwords do not match"
      );
      return;
    }

    // Validate password length
    if (passwordData.new.length < 6) {
      toast.error(
        isArabic
          ? "يجب أن تكون كلمة المرور 6 أحرف على الأقل"
          : "Password must be at least 6 characters"
      );
      return;
    }

    // Validate current password is provided
    if (!passwordData.current) {
      toast.error(
        isArabic
          ? "الرجاء إدخال كلمة المرور الحالية"
          : "Please enter your current password"
      );
      return;
    }

    try {
      setIsChangingPassword(true);

      await apiService.changePassword(
        passwordData.current,
        passwordData.new,
        passwordData.confirm
      );

      // Reset form on success
      setPasswordData({
        current: "",
        new: "",
        confirm: "",
      });
      setShowPasswordChange(false);

      toast.success(
        isArabic
          ? "تم تغيير كلمة المرور بنجاح"
          : "Password changed successfully"
      );
    } catch (error: any) {
      let errorMessage = isArabic
        ? "حدث خطأ أثناء تغيير كلمة المرور"
        : "An error occurred while changing the password";

      if (error.response) {
        // Handle specific error statuses
        switch (error.response.status) {
          case 401:
            errorMessage = isArabic
              ? "كلمة المرور الحالية غير صحيحة"
              : "Current password is incorrect";
            break;
          case 400:
            errorMessage = isArabic ? "بيانات غير صالحة" : "Invalid data";
            break;
          case 422:
            errorMessage = isArabic
              ? "تأكد من صحة البيانات المدخلة"
              : "Please check your input data";
            break;
          case 500:
            errorMessage = isArabic
              ? "خطأ في الخادم، يرجى المحاولة لاحقاً"
              : "Server error, please try again later";
            break;
          default:
            if (error.response.data?.message) {
              errorMessage = error.response.data.message;
            }
        }
      } else if (error.request) {
        errorMessage = isArabic
          ? "تعذر الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت"
          : "Unable to connect to the server. Please check your internet connection";
      }

      toast.error(errorMessage);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = () => {
    if (confirm(t("settings.messages.deleteConfirm"))) {
      // Delete account implementation
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          {t("settings.title")}
        </h2>
        <button
          onClick={handleSaveSettings}
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 font-medium whitespace-nowrap cursor-pointer"
        >
          <i className="ri-save-line mr-2"></i>
          {t("settings.saveChanges")}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-6 px-6 overflow-x-auto">
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
          {activeSection === "profile" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("settings.profile.fullName")}
                  </label>
                  <input
                    type="text"
                    value={settings.profile.name}
                    onChange={(e) =>
                      handleSettingChange("profile", "name", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("settings.profile.businessName")}
                  </label>
                  <input
                    type="text"
                    value={settings.profile.businessName}
                    onChange={(e) =>
                      handleSettingChange(
                        "profile",
                        "businessName",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("settings.profile.email")}
                  </label>
                  <input
                    type="email"
                    value={settings.profile.email}
                    onChange={(e) =>
                      handleSettingChange("profile", "email", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("settings.profile.phone")}
                  </label>
                  <input
                    type="tel"
                    value={settings.profile.phone}
                    onChange={(e) =>
                      handleSettingChange("profile", "phone", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("settings.profile.language")}
                  </label>
                  <select
                    value={settings.profile.language}
                    onChange={(e) =>
                      handleSettingChange("profile", "language", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm pr-8"
                  >
                    <option value="en">English</option>
                    <option value="ar">العربية</option>
                    <option value="fr">Français</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("settings.profile.timezone")}
                  </label>
                  <select
                    value={settings.profile.timezone}
                    onChange={(e) =>
                      handleSettingChange("profile", "timezone", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm pr-8"
                  >
                    <option value="Asia/Riyadh">Riyadh (GMT+3)</option>
                    <option value="Asia/Dubai">Dubai (GMT+4)</option>
                    <option value="UTC">UTC (GMT+0)</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {t("settings.profile.passwordSecurity")}
                  </h3>
                  <button
                    onClick={() => setShowPasswordChange(!showPasswordChange)}
                    className="text-yellow-600 hover:text-yellow-700 font-medium text-sm cursor-pointer"
                  >
                    {showPasswordChange
                      ? t("settings.profile.cancel")
                      : t("settings.profile.changePassword")}
                  </button>
                </div>

                {showPasswordChange && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("settings.profile.currentPassword")}
                      </label>
                      <input
                        type="password"
                        value={passwordData.current}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            current: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("settings.profile.newPassword")}
                      </label>
                      <input
                        type="password"
                        value={passwordData.new}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            new: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("settings.profile.confirmPassword")}
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirm}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirm: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <div
                        onClick={() => {
                          handlePasswordChange();
                        }}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium text-sm whitespace-nowrap text-center cursor-pointer hover:bg-blue-600"
                        style={{ display: "inline-block" }}
                      >
                        {isChangingPassword
                          ? "جاري الحفظ..."
                          : "تحديث كلمة المرور"}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {t("settings.notifications.deliveryMethods")}
                  </h3>
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.notifications.emailNotifications}
                        onChange={(e) =>
                          handleSettingChange(
                            "notifications",
                            "emailNotifications",
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-700">
                          {t("settings.notifications.emailNotifications")}
                        </span>
                        <p className="text-xs text-gray-500">
                          {t("settings.notifications.emailNotificationsDesc")}
                        </p>
                      </div>
                    </label>

                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.notifications.smsNotifications}
                        onChange={(e) =>
                          handleSettingChange(
                            "notifications",
                            "smsNotifications",
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-700">
                          {t("settings.notifications.smsNotifications")}
                        </span>
                        <p className="text-xs text-gray-500">
                          {t("settings.notifications.smsNotificationsDesc")}
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {t("settings.notifications.notificationTypes")}
                  </h3>
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.notifications.newInquiries}
                        onChange={(e) =>
                          handleSettingChange(
                            "notifications",
                            "newInquiries",
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-700">
                          {t("settings.notifications.newInquiries")}
                        </span>
                        <p className="text-xs text-gray-500">
                          {t("settings.notifications.newInquiriesDesc")}
                        </p>
                      </div>
                    </label>

                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.notifications.profileViews}
                        onChange={(e) =>
                          handleSettingChange(
                            "notifications",
                            "profileViews",
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-700">
                          {t("settings.notifications.profileViews")}
                        </span>
                        <p className="text-xs text-gray-500">
                          {t("settings.notifications.profileViewsDesc")}
                        </p>
                      </div>
                    </label>

                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.notifications.weeklyReports}
                        onChange={(e) =>
                          handleSettingChange(
                            "notifications",
                            "weeklyReports",
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-700">
                          {t("settings.notifications.weeklyReports")}
                        </span>
                        <p className="text-xs text-gray-500">
                          {t("settings.notifications.weeklyReportsDesc")}
                        </p>
                      </div>
                    </label>

                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.notifications.marketingEmails}
                        onChange={(e) =>
                          handleSettingChange(
                            "notifications",
                            "marketingEmails",
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-700">
                          {t("settings.notifications.marketingEmails")}
                        </span>
                        <p className="text-xs text-gray-500">
                          {t("settings.notifications.marketingEmailsDesc")}
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "privacy" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {t("settings.privacy.profileVisibility")}
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="profileVisibility"
                      value="public"
                      checked={settings.privacy.profileVisibility === "public"}
                      onChange={(e) =>
                        handleSettingChange(
                          "privacy",
                          "profileVisibility",
                          e.target.value
                        )
                      }
                      className="w-4 h-4 text-yellow-400 border-gray-300 focus:ring-yellow-400"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        {t("settings.privacy.public")}
                      </span>
                      <p className="text-xs text-gray-500">
                        {t("settings.privacy.publicDesc")}
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="profileVisibility"
                      value="limited"
                      checked={settings.privacy.profileVisibility === "limited"}
                      onChange={(e) =>
                        handleSettingChange(
                          "privacy",
                          "profileVisibility",
                          e.target.value
                        )
                      }
                      className="w-4 h-4 text-yellow-400 border-gray-300 focus:ring-yellow-400"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        {t("settings.privacy.limited")}
                      </span>
                      <p className="text-xs text-gray-500">
                        {t("settings.privacy.limitedDesc")}
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {t("settings.privacy.contactInformation")}
                </h3>
                <div className="space-y-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.privacy.showEmail}
                      onChange={(e) =>
                        handleSettingChange(
                          "privacy",
                          "showEmail",
                          e.target.checked
                        )
                      }
                      className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {t("settings.privacy.showEmail")}
                    </span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.privacy.showPhone}
                      onChange={(e) =>
                        handleSettingChange(
                          "privacy",
                          "showPhone",
                          e.target.checked
                        )
                      }
                      className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {t("settings.privacy.showPhone")}
                    </span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.privacy.allowDirectContact}
                      onChange={(e) =>
                        handleSettingChange(
                          "privacy",
                          "allowDirectContact",
                          e.target.checked
                        )
                      }
                      className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {t("settings.privacy.allowDirectContact")}
                    </span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.privacy.searchEngineIndexing}
                      onChange={(e) =>
                        handleSettingChange(
                          "privacy",
                          "searchEngineIndexing",
                          e.target.checked
                        )
                      }
                      className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {t("settings.privacy.searchEngineIndexing")}
                    </span>
                  </label>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  {t("settings.privacy.dangerZone")}
                </h3>
                <p className="text-sm text-red-700 mb-4">
                  {t("settings.privacy.dangerZoneDesc")}
                </p>
                <button
                  onClick={handleDeleteAccount}
                  className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 font-medium text-sm whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-delete-bin-line mr-2"></i>
                  {t("settings.privacy.deleteAccount")}
                </button>
              </div>
            </div>
          )}

          {activeSection === "subscription" && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {t("settings.subscription.currentPlan")}
                </h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xl font-bold text-gray-800">
                        {settings.subscription.plan}{" "}
                        {t(
                          "settings.plans." +
                            settings.subscription.plan.toLowerCase() +
                            ".name"
                        )}
                      </h4>
                      <p className="text-gray-600">
                        {t("settings.subscription.billedMonthly")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-yellow-600">Free</p>
                      <p className="text-sm text-gray-600">
                        {t("settings.subscription.perMonth")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {t("settings.subscription.availablePlans")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {plans.map((plan, index) => (
                    <div
                      key={index}
                      className={`border-2 rounded-xl p-6 transition-all ${
                        plan.current
                          ? "border-yellow-400 bg-yellow-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-center mb-6">
                        <h4 className="text-lg font-bold text-gray-800 mb-2">
                          {plan.name}
                        </h4>
                        <p className="text-2xl font-bold text-gray-900">
                          {plan.price}
                        </p>
                      </div>

                      <ul className="space-y-2 mb-6">
                        {Array.isArray(plan.features) &&
                          plan.features.map((feature, idx) => (
                            <li
                              key={idx}
                              className="flex items-center space-x-2 text-sm text-gray-600"
                            >
                              <i className="ri-check-line text-green-500"></i>
                              <span>{feature}</span>
                            </li>
                          ))}
                      </ul>

                      <button
                        className={`w-full py-2 px-4 rounded-lg font-medium text-sm whitespace-nowrap cursor-pointer transition-all ${
                          plan.current
                            ? "bg-yellow-400 text-white cursor-default"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                        disabled={plan.current}
                      >
                        {plan.current
                          ? t("settings.subscription.currentPlanButton")
                          : t("settings.subscription.upgradeButton")}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
