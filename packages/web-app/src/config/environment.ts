declare global {
    interface Window {
      ENV?: {
        REACT_APP_MAPBOX_ACCESS_TOKEN?: string;
      };
    }
  }
  
  export const MAPBOX_ACCESS_TOKEN = 
    (typeof window !== 'undefined' && window.ENV?.REACT_APP_MAPBOX_ACCESS_TOKEN) ||
    'pk.eyJ1IjoiZ3VpZ3VpbGxlIiwiYSI6ImNtMHdrcjV4ZTAzMG8yaXF2ZnVjbGtpbWkifQ.JOqHUo__6O4vi7K_L8kajQ';