import { useDepartments } from '@/api/hooks/useDepartments';
import { useStaff } from '@/api/hooks/useStaff';
import type { DepartmentDTO, StaffDTO } from '@/api/types';
import { PlaceholderImage } from '@/components/PlaceholderImage';
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
      <section className="py-20 lg:py-32">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link to="/about" className="hover:text-foreground transition-colors">
              About
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">People</span>
          </p>
          <h1 className="font-heading text-[48px] lg:text-[80px] xl:text-[100px] font-bold text-foreground leading-[0.95]">
            Our People
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Meet the researchers and staff driving agricultural innovation at TARC.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="pb-12">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <div className="flex flex-col sm:flex-row gap-4">
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
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="all">All Departments</option>
              {deptList.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Staff Grid */}
      <section className="pb-20 lg:pb-28">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          {filteredStaff.length === 0 ? (
            <p className="text-muted-foreground py-12">
              {staffList.length === 0
                ? 'No staff members available at this time.'
                : 'No staff members match your search criteria.'}
            </p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredStaff.map((member) => (
                <div key={member.id} className="group">
                  <PlaceholderImage
                    label={`${member.firstName} ${member.lastName}`}
                    aspectRatio="square"
                    className="w-full aspect-[4/5] object-cover"
                  />
                  <div className="mt-4">
                    <h3 className="text-[17px] font-semibold text-foreground group-hover:text-primary transition-colors">
                      {member.firstName} {member.lastName}
                    </h3>
                    {member.position && (
                      <p className="text-sm text-primary mt-1">{member.position}</p>
                    )}
                    {member.departmentName && (
                      <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
                        {member.departmentName}
                      </p>
                    )}
                    {member.bio && (
                      <p className="text-sm text-muted-foreground mt-3 line-clamp-3 leading-relaxed">
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
