/**
 * prisma/seed.js
 * Run: node prisma/seed.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const ADMIN_EMAIL = 'admin@assetflow.io';
const ADMIN_PASSWORD = 'Admin@1234';

async function main() {
  console.log('🌱  Seeding database...');

  let org = await prisma.organization.findFirst();
  if (!org) {
    org = await prisma.organization.create({
      data: { name: 'AssetFlow Inc.' },
    });
    console.log(`✅  Organization created: ${org.name}`);
  } else {
    console.log(`ℹ️   Organization already exists: ${org.name}`);
  }

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

  // --- Sample Assets (Phase 2) ---
  const laptopCat = await prisma.assetCategory.findFirst({ where: { name: 'Laptops', organizationId: org.id } });
  const monitorCat = await prisma.assetCategory.findFirst({ where: { name: 'Monitors', organizationId: org.id } });
  const furnitureCat = await prisma.assetCategory.findFirst({ where: { name: 'Furniture', organizationId: org.id } });
  const vehicleCat = await prisma.assetCategory.findFirst({ where: { name: 'Vehicles', organizationId: org.id } });

  const sampleAssets = [
    {
      assetTag: 'AF-0001',
      name: 'Dell XPS 15 Laptop',
      categoryId: laptopCat?.id,
      status: 'ALLOCATED',
      condition: 'GOOD',
      serialNumber: 'SN-DXPS-001',
      location: 'Engineering Office',
      isBookable: false,
      acquisitionDate: new Date('2024-01-15'),
      acquisitionCost: 1299.99,
    },
    {
      assetTag: 'AF-0002',
      name: 'MacBook Pro 14"',
      categoryId: laptopCat?.id,
      status: 'AVAILABLE',
      condition: 'NEW',
      serialNumber: 'SN-MBP-002',
      location: 'IT Storage',
      isBookable: false,
      acquisitionDate: new Date('2024-03-10'),
      acquisitionCost: 1999.00,
    },
    {
      assetTag: 'AF-0003',
      name: 'Conference Room Projector',
      categoryId: monitorCat?.id,
      status: 'AVAILABLE',
      condition: 'GOOD',
      serialNumber: 'SN-PROJ-003',
      location: 'Conference Room A',
      isBookable: true,
      acquisitionDate: new Date('2023-11-20'),
      acquisitionCost: 849.00,
    },
    {
      assetTag: 'AF-0004',
      name: 'Shared Testing Device (iPad Pro)',
      categoryId: laptopCat?.id, // Closest match
      status: 'AVAILABLE',
      condition: 'FAIR',
      serialNumber: 'SN-IPAD-004',
      location: 'QA Lab',
      isBookable: true,
      acquisitionDate: new Date('2022-06-01'),
      acquisitionCost: 1100.00,
    },
    {
      assetTag: 'AF-0005',
      name: 'Toyota Innova (Company Vehicle)',
      categoryId: vehicleCat?.id,
      status: 'RETIRED',
      condition: 'DAMAGED',
      serialNumber: 'VIN-TYT-005',
      location: 'Basement Parking',
      isBookable: false,
      acquisitionDate: new Date('2019-04-01'),
      acquisitionCost: 22000.00,
    },
  ];

  for (const a of sampleAssets) {
    if (!a.categoryId) {
      console.log(`⚠️   Skipping asset "${a.name}" — category not found`);
      continue;
    }
    const existing = await prisma.asset.findUnique({ where: { assetTag: a.assetTag } });
    if (!existing) {
      const asset = await prisma.asset.create({
        data: {
          ...a,
          organizationId: org.id,
          registeredById: admin.id,
          statusHistory: {
            create: [{
              fromStatus: null,
              toStatus: a.status,
              reason: 'Asset registered (seed)',
              changedById: admin.id,
            }],
          },
        },
      });
      console.log(`✅  Asset created: ${a.assetTag} — ${a.name}`);

      // Seed an allocation for AF-0001
      if (a.assetTag === 'AF-0001') {
         await prisma.allocation.create({
            data: {
               assetId: asset.id,
               allocatedToEmpId: admin.id,
               allocatedById: admin.id,
               status: 'ACTIVE',
               allocationDate: new Date(),
            }
         });
         console.log(`✅  Allocation created for: ${a.assetTag} to ${admin.name}`);
      }

      // Seed an upcoming booking for AF-0003 (Tomorrow 10:00 - 11:00)
      if (a.assetTag === 'AF-0003') {
         const tomorrow = new Date();
         tomorrow.setDate(tomorrow.getDate() + 1);
         tomorrow.setHours(10, 0, 0, 0);
         
         const tomorrowEnd = new Date(tomorrow);
         tomorrowEnd.setHours(11, 0, 0, 0);

         await prisma.booking.create({
            data: {
               assetId: asset.id,
               bookedById: admin.id,
               startTime: tomorrow,
               endTime: tomorrowEnd,
               purpose: 'Team sync',
               status: 'UPCOMING',
            }
         });
         console.log(`✅  Booking created for: ${a.assetTag}`);
      }

      // Seed a pending maintenance request for AF-0004
      if (a.assetTag === 'AF-0004') {
         await prisma.maintenanceRequest.create({
            data: {
               assetId: asset.id,
               raisedById: admin.id,
               issueDescription: 'Screen flickering occasionally',
               priority: 'MEDIUM',
               status: 'PENDING',
            }
         });
         console.log(`✅  Maintenance request created for: ${a.assetTag}`);
      }

    } else {
      console.log(`ℹ️   Asset already exists: ${a.assetTag}`);
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
