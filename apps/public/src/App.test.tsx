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
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getAllByText('Research').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Publications').length).toBeGreaterThan(0);
    expect(screen.getAllByText('News').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Contact').length).toBeGreaterThan(0);
  });

  it('renders the green top bar with contact info', () => {
    render(<App />, { wrapper: TestWrapper });
    expect(screen.getAllByText('+251 47 556 0000').length).toBeGreaterThan(0);
    expect(screen.getAllByText('info@tarc.gov.et').length).toBeGreaterThan(0);
  });

  it('renders hero section content', () => {
    render(<App />, { wrapper: TestWrapper });
    expect(screen.getByText(/AGRICULTURAL EXCELLENCE HUB/i)).toBeInTheDocument();
  });

  it('renders footer with copyright', () => {
    render(<App />, { wrapper: TestWrapper });
    expect(screen.getByText(/TEPI AGRICULTURAL RESEARCH CENTER/)).toBeInTheDocument();
  });
});
