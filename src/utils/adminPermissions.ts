// /home/project/src/utils/adminPermissions.ts
export const ADMIN_PERMISSIONS = {
  // User Management
  USER_VIEW: 'user_view',
  USER_EDIT: 'user_edit',
  USER_DELETE: 'user_delete',
  USER_CREATE: 'user_create',
  
  // Content Management
  CONTENT_VIEW: 'content_view',
  CONTENT_EDIT: 'content_edit',
  CONTENT_APPROVE: 'content_approve',
  CONTENT_DELETE: 'content_delete',
  
  // System Management
  SYSTEM_BACKUP: 'system_backup',
  SYSTEM_SETTINGS: 'system_settings',
  SYSTEM_LOGS: 'system_logs',
  
  // Super Admin Only
  ADMIN_MANAGE: 'admin_manage',
  SYSTEM_EMERGENCY: 'system_emergency',
  DATABASE_ACCESS: 'database_access',
} as const;

export type AdminPermission = typeof ADMIN_PERMISSIONS[keyof typeof ADMIN_PERMISSIONS];

export const PERMISSION_GROUPS = {
  CONTENT_MANAGER: [
    ADMIN_PERMISSIONS.CONTENT_VIEW,
    ADMIN_PERMISSIONS.CONTENT_EDIT,
    ADMIN_PERMISSIONS.CONTENT_APPROVE,
  ],
  USER_MANAGER: [
    ADMIN_PERMISSIONS.USER_VIEW,
    ADMIN_PERMISSIONS.USER_EDIT,
  ],
  SUPER_ADMIN: Object.values(ADMIN_PERMISSIONS),
};