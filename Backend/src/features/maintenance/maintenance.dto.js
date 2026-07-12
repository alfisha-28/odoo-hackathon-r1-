const { z } = require('zod');

const createMaintenanceSchema = z.object({
  body: z.object({
    assetId: z.string().uuid('assetId must be a valid UUID'),
    issueDescription: z.string().min(5).max(1000),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
    photoUrl: z.string().url().optional(),
  }),
});

const updateMaintenanceSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid maintenance request id'),
  }),
  body: z.object({
    status: z.enum(['APPROVED', 'REJECTED', 'TECHNICIAN_ASSIGNED', 'IN_PROGRESS', 'RESOLVED']),
    rejectionReason: z.string().max(500).optional(),
    technicianId: z.string().uuid().optional(),
    technicianName: z.string().max(100).optional(),
    resolutionNotes: z.string().max(1000).optional(),
  }).refine(
    (data) => !(data.status === 'REJECTED' && !data.rejectionReason),
    { message: 'rejectionReason is required when rejecting a maintenance request', path: ['rejectionReason'] }
  ).refine(
    (data) => !(data.status === 'TECHNICIAN_ASSIGNED' && !data.technicianId && !data.technicianName),
    { message: 'technicianId or technicianName is required when assigning a technician', path: ['technicianId'] }
  ),
});

const listMaintenanceSchema = z.object({
  query: z.object({
    assetId: z.string().uuid().optional(),
    status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'TECHNICIAN_ASSIGNED', 'IN_PROGRESS', 'RESOLVED']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
    page: z.string().optional().transform(v => (v ? parseInt(v, 10) : 1)).pipe(z.number().min(1)),
    limit: z.string().optional().transform(v => (v ? parseInt(v, 10) : 20)).pipe(z.number().min(1).max(100)),
  }),
});

module.exports = { createMaintenanceSchema, updateMaintenanceSchema, listMaintenanceSchema };
