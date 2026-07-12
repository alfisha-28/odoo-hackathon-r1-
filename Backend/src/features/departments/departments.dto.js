const { z } = require('zod');

const upsertDepartmentSchema = z.object({
  body: z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(1, 'Name is required').max(100),
    parentId: z.string().uuid().nullable().optional(),
    headId: z.string().uuid().nullable().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional().default('ACTIVE'),
  }),
});

module.exports = { upsertDepartmentSchema };
