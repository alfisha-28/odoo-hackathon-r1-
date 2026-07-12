/**
 * Strips passwordHash and maps roles to a plain string array before returning to client.
 */
const mapEmployee = (employee) => {
  const { passwordHash, ...rest } = employee;
  return {
    ...rest,
    roles: Array.isArray(employee.roles)
      ? employee.roles.map((r) => (typeof r === 'string' ? r : r.role))
      : [],
  };
};

module.exports = { mapEmployee };
