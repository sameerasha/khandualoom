import React, { useState } from 'react';
import {
  AuditLogEntry,
  loadAuditLogs,
} from '@/features/admin/auditApi';
import {
  History,
  Shield,
  Search,
  Filter,
  ShieldCheck,
  CheckCircle,
  Clock,
  Layers,
} from 'lucide-react';
import { RolePermissionsMatrix } from './RolePermissionsMatrix';

export const AuditLogExplorer: React.FC = () => {
  const [logs] = useState<AuditLogEntry[]>(() => loadAuditLogs());
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState<string>('ALL');
  const [showMatrix, setShowMatrix] = useState(false);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (moduleFilter === 'ALL') return true;
    return log.module === moduleFilter;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#170928] border border-brand-gold/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-brand-gold/70 block">
            Immutable Operational Ledger
          </span>
          <h2 className="font-serif text-2xl font-bold text-brand-gold">
            Administrative Audit Trail
          </h2>
          <p className="text-xs text-brand-ivory/60 mt-1">
            Tamper-evident activity recording for catalog changes, stock corrections, and order fulfillment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-[#140622] border border-brand-gold/25 text-xs text-brand-ivory/70">
            <span>Total Logged Events: </span>
            <strong className="text-brand-gold font-mono">{logs.length}</strong>
          </div>

          <button
            type="button"
            onClick={() => setShowMatrix(!showMatrix)}
            className="px-4 py-2 rounded-xl bg-brand-gold/15 border border-brand-gold/30 text-brand-gold hover:bg-brand-gold/25 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{showMatrix ? 'Hide RBAC Matrix' : 'View RBAC Matrix'}</span>
          </button>
        </div>
      </div>

      {/* RBAC Matrix Accordion */}
      {showMatrix && <RolePermissionsMatrix />}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-brand-ivory/40 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by admin, entity, or keyword..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#140622] border border-brand-gold/25 text-brand-ivory text-xs focus:outline-none focus:border-brand-gold"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs self-start sm:self-auto">
          {['ALL', 'ORDERS', 'INVENTORY', 'CATALOG', 'HOMEPAGE', 'COUPONS', 'FEATURES'].map(
            (mod) => (
              <button
                key={mod}
                type="button"
                onClick={() => setModuleFilter(mod)}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  moduleFilter === mod
                    ? 'bg-brand-gold text-brand-purple-dark font-bold shadow'
                    : 'bg-[#140622] text-brand-ivory/70 hover:text-white border border-brand-gold/15'
                }`}
              >
                {mod}
              </button>
            )
          )}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-[#170928] border border-brand-gold/20 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-brand-ivory">
            <thead className="bg-[#140622] text-[10px] font-bold uppercase tracking-wider text-brand-gold/70 border-b border-brand-gold/20">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Admin Patron</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Module</th>
                <th className="py-3 px-4">Entity Ref</th>
                <th className="py-3 px-4">Event Description</th>
                <th className="py-3 px-4 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-gold/10 font-sans">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 font-mono text-[11px] text-brand-gold/80 whitespace-nowrap">
                    {log.timestamp}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="font-semibold text-brand-ivory block">
                      {log.username}
                    </span>
                    <span className="text-[10px] text-brand-ivory/40 uppercase">
                      {log.userRole}
                    </span>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                        log.action === 'CREATE'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                          : log.action === 'STOCK_ADJUST'
                          ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/30'
                          : log.action === 'STATUS_CHANGE'
                          ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                          : log.action === 'DELETE'
                          ? 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
                          : 'bg-purple-950/60 text-purple-300 border border-purple-500/30'
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono text-xs text-brand-gold/90 whitespace-nowrap">
                    {log.module}
                  </td>

                  <td className="py-3 px-4 font-mono text-xs text-brand-ivory/70 whitespace-nowrap">
                    {log.entityId}
                  </td>

                  <td className="py-3 px-4 text-xs text-brand-ivory/90 min-w-[280px]">
                    {log.description}
                  </td>

                  <td className="py-3 px-4 text-right font-mono text-[11px] text-brand-ivory/40 whitespace-nowrap">
                    {log.ipAddress || '127.0.0.1'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
