import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UpdateProjectSchema } from '@/lib/validation';
import { generateUniqueSlug } from '@/lib/slugify';
import { createDefaultStoreConfig } from '@/lib/storeConfig';

// GET /api/projects/[id] - Get single project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        template: true,
        products: {
          orderBy: { sortOrder: 'asc' },
        },
        _count: {
          select: { leads: true },
        },
      },
    });
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/projects/[id] - Update project
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Validate input
    const validatedData = UpdateProjectSchema.parse(body);
    
    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });
    
    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    // Validate storeConfig if provided
    if (validatedData.storeConfig) {
      try {
        // Validate storeConfig structure (already validated by Zod)
      } catch (error) {
        return NextResponse.json(
          { error: 'Invalid store configuration JSON' },
          { status: 400 }
        );
      }
    }
    
    // If storeName is being updated, regenerate slug
    let newSlug: string | undefined;
    if (validatedData.storeName && validatedData.storeName !== existingProject.storeName) {
      newSlug = await generateUniqueSlug(validatedData.storeName, id);
    }
    
    // Update project
    const updateData: Partial<{
      storeName?: string;
      tagline?: string;
      logoUrl?: string;
      category?: string;
      themeColor?: string;
      status?: string;
      storeConfig?: string;
      slug?: string;
    }> = { ...validatedData };
    if (newSlug) {
      updateData.slug = newSlug;
    }
    
    const updatedProject = await prisma.project.update({
      where: { id },
      data: updateData,
      include: {
        template: true,
        products: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
    
    return NextResponse.json(updatedProject);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: (error as any).errors },
        { status: 400 }
      );
    }
    
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id] - Delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id },
    });
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    // Delete project (cascade will handle products and leads)
    await prisma.project.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
