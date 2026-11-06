export interface InventoryRecord {
  id: number;
  sku: string;
  name: string;
  weave: string;
  availableStock: number;
  reservedStock: number;
  lowStockThreshold: number;
  isSinglePiece: boolean;
  price: number;
  lastAdjustedAt?: string;
  lastAdjustedBy?: string;
}

export interface StockAdjustmentRequest {
  productId: number;
  sku: string;
  adjustmentType: 'RESTOCK' | 'DAMAGE_WRITEOFF' | 'AUDIT_CORRECTION' | 'RESERVATION_RELEASE';
  quantityDelta: number;
  reason: string;
  adjustedBy: string;
}

const STORAGE_KEY = 'khandualoom_admin_inventory_ledger';

export const initialInventoryRecords: InventoryRecord[] = [
  {
    id: 1,
    sku: 'KHL-KHD-001',
    name: 'Nuapatna Pure Silk Khandua Saree',
    weave: 'Khandua Silk',
    availableStock: 1,
    reservedStock: 1,
    lowStockThreshold: 3,
    isSinglePiece: true,
    price: 18500,
    lastAdjustedAt: '2026-11-06 14:30',
    lastAdjustedBy: 'admin@khandualoom.com',
  },
  {
    id: 2,
    sku: 'KHL-SAM-002',
    name: 'Sambalpuri Double Ikat Silk Saree',
    weave: 'Sambalpuri Ikat',
    availableStock: 2,
    reservedStock: 0,
    lowStockThreshold: 3,
    isSinglePiece: false,
    price: 24500,
    lastAdjustedAt: '2026-11-05 10:15',
    lastAdjustedBy: 'admin@khandualoom.com',
  },
  {
    id: 3,
    sku: 'KHL-BMK-003',
    name: 'Bomkai Royal Temple Border Silk Saree',
    weave: 'Bomkai Silk',
    availableStock: 4,
    reservedStock: 0,
    lowStockThreshold: 3,
    isSinglePiece: false,
    price: 16900,
    lastAdjustedAt: '2026-11-04 18:00',
    lastAdjustedBy: 'catalog@khandualoom.com',
  },
  {
    id: 4,
    sku: 'KHL-BHP-004',
    name: 'Berhampuri Pattu Temple Kumbha Saree',
    weave: 'Berhampuri Pattu',
    availableStock: 0,
    reservedStock: 0,
    lowStockThreshold: 3,
    isSinglePiece: true,
    price: 28000,
    lastAdjustedAt: '2026-11-06 09:20',
    lastAdjustedBy: 'admin@khandualoom.com',
  },
  {
    id: 5,
    sku: 'KHL-PSP-005',
    name: 'Pasapalli Royal Chessboard Silk Saree',
    weave: 'Pasapalli',
    availableStock: 3,
    reservedStock: 0,
    lowStockThreshold: 3,
    isSinglePiece: false,
    price: 19500,
    lastAdjustedAt: '2026-11-03 16:45',
    lastAdjustedBy: 'admin@khandualoom.com',
  },
  {
    id: 6,
    sku: 'KHL-KTP-006',
    name: 'Kotpad Tribal Organic Vegetable Dye Saree',
    weave: 'Kotpad Tribal',
    availableStock: 2,
    reservedStock: 1,
    lowStockThreshold: 3,
    isSinglePiece: true,
    price: 12500,
    lastAdjustedAt: '2026-11-05 15:10',
    lastAdjustedBy: 'admin@khandualoom.com',
  },
];

export const loadInventoryRecords = (): InventoryRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialInventoryRecords;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialInventoryRecords;
  } catch {
    return initialInventoryRecords;
  }
};

export const saveInventoryRecords = (records: InventoryRecord[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {}
};
