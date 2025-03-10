"use client";

import { useState, useEffect } from 'react';
import { ChargingGraph } from '@/components/ChargingGraph';
import { AddressForm } from '@/components/AddressForm';
import { RouteMap } from '@/components/RouteMap';
import { ChargingSuggestions } from '@/components/ChargingSuggestions';

export default function Home() {
  const [addresses, setAddresses] = useState({
    home: '',
    work: ''
  });
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
        
        // Transform the data for the graph - take last 5 characters for hour
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

  const handleAddressSubmit = (homeAddress: string, workAddress: string) => {
    setAddresses({
      home: homeAddress,
      work: workAddress
    });
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-emerald-400 mb-8">
          EV Charging Optimizer
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AddressForm onAddressSubmit={handleAddressSubmit} />
          <ChargingSuggestions data={chargingData} />
        </div>

        <div className="grid grid-cols-1 gap-8">
          {addresses.home && addresses.work && (
            <RouteMap 
              origin={addresses.home}
              destination={addresses.work}
            />
          )}
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