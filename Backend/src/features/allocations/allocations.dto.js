const { z } = require('zod');

const createAllocationSchema = z.object({
  body: z.object({
    assetId: z.string().uuid('assetId must be a valid UUID'),
    allocatedToEmpId: z.string().uuid().optional(),
    allocatedToDeptId: z.string().uuid().optional(),
    expectedReturnDate: z.string().datetime({ offset: true }).optional(),
  }).refine(
    (d) => !!(d.allocatedToEmpId) !== !!(d.allocatedToDeptId),
    { message: 'Exactly one of allocatedToEmpId or allocatedToDeptId must be provided' }
  ),
});

const returnAllocationSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid allocation id'),
  }),
  body: z.object({
    checkInCondition: z.enum(['NEW', 'GOOD', 'FAIR', 'DAMAGED', 'UNUSABLE']),
    checkInNotes: z.string().max(500).optional(),
  }),
});

const listAllocationsSchema = z.object({
  query: z.object({
    assetId: z.string().uuid().optional(),
    employeeId: z.string().uuid().optional(),
    departmentId: z.string().uuid().optional(),
    status: z.enum(['ACTIVE', 'RETURNED', 'OVERDUE']).optional(),
    overdue: z.string().optional().transform(v => v === 'true'),
    page: z.string().optional().transform(v => (v ? parseInt(v, 10) : 1)).pipe(z.number().min(1)),
    limit: z.string().optional().transform(v => (v ? parseInt(v, 10) : 20)).pipe(z.number().min(1).max(100)),
  }),
});

module.exports = { createAllocationSchema, returnAllocationSchema, listAllocationsSchema };
