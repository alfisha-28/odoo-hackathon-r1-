import { CheckSquare, Square } from 'lucide-react';

export default function AuditChecklist({ items = [], onToggle }) {
  if (items.length === 0) {
    return <span className="text-xs font-bold text-[#6B7280]">No checklist items configured.</span>;
  }

  return (
    <div className="flex flex-col gap-2.5 w-full select-none text-left">
      {items.map((item) => {
        const isCompleted = item.completed;
        const Icon = isCompleted ? CheckSquare : Square;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onToggle && onToggle(item.id)}
            disabled={!onToggle}
            className={`flex items-center gap-3 p-3.5 border rounded-xl text-xs font-black transition-all text-left
              ${isCompleted
                ? 'border-[#22C55E]/30 bg-[#EEFDF3]/40 text-[#16A34A]'
                : 'border-[#E5E7EB] bg-white text-[#475569] hover:border-[#7C3AED]'
              }
              ${onToggle ? 'cursor-pointer' : 'cursor-default'}
            `}
          >
            <Icon
              className={`w-4.5 h-4.5 flex-shrink-0
                ${isCompleted ? 'text-[#16A34A]' : 'text-[#9CA3AF]'}
              `}
            />
            <span className={isCompleted ? 'line-through opacity-85' : ''}>{item.task}</span>
          </button>
        );
      })}
    </div>
  );
}
