import { Equipment } from '../interfaces/equipmentInterface';
import { MaintenanceRecord } from '../interfaces/maintenanceRecordInterface';

const API_URL = '/api';

export const fetchEquipment = async (): Promise<Equipment[]> => {
  const response = await fetch(`${API_URL}/equipment`);
  if (!response.ok) throw new Error('Failed to fetch equipment');
  return response.json();
};

export const createEquipment = async (data: Omit<Equipment, 'id'>): Promise<Equipment> => {
  const response = await fetch(`${API_URL}/equipment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create equipment');
  return response.json();
};

export const updateEquipment = async (id: string, data: Partial<Equipment>): Promise<Equipment> => {
  const response = await fetch(`${API_URL}/equipment/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update equipment');
  return response.json();
};

export const deleteEquipment = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/equipment/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete equipment');
};

export const fetchMaintenanceRecords = async (): Promise<MaintenanceRecord[]> => {
  const response = await fetch(`${API_URL}/maintenance-records`);
  if (!response.ok) throw new Error('Failed to fetch maintenance records');
  return response.json();
};

export const createMaintenanceRecord = async (data: Omit<MaintenanceRecord, 'id'>): Promise<MaintenanceRecord> => {
  const response = await fetch(`${API_URL}/maintenance-records`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create maintenance record');
  return response.json();
};

export const updateMaintenanceRecord = async (id: string, data: Partial<MaintenanceRecord>): Promise<MaintenanceRecord> => {
  const response = await fetch(`${API_URL}/maintenance-records/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update maintenance record');
  return response.json();
};

export const deleteMaintenanceRecord = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/maintenance-records/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete maintenance record');
};