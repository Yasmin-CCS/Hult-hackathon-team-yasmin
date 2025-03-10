"use client";

import { useState, useEffect } from 'react';
import { ChargingGraph } from '@/components/ChargingGraph';
import { AddressForm } from '@/components/AddressForm';
import { ChargingSuggestions } from '@/components/ChargingSuggestions';

export default function Home() {
  const [availability, setAvailability] = useState<{ startHour: number; endHour: number; } | null>(null);
  const [chargingData, setChargingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEnergyPrices = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/energy-prices');
        if (!response.ok) throw new Error('Failed to fetch energy prices');
        const data = await response.json();

        const transformedData = data.response.data.map((item: any) => ({
          period: item.period.slice(-5),
          value: isNaN(item.value) ? 0 : Number(item.value)
        }));

        setChargingData(transformedData);
      } catch (err) {
        setError('Failed to load energy prices');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnergyPrices();
  }, []);

  const handleAvailabilitySubmit = (startHour: number, endHour: number) => {
    setAvailability({
      startHour,
      endHour
    });
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-emerald-400 mb-8 text-center">
          EV Charging Optimizer
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AddressForm onAvailabilitySubmit={handleAvailabilitySubmit} />
          <ChargingSuggestions 
            data={chargingData} 
            availability={availability}
          />
        </div>

        <div className="grid grid-cols-1 gap-8">
          {loading ? (
            <div className="text-center p-8">Loading energy prices...</div>
          ) : error ? (
            <div className="text-red-500 text-center p-8">{error}</div>
          ) : (
            <ChargingGraph data={chargingData} />
          )}
        </div>
      </div>
    </main>
  );
}