import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Plus, Info, ChevronDown } from 'lucide-react';
import OrganizationTabs from '../components/OrganizationTabs';
import TableContainer from '../components/TableContainer';
import CardHeader from '../components/CardHeader';
import SearchBar from '../components/SearchBar';
import DepartmentTable from '../components/DepartmentTable';
import CategoryTable from '../components/CategoryTable';
import EmployeeTable from '../components/EmployeeTable';
import Pagination from '../components/Pagination';

import orgData from '../data/data.json';

export default function OrganizationSetupPage() {
  // Tabs Selection state
  const [activeTab, setActiveTab] = useState('Departments');
  
  // Section refs for desktop scrolling anchor logic
  const deptsRef = useRef(null);
  const categoriesRef = useRef(null);
  const employeesRef = useRef(null);

  // Search & Filter states
  const [deptSearch, setDeptSearch] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [employeeRoleFilter, setEmployeeRoleFilter] = useState('');

  // Pagination states
  const [empPage, setEmpPage] = useState(1);
  const empLimit = 5;

  // Responsive check
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filtered Departments
  const filteredDepartments = useMemo(() => {
    return orgData.departments.filter((dept) => {
      const q = deptSearch.toLowerCase().trim();
      return (
        !q ||
        dept.name.toLowerCase().includes(q) ||
        dept.head.toLowerCase().includes(q)
      );
    });
  }, [deptSearch]);

  // Filtered Categories
  const filteredCategories = useMemo(() => {
    return orgData.categories.filter((cat) => {
      const q = categorySearch.toLowerCase().trim();
      return !q || cat.name.toLowerCase().includes(q);
    });
  }, [categorySearch]);

  // Filtered Employees
  const filteredEmployees = useMemo(() => {
    return orgData.employees.filter((emp) => {
      const q = employeeSearch.toLowerCase().trim();
      const roleMatch = !employeeRoleFilter || emp.role === employeeRoleFilter;
      const textMatch =
        !q ||
        emp.name.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        emp.phone.toLowerCase().includes(q) ||
        emp.department.toLowerCase().includes(q);

      return roleMatch && textMatch;
    });
  }, [employeeSearch, employeeRoleFilter]);

  // Paginated Employees
  const paginatedEmployees = useMemo(() => {
    const startIndex = (empPage - 1) * empLimit;
    return filteredEmployees.slice(startIndex, startIndex + empLimit);
  }, [filteredEmployees, empPage]);

  // Reset pagination when employee search changes
  useEffect(() => {
    setEmpPage(1);
  }, [employeeSearch, employeeRoleFilter]);

  // Tab Switch handler
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (!isMobile) {
      // Smooth scroll to card on desktop
      const refMap = {
        Departments: deptsRef,
        'Asset Categories': categoriesRef,
        Employees: employeesRef,
      };
      const targetRef = refMap[tabId];
      if (targetRef && targetRef.current) {
        targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  // Actions Callbacks
  const handleAddCategory = () => {
    alert('Action: Open "Add Asset Category" Dialog Form');
  };

  const handleAddEmployee = () => {
    alert('Action: Open "Register Employee" Dialog Form');
  };

  const handleEdit = (section, id) => {
    alert(`Editing item ID ${id} in ${section}`);
  };

  const handleDelete = (section, id) => {
    alert(`Deleting item ID ${id} in ${section}`);
  };

  return (
    <>
      {/* Title & Breadcrumbs header */}
      <div className="flex flex-col gap-1 select-none">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#111827]">
          Organization Setup
        </h1>
        <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-[#9CA3AF]">
          <span>Dashboard</span>
          <span className="text-gray-300">/</span>
          <span className="text-[#7C3AED]">Organization Setup</span>
        </div>
      </div>

      {/* Tabs */}
      <OrganizationTabs activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Grid view wrapper */}
      <div className="flex flex-col gap-6 w-full">
        {/* Row 1: Departments and Asset Categories */}
        {(!isMobile || activeTab === 'Departments' || activeTab === 'Asset Categories') && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {/* Departments Card */}
            {(!isMobile || activeTab === 'Departments') && (
              <div ref={deptsRef} className="scroll-mt-24">
                <TableContainer>
                  <CardHeader
                    title="Departments"
                    description="Manage all departments in your organization."
                    actions={
                      <SearchBar
                        value={deptSearch}
                        onChange={setDeptSearch}
                        placeholder="Search departments..."
                      />
                    }
                  />
                  <div className="flex-1 min-h-[250px]">
                    <DepartmentTable
                      departments={filteredDepartments}
                      onEdit={(id) => handleEdit('departments', id)}
                      onDelete={(id) => handleDelete('departments', id)}
                    />
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#F3F4F6] text-xs font-bold text-[#6B7280]">
                    Showing <span className="text-[#111827]">1</span> to{' '}
                    <span className="text-[#111827]">{filteredDepartments.length}</span> of{' '}
                    <span className="text-[#111827]">{filteredDepartments.length}</span> results
                  </div>
                </TableContainer>
              </div>
            )}

            {/* Asset Categories Card */}
            {(!isMobile || activeTab === 'Asset Categories') && (
              <div ref={categoriesRef} className="scroll-mt-24">
                <TableContainer>
                  <CardHeader
                    title="Asset Categories"
                    description="Manage categories to classify your assets."
                    actions={
                      <div className="flex items-center gap-2">
                        <SearchBar
                          value={categorySearch}
                          onChange={setCategorySearch}
                          placeholder="Search categories..."
                        />
                        <button
                          onClick={handleAddCategory}
                          className="flex items-center justify-center gap-1 h-9 px-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-xl shadow-md shadow-[#7C3AED]/15 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer select-none"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Category</span>
                        </button>
                      </div>
                    }
                  />
                  <div className="flex-1 min-h-[250px]">
                    <CategoryTable
                      categories={filteredCategories}
                      onEdit={(id) => handleEdit('categories', id)}
                      onDelete={(id) => handleDelete('categories', id)}
                    />
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#F3F4F6] text-xs font-bold text-[#6B7280]">
                    Showing <span className="text-[#111827]">1</span> to{' '}
                    <span className="text-[#111827]">{filteredCategories.length}</span> of{' '}
                    <span className="text-[#111827]">{filteredCategories.length}</span> results
                  </div>
                </TableContainer>
              </div>
            )}
          </div>
        )}

        {/* Row 2: Employees Card */}
        {(!isMobile || activeTab === 'Employees') && (
          <div ref={employeesRef} className="scroll-mt-24 w-full">
            <TableContainer>
              <CardHeader
                title="Employees"
                description="Manage employees and assign roles."
                actions={
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Search */}
                    <SearchBar
                      value={employeeSearch}
                      onChange={setEmployeeSearch}
                      placeholder="Search employees..."
                    />

                    {/* Role Filter dropdown */}
                    <div className="relative">
                      <select
                        value={employeeRoleFilter}
                        onChange={(e) => setEmployeeRoleFilter(e.target.value)}
                        className="h-9 bg-white border border-[#E5E7EB] rounded-xl pl-3 pr-8 text-xs font-semibold text-[#475569] focus:outline-none focus:border-[#7C3AED] appearance-none cursor-pointer select-none transition-colors"
                      >
                        <option value="">All Roles</option>
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                        <option value="User">User</option>
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
                    </div>

                    {/* Add Employee button */}
                    <button
                      onClick={handleAddEmployee}
                      className="flex items-center justify-center gap-1 h-9 px-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-xl shadow-md shadow-[#7C3AED]/15 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer select-none"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Employee</span>
                    </button>
                  </div>
                }
              />
              <div className="flex-1 min-h-[220px]">
                <EmployeeTable
                  employees={paginatedEmployees}
                  onEdit={(id) => handleEdit('employees', id)}
                  onDelete={(id) => handleDelete('employees', id)}
                />
              </div>

              {/* Pagination block */}
              <div className="mt-4 pt-4 border-t border-[#F3F4F6]">
                <Pagination
                  totalItems={filteredEmployees.length}
                  itemsPerPage={empLimit}
                  currentPage={empPage}
                  onPageChange={setEmpPage}
                />
              </div>
            </TableContainer>
          </div>
        )}
      </div>

      {/* Information Banner */}
      <div className="flex items-start sm:items-center gap-3 p-4 bg-[#F5F3FF] border border-[#EDE9FE] rounded-2xl select-none">
        <Info className="w-5 h-5 text-[#7C3AED] flex-shrink-0 mt-0.5 sm:mt-0" />
        <span className="text-xs font-bold text-[#4F46E5] leading-relaxed">
          Keep your organization structure up to date for better asset management and access control.
        </span>
      </div>
    </>
  );
}
