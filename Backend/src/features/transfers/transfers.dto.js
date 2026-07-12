const { z } = require('zod');

const createTransferSchema = z.object({
  body: z.object({
    assetId: z.string().uuid('assetId must be a valid UUID'),
    requestedToEmpId: z.string().uuid().optional(),
    requestedToDeptId: z.string().uuid().optional(),
    reason: z.string().max(500).optional(),
  }).refine(
    (d) => !!(d.requestedToEmpId) !== !!(d.requestedToDeptId),
    { message: 'Exactly one of requestedToEmpId or requestedToDeptId must be provided' }
  ),
});

const listTransfersSchema = z.object({
  query: z.object({
    assetId: z.string().uuid().optional(),
    status: z.enum(['REQUESTED', 'APPROVED', 'REJECTED', 'COMPLETED']).optional(),
    page: z.string().optional().transform(v => (v ? parseInt(v, 10) : 1)).pipe(z.number().min(1)),
    limit: z.string().optional().transform(v => (v ? parseInt(v, 10) : 20)).pipe(z.number().min(1).max(100)),
  }),
});

const patchTransferSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid transfer id'),
  }),
  body: z.object({
    action: z.enum(['APPROVE', 'REJECT']),
    reason: z.string().max(500).optional(),
  }).refine(
    (d) => !(d.action === 'REJECT' && !d.reason),
    { message: 'Reason is required when rejecting a transfer', path: ['reason'] }
  ),
});

module.exports = { createTransferSchema, listTransfersSchema, patchTransferSchema };
