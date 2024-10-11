import { useEffect, useReducer, useCallback, useState } from 'react';
import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "ws-backend/types/socket";
import { Vehicle } from "ws-backend/types/vehicle";
import { SearchType } from '../components/SearchInput';
import { STATUS_OPTIONS } from '../constants/filters';

interface VehicleState {
  vehicles: Vehicle[];
  filteredVehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  searchCriteria: { type: SearchType; term: string } | null;
  selectedOperationalArea: string;
}

type VehicleAction =
  | { type: 'SET_VEHICLES'; payload: Vehicle[] }
  | { type: 'UPDATE_VEHICLE'; payload: Vehicle }
  | { type: 'SET_SEARCH_CRITERIA'; payload: { type: SearchType; term: string } }
  | { type: 'SET_SELECTED_VEHICLE'; payload: { vehicle: Vehicle | null; operationalArea: string } };

const vehicleReducer = (state: VehicleState, action: VehicleAction): VehicleState => {
  switch (action.type) {
    case 'SET_VEHICLES':
      return { ...state, vehicles: action.payload, filteredVehicles: action.payload };
    case 'UPDATE_VEHICLE':
      const updatedVehicles = state.vehicles.map(v => v.id === action.payload.id ? action.payload : v);
      return { ...state, vehicles: updatedVehicles, filteredVehicles: filterVehicles(updatedVehicles, state.searchCriteria) };
    case 'SET_SEARCH_CRITERIA':
      return { ...state, searchCriteria: action.payload, filteredVehicles: filterVehicles(state.vehicles, action.payload) };
    case 'SET_SELECTED_VEHICLE':
      return { ...state, selectedVehicle: action.payload.vehicle, selectedOperationalArea: action.payload.operationalArea };
    default:
      return state;
  }
};

const filterVehicles = (vehicles: Vehicle[], criteria: { type: SearchType; term: string } | null) => {
  if (!criteria) return vehicles;
  return vehicles.filter(vehicle => {
    switch (criteria.type) {
      case 'name':
        return vehicle.name.toLowerCase().includes(criteria.term.toLowerCase());
      case 'plate':
        return vehicle.plate_number.toLowerCase().includes(criteria.term.toLowerCase());
      case 'status':
        return vehicle.status === (criteria.term || STATUS_OPTIONS.AVAILABLE);
      case 'battery':
        if (criteria.term === 'over50') {
          return vehicle.battery > 50;
        } else if (criteria.term === 'full') {
          return vehicle.battery === 100;
        }
        return true;
      default:
        return true;
    }
  });
};

export const useVehicleManager = () => {
  const [state, dispatch] = useReducer(vehicleReducer, {
    vehicles: [],
    filteredVehicles: [],
    selectedVehicle: null,
    searchCriteria: null,
    selectedOperationalArea: "",
  });
  const [error, setError] = useState<string | null>(null);

  const socketClient = io('http://localhost:3000', { autoConnect: false }) as Socket<ServerToClientEvents, ClientToServerEvents>;

  useEffect(() => {
    try {
      socketClient.on('vehicle', (vehicle) => {
        dispatch({ type: 'UPDATE_VEHICLE', payload: vehicle });
      });

      socketClient.on('vehicles', (vehicles) => {
        dispatch({ type: 'SET_VEHICLES', payload: vehicles });
      });

      socketClient.on('connect_error', (err) => {
        setError(`Connection error: ${err.message}`);
      });

      socketClient.connect();
    } catch (err) {
      setError(`Failed to initialize socket: ${err instanceof Error ? err.message : String(err)}`);
    }

    return () => {
      try {
        socketClient.off('vehicle');
        socketClient.off('vehicles');
        socketClient.off('connect_error');
        socketClient.disconnect();
      } catch (err) {
        console.error('Error during cleanup:', err);
      }
    };
  }, []);

  const handleSearch = useCallback((type: SearchType, term: string) => {
    try {
      const searchTerm = type === 'status' && term === '' ? STATUS_OPTIONS.AVAILABLE : term;
      dispatch({ type: 'SET_SEARCH_CRITERIA', payload: { type, term: searchTerm } });
    } catch (err) {
      setError(`Search error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, []);

  const handleVehicleSelect = useCallback((vehicle: Vehicle | null, operationalArea: string) => {
    try {
      dispatch({ type: 'SET_SELECTED_VEHICLE', payload: { vehicle, operationalArea } });
    } catch (err) {
      setError(`Vehicle selection error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, []);

  return {
    filteredVehicles: state.filteredVehicles,
    selectedVehicle: state.selectedVehicle,
    selectedOperationalArea: state.selectedOperationalArea,
    searchCriteria: state.searchCriteria,
    handleSearch,
    handleVehicleSelect,
    error,
  };
};
