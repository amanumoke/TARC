import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { DashboardOverviewPage } from './DashboardOverviewPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    </BrowserRouter>
  );
}

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>();
  return {
    ...actual,
    useQuery: vi.fn().mockImplementation(({ queryKey }: { queryKey: string[] }) => {
      if (queryKey[0] === 'admin-projects-overview') {
        return { data: { data: [] }, isLoading: false };
      }
      if (queryKey[0] === 'unread-messages') {
        return { data: [], isLoading: false };
      }
      return {
        data: {
          totalProjects: 18,
          activeProjects: 12,
          totalPublications: 45,
          totalStaff: 32,
          availableVehicles: 6,
          totalVehicles: 8,
          unreadMessages: 5,
        },
        isLoading: false,
      };
    }),
  };
});

describe('DashboardOverviewPage', () => {
  it('renders the overview title', () => {
    renderWithProviders(<DashboardOverviewPage />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders metric cards', () => {
    renderWithProviders(<DashboardOverviewPage />);
    // Check for KPI card values (not sidebar labels)
    const staffCounts = screen.getAllByText('32');
    expect(staffCounts.length).toBeGreaterThanOrEqual(1);
    const projectCounts = screen.getAllByText('18');
    expect(projectCounts.length).toBeGreaterThanOrEqual(1);
    const pubCounts = screen.getAllByText('45');
    expect(pubCounts.length).toBeGreaterThanOrEqual(1);
    const vehicleCounts = screen.getAllByText('6 / 8');
    expect(vehicleCounts.length).toBeGreaterThanOrEqual(1);
    const messageCounts = screen.getAllByText('5');
    expect(messageCounts.length).toBeGreaterThanOrEqual(1);
    // Check for KPI card labels
    const staffLabels = screen.getAllByText('Staff');
    expect(staffLabels.length).toBeGreaterThanOrEqual(1);
  });
});
