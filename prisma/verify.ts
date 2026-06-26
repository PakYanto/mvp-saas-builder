import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verify() {
  console.log('🔍 Verifying database...\n');

  // Check templates
  const templates = await prisma.template.findMany();
  console.log(`Found ${templates.length} templates:`);
  templates.forEach((t) => {
    console.log(`  - ${t.name} (${t.id}) - Category: ${t.category}`);
  });

  // Check table counts
  const userCount = await prisma.user.count();
  const projectCount = await prisma.project.count();
  const productCount = await prisma.product.count();
  const leadCount = await prisma.lead.count();

  console.log('\n📊 Database statistics:');
  console.log(`  Users: ${userCount}`);
  console.log(`  Projects: ${projectCount}`);
  console.log(`  Products: ${productCount}`);
  console.log(`  Leads: ${leadCount}`);
  console.log(`  Templates: ${templates.length}`);

  console.log('\n✅ Verification complete!');
}

verify()
  .catch((e) => {
    console.error('❌ Verification failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
