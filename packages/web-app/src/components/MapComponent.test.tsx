import React from 'react';
import { test, expect, mock } from "bun:test";
import { render } from '@testing-library/react';
import MapComponent from './MapComponent';
import { Vehicle } from "ws-backend/types/vehicle";

// Mock the useMapComponent hook
mock.module('../hooks/useMapComponent', () => ({
  useMapComponent: () => ({
    mapContainer: { current: document.createElement('div') },
  }),
}));

test('MapComponent renders without crashing', () => {
  const mockOnVehicleSelect = mock(() => {});
  const mockVehicles: Vehicle[] = [];
  const { container } = render(
    <MapComponent
      vehicles={mockVehicles}
      onVehicleSelect={mockOnVehicleSelect}
    />
  );
  expect(container.firstChild).toBeTruthy();
});

test('MapComponent renders with correct structure', () => {
  const mockOnVehicleSelect = mock(() => {});
  const mockVehicles: Vehicle[] = [];
  const { container } = render(
    <MapComponent
      vehicles={mockVehicles}
      onVehicleSelect={mockOnVehicleSelect}
    />
  );
  
  const mapComponent = container.firstChild as HTMLElement;
  expect(mapComponent.tagName).toBe('DIV');
  expect(mapComponent.getAttribute('data-testid')).toBe('map-component');
});