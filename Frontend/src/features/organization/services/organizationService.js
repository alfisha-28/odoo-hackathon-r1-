import apiClient from '../../../shared/services/apiClient';

export const organizationService = {
  // --- Departments ---
  getDepartments: async () => {
    const response = await apiClient.get('/departments');
    // Returns: { success: true, data: { departments: [...] } }
    return response.data.data.departments;
  },

  upsertDepartment: async (deptData) => {
    const response = await apiClient.post('/departments', deptData);
    return response.data.data.department;
  },

  // --- Asset Categories ---
  getCategories: async () => {
    const response = await apiClient.get('/categories');
    // Returns: { success: true, data: { categories: [...] } }
    return response.data.data.categories;
  },

  upsertCategory: async (catData) => {
    const response = await apiClient.post('/categories', catData);
    return response.data.data.category;
  },

  // --- Employees ---
  getEmployees: async ({ search = '', role = '', status = '', page = 1, limit = 10 } = {}) => {
    const response = await apiClient.get('/employees', {
      params: { search, role, status, page, limit },
    });
    // Returns: { success: true, data: { employees: [...], total, page, limit, totalPages } }
    return response.data.data;
  },

  updateEmployee: async (id, updateData) => {
    const response = await apiClient.patch(`/employees/${id}`, updateData);
    return response.data.data.employee;
  },
};
