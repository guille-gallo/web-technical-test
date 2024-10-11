import { Vehicle } from "ws-backend/types/vehicle";
import { useMapComponent } from '../hooks/useMapComponent';

interface MapComponentProps {
  vehicles: Vehicle[];
  onVehicleSelect: (vehicle: Vehicle | null, operationalArea: string) => void;
}

function MapComponent({ vehicles, onVehicleSelect }: MapComponentProps) {
  const { mapContainer } = useMapComponent(vehicles, onVehicleSelect);

  return (
    <div className="absolute inset-0">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}

export default MapComponent;