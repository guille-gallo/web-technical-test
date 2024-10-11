import React from 'react';
import { Vehicle } from "ws-backend/types/vehicle";
import scooterIcon from '../assets/icons/scooter.png';
import StatusLabel from './StatusLabel';
import { formatOperationalArea } from '../utils/formatters';

interface VehicleInfoProps {
  vehicle: Vehicle | null;
  operationalArea: string;
}

const VehicleInfo: React.FC<VehicleInfoProps> = ({ vehicle, operationalArea }) => {
  if (!vehicle) return null;

  return (
    <div className="vehicle-info-container" data-testid="vehicle-info-component">
      <div className="flex items-start mb-3">
        <img src={scooterIcon} alt="Scooter" className="mr-4" />
        <div className="flex flex-col">
          <span className="text-lg-semibold mb-1">{vehicle.name}</span>
          <StatusLabel status={vehicle.status} />
        </div>
      </div>
      <div className="h-px bg-gray-200 my-3 w-full"></div>
      <div className="text-sm text-gray-600 flex md:flex-col flex-row justify-between">
        <p className="vehicle-stat">
          <span className="vehicle-stat-label">Plate: </span>
          <span className="vehicle-stat-value">{vehicle.plate_number}</span>
        </p>
        <p className="vehicle-stat">
          <span className="vehicle-stat-label">Battery: </span>
          <span className="vehicle-stat-value">{Math.floor(vehicle.battery)}%</span>
        </p>
        <p className="vehicle-stat">
          <span className="vehicle-stat-label">Operational area: </span>
          <span className="vehicle-stat-value">{formatOperationalArea(operationalArea)}</span>
        </p>
      </div>
    </div>
  );
};

export default VehicleInfo;