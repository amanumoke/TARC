import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DashboardOverviewPage } from './DashboardOverviewPage';

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn().mockReturnValue({
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
  }),
}));

describe('DashboardOverviewPage', () => {
  it('renders the overview title', () => {
    render(<DashboardOverviewPage />);
    expect(screen.getByText('Dashboard Overview')).toBeInTheDocument();
  });

  it('renders metric cards', () => {
    render(<DashboardOverviewPage />);
    expect(screen.getByText('Total Projects')).toBeInTheDocument();
    expect(screen.getByText('18')).toBeInTheDocument();
    expect(screen.getByText('Active Projects')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('Publications')).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();
    expect(screen.getByText('Staff Members')).toBeInTheDocument();
    expect(screen.getByText('32')).toBeInTheDocument();
    expect(screen.getByText('Available Vehicles')).toBeInTheDocument();
    expect(screen.getByText('6 / 8')).toBeInTheDocument();
    expect(screen.getByText('Unread Messages')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
