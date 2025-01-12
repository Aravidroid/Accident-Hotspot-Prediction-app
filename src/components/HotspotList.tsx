import { AccidentHotspot } from '../types';
import { AlertTriangle } from 'lucide-react';

interface HotspotListProps {
  hotspots: AccidentHotspot[];
}

export default function HotspotList({ hotspots }: HotspotListProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Accident Hotspots</h2>
      <div className="space-y-4">
        {hotspots.map((hotspot) => (
          <div key={hotspot.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">{hotspot.location}</h3>
              <span className={`px-3 py-1 rounded-full text-sm ${
                hotspot.riskLevel === 'High' ? 'bg-red-100 text-red-800' :
                hotspot.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {hotspot.riskLevel} Risk
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <AlertTriangle size={16} />
              <span>{hotspot.accidentCount} accidents reported</span>
            </div>
            <div>
              <h4 className="font-medium mb-1">Recommendations:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {hotspot.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}