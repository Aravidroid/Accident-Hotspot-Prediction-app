import { AccidentHotspot} from '../types';

export const hotspots: AccidentHotspot[] = [
  {
    id: 1,
    location: "Gandhipuram",
    latitude: 11.0168, 
    longitude:76.9558,
    riskLevel: "High",
    accidentCount: 45,
    recommendations: [
      "Install traffic signals",
      "Improve street lighting",
      "Add pedestrian crossings"
    ]
  },
  {
    id: 2,
    location: "Ukkadam",
    latitude: 10.9925,
    longitude:76.9608,
    riskLevel: "Medium",
    accidentCount: 28,
    recommendations: [
      "Speed limit enforcement",
      "Road maintenance",
      "Add warning signs"
    ]
  },
  {
    id: 3,
    location: "RS Puram",
    latitude: 11.0050, 
    longitude:76.9562,
    riskLevel: "High",
    accidentCount: 38,
    recommendations: [
      "Traffic calming measures",
      "Improve intersection design",
      "Enhanced police patrolling"
    ]
  }
];
