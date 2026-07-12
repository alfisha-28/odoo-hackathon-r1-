const { z } = require('zod');

const createAssetSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(150),
    categoryId: z.string().uuid('categoryId must be a valid UUID'),
    serialNumber: z.string().max(100).nullable().optional(),
    acquisitionDate: z.string().datetime({ offset: true }).nullable().optional(),
    acquisitionCost: z.number().positive().nullable().optional(),
    condition: z.enum(['NEW', 'GOOD', 'FAIR', 'DAMAGED', 'UNUSABLE']).optional().default('NEW'),
    location: z.string().max(200).nullable().optional(),
    isBookable: z.boolean().optional().default(false),
    photoUrls: z.array(z.string().url()).optional().default([]),
  }),
});

const updateAssetSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid asset id'),
  }),
  body: z.object({
    name: z.string().min(1).max(150).optional(),
    condition: z.enum(['NEW', 'GOOD', 'FAIR', 'DAMAGED', 'UNUSABLE']).optional(),
    location: z.string().max(200).nullable().optional(),
    isBookable: z.boolean().optional(),
    status: z.enum(['AVAILABLE', 'RESERVED', 'LOST', 'RETIRED', 'DISPOSED',
                    'ALLOCATED', 'UNDER_MAINTENANCE']).optional(),
  }).refine(
    (data) => Object.keys(data).length > 0,
    { message: 'At least one field must be provided for update' }
  ),
});

const listAssetsQuerySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    status: z.enum(['AVAILABLE', 'ALLOCATED', 'RESERVED', 'UNDER_MAINTENANCE', 'LOST', 'RETIRED', 'DISPOSED']).optional(),
    categoryId: z.string().uuid().optional(),
    departmentId: z.string().uuid().optional(),
    location: z.string().optional(),
    page: z.string().optional().transform(v => (v ? parseInt(v, 10) : 1)).pipe(z.number().min(1)),
    limit: z.string().optional().transform(v => (v ? parseInt(v, 10) : 20)).pipe(z.number().min(1).max(100)),
  }),
});

module.exports = { createAssetSchema, updateAssetSchema, listAssetsQuerySchema };
