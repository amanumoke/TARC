import { useDepartments } from '@/api/hooks/useDepartments';
import { useStaff } from '@/api/hooks/useStaff';
import type { DepartmentDTO, StaffDTO } from '@/api/types';
import { PlaceholderImage } from '@/components/PlaceholderImage';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronRight, Search, Users } from 'lucide-react';
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
      <div className="space-y-8">
        <Skeleton className="h-10 w-48" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {['a', 'b', 'c', 'd', 'e', 'f'].map((k) => (
            <Skeleton key={k} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <nav className="flex items-center gap-1 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link to="/about" className="hover:text-foreground transition-colors">
          About
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">Our People</span>
      </nav>

      <div>
        <h1 className="text-3xl font-bold">Our People</h1>
        <p className="text-muted-foreground mt-2">
          Meet the researchers and staff driving agricultural innovation at TARC.
        </p>
      </div>

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

      {filteredStaff.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">
              {staffList.length === 0
                ? 'No staff members available at this time.'
                : 'No staff members match your search criteria.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStaff.map((member) => (
            <Card key={member.id} className="overflow-hidden">
              <div className="p-4">
                <div className="flex items-start gap-4">
                  <PlaceholderImage
                    label={`${member.firstName} ${member.lastName}`}
                    aspectRatio="square"
                    className="w-20 h-20 flex-shrink-0"
                  />
                  <div className="space-y-1 min-w-0">
                    <h3 className="font-semibold truncate">
                      {member.firstName} {member.lastName}
                    </h3>
                    {member.position && (
                      <p className="text-sm text-primary truncate">{member.position}</p>
                    )}
                    {member.departmentName && (
                      <p className="text-xs text-muted-foreground truncate">
                        {member.departmentName}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {member.bio && (
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-3">{member.bio}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
