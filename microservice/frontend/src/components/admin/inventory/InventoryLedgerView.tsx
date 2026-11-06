import React, { useState } from 'react';
import { useAppSelector } from '@/app/hooks';
import {
  InventoryRecord,
  StockAdjustmentRequest,
  loadInventoryRecords,
  saveInventoryRecords,
} from '@/features/admin/inventoryAdjustmentApi';
import {
  Boxes,
  AlertTriangle,
  Search,
  CheckCircle,
  PlusCircle,
  Clock,
  Layers,
} from 'lucide-react';
import { StockAdjustmentModal } from './StockAdjustmentModal';

export const InventoryLedgerView: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [records, setRecords] = useState<InventoryRecord[]>(() => loadInventoryRecords());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'low_stock' | 'single_piece'>('all');
  const [selectedRecord, setSelectedRecord] = useState<InventoryRecord | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleStockAdjustment = (req: StockAdjustmentRequest) => {
    const next = records.map((r) => {
      if (r.id === req.productId) {
        const nextStock = Math.max(0, r.availableStock + req.quantityDelta);
        return {
          ...r,
          availableStock: nextStock,
          lastAdjustedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          lastAdjustedBy: req.adjustedBy,
        };
      }
      return r;
    });

    setRecords(next);
    saveInventoryRecords(next);
    setModalOpen(false);
    setSelectedRecord(null);
    showToast(`Stock updated for ${req.sku} (${req.adjustmentType})`);
  };

  const lowStockCount = records.filter((r) => r.availableStock < r.lowStockThreshold).length;
  const totalAvailable = records.reduce((acc, r) => acc + r.availableStock, 0);
  const totalReserved = records.reduce((acc, r) => acc + r.reservedStock, 0);

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.weave.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterType === 'low_stock') return r.availableStock < r.lowStockThreshold;
    if (filterType === 'single_piece') return r.isSinglePiece;
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#170928] border border-brand-gold/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-brand-gold/70 block">
            Real-Time Fulfillment Ledger
          </span>
          <h2 className="font-serif text-2xl font-bold text-brand-gold">
            Inventory & Stock Ledger
          </h2>
          <p className="text-xs text-brand-ivory/60 mt-1">
            Reconcile SKU inventory, manage unique single-piece handloom allocations, and log audited adjustments.
          </p>
        </div>

        {toastMessage && (
          <span className="px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 animate-fadeIn">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{toastMessage}</span>
          </span>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#170928] border border-brand-gold/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-gold/10 border border-brand-gold/25 flex items-center justify-center text-brand-gold shrink-0">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-brand-ivory/50 uppercase font-semibold block">
              Total Tracked SKUs
            </span>
            <span className="font-mono text-xl font-bold text-brand-gold">
              {records.length}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#170928] border border-brand-gold/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-brand-ivory/50 uppercase font-semibold block">
              Total Units Available
            </span>
            <span className="font-mono text-xl font-bold text-emerald-400">
              {totalAvailable}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#170928] border border-brand-gold/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-brand-ivory/50 uppercase font-semibold block">
              In Active Checkout
            </span>
            <span className="font-mono text-xl font-bold text-amber-300">
              {totalReserved}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#170928] border border-brand-gold/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-brand-ivory/50 uppercase font-semibold block">
              Low Stock Alerts
            </span>
            <span className="font-mono text-xl font-bold text-rose-400">
              {lowStockCount}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-brand-ivory/40 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by SKU, saree, or weave..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#140622] border border-brand-gold/25 text-brand-ivory text-xs focus:outline-none focus:border-brand-gold"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
          {[
            { id: 'all', label: 'All Inventory' },
            { id: 'low_stock', label: `Low Stock (${lowStockCount})` },
            { id: 'single_piece', label: 'Unique Single-Piece Sarees' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterType === tab.id
                  ? 'bg-brand-gold text-brand-purple-dark shadow font-bold'
                  : 'bg-[#140622] text-brand-ivory/70 hover:text-white border border-brand-gold/15'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-[#170928] border border-brand-gold/20 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-brand-ivory">
            <thead className="bg-[#140622] text-[10px] font-bold uppercase tracking-wider text-brand-gold/70 border-b border-brand-gold/20">
              <tr>
                <th className="py-3 px-4">SKU / Code</th>
                <th className="py-3 px-4">Masterpiece Saree</th>
                <th className="py-3 px-4">Weave Classification</th>
                <th className="py-3 px-4 text-center">Available Stock</th>
                <th className="py-3 px-4 text-center">Reserved</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Last Audit Entry</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-gold/10">
              {filteredRecords.map((item) => {
                const isOutOfStock = item.availableStock === 0;
                const isLowStock = item.availableStock > 0 && item.availableStock < item.lowStockThreshold;

                return (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-brand-gold whitespace-nowrap">
                      {item.sku}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-brand-ivory truncate max-w-xs">
                          {item.name}
                        </span>
                        {item.isSinglePiece && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-purple-950/60 text-purple-300 border border-purple-500/30 shrink-0">
                            Single Piece
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-brand-ivory/70 whitespace-nowrap">
                      {item.weave}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded font-mono font-bold text-xs border ${
                          isOutOfStock
                            ? 'bg-rose-950/60 text-rose-300 border-rose-500/40 animate-pulse'
                            : isLowStock
                            ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                            : 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
                        }`}
                      >
                        {item.availableStock}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center font-mono text-brand-ivory/50">
                      {item.reservedStock}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-brand-gold whitespace-nowrap">
                      ₹{item.price.toLocaleString()}
                    </td>

                    <td className="py-3 px-4 text-[11px] text-brand-ivory/50 whitespace-nowrap">
                      {item.lastAdjustedAt ? (
                        <div>
                          <span>{item.lastAdjustedAt}</span>
                          <span className="block text-[10px] text-brand-ivory/30">
                            By {item.lastAdjustedBy || 'admin'}
                          </span>
                        </div>
                      ) : (
                        'System Ingestion'
                      )}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRecord(item);
                          setModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-brand-gold/15 border border-brand-gold/30 text-brand-gold hover:bg-brand-gold/25 font-bold text-xs flex items-center gap-1.5 ml-auto cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Adjust Stock</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      <StockAdjustmentModal
        record={selectedRecord}
        isOpen={modalOpen}
        adminUsername={user?.username || 'admin@khandualoom.com'}
        onClose={() => {
          setModalOpen(false);
          setSelectedRecord(null);
        }}
        onSave={handleStockAdjustment}
      />
    </div>
  );
};
