const mapAssetList = (asset) => ({
  id: asset.id,
  assetTag: asset.assetTag,
  name: asset.name,
  category: asset.category ? { id: asset.category.id, name: asset.category.name } : null,
  status: asset.status,
  condition: asset.condition,
  location: asset.location ?? null,
  isBookable: asset.isBookable,
  createdAt: asset.createdAt,
  updatedAt: asset.updatedAt,
});

const mapAssetDetail = (asset) => ({
  id: asset.id,
  assetTag: asset.assetTag,
  name: asset.name,
  category: asset.category ?? null,
  serialNumber: asset.serialNumber ?? null,
  qrCodeValue: asset.qrCodeValue ?? null,
  acquisitionDate: asset.acquisitionDate ?? null,
  acquisitionCost: asset.acquisitionCost != null ? parseFloat(asset.acquisitionCost) : null,
  condition: asset.condition,
  location: asset.location ?? null,
  isBookable: asset.isBookable,
  status: asset.status,
  organizationId: asset.organizationId,
  registeredBy: asset.registeredBy ?? null,
  photos: Array.isArray(asset.photos)
    ? asset.photos.map(p => ({ id: p.id, fileUrl: p.fileUrl, fileType: p.fileType, uploadedAt: p.uploadedAt }))
    : [],
  allocationHistory: Array.isArray(asset.allocations)
    ? asset.allocations.map(a => ({
        id: a.id,
        status: a.status,
        allocationDate: a.allocationDate,
        expectedReturnDate: a.expectedReturnDate ?? null,
        actualReturnDate: a.actualReturnDate ?? null,
        allocatedToEmployee: a.allocatedToEmp ?? null,
        allocatedToDepartment: a.allocatedToDept ?? null,
      }))
    : [],
  maintenanceHistory: Array.isArray(asset.maintenanceRequests)
    ? asset.maintenanceRequests.map(m => ({
        id: m.id,
        status: m.status,
        description: m.description,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,
      }))
    : [],
  statusHistory: Array.isArray(asset.statusHistory)
    ? asset.statusHistory.map(h => ({
        id: h.id,
        fromStatus: h.fromStatus ?? null,
        toStatus: h.toStatus,
        reason: h.reason ?? null,
        changedById: h.changedById ?? null,
        changedAt: h.changedAt,
      }))
    : [],
  currentAllocation: Array.isArray(asset.allocations)
    ? asset.allocations.find(a => a.status === 'ACTIVE') ?? null
    : null,
  createdAt: asset.createdAt,
  updatedAt: asset.updatedAt,
});

module.exports = { mapAssetList, mapAssetDetail };
