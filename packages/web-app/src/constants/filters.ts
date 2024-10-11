export const SEARCH_TYPES = {
    NAME: 'name',
    PLATE: 'plate',
    STATUS: 'status',
    BATTERY: 'battery',
  } as const;
  
  export const STATUS_OPTIONS = {
    AVAILABLE: 'AVAILABLE',
    BOOKED: 'BOOKED',
    MAINTENANCE: 'MAINTENANCE',
  } as const;
  
  export const BATTERY_OPTIONS = {
    OVER_50: 'over50',
    FULL: 'full',
  } as const;
  
  export const SEARCH_TYPE_LABELS = {
    [SEARCH_TYPES.NAME]: 'Name',
    [SEARCH_TYPES.PLATE]: 'Plate',
    [SEARCH_TYPES.STATUS]: 'Status',
    [SEARCH_TYPES.BATTERY]: 'Battery',
  } as const;
  
  export const STATUS_LABELS = {
    [STATUS_OPTIONS.AVAILABLE]: 'Available',
    [STATUS_OPTIONS.BOOKED]: 'Booked',
    [STATUS_OPTIONS.MAINTENANCE]: 'Maintenance',
  } as const;
  
  export const BATTERY_LABELS = {
    [BATTERY_OPTIONS.OVER_50]: 'Over 50%',
    [BATTERY_OPTIONS.FULL]: 'Fully charged',
  } as const;