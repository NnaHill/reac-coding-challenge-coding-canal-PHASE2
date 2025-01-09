'use client'

import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getGroupedRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';
import { MaintenanceRecord } from '../interfaces/maintenanceRecordInterface';
import { Equipment } from '../interfaces/equipmentInterface';

interface MaintenanceRecordWithEquipment extends MaintenanceRecord {
  equipmentName: string;
}

interface MaintenanceRecordsTableProps {
  maintenanceRecords: MaintenanceRecord[];
  equipmentData: Equipment[];
}

const MaintenanceRecordsTable: React.FC<MaintenanceRecordsTableProps> = ({
  maintenanceRecords,
  equipmentData,
}) => {
  const [grouping, setGrouping] = useState<string[]>([]);
  const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([]);
  const [filtering, setFiltering] = useState('');
  const [isGrouped, setIsGrouped] = useState(false);

  const data = useMemo(() => {
    return maintenanceRecords.map(record => ({
      ...record,
      equipmentName: equipmentData.find(eq => eq.id === record.equipmentId)?.name || 'Unknown'
    }));
  }, [maintenanceRecords, equipmentData]);

  const columns = useMemo<ColumnDef<MaintenanceRecordWithEquipment>[]>(
    () => [
      {
        accessorKey: 'equipmentName',
        header: 'Equipment Name',
        cell: ({ getValue }) => getValue() || 'Unknown',
      },
      {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ getValue }) => {
          const value = getValue();
          return value instanceof Date ? value.toLocaleDateString() : 'Invalid Date';
        },
      },
      {
        accessorKey: 'type',
        header: 'Type',
      },
      {
        accessorKey: 'technician',
        header: 'Technician',
      },
      {
        accessorKey: 'hoursSpent',
        header: 'Hours Spent',
      },
      {
        accessorKey: 'description',
        header: 'Description',
      },
      {
        accessorKey: 'priority',
        header: 'Priority',
      },
      {
        accessorKey: 'completionStatus',
        header: 'Status',
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    state: {
      sorting,
      globalFilter: filtering,
      grouping,
    },
    onSortingChange: setSorting,
    onGroupingChange: setGrouping,
    onGlobalFilterChange: setFiltering,
  });

  return (
    <div className="p-4">
      <button 
        onClick={() => setIsGrouped(!isGrouped)} 
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        {isGrouped ? 'Ungroup' : 'Group by Equipment'}
      </button>
      <div className="mb-4 flex space-x-4">
        <input
          type="text"
          value={filtering}
          onChange={(e) => setFiltering(e.target.value)}
          placeholder="Search all columns..."
          className="p-2 border rounded"
        />
        <select
          value={grouping[0] || ''}
          onChange={(e) => setGrouping(e.target.value ? [e.target.value] : [])}
          className="p-2 border rounded"
        >
          <option value="">Group by...</option>
          <option value="equipmentName">Equipment Name</option>
          <option value="type">Type</option>
          <option value="priority">Priority</option>
          <option value="completionStatus">Status</option>
        </select>
      </div>

      <table className="min-w-full bg-white border">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="p-2 text-left cursor-pointer border"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {{
                    asc: ' 🔼',
                    desc: ' 🔽',
                  }[header.column.getIsSorted() as string] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MaintenanceRecordsTable;
