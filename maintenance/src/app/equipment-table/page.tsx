'use client';
import { Equipment } from '../interfaces/equipmentInterface';
import EquipmentTable from '../components/EquipmentTable';
import React, { useState, useEffect } from 'react';

const EquipmentTablePage: React.FC = () => {
  const [equipmentData, setEquipmentData] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await fetch('/api/equipment');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEquipmentData(data);
      } catch (err) {
        console.error('Error fetching equipment data:', err);
        setError('An error occurred while fetching equipment data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  const handleUpdateEquipment = (updatedEquipment: Equipment[]) => {
    setEquipmentData(updatedEquipment);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Equipment Table</h1>
      <EquipmentTable data={equipmentData} onUpdateEquipment={handleUpdateEquipment} />
    </div>
  );
};

export default EquipmentTablePage;

