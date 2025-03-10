"use client";

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AvailabilityFormProps {
  onAvailabilitySubmit: (startHour: number, endHour: number) => void;
}

export const AddressForm = ({ onAvailabilitySubmit }: AvailabilityFormProps) => {
  const [startHour, setStartHour] = useState('');
  const [endHour, setEndHour] = useState('');
  const [error, setError] = useState('');

  const validateHours = (start: number, end: number): boolean => {
    if (start < 0 || start > 23 || end < 0 || end > 23) {
      setError('Hours must be between 0 and 23');
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const startNum = parseInt(startHour);
    const endNum = parseInt(endHour);

    if (isNaN(startNum) || isNaN(endNum)) {
      setError('Please enter valid numbers');
      return;
    }

    if (validateHours(startNum, endNum)) {
      onAvailabilitySubmit(startNum, endNum);
    }
  };

  const handleAllDay = () => {
    setStartHour('0');
    setEndHour('23');
    onAvailabilitySubmit(0, 23);
  };

  return (
    <Card className="p-6 bg-gray-900 text-white">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Availability Start Hour (0-23)</label>
          <Input
            type="number"
            value={startHour}
            onChange={(e) => setStartHour(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Enter start hour (e.g., 9)"
            min="0"
            max="23"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Availability End Hour (0-23)</label>
          <Input
            type="number"
            value={endHour}
            onChange={(e) => setEndHour(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Enter end hour (e.g., 17)"
            min="0"
            max="23"
            required
          />
        </div>
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        <div className="flex gap-4">
          <Button 
            type="submit"
            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
          >
            Set Availability
          </Button>
          <Button 
            type="button"
            onClick={handleAllDay}
            className="flex-1 bg-gray-700 hover:bg-gray-600"
          >
            All Day
          </Button>
        </div>
      </form>
    </Card>
  );
};