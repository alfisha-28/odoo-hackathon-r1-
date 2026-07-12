const prisma = require('../../config/prisma');

const INCLUDE_HEAD = { head: { select: { id: true, name: true } } };

const findAllDepartments = (organizationId) => {
  return prisma.department.findMany({
    where: { organizationId },
    include: INCLUDE_HEAD,
    orderBy: { createdAt: 'asc' },
  });
};

const findDepartmentById = (id) => {
  return prisma.department.findUnique({ where: { id }, include: INCLUDE_HEAD });
};

const upsertDepartment = ({ id, name, parentId, headId, status, organizationId }) => {
  if (id) {
    // Update
    return prisma.department.update({
      where: { id },
      data: {
        name,
        status,
        ...(parentId !== undefined && { parentId }),
        ...(headId !== undefined && { headId }),
      },
      include: INCLUDE_HEAD,
    });
  }
  // Create
  return prisma.department.create({
    data: {
      name,
      status: status || 'ACTIVE',
      organizationId,
      ...(parentId && { parentId }),
      ...(headId && { headId }),
    },
    include: INCLUDE_HEAD,
  });
};

module.exports = { findAllDepartments, findDepartmentById, upsertDepartment };
