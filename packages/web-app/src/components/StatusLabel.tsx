import React from 'react';
import { STATUS_OPTIONS } from '../constants/filters';

interface StatusLabelProps {
  status: string;
}

const StatusLabel: React.FC<StatusLabelProps> = ({ status }) => {

  const getStatusClass = (status: string) => {
    switch (status.toUpperCase()) {
      case STATUS_OPTIONS.AVAILABLE:
        return 'bg-[var(--available-bg)] text-[var(--success-green)]';
      case STATUS_OPTIONS.BOOKED:
        return 'bg-[var(--booked-bg)] text-[var(--booked-text)]';
      case STATUS_OPTIONS.MAINTENANCE:
        return 'bg-[var(--maintenance-bg)] text-[var(--maintenance-text)]';
      default:
        return 'bg-[var(--booked-bg)] text-[var(--booked-text)]';
    }
  };

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  return (
    <span className={`inline-block text-center max-w-[98px] px-2 py-1 text-sm-medium rounded-full ${getStatusClass(status)}`}>
      {formatStatus(status)}
    </span>
  );
};

export default StatusLabel;