const mapAllocationList = (allocation) => ({
  id: allocation.id,
  asset: allocation.asset ? {
    id: allocation.asset.id,
    assetTag: allocation.asset.assetTag,
    name: allocation.asset.name,
    status: allocation.asset.status,
  } : null,
  allocatedToEmployee: allocation.allocatedToEmp ? {
    id: allocation.allocatedToEmp.id,
    name: allocation.allocatedToEmp.name,
  } : null,
  allocatedToDepartment: allocation.allocatedToDept ? {
    id: allocation.allocatedToDept.id,
    name: allocation.allocatedToDept.name,
  } : null,
  allocatedBy: allocation.allocatedBy ? {
    id: allocation.allocatedBy.id,
    name: allocation.allocatedBy.name,
  } : null,
  allocationDate: allocation.allocationDate,
  expectedReturnDate: allocation.expectedReturnDate ?? null,
  actualReturnDate: allocation.actualReturnDate ?? null,
  status: allocation.status,
});

const mapAllocationDetail = (allocation) => ({
  ...mapAllocationList(allocation),
  checkInCondition: allocation.checkInCondition ?? null,
  checkInNotes: allocation.checkInNotes ?? null,
  createdAt: allocation.createdAt,
  updatedAt: allocation.updatedAt,
});

module.exports = { mapAllocationList, mapAllocationDetail };
