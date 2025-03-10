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
  availability: {
    startHour: number;
    endHour: number;
  } | null;
}

export const ChargingSuggestions = ({ data, availability }: ChargingSuggestionsProps) => {
  const PEAK_RATE = 0.10; // 10 cents per kWh
  const OFF_PEAK_RATE = 0.04; // 4 cents per kWh

  const calculateSuggestions = (): ChargingSuggestion[] => {
    if (!availability) return [];

    const suggestions = data
      .map(point => {
        const hour = parseInt(point.period.slice(-5, -3));
        // Filter out times outside availability window
        if (hour < availability.startHour || hour > availability.endHour) {
          return null;
        }

        const normalizedDemand = point.value / Math.max(...data.map(d => d.value));
        const rate = normalizedDemand > 0.85 ? PEAK_RATE : OFF_PEAK_RATE;
        const savings = PEAK_RATE - rate;
        
        return {
          time: point.period.replace('-', ':').slice(0, -2) + '00',
          cost: rate,
          savings: savings,
          demandValue: normalizedDemand
        };
      })
      .filter((suggestion): suggestion is ChargingSuggestion => suggestion !== null)
      .sort((a, b) => a.demandValue - b.demandValue)
      .slice(0, 3);

    return suggestions;
  };

  const suggestions = calculateSuggestions();

  return (
    <Card className="p-6 bg-gray-900 text-white">
      <h2 className="text-xl font-semibold mb-4">Optimal Charging Times</h2>
      {!availability ? (
        <div className="text-gray-400 text-center p-4">
          Please set your availability to see optimal charging times.
        </div>
      ) : suggestions.length > 0 ? (
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
      ) : (
        <div className="text-gray-400 text-center p-4">
          No optimal charging times available within your specified hours.
        </div>
      )}
    </Card>
  );
};