import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/preview/[slug] - Get project by slug for preview
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        template: true,
        products: {
          orderBy: { sortOrder: 'asc' },
        },
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
      },
    });
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    // Only show published projects in preview (optional security)
    // Uncomment if you want to restrict preview to published projects
    // if (project.status !== 'published') {
    //   return NextResponse.json(
    //     { error: 'Project not available' },
    //     { status: 403 }
    //   );
    // }
    
    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project preview:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
