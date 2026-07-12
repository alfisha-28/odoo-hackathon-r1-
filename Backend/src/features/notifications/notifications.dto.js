const { z } = require('zod');

const listNotificationsSchema = z.object({
  query: z.object({
    unreadOnly: z.string().optional().transform(v => v === 'true'),
    page: z.string().optional().transform(v => (v ? parseInt(v, 10) : 1)).pipe(z.number().min(1)),
    limit: z.string().optional().transform(v => (v ? parseInt(v, 10) : 20)).pipe(z.number().min(1).max(100)),
  }),
});

const patchNotificationsSchema = z.object({
  body: z.object({
    markAsReadIds: z.array(z.string().uuid()).optional(),
    markAllRead: z.boolean().optional(),
  }).refine(
    (data) => data.markAsReadIds || data.markAllRead,
    { message: 'Provide either markAsReadIds or markAllRead = true' }
  ),
});

module.exports = { listNotificationsSchema, patchNotificationsSchema };
