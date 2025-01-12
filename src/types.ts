export interface WeatherData {
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  name: string;
}

export interface SearchResult {
  lat: number;
  lon: number;
  display_name: string;
}

export interface RoutePoint {
  latitude: number;
  longitude: number;
  name: string;
}

export interface AccidentHotspot {
  id: number;
  location: string;
  latitude: number;
  longitude: number;
  riskLevel: 'High' | 'Medium' | 'Low';
  accidentCount: number;
  recommendations: string[];
}
