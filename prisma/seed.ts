import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create templates
  const templates = [
    {
      id: 'tpl_minimal_01',
      name: 'Minimal Modern',
      category: 'minimal',
      previewImageUrl: '/templates/minimal-preview.jpg',
      defaultConfig: JSON.stringify({
        theme: 'light',
        layout: 'single-page',
        sections: ['hero', 'products', 'contact'],
        colors: {
          primary: '#000000',
          secondary: '#FFFFFF',
          accent: '#666666',
        },
      }),
    },
    {
      id: 'tpl_fashion_01',
      name: 'Fashion Boutique',
      category: 'fashion',
      previewImageUrl: '/templates/fashion-preview.jpg',
      defaultConfig: JSON.stringify({
        theme: 'elegant',
        layout: 'grid',
        sections: ['hero', 'featured', 'products', 'about', 'contact'],
        colors: {
          primary: '#8B4513',
          secondary: '#F5F5DC',
          accent: '#DAA520',
        },
      }),
    },
    {
      id: 'tpl_fnb_01',
      name: 'Food & Beverage',
      category: 'fnb',
      previewImageUrl: '/templates/fnb-preview.jpg',
      defaultConfig: JSON.stringify({
        theme: 'warm',
        layout: 'menu-style',
        sections: ['hero', 'menu', 'specials', 'location', 'contact'],
        colors: {
          primary: '#DC2626',
          secondary: '#FEF3C7',
          accent: '#F59E0B',
        },
      }),
    },
  ];

  for (const template of templates) {
    await prisma.template.upsert({
      where: { id: template.id },
      update: template,
      create: template,
    });
    console.log(`✓ Created template: ${template.name} (${template.id})`);
  }

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
