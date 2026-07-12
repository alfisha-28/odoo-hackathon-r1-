const mapDepartment = (dept) => ({
  id: dept.id,
  name: dept.name,
  status: dept.status,
  parentId: dept.parentId ?? null,
  head: dept.head ?? null,
  organizationId: dept.organizationId,
  createdAt: dept.createdAt,
  updatedAt: dept.updatedAt,
});

module.exports = { mapDepartment };
