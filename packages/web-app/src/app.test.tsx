import { test, expect, mock, beforeEach } from "bun:test";
import { render } from '@testing-library/react';
import App from './app';
import './test-setup';

// Mock child components
const MapComponentMock = mock(() => <div data-testid="map-component" />);
const HeaderMock = mock(() => <div data-testid="header-component" />);
const VehicleInfoMock = mock(() => <div data-testid="vehicle-info-component" />);

mock.module('./components/MapComponent', () => ({ default: MapComponentMock }));
mock.module('./components/Header', () => ({ default: HeaderMock }));
mock.module('./components/VehicleInfo', () => ({ default: VehicleInfoMock }));

// Mock hooks
const mockHandleSearch = mock(() => {});
const mockHandleVehicleSelect = mock(() => {});

mock.module('./hooks/useVehicleManager', () => ({
  useVehicleManager: () => ({
    filteredVehicles: [{ id: '1', name: 'Vehicle 1' }, { id: '2', name: 'Vehicle 2' }],
    selectedVehicle: { id: '1', name: 'Vehicle 1' },
    selectedOperationalArea: 'Area 1',
    searchCriteria: { type: 'name', term: 'test' },
    handleSearch: mockHandleSearch,
    handleVehicleSelect: mockHandleVehicleSelect,
  }),
}));

mock.module('./hooks/useResponsiveMenu', () => ({
  useResponsiveMenu: () => ({
    isMenuOpen: false,
    isMobile: false,
    toggleMenu: () => {},
  }),
}));

beforeEach(() => {
  mock.restore();
});

test('App Component renders all child components', () => {
    const { container } = render(<App />);

    expect(container.querySelector('[data-testid="header-component"]')).toBeTruthy();
    expect(container.querySelector('[data-testid="vehicle-info-component"]')).toBeTruthy();
    expect(container.querySelector('[data-testid="map-component"]')).toBeTruthy();
});

test('App Component passes correct props to Header', () => {
  render(<App />);
  expect(HeaderMock).toHaveBeenCalledWith(
    expect.objectContaining({
      onSearch: expect.any(Function),
      currentSearchType: 'name',
      currentSearchTerm: 'test',
    }),
    expect.anything()
  );
});

test('App Component passes correct props to VehicleInfo', () => {
  render(<App />);
  expect(VehicleInfoMock).toHaveBeenCalledWith(
    expect.objectContaining({
      vehicle: { id: '1', name: 'Vehicle 1' },
      operationalArea: 'Area 1',
    }),
    expect.anything()
  );
});

test('App Component passes correct props to MapComponent', () => {
  render(<App />);
  expect(MapComponentMock).toHaveBeenCalledWith(
    expect.objectContaining({
      vehicles: expect.arrayContaining([
        expect.objectContaining({ id: '1', name: 'Vehicle 1' }),
        expect.objectContaining({ id: '2', name: 'Vehicle 2' }),
      ]),
      onVehicleSelect: expect.any(Function),
    }),
    expect.anything()
  );
});