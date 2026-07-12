const { findAllCategories, findCategoryById, upsertCategory } = require('./categories.repository');
const { mapCategory } = require('./categories.mapper');
const ApiError = require('../../lib/ApiError');

const listCategories = async (organizationId) => {
  const categories = await findAllCategories(organizationId);
  return categories.map(mapCategory);
};

const saveCategory = async ({ id, name, description, customFields, organizationId }) => {
  if (id) {
    const existing = await findCategoryById(id);
    if (!existing) throw ApiError.notFound('Category not found');
  }

  const category = await upsertCategory({ id, name, description, customFields, organizationId });
  return mapCategory(category);
};

module.exports = { listCategories, saveCategory };
