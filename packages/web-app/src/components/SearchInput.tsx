import React from 'react';
import { SEARCH_TYPES, STATUS_OPTIONS, SEARCH_TYPE_LABELS, STATUS_LABELS, BATTERY_LABELS } from '../constants/filters';

export type SearchType = typeof SEARCH_TYPES[keyof typeof SEARCH_TYPES];

interface SearchInputProps {
  searchType: SearchType;
  searchTerm: string;
  onSearchTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  searchType,
  searchTerm,
  onSearchTypeChange,
  onInputChange
}) => {
  return (
    <div className="flex items-center bg-white rounded-full shadow-md">
      <select 
        value={searchType} 
        onChange={onSearchTypeChange} 
        className="search-input rounded-l-full"
      >
        {Object.entries(SEARCH_TYPE_LABELS).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
      {(searchType === SEARCH_TYPES.NAME || searchType === SEARCH_TYPES.PLATE) && (
        <input
          type="text"
          value={searchTerm}
          onChange={onInputChange}
          placeholder={`Search by ${SEARCH_TYPE_LABELS[searchType]}`}
          className="search-input rounded-r-full w-full"
        />
      )}
      {searchType === SEARCH_TYPES.STATUS && (
        <select 
          value={searchTerm || STATUS_OPTIONS.AVAILABLE}
          onChange={onInputChange} 
          className="search-input rounded-r-full w-full"
        >
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      )}
      {searchType === SEARCH_TYPES.BATTERY && (
        <select 
          value={searchTerm}
          onChange={onInputChange} 
          className="search-input rounded-r-full w-full"
        >
          <option value="">Select battery option</option>
          {Object.entries(BATTERY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      )}
    </div>
  );
};

export default SearchInput;