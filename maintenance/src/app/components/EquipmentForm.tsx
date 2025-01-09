'use client'

import React, { useState } from 'react';
import { z } from 'zod';
import { Equipment } from '../interfaces/equipmentInterface';

const departmentEnum = z.enum(['Machining', 'Assembly', 'Packaging', 'Shipping']);
const statusEnum = z.enum(['Operational', 'Down', 'Maintenance', 'Retired']);

const equipmentSchema = z.object({
  id: z.string().optional(), // Assuming id is generated on the server
  name: z.string().min(3, "Name must be at least 3 characters long"),
  location: z.string().min(1, "Location is required"),
  department: departmentEnum,
  model: z.string().min(1, "Model is required"),
  serialNumber: z.string().regex(/^[a-zA-Z0-9]+$/, "Serial Number must be alphanumeric"),
  installDate: z.date().max(new Date(), "Install Date must be in the past"),
  status: statusEnum,
});

type EquipmentFormData = Omit<Equipment, 'id'>;

const EquipmentForm: React.FC = () => {
  const [formData, setFormData] = useState<EquipmentFormData>({
    name: '',
    location: '',
    department: 'Machining',
    model: '',
    serialNumber: '',
    installDate: new Date(),
    status: 'Operational',
  });

  const [errors, setErrors] = useState<{ [K in keyof EquipmentFormData]?: string[] }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'installDate' ? new Date(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    setErrors({});

    try {
      const validatedData = equipmentSchema.parse(formData);
      console.log('Form data validated:', validatedData);
      
      // Send data to the backend
      const response = await fetch('/api/equipment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit equipment data');
      }

      const result = await response.json();
      console.log('Equipment added successfully:', result);
      
      // Reset form and show success message
      setFormData({
        name: '',
        location: '',
        department: 'Machining',
        model: '',
        serialNumber: '',
        installDate: new Date(),
        status: 'Operational',
      });
      setSubmitMessage('Equipment added successfully!');
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.flatten().fieldErrors as { [K in keyof EquipmentFormData]?: string[] });
      } else {
        console.error('Error submitting form:', error);
        setSubmitMessage('An error occurred while submitting the form. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.name && <p className="text-red-500">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="location" className="block">Location</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.location && <p className="text-red-500">{errors.location}</p>}
      </div>

      <div>
        <label htmlFor="department" className="block">Department</label>
        <select
          id="department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          {departmentEnum.options.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="model" className="block">Model</label>
        <input
          type="text"
          id="model"
          name="model"
          value={formData.model}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.model && <p className="text-red-500">{errors.model}</p>}
      </div>

      <div>
        <label htmlFor="serialNumber" className="block">Serial Number</label>
        <input
          type="text"
          id="serialNumber"
          name="serialNumber"
          value={formData.serialNumber}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.serialNumber && <p className="text-red-500">{errors.serialNumber}</p>}
      </div>

      <div>
        <label htmlFor="installDate" className="block">Install Date</label>
        <input
          type="date"
          id="installDate"
          name="installDate"
          value={formData.installDate.toISOString().split('T')[0]}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.installDate && (
          <p className="text-red-500" data-testid="installDate-error">
            {Array.isArray(errors.installDate) ? errors.installDate.join(', ') : errors.installDate}
          </p>
        )}
      </div>



      <div>
        <label htmlFor="status" className="block">Status</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          {statusEnum.options.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <button 
        type="submit" 
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>

      {submitMessage && (
        <p className={`mt-4 ${submitMessage.includes('error') ? 'text-red-500' : 'text-green-500'}`}>
          {submitMessage}
        </p>
      )}
    </form>
  );
};

export default EquipmentForm;