const prisma = require('../../config/prisma');

const INCLUDE_EMPLOYEE = {
  roles: { select: { role: true } },
  department: { select: { id: true, name: true } },
};

const findEmployees = ({ organizationId, search, role, status, skip, take }) => {
  const where = {
    organizationId,
    ...(status && { status }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ],
    }),
    ...(role && {
      roles: { some: { role } },
    }),
  };

  return Promise.all([
    prisma.employee.findMany({ where, include: INCLUDE_EMPLOYEE, skip, take, orderBy: { createdAt: 'asc' } }),
    prisma.employee.count({ where }),
  ]);
};

const findEmployeeById = (id) => {
  return prisma.employee.findUnique({ where: { id }, include: INCLUDE_EMPLOYEE });
};

const updateEmployee = (id, { status, passwordHash }) => {
  return prisma.employee.update({
    where: { id },
    data: {
      ...(status && { status }),
      ...(passwordHash && { passwordHash }),
    },
    include: INCLUDE_EMPLOYEE,
  });
};

const replaceEmployeeRoles = async (employeeId, roles, assignedById) => {
  // Delete all existing roles then create the new set in a transaction
  return prisma.$transaction([
    prisma.employeeRole.deleteMany({ where: { employeeId } }),
    ...roles.map((role) =>
      prisma.employeeRole.create({ data: { employeeId, role, assignedBy: assignedById } })
    ),
  ]);
};

module.exports = { findEmployees, findEmployeeById, updateEmployee, replaceEmployeeRoles };
