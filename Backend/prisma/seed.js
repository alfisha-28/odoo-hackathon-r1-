/**
 * prisma/seed.js
 * Seeds one Organization, one Admin employee, departments, and categories.
 * Run with: npx prisma db seed
 * Or directly: node prisma/seed.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const ADMIN_EMAIL = 'admin@assetflow.io';
const ADMIN_PASSWORD = 'Admin@1234';

async function main() {
  console.log('🌱  Seeding database...');

  // --- Organization ---
  let org = await prisma.organization.findFirst();
  if (!org) {
    org = await prisma.organization.create({
      data: { name: 'AssetFlow Inc.' },
    });
    console.log(`✅  Organization created: ${org.name}`);
  } else {
    console.log(`ℹ️   Organization already exists: ${org.name}`);
  }

  // --- Admin Employee ---
  let admin = await prisma.employee.findUnique({ where: { email: ADMIN_EMAIL } });
  if (!admin) {
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    admin = await prisma.employee.create({
      data: {
        name: 'System Admin',
        email: ADMIN_EMAIL,
        passwordHash,
        organizationId: org.id,
        roles: {
          create: [{ role: 'ADMIN' }],
        },
      },
    });
    console.log(`✅  Admin employee created: ${admin.email} / password: ${ADMIN_PASSWORD}`);
  } else {
    console.log(`ℹ️   Admin already exists: ${admin.email}`);
  }

  // --- Departments ---
  const deptData = [
    { name: 'Engineering', status: 'ACTIVE' },
    { name: 'Operations', status: 'ACTIVE' },
    { name: 'Human Resources', status: 'ACTIVE' },
  ];

  for (const d of deptData) {
    const existing = await prisma.department.findFirst({ where: { name: d.name, organizationId: org.id } });
    if (!existing) {
      await prisma.department.create({ data: { ...d, organizationId: org.id } });
      console.log(`✅  Department created: ${d.name}`);
    } else {
      console.log(`ℹ️   Department already exists: ${d.name}`);
    }
  }

  // --- Asset Categories ---
  const categoryData = [
    { name: 'Laptops', description: 'All portable computers', customFields: { warrantyPeriodMonths: 24 } },
    { name: 'Monitors', description: 'Display screens and monitors', customFields: { warrantyPeriodMonths: 36 } },
    { name: 'Furniture', description: 'Office furniture and fixtures', customFields: null },
    { name: 'Vehicles', description: 'Company-owned vehicles', customFields: { insuranceRequired: true } },
  ];

  for (const c of categoryData) {
    const existing = await prisma.assetCategory.findFirst({ where: { name: c.name, organizationId: org.id } });
    if (!existing) {
      await prisma.assetCategory.create({ data: { ...c, organizationId: org.id } });
      console.log(`✅  Category created: ${c.name}`);
    } else {
      console.log(`ℹ️   Category already exists: ${c.name}`);
    }
  }

  console.log('\n🎉  Seed complete!');
  console.log(`\n📋  Admin credentials:`);
  console.log(`    Email:    ${ADMIN_EMAIL}`);
  console.log(`    Password: ${ADMIN_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error('❌  Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
