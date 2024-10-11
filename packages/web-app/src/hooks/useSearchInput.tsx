import { useState, useCallback } from 'react';
import { SearchType } from '../components/SearchInput';
import { STATUS_OPTIONS } from '../constants/filters';

export const useSearchInput = (
  initialType: SearchType,
  initialTerm: string,
  onSearch: (type: SearchType, term: string) => void
) => {
  const [searchType, setSearchType] = useState<SearchType>(initialType);
  const [searchTerm, setSearchTerm] = useState(initialTerm);
  const [error, setError] = useState<string | null>(null);

  const handleSearchTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      const newType = e.target.value as SearchType;
      setSearchType(newType);
      setSearchTerm(newType === 'status' ? STATUS_OPTIONS.AVAILABLE : '');
      onSearch(newType, newType === 'status' ? STATUS_OPTIONS.AVAILABLE : '');
    } catch (err) {
      setError(`Search type change error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [onSearch]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    try {
      const newTerm = e.target.value;
      setSearchTerm(newTerm);
      onSearch(searchType, newTerm);
    } catch (err) {
      setError(`Input change error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [searchType, onSearch]);

  const updateSearch = useCallback((type: SearchType, term: string) => {
    try {
      setSearchType(type);
      setSearchTerm(term);
      onSearch(type, term);
    } catch (err) {
      setError(`Update search error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [onSearch]);

  return {
    searchType,
    searchTerm,
    handleSearchTypeChange,
    handleInputChange,
    updateSearch,
    error
  };
};