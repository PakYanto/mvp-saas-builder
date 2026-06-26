import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding demo project...');

  // Create a demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      id: 'user_demo_01',
      email: 'demo@example.com',
      name: 'Demo User',
      phone: '+6281234567890',
    },
  });
  console.log(`✓ Created user: ${user.name}`);

  // Get the minimal template
  const template = await prisma.template.findUnique({
    where: { id: 'tpl_minimal_01' },
  });

  if (!template) {
    throw new Error('Template not found. Run npm run seed first.');
  }

  // Create store config
  const storeConfig = {
    version: '1.0',
    templateId: 'tpl_minimal_01',
    brand: {
      name: 'Kopi Nusantara',
      tagline: 'Kopi Pilihan dari Berbagai Daerah',
      logoUrl: null,
    },
    sections: {
      hero: {
        enabled: true,
        headline: 'Nikmati Kopi Nusantara Pilihan',
        subheadline: 'Kopi berkualitas dari berbagai daerah di Indonesia, dipanggang sempurna untuk cita rasa terbaik',
        ctaText: 'Lihat Produk',
        backgroundImage: null,
      },
      catalog: {
        enabled: true,
        title: 'Produk Kami',
        layout: 'grid',
      },
      about: {
        enabled: true,
        title: 'Tentang Kami',
        content: 'Kami adalah penikmat kopi yang berkomitmen menghadirkan kopi berkualitas dari berbagai daerah di Indonesia. Setiap biji kopi dipilih dengan cermat dan dipanggang dengan sempurna untuk memberikan pengalaman minum kopi terbaik.',
      },
      contact: {
        enabled: true,
        title: 'Hubungi Kami',
        phone: '+6281234567890',
        whatsapp: '6281234567890',
        email: 'hello@kopinusantara.com',
        address: 'Jl. Kopi No. 123, Jakarta',
      },
      footer: {
        enabled: true,
        copyrightText: '© 2026 Kopi Nusantara. All rights reserved.',
        socialLinks: {
          instagram: 'https://instagram.com/kopinusantara',
          facebook: null,
          twitter: null,
        },
      },
    },
  };

  // Create project
  const project = await prisma.project.upsert({
    where: { slug: 'kopi-nusantara' },
    update: {
      storeConfig: JSON.stringify(storeConfig),
    },
    create: {
      id: 'proj_demo_01',
      userId: user.id,
      templateId: template.id,
      storeName: 'Kopi Nusantara',
      tagline: 'Kopi Pilihan dari Berbagai Daerah',
      category: 'fnb',
      themeColor: '#8B4513',
      slug: 'kopi-nusantara',
      status: 'published',
      storeConfig: JSON.stringify(storeConfig),
    },
  });
  console.log(`✓ Created project: ${project.storeName} (${project.slug})`);

  // Create products
  const products = [
    {
      projectId: project.id,
      name: 'Kopi Aceh Gayo',
      price: 85000,
      description: 'Kopi arabika dari dataran tinggi Gayo dengan aroma khas dan rasa yang kuat',
      imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400',
      sortOrder: 1,
    },
    {
      projectId: project.id,
      name: 'Kopi Toraja',
      price: 95000,
      description: 'Kopi premium dari Sulawesi dengan body yang penuh dan aftertaste manis',
      imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
      sortOrder: 2,
    },
    {
      projectId: project.id,
      name: 'Kopi Java Preanger',
      price: 75000,
      description: 'Kopi robusta pilihan dari Jawa Barat dengan cita rasa yang seimbang',
      imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400',
      sortOrder: 3,
    },
    {
      projectId: project.id,
      name: 'Kopi Bali Kintamani',
      price: 90000,
      description: 'Kopi organik dari Kintamani dengan keasaman yang segar',
      imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
      sortOrder: 4,
    },
    {
      projectId: project.id,
      name: 'Kopi Flores Bajawa',
      price: 100000,
      description: 'Kopi eksotis dari Flores dengan kompleksitas rasa yang unik',
      imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
      sortOrder: 5,
    },
    {
      projectId: project.id,
      name: 'Kopi Papua Wamena',
      price: 120000,
      description: 'Kopi langka dari pegunungan Papua dengan karakter yang kuat',
      imageUrl: 'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?w=400',
      sortOrder: 6,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: {
        id: `prod_${project.id}_${product.sortOrder}`,
      },
      update: product,
      create: {
        id: `prod_${project.id}_${product.sortOrder}`,
        ...product,
      },
    });
    console.log(`  ✓ Added product: ${product.name}`);
  }

  console.log('✅ Demo seeding completed successfully!');
  console.log(`\n🔗 Preview URL: http://localhost:3000/preview/${project.slug}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
