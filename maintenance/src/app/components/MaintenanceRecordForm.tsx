"use client";

import React, { useState, useEffect } from 'react';
import { Equipment } from '../interfaces/equipmentInterface';
import { z } from 'zod';

//import { MaintenanceRecord } from '../interfaces/maintenanceRecordInterface';


// Zod schema for form validation
const maintenanceRecordSchema = z.object({
  equipmentId: z.string().min(1, "Equipment selection is required"),
  date: z.date().max(new Date(), "Date cannot be in the future"),
  type: z.enum(['Preventive', 'Repair', 'Emergency']),
  technician: z.string().min(2, "Technician name must be at least 2 characters"),
  hoursSpent: z.number().positive().max(24, "Hours spent cannot exceed 24"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  partsReplaced: z.array(z.string()).optional(),
  priority: z.enum(['Low', 'Medium', 'High']),
  completionStatus: z.enum(['Complete', 'Incomplete', 'Pending Parts']),
});

type MaintenanceRecordFormData = z.infer<typeof maintenanceRecordSchema>;

const MaintenanceRecordForm: React.FC = () => {
  const [formData, setFormData] = useState<MaintenanceRecordFormData>({
    equipmentId: '',
    date: new Date(),
    type: 'Preventive',
    technician: '',
    hoursSpent: 0,
    description: '',
    partsReplaced: [],
    priority: 'Low',
    completionStatus: 'Incomplete',
  });

  const [errors, setErrors] = useState<Partial<MaintenanceRecordFormData>>({});
  const [newPart, setNewPart] = useState<string>('');

  const [equipmentOptions, setEquipmentOptions] = useState<Equipment[]>([]);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await fetch('/api/equipment');
        if (!response.ok) {
          throw new Error('Failed to fetch equipment data');
        }
        const data = await response.json();
        setEquipmentOptions(data);
        console.log('Equipment options updated:', data);
      } catch (error) {
        console.error('Error fetching equipment data:', error);
        // Optionally, set an error state here to display to the user
      }
    };

    fetchEquipment();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'date' ? new Date(value) : name === 'hoursSpent' ? parseFloat(value) : value,
    }));
  };

  const handleAddPart = () => {
    if (newPart.trim()) {
      setFormData(prev => ({
        ...prev,
        partsReplaced: [...(prev.partsReplaced || []), newPart.trim()],
      }));
      setNewPart('');
    }
  };

  const handleRemovePart = (index: number) => {
    setFormData(prev => ({
      ...prev,
      partsReplaced: prev.partsReplaced?.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validatedData = maintenanceRecordSchema.parse(formData);
      console.log('Form submitted:', validatedData);

      // Send the data to the backend
      const response = await fetch('/api/maintenance-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Maintenance record created:', result);
        // Reset form or show success message
        alert('Maintenance record created successfully!');
        // Optionally reset the form
        setFormData({
          equipmentId: '',
          date: new Date(),
          type: 'Preventive',
          technician: '',
          hoursSpent: 0,
          description: '',
          partsReplaced: [],
          priority: 'Low',
          completionStatus: 'Incomplete',
        });
      } else {
        const errorData = await response.json();
        console.error('Error creating maintenance record:', errorData);
        alert('Error creating maintenance record. Please try again.');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.flatten().fieldErrors as Partial<MaintenanceRecordFormData>);
      } else {
        console.error('Unexpected error:', error);
        alert('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="equipmentId" className="block">Equipment</label>
        <select
          id="equipmentId"
          name="equipmentId"
          value={formData.equipmentId}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="">Select Equipment</option>
          {equipmentOptions.map(equipment => (
            <option key={equipment.id} value={equipment.id}>
              {equipment.name} - {equipment.serialNumber}
            </option>
          ))}
        </select>


        {errors.equipmentId && <p className="text-red-500">{errors.equipmentId}</p>}
      </div>

      <div>
        <label htmlFor="date" className="block">Date</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date.toISOString().split('T')[0]}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.date && <p className="text-red-500">{errors.date.toString()}</p>}
      </div>

      <div>
        <label htmlFor="type" className="block">Type</label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="Preventive">Preventive</option>
          <option value="Repair">Repair</option>
          <option value="Emergency">Emergency</option>
        </select>
      </div>

      <div>
        <label htmlFor="technician" className="block">Technician</label>
        <input
          type="text"
          id="technician"
          name="technician"
          value={formData.technician}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.technician && <p className="text-red-500">{errors.technician}</p>}
      </div>

      <div>
        <label htmlFor="hoursSpent" className="block">Hours Spent</label>
        <input
          type="number"
          id="hoursSpent"
          name="hoursSpent"
          value={formData.hoursSpent}
          onChange={handleChange}
          min="0"
          max="24"
          step="0.5"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.hoursSpent && <p className="text-red-500">{errors.hoursSpent.toString()}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          rows={3}
        ></textarea>
        {errors.description && <p className="text-red-500">{errors.description}</p>}
      </div>

      <div>
        <label htmlFor="partsReplaced" className="block">Parts Replaced</label>
        <div className="flex">
          <input
            type="text"
            id="partsReplaced"
            value={newPart}
            onChange={(e) => setNewPart(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
          <button
            type="button"
            onClick={handleAddPart}
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add
          </button>
        </div>
        <ul className="mt-2 list-disc list-inside">
          {formData.partsReplaced?.map((part, index) => (
            <li key={index} className="flex items-center">
              {part}
              <button
                type="button"
                onClick={() => handleRemovePart(index)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <label htmlFor="priority" className="block">Priority</label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <div>
        <label htmlFor="completionStatus" className="block">Completion Status</label>
        <select
          id="completionStatus"
          name="completionStatus"
          value={formData.completionStatus}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="Complete">Complete</option>
          <option value="Incomplete">Incomplete</option>
          <option value="Pending Parts">Pending Parts</option>
        </select>
      </div>

      <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
        Submit
      </button>
    </form>
  );
};

export default MaintenanceRecordForm;