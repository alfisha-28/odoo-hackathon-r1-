const prisma = require('../../config/prisma');

const findAllCategories = (organizationId) => {
  return prisma.assetCategory.findMany({
    where: { organizationId },
    orderBy: { createdAt: 'asc' },
  });
};

const findCategoryById = (id) => {
  return prisma.assetCategory.findUnique({ where: { id } });
};

const upsertCategory = ({ id, name, description, customFields, organizationId }) => {
  if (id) {
    return prisma.assetCategory.update({
      where: { id },
      data: {
        name,
        ...(description !== undefined && { description }),
        ...(customFields !== undefined && { customFields }),
      },
    });
  }
  return prisma.assetCategory.create({
    data: {
      name,
      organizationId,
      description: description ?? null,
      customFields: customFields ?? null,
    },
  });
};

module.exports = { findAllCategories, findCategoryById, upsertCategory };
