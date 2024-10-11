import React from 'react';
import logo from '../assets/icons/logo.png';
import hamburgerMenu from '../assets/icons/hamburguer_menu.png';
import SearchInput from './SearchInput';
import { SearchType } from './SearchInput';
import { useResponsiveMenu } from '../hooks/useResponsiveMenu';
import { useSearchInput } from '../hooks/useSearchInput';
import '../colors.css';

interface HeaderProps {
  onSearch: (type: SearchType, term: string) => void;
  currentSearchType: SearchType;
  currentSearchTerm: string;
}

const Header: React.FC<HeaderProps> = ({ onSearch, currentSearchType, currentSearchTerm }) => {
  const { isMenuOpen, isMobile, toggleMenu } = useResponsiveMenu();
  const { searchType, searchTerm, handleSearchTypeChange, handleInputChange } = useSearchInput(currentSearchType, currentSearchTerm, onSearch);

  return (
    <div className="absolute top-0 left-0 right-0 z-10 md:top-6 md:left-6 md:right-6">
      <header className="bg-white shadow-md py-4 px-5 md:py-2 md:px-3 flex items-center justify-between h-20 md:h-16 relative md:rounded-full">
        <div className="flex items-center">
          <img src={logo} alt="Yego Logo" className="h-12 w-12 mr-12" />
          <div className="hidden md:flex space-x-2">
            <button className="btn-primary">Map</button>
            <button className="btn-secondary">Settings</button>
          </div>
        </div>
        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
          <SearchInput
            searchType={searchType}
            searchTerm={searchTerm}
            onSearchTypeChange={handleSearchTypeChange}
            onInputChange={handleInputChange}
          />
        </div>
        {isMobile && (
          <button 
            className="flex items-center justify-center p-2 
                       hover:opacity-70 active:opacity-40 focus:outline-none 
                       transition duration-150 ease-in-out"
            onClick={toggleMenu}
          >
            <img src={hamburgerMenu} alt="Menu"/>
          </button>
        )}
      </header>
      {(isMenuOpen && isMobile) && (
        <div className="mt-2 bg-white shadow-md p-4">
          <div className="flex justify-between mb-4">
            <button className="btn-mobile btn-primary">Map</button>
            <button className="btn-mobile btn-secondary">Settings</button>
          </div>
          <SearchInput
            searchType={searchType}
            searchTerm={searchTerm}
            onSearchTypeChange={handleSearchTypeChange}
            onInputChange={handleInputChange}
          />
        </div>
      )}
    </div>
  );
};

export default Header;