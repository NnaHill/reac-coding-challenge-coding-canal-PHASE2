import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const equipment = await prisma.equipment.findMany();
    return NextResponse.json(equipment);
  } catch (error) {
    console.error('Error fetching equipment data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, location, department, model, serialNumber, installDate, status } = body;

    if (!name || !location || !department || !model || !serialNumber || !installDate || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newEquipment = await prisma.equipment.create({
      data: {
        name,
        location,
        department,
        model,
        serialNumber,
        installDate: new Date(installDate),
        status,
      },
    });

    return NextResponse.json(newEquipment, { status: 201 });
  } catch (error) {
    console.error('Error creating equipment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, location, department, model, serialNumber, installDate, status } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing equipment ID' }, { status: 400 });
    }

    const updatedEquipment = await prisma.equipment.update({
      where: { id },
      data: {
        name,
        location,
        department,
        model,
        serialNumber,
        installDate: installDate ? new Date(installDate) : undefined,
        status,
      },
    });

    return NextResponse.json(updatedEquipment);
  } catch (error) {
    console.error('Error updating equipment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing equipment ID' }, { status: 400 });
    }

    await prisma.equipment.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    console.error('Error deleting equipment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}