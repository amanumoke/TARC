import { Search, X, ChevronDown, ChevronUp, Building2, FlaskConical, GitBranch, Landmark, Settings2, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

// ─── Full EIAR org data ────────────────────────────────────────────────────────

interface Directorate {
  amharic: string;
  english: string;
  code?: string; // for search highlighting
}

interface Wing {
  id: string;
  amharic: string;
  english: string;
  subtitle: string;
  color: string;       // Tailwind bg class for the wing header
  textColor: string;   // Tailwind text class
  borderColor: string; // Tailwind border class
  icon: React.ElementType;
  directorates: Directorate[];
}

const WINGS: Wing[] = [
  {
    id: 'operations',
    amharic: 'የሥራ መሪነት ዋና ሥራ አስፈፃሚ',
    english: 'Executive Officer for Operations',
    subtitle: 'Operations Wing',
    color: 'bg-slate-700',
    textColor: 'text-slate-700',
    borderColor: 'border-slate-700',
    icon: Settings2,
    directorates: [
      { amharic: 'የብቃትና የሰው ሀብት አስተዳደር ሥራ አስፈፃሚ', english: 'HR & Competency Executive', code: 'hr' },
      { amharic: 'የፋይናንስና ግዥ ሥራ አስፈፃሚ', english: 'Finance & Procurement Executive', code: 'finance' },
      { amharic: 'የተቋማዊ ለውጥ ሥራ አስፈፃሚ', english: 'Institutional Reform Executive', code: 'reform' },
      { amharic: 'የስትራቴጂካዊ ጉዳዮች ሥራ አስፈፃሚ', english: 'Strategic Affairs Executive', code: 'strategic' },
      { amharic: 'የመሠረታዊ አገልግሎቶች ሥራ አስፈፃሚ', english: 'Basic Services Executive', code: 'services' },
      { amharic: 'የኢንፎርሜሽን ኮሙኒኬሽን ቴክኖሎጂ ሥራ አስፈፃሚ', english: 'ICT Executive', code: 'ict' },
    ],
  },
  {
    id: 'director-office',
    amharic: 'የኢንስቲትዩቱ ዋና ዳይሬክተር ጽ/ቤት',
    english: 'Office of the Director General',
    subtitle: 'Director General\'s Office',
    color: 'bg-primary',
    textColor: 'text-primary',
    borderColor: 'border-primary',
    icon: Landmark,
    directorates: [
      { amharic: 'የሴቶችና ማህበራዊ ጉዳዮች አካተት ትግበራ ሥራ አስፈፃሚ', english: 'Gender & Social Affairs Executive', code: 'gender' },
      { amharic: 'የሕግ አገልግሎት ሥራ አስፈፃሚ', english: 'Legal Services Executive', code: 'legal' },
      { amharic: 'የሥነ-ምግባር መከታተያ ሥራ አስፈፃሚ', english: 'Ethics & Anti-Corruption Executive', code: 'ethics' },
      { amharic: 'የሕዝብ ግንኙነትና ኮሙኒኬሽን ሥራ አስፈፃሚ', english: 'Public Relations & Comm. Executive', code: 'pr' },
      { amharic: 'የኦዲት ሥራ አስፈፃሚ', english: 'Internal Audit Executive', code: 'audit' },
    ],
  },
  {
    id: 'research',
    amharic: 'የምርምር ም/ዋና ዳይሬክተር',
    english: 'Deputy Director General for Research',
    subtitle: 'Research Wing',
    color: 'bg-emerald-700',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-700',
    icon: FlaskConical,
    directorates: [
      { amharic: 'የሰብል ምርምር ዳይሬክቶሬት', english: 'Crops Research Directorate', code: 'crops' },
      { amharic: 'የእንስሳት ምርምር ዳይሬክቶሬት', english: 'Livestock Research Directorate', code: 'livestock' },
      { amharic: 'የአፈርና ውኃ አያያዝ ምርምር ዳይሬክቶሬት', english: 'Soil & Water Mgmt Directorate', code: 'soil' },
      { amharic: 'የግብርና ኢንጂነሪንግ ምርምር ዳይሬክቶሬት', english: 'Agricultural Engineering Directorate', code: 'engineering' },
      { amharic: 'የግብርና ኢኮኖሚክስ ምርምር ዳይሬክቶሬት', english: 'Agri Economics Directorate', code: 'economics' },
      { amharic: 'የግብርና ባዮቴክኖሎጂ ምርምር ዳይሬክቶሬት', english: 'Biotechnology Directorate', code: 'biotech' },
      { amharic: 'የምግብ ሥነ-ግብብ ምርምር ዳይሬክቶሬት', english: 'Food Science & Nutrition Directorate', code: 'food' },
      { amharic: 'የዕፅዋት ጥበቃ ምርምር ዳይሬክቶሬት', english: 'Plant Protection Directorate', code: 'plant' },
    ],
  },
  {
    id: 'tech',
    amharic: 'የቴክኖሎጂ ኮመርሻላይዜሽን ም/ዋና ዳይሬክተር',
    english: 'DDG for Technology Commercialization',
    subtitle: 'Tech Commercialization Wing',
    color: 'bg-amber-700',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-700',
    icon: Building2,
    directorates: [
      { amharic: 'የግብርና ኤክስቴንሽን ምርምር ዳይሬክቶሬት', english: 'Agri Extension Directorate', code: 'extension' },
      { amharic: 'የመነሻ ቴክኖሎጂ ብዛትና ዘር ምርምር ዳይሬክቶሬት', english: 'Seed & Tech Multiplication Directorate', code: 'seed' },
      { amharic: 'የአርሶ አደር አከባቢዎች ቴክኖሎጂ ሽግግር ዳይሬክቶሬት', english: 'Farming Tech Transfer Directorate', code: 'transfer' },
      { amharic: 'የአየር ንብረት እና ከባቢ አየር ሳይንስ ምርምር ዳይሬክቶሬት', english: 'Climate & Atmospheric Science Directorate', code: 'climate' },
      { amharic: 'የእውቀት አስተዳደር እና የልማት ሀብት ጥበቃ ዳይሬክቶሬት', english: 'Knowledge Mgmt & Resource Protection', code: 'knowledge' },
    ],
  },
  {
    id: 'coordination',
    amharic: 'የምርምር ሥርዓት ማስተባበሪያ ጽ/ቤት',
    english: 'Research System Coordination Office',
    subtitle: 'Research Coordination',
    color: 'bg-purple-700',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-700',
    icon: GitBranch,
    directorates: [
      { amharic: 'የምርምር ማዕከላት ማስተባበሪያ ዳይሬክቶሬት', english: 'Research Centers Coordination Directorate', code: 'centers' },
      { amharic: 'የተቋማት ስትራቴጂካዊ አጋርነት ዳይሬክቶሬት', english: 'Strategic Partnerships Directorate', code: 'partnerships' },
      { amharic: 'የምርምር ብቃት ማጠናከሪያ ዳይሬክቶሬት', english: 'Research Capacity Building Directorate', code: 'capacity' },
    ],
  },
];

function highlight(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-300 text-black rounded-sm px-0.5">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

function matchesQuery(d: Directorate, q: string): boolean {
  if (!q) return true;
  const ql = q.toLowerCase();
  return (
    d.amharic.toLowerCase().includes(ql) ||
    d.english.toLowerCase().includes(ql) ||
    (d.code?.toLowerCase().includes(ql) ?? false)
  );
}

// ─── Connector SVG line from root to wings ────────────────────────────────────
function TreeConnector({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <div className="flex justify-center">
      <div className="w-px bg-border h-10" />
    </div>
  );
}

// ─── Wing Card ────────────────────────────────────────────────────────────────
function WingCard({
  wing,
  isActive,
  isFiltered,
  searchQuery,
  onToggle,
}: {
  wing: Wing;
  isActive: boolean;
  isFiltered: boolean;
  searchQuery: string;
  onToggle: () => void;
}) {
  const Icon = wing.icon;
  const matchingDirs = wing.directorates.filter((d) => matchesQuery(d, searchQuery));
  const hasMatch = matchingDirs.length > 0;

  if (searchQuery && !hasMatch) return null;

  return (
    <div
      className={`flex flex-col transition-all duration-300 ${
        isFiltered && !isActive ? 'opacity-30 scale-[0.98]' : 'opacity-100 scale-100'
      }`}
    >
      {/* Wing header button */}
      <button
        type="button"
        onClick={onToggle}
        className={`group w-full border-2 p-5 text-left transition-all duration-200 ${wing.borderColor} ${
          isActive
            ? `${wing.color} text-white shadow-lg`
            : 'bg-white hover:bg-muted/40'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <Icon
              className={`h-5 w-5 flex-shrink-0 mt-0.5 ${isActive ? 'text-white' : wing.textColor}`}
            />
            <div className="min-w-0">
              <p className={`text-[10px] font-bold uppercase tracking-[0.18em] mb-1 ${isActive ? 'text-white/70' : 'text-muted-foreground'}`}>
                {wing.subtitle}
              </p>
              <p className={`text-[13px] font-bold leading-snug ${isActive ? 'text-white' : 'text-foreground'}`}>
                {wing.english}
              </p>
              <p className={`text-[12px] mt-1 leading-snug ${isActive ? 'text-white/80' : 'text-muted-foreground'}`}>
                {wing.amharic}
              </p>
            </div>
          </div>
          <div className={`flex-shrink-0 flex items-center justify-center h-7 w-7 rounded-full border transition-colors ${
            isActive ? 'border-white/50 bg-white/20' : `${wing.borderColor} bg-transparent`
          }`}>
            {isActive
              ? <ChevronUp className={`h-4 w-4 ${isActive ? 'text-white' : wing.textColor}`} />
              : <ChevronDown className={`h-4 w-4 ${wing.textColor}`} />
            }
          </div>
        </div>
        {/* no subtitle line — amharic already shown in header */}
      </button>

      {/* Connector + directorates */}
      {(isActive || (searchQuery && hasMatch)) && (
        <div className="mt-0">
          {/* Vertical connector line */}
          <div className={`mx-6 h-4 border-l-2 border-dashed ${wing.borderColor} opacity-50`} />
          {/* 2-column grid so directorates sit side-by-side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-1">
            {(searchQuery ? matchingDirs : wing.directorates).map((dir, i) => (
              <div
                key={dir.code ?? i}
                className={`flex items-start gap-3 p-3.5 bg-white border-l-[3px] border ${wing.borderColor}`}
              >
                {/* Numbered badge */}
                <span className={`flex-shrink-0 h-6 w-6 flex items-center justify-center text-[9px] font-bold rounded-sm ${wing.color} text-white mt-0.5`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-foreground leading-snug">
                    {highlight(dir.english, searchQuery)}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
                    {highlight(dir.amharic, searchQuery)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export function OrganizationalStructurePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeWingId, setActiveWingId] = useState<string | null>(null);
  const [showAllExpanded, setShowAllExpanded] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Auto-expand all when searching
  useEffect(() => {
    if (searchQuery) setShowAllExpanded(true);
  }, [searchQuery]);

  const toggleWing = (id: string) => {
    setActiveWingId((prev) => (prev === id ? null : id));
  };

  // Filtered: wings that have at least one match
  const visibleWings = useMemo(() => {
    if (!searchQuery) return WINGS;
    return WINGS.filter((w) =>
      w.directorates.some((d) => matchesQuery(d, searchQuery)) ||
      w.amharic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.english.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const totalDirCount = WINGS.reduce((s, w) => s + w.directorates.length, 0);
  // kept for potential future use

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden min-h-[220px] lg:min-h-[280px] flex items-end">
        <div className="absolute inset-0">
          <img
            src="/images/spices.jpg"
            alt="EIAR organizational structure"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1f14]/96 via-[#0a1f14]/80 to-[#0a1f14]/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f14]/70 to-transparent" />
        </div>
        <div className="relative w-full max-w-[1440px] mx-auto px-6 lg:px-16 pb-8 pt-16 lg:pb-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55 mb-3">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/about" className="hover:text-white transition-colors">About</Link>
            <span className="mx-2">/</span>
            <span className="text-white/90">Structure</span>
          </p>
          {/* Bilingual title */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-6">
            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
              Organizational Structure
            </h1>
            <p className="text-lg sm:text-xl text-white/50 leading-tight pb-0.5">
              የድርጅታዊ መዋቅር
            </p>
          </div>
          <p className="mt-2 text-sm text-white/55 max-w-xl leading-relaxed">
            Ethiopian Institute of Agricultural Research (EIAR) — Institutional Governance Architecture
          </p>
        </div>
      </section>

      {/* ── Search + controls bar ── */}
      <div className="border-b border-border bg-white sticky top-[65px] z-30 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in Amharic or English (e.g. Crops, HR, ህግ, ኦዲት, Biotech)…"
              className="w-full h-10 border border-border bg-white pl-9 pr-9 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {/* Controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => { setShowAllExpanded((v) => !v); setActiveWingId(null); }}
              className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-semibold uppercase tracking-widest border border-border hover:border-primary hover:text-primary transition-colors"
            >
              {showAllExpanded ? <ZoomOut className="h-3.5 w-3.5" /> : <ZoomIn className="h-3.5 w-3.5" />}
              {showAllExpanded ? 'Collapse All' : 'Expand All'}
            </button>
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setActiveWingId(null); setShowAllExpanded(false); }}
              className="flex items-center gap-1.5 px-4 py-2 text-[11px] font-semibold uppercase tracking-widest border border-border hover:border-primary hover:text-primary transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>
        </div>
        {searchQuery && (
          <div className="px-4 lg:px-8 pb-2 text-[11px] text-muted-foreground">
            {visibleWings.reduce((s, w) => s + w.directorates.filter((d) => matchesQuery(d, searchQuery)).length, 0)} results found
          </div>
        )}
      </div>

      {/* ── Org tree ── */}
      <section className="py-8 lg:py-10 pb-16 lg:pb-20 bg-[#F5F5F0]">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8">

          {/* Instruction label */}
          {!searchQuery && (
            <p className="text-center text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-8">
              Click any wing card to expand its directorates
            </p>
          )}

          {/* ── Root node: Director General ── */}
          <div className="flex justify-center mb-0">
            <div className="w-full max-w-md border-2 border-primary bg-primary p-6 text-white text-center shadow-[0_8px_32px_rgba(10,80,45,0.2)]">
              {/* Animated logo placeholder */}
              <div className="mx-auto mb-3 h-12 w-12 border-2 border-white/30 rounded-full flex items-center justify-center">
                <img src="/images/eiar-logo.jpg" alt="EIAR" className="h-9 w-9 object-contain rounded-full" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/60 mb-1">
                Ethiopian Institute of Agricultural Research
              </p>
              <h2 className="font-heading text-xl font-bold text-white">Director General</h2>
              <p className="text-sm text-white/70 mt-0.5">ዋና ዳይሬክተር</p>
              <div className="mt-3 flex justify-center gap-4 text-[10px] text-white/50 uppercase tracking-widest">
                <span>Institutional Leadership</span>
                <span>·</span>
                <span>የሥራ መሪነት</span>
              </div>
            </div>
          </div>

          {/* Trunk line down from root */}
          <div className="flex justify-center">
            <div className="w-0.5 bg-primary/40 h-10" />
          </div>

          {/* Horizontal connector spanning all 5 wings */}
          <div className="relative flex justify-center mb-0">
            <div className="absolute top-0 left-[2%] right-[2%] h-0.5 bg-primary/25" />
          </div>

          {/* ── 5 Wing columns ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-0">
            {WINGS.map((wing) => {
              const isActive = showAllExpanded || activeWingId === wing.id || (searchQuery !== '' && wing.directorates.some((d) => matchesQuery(d, searchQuery)));
              const isFiltered = !searchQuery && activeWingId !== null && activeWingId !== wing.id;
              return (
                <div key={wing.id} className="flex flex-col">
                  <div className="flex justify-center h-6">
                    <div className="w-0.5 bg-primary/25" />
                  </div>
                  <WingCard
                    wing={wing}
                    isActive={isActive}
                    isFiltered={isFiltered}
                    searchQuery={searchQuery}
                    onToggle={() => { setShowAllExpanded(false); toggleWing(wing.id); }}
                  />
                </div>
              );
            })}
          </div>

          {/* No results */}
          {searchQuery && visibleWings.length === 0 && (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="font-semibold text-foreground mb-2">No matches found</h3>
              <p className="text-sm text-muted-foreground">
                Try searching in English or Amharic. For example: "Crops", "ሰብል", "HR", "ህግ", "Audit", "ኦዲት"
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-5 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-widest text-primary hover:text-primary/80"
              >
                <RotateCcw className="h-3 w-3" /> Clear search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Wing legend strip ── */}
      <section className="border-t border-border bg-white py-6">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-5">
            Wing Legend
          </p>
          <div className="flex flex-wrap gap-3">
            {WINGS.map((w) => {
              const Icon = w.icon;
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => { setShowAllExpanded(false); toggleWing(w.id); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
                  className={`flex items-center gap-2 px-3 py-2 border-2 text-[11px] font-semibold transition-all ${w.borderColor} ${
                    activeWingId === w.id ? `${w.color} text-white` : `bg-white ${w.textColor} hover:bg-muted/30`
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {w.subtitle}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Footer note ── */}
      <section className="border-t border-border bg-muted/30 py-6">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
            This structure represents the official institutional architecture of the Ethiopian Institute of Agricultural Research (EIAR).
            TARC (Tepi Agricultural Research Center) operates as a regional research center under EIAR's Research System Coordination.
          </p>
          <Link
            to="/about/departments"
            className="flex-shrink-0 text-[12px] font-semibold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
          >
            View TARC Departments →
          </Link>
        </div>
      </section>
    </div>
  );
}
