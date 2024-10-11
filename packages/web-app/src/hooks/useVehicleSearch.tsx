import { useState, useMemo, useCallback } from 'react';
import { Vehicle } from "ws-backend/types/vehicle";

type SearchType = 'all' | 'name' | 'plate';

interface AdvancedSearchCriteria {
  status?: string;
  minBattery?: number;
  maxBattery?: number;
}

export const useVehicleSearch = (vehicles: Vehicle[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('all');
  const [advancedCriteria, setAdvancedCriteria] = useState<AdvancedSearchCriteria>({});
  const [error, setError] = useState<string | null>(null);

  const filteredVehicles = useMemo(() => {
    try {
      return vehicles.filter(vehicle => {
        const matchesSearchTerm = () => {
          if (searchTerm === '') return true;
          const term = searchTerm.toLowerCase();
          switch (searchType) {
            case 'name':
              return vehicle.name.toLowerCase().includes(term);
            case 'plate':
              return vehicle.plate_number.toLowerCase().includes(term);
            default:
              return vehicle.name.toLowerCase().includes(term) || 
                     vehicle.plate_number.toLowerCase().includes(term);
          }
        };

        const matchesAdvancedCriteria = () => {
          if (Object.keys(advancedCriteria).length === 0) return true;
          return (
            (!advancedCriteria.status || vehicle.status === advancedCriteria.status) &&
            (!advancedCriteria.minBattery || vehicle.battery >= advancedCriteria.minBattery) &&
            (!advancedCriteria.maxBattery || vehicle.battery <= advancedCriteria.maxBattery)
          );
        };

        return matchesSearchTerm() && matchesAdvancedCriteria();
      });
    } catch (err) {
      setError(`Filter error: ${err instanceof Error ? err.message : String(err)}`);
      return [];
    }
  }, [vehicles, searchTerm, searchType, advancedCriteria]);

  const handleSearchChange = useCallback((term: string) => {
    try {
      setSearchTerm(term);
    } catch (err) {
      setError(`Search term error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, []);

  const handleSearchTypeChange = useCallback((type: SearchType) => {
    try {
      setSearchType(type);
    } catch (err) {
      setError(`Search type error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, []);

  const handleAdvancedSearchChange = useCallback((criteria: AdvancedSearchCriteria) => {
    try {
      setAdvancedCriteria(criteria);
    } catch (err) {
      setError(`Advanced search error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, []);

  return {
    filteredVehicles,
    searchTerm,
    searchType,
    advancedCriteria,
    handleSearchChange,
    handleSearchTypeChange,
    handleAdvancedSearchChange,
    error
  };
};