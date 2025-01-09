import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const maintenanceRecords = await prisma.maintenanceRecord.findMany();
    if (!maintenanceRecords) {
      throw new Error('No maintenance records found');
    }
    return NextResponse.json(maintenanceRecords);
  } catch (error) {
    console.error('Error fetching maintenance records:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { equipmentId, date, type, technician, hoursSpent, description, partsReplaced, priority, completionStatus } = body;

    if (!equipmentId || !date || !type || !technician || !hoursSpent || !description || !priority || !completionStatus) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newMaintenanceRecord = await prisma.maintenanceRecord.create({
      data: {
        equipmentId,
        date: new Date(date),
        type,
        technician,
        hoursSpent: Number(hoursSpent),
        description,
        partsReplaced,
        priority,
        completionStatus,
      },
    });

    return NextResponse.json(newMaintenanceRecord, { status: 201 });
  } catch (error) {
    console.error('Error creating maintenance record:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, equipmentId, date, type, technician, hoursSpent, description, partsReplaced, priority, completionStatus } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing maintenance record ID' }, { status: 400 });
    }

    const updatedMaintenanceRecord = await prisma.maintenanceRecord.update({
      where: { id },
      data: {
        equipmentId,
        date: date ? new Date(date) : undefined,
        type,
        technician,
        hoursSpent: hoursSpent ? Number(hoursSpent) : undefined,
        description,
        partsReplaced,
        priority,
        completionStatus,
      },
    });

    return NextResponse.json(updatedMaintenanceRecord);
  } catch (error) {
    console.error('Error updating maintenance record:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing maintenance record ID' }, { status: 400 });
    }

    await prisma.maintenanceRecord.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Maintenance record deleted successfully' });
  } catch (error) {
    console.error('Error deleting maintenance record:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}