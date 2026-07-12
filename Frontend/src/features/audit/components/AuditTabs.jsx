export default function AuditTabs({ tabs = [], activeTab, onChange }) {
  return (
    <div className="flex border-b border-[#E5E7EB] w-full overflow-x-auto no-scrollbar select-none gap-2">
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`py-3 px-4 text-xs font-black transition-all border-b-2 whitespace-nowrap cursor-pointer -mb-[2px]
              ${isActive
                ? 'border-[#7C3AED] text-[#7C3AED]'
                : 'border-transparent text-[#6B7280] hover:text-[#475569]'
              }
            `}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
