import MapComponent from "./components/MapComponent";
import Header from "./components/Header";
import VehicleInfo from "./components/VehicleInfo";
import { useVehicleManager } from "./hooks/useVehicleManager";
import './colors.css';

function App() {
  const {
    filteredVehicles,
    selectedVehicle,
    selectedOperationalArea,
    searchCriteria,
    handleSearch,
    handleVehicleSelect,
    error
  } = useVehicleManager();

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-[var(--danger-error)] text-xl font-bold">
          An error occurred: {error}
        </div>
      </div>
    );
  }


  return (
    <div className="flex flex-col h-screen">
      <Header 
        onSearch={handleSearch}
        currentSearchType={searchCriteria?.type || 'name'}
        currentSearchTerm={searchCriteria?.term || ''}
      />
      <div className="flex-grow relative">
        <VehicleInfo vehicle={selectedVehicle} operationalArea={selectedOperationalArea} />
        <MapComponent vehicles={filteredVehicles} onVehicleSelect={handleVehicleSelect} />
      </div>
    </div>
  );
}

export default App;