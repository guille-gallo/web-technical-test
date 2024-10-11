import { useRef, useState, useEffect, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import barcelonaZones from '../assets/zones/barcelona.json';
import { Vehicle } from "ws-backend/types/vehicle";
import * as turf from '@turf/turf';
import { Feature, Polygon, FeatureCollection } from 'geojson';
import { MAPBOX_ACCESS_TOKEN } from '../config/environment';
import { STATUS_OPTIONS } from '../constants/filters';

// Import icons
import availableIcon from '../assets/icons/available3.png';
import bookedIcon from '../assets/icons/booked.png';
import maintenanceIcon from '../assets/icons/maintenance.png';
import availableHoverIcon from '../assets/icons/available-hover.png';
import bookedHoverIcon from '../assets/icons/booked-hover.png';
import maintenanceHoverIcon from '../assets/icons/maintenance-hover.png';

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

interface FeatureProperties {
  id: string | number;
  type: string;
  status: string;
}

export const useMapComponent = (vehicles: Vehicle[], onVehicleSelect: (vehicle: Vehicle | null, operationalArea: string) => void) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getOperationalArea = useCallback((lng: number, lat: number): string => {
    try {
      const point = turf.point([lng, lat]);
      for (let i = 0; i < barcelonaZones.features.length; i++) {
        const zone = barcelonaZones.features[i] as Feature<Polygon>;
        if (turf.booleanPointInPolygon(point, zone)) {
          return `Operational Area ${i + 1}`;
        }
      }
      return "Outside Operational Area";
    } catch (err) {
      setError(`Operational area error: ${err instanceof Error ? err.message : String(err)}`);
      return "Error determining operational area";
    }
  }, []);

  useEffect(() => {
    if (mapInstance.current) return;

    try {
      const bbox = turf.bbox(barcelonaZones as FeatureCollection);
      const center = turf.center(barcelonaZones as FeatureCollection);

      mapInstance.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: center.geometry.coordinates as [number, number],
        zoom: 11
      });

      mapInstance.current.on('load', () => {
        try {
          // Add source for Barcelona zones
          mapInstance.current!.addSource('barcelona-zones', {
            type: 'geojson',
            data: barcelonaZones as FeatureCollection
          });

          // Add fill layer for zones
          mapInstance.current!.addLayer({
            id: 'barcelona-zones-fill',
            type: 'fill',
            source: 'barcelona-zones',
            paint: {
              'fill-color': '#088',
              'fill-opacity': 0.2
            }
          });

          // Add outline layer for zones
          mapInstance.current!.addLayer({
            id: 'barcelona-zones-outline',
            type: 'line',
            source: 'barcelona-zones',
            paint: {
              'line-color': '#088',
              'line-width': 2
            }
          });

          // Fit the map to the bounding box of the zones
          mapInstance.current!.fitBounds(bbox as [number, number, number, number], {
            padding: 50 // Add some padding around the zones
          });

          // Load images
          const images = [
            { name: 'available-icon', src: availableIcon },
            { name: 'available-hover-icon', src: availableHoverIcon },
            { name: 'booked-icon', src: bookedIcon },
            { name: 'booked-hover-icon', src: bookedHoverIcon },
            { name: 'maintenance-icon', src: maintenanceIcon },
            { name: 'maintenance-hover-icon', src: maintenanceHoverIcon },
          ];

          images.forEach(img => {
            mapInstance.current!.loadImage(img.src, (error, image) => {
              if (error) throw error;
              mapInstance.current!.addImage(img.name, image!);
            });
          });

          // Add source for vehicles
          mapInstance.current!.addSource('vehicles', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: []
            }
          });

          // Add layer for normal vehicle icons
          mapInstance.current!.addLayer({
            id: 'vehicles',
            type: 'symbol',
            source: 'vehicles',
            layout: {
              'icon-image': [
                'match',
                ['get', 'status'],
                STATUS_OPTIONS.AVAILABLE, 'available-icon',
                STATUS_OPTIONS.BOOKED, 'booked-icon',
                STATUS_OPTIONS.MAINTENANCE, 'maintenance-icon',
                'available-icon'  // Default icon
              ],
              'icon-size': 1,
              'icon-allow-overlap': true
            }
          });

          // Add layer for hover vehicle icons
          mapInstance.current!.addLayer({
            id: 'vehicles-hover',
            type: 'symbol',
            source: 'vehicles',
            layout: {
              'icon-image': [
                'match',
                ['get', 'status'],
                STATUS_OPTIONS.AVAILABLE, 'available-hover-icon',
                STATUS_OPTIONS.BOOKED, 'booked-hover-icon',
                STATUS_OPTIONS.MAINTENANCE, 'maintenance-hover-icon',
                'available-hover-icon'  // Default hover icon
              ],
              'icon-size': 1,
              'icon-allow-overlap': true
            },
            filter: ['==', ['get', 'id'], '']
          });

          setMapLoaded(true);
        } catch (err) {
          setError(`Map load error: ${err instanceof Error ? err.message : String(err)}`);
        }
      });
    } catch (err) {
      setError(`Map initialization error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, []);

  useEffect(() => {
    if (!mapInstance.current || !mapLoaded) return;

    try {
      const vehicleFeatures = vehicles
        .filter(vehicle => vehicle.status !== 'DISABLED')
        .map(vehicle => turf.point([vehicle.lng, vehicle.lat], {
          id: vehicle.id,
          type: vehicle.name,
          status: vehicle.status
        }));

      const vehiclesCollection = turf.featureCollection(vehicleFeatures);

      // Update vehicles source
      const vehiclesSource = mapInstance.current.getSource('vehicles') as mapboxgl.GeoJSONSource;
      if (vehiclesSource) {
        vehiclesSource.setData(vehiclesCollection);
      }

      // Add hover effect
      let hoveredId: string | number | null = null;

      const onMouseMove = (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
        if (e.features && e.features.length > 0) {
          if (hoveredId !== null) {
            mapInstance.current!.setFilter('vehicles-hover', ['==', ['get', 'id'], '']);
          }
          hoveredId = e.features[0].properties?.id || null;
          mapInstance.current!.setFilter('vehicles-hover', ['==', ['get', 'id'], hoveredId]);
        }
      };

      const onMouseLeave = () => {
        if (hoveredId !== null) {
          mapInstance.current!.setFilter('vehicles-hover', ['==', ['get', 'id'], '']);
        }
        hoveredId = null;
      };

      const onClick = (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
        if (!e.features) return;

        const feature = e.features[0];
        if (feature.geometry.type === 'Point') {
          const { id } = feature.properties as FeatureProperties;
          const selectedVehicle = vehicles.find(v => v.id === id) || null;
          const operationalArea = getOperationalArea(feature.geometry.coordinates[0], feature.geometry.coordinates[1]);
          onVehicleSelect(selectedVehicle, operationalArea);
        }
      };

      const onMouseEnter = () => {
        mapInstance.current!.getCanvas().style.cursor = 'pointer';
      };

      // Add new event listeners
      mapInstance.current.on('mousemove', 'vehicles', onMouseMove);
      mapInstance.current.on('mouseleave', 'vehicles', onMouseLeave);
      mapInstance.current.on('click', 'vehicles', onClick);
      mapInstance.current.on('mouseenter', 'vehicles', onMouseEnter);
      mapInstance.current.on('mouseleave', 'vehicles', onMouseLeave);

      // Cleanup function
      return () => {
        if (mapInstance.current) {
          mapInstance.current.off('mousemove', 'vehicles', onMouseMove);
          mapInstance.current.off('mouseleave', 'vehicles', onMouseLeave);
          mapInstance.current.off('click', 'vehicles', onClick);
          mapInstance.current.off('mouseenter', 'vehicles', onMouseEnter);
          mapInstance.current.off('mouseleave', 'vehicles', onMouseLeave);
        }
      };
    } catch (err) {
      setError(`Vehicle update error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [vehicles, mapLoaded, onVehicleSelect, getOperationalArea]);

  return { mapContainer, error };
};