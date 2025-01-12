import { useState, useEffect } from 'react';
import { Cloud } from 'lucide-react';
import Map from './components/Map';
import HotspotList from './components/HotspotList';
import SearchBar from './components/SearchBar';
import { WeatherData, RoutePoint } from './types';
import { hotspots } from './data/mockData';
import axios from 'axios';

function App() {
  const [center, setCenter] = useState<[number, number]>([51.505, -0.09]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [destination, setDestination] = useState<RoutePoint | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (lat: number, lon: number) => {
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

    if (!apiKey || apiKey === 'YOUR_API_KEY') {
      setError('Please set up your OpenWeatherMap API key in the .env file');
      return;
    }

    try {
      const response = await axios.get<WeatherData>(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      );
      setWeather(response.data);
      setError(null);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to fetch weather data');
      console.error('Error fetching weather:', error);
    }
  };

  const handleLocationSelect = async (locationString: string) => {
    const geocodingApiKey = import.meta.env.VITE_GEOCODING_API_KEY;

    if (!geocodingApiKey || geocodingApiKey === 'YOUR_API_KEY') {
      setError('Please set up your Geocoding API key in the .env file');
      return;
    }

    try {
      const geocodeResponse = await axios.get<{
        results: { geometry: { lat: number; lng: number } }[];
      }>(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          locationString
        )}&key=${geocodingApiKey}`
      );

      const { results } = geocodeResponse.data;

      if (results && results.length > 0) {
        const { lat, lng } = results[0].geometry;

        const destinationPoint: RoutePoint = {
          latitude: lat, // Correctly assigning lat here
          longitude: lng, // Correctly assigning lng here
          name: locationString,
        };

        setDestination(destinationPoint);
        setCenter([lat, lng]);
        fetchWeather(lat, lng);
        setError(null);
      } else {
        setError('No results found for the entered location');
      }
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to geocode the location. Please try again.');
      console.error('Error geocoding location:', error);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setCenter([latitude, longitude]);
          fetchWeather(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Failed to get your location. Please search for a location manually.');
        }
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Cloud className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">Weather Map</h1>
            </div>
            <SearchBar onLocationSelect={handleLocationSelect} />
          </div>
        </div>
      </header>

      {error && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      )}

      <main className="pt-16 flex">
        {/* HotspotList on the left */}
        <div className="w-1/3 bg-white shadow-lg">
          <HotspotList hotspots={hotspots} />
        </div>

        {/* Map on the right */}
        <div className="w-2/3">
          <Map
            center={center}
            weather={weather}
            userLocation={userLocation}
            hotspots={hotspots}
            destination={destination} // Pass the destination prop
          />
        </div>
      </main>
    </div>
  );
}

export default App;
