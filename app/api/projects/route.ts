import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CreateProjectSchema, ProjectQuerySchema } from '@/lib/validation';
import { createDefaultStoreConfig } from '@/lib/storeConfig';
import { generateUniqueSlug } from '@/lib/slugify';

// POST /api/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = CreateProjectSchema.parse(body);
    
    // Verify template exists
    const template = await prisma.template.findUnique({
      where: { id: validatedData.templateId },
    });
    
    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }
    
    // Verify user exists or create if needed
    let user = await prisma.user.findUnique({
      where: { id: validatedData.userId },
    });
    
    if (!user) {
      // Create user if doesn't exist
      user = await prisma.user.create({
        data: { id: validatedData.userId },
      });
    }
    
    // Generate unique slug
    const slug = await generateUniqueSlug(validatedData.storeName);
    
    // Create default store config
    const storeConfig = createDefaultStoreConfig(
      validatedData.storeName,
      validatedData.category,
      validatedData.templateId
    );
    
    // Override with user-provided values
    if (validatedData.themeColor) {
      storeConfig.brand.themeColor = validatedData.themeColor;
    }
    if (validatedData.tagline) {
      storeConfig.brand.tagline = validatedData.tagline;
    }
    if (validatedData.logoUrl) {
      storeConfig.brand.logoUrl = validatedData.logoUrl;
    }
    
    // Create project
    const project = await prisma.project.create({
      data: {
        userId: validatedData.userId,
        templateId: validatedData.templateId,
        storeName: validatedData.storeName,
        tagline: validatedData.tagline,
        logoUrl: validatedData.logoUrl,
        category: validatedData.category,
        themeColor: validatedData.themeColor,
        slug,
        storeConfig: JSON.stringify(storeConfig),
      },
      include: {
        template: true,
        products: true,
      },
    });
    
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: (error as any).errors },
        { status: 400 }
      );
    }
    
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/projects - List projects with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query params
    const queryData = ProjectQuerySchema.parse({
      userId: searchParams.get('userId') || undefined,
      status: searchParams.get('status') || undefined,
      category: searchParams.get('category') || undefined,
      limit: searchParams.get('limit') || '10',
      offset: searchParams.get('offset') || '0',
    });
    
    // Build where clause
    const where: Record<string, string> = {};
    if (queryData.userId) where.userId = queryData.userId;
    if (queryData.status) where.status = queryData.status;
    if (queryData.category) where.category = queryData.category;
    
    // Fetch projects with pagination
    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          template: true,
          products: true,
          _count: {
            select: { leads: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: queryData.limit,
        skip: queryData.offset,
      }),
      prisma.project.count({ where }),
    ]);
    
    return NextResponse.json({
      projects,
      pagination: {
        total,
        limit: queryData.limit,
        offset: queryData.offset,
        hasMore: queryData.offset + queryData.limit < total,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: (error as any).errors },
        { status: 400 }
      );
    }
    
    console.error('Error listing projects:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
