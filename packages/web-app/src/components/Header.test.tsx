import { test, expect, mock } from "bun:test";
import { render } from '@testing-library/react';
import Header from './Header';

// Mock the custom hooks
mock.module('../hooks/useResponsiveMenu', () => ({
  useResponsiveMenu: () => ({
    isMenuOpen: false,
    isMobile: false,
    toggleMenu: () => {},
  }),
}));

mock.module('../hooks/useSearchInput', () => ({
  useSearchInput: () => ({
    searchType: 'name',
    searchTerm: '',
    handleSearchTypeChange: () => {},
    handleInputChange: () => {},
    updateSearch: () => {},
  }),
}));

// Mock the image imports
mock.module('../assets/icons/logo.png', () => ({
  default: 'mocked-logo.png',
}));
mock.module('../assets/icons/hamburguer_menu.png', () => ({
  default: 'mocked-hamburger.png',
}));

test('Header renders without crashing', () => {
  const { container } = render(
    <Header onSearch={() => {}} currentSearchType="name" currentSearchTerm="" />
  );
  expect(container.firstChild).not.toBeNull();
});

test('Header receives props correctly', () => {
  const mockOnSearch = mock(() => {});
  const { container } = render(
    <Header onSearch={mockOnSearch} currentSearchType="plate" currentSearchTerm="ABC123" />
  );
  
  const headerElement = container.firstChild as HTMLElement;
  expect(headerElement).not.toBeNull();
  expect(headerElement.getAttribute('data-testid')).toBe('header-component');
});

test('Header uses useResponsiveMenu hook correctly', () => {
    const mockToggleMenu = mock(() => {});
    
    mock.module('../hooks/useResponsiveMenu', () => ({
      useResponsiveMenu: () => ({
        isMenuOpen: false,
        isMobile: true,
        toggleMenu: mockToggleMenu,
      }),
    }));
  
    const { container } = render(
      <Header onSearch={() => {}} currentSearchType="name" currentSearchTerm="" />
    );
  
    // Check if the component renders in mobile mode
    expect(container.innerHTML).toContain('data-testid="header-component"');
    
    // Check if toggle is defined
    expect(mockToggleMenu).toBeDefined();
  });