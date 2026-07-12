const { z } = require('zod');

const upsertCategorySchema = z.object({
  body: z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(1, 'Name is required').max(100),
    description: z.string().max(500).nullable().optional(),
    customFields: z.record(z.unknown()).nullable().optional(),
  }),
});

module.exports = { upsertCategorySchema };
