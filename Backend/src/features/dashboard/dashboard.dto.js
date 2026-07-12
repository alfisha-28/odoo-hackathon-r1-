const { z } = require('zod');

const dashboardAnalyticsSchema = z.object({
  query: z.object({
    departmentId: z.string().uuid().optional(),
    from: z.string().datetime({ offset: true }).optional(),
    to: z.string().datetime({ offset: true }).optional(),
  }).refine(
    (data) => {
      if (data.from && data.to) return new Date(data.to) >= new Date(data.from);
      return true;
    },
    { message: 'to date must be after from date', path: ['to'] }
  ),
});

module.exports = { dashboardAnalyticsSchema };
