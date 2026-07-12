const prisma = require('../../config/prisma');

const INCLUDE_AUDIT_LIST = {
  assignments: {
    include: { auditor: { select: { id: true, name: true } } }
  },
  items: { select: { id: true, result: true, discrepancyFlag: true } },
};

const INCLUDE_AUDIT_DETAIL = {
  ...INCLUDE_AUDIT_LIST,
  items: {
    include: {
      asset: { select: { id: true, assetTag: true, name: true } },
      verifiedBy: { select: { id: true, name: true } } // Although schema doesn't have verifiedBy relation directly... wait, schema check.
    }
  }
};

// Looking at schema from earlier:
// verifiedById String?
// verifiedAt DateTime?
// Wait, the schema didn't define a relation for verifiedBy! 
// Let's omit `verifiedBy` relation include and just return the ID if there's no relation in schema, OR I'll check the mapper to see if I mapped it. 
// Ah, the mapper expects `verifiedBy: i.verifiedBy ? { id, name } : null`. Since schema doesn't have the relation, I can't include it. I will fetch Employee names separately or just leave it null.
// For hackathon simplicity, I will just drop the verifiedBy name in mapper and return ID, or I'll patch the schema? The prompt says "Build ONLY Audit Cycles..." I shouldn't modify schema if possible. Let's omit `verifiedBy` relation in include.

// Re-evaluating INCLUDE_AUDIT_DETAIL based strictly on schema.
const STRICT_INCLUDE_AUDIT_DETAIL = {
  assignments: {
    include: { auditor: { select: { id: true, name: true } } }
  },
  items: {
    include: {
      asset: { select: { id: true, assetTag: true, name: true } },
    }
  }
};


const findAuditCycles = ({ auditorId, status, skip, take }) => {
  const where = {
    ...(status && { status }),
    ...(auditorId && { assignments: { some: { auditorId } } }),
  };

  return Promise.all([
    prisma.auditCycle.findMany({
      where,
      include: INCLUDE_AUDIT_LIST,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    prisma.auditCycle.count({ where }),
  ]);
};

const findAuditCycleById = (id) => {
  return prisma.auditCycle.findUnique({
    where: { id },
    include: STRICT_INCLUDE_AUDIT_DETAIL,
  });
};

const createAuditCycle = async ({
  name, scopeDepartmentId, scopeLocation, startDate, endDate, auditorIds, organizationId
}) => {
  return prisma.$transaction(async (tx) => {
    // 1. Fetch matching assets
    let assetWhere = { organizationId, status: { notIn: ['RETIRED', 'DISPOSED'] } };
    if (scopeDepartmentId) {
      assetWhere.allocations = { some: { status: 'ACTIVE', allocatedToDeptId: scopeDepartmentId } };
    }
    if (scopeLocation) {
      assetWhere.location = { contains: scopeLocation, mode: 'insensitive' };
    }

    const assets = await tx.asset.findMany({
      where: assetWhere,
      select: { id: true }
    });

    // 2. Create Audit Cycle
    const cycle = await tx.auditCycle.create({
      data: {
        name,
        scopeDepartmentId,
        scopeLocation,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        organizationId,
        status: 'IN_PROGRESS',
        assignments: {
          create: auditorIds.map(id => ({ auditorId: id }))
        },
        items: {
          create: assets.map(a => ({ assetId: a.id, result: 'PENDING' }))
        }
      },
      include: STRICT_INCLUDE_AUDIT_DETAIL,
    });

    // 3. Notify Auditors
    await tx.notification.createMany({
      data: auditorIds.map(id => ({
        employeeId: id,
        type: 'AUDIT_ASSIGNED',
        title: 'Assigned to Audit',
        message: `You have been assigned to audit cycle: ${name}.`,
        entityType: 'AuditCycle',
        entityId: cycle.id,
      })),
    });

    return cycle;
  });
};

const verifyAuditItem = async ({ auditCycleId, assetId, result, notes, verifiedById, organizationId }) => {
  return prisma.$transaction(async (tx) => {
    const discrepancyFlag = result === 'MISSING' || result === 'DAMAGED';

    const item = await tx.auditItem.update({
      where: { auditCycleId_assetId: { auditCycleId, assetId } },
      data: {
        result,
        notes,
        verifiedById,
        verifiedAt: new Date(),
        discrepancyFlag,
      },
      include: { asset: true }
    });

    if (discrepancyFlag) {
      const managers = await tx.employee.findMany({
        where: { organizationId, roles: { some: { role: 'ASSET_MANAGER' } }, status: 'ACTIVE' },
        select: { id: true }
      });
      if (managers.length > 0) {
        await tx.notification.createMany({
          data: managers.map(m => ({
            employeeId: m.id,
            type: 'AUDIT_DISCREPANCY_FLAGGED',
            title: 'Audit Discrepancy Flagged',
            message: `Discrepancy (${result}) flagged for asset ${item.asset.assetTag}.`,
            entityType: 'AuditCycle',
            entityId: auditCycleId,
          }))
        });
      }
    }

    return item;
  });
};

const closeAuditCycle = async ({ cycleId, closedById, organizationId }) => {
  return prisma.$transaction(async (tx) => {
    const cycle = await tx.auditCycle.findUnique({
      where: { id: cycleId },
      include: { items: true, assignments: true }
    });

    let missingCount = 0;
    let damagedCount = 0;

    for (const item of cycle.items) {
      if (item.result === 'MISSING') {
        missingCount++;
        const currentAsset = await tx.asset.findUnique({ where: { id: item.assetId } });
        if (currentAsset.status !== 'LOST') {
          await tx.asset.update({ where: { id: item.assetId }, data: { status: 'LOST' } });
          await tx.assetStatusHistory.create({
            data: {
              assetId: item.assetId,
              fromStatus: currentAsset.status,
              toStatus: 'LOST',
              reason: 'Confirmed missing during audit',
              changedById: closedById,
            }
          });
        }
      } else if (item.result === 'DAMAGED') {
        damagedCount++;
        await tx.asset.update({ where: { id: item.assetId }, data: { condition: 'DAMAGED' } });
      }
    }

    const updatedCycle = await tx.auditCycle.update({
      where: { id: cycleId },
      data: { status: 'CLOSED', closedAt: new Date() },
      include: STRICT_INCLUDE_AUDIT_DETAIL,
    });

    // Notify auditors and managers
    const notifyIds = new Set(cycle.assignments.map(a => a.auditorId));
    const managers = await tx.employee.findMany({
      where: { organizationId, roles: { some: { role: 'ASSET_MANAGER' } }, status: 'ACTIVE' },
      select: { id: true }
    });
    managers.forEach(m => notifyIds.add(m.id));

    if (notifyIds.size > 0) {
      await tx.notification.createMany({
        data: Array.from(notifyIds).map(id => ({
          employeeId: id,
          type: 'AUDIT_CLOSED',
          title: 'Audit Cycle Closed',
          message: `Audit "${cycle.name}" closed. ${missingCount + damagedCount} assets flagged - discrepancy report generated automatically.`,
          entityType: 'AuditCycle',
          entityId: cycleId,
        }))
      });
    }

    return updatedCycle;
  });
};

module.exports = {
  findAuditCycles,
  findAuditCycleById,
  createAuditCycle,
  verifyAuditItem,
  closeAuditCycle,
};
