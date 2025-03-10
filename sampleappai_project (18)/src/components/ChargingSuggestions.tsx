"use client";

import { Card } from "@/components/ui/card";

interface ChargingSuggestion {
  time: string;
  cost: number;
  savings: number;
  demandValue: number;
}

interface ChargingSuggestionsProps {
  data: Array<{ period: string; value: number }>;
}

export const ChargingSuggestions = ({ data }: ChargingSuggestionsProps) => {
  const PEAK_RATE = 0.10; // 10 cents per kWh
  const OFF_PEAK_RATE = 0.04; // 4 cents per kWh

  const calculateSuggestions = (): ChargingSuggestion[] => {
    const suggestions = data.map(point => {
      const normalizedDemand = point.value / Math.max(...data.map(d => d.value));
      const rate = normalizedDemand > 0.5 ? PEAK_RATE : OFF_PEAK_RATE;
      const savings = PEAK_RATE - rate;
      
      return {
        time: point.period.replace('-', ':').slice(0, -2) + '00',
        cost: rate,
        savings: savings,
        demandValue: normalizedDemand
      };
    });

    return suggestions
      .sort((a, b) => a.cost - b.cost)
      .slice(0, 3);
  };

  const suggestions = calculateSuggestions();

  return (
    <Card className="p-6 bg-gray-900 text-white">
      <h2 className="text-xl font-semibold mb-4">Optimal Charging Times</h2>
      <div className="space-y-4">
        {suggestions.map((suggestion, index) => (
          <div 
            key={index}
            className="p-4 bg-gray-800 rounded-lg flex justify-between items-center"
          >
            <div>
              <p className="text-emerald-400 font-medium">{suggestion.time}</p>
              <p className="text-sm text-gray-400">
                Rate: ${suggestion.cost.toFixed(2)}/kWh
              </p>
            </div>
            <div className="text-right">
              <p className="text-emerald-400 font-bold">
                Save ${(suggestion.savings * 100).toFixed(2)}
              </p>
              <p className="text-sm text-gray-400">
                {(suggestion.demandValue * 100).toFixed(0)}% demand
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};