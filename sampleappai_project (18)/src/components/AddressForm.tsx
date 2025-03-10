"use client";

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AddressFormProps {
  onAddressSubmit: (homeAddress: string, workAddress: string) => void;
}

export const AddressForm = ({ onAddressSubmit }: AddressFormProps) => {
  const [homeAddress, setHomeAddress] = useState('');
  const [workAddress, setWorkAddress] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddressSubmit(homeAddress, workAddress);
  };

  return (
    <Card className="p-6 bg-gray-900 text-white">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Home Address</label>
          <Input
            type="text"
            value={homeAddress}
            onChange={(e) => setHomeAddress(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Enter home address"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Work Address</label>
          <Input
            type="text"
            value={workAddress}
            onChange={(e) => setWorkAddress(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Enter work address"
            required
          />
        </div>
        <Button 
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700"
        >
          Calculate Route
        </Button>
      </form>
    </Card>
  );
};