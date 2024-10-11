import { test, expect, mock } from "bun:test";
import { Vehicle } from "ws-backend/types/vehicle";

// Import only the hook itself
import { useVehicleManager } from './useVehicleManager';

// Mock socket.io-client
mock.module('socket.io-client', () => ({
  io: () => ({
    on: mock(() => {}),
    connect: mock(() => {}),
    off: mock(() => {}),
    disconnect: mock(() => {}),
  }),
}));

test('useVehicleManager returns expected properties', () => {
  const hook = useVehicleManager();

  expect(hook).toHaveProperty('filteredVehicles');
  expect(hook).toHaveProperty('selectedVehicle');
  expect(hook).toHaveProperty('selectedOperationalArea');
  expect(hook).toHaveProperty('searchCriteria');
  expect(typeof hook.handleSearch).toBe('function');
  expect(typeof hook.handleVehicleSelect).toBe('function');
});

test('handleSearch function exists and is callable', () => {
  const { handleSearch } = useVehicleManager();
  expect(() => handleSearch('name', 'test')).not.toThrow();
});

test('handleVehicleSelect function exists and is callable', () => {
  const { handleVehicleSelect } = useVehicleManager();
  const mockVehicle: Vehicle = { id: 1, name: 'Test Vehicle', plate_number: 'ABC123', status: 'AVAILABLE', battery: 100, lat: 0, lng: 0 };
  expect(() => handleVehicleSelect(mockVehicle, 'Test Area')).not.toThrow();
});