import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Navbar from './Navbar';

vi.mock('../lib/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    googleLogin: vi.fn(),
    localLogin: vi.fn(async () => null),
    logout: vi.fn(),
  }),
}));

describe('Navbar', () => {
  it('renders primary navigation links', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText('IC-FOODS')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'R&D' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Connect' })).toBeTruthy();
  });
});
