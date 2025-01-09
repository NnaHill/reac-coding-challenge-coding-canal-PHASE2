'use client'

import React, { useState, useEffect } from 'react';
import MaintenanceRecordsTable from '../components/MaintenanceRecordsTable';
import { MaintenanceRecord } from '../interfaces/maintenanceRecordInterface';
import { Equipment } from '../interfaces/equipmentInterface';

export default function MaintenanceRecordsPage() {
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [equipmentData, setEquipmentData] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch maintenance records
        const recordsResponse = await fetch('/api/maintenance-records');
        if (!recordsResponse.ok) {
          throw new Error('Failed to fetch maintenance records');
        }
        const recordsData = await recordsResponse.json();
        setMaintenanceRecords(recordsData);

        // Fetch equipment data
        const equipmentResponse = await fetch('/api/equipment');
        if (!equipmentResponse.ok) {
          throw new Error('Failed to fetch equipment data');
        }
        const equipmentData = await equipmentResponse.json();
        setEquipmentData(equipmentData);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
  }
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Maintenance Records</h1>
      <MaintenanceRecordsTable
        maintenanceRecords={maintenanceRecords}
        equipmentData={equipmentData}
      />
    </div>
  );
}
