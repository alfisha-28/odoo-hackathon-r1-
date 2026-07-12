const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting Faker generation for large dataset...');
  
  const org = await prisma.organization.findFirst();
  if (!org) {
    console.log('❌ No organization found. Please run npm run db:seed first.');
    return;
  }

  const departments = await prisma.department.findMany({ where: { organizationId: org.id } });
  const categories = await prisma.assetCategory.findMany({ where: { organizationId: org.id } });
  const defaultHash = await bcrypt.hash('Password@1234', 10);
  const admin = await prisma.employee.findFirst({ where: { email: 'admin@assetflow.io' } });

  if (!departments.length || !categories.length || !admin) {
    console.log('❌ Missing required baseline data (departments, categories, or admin). Run db:seed first.');
    return;
  }

  // 1. Generate Employees
  console.log('👥 Generating 100 new employees...');
  for (let i = 0; i < 100; i++) {
    const dept = faker.helpers.arrayElement(departments);
    const role = faker.helpers.arrayElement(['EMPLOYEE', 'EMPLOYEE', 'EMPLOYEE', 'ASSET_MANAGER', 'DEPARTMENT_HEAD']);
    
    await prisma.employee.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email({ provider: 'flowsync.fake' }),
        passwordHash: defaultHash,
        status: faker.helpers.arrayElement(['ACTIVE', 'ACTIVE', 'ACTIVE', 'INACTIVE']),
        organizationId: org.id,
        departmentId: dept.id,
        roles: {
          create: [{ role: role }],
        },
      }
    });
  }

  const allEmployees = await prisma.employee.findMany();

  // 2. Generate Assets
  console.log('📦 Generating 200 new assets...');
  for (let i = 0; i < 200; i++) {
    const cat = faker.helpers.arrayElement(categories);
    const status = faker.helpers.arrayElement(['AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'ALLOCATED', 'UNDER_MAINTENANCE', 'RETIRED']);
    
    const asset = await prisma.asset.create({
      data: {
        assetTag: `AF-F-${faker.string.numeric(5)}-${i}`,
        name: faker.commerce.productName(),
        categoryId: cat.id,
        status: status,
        condition: faker.helpers.arrayElement(['NEW', 'GOOD', 'GOOD', 'FAIR', 'DAMAGED']),
        serialNumber: faker.string.uuid(),
        location: `Room ${faker.number.int({ min: 101, max: 599 })}`,
        isBookable: faker.datatype.boolean(),
        acquisitionDate: faker.date.past({ years: 3 }),
        acquisitionCost: faker.commerce.price({ min: 100, max: 5000 }),
        organizationId: org.id,
        registeredById: admin.id,
      }
    });

    // If allocated, create an allocation record
    if (status === 'ALLOCATED') {
      const emp = faker.helpers.arrayElement(allEmployees);
      await prisma.allocation.create({
        data: {
          assetId: asset.id,
          allocatedToEmpId: emp.id,
          allocatedById: admin.id,
          status: 'ACTIVE',
          allocationDate: faker.date.recent({ days: 30 }),
        }
      });
    }

    // If under maintenance, create a maintenance request
    if (status === 'UNDER_MAINTENANCE') {
      const emp = faker.helpers.arrayElement(allEmployees);
      await prisma.maintenanceRequest.create({
        data: {
          assetId: asset.id,
          raisedById: emp.id,
          issueDescription: faker.hacker.phrase(),
          priority: faker.helpers.arrayElement(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
          status: 'APPROVED',
        }
      });
    }
  }

  // 3. Generate Bookings for bookable assets
  console.log('📅 Generating 50 bookings...');
  const bookableAssets = await prisma.asset.findMany({ where: { isBookable: true } });
  for (let i = 0; i < 50; i++) {
    if (bookableAssets.length === 0) break;
    const asset = faker.helpers.arrayElement(bookableAssets);
    const emp = faker.helpers.arrayElement(allEmployees);
    
    const startTime = faker.date.soon({ days: 7 });
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + faker.number.int({ min: 1, max: 4 }));

    await prisma.booking.create({
      data: {
        assetId: asset.id,
        bookedById: emp.id,
        startTime: startTime,
        endTime: endTime,
        purpose: faker.company.catchPhrase(),
        status: faker.helpers.arrayElement(['UPCOMING', 'ONGOING', 'COMPLETED']),
      }
    });
  }

  console.log('✅ Faker seed completed successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
