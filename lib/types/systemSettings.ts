export interface SystemSettings {
  id: number;
  site_name: string;
  contact_email: string;
  support_email: string;
  site_description: string;
  maintenance_mode: boolean;
  maximum_photos_per_business: number;
  maximum_description_characters: number;
  auto_approve_businesses: boolean;
  business_verification_required: boolean;
  premium_features_enabled: boolean;
  maximum_login_attempts: number;
  session_timeout_minutes: number;
  require_two_factor_authentication: boolean;
  strong_password_required: boolean;
  data_encryption_enabled: boolean;
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  system_alerts: boolean;
  maintenance_notifications: boolean;
  backup_retention_days: number;
  created_at: string;
  updated_at: string;
}

export interface SystemSettingsResponse {
  success: boolean;
  settings: SystemSettings;
}

export interface UpdateSystemSettingsRequest {
  site_name: string;
  contact_email: string;
  support_email: string;
  site_description: string;
  maintenance_mode: boolean;
  maximum_photos_per_business: number;
  maximum_description_characters: number;
  auto_approve_businesses: boolean;
  business_verification_required: boolean;
  premium_features_enabled: boolean;
  maximum_login_attempts: number;
  session_timeout_minutes: number;
  require_two_factor_authentication: boolean;
  strong_password_required: boolean;
  data_encryption_enabled: boolean;
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  system_alerts: boolean;
  maintenance_notifications: boolean;
  backup_retention_days: number;
}

export interface UpdateSystemSettingsResponse {
  success: boolean;
  message: string;
}
