import { cn } from '../../utils/cn';

export default function Checkbox({
  id,
  checked,
  onChange,
  label,
  className = '',
  ...props
}) {
  return (
    <label
      htmlFor={id}
      className={cn("inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 select-none cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 transition-colors", className)}
    >
      <div className="relative flex items-center">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="peer sr-only"
          {...props}
        />
        <div className={cn(
          "w-4.5 h-4.5 rounded-md border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 transition-all duration-200",
          "peer-checked:bg-primary-600 peer-checked:border-primary-600",
          "peer-focus:ring-2 peer-focus:ring-primary-500/30",
          "flex items-center justify-center text-white"
        )}>
          <svg
            className="w-3.5 h-3.5 stroke-current stroke-[3] fill-none opacity-0 peer-checked:opacity-100 transition-opacity"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
      </div>
      {label && <span className="text-xs font-semibold select-none">{label}</span>}
    </label>
  );
}
