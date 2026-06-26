import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CreateLeadSchema } from '@/lib/validation';

// POST /api/leads - Submit lead conversion
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = CreateLeadSchema.parse(body);
    
    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { id: validatedData.projectId },
    });
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    // Check if user exists, create if not
    let user = await prisma.user.findUnique({
      where: { id: validatedData.userId },
    });
    
    if (!user) {
      // Create user record if doesn't exist
      user = await prisma.user.create({
        data: {
          id: validatedData.userId,
          name: validatedData.name,
          phone: validatedData.phone,
          email: validatedData.email,
        },
      });
    } else {
      // Update user info if provided and different
      const updateData: any = {};
      if (validatedData.name && validatedData.name !== user.name) {
        updateData.name = validatedData.name;
      }
      if (validatedData.phone && validatedData.phone !== user.phone) {
        updateData.phone = validatedData.phone;
      }
      if (validatedData.email && validatedData.email !== user.email) {
        updateData.email = validatedData.email;
      }
      
      if (Object.keys(updateData).length > 0) {
        user = await prisma.user.update({
          where: { id: validatedData.userId },
          data: updateData,
        });
      }
    }
    
    // Create lead
    const lead = await prisma.lead.create({
      data: {
        projectId: validatedData.projectId,
        userId: validatedData.userId,
        name: validatedData.name,
        phone: validatedData.phone,
        email: validatedData.email,
        message: validatedData.message,
      },
      include: {
        project: {
          select: {
            id: true,
            storeName: true,
            slug: true,
          },
        },
      },
    });
    
    return NextResponse.json(lead, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
