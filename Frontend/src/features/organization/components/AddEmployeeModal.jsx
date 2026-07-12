import { useState } from 'react';
import { X } from 'lucide-react';

export default function AddEmployeeModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', department: '', role: 'User' });

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    onAdd({ ...form });
    onClose();
  };

  const inputClass = "h-10 px-3 border border-[#E5E7EB] rounded-xl text-sm text-[#111827] focus:outline-none focus:border-[#7C3AED] transition-colors w-full";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-black text-[#111827]">Add Employee</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#374151]">Full Name <span className="text-red-500">*</span></label>
              <input type="text" value={form.name} onChange={set('name')} placeholder="John Doe" className={inputClass} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#374151]">Email <span className="text-red-500">*</span></label>
              <input type="email" value={form.email} onChange={set('email')} placeholder="john@company.com" className={inputClass} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#374151]">Phone</label>
              <input type="text" value={form.phone} onChange={set('phone')} placeholder="+1 234 567 890" className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#374151]">Department</label>
              <input type="text" value={form.department} onChange={set('department')} placeholder="e.g. Engineering" className={inputClass} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#374151]">Role</label>
            <select value={form.role} onChange={set('role')} className={inputClass}>
              <option value="User">User</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 rounded-xl text-xs font-bold text-[#6B7280] border border-[#E5E7EB] hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-9 px-4 rounded-xl text-xs font-bold text-white bg-[#7C3AED] hover:bg-[#6D28D9] transition-colors cursor-pointer"
            >
              Add Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
