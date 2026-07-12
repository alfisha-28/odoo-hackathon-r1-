const asyncHandler = require('../../lib/asyncHandler');
const ApiResponse = require('../../lib/ApiResponse');
const { listCategories, saveCategory } = require('./categories.service');

const list = asyncHandler(async (req, res) => {
  const categories = await listCategories(req.employee.organizationId);
  ApiResponse.success(res, { categories });
});

const upsert = asyncHandler(async (req, res) => {
  const { id, name, description, customFields } = req.body;
  const category = await saveCategory({
    id,
    name,
    description,
    customFields,
    organizationId: req.employee.organizationId,
  });
  const isNew = !req.body.id;
  if (isNew) {
    ApiResponse.created(res, { category }, 'Category created');
  } else {
    ApiResponse.success(res, { category }, 'Category updated');
  }
});

module.exports = { list, upsert };
