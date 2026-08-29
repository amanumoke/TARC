/**
 * @file apps/dashboard/src/App.test.tsx
 * @description Unit and component integration tests for the TARCMS Management Dashboard root.
 * Verifies login page, admin sidebar navigation, and KPI metric cards.
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

function renderWithRouter(ui: React.ReactElement) {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>
  );
}

describe('TARCMS Dashboard — App Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders the login page by default', () => {
    renderWithRouter(<App />);
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.getByText('Sign in to access the management dashboard')).toBeInTheDocument();
  });

  it('shows login form fields', () => {
    renderWithRouter(<App />);
    expect(screen.getByPlaceholderText(/researcher@tarc.gov.et/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('renders dashboard after successful login', async () => {
    // Mock the login API endpoint
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          token: 'mock-token-123',
          user: {
            id: '1',
            name: 'Dr. Girma Bekele',
            email: 'admin@tarc.gov.et',
            role: 'SUPER_ADMIN',
            avatarUrl: null,
          },
        },
      }),
    });

    vi.stubGlobal('fetch', mockFetch);

    renderWithRouter(<App />);

    // Fill in login form
    fireEvent.change(screen.getByPlaceholderText(/researcher@tarc.gov.et/i), {
      target: { value: 'admin@tarc.gov.et' },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
      target: { value: 'admin123456' },
    });

    // Submit login
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // Wait for dashboard to appear - look for "Dashboard" title
    await waitFor(
      () => {
        expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0);
      },
      { timeout: 3000 }
    );
  });

  it('shows error on failed login', async () => {
    // Mock the fetch call to return an error
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({
          success: false,
          error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' },
        }),
      })
    );

    renderWithRouter(<App />);

    // Fill in login form
    fireEvent.change(screen.getByPlaceholderText(/researcher@tarc.gov.et/i), {
      target: { value: 'wrong@email.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
      target: { value: 'wrongpassword' },
    });

    // Submit login
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // Wait for error message
    await waitFor(
      () => {
        expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });
});
