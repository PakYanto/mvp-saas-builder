import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CreateProductSchema } from '@/lib/validation';

// POST /api/products - Add product to project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = CreateProductSchema.parse(body);
    
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
    
    // Create product
    const product = await prisma.product.create({
      data: {
        projectId: validatedData.projectId,
        name: validatedData.name,
        price: validatedData.price,
        imageUrl: validatedData.imageUrl,
        description: validatedData.description,
        sortOrder: validatedData.sortOrder,
      },
    });
    
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
