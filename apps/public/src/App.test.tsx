/**
 * @file apps/public/src/App.test.tsx
 * @description Unit and component integration tests for the TARCMS Public Portal root.
 * Verifies institutional brand rendering, focus pillars, and navigation elements.
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

function TestWrapper({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('TARCMS Public Portal — App Component', () => {
  it('renders the institutional title and header branding', () => {
    render(<App />, { wrapper: TestWrapper });
    expect(screen.getAllByText('TARC').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Tepi Agricultural Research Center/).length).toBeGreaterThan(0);
  });

  it('renders agricultural headline and mission description', () => {
    render(<App />, { wrapper: TestWrapper });
    expect(screen.getByText(/Pioneering Agricultural Excellence/i)).toBeInTheDocument();
    expect(screen.getByText(/Advancing sustainable farming practices/i)).toBeInTheDocument();
  });

  it('renders hero section badge', () => {
    render(<App />, { wrapper: TestWrapper });
    expect(screen.getByText('AGRICULTURAL EXCELLENCE HUB')).toBeInTheDocument();
  });

  it('renders call-to-action exploration buttons', () => {
    render(<App />, { wrapper: TestWrapper });
    expect(screen.getByRole('button', { name: /Explore Research Data/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Latest Publications/i })).toBeInTheDocument();
  });
});
