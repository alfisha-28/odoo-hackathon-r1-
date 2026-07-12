const mapAuditList = (cycle) => {
  const itemCount = cycle.items ? cycle.items.length : 0;
  const flaggedCount = cycle.items ? cycle.items.filter(i => i.discrepancyFlag).length : 0;
  
  return {
    id: cycle.id,
    name: cycle.name,
    scopeDepartmentId: cycle.scopeDepartmentId ?? null,
    scopeLocation: cycle.scopeLocation ?? null,
    startDate: cycle.startDate,
    endDate: cycle.endDate,
    status: cycle.status,
    auditors: cycle.assignments ? cycle.assignments.map(a => ({
      id: a.auditor.id,
      name: a.auditor.name,
    })) : [],
    itemCount,
    flaggedCount,
    createdAt: cycle.createdAt,
    closedAt: cycle.closedAt ?? null,
  };
};

const mapAuditDetail = (cycle) => {
  return {
    ...mapAuditList(cycle),
    items: cycle.items ? cycle.items.map(i => ({
      id: i.id,
      asset: {
        id: i.asset.id,
        assetTag: i.asset.assetTag,
        name: i.asset.name,
      },
      result: i.result,
      discrepancyFlag: i.discrepancyFlag,
      notes: i.notes ?? null,
      verifiedBy: i.verifiedBy ? {
        id: i.verifiedBy.id,
        name: i.verifiedBy.name,
      } : null,
      verifiedAt: i.verifiedAt ?? null,
    })) : [],
  };
};

module.exports = { mapAuditList, mapAuditDetail };
