const { z } = require('zod');

const createBookingSchema = z.object({
  body: z.object({
    assetId: z.string().uuid('assetId must be a valid UUID'),
    startTime: z.string().datetime({ offset: true }),
    endTime: z.string().datetime({ offset: true }),
    purpose: z.string().max(255).optional(),
    bookedForDeptId: z.string().uuid().optional(),
  }).refine(
    (data) => new Date(data.endTime) > new Date(data.startTime),
    { message: 'endTime must be strictly after startTime', path: ['endTime'] }
  ),
});

const updateBookingSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid booking id'),
  }),
  body: z.object({
    startTime: z.string().datetime({ offset: true }).optional(),
    endTime: z.string().datetime({ offset: true }).optional(),
    status: z.enum(['CANCELLED']).optional(),
  }).refine(
    (data) => {
      if (data.startTime && data.endTime) {
        return new Date(data.endTime) > new Date(data.startTime);
      }
      return true;
    },
    { message: 'endTime must be strictly after startTime', path: ['endTime'] }
  ),
});

const listBookingsSchema = z.object({
  query: z.object({
    assetId: z.string().optional()
      .transform(v => v === '' ? undefined : v)
      .pipe(z.string().uuid().optional()),
    start: z.string().optional()
      .transform(v => v === '' ? undefined : v)
      .pipe(z.string().datetime({ offset: true }).optional()),
    end: z.string().optional()
      .transform(v => v === '' ? undefined : v)
      .pipe(z.string().datetime({ offset: true }).optional()),
    status: z.string().optional()
      .transform(v => v === '' ? undefined : v)
      .pipe(z.enum(['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED']).optional()),
    page: z.string().optional().transform(v => (v ? parseInt(v, 10) : 1)).pipe(z.number().min(1)),
    limit: z.string().optional().transform(v => (v ? parseInt(v, 10) : 20)).pipe(z.number().min(1).max(100)),
  }),
});

module.exports = { createBookingSchema, updateBookingSchema, listBookingsSchema };
