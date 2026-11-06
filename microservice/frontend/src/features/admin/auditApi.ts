export interface AuditLogEntry {
  id: string;
  timestamp: string;
  username: string;
  userRole: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'STOCK_ADJUST' | 'STATUS_CHANGE' | 'FEATURE_TOGGLE';
  module: 'CATALOG' | 'INVENTORY' | 'ORDERS' | 'HOMEPAGE' | 'COUPONS' | 'FEATURES' | 'SECURITY';
  entityId: string;
  description: string;
  ipAddress?: string;
}

export interface RolePermission {
  role: string;
  label: string;
  description: string;
  permissions: {
    canManageProducts: boolean;
    canAdjustStock: boolean;
    canManageOrders: boolean;
    canEditBanners: boolean;
    canToggleFeatures: boolean;
    canIssueRefunds: boolean;
    canManageUsers: boolean;
  };
}

const STORAGE_KEY_AUDIT = 'khandualoom_audit_logs';

export const initialAuditLogs: AuditLogEntry[] = [
  {
    id: 'aud-1092',
    timestamp: '2026-11-06 18:30:15',
    username: 'superadmin@khandualoom.com',
    userRole: 'ROLE_SUPER_ADMIN',
    action: 'STATUS_CHANGE',
    module: 'ORDERS',
    entityId: '#KHL-1002',
    description: 'Transitioned order status from QUALITY_CHECK to SHIPPED (BlueDart tracking BD-892103)',
    ipAddress: '192.168.1.42',
  },
  {
    id: 'aud-1091',
    timestamp: '2026-11-06 17:45:00',
    username: 'inventory@khandualoom.com',
    userRole: 'ROLE_INVENTORY_MANAGER',
    action: 'STOCK_ADJUST',
    module: 'INVENTORY',
    entityId: 'KHL-KHD-001',
    description: 'Manual stock adjustment (+2 units) after receipt from Nuapatna cluster',
    ipAddress: '192.168.1.55',
  },
  {
    id: 'aud-1090',
    timestamp: '2026-11-06 16:12:33',
    username: 'superadmin@khandualoom.com',
    userRole: 'ROLE_SUPER_ADMIN',
    action: 'FEATURE_TOGGLE',
    module: 'FEATURES',
    entityId: 'threeDSheenCanvas',
    description: 'Set feature threeDSheenCanvas state to ENABLED (published to production)',
    ipAddress: '192.168.1.42',
  },
  {
    id: 'aud-1089',
    timestamp: '2026-11-06 15:00:22',
    username: 'catalog@khandualoom.com',
    userRole: 'ROLE_CATALOG_MANAGER',
    action: 'CREATE',
    module: 'COUPONS',
    entityId: 'FESTIVE200',
    description: 'Created promotional discount code FESTIVE200 with FLAT ₹200 off (min spend ₹1,500)',
    ipAddress: '192.168.1.78',
  },
  {
    id: 'aud-1088',
    timestamp: '2026-11-06 12:20:10',
    username: 'superadmin@khandualoom.com',
    userRole: 'ROLE_SUPER_ADMIN',
    action: 'UPDATE',
    module: 'HOMEPAGE',
    entityId: 'sec-hero',
    description: 'Updated campaign headline to: Celebrate India, Celebrate Handloom Fashion',
    ipAddress: '192.168.1.42',
  },
];

export const initialRoles: RolePermission[] = [
  {
    role: 'ROLE_SUPER_ADMIN',
    label: 'Super Administrator',
    description: 'Complete unrestricted authority over store operations, financials, security, and deployments',
    permissions: {
      canManageProducts: true,
      canAdjustStock: true,
      canManageOrders: true,
      canEditBanners: true,
      canToggleFeatures: true,
      canIssueRefunds: true,
      canManageUsers: true,
    },
  },
  {
    role: 'ROLE_STORE_ADMIN',
    label: 'Store Operations Manager',
    description: 'Manages catalog, dispatches, promotional campaigns, and customer orders',
    permissions: {
      canManageProducts: true,
      canAdjustStock: true,
      canManageOrders: true,
      canEditBanners: true,
      canToggleFeatures: false,
      canIssueRefunds: true,
      canManageUsers: false,
    },
  },
  {
    role: 'ROLE_CATALOG_MANAGER',
    label: 'Catalog & Curations Master',
    description: 'Authoring products, categories, artisan profiles, and banner copy',
    permissions: {
      canManageProducts: true,
      canAdjustStock: false,
      canManageOrders: false,
      canEditBanners: true,
      canToggleFeatures: false,
      canIssueRefunds: false,
      canManageUsers: false,
    },
  },
  {
    role: 'ROLE_ORDER_MANAGER',
    label: 'Order Fulfillment & Logistics',
    description: 'Handles tracking numbers, packing slip generation, and order dispatch progression',
    permissions: {
      canManageProducts: false,
      canAdjustStock: true,
      canManageOrders: true,
      canEditBanners: false,
      canToggleFeatures: false,
      canIssueRefunds: false,
      canManageUsers: false,
    },
  },
];

export const loadAuditLogs = (): AuditLogEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AUDIT);
    if (!raw) return initialAuditLogs;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialAuditLogs;
  } catch {
    return initialAuditLogs;
  }
};

export const appendAuditLog = (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
  try {
    const logs = loadAuditLogs();
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    const next = [newEntry, ...logs];
    localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(next));
  } catch {}
};
