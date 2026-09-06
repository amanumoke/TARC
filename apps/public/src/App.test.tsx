import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { App } from './App';

vi.stubGlobal('scrollTo', vi.fn());

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

function TestWrapper({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('TARCMS Public Portal — App Component', () => {
  it('renders the institutional title and header branding', () => {
    render(<App />, { wrapper: TestWrapper });
    expect(screen.getAllByText('TARC').length).toBeGreaterThan(0);
  });

  it('renders navigation links in header and footer', () => {
    render(<App />, { wrapper: TestWrapper });
    expect(screen.getAllByRole('link', { name: /about/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /research/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /publications/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /news/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /events/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /contact/i }).length).toBeGreaterThan(0);
  });

  it('renders the green top bar with contact info', () => {
    render(<App />, { wrapper: TestWrapper });
    expect(screen.getAllByText('092 065 4572').length).toBeGreaterThan(0);
    expect(
      screen.getAllByText('tepiagriculturalresearchcenter@eiar.gov.et').length
    ).toBeGreaterThan(0);
  });

  it('renders hero section content', () => {
    render(<App />, { wrapper: TestWrapper });
    expect(screen.getByText(/Research in the Field/i)).toBeInTheDocument();
  });

  it('renders footer with copyright', () => {
    render(<App />, { wrapper: TestWrapper });
    expect(screen.getAllByText(/Tepi Agricultural Research Center/i).length).toBeGreaterThan(0);
  });

  it('does not expose the internal management portal or EIAR portal links on the public website', () => {
    render(<App />, { wrapper: TestWrapper });
    expect(screen.queryByRole('link', { name: /management portal/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /eiar portal/i })).not.toBeInTheDocument();
  });
});
