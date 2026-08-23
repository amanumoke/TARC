/**
 * @file apps/public/src/App.test.tsx
 * @description Unit and component integration tests for the TARCMS Public Portal root.
 * Verifies institutional brand rendering, focus pillars, and navigation elements.
 */

import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('TARCMS Public Portal — App Component', () => {
  it('renders the institutional title and header branding', () => {
    render(<App />);
    expect(screen.getByText('TARCMS')).toBeInTheDocument();
    expect(screen.getByText('Tepi Agricultural Research Center')).toBeInTheDocument();
  });

  it('renders agricultural headline and mission description', () => {
    render(<App />);
    expect(
      screen.getByText('Pioneering Spices, Coffee & Horticultural Excellence')
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Empowering farmers, advancing agricultural biodiversity/i)
    ).toBeInTheDocument();
  });

  it('renders key research focus pillars', () => {
    render(<App />);
    expect(screen.getByText('Spices & Essential Oils')).toBeInTheDocument();
    expect(screen.getByText('Coffee & Agroforestry')).toBeInTheDocument();
    expect(screen.getByText('Farmer Extension & Advisory')).toBeInTheDocument();
  });

  it('renders call-to-action exploration buttons', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /Explore Publications/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Research Programs/i })).toBeInTheDocument();
  });
});
