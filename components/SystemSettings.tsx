"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";

export default function SystemSettings() {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [accessDenied, setAccessDenied] = useState<boolean>(false);
  const [permissions, setPermissions] = useState<any>(null);
  const [activeSection, setActiveSection] = useState("general");
  const [systemSettings, setSystemSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [settings, setSettings] = useState({
    general: {
      siteName: "",
      siteDescription: "",
      contactEmail: "",
      supportEmail: "",
      timezone: "Asia/Riyadh",
      language: "en",
      maintenanceMode: false,
    },
    business: {
      autoApproval: false,
      requiredFields: ["name", "email", "phone", "category"],
      maxPhotos: 10,
      maxDescription: 500,
      verificationRequired: true,
      premiumFeaturesEnabled: true,
    },
    payments: {
      currency: "SAR",
      basicPlanPrice: 0,
      premiumPlanPrice: 290,
      enterprisePlanPrice: 990,
      paymentGateway: "stripe",
      taxRate: 15,
      invoicePrefix: "INV-",
    },
    security: {
      twoFactorRequired: false,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordStrengthRequired: true,
      dataEncryption: true,
      backupRetention: 30,
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      marketingEmails: true,
      systemAlerts: true,
      maintenanceNotifications: true,
    },
    api: {
      rateLimit: 1000,
      apiKeysEnabled: true,
      webhooksEnabled: true,
      corsEnabled: true,
      apiVersioning: true,
      documentationUrl: "https://api.businessdirectory.com/docs",
    },
  });

  useEffect(() => {
    // Skip all permission checks for super admin
    if (user?.role === "super_admin") {
      return;
    }

    const fetchPermissions = async () => {
      try {
        const { apiService } = await import("../lib/api");
        const data = await apiService.getPermissions();
        setPermissions(data.permissions);

        // Check if all system permissions are false
        const allSystemPermissionsFalse =
          !data.permissions.system_manage &&
          !data.permissions.system_settings &&
          !data.permissions.system_backups;

        if (allSystemPermissionsFalse) {
          setAccessDenied(true);
        }
      } catch (error) {
        console.error("System Settings - API Error:", error);
      }
    };

    fetchPermissions();
  }, [user?.role]);

  // Permission checking functions
  const hasPermission = (permission: string) => {
    // Super admin has all permissions
    if (user?.role === "super_admin") return true;

    if (!user || !permissions) return false;

    return permissions[permission] === true;
  };

  const canManageSystem =
    user?.role === "super_admin" || hasPermission("system_manage");
  const canManageSettings =
    user?.role === "super_admin" ||
    hasPermission("system_settings") ||
    canManageSystem;
  const canManageBackups =
    user?.role === "super_admin" ||
    hasPermission("system_backups") ||
    canManageSystem;

  useEffect(() => {
    const fetchSystemSettings = async () => {
      try {
        setIsLoading(true);
        const { apiService } = await import("../lib/api");
        const data = await apiService.getSystemSettings();

        // Update state with API data
        if (data.success && data.settings) {
          setSystemSettings(data.settings);

          // Map API data to component settings structure
          setSettings({
            general: {
              siteName: data.settings.site_name || "",
              siteDescription: data.settings.site_description || "",
              contactEmail: data.settings.contact_email || "",
              supportEmail: data.settings.support_email || "",
              timezone: "Asia/Riyadh", // Default since not in API
              language: "en", // Default since not in API
              maintenanceMode: data.settings.maintenance_mode,
            },
            business: {
              autoApproval: data.settings.auto_approve_businesses,
              requiredFields: ["name", "email", "phone", "category"], // Default since not in API
              maxPhotos: data.settings.maximum_photos_per_business,
              maxDescription: data.settings.maximum_description_characters,
              verificationRequired:
                data.settings.business_verification_required,
              premiumFeaturesEnabled: data.settings.premium_features_enabled,
            },
            payments: {
              currency: "SAR", // Default since not in API
              basicPlanPrice: 0, // Default since not in API
              premiumPlanPrice: 290, // Default since not in API
              enterprisePlanPrice: 990, // Default since not in API
              paymentGateway: "stripe", // Default since not in API
              taxRate: 15, // Default since not in API
              invoicePrefix: "INV-", // Default since not in API
            },
            security: {
              twoFactorRequired:
                data.settings.require_two_factor_authentication,
              sessionTimeout: data.settings.session_timeout_minutes,
              maxLoginAttempts: data.settings.maximum_login_attempts,
              passwordStrengthRequired: data.settings.strong_password_required,
              dataEncryption: data.settings.data_encryption_enabled,
              backupRetention: data.settings.backup_retention_days,
            },
            notifications: {
              emailNotifications: data.settings.email_notifications,
              smsNotifications: data.settings.sms_notifications,
              pushNotifications: data.settings.push_notifications,
              marketingEmails: true, // Default since not in API
              systemAlerts: data.settings.system_alerts,
              maintenanceNotifications: data.settings.maintenance_notifications,
            },
            api: {
              rateLimit: 1000, // Default since not in API
              apiKeysEnabled: true, // Default since not in API
              webhooksEnabled: true, // Default since not in API
              corsEnabled: true, // Default since not in API
              apiVersioning: true, // Default since not in API
              documentationUrl: "https://api.businessdirectory.com/docs", // Default since not in API
            },
          });
        }
      } catch (error) {
        console.error("Error fetching system settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (canManageSettings) {
      fetchSystemSettings();
    }
  }, [canManageSettings]);

  // Check if admin has no system permissions at all (after all hooks)
  if (user?.role === "admin" && permissions && 
      !permissions.system_manage && 
      !permissions.system_settings && 
      !permissions.system_backups) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-center">
          <i className="ri-lock-line text-6xl text-gray-300 mb-4"></i>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Access Denied
          </h3>
          <p className="text-gray-500">
            You don't have permission to access System Settings
          </p>
        </div>
      </div>
    );
  }

  // Show loading skeleton while fetching data
  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
            <div className="h-12 w-64 bg-gray-200 rounded mb-8"></div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-4">
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-4">
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show access denied if permissions are false (skip for super admin)
  if (accessDenied && user?.role !== "super_admin") {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-center">
          <i className="ri-lock-line text-6xl text-gray-300 mb-4"></i>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Access Denied
          </h3>
          <p className="text-gray-500">
            You don't have permission to access System Settings
          </p>
        </div>
      </div>
    );
  }

  const sections = [
    {
      id: "general",
      name: t("systemSettings.sections.general"),
      icon: "ri-settings-3-line",
    },
    {
      id: "business",
      name: t("systemSettings.sections.business"),
      icon: "ri-store-line",
    },
    {
      id: "payments",
      name: t("systemSettings.sections.payments"),
      icon: "ri-money-dollar-circle-line",
    },
    {
      id: "security",
      name: t("systemSettings.sections.security"),
      icon: "ri-shield-check-line",
    },
    {
      id: "notifications",
      name: t("systemSettings.sections.notifications"),
      icon: "ri-notification-3-line",
    },
    { id: "api", name: t("systemSettings.sections.api"), icon: "ri-code-line" },
  ];

  const handleSettingChange = (
    section: string,
    key: string,
    value: string | number | boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      [section as keyof typeof prev]: {
        ...prev[section as keyof typeof prev],
        [key]: value,
      },
    }));
  };

  const handleSaveSettings = async () => {
    try {
      const { apiService } = await import("../lib/api");

      // Map component settings to API format
      const apiData = {
        site_name: settings.general.siteName,
        contact_email: settings.general.contactEmail,
        support_email: settings.general.supportEmail,
        site_description: settings.general.siteDescription,
        maintenance_mode: settings.general.maintenanceMode,
        maximum_photos_per_business: settings.business.maxPhotos,
        maximum_description_characters: settings.business.maxDescription,
        auto_approve_businesses: settings.business.autoApproval,
        business_verification_required: settings.business.verificationRequired,
        premium_features_enabled: settings.business.premiumFeaturesEnabled,
        maximum_login_attempts: settings.security.maxLoginAttempts,
        session_timeout_minutes: settings.security.sessionTimeout,
        require_two_factor_authentication: settings.security.twoFactorRequired,
        strong_password_required: settings.security.passwordStrengthRequired,
        data_encryption_enabled: settings.security.dataEncryption,
        email_notifications: settings.notifications.emailNotifications,
        sms_notifications: settings.notifications.smsNotifications,
        push_notifications: settings.notifications.pushNotifications,
        system_alerts: settings.notifications.systemAlerts,
        maintenance_notifications:
          settings.notifications.maintenanceNotifications,
        backup_retention_days: settings.security.backupRetention,
      };

      const response = await apiService.updateSystemSettings(apiData);

      // Show success toast
      if (response.success) {
        toast.success("System settings updated successfully!");
      } else {
        toast.error("Failed to update system settings");
      }
    } catch (error) {
      console.error("Error updating system settings:", error);
      // Show error toast with specific error message if available
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update system settings";
      toast.error(errorMessage);
    }
  };

  const handleSystemBackup = async () => {
    try {
      const { apiService } = await import("../lib/api");
      const response = await apiService.createSystemBackup();
      
      if (response.success) {
        const backupInfo = response.backup 
          ? `Backup created: ${response.backup.filename} (${response.backup.size_formatted})`
          : "System backup created successfully";
        
        toast.success(backupInfo);
      } else {
        toast.error("Failed to create system backup");
      }
    } catch (error) {
      console.error("Error creating system backup:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create system backup";
      toast.error(errorMessage);
    }
  };

  const handleSystemReset = async () => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to restore all system settings to their default values? This action cannot be undone and will affect all system configurations."
    );

    if (!confirmed) {
      return;
    }

    try {
      const { apiService } = await import("../lib/api");
      const response = await apiService.restoreSystemSettings();

      if (response.success) {
        toast.success("System settings restored to defaults successfully!");
        // Refresh the settings data
        const fetchSystemSettings = async () => {
          try {
            setIsLoading(true);
            const data = await apiService.getSystemSettings();

            if (data.success && data.settings) {
              setSystemSettings(data.settings);

              // Map API data to component settings structure
              setSettings({
                general: {
                  siteName: data.settings.site_name || "",
                  siteDescription: data.settings.site_description || "",
                  contactEmail: data.settings.contact_email || "",
                  supportEmail: data.settings.support_email || "",
                  timezone: "Asia/Riyadh",
                  language: "en",
                  maintenanceMode: data.settings.maintenance_mode,
                },
                business: {
                  autoApproval: data.settings.auto_approve_businesses,
                  requiredFields: ["name", "email", "phone", "category"],
                  maxPhotos: data.settings.maximum_photos_per_business,
                  maxDescription: data.settings.maximum_description_characters,
                  verificationRequired:
                    data.settings.business_verification_required,
                  premiumFeaturesEnabled:
                    data.settings.premium_features_enabled,
                },
                payments: {
                  currency: "SAR",
                  basicPlanPrice: 0,
                  premiumPlanPrice: 290,
                  enterprisePlanPrice: 990,
                  paymentGateway: "stripe",
                  taxRate: 15,
                  invoicePrefix: "INV-",
                },
                security: {
                  twoFactorRequired:
                    data.settings.require_two_factor_authentication,
                  sessionTimeout: data.settings.session_timeout_minutes,
                  maxLoginAttempts: data.settings.maximum_login_attempts,
                  passwordStrengthRequired:
                    data.settings.strong_password_required,
                  dataEncryption: data.settings.data_encryption_enabled,
                  backupRetention: data.settings.backup_retention_days,
                },
                notifications: {
                  emailNotifications: data.settings.email_notifications,
                  smsNotifications: data.settings.sms_notifications,
                  pushNotifications: data.settings.push_notifications,
                  marketingEmails: true,
                  systemAlerts: data.settings.system_alerts,
                  maintenanceNotifications:
                    data.settings.maintenance_notifications,
                },
                api: {
                  rateLimit: 1000,
                  apiKeysEnabled: true,
                  webhooksEnabled: true,
                  corsEnabled: true,
                  apiVersioning: true,
                  documentationUrl: "https://api.businessdirectory.com/docs",
                },
              });
            }
          } catch (error) {
            console.error("Error fetching system settings:", error);
          } finally {
            setIsLoading(false);
          }
        };

        fetchSystemSettings();
      } else {
        toast.error("Failed to restore system settings");
      }
    } catch (error) {
      console.error("Error restoring system settings:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to restore system settings";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          {t("systemSettings.title")}
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSystemBackup}
            disabled={!canManageBackups}
            className={`px-4 sm:px-6 py-2 rounded-lg font-medium text-sm whitespace-nowrap ${
              !canManageBackups
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
            }`}
          >
            <i className="ri-backup-line mr-2"></i>
            {t("systemSettings.buttons.createBackup")}
          </button>
          <button
            onClick={handleSaveSettings}
            disabled={!canManageSettings}
            className={`px-4 sm:px-6 py-2 rounded-lg font-medium text-sm whitespace-nowrap ${
              !canManageSettings
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600 cursor-pointer"
            }`}
          >
            <i className="ri-save-line mr-2"></i>
            {t("systemSettings.buttons.saveChanges")}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav className="flex space-x-4 sm:space-x-6 px-4 sm:px-6 min-w-max">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`py-3 sm:py-4 px-2 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap cursor-pointer transition-all ${
                  activeSection === section.id
                    ? "border-red-500 text-red-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <i className={`${section.icon} mr-2`}></i>
                {section.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="p-4 sm:p-6">
          {/* General Settings */}
          {activeSection === "general" && (
            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("systemSettings.general.siteName")}
                  </label>
                  <input
                    type="text"
                    value={settings.general.siteName}
                    onChange={(e) =>
                      handleSettingChange("general", "siteName", e.target.value)
                    }
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("systemSettings.general.contactEmail")}
                  </label>
                  <input
                    type="email"
                    value={settings.general.contactEmail}
                    onChange={(e) =>
                      handleSettingChange(
                        "general",
                        "contactEmail",
                        e.target.value
                      )
                    }
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("systemSettings.general.supportEmail")}
                  </label>
                  <input
                    type="email"
                    value={settings.general.supportEmail}
                    onChange={(e) =>
                      handleSettingChange(
                        "general",
                        "supportEmail",
                        e.target.value
                      )
                    }
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("systemSettings.general.timezone")}
                  </label>
                  <select
                    value={settings.general.timezone}
                    onChange={(e) =>
                      handleSettingChange("general", "timezone", e.target.value)
                    }
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                  >
                    <option value="Asia/Riyadh">Asia/Riyadh (GMT+3)</option>
                    <option value="Asia/Dubai">Asia/Dubai (GMT+4)</option>
                    <option value="UTC">UTC (GMT+0)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("systemSettings.general.siteDescription")}
                </label>
                <textarea
                  value={settings.general.siteDescription}
                  onChange={(e) =>
                    handleSettingChange(
                      "general",
                      "siteDescription",
                      e.target.value
                    )
                  }
                  rows={3}
                  maxLength={500}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {(settings.general.siteDescription || "").length}/500 {" "}
                  {t("systemSettings.general.characters")}
                </p>
              </div>

              <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg border border-yellow-200">
                <label className="flex items-start sm:items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.general.maintenanceMode}
                    onChange={(e) =>
                      handleSettingChange(
                        "general",
                        "maintenanceMode",
                        e.target.checked
                      )
                    }
                    className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-400 mt-1 sm:mt-0 flex-shrink-0"
                  />
                  <div>
                    <span className="font-medium text-gray-800 text-sm sm:text-base">
                      {t("systemSettings.general.maintenanceMode")}
                    </span>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      {t("systemSettings.general.maintenanceDescription")}
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Business Settings */}
          {activeSection === "business" && (
            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("systemSettings.business.maxPhotos")}
                  </label>
                  <input
                    type="number"
                    value={settings.business.maxPhotos}
                    onChange={(e) =>
                      handleSettingChange(
                        "business",
                        "maxPhotos",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("systemSettings.business.maxDescription")}
                  </label>
                  <input
                    type="number"
                    value={settings.business.maxDescription}
                    onChange={(e) =>
                      handleSettingChange(
                        "business",
                        "maxDescription",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <label className="flex items-start sm:items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.business.autoApproval}
                    onChange={(e) =>
                      handleSettingChange(
                        "business",
                        "autoApproval",
                        e.target.checked
                      )
                    }
                    className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-400 mt-1 sm:mt-0 flex-shrink-0"
                  />
                  <div>
                    <span className="font-medium text-gray-800 text-sm sm:text-base">
                      {t("systemSettings.business.autoApproval")}
                    </span>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      {t("systemSettings.business.autoApprovalDescription")}
                    </p>
                  </div>
                </label>

                <label className="flex items-start sm:items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.business.verificationRequired}
                    onChange={(e) =>
                      handleSettingChange(
                        "business",
                        "verificationRequired",
                        e.target.checked
                      )
                    }
                    className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-400 mt-1 sm:mt-0 flex-shrink-0"
                  />
                  <div>
                    <span className="font-medium text-gray-800 text-sm sm:text-base">
                      {t("systemSettings.business.verificationRequired")}
                    </span>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      {t("systemSettings.business.verificationDescription")}
                    </p>
                  </div>
                </label>

                <label className="flex items-start sm:items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.business.premiumFeaturesEnabled}
                    onChange={(e) =>
                      handleSettingChange(
                        "business",
                        "premiumFeaturesEnabled",
                        e.target.checked
                      )
                    }
                    className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-400 mt-1 sm:mt-0 flex-shrink-0"
                  />
                  <div>
                    <span className="font-medium text-gray-800 text-sm sm:text-base">
                      {t("systemSettings.business.premiumFeatures")}
                    </span>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      {t("systemSettings.business.premiumFeaturesDescription")}
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Payment Settings */}
          {activeSection === "payments" && (
            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("systemSettings.payments.basicPlan")}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                      SAR
                    </span>
                    <input
                      type="number"
                      value={settings.payments.basicPlanPrice}
                      onChange={(e) =>
                        handleSettingChange(
                          "payments",
                          "basicPlanPrice",
                          parseFloat(e.target.value)
                        )
                      }
                      className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("systemSettings.payments.premiumPlan")}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                      SAR
                    </span>
                    <input
                      type="number"
                      value={settings.payments.premiumPlanPrice}
                      onChange={(e) =>
                        handleSettingChange(
                          "payments",
                          "premiumPlanPrice",
                          parseFloat(e.target.value)
                        )
                      }
                      className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("systemSettings.payments.enterprisePlan")}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                      SAR
                    </span>
                    <input
                      type="number"
                      value={settings.payments.enterprisePlanPrice}
                      onChange={(e) =>
                        handleSettingChange(
                          "payments",
                          "enterprisePlanPrice",
                          parseFloat(e.target.value)
                        )
                      }
                      className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("systemSettings.payments.taxRate")}
                  </label>
                  <input
                    type="number"
                    value={settings.payments.taxRate}
                    onChange={(e) =>
                      handleSettingChange(
                        "payments",
                        "taxRate",
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("systemSettings.payments.invoicePrefix")}
                  </label>
                  <input
                    type="text"
                    value={settings.payments.invoicePrefix}
                    onChange={(e) =>
                      handleSettingChange(
                        "payments",
                        "invoicePrefix",
                        e.target.value
                      )
                    }
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("systemSettings.payments.paymentGateway")}
                  </label>
                  <select
                    value={settings.payments.paymentGateway}
                    onChange={(e) =>
                      handleSettingChange(
                        "payments",
                        "paymentGateway",
                        e.target.value
                      )
                    }
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                  >
                    <option value="stripe">Stripe</option>
                    <option value="paypal">PayPal</option>
                    <option value="razorpay">Razorpay</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeSection === "security" && (
            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("systemSettings.security.sessionTimeout")}
                  </label>
                  <input
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) =>
                      handleSettingChange(
                        "security",
                        "sessionTimeout",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("systemSettings.security.maxLoginAttempts")}
                  </label>
                  <input
                    type="number"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) =>
                      handleSettingChange(
                        "security",
                        "maxLoginAttempts",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("systemSettings.security.backupRetention")}
                  </label>
                  <input
                    type="number"
                    value={settings.security.backupRetention}
                    onChange={(e) =>
                      handleSettingChange(
                        "security",
                        "backupRetention",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <label className="flex items-start sm:items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.security.twoFactorRequired}
                    onChange={(e) =>
                      handleSettingChange(
                        "security",
                        "twoFactorRequired",
                        e.target.checked
                      )
                    }
                    className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-400 mt-1 sm:mt-0 flex-shrink-0"
                  />
                  <div>
                    <span className="font-medium text-gray-800 text-sm sm:text-base">
                      {t("systemSettings.security.twoFactor")}
                    </span>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      {t("systemSettings.security.twoFactorDescription")}
                    </p>
                  </div>
                </label>

                <label className="flex items-start sm:items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.security.passwordStrengthRequired}
                    onChange={(e) =>
                      handleSettingChange(
                        "security",
                        "passwordStrengthRequired",
                        e.target.checked
                      )
                    }
                    className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-400 mt-1 sm:mt-0 flex-shrink-0"
                  />
                  <div>
                    <span className="font-medium text-gray-800 text-sm sm:text-base">
                      {t("systemSettings.security.strongPassword")}
                    </span>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      {t("systemSettings.security.strongPasswordDescription")}
                    </p>
                  </div>
                </label>

                <label className="flex items-start sm:items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.security.dataEncryption}
                    onChange={(e) =>
                      handleSettingChange(
                        "security",
                        "dataEncryption",
                        e.target.checked
                      )
                    }
                    className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-400 mt-1 sm:mt-0 flex-shrink-0"
                  />
                  <div>
                    <span className="font-medium text-gray-800 text-sm sm:text-base">
                      {t("systemSettings.security.dataEncryption")}
                    </span>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      {t("systemSettings.security.dataEncryptionDescription")}
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeSection === "notifications" && (
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-3 sm:space-y-4">
                <label className="flex items-start sm:items-center space-x-3">
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
                    className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-400 mt-1 sm:mt-0 flex-shrink-0"
                  />
                  <div>
                    <span className="font-medium text-gray-800 text-sm sm:text-base">
                      {t("systemSettings.notifications.email")}
                    </span>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      {t("systemSettings.notifications.emailDescription")}
                    </p>
                  </div>
                </label>

                <label className="flex items-start sm:items-center space-x-3">
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
                    className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-400 mt-1 sm:mt-0 flex-shrink-0"
                  />
                  <div>
                    <span className="font-medium text-gray-800 text-sm sm:text-base">
                      {t("systemSettings.notifications.sms")}
                    </span>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      {t("systemSettings.notifications.smsDescription")}
                    </p>
                  </div>
                </label>

                <label className="flex items-start sm:items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.notifications.pushNotifications}
                    onChange={(e) =>
                      handleSettingChange(
                        "notifications",
                        "pushNotifications",
                        e.target.checked
                      )
                    }
                    className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-400 mt-1 sm:mt-0 flex-shrink-0"
                  />
                  <div>
                    <span className="font-medium text-gray-800 text-sm sm:text-base">
                      {t("systemSettings.notifications.push")}
                    </span>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      {t("systemSettings.notifications.pushDescription")}
                    </p>
                  </div>
                </label>

                <label className="flex items-start sm:items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.notifications.systemAlerts}
                    onChange={(e) =>
                      handleSettingChange(
                        "notifications",
                        "systemAlerts",
                        e.target.checked
                      )
                    }
                    className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-400 mt-1 sm:mt-0 flex-shrink-0"
                  />
                  <div>
                    <span className="font-medium text-gray-800 text-sm sm:text-base">
                      {t("systemSettings.notifications.systemAlerts")}
                    </span>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      {t(
                        "systemSettings.notifications.systemAlertsDescription"
                      )}
                    </p>
                  </div>
                </label>

                <label className="flex items-start sm:items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.notifications.maintenanceNotifications}
                    onChange={(e) =>
                      handleSettingChange(
                        "notifications",
                        "maintenanceNotifications",
                        e.target.checked
                      )
                    }
                    className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-400 mt-1 sm:mt-0 flex-shrink-0"
                  />
                  <div>
                    <span className="font-medium text-gray-800 text-sm sm:text-base">
                      {t("systemSettings.notifications.maintenance")}
                    </span>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      {t("systemSettings.notifications.maintenanceDescription")}
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* API Settings */}
          {activeSection === "api" && (
            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("systemSettings.api.rateLimit")}
                  </label>
                  <input
                    type="number"
                    value={settings.api.rateLimit}
                    onChange={(e) =>
                      handleSettingChange(
                        "api",
                        "rateLimit",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("systemSettings.api.documentationUrl")}
                  </label>
                  <input
                    type="url"
                    value={settings.api.documentationUrl}
                    onChange={(e) =>
                      handleSettingChange(
                        "api",
                        "documentationUrl",
                        e.target.value
                      )
                    }
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <label className="flex items-start sm:items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.api.apiKeysEnabled}
                    onChange={(e) =>
                      handleSettingChange(
                        "api",
                        "apiKeysEnabled",
                        e.target.checked
                      )
                    }
                    className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-400 mt-1 sm:mt-0 flex-shrink-0"
                  />
                  <div>
                    <span className="font-medium text-gray-800 text-sm sm:text-base">
                      {t("systemSettings.api.apiKeys")}
                    </span>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      {t("systemSettings.api.apiKeysDescription")}
                    </p>
                  </div>
                </label>

                <label className="flex items-start sm:items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.api.webhooksEnabled}
                    onChange={(e) =>
                      handleSettingChange(
                        "api",
                        "webhooksEnabled",
                        e.target.checked
                      )
                    }
                    className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-400 mt-1 sm:mt-0 flex-shrink-0"
                  />
                  <div>
                    <span className="font-medium text-gray-800 text-sm sm:text-base">
                      {t("systemSettings.api.webhooks")}
                    </span>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      {t("systemSettings.api.webhooksDescription")}
                    </p>
                  </div>
                </label>

                <label className="flex items-start sm:items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.api.corsEnabled}
                    onChange={(e) =>
                      handleSettingChange(
                        "api",
                        "corsEnabled",
                        e.target.checked
                      )
                    }
                    className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-400 mt-1 sm:mt-0 flex-shrink-0"
                  />
                  <div>
                    <span className="font-medium text-gray-800 text-sm sm:text-base">
                      {t("systemSettings.api.cors")}
                    </span>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      {t("systemSettings.api.corsDescription")}
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-red-800 mb-3 sm:mb-4">
          {t("systemSettings.dangerZone.title")}
        </h3>
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div className="flex-1">
              <h4 className="font-medium text-red-800 text-sm sm:text-base">
                {t("systemSettings.dangerZone.resetTitle")}
              </h4>
              <p className="text-xs sm:text-sm text-red-700 mt-1">
                {t("systemSettings.dangerZone.resetDescription")}
              </p>
            </div>
            <button
              onClick={handleSystemReset}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-medium text-sm whitespace-nowrap cursor-pointer w-full sm:w-auto"
            >
              <i className="ri-restart-line mr-2"></i>
              {t("systemSettings.dangerZone.resetButton")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
