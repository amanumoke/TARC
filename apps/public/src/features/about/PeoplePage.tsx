import { useDepartments } from '@/api/hooks/useDepartments';
import { useStaff } from '@/api/hooks/useStaff';
import type { DepartmentDTO, StaffDTO } from '@/api/types';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

export function PeoplePage() {
  const { data: staff, isLoading: staffLoading } = useStaff();
  const { data: departments } = useDepartments();
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const deptList: DepartmentDTO[] = useMemo(
    () => (Array.isArray(departments) ? departments : []),
    [departments]
  );

  const staffList: StaffDTO[] = useMemo(() => (Array.isArray(staff) ? staff : []), [staff]);

  const filteredStaff = useMemo(() => {
    return staffList.filter((member) => {
      const matchesSearch =
        !search ||
        `${member.firstName} ${member.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        member.position?.toLowerCase().includes(search.toLowerCase()) ||
        member.bio?.toLowerCase().includes(search.toLowerCase());

      const matchesDept = departmentFilter === 'all' || member.departmentId === departmentFilter;

      return matchesSearch && matchesDept;
    });
  }, [staffList, search, departmentFilter]);

  if (staffLoading) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 py-20 space-y-16">
        <Skeleton className="h-64 w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[260px] lg:min-h-[320px] flex items-end">
        <div className="absolute inset-0">
          <img
            src="/images/agriculture area.jpg"
            alt="TARC management and staff"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1f14]/93 via-[#0a1f14]/72 to-[#0a1f14]/35" />
        </div>
        <div className="relative w-full max-w-[1440px] mx-auto px-6 lg:px-16 pb-12 pt-24 lg:pb-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55 mb-3">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/about" className="hover:text-white transition-colors">About</Link>
            <span className="mx-2">/</span>
            <span className="text-white/90">People</span>
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
            Top Management & Staff
          </h1>
          <p className="mt-3 text-base text-white/65 max-w-xl leading-relaxed">
            Meet the leadership team, researchers, and specialists driving agricultural innovation at TARC.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-border bg-white sticky top-[65px] z-20 py-4">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, position, or expertise..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="h-9 px-3 border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">All Departments</option>
              {deptList.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Staff Grid */}
      <section className="py-12 pb-24 lg:pb-32 bg-[#F5F5F0]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          {filteredStaff.length === 0 ? (
            <div className="py-20 text-center">
              <div className="text-5xl mb-4">👥</div>
              <p className="text-muted-foreground">
                {staffList.length === 0
                  ? 'No staff members available at this time.'
                  : 'No staff members match your search criteria.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredStaff.map((member) => (
                <div
                  key={member.id}
                  className="group bg-white border border-border hover:border-primary/40 transition-all duration-300 overflow-hidden hover:shadow-md"
                >
                  {/* Photo */}
                  {member.photoUrl ? (
                    <div className="overflow-hidden aspect-[4/3]">
                      <img
                        src={member.photoUrl}
                        alt={`${member.firstName} ${member.lastName}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] bg-[#0f2519] flex items-center justify-center">
                      <span className="text-3xl font-bold text-white/20">
                        {member.firstName?.[0]}{member.lastName?.[0]}
                      </span>
                    </div>
                  )}
                  {/* Info */}
                  <div className="p-5">
                    <h3 className="text-[15px] font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                      {member.firstName} {member.lastName}
                    </h3>
                    {member.position && (
                      <p className="text-[12px] font-semibold text-primary mt-1">{member.position}</p>
                    )}
                    {member.departmentName && (
                      <p className="text-[10px] font-semibold text-muted-foreground mt-1 uppercase tracking-wider">
                        {member.departmentName}
                      </p>
                    )}
                    {member.bio && (
                      <p className="text-xs text-muted-foreground mt-3 line-clamp-2 leading-relaxed">
                        {member.bio}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
