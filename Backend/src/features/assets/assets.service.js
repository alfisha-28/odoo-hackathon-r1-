const {
  findAssets,
  findAssetById,
  findCategoryById,
  createAsset,
  updateAsset,
} = require('./assets.repository');
const { mapAssetList, mapAssetDetail } = require('./assets.mapper');
const { getPaginationData } = require('../../common/helpers/pagination.helper');
const ApiError = require('../../lib/ApiError');

const PHASE3_OWNED_STATUSES = ['ALLOCATED', 'UNDER_MAINTENANCE'];

const listAssets = async ({ organizationId, search, status, categoryId, departmentId, location, page, limit }) => {
  const { skip, take } = getPaginationData(page, limit, 0);
  const [assets, total] = await findAssets({ organizationId, search, status, categoryId, departmentId, location, skip, take });
  const { meta } = getPaginationData(page, limit, total);

  return {
    data: assets.map(mapAssetList),
    meta,
  };
};

const getAssetById = async (id, organizationId) => {
  const asset = await findAssetById(id, organizationId);
  if (!asset) throw ApiError.notFound('Asset not found');
  return mapAssetDetail(asset);
};

const registerAsset = async ({
  name, categoryId, serialNumber, acquisitionDate, acquisitionCost,
  condition, location, isBookable, photoUrls, organizationId, registeredById,
}) => {
  const category = await findCategoryById(categoryId, organizationId);
  if (!category) throw ApiError.badRequest('Category not found or does not belong to your organization');

  const asset = await createAsset({
    name, categoryId, serialNumber, acquisitionDate, acquisitionCost,
    condition, location, isBookable, photoUrls, organizationId, registeredById,
  });

  return mapAssetDetail(asset);
};

const patchAsset = async ({ id, organizationId, changedById, updates }) => {
  const existing = await findAssetById(id, organizationId);
  if (!existing) throw ApiError.notFound('Asset not found');

  if (updates.status && PHASE3_OWNED_STATUSES.includes(updates.status)) {
    throw ApiError.badRequest('Use the allocation/maintenance workflow to change this status');
  }

  const asset = await updateAsset(id, {
    ...updates,
    changedById,
    currentStatus: existing.status,
  });

  return mapAssetDetail(asset);
};

module.exports = { listAssets, getAssetById, registerAsset, patchAsset };
