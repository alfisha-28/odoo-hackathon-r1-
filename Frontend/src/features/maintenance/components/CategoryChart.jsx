export default function CategoryChart({ categories = [] }) {
  // Find maximum value to compute relative widths
  const maxValue = categories.reduce((max, cat) => (cat.value > max ? cat.value : max), 1) || 1;

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm flex flex-col gap-4 w-full select-none text-left">
      <h3 className="text-xs font-black text-[#111827] uppercase tracking-wider">
        Top Issue Categories
      </h3>

      {/* Progress Bars List */}
      <div className="flex flex-col gap-3.5 py-1">
        {categories.map((cat, idx) => {
          const widthPercent = (cat.value / maxValue) * 100;
          return (
            <div key={idx} className="flex flex-col gap-1.5 w-full">
              {/* Category Name & Count */}
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-[#475569]">{cat.name}</span>
                <span className="text-[#111827] font-black">{cat.value}</span>
              </div>

              {/* Progress Bar Track */}
              <div className="w-full h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#7C3AED] rounded-full transition-all duration-500"
                  style={{ width: `${widthPercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-[#F3F4F6] w-full" />

      {/* Footer Link */}
      <button
        onClick={() => alert('Redirect to All Categories report')}
        className="text-[11px] font-black text-[#7C3AED] hover:text-[#6D28D9] transition-colors cursor-pointer self-center"
      >
        View All Categories →
      </button>
    </div>
  );
}
