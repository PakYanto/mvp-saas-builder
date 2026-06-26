import { PrismaClient } from '@prisma/client';
import { StoreConfig, StoreData } from '@/types/store-config';

const prisma = new PrismaClient();

export async function getProjectBySlug(slug: string): Promise<StoreData | null> {
  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      products: {
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  if (!project) {
    return null;
  }

  // Parse the store config
  const config: StoreConfig = JSON.parse(project.storeConfig);

  return {
    config,
    products: project.products.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      description: p.description,
      imageUrl: p.imageUrl,
      sortOrder: p.sortOrder,
    })),
    themeColor: project.themeColor,
    storeName: project.storeName,
    slug: project.slug,
  };
}
