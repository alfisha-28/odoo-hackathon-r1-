const asyncHandler = require('../../lib/asyncHandler');
const ApiResponse = require('../../lib/ApiResponse');
const { listAssets, getAssetById, registerAsset, patchAsset } = require('./assets.service');

// GET /api/assets
const list = asyncHandler(async (req, res) => {
  const { search, status, categoryId, departmentId, location, page, limit } = req.query;
  const result = await listAssets({
    organizationId: req.employee.organizationId,
    search,
    status,
    categoryId,
    departmentId,
    location,
    page: page ?? 1,
    limit: limit ?? 20,
  });
  ApiResponse.success(res, result);
});

// GET /api/assets/:id
const detail = asyncHandler(async (req, res) => {
  const asset = await getAssetById(req.params.id, req.employee.organizationId);
  ApiResponse.success(res, { asset });
});

// POST /api/assets
const create = asyncHandler(async (req, res) => {
  const {
    name, categoryId, serialNumber, acquisitionDate, acquisitionCost,
    condition, location, isBookable, photoUrls,
  } = req.body;

  const asset = await registerAsset({
    name,
    categoryId,
    serialNumber,
    acquisitionDate,
    acquisitionCost,
    condition,
    location,
    isBookable,
    photoUrls: photoUrls ?? [],
    organizationId: req.employee.organizationId,
    registeredById: req.employee.id,
  });

  ApiResponse.created(res, { asset }, 'Asset registered successfully');
});

// PATCH /api/assets/:id
const update = asyncHandler(async (req, res) => {
  const { name, condition, location, isBookable, status } = req.body;

  const asset = await patchAsset({
    id: req.params.id,
    organizationId: req.employee.organizationId,
    changedById: req.employee.id,
    updates: {
      ...(name !== undefined && { name }),
      ...(condition !== undefined && { condition }),
      ...(location !== undefined && { location }),
      ...(isBookable !== undefined && { isBookable }),
      ...(status !== undefined && { status }),
    },
  });

  ApiResponse.success(res, { asset }, 'Asset updated');
});

module.exports = { list, detail, create, update };
