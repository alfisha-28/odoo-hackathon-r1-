const mapTransferList = (transfer) => ({
  id: transfer.id,
  asset: transfer.asset ? {
    id: transfer.asset.id,
    assetTag: transfer.asset.assetTag,
    name: transfer.asset.name,
  } : null,
  requestedBy: transfer.requestedBy ? {
    id: transfer.requestedBy.id,
    name: transfer.requestedBy.name,
  } : null,
  requestedToEmployee: transfer.requestedToEmpId ? transfer.requestedToEmpId : null,
  requestedToDepartment: transfer.requestedToDeptId ? transfer.requestedToDeptId : null,
  status: transfer.status,
  reason: transfer.reason ?? null,
  createdAt: transfer.createdAt,
});

const mapTransferDetail = (transfer) => ({
  ...mapTransferList(transfer),
  currentAllocationId: transfer.currentAllocationId ?? null,
  approvedBy: transfer.approvedBy ? {
    id: transfer.approvedBy.id,
    name: transfer.approvedBy.name,
  } : null,
  approvedAt: transfer.approvedAt ?? null,
  updatedAt: transfer.updatedAt,
});

module.exports = { mapTransferList, mapTransferDetail };
