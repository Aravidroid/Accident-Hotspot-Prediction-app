import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { WeatherData, AccidentHotspot, RoutePoint } from '../types';
import axios from 'axios';

// Fix Leaflet's default icon path
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapProps {
  center: [number, number];
  weather: WeatherData | null;
  userLocation: [number, number] | null;
  hotspots: AccidentHotspot[];
  destination: RoutePoint | null;
}

interface OSRMRoute {
  routes: {
    geometry: {
      coordinates: [number, number][];
    };
    distance: number;
    duration: number;
  }[];
}


function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function Map({ center, weather, userLocation }: MapProps) {
  const [route, setRoute] = useState<[number, number][]>([]);
  const [distance, setDistance] = useState<string>('');
  const [duration, setDuration] = useState<string>('');

  useEffect(() => {
    const fetchRoute = async () => {
      if (!userLocation) return;
      
      try {
        const response = await axios.get<OSRMRoute>(
          `https://router.project-osrm.org/route/v1/driving/${userLocation[1]},${userLocation[0]};${center[1]},${center[0]}?overview=full&geometries=geojson`
        );
        
        if (response.data.routes && response.data.routes.length > 0) {
          const coordinates = response.data.routes[0].geometry.coordinates.map(
            (coord: [number, number]) => [coord[1], coord[0]] as [number, number]
          );
          setRoute(coordinates);
          
          // Calculate distance and duration
          const distanceKm = (response.data.routes[0].distance / 1000).toFixed(1);
          const durationMin = Math.round(response.data.routes[0].duration / 60);
          setDistance(`${distanceKm} km`);
          setDuration(`${durationMin} min`);
        }
      } catch (error) {
        console.error('Error fetching route:', error);
      }
    };

    if (userLocation && center) {
      fetchRoute();
    }
  }, [center, userLocation]);

  return (
    <div className="w-full h-[calc(100vh-4rem)]">
      <MapContainer
        center={center}
        zoom={13}
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapUpdater center={center} />
        
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>Your Location</Popup>
          </Marker>
        )}
        
        {weather && (
          <Marker position={center}>
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg">{weather.name}</h3>
                <div className="flex items-center gap-2">
                  <img 
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                    alt={weather.weather[0].description}
                    className="w-10 h-10"
                  />
                  <div>
                    <p className="text-xl font-semibold">{Math.round(weather.main.temp)}°C</p>
                    <p className="text-sm capitalize">{weather.weather[0].description}</p>
                  </div>
                </div>
                <div className="mt-2 text-sm">
                  <p>Feels like: {Math.round(weather.main.feels_like)}°C</p>
                  <p>Humidity: {weather.main.humidity}%</p>
                  {distance && duration && (
                    <div className="mt-2 pt-2 border-t">
                      <p>Distance: {distance}</p>
                      <p>Duration: {duration}</p>
                    </div>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        )}
        
        {route.length > 0 && (
          <Polyline
            positions={route}
            color="blue"
            weight={4}
            opacity={0.6}
          />
        )}
      </MapContainer>
    </div>
  );
}