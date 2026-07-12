const { z } = require('zod');
const { paginationSchema } = require('../../common/validators/pagination.dto');

const listEmployeesSchema = z.object({
  query: paginationSchema.extend({
    search: z.string().optional(),
    role: z.enum(['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'EMPLOYEE']).optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  }),
});

const updateEmployeeSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid employee id'),
  }),
  body: z.object({
    roles: z
      .array(z.enum(['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'EMPLOYEE']))
      .min(1)
      .optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
    password: z.string().min(8).optional(),
  }).refine(
    (data) => data.roles !== undefined || data.status !== undefined || data.password !== undefined,
    { message: 'At least one of roles, status, or password must be provided' }
  ),
});

module.exports = { listEmployeesSchema, updateEmployeeSchema };
