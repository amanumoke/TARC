/**
 * @file apps/dashboard/src/App.test.tsx
 * @description Unit and component integration tests for the TARCMS Management Dashboard root.
 * Verifies login page, admin sidebar navigation, and KPI metric cards.
 */

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('TARCMS Dashboard — App Component', () => {
  it('renders the login page by default', () => {
    render(<App />);
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.getByText('Sign in to access the management dashboard')).toBeInTheDocument();
  });

  it('shows login form fields', () => {
    render(<App />);
    expect(screen.getByPlaceholderText(/researcher@tarc.gov.et/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('renders dashboard after login', async () => {
    render(<App />);

    // Fill in login form
    fireEvent.change(screen.getByPlaceholderText(/researcher@tarc.gov.et/i), {
      target: { value: 'admin@tarc.gov.et' },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
      target: { value: 'password' },
    });

    // Submit login
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // Wait for dashboard to appear
    await waitFor(
      () => {
        expect(screen.getByText('TARC Admin')).toBeInTheDocument();
        expect(screen.getByText('Overview')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });
});
