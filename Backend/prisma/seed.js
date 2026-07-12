/**
 * prisma/seed.js
 * Run: node prisma/seed.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const ADMIN_EMAIL = 'admin@assetflow.io';
const ADMIN_PASSWORD = 'Admin@1234';
const DEFAULT_PASSWORD = 'Password@1234';

async function main() {
  console.log('🌱  Clearing database...');

  // Delete records in reverse dependency order to avoid foreign key conflicts
  await prisma.activityLog.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.auditItem.deleteMany({});
  await prisma.auditAssignment.deleteMany({});
  await prisma.auditCycle.deleteMany({});
  await prisma.maintenanceRequest.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.transferRequest.deleteMany({});
  await prisma.allocation.deleteMany({});
  await prisma.assetDocument.deleteMany({});
  await prisma.assetStatusHistory.deleteMany({});
  await prisma.asset.deleteMany({});
  await prisma.assetCategory.deleteMany({});
  await prisma.passwordResetToken.deleteMany({});
  await prisma.employeeRole.deleteMany({});
  
  // Nullify department head reference first to prevent circular dependency blocks
  await prisma.department.updateMany({ data: { headId: null } });
  await prisma.employee.deleteMany({});
  await prisma.department.deleteMany({});
  await prisma.organization.deleteMany({});

  console.log('🌱  Database cleared.');
  console.log('🌱  Seeding database...');

  // 1. Create Organization
  const org = await prisma.organization.create({
    data: { name: 'AssetFlow Inc.' },
  });
  console.log(`✅  Organization created: ${org.name}`);

  // 2. Create Departments
  const departmentsList = [
    { name: 'IT Department', status: 'ACTIVE' },
    { name: 'Finance Department', status: 'ACTIVE' },
    { name: 'HR Department', status: 'ACTIVE' },
    { name: 'Marketing Department', status: 'ACTIVE' },
    { name: 'Operations Department', status: 'ACTIVE' },
    { name: 'Facilities Department', status: 'INACTIVE' },
    { name: 'Design Department', status: 'ACTIVE' },
    { name: 'Sales Department', status: 'ACTIVE' },
    { name: 'Admin Department', status: 'ACTIVE' },
    { name: 'Engineering', status: 'ACTIVE' },
  ];

  const depts = {};
  for (const dept of departmentsList) {
    const createdDept = await prisma.department.create({
      data: {
        name: dept.name,
        status: dept.status,
        organizationId: org.id,
      },
    });
    depts[dept.name] = createdDept;
    console.log(`✅  Department created: ${createdDept.name}`);
  }

  // 3. Create Categories
  const categoriesList = [
    { name: 'Laptops', description: 'All portable computers', customFields: { warrantyPeriodMonths: 24 } },
    { name: 'Monitors', description: 'Display screens and monitors', customFields: { warrantyPeriodMonths: 36 } },
    { name: 'Furniture', description: 'Office furniture and fixtures', customFields: null },
    { name: 'Vehicles', description: 'Company-owned vehicles', customFields: { insuranceRequired: true } },
    { name: 'Equipment', description: 'Office and lab equipment', customFields: null },
    { name: 'Conference Rooms', description: 'Shared meeting spaces', customFields: null },
    { name: 'Office Equipment', description: 'Printers, scanners, and accessories', customFields: null },
    { name: 'Furniture & Fixtures', description: 'Desks, chairs, and cupboards', customFields: null },
    { name: 'Electrical Assets', description: 'UPS, routers, and electrical units', customFields: null },
    { name: 'Others', description: 'Miscellaneous asset categories', customFields: null },
  ];

  const categories = {};
  for (const cat of categoriesList) {
    const createdCat = await prisma.assetCategory.create({
      data: {
        name: cat.name,
        description: cat.description,
        customFields: cat.customFields,
        organizationId: org.id,
      },
    });
    categories[cat.name] = createdCat;
    console.log(`✅  Category created: ${createdCat.name}`);
  }

  // Hash passwords
  const adminHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const defaultHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  // 4. Create Employees
  const employeesList = [
    {
      name: 'System Admin',
      email: ADMIN_EMAIL,
      passwordHash: adminHash,
      role: 'ADMIN',
      deptName: 'IT Department',
      status: 'ACTIVE',
    },
    {
      name: 'Priya Shah',
      email: 'priya.shah@flowsync.com',
      passwordHash: defaultHash,
      role: 'ADMIN',
      deptName: 'IT Department',
      status: 'ACTIVE',
    },
    {
      name: 'Rohan Mehta',
      email: 'rohan.mehta@flowsync.com',
      passwordHash: defaultHash,
      role: 'ASSET_MANAGER',
      deptName: 'Finance Department',
      status: 'ACTIVE',
    },
    {
      name: 'Neha Patil',
      email: 'neha.patil@flowsync.com',
      passwordHash: defaultHash,
      role: 'DEPARTMENT_HEAD',
      deptName: 'HR Department',
      status: 'ACTIVE',
    },
    {
      name: 'Ankit Verma',
      email: 'ankit.verma@flowsync.com',
      passwordHash: defaultHash,
      role: 'EMPLOYEE',
      deptName: 'Marketing Department',
      status: 'ACTIVE',
    },
    {
      name: 'Sanjay Kumar',
      email: 'sanjay.kumar@flowsync.com',
      passwordHash: defaultHash,
      role: 'EMPLOYEE',
      deptName: 'Operations Department',
      status: 'ACTIVE',
    },
    {
      name: 'Vikram Singh',
      email: 'vikram.singh@flowsync.com',
      passwordHash: defaultHash,
      role: 'EMPLOYEE',
      deptName: 'Facilities Department',
      status: 'INACTIVE',
    },
    {
      name: 'Amit Sharma',
      email: 'amit.sharma@flowsync.com',
      passwordHash: defaultHash,
      role: 'EMPLOYEE',
      deptName: 'IT Department',
      status: 'ACTIVE',
    },
    {
      name: 'Sneha Roy',
      email: 'sneha.roy@flowsync.com',
      passwordHash: defaultHash,
      role: 'DEPARTMENT_HEAD',
      deptName: 'HR Department',
      status: 'ACTIVE',
    },
    {
      name: 'Karan Mehta',
      email: 'karan.mehta@flowsync.com',
      passwordHash: defaultHash,
      role: 'EMPLOYEE',
      deptName: 'Finance Department',
      status: 'ACTIVE',
    },
    {
      name: 'Rahul Verma',
      email: 'rahul.verma@flowsync.com',
      passwordHash: defaultHash,
      role: 'EMPLOYEE',
      deptName: 'IT Department',
      status: 'ACTIVE',
    },
    {
      name: 'Neha Kapoor',
      email: 'neha.kapoor@flowsync.com',
      passwordHash: defaultHash,
      role: 'EMPLOYEE',
      deptName: 'Marketing Department',
      status: 'ACTIVE',
    },
    {
      name: 'Rajesh Gupta',
      email: 'rajesh.gupta@flowsync.com',
      passwordHash: defaultHash,
      role: 'EMPLOYEE',
      deptName: 'Admin Department',
      status: 'ACTIVE',
    },
    {
      name: 'John Doe',
      email: 'john.doe@flowsync.com',
      passwordHash: defaultHash,
      role: 'EMPLOYEE',
      deptName: 'Engineering',
      status: 'ACTIVE',
    },
  ];

  const employees = {};
  for (const emp of employeesList) {
    const createdEmp = await prisma.employee.create({
      data: {
        name: emp.name,
        email: emp.email,
        passwordHash: emp.passwordHash,
        status: emp.status,
        organizationId: org.id,
        departmentId: depts[emp.deptName]?.id || null,
        roles: {
          create: [{ role: emp.role }],
        },
      },
    });
    employees[emp.email] = createdEmp;
    console.log(`✅  Employee created: ${createdEmp.name} (${createdEmp.email})`);
  }

  // 5. Update Department Heads
  const deptHeadsMapping = [
    { deptName: 'IT Department', headEmail: 'priya.shah@flowsync.com' },
    { deptName: 'Finance Department', headEmail: 'rohan.mehta@flowsync.com' },
    { deptName: 'HR Department', headEmail: 'neha.patil@flowsync.com' },
    { deptName: 'Marketing Department', headEmail: 'sneha.roy@flowsync.com' },
    { deptName: 'Operations Department', headEmail: 'sanjay.kumar@flowsync.com' },
    { deptName: 'Facilities Department', headEmail: 'vikram.singh@flowsync.com' },
  ];

  for (const mapping of deptHeadsMapping) {
    const dept = depts[mapping.deptName];
    const head = employees[mapping.headEmail];
    if (dept && head) {
      await prisma.department.update({
        where: { id: dept.id },
        data: { headId: head.id },
      });
      console.log(`✅  Department Head set: ${dept.name} -> ${head.name}`);
    }
  }

  // 6. Create Assets
  const assetsList = [
    {
      assetTag: 'AF-0001',
      name: 'Dell XPS 15 Laptop',
      catName: 'Laptops',
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
      catName: 'Laptops',
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
      catName: 'Equipment',
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
      catName: 'Laptops',
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
      catName: 'Vehicles',
      status: 'RETIRED',
      condition: 'DAMAGED',
      serialNumber: 'VIN-TYT-005',
      location: 'Basement Parking',
      isBookable: false,
      acquisitionDate: new Date('2019-04-01'),
      acquisitionCost: 22000.00,
    },
    {
      assetTag: 'AF-0006',
      name: 'Dell XPS 13',
      catName: 'Laptops',
      status: 'AVAILABLE',
      condition: 'GOOD',
      serialNumber: 'SN-DXPS-130',
      location: 'IT Lab',
      isBookable: true,
      acquisitionDate: new Date('2024-02-15'),
      acquisitionCost: 999.99,
    },
    {
      assetTag: 'AF-0007',
      name: 'Meeting Room A',
      catName: 'Conference Rooms',
      status: 'AVAILABLE',
      condition: 'GOOD',
      serialNumber: 'SN-MROOM-A',
      location: 'HQ - Floor 1',
      isBookable: true,
      acquisitionDate: new Date('2022-01-10'),
      acquisitionCost: 5000.00,
    },
    {
      assetTag: 'AF-0008',
      name: 'Epson Projector',
      catName: 'Equipment',
      status: 'AVAILABLE',
      condition: 'GOOD',
      serialNumber: 'SN-EPS-008',
      location: 'HQ - Floor 2',
      isBookable: true,
      acquisitionDate: new Date('2023-05-18'),
      acquisitionCost: 750.00,
    },
    {
      assetTag: 'AF-0009',
      name: 'Canon DSLR Camera',
      catName: 'Equipment',
      status: 'AVAILABLE',
      condition: 'GOOD',
      serialNumber: 'SN-CANON-009',
      location: 'Marketing Room',
      isBookable: true,
      acquisitionDate: new Date('2023-08-25'),
      acquisitionCost: 1500.00,
    },
    {
      assetTag: 'AF-0010',
      name: 'Company Car - HR',
      catName: 'Vehicles',
      status: 'AVAILABLE',
      condition: 'GOOD',
      serialNumber: 'SN-CAR-010',
      location: 'Garage',
      isBookable: true,
      acquisitionDate: new Date('2021-06-15'),
      acquisitionCost: 18000.00,
    },
  ];

  const adminUser = employees[ADMIN_EMAIL];
  const assets = {};
  for (const assetData of assetsList) {
    const createdAsset = await prisma.asset.create({
      data: {
        assetTag: assetData.assetTag,
        name: assetData.name,
        categoryId: categories[assetData.catName].id,
        status: assetData.status,
        condition: assetData.condition,
        serialNumber: assetData.serialNumber,
        location: assetData.location,
        isBookable: assetData.isBookable,
        acquisitionDate: assetData.acquisitionDate,
        acquisitionCost: assetData.acquisitionCost,
        organizationId: org.id,
        registeredById: adminUser.id,
        statusHistory: {
          create: [{
            fromStatus: null,
            toStatus: assetData.status,
            reason: 'Asset registered (seed)',
            changedById: adminUser.id,
          }],
        },
      },
    });
    assets[assetData.assetTag] = createdAsset;
    console.log(`✅  Asset created: ${createdAsset.assetTag} — ${createdAsset.name}`);
  }

  // 7. Seed allocations
  // Allocate Dell XPS 15 (AF-0001) to Amit Sharma
  const amitUser = employees['amit.sharma@flowsync.com'];
  if (amitUser && assets['AF-0001']) {
    await prisma.allocation.create({
      data: {
        assetId: assets['AF-0001'].id,
        allocatedToEmpId: amitUser.id,
        allocatedById: adminUser.id,
        status: 'ACTIVE',
        allocationDate: new Date(),
      }
    });
    console.log(`✅  Allocation created for: AF-0001 to ${amitUser.name}`);
  }

  // 8. Seed Bookings
  // Let's seed the bookings from the mock JSON to make it look realistic!
  const bookingsDataList = [
    {
      assetTag: 'AF-0006', // Dell XPS 13
      email: 'priya.shah@flowsync.com',
      purpose: 'Client Presentation',
      daysOffset: 0, // today
      startHour: 10,
      endHour: 13,
      status: 'ONGOING',
    },
    {
      assetTag: 'AF-0007', // Meeting Room A
      email: 'rohan.mehta@flowsync.com',
      purpose: 'Team Meeting',
      daysOffset: 0, // today
      startHour: 14,
      endHour: 16,
      status: 'UPCOMING',
    },
    {
      assetTag: 'AF-0008', // Epson Projector
      email: 'ankit.verma@flowsync.com',
      purpose: 'Design Review',
      daysOffset: 1, // tomorrow
      startHour: 11,
      endHour: 13,
      status: 'UPCOMING',
    },
    {
      assetTag: 'AF-0009', // Canon DSLR Camera
      email: 'neha.patil@flowsync.com',
      purpose: 'Product Photoshoot',
      daysOffset: 1, // tomorrow
      startHour: 15,
      endHour: 18,
      status: 'UPCOMING',
    },
    {
      assetTag: 'AF-0010', // Company Car - HR
      email: 'sanjay.kumar@flowsync.com',
      purpose: 'Office Visit',
      daysOffset: -2, // 2 days ago
      startHour: 9,
      endHour: 17,
      status: 'COMPLETED',
    },
    {
      assetTag: 'AF-0006', // Dell XPS 13
      email: 'john.doe@flowsync.com',
      purpose: 'System Setup',
      daysOffset: -5, // 5 days ago
      startHour: 9,
      endHour: 12,
      status: 'COMPLETED',
    },
  ];

  for (const b of bookingsDataList) {
    const asset = assets[b.assetTag];
    const user = employees[b.email];
    if (asset && user) {
      const startTime = new Date();
      startTime.setDate(startTime.getDate() + b.daysOffset);
      startTime.setHours(b.startHour, 0, 0, 0);

      const endTime = new Date();
      endTime.setDate(endTime.getDate() + b.daysOffset);
      endTime.setHours(b.endHour, 0, 0, 0);

      await prisma.booking.create({
        data: {
          assetId: asset.id,
          bookedById: user.id,
          startTime,
          endTime,
          purpose: b.purpose,
          status: b.status,
        }
      });
      console.log(`✅  Booking created: ${asset.name} for ${user.name}`);
    }
  }

  // 9. Seed Maintenance Requests
  // Seed pending maintenance request for AF-0004
  if (assets['AF-0004']) {
    await prisma.maintenanceRequest.create({
      data: {
        assetId: assets['AF-0004'].id,
        raisedById: employees['john.doe@flowsync.com'].id,
        issueDescription: 'Screen flickering occasionally and home button is non-responsive.',
        priority: 'MEDIUM',
        status: 'PENDING',
      }
    });
    console.log(`✅  Maintenance request created for: AF-0004`);
  }

  // Seed active maintenance request for AF-0005
  if (assets['AF-0005']) {
    await prisma.maintenanceRequest.create({
      data: {
        assetId: assets['AF-0005'].id,
        raisedById: employees['priya.shah@flowsync.com'].id,
        issueDescription: 'Bumper damaged due to parking collision.',
        priority: 'HIGH',
        status: 'APPROVED',
      }
    });
    console.log(`✅  Maintenance request created for: AF-0005`);
  }

  // 10. Seed Audit Cycles
  const auditCycle = await prisma.auditCycle.create({
    data: {
      name: 'Q2 2026 Asset Inventory',
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      status: 'IN_PROGRESS',
      organizationId: org.id,
    }
  });
  console.log(`✅  Audit Cycle created: ${auditCycle.name}`);

  // Assign Rohan Mehta as the Auditor
  const rohanUser = employees['rohan.mehta@flowsync.com'];
  if (rohanUser) {
    await prisma.auditAssignment.create({
      data: {
        auditCycleId: auditCycle.id,
        auditorId: rohanUser.id,
      }
    });
    console.log(`✅  Audit Assignment created for: ${rohanUser.name}`);
  }

  // Add some assets to the Audit Cycle
  const auditAssets = ['AF-0001', 'AF-0002', 'AF-0003', 'AF-0006'];
  for (const tag of auditAssets) {
    const asset = assets[tag];
    if (asset) {
      await prisma.auditItem.create({
        data: {
          auditCycleId: auditCycle.id,
          assetId: asset.id,
          result: 'PENDING',
        }
      });
      console.log(`✅  Audit Item added: ${asset.name}`);
    }
  }

  console.log('\n🎉  Seed complete!');
  console.log(`\n📋  Credentials:`);
  console.log(`    Admin Email:    ${ADMIN_EMAIL}`);
  console.log(`    Admin Password: ${ADMIN_PASSWORD}`);
  console.log(`    Other Users:    Password@1234 (e.g. priya.shah@flowsync.com, rohan.mehta@flowsync.com, etc.)`);
}

main()
  .catch((e) => {
    console.error('❌  Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
