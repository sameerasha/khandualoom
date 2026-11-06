import React from 'react';
import { initialRoles } from '@/features/admin/auditApi';
import { ShieldCheck, Check, X } from 'lucide-react';

export const RolePermissionsMatrix: React.FC = () => {
  return (
    <div className="bg-[#170928] border border-brand-gold/20 rounded-2xl overflow-hidden shadow-xl space-y-4 p-5">
      <div className="flex items-center justify-between border-b border-brand-gold/15 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-brand-gold" />
          <div>
            <h3 className="font-serif text-base font-bold text-brand-gold">
              Role-Based Access Control (RBAC) Permissions Matrix
            </h3>
            <p className="text-[11px] text-brand-ivory/60">
              Backend Spring Security authorities and module accessibility governance.
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-brand-ivory">
          <thead className="bg-[#140622] text-[10px] font-bold uppercase tracking-wider text-brand-gold/70 border-b border-brand-gold/20">
            <tr>
              <th className="py-3 px-4">Role & Description</th>
              <th className="py-3 px-2 text-center">Catalog</th>
              <th className="py-3 px-2 text-center">Inventory</th>
              <th className="py-3 px-2 text-center">Orders</th>
              <th className="py-3 px-2 text-center">Banners</th>
              <th className="py-3 px-2 text-center">Feature Toggles</th>
              <th className="py-3 px-2 text-center">Refunds</th>
              <th className="py-3 px-2 text-center">Admins</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-gold/10">
            {initialRoles.map((role) => (
              <tr key={role.role} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-bold text-brand-gold text-xs">
                    {role.label}
                  </div>
                  <div className="text-[10px] text-brand-ivory/50 mt-0.5 max-w-xs">
                    {role.description}
                  </div>
                </td>

                <td className="py-3.5 px-2 text-center">
                  {role.permissions.canManageProducts ? (
                    <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                  ) : (
                    <X className="w-4 h-4 text-brand-ivory/20 mx-auto" />
                  )}
                </td>

                <td className="py-3.5 px-2 text-center">
                  {role.permissions.canAdjustStock ? (
                    <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                  ) : (
                    <X className="w-4 h-4 text-brand-ivory/20 mx-auto" />
                  )}
                </td>

                <td className="py-3.5 px-2 text-center">
                  {role.permissions.canManageOrders ? (
                    <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                  ) : (
                    <X className="w-4 h-4 text-brand-ivory/20 mx-auto" />
                  )}
                </td>

                <td className="py-3.5 px-2 text-center">
                  {role.permissions.canEditBanners ? (
                    <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                  ) : (
                    <X className="w-4 h-4 text-brand-ivory/20 mx-auto" />
                  )}
                </td>

                <td className="py-3.5 px-2 text-center">
                  {role.permissions.canToggleFeatures ? (
                    <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                  ) : (
                    <X className="w-4 h-4 text-brand-ivory/20 mx-auto" />
                  )}
                </td>

                <td className="py-3.5 px-2 text-center">
                  {role.permissions.canIssueRefunds ? (
                    <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                  ) : (
                    <X className="w-4 h-4 text-brand-ivory/20 mx-auto" />
                  )}
                </td>

                <td className="py-3.5 px-2 text-center">
                  {role.permissions.canManageUsers ? (
                    <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                  ) : (
                    <X className="w-4 h-4 text-brand-ivory/20 mx-auto" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
