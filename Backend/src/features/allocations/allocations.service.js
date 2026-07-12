const {
  findAllocations,
  findAllocationById,
  findActiveAllocationByAssetId,
  createAllocation,
  returnAllocation,
} = require('./allocations.repository');
const { findAssetById } = require('../assets/assets.repository');
const { mapAllocationList, mapAllocationDetail } = require('./allocations.mapper');
const { getPaginationData } = require('../../common/helpers/pagination.helper');
const ApiError = require('../../lib/ApiError');

const listAllocations = async ({
  employee,
  assetId,
  employeeId,
  departmentId,
  status,
  overdue,
  page,
  limit,
}) => {
  // RBAC for Employees
  const isManager = employee.roles.some(r => ['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD'].includes(r));
  let filterEmployeeId = employeeId;
  let filterDepartmentId = departmentId;

  if (!isManager) {
    // Plain employees only see their own allocations or their department's
    // (If they specify an ID that is not theirs, they get nothing rather than an error)
    if (filterEmployeeId && filterEmployeeId !== employee.id) {
      return { data: [], meta: getPaginationData(page, limit, 0).meta };
    }
    if (filterDepartmentId && filterDepartmentId !== employee.departmentId) {
      return { data: [], meta: getPaginationData(page, limit, 0).meta };
    }
    
    // Default to scoping to them if they didn't explicitly request filters
    if (!filterEmployeeId && !filterDepartmentId) {
       filterEmployeeId = employee.id;
       filterDepartmentId = employee.departmentId; // They can see their dept's allocations too for transparency
    }
  }

  const { skip, take } = getPaginationData(page, limit, 0);
  const [allocations, total] = await findAllocations({
    assetId,
    employeeId: filterEmployeeId,
    departmentId: filterDepartmentId,
    status,
    overdue,
    skip,
    take,
  });
  const { meta } = getPaginationData(page, limit, total);

  return {
    data: allocations.map(mapAllocationList),
    meta,
  };
};

const allocateAsset = async ({
  assetId,
  allocatedToEmpId,
  allocatedToDeptId,
  expectedReturnDate,
  organizationId,
  allocatedById,
}) => {
  const asset = await findAssetById(assetId, organizationId);
  if (!asset) throw ApiError.notFound('Asset not found');

  if (asset.status !== 'AVAILABLE') {
    const activeAllocation = await findActiveAllocationByAssetId(assetId);
    let holderName = 'someone';
    if (activeAllocation) {
        if (activeAllocation.allocatedToEmp) holderName = activeAllocation.allocatedToEmp.name;
        else if (activeAllocation.allocatedToDept) holderName = `${activeAllocation.allocatedToDept.name} Department`;
    }
    throw ApiError.conflict(`Cannot allocate asset. It is currently allocated to ${holderName}.`);
  }

  const allocation = await createAllocation({
    assetId,
    allocatedToEmpId,
    allocatedToDeptId,
    expectedReturnDate,
    allocatedById,
  });

  return mapAllocationDetail(allocation);
};

const returnAsset = async ({ id, checkInCondition, checkInNotes, returnedApprovedById }) => {
  const allocation = await findAllocationById(id);
  if (!allocation) throw ApiError.notFound('Allocation not found');

  if (allocation.status !== 'ACTIVE') {
    throw ApiError.badRequest(`Allocation is already in ${allocation.status} status.`);
  }

  const updatedAllocation = await returnAllocation({
    id,
    assetId: allocation.assetId,
    checkInCondition,
    checkInNotes,
    returnedApprovedById,
  });

  return mapAllocationDetail(updatedAllocation);
};

module.exports = { listAllocations, allocateAsset, returnAsset };
