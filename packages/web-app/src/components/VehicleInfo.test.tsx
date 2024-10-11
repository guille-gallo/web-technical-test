import { test, expect, beforeAll, afterAll, beforeEach, mock } from "bun:test";
import { render, cleanup } from '@testing-library/react';
import { JSDOM } from 'jsdom';
import VehicleInfo from './VehicleInfo';
import { Vehicle } from "ws-backend/types/vehicle";

let dom: JSDOM;

beforeAll(() => {
  dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'http://localhost',
    pretendToBeVisual: true,
  });
  global.window = dom.window as unknown as Window & typeof globalThis;
  global.document = dom.window.document;
  global.navigator = dom.window.navigator;

  // Mock the formatOperationalArea function
  mock.module('../utils/formatters', () => ({
    formatOperationalArea: (area: string) => area,
  }));
});

afterAll(() => {
  dom.window.close();
});

beforeEach(() => {
  cleanup();
});

const mockVehicle: Vehicle = {
  id: 1,
  name: 'Test Scooter',
  plate_number: 'ABC123',
  status: 'AVAILABLE',
  battery: 75.5,
  lat: 0,
  lng: 0,
};

test('VehicleInfo renders without crashing', () => {
  const { container } = render(<VehicleInfo vehicle={mockVehicle} operationalArea="test_area" />);
  expect(container).toBeDefined();
});

test('VehicleInfo renders a div with data-testid', () => {
  const { container } = render(<VehicleInfo vehicle={mockVehicle} operationalArea="test_area" />);
  const vehicleInfo = container.querySelector('[data-testid="vehicle-info-component"]');
  expect(vehicleInfo).not.toBeNull();
});

test('VehicleInfo renders content', () => {
  const { container } = render(<VehicleInfo vehicle={mockVehicle} operationalArea="test_area" />);
  expect(container.innerHTML).not.toBe('');
  console.log('Container innerHTML:', container.innerHTML);
});