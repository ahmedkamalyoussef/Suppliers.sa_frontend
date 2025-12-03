export interface PermissionsResponse {
  permissions: {
    user_management_view: boolean;
    user_management_edit: boolean;
    user_management_delete: boolean;
    user_management_full: boolean;
    content_management_view: boolean;
    content_management_supervise: boolean;
    content_management_delete: boolean;
    analytics_view: boolean;
    analytics_export: boolean;
    reports_view: boolean;
    reports_create: boolean;
    system_manage: boolean;
    system_settings: boolean;
    system_backups: boolean;
    support_manage: boolean;
  };
}
