const { z } = require('zod');

const createAuditSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(100),
    scopeDepartmentId: z.string().uuid().optional(),
    scopeLocation: z.string().max(100).optional(),
    startDate: z.string().datetime({ offset: true }),
    endDate: z.string().datetime({ offset: true }),
    auditorIds: z.array(z.string().uuid()).min(1),
  }).refine(
    (data) => new Date(data.endDate) >= new Date(data.startDate),
    { message: 'endDate must be after startDate', path: ['endDate'] }
  ),
});

const patchAuditSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid audit cycle id'),
  }),
  body: z.discriminatedUnion("action", [
    z.object({
      action: z.literal("VERIFY"),
      assetId: z.string().uuid(),
      result: z.enum(['VERIFIED', 'MISSING', 'DAMAGED']),
      notes: z.string().max(500).optional(),
    }),
    z.object({
      action: z.literal("CLOSE"),
    }),
  ]),
});

const listAuditsSchema = z.object({
  query: z.object({
    status: z.enum(['DRAFT', 'IN_PROGRESS', 'CLOSED']).optional(),
    page: z.string().optional().transform(v => (v ? parseInt(v, 10) : 1)).pipe(z.number().min(1)),
    limit: z.string().optional().transform(v => (v ? parseInt(v, 10) : 20)).pipe(z.number().min(1).max(100)),
  }),
});

module.exports = { createAuditSchema, patchAuditSchema, listAuditsSchema };
