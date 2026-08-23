/**
 * @file apps/dashboard/src/App.test.tsx
 * @description Unit and component integration tests for the TARCMS Management Dashboard root.
 * Verifies admin sidebar navigation, overview title, and KPI metric cards.
 */

import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('TARCMS Dashboard — App Component', () => {
  it('renders the admin portal branding and header', () => {
    render(<App />);
    expect(screen.getByText('TARC Admin')).toBeInTheDocument();
    expect(screen.getByText('Management Portal')).toBeInTheDocument();
    expect(screen.getByText('Operational Dashboard')).toBeInTheDocument();
  });

  it('renders all key management navigation items', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /Overview/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Research & Trials/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Publications/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Staff & Directory/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Fleet & Vehicles/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Messages/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Settings/i })).toBeInTheDocument();
  });

  it('renders overview KPI summary metric cards', () => {
    render(<App />);
    expect(screen.getByText('Active Projects')).toBeInTheDocument();
    expect(screen.getByText('18')).toBeInTheDocument();
    expect(screen.getByText('Available Fleet')).toBeInTheDocument();
    expect(screen.getByText('6 / 8')).toBeInTheDocument();
    expect(screen.getByText('Inquiry Inbox')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
