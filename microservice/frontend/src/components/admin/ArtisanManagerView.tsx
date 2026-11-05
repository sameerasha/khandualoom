import React, { useState } from 'react';
import {
  Award,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  MapPin,
  Sparkles,
  DollarSign,
  X,
} from 'lucide-react';

export interface ArtisanItem {
  id: number;
  name: string;
  cluster: string;
  tradition: string;
  giNumber: string;
  loomType: string;
  award: string;
  activeLooms: number;
  monthlyProduction: number;
  royaltyPercentage: number;
  totalEarnings: number;
  verified: boolean;
}

const INITIAL_ARTISANS: ArtisanItem[] = [
  {
    id: 1,
    name: 'Baidyanath Das',
    cluster: 'Nuapatna, Cuttack',
    tradition: 'Khandua Pata Calligraphic Silk',
    giNumber: 'GI-IND-2009-087',
    loomType: 'Traditional Pit Loom',
    award: 'National Awardee (2018)',
    activeLooms: 6,
    monthlyProduction: 14,
    royaltyPercentage: 72,
    totalEarnings: 420000,
    verified: true,
  },
  {
    id: 2,
    name: 'Prafulla Kumar Meher',
    cluster: 'Bargarh, Western Odisha',
    tradition: 'Sambalpuri Bandha Double Ikat',
    giNumber: 'GI-IND-2010-168',
    loomType: 'Wooden Frame Loom',
    award: 'Shilp Guru Nominee',
    activeLooms: 8,
    monthlyProduction: 18,
    royaltyPercentage: 70,
    totalEarnings: 590000,
    verified: true,
  },
  {
    id: 3,
    name: 'Gitanjali Mohapatra',
    cluster: 'Maniabandha, Badamba',
    tradition: 'Vegetable Dye Bandha Silk',
    giNumber: 'GI-IND-2009-087',
    loomType: 'Hand Fly-Shuttle Loom',
    award: 'State Handicrafts Award',
    activeLooms: 4,
    monthlyProduction: 10,
    royaltyPercentage: 75,
    totalEarnings: 310000,
    verified: true,
  },
  {
    id: 4,
    name: 'Damodar Sahu',
    cluster: 'Sonepur, Subarnapur',
    tradition: 'Bomkai Extra-Weft Silk',
    giNumber: 'GI-IND-2009-086',
    loomType: 'Three-Shuttle Interlocking Jacquard',
    award: 'Master Artisan Fellowship',
    activeLooms: 5,
    monthlyProduction: 12,
    royaltyPercentage: 70,
    totalEarnings: 470000,
    verified: true,
  },
  {
    id: 5,
    name: 'Lakhman Mirgan',
    cluster: 'Kotpad, Koraput',
    tradition: 'Aal (Madder) Organic Dye Weave',
    giNumber: 'GI-IND-2005-024',
    loomType: 'Primitive Pit Loom',
    award: 'Tribal Craft Conservationist',
    activeLooms: 3,
    monthlyProduction: 8,
    royaltyPercentage: 80,
    totalEarnings: 280000,
    verified: true,
  },
];

export const ArtisanManagerView: React.FC = () => {
  const [artisans, setArtisans] = useState<ArtisanItem[]>(INITIAL_ARTISANS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCluster, setSelectedCluster] = useState<string>('all');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // New Artisan Form State
  const [formData, setFormData] = useState({
    name: '',
    cluster: 'Nuapatna, Cuttack',
    tradition: 'Khandua Pata Calligraphic Silk',
    giNumber: 'GI-IND-2009-087',
    loomType: 'Traditional Pit Loom',
    award: 'Odisha Guild Master',
    activeLooms: 2,
    monthlyProduction: 6,
    royaltyPercentage: 70,
  });

  const clusters = ['all', 'Nuapatna', 'Bargarh', 'Maniabandha', 'Sonepur', 'Kotpad'];

  const filteredArtisans = artisans.filter((artisan) => {
    const matchesSearch =
      artisan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artisan.tradition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artisan.giNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCluster =
      selectedCluster === 'all' || artisan.cluster.toLowerCase().includes(selectedCluster.toLowerCase());
    return matchesSearch && matchesCluster;
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const newArtisan: ArtisanItem = {
      id: Date.now(),
      name: formData.name,
      cluster: formData.cluster,
      tradition: formData.tradition,
      giNumber: formData.giNumber,
      loomType: formData.loomType,
      award: formData.award,
      activeLooms: Number(formData.activeLooms),
      monthlyProduction: Number(formData.monthlyProduction),
      royaltyPercentage: Number(formData.royaltyPercentage),
      totalEarnings: 0,
      verified: true,
    };

    setArtisans([newArtisan, ...artisans]);
    setIsRegisterModalOpen(false);
    setFormData({
      name: '',
      cluster: 'Nuapatna, Cuttack',
      tradition: 'Khandua Pata Calligraphic Silk',
      giNumber: 'GI-IND-2009-087',
      loomType: 'Traditional Pit Loom',
      award: 'Odisha Guild Master',
      activeLooms: 2,
      monthlyProduction: 6,
      royaltyPercentage: 70,
    });
  };

  const totalLooms = artisans.reduce((acc, a) => acc + a.activeLooms, 0);
  const totalProduction = artisans.reduce((acc, a) => acc + a.monthlyProduction, 0);
  const totalPayouts = artisans.reduce((acc, a) => acc + a.totalEarnings, 0);

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#180B28]/80 border border-brand-gold/30 shadow-lg">
          <div className="flex items-center justify-between text-brand-gold mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Registered Masters</span>
            <Award className="w-5 h-5 text-brand-gold" />
          </div>
          <div className="text-2xl font-serif font-bold text-brand-ivory">{artisans.length}</div>
          <p className="text-[10px] text-brand-ivory/60 mt-1">GI Certified Guild Artisans</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#180B28]/80 border border-brand-gold/30 shadow-lg">
          <div className="flex items-center justify-between text-brand-gold mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Active Looms</span>
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-2xl font-serif font-bold text-brand-ivory">{totalLooms}</div>
          <p className="text-[10px] text-brand-ivory/60 mt-1">Pit, Frame & Jacquard Looms</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#180B28]/80 border border-brand-gold/30 shadow-lg">
          <div className="flex items-center justify-between text-brand-gold mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Monthly Output</span>
            <span className="text-xs font-mono text-emerald-400">Target 98%</span>
          </div>
          <div className="text-2xl font-serif font-bold text-brand-ivory">{totalProduction} Sarees</div>
          <p className="text-[10px] text-brand-ivory/60 mt-1">Avg 18 days per masterpiece</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#180B28]/80 border border-brand-gold/30 shadow-lg">
          <div className="flex items-center justify-between text-brand-gold mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Weaver Royalties</span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl font-serif font-bold text-brand-gold">
            ₹{totalPayouts.toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] text-emerald-400/80 mt-1">Direct Bank Transfers Processed</p>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#180B28]/60 border border-brand-gold/25">
        <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-brand-gold absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search artisan, GI # or weave..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#12051E] border border-brand-gold/30 rounded-full py-1.5 pl-9 pr-4 text-xs text-brand-ivory placeholder-brand-ivory/50 focus:outline-none focus:border-brand-gold"
            />
          </div>

          {/* Cluster Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-brand-gold/70" />
            <select
              value={selectedCluster}
              onChange={(e) => setSelectedCluster(e.target.value)}
              className="bg-[#12051E] border border-brand-gold/30 rounded-full py-1.5 px-3 text-xs text-brand-ivory focus:outline-none focus:border-brand-gold capitalize"
            >
              {clusters.map((c) => (
                <option key={c} value={c} className="bg-brand-purple-dark text-white">
                  {c === 'all' ? 'All Clusters' : c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Register Button */}
        <button
          onClick={() => setIsRegisterModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-purple-dark text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow-md cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Register Master Artisan</span>
        </button>
      </div>

      {/* Artisans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredArtisans.map((artisan) => (
          <div
            key={artisan.id}
            className="p-5 rounded-2xl bg-gradient-to-b from-[#180B28]/95 via-[#11041D]/90 to-[#0A0212]/95 border border-brand-gold/25 hover:border-brand-gold/60 transition-all shadow-md flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-serif text-lg font-bold text-brand-ivory leading-snug">
                    {artisan.name}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] text-brand-gold mt-0.5">
                    <MapPin className="w-3 h-3 text-brand-gold shrink-0" />
                    <span>{artisan.cluster}</span>
                  </div>
                </div>
                {artisan.verified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified</span>
                  </span>
                )}
              </div>

              {/* Tradition & Award */}
              <div className="space-y-2 py-2 border-y border-brand-gold/15 text-xs">
                <div>
                  <span className="text-brand-ivory/50 text-[10px] uppercase font-mono block">Weaving Craft</span>
                  <span className="text-brand-ivory font-medium">{artisan.tradition}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-brand-ivory/50 text-[10px] uppercase font-mono block">GI Certificate</span>
                    <span className="font-mono text-brand-gold text-[11px]">{artisan.giNumber}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-brand-ivory/50 text-[10px] uppercase font-mono block">Loom Apparatus</span>
                    <span className="text-brand-ivory text-[11px]">{artisan.loomType}</span>
                  </div>
                </div>
              </div>

              {/* Award Tag */}
              <div className="mt-3 p-2 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center gap-2">
                <Award className="w-4 h-4 text-brand-gold shrink-0" />
                <span className="text-[11px] font-bold text-brand-gold-light">{artisan.award}</span>
              </div>
            </div>

            {/* Footer Stats & Earnings */}
            <div className="mt-4 pt-3 border-t border-brand-gold/15 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-brand-ivory/50 text-[10px] block">Looms / Cap</span>
                <span className="text-brand-ivory font-bold">{artisan.activeLooms} Looms ({artisan.monthlyProduction}/mo)</span>
              </div>
              <div className="text-right">
                <span className="text-brand-ivory/50 text-[10px] block">Royalty Share</span>
                <span className="text-emerald-400 font-bold">{artisan.royaltyPercentage}% Direct</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Register Artisan */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-md w-full bg-[#180B28] border border-brand-gold/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-brand-gold/20 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-brand-gold" />
                <h3 className="font-serif text-lg font-bold text-brand-ivory">Register Master Artisan</h3>
              </div>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="text-brand-ivory/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegister} className="space-y-3 text-xs">
              <div>
                <label className="block text-brand-ivory/70 mb-1">Master Weaver Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ramesh Chandra Das"
                  className="w-full bg-[#12051E] border border-brand-gold/30 rounded-xl py-2 px-3 text-brand-ivory focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-brand-ivory/70 mb-1">Weaving Cluster / Region</label>
                <input
                  type="text"
                  required
                  value={formData.cluster}
                  onChange={(e) => setFormData({ ...formData, cluster: e.target.value })}
                  className="w-full bg-[#12051E] border border-brand-gold/30 rounded-xl py-2 px-3 text-brand-ivory focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-brand-ivory/70 mb-1">GI Certificate #</label>
                  <input
                    type="text"
                    required
                    value={formData.giNumber}
                    onChange={(e) => setFormData({ ...formData, giNumber: e.target.value })}
                    className="w-full bg-[#12051E] border border-brand-gold/30 rounded-xl py-2 px-3 text-brand-ivory focus:outline-none focus:border-brand-gold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-brand-ivory/70 mb-1">Active Looms</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={formData.activeLooms}
                    onChange={(e) => setFormData({ ...formData, activeLooms: Number(e.target.value) })}
                    className="w-full bg-[#12051E] border border-brand-gold/30 rounded-xl py-2 px-3 text-brand-ivory focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-brand-ivory/70 mb-1">Loom Type</label>
                <input
                  type="text"
                  value={formData.loomType}
                  onChange={(e) => setFormData({ ...formData, loomType: e.target.value })}
                  className="w-full bg-[#12051E] border border-brand-gold/30 rounded-xl py-2 px-3 text-brand-ivory focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-brand-ivory/70 mb-1">Awards & Recognitions</label>
                <input
                  type="text"
                  value={formData.award}
                  onChange={(e) => setFormData({ ...formData, award: e.target.value })}
                  className="w-full bg-[#12051E] border border-brand-gold/30 rounded-xl py-2 px-3 text-brand-ivory focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-brand-gold/30 text-brand-ivory/70 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-brand-gold text-brand-purple-dark font-bold hover:brightness-110 shadow-md cursor-pointer"
                >
                  Save Master Artisan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
