"use client";

import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ChargingDataPoint {
  period: string;
  value: number;
}

interface ChargingGraphProps {
  data: ChargingDataPoint[];
}

export const ChargingGraph = ({ data }: ChargingGraphProps) => {
  // Sanitize data and format period
  const sanitizedData = data.map(point => {
    const lastFiveChars = point.period.slice(-5);
    const formattedPeriod = lastFiveChars.replace('-', ':').slice(0, -2) + '00';
    return {
      period: formattedPeriod,
      value: isNaN(point.value) ? 0 : point.value
    };
  });

  return (
    <Card className="p-6 bg-gray-900 text-white">
      <h2 className="text-xl font-semibold mb-4">Energy Price Analysis</h2>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sanitizedData}>
            <XAxis 
              dataKey="period" 
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8' }}
            />
            <YAxis 
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8' }}
              label={{ value: 'Demand', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937',
                border: 'none',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};