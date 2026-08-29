import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  BookOpen,
  Car,
  FolderOpen,
  MessageSquare,
  Newspaper,
  Settings,
  UserCircle,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchCommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  const handleSelect = (path: string) => {
    navigate(path);
    onOpenChange(false);
  };

  if (!mounted) return null;

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search staff, projects, publications..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Staff">
          <CommandItem onSelect={() => handleSelect('/dashboard/staff')}>
            <Users className="mr-2 h-4 w-4" />
            <span>Staff Directory</span>
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Research">
          <CommandItem onSelect={() => handleSelect('/dashboard/projects')}>
            <FolderOpen className="mr-2 h-4 w-4" />
            <span>Research Projects</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect('/dashboard/research-programs')}>
            <FolderOpen className="mr-2 h-4 w-4" />
            <span>Research Programs</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect('/dashboard/publications')}>
            <BookOpen className="mr-2 h-4 w-4" />
            <span>Publications</span>
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Communication">
          <CommandItem onSelect={() => handleSelect('/dashboard/news')}>
            <Newspaper className="mr-2 h-4 w-4" />
            <span>News</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect('/dashboard/events')}>
            <Newspaper className="mr-2 h-4 w-4" />
            <span>Events</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect('/dashboard/gallery')}>
            <BookOpen className="mr-2 h-4 w-4" />
            <span>Gallery</span>
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Operations">
          <CommandItem onSelect={() => handleSelect('/dashboard/vehicles')}>
            <Car className="mr-2 h-4 w-4" />
            <span>Vehicles</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect('/dashboard/messages')}>
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>Messages</span>
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="System">
          <CommandItem onSelect={() => handleSelect('/dashboard/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect('/dashboard/profile')}>
            <UserCircle className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
