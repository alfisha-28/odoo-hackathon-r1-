const mapEmployee = (emp) => {
  const { passwordHash, ...rest } = emp;
  return {
    ...rest,
    roles: Array.isArray(emp.roles)
      ? emp.roles.map((r) => (typeof r === 'string' ? r : r.role))
      : [],
    department: emp.department ?? null,
  };
};

module.exports = { mapEmployee };
