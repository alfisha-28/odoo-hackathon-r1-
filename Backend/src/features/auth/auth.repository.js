const prisma = require('../../config/prisma');

const findEmployeeByEmail = (email) => {
  return prisma.employee.findUnique({
    where: { email },
    include: { roles: { select: { role: true } } },
  });
};

const findFirstOrganization = () => {
  return prisma.organization.findFirst();
};

const createEmployee = ({ name, email, passwordHash, organizationId }) => {
  return prisma.employee.create({
    data: {
      name,
      email,
      passwordHash,
      organization: { connect: { id: organizationId } },
      roles: {
        create: [{ role: 'EMPLOYEE' }],
      },
    },
    include: { roles: { select: { role: true } } },
  });
};

module.exports = { findEmployeeByEmail, findFirstOrganization, createEmployee };
